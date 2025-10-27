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
const crypto = require('crypto'); // Added for session token generation

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

// Admin API rate limiting - STRICT to prevent brute force
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 attempts per 15 minutes
    message: {
        success: false,
        error: 'Too many admin attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }, // Fix for Heroku proxy
    keyGenerator: (req) => {
        // Use IP address for rate limiting key
        return req.ip || req.connection.remoteAddress;
    }
});

// API call rate limiting - prevent abuse of Gemini API
const geminiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 generation requests per hour per user/IP
    message: {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }, // Fix for Heroku proxy
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
// OFFER SYSTEM ROUTES
// ==========================================
const OfferSystem = require('./offer-system');
const offerSystem = new OfferSystem(path.join(__dirname, 'offers'));

const GeminiService = require('./gemini-service');
const geminiService = new GeminiService(process.env.GEMINI_API_KEY);

// System prompt storage (in memory for now, can be moved to file)
let systemPromptStorage = null;
let masterTemplateStorage = null;

// Job storage for async generation
const generationJobs = new Map(); // jobId -> { status, html, error, progress }

// Admin session management
const adminSessions = new Map(); // Store: sessionToken -> { timestamp, ip }

function generateAdminToken() {
    return crypto.randomBytes(32).toString('hex');
}

function createAdminSession(ip) {
    const token = generateAdminToken();
    adminSessions.set(token, {
        timestamp: Date.now(),
        ip: ip,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });
    return token;
}

function validateAdminToken(token, ip) {
    const session = adminSessions.get(token);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
        adminSessions.delete(token);
        return false;
    }
    // Optional: Validate IP matches for additional security
    return true;
}

// Cleanup expired sessions every hour
setInterval(() => {
    const now = Date.now();
    for (const [token, session] of adminSessions.entries()) {
        if (now > session.expiresAt) {
            adminSessions.delete(token);
        }
    }
}, 60 * 60 * 1000);

