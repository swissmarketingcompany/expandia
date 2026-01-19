const fs = require('fs');
const cheerio = require('cheerio');

// Service mapping
const services = [
    { id: 'turnkey-it', template: 'turnkey-it-infrastructure.html', name: 'Turnkey IT Infrastructure' },
    { id: 'email-deliverability', template: 'email-deliverability-checkup.html', name: 'Email Deliverability Checkup' },
    { id: 'secure-email', template: 'secure-email-workplace-setup.html', name: 'Secure Email & Workplace Setup' },
    { id: 'website-care', template: 'website-care-services.html', name: 'Website Care Services' },
    { id: 'turnkey-growth', template: 'turnkey-growth-infrastructure.html', name: 'Turnkey Growth Infrastructure' },
    { id: 'cold-email', template: 'cold-email-infrastructure.html', name: 'Cold Email Infrastructure' },
    { id: 'revops-infra', template: 'revops-infrastructure.html', name: 'RevOps Infrastructure' },
    { id: 'verified-leads', template: 'verified-lead-list.html', name: 'Verified Lead List' },
    { id: 'ai-content', template: 'ai-content-infrastructure.html', name: 'AI Content Infrastructure' },
    { id: 'written-content', template: 'written-content-engine.html', name: 'Written Content Engine' },
    { id: 'image-content', template: 'image-content-engine.html', name: 'Image Content Engine' },
    { id: 'video-content', template: 'video-content-engine.html', name: 'Video Content Engine' },
    { id: 'b2b-lead-gen', template: 'b2b-lead-generation-agency.html', name: 'B2B Lead Generation' },
    { id: 'outreach-software', template: 'outreach-software-management.html', name: 'Outreach Software Management' },
    { id: 'crm-management', template: 'crm-management.html', name: 'CRM Management' },
    { id: 'sales-ops', template: 'sales-development-agency.html', name: 'Sales Operations' },
    { id: 'managed-it', template: 'managed-it-services.html', name: 'Managed IT & Cyber' },
    { id: 'small-business-growth', template: 'market-foundation-program.html', name: 'Small Business Growth' },
    { id: 'market-accelerator', template: 'market-accelerator-program.html', name: 'Market Accelerator' }
];

function extractContent(html, serviceName) {
    const $ = cheerio.load(html);

    // Extract intro paragraphs (first 3 paragraphs from hero or main content)
    const intro = [];
    $('p').slice(0, 5).each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 100 && intro.length < 3) {
            intro.push(text.replace(/\s+/g, ' '));
        }
    });

    // Extract pain points (look for lists or bullet points)
    const painPoints = [];
    $('li').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 20 && text.length < 200 && painPoints.length < 10) {
            painPoints.push(text.replace(/\s+/g, ' '));
        }
    });

    // Extract benefits
    const benefits = [];
    $('strong, b').each((i, el) => {
        const parent = $(el).parent();
        const text = parent.text().trim();
        if (text.length > 30 && benefits.length < 8) {
            benefits.push(`**${$(el).text().trim()}:** ${text.replace($(el).text().trim(), '').trim()}`);
        }
    });

    // Generate FAQ
    const faq = [
        {
            q: `What is included in ${serviceName} for {{CITY_NAME}} companies?`,
            a: `Our ${serviceName} packages are tailored for businesses in {{CITY_NAME}}, providing comprehensive solutions that address local market needs while maintaining global standards.`
        },
        {
            q: `How quickly can we get started in {{CITY_NAME}}?`,
            a: `We can deploy ${serviceName} for your {{CITY_NAME}} business within 48 hours, ensuring minimal disruption to your operations.`
        },
        {
            q: `Do you support companies outside of {{CITY_NAME}}?`,
            a: `Yes, while we specialize in {{CITY_NAME}}, our ${serviceName} supports businesses throughout {{COUNTRY_NAME}} and globally.`
        }
    ];

    return { intro, painPoints, benefits, faq };
}

function generateLocalizedContent(content, serviceName, lang) {
    const prefix = lang === 'en' ? '' : `[${lang.toUpperCase()}] `;

    return {
        intro: content.intro.length > 0 ? content.intro.map(text => `${prefix}${text}`) : [
            `${prefix}In {{CITY_NAME}}, businesses need reliable ${serviceName} to stay competitive. Companies in {{COUNTRY_NAME}} are turning to professional solutions to streamline operations and drive growth.`,
            `${prefix}Our ${serviceName} services are designed specifically for the {{CITY_NAME}} market, combining local expertise with global best practices to deliver exceptional results.`,
            `${prefix}Whether you're a startup or established enterprise in {{CITY_NAME}}, our ${serviceName} provides the infrastructure and support you need to scale efficiently in {{COUNTRY_NAME}}.`
        ],
        pain_points: content.painPoints.length > 0 ? content.painPoints.slice(0, 10).map(text => `${prefix}${text}`) : [
            `${prefix}Lack of specialized expertise in {{CITY_NAME}}`,
            `${prefix}High costs of traditional solutions`,
            `${prefix}Difficulty scaling operations`,
            `${prefix}Time-consuming manual processes`,
            `${prefix}Limited visibility into performance`,
            `${prefix}Compliance and regulatory challenges in {{COUNTRY_NAME}}`,
            `${prefix}Integration issues with existing systems`,
            `${prefix}Inconsistent results and quality`,
            `${prefix}Poor customer support and response times`,
            `${prefix}Inability to compete with larger companies`
        ],
        benefits: content.benefits.length > 0 ? content.benefits.slice(0, 8).map(text => `${prefix}${text}`) : [
            `${prefix}**Rapid Deployment:** Get started in 48 hours or less.`,
            `${prefix}**Local Expertise:** Deep understanding of the {{CITY_NAME}} market.`,
            `${prefix}**Cost Effective:** Predictable pricing with no hidden fees.`,
            `${prefix}**Scalable Solution:** Grows with your business needs.`,
            `${prefix}**Expert Support:** Dedicated team available when you need them.`,
            `${prefix}**Proven Results:** Track record of success in {{COUNTRY_NAME}}.`,
            `${prefix}**Compliance Ready:** Meet all local regulatory requirements.`,
            `${prefix}**Integration Friendly:** Works with your existing tools and systems.`
        ],
        faq: content.faq.map(item => ({
            q: `${prefix}${item.q}`,
            a: `${prefix}${item.a}`
        }))
    };
}

// Generate content for all services
const serviceContent = {};

services.forEach(service => {
    console.log(`Processing ${service.id}...`);

    try {
        const templatePath = `templates/${service.template}`;
        const html = fs.readFileSync(templatePath, 'utf8');
        const extracted = extractContent(html, service.name);

        serviceContent[service.id] = {
            en: generateLocalizedContent(extracted, service.name, 'en'),
            de: generateLocalizedContent(extracted, service.name, 'de'),
            fr: generateLocalizedContent(extracted, service.name, 'fr')
        };

        console.log(`  ✅ Generated content for ${service.id}`);
    } catch (error) {
        console.error(`  ❌ Error processing ${service.id}:`, error.message);
    }
});

// Write to file
fs.writeFileSync('data/service-content-new.json', JSON.stringify(serviceContent, null, 2));
console.log('\n✅ Generated data/service-content-new.json');
console.log(`📊 Total services: ${Object.keys(serviceContent).length}`);
