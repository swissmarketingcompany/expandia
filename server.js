// Load environment variables (only shows logs in development)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const app = express();

// Get port from environment variable or default to 6161 for dev
const PORT = process.env.PORT || 6161;

// Rate limiting for contact form - more relaxed
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Increased from 5 to 20 contact form submissions per 15 minutes
    message: {
        success: false,
        error: 'Too many contact form submissions. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General rate limiting - much more relaxed
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 1000 : 2000, // Increased from 100 to 1000 for production
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting disabled for production by default
// Uncomment the lines below if you want to re-enable rate limiting
// if (process.env.NODE_ENV === 'production' && process.env.ENABLE_RATE_LIMIT === 'true') {
//     app.use(generalLimiter);
// }

// Security & middleware
app.set('trust proxy', 1); // needed for secure cookies & correct IPs behind proxies

// Helmet for secure HTTP headers with HSTS
app.use(helmet({
    contentSecurityPolicy: false, // keep simple; CSP can be added later if needed
    crossOriginEmbedderPolicy: false,
    hsts: process.env.NODE_ENV === 'production' ? {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    } : false // Only enable HSTS in production
}));

// HTTPS redirect and domain normalization (production only)
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        const proto = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers.host || '';

        // Redirect HTTP to HTTPS
        if (proto !== 'https') {
            return res.redirect(301, `https://${host}${req.originalUrl}`);
        }

        // Redirect non-www to www (canonical domain)
        if (host && host.startsWith('goexpandia.com') && !host.startsWith('www.')) {
            return res.redirect(301, `https://www.${host}${req.originalUrl}`);
        }
    }
    next();
});

app.use(cookieParser());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : true,
    credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static asset caching for dist assets (must come BEFORE general static)
app.use('/dist', express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, filePath) => {
        // Cache bundled assets aggressively; HTML is served separately without this cache
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
}));

// Path-specific 301 redirects for consolidated content
const redirectMap = {
    '/blog/cross-channel-lead-generation-complete-guide.html': '/blog/cross-channel-lead-generation-guide.html',
    '/blog/pipeline-generation-strategies-guide.html': '/blog/pipeline-generation-complete-guide.html'
};

app.use((req, res, next) => {
    const target = redirectMap[req.path];
    if (target) {
        return res.redirect(301, target);
    }
    next();
});

// Serve static files from the current directory (no aggressive cache for HTML)
app.use(express.static(__dirname));

// Email configuration (Resend)
const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Nodemailer fallback (Gmail)
function createEmailTransporter() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) return null;
    try {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass }
        });
    } catch (e) {
        console.error('Failed to create nodemailer transporter:', e);
        return null;
    }
}

function formatFromAddress() {
    const envFrom = process.env.FROM_EMAIL || '';
    if (!envFrom) return 'Expandia <no-reply@goexpandia.com>';
    // If already contains a display-name format, return as-is
    if (envFrom.includes('<') && envFrom.includes('>')) return envFrom;
    return `Expandia <${envFrom}>`;
}

// Input validation rules
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .escape()
        .withMessage('Name must be between 2 and 100 characters'),
    body('company')
        .trim()
        .isLength({ min: 2, max: 100 })
        .escape()
        .withMessage('Company name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    body('service')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .escape(),
    body('message')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .escape()
        .withMessage('Message cannot exceed 2000 characters'),
    body('math')
        .trim()
        .equals('61')
        .withMessage('Human verification failed')
];

// Contact form submission endpoint
// Contact form rate limiting disabled by default
// Uncomment the line below if you want to re-enable contact rate limiting
// const contactMiddleware = process.env.ENABLE_RATE_LIMIT === 'true' ? [contactLimiter] : [];