// Admin password verification - returns secure token
app.post('/api/admin/verify', adminLimiter, (req, res) => {
    const { password } = req.body;
    
    if (offerSystem.verifyAdminPassword(password)) {
        const token = createAdminSession(req.ip);
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'strict'
        });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

// Middleware to verify admin access - uses secure token
const requireAdmin = (req, res, next) => {
    const token = req.cookies.adminToken || req.headers['x-admin-token'];
    
    if (!token || !validateAdminToken(token, req.ip)) {
        return res.status(401).json({ error: 'Unauthorized - Invalid or expired session' });
    }
    
    next();
};

// Create new offer
app.post('/api/admin/create-offer', adminLimiter, requireAdmin, async (req, res) => {
    try {
        const result = await offerSystem.createOffer(req.body);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all offers (admin)
app.get('/api/admin/offers', requireAdmin, async (req, res) => {
    try {
        const offers = await offerSystem.getAllOffers();
        res.json(offers);
    } catch (error) {
        console.error('Error getting offers:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single offer (admin)
app.get('/api/admin/offer/:id', requireAdmin, async (req, res) => {
    try {
        const offer = await offerSystem.getOfferForAdmin(req.params.id);
        res.json(offer);
    } catch (error) {
        res.status(404).json({ error: 'Offer not found' });
    }
});

// Update offer
app.put('/api/admin/update-offer/:id', requireAdmin, async (req, res) => {
    try {
        const result = await offerSystem.updateOffer(req.params.id, req.body);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Error updating offer:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete offer
app.delete('/api/admin/delete-offer/:id', requireAdmin, async (req, res) => {
    try {
        await offerSystem.deleteOffer(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(404).json({ error: 'Offer not found' });
    }
});

// Generate offer with AI
// Real-time streaming offer generation with SSE
app.post('/api/admin/generate-offer', geminiLimiter, requireAdmin, async (req, res) => {
    try {
        const { clientName, offerTitle, prompt } = req.body;
        
        if (!clientName || !offerTitle || !prompt) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Setup SSE - respond immediately to avoid Heroku timeout
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
        
        // Send initial message immediately
        res.write('data: ' + JSON.stringify({ type: 'status', message: 'Connected. Starting AI generation...' }) + '\n\n');
        
        // Keep connection alive with heartbeat every 15 seconds
        const heartbeat = setInterval(() => {
            res.write('data: ' + JSON.stringify({ type: 'heartbeat' }) + '\n\n');
        }, 15000);
        
        // Run AI generation asynchronously
        (async () => {
            try {
                const customSystemPrompt = systemPromptStorage || getDefaultSystemPrompt();
                
                res.write('data: ' + JSON.stringify({ type: 'status', message: 'AI is thinking... This may take 1-2 minutes.' }) + '\n\n');
                
                const html = await geminiService.generateOfferWithPrompt(
                    customSystemPrompt,
                    prompt,
                    clientName,
                    offerTitle
                );
                
                // Send the complete HTML
                res.write('data: ' + JSON.stringify({ type: 'complete', html: html }) + '\n\n');
                clearInterval(heartbeat);
                res.end();
                
            } catch (error) {
                console.error('Error generating offer:', error);
                res.write('data: ' + JSON.stringify({ type: 'error', error: error.message }) + '\n\n');
                clearInterval(heartbeat);
                res.end();
            }
        })();
        
        // Clean up on client disconnect
        req.on('close', () => {
            clearInterval(heartbeat);
        });
        
    } catch (error) {
        console.error('Error starting generation:', error);
        res.status(500).json({ error: error.message });
    }
});

// Refine offer with AI (SSE streaming to avoid timeout)
app.post('/api/admin/refine-offer', geminiLimiter, requireAdmin, async (req, res) => {
    try {
        const { html, prompt, clientName, offerTitle } = req.body;
        
        if (!html || !prompt || !clientName || !offerTitle) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Set up SSE
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        // Send heartbeat every 10 seconds to keep connection alive
        const heartbeat = setInterval(() => {
            res.write(': heartbeat\n\n');
        }, 10000);

        try {
            // Start refinement
            res.write('data: ' + JSON.stringify({ type: 'status', message: 'Starting AI refinement...' }) + '\n\n');

            const customSystemPrompt = systemPromptStorage || getDefaultSystemPrompt();
            const refinedHtml = await geminiService.refineOfferWithPrompt(customSystemPrompt, html, prompt, clientName, offerTitle);
            
            // Send success
            res.write('data: ' + JSON.stringify({ type: 'complete', html: refinedHtml }) + '\n\n');
            res.write('data: [DONE]\n\n');
            
        } catch (error) {
            console.error('Error during refinement:', error);
            res.write('data: ' + JSON.stringify({ type: 'error', message: error.message }) + '\n\n');
        } finally {
            clearInterval(heartbeat);
            res.end();
        }
        
    } catch (error) {
        console.error('Error starting refinement:', error);
        res.status(500).json({ error: error.message });
    }
});

// Client authentication for offer
app.post('/api/proposals/:id/auth', async (req, res) => {
    try {
        const { password } = req.body;
        const sessionId = await offerSystem.authenticateClient(req.params.id, password);
        
        if (sessionId) {
            res.cookie('offer_session', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000 // 1 hour
            });
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, error: 'Invalid password' });
        }
    } catch (error) {
        res.status(404).json({ success: false, error: 'Offer not found' });
    }
});

// Get offer content for client (requires authentication)
app.get('/api/proposals/:id/content', async (req, res) => {
    try {
        const sessionId = req.cookies.offer_session;
        
        if (!sessionId || !offerSystem.verifyClientSession(sessionId, req.params.id)) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const offer = await offerSystem.getOfferForClient(req.params.id);
        res.json(offer);
    } catch (error) {
        res.status(404).json({ error: 'Offer not found' });
    }
});

// Serve proposal page
app.get('/proposals/:id', async (req, res) => {
    try {
        // Check if offer exists
        await offerSystem.getOffer(req.params.id);
        
        // Serve the proposal viewer page
        res.sendFile(path.join(__dirname, 'proposal-viewer.html'));
    } catch (error) {
        res.status(404).sendFile(path.join(__dirname, '404.html'));
    }
});

// ==========================================
// END OFFER SYSTEM ROUTES
// ==========================================

// Get system prompt
app.get('/api/admin/system-prompt', requireAdmin, (req, res) => {
    res.json({ prompt: systemPromptStorage || getDefaultSystemPrompt() });
});

// Save system prompt
app.post('/api/admin/system-prompt', requireAdmin, async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ error: 'Prompt cannot be empty' });
        }
        systemPromptStorage = prompt;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get master template
app.get('/api/admin/master-template', requireAdmin, (req, res) => {
    res.json({ template: masterTemplateStorage || getDefaultMasterTemplate() });
});

// Save master template
app.post('/api/admin/master-template', requireAdmin, async (req, res) => {
    try {
        const { template } = req.body;
        if (!template || !template.trim()) {
            return res.status(400).json({ error: 'Template cannot be empty' });
        }
        masterTemplateStorage = template;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function getDefaultSystemPrompt() {
    return `You are a proposal designer for Expandia, a business development and sales as a service company.

COMPANY PROFILE:
- Name: Expandia (expandia.ch)
- Founded: 2013, now US-based (Delaware)
- Team: 6 people, distributed globally
- Mission: Help companies grow internationally through strategic business relationships and lead generation

OUR PHILOSOPHY:
- Direct, no-bullshit communication. Avoid jargon and wordplay
- Simplicity first. First-principles thinking
- We never overpromise. We underpromise and overdeliver
- Value calculation is crucial: Show 4x+ ROI, not just 2-3x
- Trust is earned through transparency and integrity
- Every proposal must show clear, quantifiable value

SERVICES (pick relevant ones):
- B2B Lead Generation & Outbound Sales
- Sales as a Service (SaaS model)
- Business Development as a Service
- Market Entry Strategy
- Appointment Setting
- Lead Management & CRM
- Custom Outreach Campaigns
- Monthly retainer or project-based

DESIGN REQUIREMENTS:
- Use Tailwind CSS
- Colors: #e0a82e (gold accent), #18182f (dark navy background)
- Clean, professional, modern
- Print-friendly
- Include: Executive summary, services/packages, pricing, timeline, ROI metrics, success indicators
- Always show VALUE calculation, not just deliverables
- Include concrete examples when possible

TONE & STYLE:
- Professional but conversational
- Direct and honest
- Avoid marketing fluff
- Focus on results and metrics
- Show respect for client's time
- Emphasize partnership approach
- Realistic timelines and expectations

PROPOSAL STRUCTURE (adapt as needed):
1. Header: Expandia logo + Client name + Date
2. Executive Summary: Problem → Solution → Value
3. Services/Packages: Clear options with descriptions
4. Pricing: Transparent, with value breakdown
5. Timeline: Realistic phases
6. Value Metrics: What success looks like (meetings booked, leads generated, revenue impact, etc.)
7. Add-ons: Optional services
8. Terms: Payment terms, process, SLAs
9. Footer: Contact info + company credentials

PAYMENT TERMS (default unless specified):
- Monthly retainers: $2,500-$5,000+
- Project-based: Varies by scope
- Payment: 50% upfront, 50% at mid-term or upon delivery

KEY PRINCIPLES IN EVERY PROPOSAL:
1. Show the math: "If we generate 50 qualified leads and your close rate is 20%, that's 10 new clients"
2. Realistic: "We typically see X results in Y timeframe"
3. Transparent: "Here's exactly what we'll do and when"
4. Value-focused: "This is worth X to you because..."
5. Partnership tone: "We'll work together to..."

Generate ONLY valid HTML with no explanations.`;
}

function getDefaultMasterTemplate() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[CLIENT_NAME] | Expandia Proposal</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #f8fafc;
        }
        @media print {
            body {
                background: white;
                padding: 0;
                margin: 0;
            }
            header, footer, .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <!-- Header (Static) -->
    <header class="bg-[#18182f] text-white p-8 shadow-lg">
        <div class="container mx-auto max-w-5xl flex justify-between items-center">
            <div>
                <img src="/Expandia-main-logo-koyu-yesil.png" alt="Expandia" style="height: 50px; width: auto;">
                <p class="text-sm text-gray-300 mt-2">Business Development & Sales as a Service</p>
            </div>
            <div class="text-right">
                <p class="text-lg font-semibold">[CLIENT_NAME]</p>
                <p class="text-sm text-gray-300">Prepared: <span id="today-date"></span></p>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto max-w-5xl px-4 py-12">
        <!-- Title Section -->
        <div class="mb-12 pb-8 border-b-2 border-[#e0a82e]">
            <h1 class="text-4xl font-bold text-[#18182f] mb-2">[OFFER_TITLE]</h1>
            <p class="text-lg text-gray-600">A tailored growth strategy for [CLIENT_NAME]</p>
        </div>

        <!-- Executive Summary (AI will fill) -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold text-[#18182f] mb-6 pb-3 border-b-2 border-[#e0a82e]">Executive Summary</h2>
            <div class="bg-gray-50 p-8 rounded-lg border border-gray-200">
                [EXECUTIVE_SUMMARY]
            </div>
        </section>

        <!-- Services & Packages (AI will fill) -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold text-[#18182f] mb-6 pb-3 border-b-2 border-[#e0a82e]">Our Services & Packages</h2>
            <div class="space-y-8">
                [SERVICES_PACKAGES]
            </div>
        </section>

        <!-- Timeline (AI will fill) -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold text-[#18182f] mb-6 pb-3 border-b-2 border-[#e0a82e]">Timeline & Phases</h2>
            <div class="bg-gray-50 p-8 rounded-lg border border-gray-200">
                [TIMELINE]
            </div>
        </section>

        <!-- Value Metrics (AI will fill) -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold text-[#18182f] mb-6 pb-3 border-b-2 border-[#e0a82e]">Expected Results & Metrics</h2>
            <div class="bg-blue-50 p-8 rounded-lg border border-blue-200">
                [VALUE_METRICS]
            </div>
        </section>

        <!-- Terms & Conditions (AI will fill) -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold text-[#18182f] mb-6 pb-3 border-b-2 border-[#e0a82e]">Terms & Conditions</h2>
            <div class="bg-gray-50 p-8 rounded-lg border border-gray-200">
                [TERMS_CONDITIONS]
            </div>
        </section>

        <!-- Account Manager Section -->
        <section class="mb-12">
            <div class="bg-gradient-to-r from-[#18182f] to-[#2d2d4a] text-white p-8 rounded-lg">
                <div class="flex flex-col md:flex-row items-center gap-8">
                    <!-- Profile Image -->
                    <div class="flex-shrink-0">
                        <div class="relative w-32 h-32">
                            <img src="/src/assets/oz ocak - profile.png" alt="Account Manager" class="w-32 h-32 rounded-full object-cover border-4 border-[#e0a82e]">
                        </div>
                    </div>
                    
                    <!-- Contact Information -->
                    <div class="flex-1">
                        <div class="inline-block bg-[#e0a82e] text-[#18182f] px-4 py-1 rounded-full text-sm font-bold mb-3">Your Account Manager</div>
                        <h3 class="text-2xl font-bold mb-2">Ozzy Ocak</h3>
                        <p class="text-gray-200 mb-4">Business Development Manager<br>Ready to support your success</p>
                        
                        <!-- Phone Numbers -->
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <span><strong>Email:</strong> <a href="mailto:hello@expandia.ch" class="text-[#e0a82e] hover:underline">hello@expandia.ch</a></span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span><strong>USA:</strong> +1 (351) 215-0442</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span><strong>Switzerland:</strong> +41 77 810 72 64</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span><strong>Turkey:</strong> +90 533 635 9465</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer (Static) -->
    <footer class="bg-[#18182f] text-white mt-16 p-8">
        <div class="container mx-auto max-w-5xl text-center">
            <p class="text-sm text-gray-300 mb-2">&copy; 2025 Expandia.ch — by Remova Inc, Delaware, USA</p>
            <p class="text-xs text-gray-400">Business Development & Sales as a Service | Global Reach</p>
            <p class="text-xs text-gray-500 mt-4">This proposal is confidential and intended for authorized recipients only.</p>
        </div>
    </footer>

    <script>
        // Set today's date
        document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    </script>
</body>
</html>`;
}

// Handle all routes by serving the appropriate HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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