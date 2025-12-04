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

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: true, // Allow ALL origins (all domains work)
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
    if (!envFrom) return 'Expandia <no-reply@expandia.ch>';
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

app.post('/api/contact', contactValidation, async (req, res) => {
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
                    to: process.env.CONTACT_TO_EMAIL || 'hello@expandia.ch',
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
                        to: process.env.CONTACT_TO_EMAIL || 'hello@expandia.ch',
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
            error: 'Server error. Please try again later or contact us directly at hello@expandia.ch'
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
                    to: process.env.SUBSCRIBE_TO_EMAIL || 'hello@expandia.ch',
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
                        to: process.env.SUBSCRIBE_TO_EMAIL || 'hello@expandia.ch',
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

// Handle Turkish routes
app.get('/tr', (req, res) => {
    res.sendFile(path.join(__dirname, 'tr', 'index.html'));
});

app.get('/tr/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tr', 'index.html'));
});

app.get('/tr/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(__dirname, 'tr', page), (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, 'tr', 'index.html'));
            }
        });
    } else {
        res.sendFile(path.join(__dirname, 'tr', page + '.html'), (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, 'tr', 'index.html'));
            }
        });
    }
});

// Turkish service alias redirects (EN slugs -> TR slugs)
app.get('/tr/lead-generation-service.html', (req, res) => {
    res.redirect(301, '/tr/lead-generation-hizmeti.html');
});
app.get('/tr/prospect-finding-service.html', (req, res) => {
    res.redirect(301, '/tr/potansiyel-musteri-bulma-ajansi.html');
});
app.get('/tr/sales-development-agency.html', (req, res) => {
    res.redirect(301, '/tr/satis-gelistirme-ajansi.html');
});
app.get('/tr/appointment-setting-service.html', (req, res) => {
    res.redirect(301, '/tr/randevu-ayarlama-hizmeti.html');
});
app.get('/tr/outsourced-sales-team-service.html', (req, res) => {
    res.redirect(301, '/tr/dis-kaynakli-satis-ekibi.html');
});
app.get('/tr/outbound-marketing-agency.html', (req, res) => {
    res.redirect(301, '/tr/outbound-pazarlama-ajansi.html');
});
app.get('/tr/cold-email-agency.html', (req, res) => {
    res.redirect(301, '/tr/soguk-e-posta-ajansi.html');
});

// 301 Redirects for old AI Solutions pages to new Sales Protection Services
app.get('/ai-solutions.html', (req, res) => {
    res.redirect(301, '/sales-protection-services.html');
});

app.get('/de/ai-solutions.html', (req, res) => {
    res.redirect(301, '/de/schutzdienstleistungen.html');
});

app.get('/tr/ai-solutions.html', (req, res) => {
    res.redirect(301, '/tr/satis-koruma-hizmetleri.html');
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