app.post('https://expandia-contact-form.omaycompany.workers.dev/', contactValidation, async (req, res) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Please check your input: ' + errors.array().map(err => err.msg).join(', ')
            });
        }

        const { name, company, email, service, message, website } = req.body;

        // Honeypot check (if 'website' field is filled, it's likely a bot)
        if (website) {
            console.log(`🤖 Bot submission blocked from IP: ${req.ip}`);
            return res.status(400).json({
                success: false,
                error: 'Submission failed. Please try again.'
            });
        }

        // Create email content
        const emailContent = `
        New Contact Form Submission from Expandia Website

        Name: ${name}
        Company: ${company}
        Email: ${email}
        Service Interest: ${service || 'Not specified'}

        Message:
        ${message || 'No additional message provided'}

        ---
        Submitted from: ${req.get('host')}
        User Agent: ${req.get('user-agent')}
        IP: ${req.ip}
        Time: ${new Date().toISOString()}
        `;

        let sentVia = null;
        // Try Resend first
        if (resend) {
            try {
                const result = await resend.emails.send({
                    from: formatFromAddress(),
                    to: process.env.CONTACT_TO_EMAIL || 'hello@goexpandia.com',
                    subject: `New Contact Form Submission from ${name} (${company})`,
                    text: emailContent,
                    reply_to: email
                });
                if (result && result.id) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Resend contact email sent. id=', result.id);
                    }
                    sentVia = 'resend';
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        console.warn('Resend returned no id for contact email. result=', result);
                    }
                }
            } catch (e) {
                console.error('Resend contact send error:', e);
            }
        }

        // Fallback to Nodemailer (Gmail) if Resend failed or not configured
        if (!sentVia) {
            const transporter = createEmailTransporter();
            if (transporter) {
                try {
                    await transporter.sendMail({
                        from: formatFromAddress(),
                        to: process.env.CONTACT_TO_EMAIL || 'hello@goexpandia.com',
                        subject: `New Contact Form Submission from ${name} (${company})`,
                        text: emailContent,
                        replyTo: email
                    });
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Nodemailer (Gmail) contact email sent.');
                    }
                    sentVia = 'gmail';
                } catch (e) {
                    console.error('Nodemailer contact send error:', e);
                }
            }
        }

        if (!sentVia) {
            console.log('=== NEW CONTACT FORM SUBMISSION (no email sent) ===');
            console.log(emailContent);
            console.log('=====================================');
        }

        res.json({
            success: true,
            message: 'Thank you for your submission! We\'ll get back to you within 24 hours.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error. Please try again later or contact us directly at hello@goexpandia.com'
        });
    }
});

// Newsletter subscribe endpoint
app.post('/api/subscribe', [
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
    body('website').optional().trim().isLength({ max: 0 }).withMessage(''), // honeypot
    body('math').trim().equals('61').withMessage('Human verification failed'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: 'Invalid input' });
        }
        const { email, website } = req.body;
        if (website) {
            return res.status(400).json({ success: false, error: 'Invalid submission' });
        }

        const text = `New newsletter subscription\n\nEmail: ${email}\nTime: ${new Date().toISOString()}\nUser Agent: ${req.get('user-agent')}`;

        let sentVia = null;
        if (resend) {
            try {
                const result = await resend.emails.send({
                    from: formatFromAddress(),
                    to: process.env.SUBSCRIBE_TO_EMAIL || 'hello@goexpandia.com',
                    subject: 'New Newsletter Subscription',
                    text
                });
                if (result && result.id) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Resend subscribe email sent. id=', result.id);
                    }
                    sentVia = 'resend';
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        console.warn('Resend returned no id for subscribe email. result=', result);
                    }
                }
            } catch (e) {
                console.error('Resend subscribe send error:', e);
            }
        }

        if (!sentVia) {
            const transporter = createEmailTransporter();
            if (transporter) {
                try {
                    await transporter.sendMail({
                        from: formatFromAddress(),
                        to: process.env.SUBSCRIBE_TO_EMAIL || 'hello@goexpandia.com',
                        subject: 'New Newsletter Subscription',
                        text
                    });
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Nodemailer (Gmail) subscribe email sent.');
                    }
                    sentVia = 'gmail';
                } catch (e) {
                    console.error('Nodemailer subscribe send error:', e);
                }
            }
        }

        if (!sentVia) {
            console.log('=== NEW NEWSLETTER SUBSCRIPTION (no email sent) ===');
            console.log(text);
            console.log('====================================');
        }
        res.json({ success: true, message: 'Subscribed. Check your inbox for confirmation shortly.' });
    } catch (err) {
        console.error('Subscribe error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Global error handler - sanitize errors to prevent key exposure
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Don't expose sensitive details to client
    const message = err.message || 'Internal Server Error';
    const sanitized = message.includes('GEMINI_API_KEY') || message.includes('AIzaSy')
        ? 'AI service error'
        : message;

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : sanitized
    });
});

// Serve sitemap and robots.txt
app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Handle all routes by serving the appropriate HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});





