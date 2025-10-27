/**
 * Gemini AI Service for Offer Generation
 * Generates and refines HTML proposals using Google Gemini API
 */

const axios = require('axios');

class GeminiService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
        this.model = 'gemini-2.5-pro';
        
        // Create axios instance with 5 minute timeout for complex proposals
        this.axiosInstance = axios.create({
            timeout: 300000, // 5 minute timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Generate initial offer HTML from a prompt
     */
    async generateOffer(prompt, clientName, offerTitle) {
        const systemPrompt = `You are a proposal designer for Expandia, a business development and sales as a service company.

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
- TEXT COLORS: MUST use dark colors (gray-700, gray-800, gray-900, #000000). NEVER use white (#ffffff), light gray, or any light colored text
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

        const fullPrompt = `${systemPrompt}\n\nClient: "${clientName}"\nOffer Title: "${offerTitle}"\n\nProposal Brief:\n${prompt}`;

        try {
            const response = await this.axiosInstance.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 1,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 8000
                    }
                }
            );

            const htmlContent = response.data.candidates[0].content.parts[0].text;
            
            // Clean up the response (remove markdown code blocks if present)
            let cleanHtml = htmlContent
                .replace(/```html\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            return cleanHtml;
        } catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw new Error(`Failed to generate offer: ${error.message}`);
        }
    }

    /**
     * Refine existing offer HTML based on edit prompt
     */
    async refineOffer(currentHtml, editPrompt, clientName, offerTitle) {
        const systemPrompt = `You are a proposal refinement specialist for Expandia.

REFINEMENT GUIDELINES:
- Keep the existing structure but improve based on feedback
- Maintain Expandia branding and style
- Colors: #e0a82e (gold), #18182f (dark navy)
- Always enhance value proposition, never reduce it
- Keep tone direct and honest
- Ensure metrics and ROI remain prominent

KEY RULES:
1. Never overpromise - be realistic
2. Show value calculation, not just features
3. Keep design clean and professional
4. Maintain print-friendly formatting
5. Client: "${clientName}", Offer: "${offerTitle}"

Process the feedback and return improved HTML only.`;

        const fullPrompt = `${systemPrompt}\n\nFeedback/Changes Requested:\n${editPrompt}\n\nCurrent HTML:\n\`\`\`html\n${currentHtml}\n\`\`\``;

        try {
            const response = await this.axiosInstance.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 1,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 8000
                    }
                }
            );

            const htmlContent = response.data.candidates[0].content.parts[0].text;
            
            // Clean up the response
            let cleanHtml = htmlContent
                .replace(/```html\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            return cleanHtml;
        } catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw new Error(`Failed to refine offer: ${error.message}`);
        }
    }

    /**
     * Generate initial offer HTML with custom system prompt
     */
    async generateOfferWithPrompt(customSystemPrompt, prompt, clientName, offerTitle) {
        const fullPrompt = `${customSystemPrompt}\n\nClient: "${clientName}"\nOffer Title: "${offerTitle}"\n\nProposal Brief:\n${prompt}`;

        try {
            const response = await this.axiosInstance.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 1,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 8000
                    }
                }
            );

            const htmlContent = response.data.candidates[0].content.parts[0].text;
            let cleanHtml = htmlContent
                .replace(/```html\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            return cleanHtml;
        } catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw new Error(`Failed to generate offer: ${error.message}`);
        }
    }

    /**
     * Refine existing offer HTML with custom system prompt
     */
    async refineOfferWithPrompt(customSystemPrompt, currentHtml, editPrompt, clientName, offerTitle) {
        const fullPrompt = `${customSystemPrompt}\n\nClient: "${clientName}"\nOffer Title: "${offerTitle}"\n\nFeedback/Changes Requested:\n${editPrompt}\n\nCurrent HTML:\n\`\`\`html\n${currentHtml}\n\`\`\``;

        try {
            const response = await this.axiosInstance.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 1,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 8000,
                        thinkingConfig: {
                            thinkingBudget: 1024  // Reduced thinking for faster refinement
                        }
                    }
                }
            );

            const htmlContent = response.data.candidates[0].content.parts[0].text;
            let cleanHtml = htmlContent
                .replace(/```html\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            return cleanHtml;
        } catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw new Error(`Failed to refine offer: ${error.message}`);
        }
    }

    /**
     * Generate content for a specific placeholder using the master template approach
     */
    async generateTemplateContent(customSystemPrompt, placeholder, prompt, clientName, offerTitle) {
        const placeholderGuides = {
            'EXECUTIVE_SUMMARY': 'Generate an executive summary HTML section that explains the problem, our solution, and the value proposition. Use div/p tags with Tailwind classes. CRITICAL: Use DARK text colors (gray-700, gray-800, gray-900, or #000000). NEVER use white, light gray, or light colored text.',
            'SERVICES_PACKAGES': `Generate responsive service cards HTML with icons. For EACH service, create:
<div class="service-card">
    <div class="service-card-icon"><i class="fas fa-[ICON]"></i></div>
    <h3>Service Name</h3>
    <p>Description text here</p>
    <div class="service-price">$X,XXX/month</div>
</div>

Font Awesome icons to use: fa-chart-line, fa-envelope, fa-handshake, fa-rocket, fa-users, fa-target, fa-database, fa-phone, fa-calendar, fa-star, fa-check, fa-cog, fa-briefcase, fa-globe, fa-zap, fa-trending-up, fa-paper-plane, fa-lightbulb.
Create 2-4 service cards total. Wrap each in service-card class.
CRITICAL: Use DARK text colors only (gray-700, gray-800, gray-900). NEVER use white or light colored text.`,
            'TIMELINE': 'Generate a timeline/phases HTML section showing implementation schedule. Use DARK text colors (gray-700, gray-800, gray-900) for all text content. NEVER use white, light gray, or any light colored text.',
            'VALUE_METRICS': 'Generate an HTML section showing expected results, metrics, and ROI calculations. Use DARK text colors for readability (gray-700, gray-800, gray-900, #000000). NEVER use white or light colored text.',
            'TERMS_CONDITIONS': 'Generate HTML for payment terms, SLAs, and other conditions. Use DARK text colors (gray-700, gray-800, gray-900) for all text. NEVER use white or light colored text.'
        };

        const guide = placeholderGuides[placeholder] || 'Generate HTML content.';

        const fullPrompt = `${customSystemPrompt}

TASK: Generate content for the [${placeholder}] section of a proposal.
${guide}

Client: "${clientName}"
Offer Title: "${offerTitle}"

Requirements:
- Return ONLY valid HTML content (no markdown, no code blocks, no explanations)
- Use Tailwind CSS classes for styling
- Use colors: #e0a82e (accent), #18182f (dark navy)
- Keep consistent with the proposal template
- Make it professional and conversion-focused

Content brief:
${prompt}`;

        try {
            const response = await this.axiosInstance.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 1,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 8000
                    }
                }
            );

            const htmlContent = response.data.candidates[0].content.parts[0].text;
            let cleanHtml = htmlContent
                .replace(/```html\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            return cleanHtml;
        } catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw new Error(`Failed to generate template content: ${error.message}`);
        }
    }

    /**
     * Generate a complete proposal by filling template placeholders
     */
    async generateProposalFromTemplate(customSystemPrompt, masterTemplate, brief, clientName, offerTitle) {
        try {
            // Extract placeholders that need content
            const placeholdersNeeded = [
                'EXECUTIVE_SUMMARY',
                'SERVICES_PACKAGES',
                'TIMELINE',
                'VALUE_METRICS',
                'TERMS_CONDITIONS'
            ];

            let html = masterTemplate
                .replace(/\[CLIENT_NAME\]/g, clientName)
                .replace(/\[OFFER_TITLE\]/g, offerTitle);

            // Generate content for each placeholder
            for (const placeholder of placeholdersNeeded) {
                if (html.includes(`[${placeholder}]`)) {
                    console.log(`Generating content for [${placeholder}]...`);
                    const content = await this.generateTemplateContent(
                        customSystemPrompt,
                        placeholder,
                        brief,
                        clientName,
                        offerTitle
                    );
                    html = html.replace(`[${placeholder}]`, content);
                    
                    // Small delay between API calls to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            return html;
        } catch (error) {
            console.error('Error generating proposal from template:', error.message);
            throw error;
        }
    }
}

module.exports = GeminiService;