// 301 Redirects for old AI Solutions pages to new Sales Protection Services
app.get('/ai-solutions.html', (req, res) => {
    res.redirect(301, '/sales-protection-services.html');
});

app.get('/de/ai-solutions.html', (req, res) => {
    res.redirect(301, '/de/schutzdienstleistungen.html');
});



// Handle German routes
app.get('/de', (req, res) => {
    res.sendFile(path.join(__dirname, 'de', 'index.html'));
});

app.get('/de/', (req, res) => {
    res.sendFile(path.join(__dirname, 'de', 'index.html'));
});

app.get('/de/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(__dirname, 'de', page), (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, 'de', 'index.html'));
            }
        });
    } else {
        res.sendFile(path.join(__dirname, 'de', page + '.html'), (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, 'de', 'index.html'));
            }
        });
    }
});

// Redirects for common 404 patterns
app.get('/blog.html', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/blog', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle tag pages (redirect to blog) - more specific routes first
app.get('/tag/:tag/feed/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/tag/:tag/feed', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/tag/:tag/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/tag/:tag', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle author pages (redirect to blog)
app.get('/author/:author', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/author/:author/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle category pages (redirect to blog)
app.get('/category/:category', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/category/:category/:subcategory', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle feed pages
app.get('/:path/feed', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/:path/feed/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle trailing slashes for common pages
app.get('/contact/', (req, res) => {
    res.redirect(301, '/contact.html');
});

app.get('/about/', (req, res) => {
    res.redirect(301, '/about.html');
});

app.get('/faq/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/privacy-policy/', (req, res) => {
    res.redirect(301, '/privacy-policy.html');
});

app.get('/terms-of-use/', (req, res) => {
    res.redirect(301, '/terms-of-service.html');
});

app.get('/case-studies/', (req, res) => {
    res.redirect(301, '/case-studies.html');
});

app.get('/insights/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/careers/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/subscribe/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/schedule-a-free-demo/', (req, res) => {
    res.redirect(301, '/contact.html');
});

// Handle old blog post URLs that don't exist
app.get('/blog/lead-scoring-software-complete-guide.html', (req, res) => {
    res.redirect(301, '/blog/lead-scoring-saas-complete-guide.html');
});

app.get('/blog/social-proof-network-effects-enterprise-buying.ht', (req, res) => {
    res.redirect(301, '/blog/index.html');
});



// Handle potential old blog post paths
app.get('/potential-areas-for-expandias-sustainable-impact', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/potential-areas-for-expandias-sustainable-impact/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle PDFs that don't exist (redirect to blog)
app.get('/pdfs/:filename', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle non-existent pages with template variables (must come before catch-all)
app.get('/:path/:page', (req, res, next) => {
    const page = req.params.page;
    // Check if it contains template variables
    if (page && (page.includes('{{') || page.includes('BASE_PATH') || page.includes('BLOG_URL') ||
        page.includes('CONTACT_URL') || page.includes('ABOUT_URL') || page.includes('SOLUTIONS_URL') ||
        page.includes('CASE_STUDIES_URL') || page.includes('VISION_MISSION_PAGE') ||
        page.includes('ETHICAL_PRINCIPLES_PAGE') || page.includes('MARKET_ACCELERATOR_PAGE') ||
        page.includes('MARKET_FOUNDATION_PAGE') || page.includes('FRACTIONAL_BIZDEV_PAGE'))) {
        return res.redirect(301, '/');
    }
    // Let it fall through to the catch-all handler
    next();
});

// Handle pages that should exist but are accessed incorrectly


app.get('/unternehmens-digitale-geschenke.html', (req, res) => {
    res.redirect(301, '/de/unternehmens-digitale-geschenke.html');
});

app.get('/teilzeit-bizdev-team.html', (req, res) => {
    res.redirect(301, '/de/teilzeit-bizdev-team.html');
});

app.get('/sales-protection-services.html', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/schutzdienstleistungen.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/markt-grundlagen-programm.html', (req, res) => {
    res.redirect(301, '/de/markt-grundlagen-programm.html');
});

// Handle old blog post URLs
app.get('/understanding-the-difference-between-distributors-and-dealers/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/understanding-behavioral-biases-and-making-rational-choices/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/understanding-behavioral-biases-and-making-rational-choices/feed/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/building-a-b2b-cold-outreach-funnel-for-global-growth-in-2025/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/rebuilding-ukraine-opportunities-and-challenges-for-international-businesses/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/rebuilding-syria-a-detailed-roadmap-for-international-businesses-post-conflict/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/expanding-american-window-films-reach-with-strategic-distribution/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/expanding-llumar-window-films-reach-with-strategic-distribution/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/global-supply-chain-resilience-building-resilient-global-supply-chains-strategies-for-international-businesses-in-2025/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/understanding-distributors-and-how-they-can-rapidly-grow-your-company-in-10-step/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/effective-distributor-management/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/sales-network-building/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/sales-network-solutions/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/sales-network-solutions/sales-network-management/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/client-introduction-services/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/cold-email-management/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/cold-calling-management/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/spam-checker/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/cost-estimator.html', (req, res) => {
    res.redirect(301, '/contact.html');
});

app.get('/our-commitments/', (req, res) => {
    res.redirect(301, '/about.html');
});

app.get('/our-people/:name', (req, res) => {
    res.redirect(301, '/about.html');
});

app.get('/co-founder-country-coordinator-switzerland/', (req, res) => {
    res.redirect(301, '/about.html');
});

app.get('/media-mentions/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/kronatech-industries-dna-report/', (req, res) => {
    res.redirect(301, '/case-studies.html');
});

app.get('/trumps-legacy-in-international-trade/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/the-sales-sidekick-youve-been-waiting-for/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/the-sales-sidekick-youve-been-waiting-for-2/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/re-design-your-sales-tools/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/case-studies/:name', (req, res) => {
    res.redirect(301, '/case-studies.html');
});

app.get('/careers/jobs-listing/', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/downloads/:filename', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/:page_id', (req, res, next) => {
    const pageId = req.params.page_id;
    // Handle numeric page IDs (WordPress-style)
    if (/^\d+$/.test(pageId)) {
        return res.redirect(301, '/');
    }
    // Let it fall through
    next();
});

// Handle malformed URLs with spaces or special characters
app.get('/tr/b2b-Potansiyel Müşteri-generation-ajansi.html', (req, res) => {
    res.redirect(301, '/tr/b2b-lead-generation-ajansi.html');
});

app.get('/tr/Potansiyel Müşteri-generation-ajansi.html', (req, res) => {
    res.redirect(301, '/tr/b2b-lead-generation-ajansi.html');
});

app.get('/tr/Potansiyel Müşteri-generation-hizmeti.html', (req, res) => {
    res.redirect(301, '/tr/lead-generation-hizmeti.html');
});

app.get('/tr/Potansiyel Müşteri-generation-ajansi-istanbul.html', (req, res) => {
    res.redirect(301, '/tr/lead-generation-ajansi-istanbul.html');
});

// Handle template variable URLs
app.get('/blog/{{TURKISH_SERVICES_PATH}}etik-ilkelerimiz.html', (req, res) => {
    res.redirect(301, '/tr/etik-ilkelerimiz.html');
});

app.get('/blog/{{TURKISH_SERVICES_PATH}}vizyonumuz-misyonumuz.html', (req, res) => {
    res.redirect(301, '/tr/vizyon-misyon.html');
});

app.get('/de/tr/etik-ilkelerimiz.html', (req, res) => {
    res.redirect(301, '/tr/etik-ilkelerimiz.html');
});

app.get('/de/tr/vizyonumuz-misyonumuz.html', (req, res) => {
    res.redirect(301, '/tr/vizyon-misyon.html');
});

app.get('/de/de/contact.html', (req, res) => {
    res.redirect(301, '/de/contact.html');
});

// Handle URLs with template variables in path
app.get('/tr/{{BLOG_URL}}', (req, res) => {
    res.redirect(301, '/tr/blog/index.html');
});

app.get('/tr/{{ABOUT_URL}}', (req, res) => {
    res.redirect(301, '/tr/about.html');
});

app.get('/tr/{{CONTACT_URL}}', (req, res) => {
    res.redirect(301, '/tr/contact.html');
});

app.get('/tr/{{SOLUTIONS_URL}}', (req, res) => {
    res.redirect(301, '/tr/b2b-lead-generation-ajansi.html');
});

app.get('/tr/{{CASE_STUDIES_URL}}', (req, res) => {
    res.redirect(301, '/tr/case-studies.html');
});

// Handle other malformed URLs
app.get('/tr', (req, res) => {
    res.redirect(301, '/tr/index.html');
});

app.get('/Çözüms.html', (req, res) => {
    res.redirect(301, '/tr/b2b-lead-generation-ajansi.html');
});

app.get('/İletişim.html', (req, res) => {
    res.redirect(301, '/tr/contact.html');
});

app.get('/gizlilik-politikasi.html', (req, res) => {
    res.redirect(301, '/tr/gizlilik-politikasi.html');
});

app.get('/tr/cerez-politikasi.html', (req, res) => {
    res.redirect(301, '/tr/gizlilik-politikasi.html');
});

// Handle solution pages that don't exist
app.get('/solution-:name', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/ai-solutions.html', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/competitor-analysis.html', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/how-we-work.html', (req, res) => {
    res.redirect(301, '/about.html');
});

app.get('/resources.html', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/roi-calculator.html', (req, res) => {
    res.redirect(301, '/contact.html');
});

// Handle search URLs
app.get('/?s=:query', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

app.get('/?trk=:query', (req, res) => {
    res.redirect(301, '/');
});

app.get('/?page_id=:id', (req, res) => {
    res.redirect(301, '/');
});

// Handle downloads that don't exist
app.get('/downloads/:filename', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle non-existent service pages
app.get('/outbound-pazarlama-ajansi.html', (req, res) => {
    res.redirect(301, '/tr/outbound-pazarlama-ajansi.html');
});

app.get('/lead-generation-hizmeti.html', (req, res) => {
    res.redirect(301, '/tr/lead-generation-hizmeti.html');
});

app.get('/satis-gelistirme-ajansi.html', (req, res) => {
    res.redirect(301, '/tr/satis-gelistirme-ajansi.html');
});

app.get('/dis-kaynakli-satis-ekibi.html', (req, res) => {
    res.redirect(301, '/tr/dis-kaynakli-satis-ekibi.html');
});

app.get('/potansiyel-musteri-bulma-ajansi.html', (req, res) => {
    res.redirect(301, '/tr/potansiyel-musteri-bulma-ajansi.html');
});

app.get('/randevu-ayarlama-hizmeti.html', (req, res) => {
    res.redirect(301, '/tr/randevu-ayarlama-hizmeti.html');
});

app.get('/soguk-e-posta-ajansi.html', (req, res) => {
    res.redirect(301, '/tr/soguk-e-posta-ajansi.html');
});

app.get('/schutzdienstleistungen.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/tr/schutzdienstleistungen.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/tr/sales-protection-services.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/tr/terms-of-service.html', (req, res) => {
    res.redirect(301, '/tr/gizlilik-politikasi.html');
});

// Handle non-existent German service pages
app.get('/de/inbound-lead-generation.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/outbound-lead-generation.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/prospect-finding-service.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/distributor-finding.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/email-automation.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/europe-market-entry.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/international-market-entry.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/outsourced-sales-team-service.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/overseas-sales-consulting.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/sales-protection-services.html', (req, res) => {
    res.redirect(301, '/de/solutions.html');
});

app.get('/de/cookie-policy.html', (req, res) => {
    res.redirect(301, '/de/privacy-policy.html');
});

app.get('/de/privacy-policy.html', (req, res) => {
    res.redirect(301, '/de/privacy-policy.html');
});

app.get('/de/terms-of-service.html', (req, res) => {
    res.redirect(301, '/de/terms-of-service.html');
});

// Handle blog posts that should exist but might have issues
app.get('/blog.html', (req, res) => {
    res.redirect(301, '/blog/index.html');
});

// Handle 404s by redirecting to home page
app.get('*', (req, res) => {
    // Serve files directly when present
    let requestedFile = path.join(__dirname, req.path);

    // If path doesn't end with .html and no file exists, try adding .html
    if (!req.path.endsWith('.html')) {
        const htmlFile = path.join(__dirname, req.path + '.html');
        try {
            // Check if .html file exists
            if (require('fs').existsSync(htmlFile)) {
                requestedFile = htmlFile;
            }
        } catch (e) {
            // Continue with original path
        }
    }

    res.sendFile(requestedFile, (err) => {
        if (err) {
            // Return proper 404 status with a friendly page
            res.status(404).sendFile(path.join(__dirname, '404.html'), (err2) => {
                if (err2) {
                    // If 404.html also fails, send a simple text response
                    res.status(404).send('Page not found');
                }
            });
        }
    });
});

app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Expandia website is running on port ${PORT}`);
        console.log(`Visit: http://localhost:${PORT}`);
    } else {
        console.log(`Expandia website started on port ${PORT}`);
    }
});
