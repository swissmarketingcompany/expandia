const fs = require('fs');
const path = require('path');
const ANKARA_LONGITUDE_CUTOFF = 32.8597;
const LOCALIZED_AI_MARKET_REDIRECTS = {
    'london-ai-automation-agency-search-data-guide': 'london-ai-automation-agency-what-to-automate-first',
    'new-york-ai-agents-business-search-data-guide': 'new-york-ai-agents-what-to-automate-first',
    'berlin-ai-automation-agency-search-data-guide': 'berlin-ai-automation-agency-practical-workflows',
    'paris-ai-consulting-automation-search-data-guide': 'paris-ai-consulting-automation-pilot',
    'amsterdam-ai-workflow-automation-search-data-guide': 'amsterdam-ai-workflow-automation-use-cases',
    'austin-ai-automation-sales-search-data-guide': 'austin-ai-automation-saas-growth-workflows',
    'houston-ai-document-automation-search-data-guide': 'houston-ai-document-operations-automation',
    'chicago-business-process-automation-ai-search-data-guide': 'chicago-business-process-automation-ai-workflows',
    'zurich-ai-agents-governance-search-data-guide': 'zurich-ai-agents-governed-automation',
    'barcelona-ai-automation-agency-search-data-guide': 'barcelona-ai-automation-agency-multilingual-workflows'
};
const LOCALIZED_AI_MARKET_REDIRECT_PATHS = new Set(
    Object.keys(LOCALIZED_AI_MARKET_REDIRECTS).map(slug => `blog/${slug}.html`)
);
const RETIRED_EAST_OF_ANKARA_CITY_SLUGS = [
    'jeddah',
    'busan',
    'yokohama',
    'new-taipei-city',
    'singapore',
    'ahmedabad',
    'riyadh',
    'hyderabad',
    'chennai',
    'hong-kong',
    'hangzhou',
    'nanjing',
    'bengaluru',
    'xian',
    'wuhan',
    'seoul',
    'chengdu',
    'tokyo',
    'shenzhen',
    'mumbai',
    'delhi',
    'guangzhou',
    'beijing',
    'shanghai',
    'zaporizhzhia',
    'saratov',
    'donetsk',
    'dnipro',
    'volgograd',
    'perm',
    'voronezh',
    'yerevan',
    'krasnodar',
    'rostov-on-don',
    'ufa',
    'samara',
    'tbilisi',
    'nizhny-novgorod',
    'kazan',
    'kharkiv',
    'baku',
    'moscow'
];
const RETIRED_LOW_POP_CITY_SLUGS = [
    'sankt-polten',
    'roskilde',
    'waterford',
    'biel-bienne',
    'sarpsborg',
    'horsens',
    'neuilly-sur-seine',
    'issy-les-moulineaux',
    'kolding',
    'levallois-perret',
    'la-seyne-sur-mer',
    'villeneuve-dascq',
    'randers',
    'saint-nazaire',
    'vila-nova-de-gaia',
    'esbjerg',
    'saint-maur-des-fosses',
    'rueil-malmaison',
    'champigny-sur-marne',
    'la-rochelle',
    'gateshead',
    'szombathely',
    'stockton-on-tees',
    'kristiansand',
    'rotherham',
    'nyiregyhaza',
    'offenbach',
    'pforzheim',
    'perugia',
    'ingolstadt',
    'heilbronn',
    'gottingen',
    'recklinghausen',
    'wolfsburg',
    'salerno',
    'vasteras',
    'regensburg',
    'villeurbanne',
    'ferrara',
    'innsbruck',
    'stockport',
    'darmstadt',
    'bremerhaven',
    'st-gallen',
    'winterthur',
    'klagenfurt',
    'reutlingen',
    'boulogne-billancourt',
    'asnieres-sur-seine',
    'aulnay-sous-bois',
    'vitry-sur-seine',
    'courbevoie',
    'versailles',
    'doncaster',
    'perpignan',
    'ravenna',
    'funchal',
    'helsingborg',
    'fredrikstad',
    'norrkoping',
    'jonkoping',
    'drammen',
    'sandnes',
    'ceske-budejovice',
    'hradec-kralove',
    'usti-nad-labem',
    'szekesfehervar',
    'pardubice',
    'kecskemet',
    'wichita',
    'tampa',
    'bakersfield',
    'tulsa',
    'minneapolis',
    'oakland',
    'long-beach',
    'miami',
    'raleigh',
    'omaha',
    'kansas-city',
    'mesa',
    'colorado-springs',
    'fort-lauderdale',
    'virginia-beach',
    'corpus-christi',
    'st-petersburg',
    'salt-lake-city',
    'winston-salem',
    'overland-park',
    'santa-clarita',
    'grand-rapids'
];
const RETIRED_EASTERN_EUROPE_CITY_SLUGS = [
    'zagreb',
    'sofia',
    'minsk',
    'saint-petersburg',
    'czestochowa',
    'cluj-napoca',
    'ljubljana',
    'bydgoszcz',
    'bialystok',
    'sosnowiec',
    'timisoara',
    'constanta',
    'belgrade',
    'szczecin',
    'debrecen',
    'ploiesti',
    'tallinn',
    'vilnius',
    'rzeszow',
    'gliwice',
    'ostrava'
];
const RETIRED_CONSERVATIVE_TRIM_CITY_SLUGS = [
    'monchengladbach',
    'gelsenkirchen',
    'braunschweig',
    'ludwigshafen',
    'saarbrucken',
    'oberhausen',
    'leverkusen',
    'wuppertal',
    'bielefeld',
    'kingston-upon-hull',
    'southend-on-sea',
    'stoke-on-trent',
    'wolverhampton',
    'peterborough',
    'northampton',
    'bournemouth',
    'sunderland',
    'portsmouth',
    'warrington',
    'st-helens',
    'las-palmas',
    'santa-cruz'
];
const rawCities = require('./data/cities-top250.json');
const cities = rawCities.filter((city) => Number(city.lng) <= ANKARA_LONGITUDE_CUTOFF);
const services = require('./data/services.json');
const serviceContent = require('./data/service-content.json');
const serviceAreas = require('./data/service-areas.json');
const metadata = require('./data/metadata.json');
const { createHTMLTemplate, generateOrganizationSchema, generateBreadcrumbSchema } = require('./scripts/utils/template-engine');
const blogCatalog = require('./data/blog-posts.json');

// Helper to extract schemas from content and remove them to avoid duplicates in body
function extractAndRemoveSchemas(content, templateName) {
    const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let extractedSchemas = [];
    let match;
    let cleanContent = content;

    while ((match = schemaRegex.exec(content)) !== null) {
        const schemaContent = match[1].trim();
        if (schemaContent === '{{SCHEMA_MARKUP}}') continue;

        try {
            const schemaJson = JSON.parse(schemaContent);
            if (Array.isArray(schemaJson)) {
                extractedSchemas = extractedSchemas.concat(schemaJson);
            } else {
                extractedSchemas.push(schemaJson);
            }
        } catch (e) {
            console.warn(`⚠️ Failed to parse schema in ${templateName}: ${e.message}`);
        }
    }

    cleanContent = cleanContent.replace(schemaRegex, (m, p1) => {
        if (p1.trim() === '{{SCHEMA_MARKUP}}') return m;
        return '';
    });

    return { cleanContent, extractedSchemas };
}

// 🚨 BUILD SYSTEM WARNING
console.log('\n🔧 EXPANDIA BUILD SYSTEM STARTING...');
console.log('⚠️  WARNING: This will OVERWRITE generated HTML files!');
console.log('📝 Always edit templates/ directory, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for full instructions\n');

// Read navigation and footer once - with validation
const includesDir = 'includes';
if (!fs.existsSync(includesDir)) {
    console.error(`❌ ERROR: includes directory not found at ${includesDir}`);
    process.exit(1);
}

const headerPath = `${includesDir}/header.html`;
const footerPath = `${includesDir}/footer.html`;

if (!fs.existsSync(headerPath)) {
    console.error(`❌ ERROR: Header file not found at ${headerPath}`);
    process.exit(1);
}

if (!fs.existsSync(footerPath)) {
    console.error(`❌ ERROR: Footer file not found at ${footerPath}`);
    process.exit(1);
}

const navigationEN = fs.readFileSync(headerPath, 'utf8');
const footerEN = fs.readFileSync(footerPath, 'utf8');

console.log(`✅ Successfully loaded header`);
console.log(`✅ Successfully loaded footer`);

function normalizeCitySlug(slug) {
    return String(slug || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['’\\.]/g, '')
        .replace(/&/g, ' and ')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

const EAST_OF_ANKARA_CITY_SLUGS = Array.from(new Set([
    ...RETIRED_EAST_OF_ANKARA_CITY_SLUGS,
    ...rawCities
        .filter((city) => Number(city.lng) > ANKARA_LONGITUDE_CUTOFF)
        .map((city) => normalizeCitySlug(city.city || city.slug))
]));

if (EAST_OF_ANKARA_CITY_SLUGS.length > 0) {
    const rawEastCount = rawCities.filter((city) => Number(city.lng) > ANKARA_LONGITUDE_CUTOFF).length;
    if (rawEastCount > 0) {
        console.warn(`⚠️ Excluding ${rawEastCount} cities east of Ankara (lng > ${ANKARA_LONGITUDE_CUTOFF}).`);
    }
    console.log(`🧹 Retiring ${EAST_OF_ANKARA_CITY_SLUGS.length} east-of-Ankara city slugs for cleanup/redirects.`);
}
if (RETIRED_LOW_POP_CITY_SLUGS.length > 0) {
    console.log(`🧹 Retiring ${RETIRED_LOW_POP_CITY_SLUGS.length} low-population city slugs for cleanup/redirects.`);
}
if (RETIRED_EASTERN_EUROPE_CITY_SLUGS.length > 0) {
    console.log(`🧹 Retiring ${RETIRED_EASTERN_EUROPE_CITY_SLUGS.length} Eastern Europe/Balkan city slugs for cleanup/redirects.`);
}
if (RETIRED_CONSERVATIVE_TRIM_CITY_SLUGS.length > 0) {
    console.log(`🧹 Retiring ${RETIRED_CONSERVATIVE_TRIM_CITY_SLUGS.length} conservative-trim city slugs for cleanup/redirects.`);
}

const CATEGORY_COPY = {
    en: {
        'ai-solutions': { label: 'AI Support for Companies', promise: 'find the best places to use AI, make a clear plan, and help teams use it well.' },
        'custom-software': { label: 'AI Delivery and Support', promise: 'build the tools and workflows around AI, then keep them working.' }
    }
};

function getCategoryMeta(category) {
    return CATEGORY_COPY.en[category] ||
        SERVICE_CATEGORIES[category] ||
        { label: 'Solutions', promise: 'deliver secure, scalable infrastructure.' };
}

const BUSINESS_MODEL_DEFAULT_KEYWORDS = 'AI agency, AI automation agency, AI consulting services, AI agent development, custom AI solutions for businesses, business AI automation';

const PAGE_METADATA_OVERRIDES = {
    index: {
        title: 'AI Agency for Business Automation | Go Expandia',
        description: 'Go Expandia is an AI agency building custom automations, AI agents, consulting roadmaps, and AI solutions for businesses.',
        keywords: 'AI agency, AI automation agency, AI consulting services, AI agent development, custom AI solutions for businesses'
    },
    solutions: {
        title: 'AI Agency Services | Go Expandia',
        description: 'AI agency services for automation, consulting, AI agent development, and custom AI solutions for businesses.',
        keywords: 'AI agency services, AI automation agency, AI consulting services, AI agent development, custom AI solutions'
    },
    'ai-automation-agency': {
        title: 'AI Automation Agency | Go Expandia',
        description: 'AI automation agency for businesses that need workflow automation, AI-assisted operations, connected tools, and less manual work.',
        keywords: 'AI automation agency, AI automation services, workflow automation AI, business AI automation'
    },
    'ai-consulting-services': {
        title: 'AI Consulting Services | Go Expandia',
        description: 'Practical AI consulting services for companies that need clear priorities, realistic use cases, data boundaries, and a delivery roadmap.',
        keywords: 'AI consulting services, AI consulting, artificial intelligence consulting, AI strategy consulting'
    },
    'ai-agent-development': {
        title: 'AI Agent Development | Go Expandia',
        description: 'AI agent development for business workflows, internal copilots, support agents, sales assistants, research agents, and task-routing agents.',
        keywords: 'AI agent development, AI agents for business, AI agent agency, AI agent development company'
    },
    'custom-ai-solutions-for-businesses': {
        title: 'Custom AI Solutions for Businesses | Go Expandia',
        description: 'Custom AI solutions for businesses that need tailored AI systems, workflow automation, agents, dashboards, and internal tools.',
        keywords: 'custom AI solutions for businesses, custom AI development, AI solutions, AI systems development'
    },
    'ai-opportunity-review': {
        title: 'AI Opportunity Review | Big Data Analysis | Go Expandia',
        description: 'Service 1. We run your business data through Big Data Analysis, hide sensitive details, and show where AI can increase revenue, reduce cost, and improve cash flow first.',
        keywords: 'AI opportunity review, Big Data Analysis, AI use case discovery, business AI analysis, AI revenue and cost improvement'
    },
    'ai-plan': {
        title: 'AI Plan | Go Expandia',
        description: 'Service 2. We turn findings into a simple working plan with clear order, clear buying model, and clear next steps.',
        keywords: 'AI plan, AI rollout plan, AI project roadmap, AI business model planning'
    },
    'ai-build-setup': {
        title: 'AI Build & Setup | Real Business Applications | Go Expandia',
        description: 'Service 3. We build real AI applications, systems, and workflows around your business and connect them to your daily operations.',
        keywords: 'AI build and setup, AI applications, AI workflow automation, AI implementation service'
    },
    'ai-training': {
        title: 'AI Training | Go Expandia',
        description: 'Service 4. We train your team on new AI tools, existing tools, or both so usage is clear and results improve.',
        keywords: 'AI training, AI team training, business AI adoption, practical AI training'
    },
    'ai-support': {
        title: 'AI Support | Go Expandia',
        description: 'Service 5. We support new or existing AI setups, fix issues, improve outputs, and handle edge cases over time.',
        keywords: 'AI support, AI maintenance, AI workflow support, ongoing AI operations'
    },
    about: {
        title: 'About Us | Go Expandia',
        description: 'Go Expandia is an AI agency helping B2B companies automate workflows, build AI agents, and launch custom AI solutions.',
        keywords: 'AI agency, B2B AI adoption, AI automation agency, custom AI solutions, AI agent development'
    },
    'our-business-model': {
        title: 'Our Business Model | Go Expandia',
        description: 'See how Go Expandia works as an AI agency: consulting, automation, AI agent development, custom AI solutions, and ongoing support.',
        keywords: 'AI agency business model, AI automation agency, AI consulting services, AI agent development, custom AI solutions'
    },
    contact: {
        title: 'Contact Go Expandia | Start Your AI Project',
        description: 'Talk to Go Expandia about AI automation, AI consulting, AI agent development, or custom AI solutions for your business.',
        keywords: 'contact AI agency, start AI automation project, AI consulting contact, AI agent development contact'
    },
    id_demo: {
        title: 'Private AI Agent Demo | Go Expandia',
        description: 'Private Go Expandia AI agent demo page for the outbound ödeme sözü hatırlatma agent and self-service chatbot agent.',
        keywords: 'private AI agent demo, ödeme sözü hatırlatma agent, self-service chatbot agent',
        robots: 'noindex, nofollow, noarchive, nosnippet, noimageindex'
    },
    'vision-mission': {
        title: 'Vision & Mission | Go Expandia',
        description: 'See how Go Expandia turns a practical AI adoption model into a clear vision, mission, and operating approach for B2B companies.',
        keywords: BUSINESS_MODEL_DEFAULT_KEYWORDS
    },
    'our-ethical-principles': {
        title: 'Our Ethical Principles | Go Expandia',
        description: 'We build AI systems with transparency, privacy boundaries, verifiable analysis, and responsible implementation.',
        keywords: 'AI ethics, responsible AI delivery, data handling, business AI governance'
    },
    'privacy-policy': {
        title: 'Privacy Policy | Go Expandia',
        description: 'How Go Expandia handles personal data, project data, analytics, cookies, AI data boundaries, retention, subprocessors, and privacy rights.',
        keywords: 'Go Expandia privacy policy, AI agency privacy, data handling, cookies, personal data'
    },
    'terms-of-service': {
        title: 'Terms of Service | Go Expandia',
        description: 'Terms for using the Go Expandia website and general terms for AI consulting, automation, agent development, and custom AI solution discussions.',
        keywords: 'Go Expandia terms, terms of service, AI agency terms, website terms'
    },
    'cookie-policy': {
        title: 'Cookie Policy | Go Expandia',
        description: 'How Go Expandia uses cookies, analytics, chat, form, and marketing technologies on the website.',
        keywords: 'Go Expandia cookie policy, cookies, analytics, Microsoft Clarity, Google Analytics, HubSpot'
    },
    'service-areas': {
        title: 'Service Areas | AI Agency Locations | Go Expandia',
        description: 'Explore Go Expandia service areas across 50 major cities in Europe, the United States, Canada, and Australia for AI automation, consulting, agents, and custom AI solutions.',
        keywords: 'AI agency service areas, AI automation locations, AI consulting service areas, AI agents by city, custom AI solutions locations'
    },
    'barcelona-ai-services': {
        title: 'AI Services in Barcelona | Business AI Guide | Go Expandia',
        description: 'A practical Barcelona AI services landing page and guide for businesses, AI users, and assistants researching AI automation, consulting, agents, and custom AI solutions.',
        keywords: 'AI services Barcelona, AI agency Barcelona, AI automation Barcelona, AI consulting Barcelona, AI agents Barcelona, custom AI solutions Barcelona'
    },
    'blog-index': {
        title: 'AI Business Operations Blog | Go Expandia',
        description: 'Practical articles on using AI to increase revenue, collect payments faster, reduce costs, and run operations with better control.',
        keywords: 'AI business blog, AI operations, AI revenue improvement, AI cost reduction, AI support for companies'
    }
};

function toCanonicalPath(outputName) {
    const normalized = String(outputName || '').replace(/^\/+|\/+$/g, '');
    if (!normalized || normalized === 'index') {
        return '/';
    }
    if (normalized.endsWith('/index')) {
        return `/${normalized.slice(0, -('/index'.length))}/`;
    }
    return `/${normalized}.html`;
}

function getPageMetadata(templateName, lang = 'en') {
    let resolvedMeta = metadata[templateName] || metadata['index'];

    const overrideMeta = PAGE_METADATA_OVERRIDES[templateName];
    if (overrideMeta) {
        resolvedMeta = { ...resolvedMeta, ...overrideMeta };
    }

    if (!resolvedMeta.keywords) {
        resolvedMeta.keywords = BUSINESS_MODEL_DEFAULT_KEYWORDS;
    }

    return resolvedMeta;
}

function escapeHtmlAttr(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeHtmlText(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function upsertHeadTag(content, matcher, replacement) {
    if (matcher.test(content)) {
        return content.replace(matcher, replacement);
    }

    if (!content.includes('</head>')) {
        return content;
    }

    return content.replace('</head>', `    ${replacement}\n</head>`);
}

function enforceSeoMetaTags(content, pageTitle, pageDescription, pageKeywords) {
    const escapedTitle = escapeHtmlAttr(pageTitle);
    const escapedDescription = escapeHtmlAttr(pageDescription);
    const escapedKeywords = escapeHtmlAttr(pageKeywords);

    let next = content;
    next = upsertHeadTag(next, /<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);
    next = upsertHeadTag(next, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapedDescription}">`);
    next = upsertHeadTag(next, /<meta\s+name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${escapedKeywords}">`);
    next = upsertHeadTag(next, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapedTitle}" />`);
    next = upsertHeadTag(next, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapedDescription}" />`);
    next = upsertHeadTag(next, /<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapedTitle}" />`);
    next = upsertHeadTag(next, /<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapedDescription}" />`);

    return next;
}

function enforceCanonicalMeta(content, canonicalUrl) {
    let next = content;
    next = upsertHeadTag(next, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}">`);
    next = upsertHeadTag(next, /<meta\s+[^>]*property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
    next = upsertHeadTag(next, /<meta\s+[^>]*(?:name|property)=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);
    return next;
}

function cleanHtmlText(value) {
    return String(value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\{\{[^{}]+\}\}/g, '')
        .replace(/\*\*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function slugToReadableTitle(slug) {
    const acronyms = new Set(['ai', 'it', 'b2b', 'seo', 'crm', 'cpq', 'rag', 'm365', 'finops', 'uk', 'us']);
    return String(slug || '')
        .split('-')
        .filter(Boolean)
        .map(part => {
            const lower = part.toLowerCase();
            if (acronyms.has(lower)) return lower.toUpperCase();
            if (/^\d+$/.test(lower)) return lower;
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join(' ');
}

function deriveBlogMeta(content, outputName) {
    const genericTitle = 'AI Business Operations Article | AI Support for Companies | Go Expandia';
    const genericDesc = 'Practical AI guide from Go Expandia\'s 5-service model: review, plan, build, training, and support for real business results.';
    const genericKeywords = 'AI business operations, AI opportunity review, AI plan, AI build and setup, AI training, AI support';

    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
    const keywordsMatch = content.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']*)["'][^>]*>/i);
    const leadMatch = content.match(/<p[^>]*class=["'][^"']*lead[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
    const firstParagraphMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);

    const h1Text = cleanHtmlText(h1Match ? h1Match[1] : '');
    const fallbackTitleBase = h1Text || slugToReadableTitle(outputName) || 'Business Growth Guide';

    let title = cleanHtmlText(titleMatch ? titleMatch[1] : '');
    if (!title || title === genericTitle || title.includes('{{PAGE_TITLE}}')) {
        title = `${fallbackTitleBase} | Go Expandia`;
    } else if (!/go expandia/i.test(title)) {
        title = `${title} | Go Expandia`;
    }

    let description = cleanHtmlText(descMatch ? descMatch[1] : '');
    if (!description || description === genericDesc || description.includes('{{PAGE_DESCRIPTION}}')) {
        const fallbackParagraph = cleanHtmlText(leadMatch ? leadMatch[1] : (firstParagraphMatch ? firstParagraphMatch[1] : ''));
        description = fallbackParagraph || `${fallbackTitleBase} practical guide for business teams.`;
    }
    if (description.length > 160) {
        description = `${description.slice(0, 157).replace(/\s+\S*$/, '')}...`;
    }

    let keywords = cleanHtmlText(keywordsMatch ? keywordsMatch[1] : '');
    if (!keywords || keywords === genericKeywords || keywords.includes('{{PAGE_KEYWORDS}}')) {
        const stopWords = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'are', 'how', 'what', 'why', 'into', 'over', 'under', 'than', 'when', 'where', 'guide', 'complete']);
        const candidateWords = `${fallbackTitleBase} ${description}`
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.has(word));
        const uniqueWords = [...new Set(candidateWords)].slice(0, 8);
        keywords = [...uniqueWords, 'go expandia'].join(', ');
    }

    return { title, description, keywords };
}

function getBlogCategory(categoryKey) {
    return blogCatalog.categories[categoryKey] || {
        label: 'AI Business Operations',
        description: 'Practical AI business operations articles from Go Expandia.',
        keywords: 'AI business operations, AI automation, AI consulting'
    };
}

function getBlogPostInfo(slug) {
    const post = blogCatalog.posts[slug] || {};
    const category = getBlogCategory(post.category);
    return {
        slug,
        title: post.title || slugToReadableTitle(slug),
        description: post.description || `${slugToReadableTitle(slug)} from Go Expandia.`,
        excerpt: post.excerpt || post.description || `${slugToReadableTitle(slug)} from Go Expandia.`,
        keywords: post.keywords || category.keywords,
        categoryKey: post.category || 'ai-automation',
        category,
        badge: post.badge || category.label,
        readTime: post.readTime || '10 min read',
        image: post.image || 'go-expandia-logo.png',
        published: post.published || '2026-05-15',
        modified: post.modified || post.published || '2026-05-15'
    };
}

function getPublishedBlogSlugs() {
    const templateDir = 'templates/blog';
    if (!fs.existsSync(templateDir)) return [];

    return fs.readdirSync(templateDir)
        .filter(file => file.endsWith('.html'))
        .map(file => file.replace(/\.html$/, ''))
        .filter(slug => !REMOVED_BLOG_POST_SLUGS.has(slug))
        .sort((a, b) => {
            const categoryCompare = getBlogPostInfo(a).category.label.localeCompare(getBlogPostInfo(b).category.label);
            if (categoryCompare !== 0) return categoryCompare;
            return getBlogPostInfo(a).title.localeCompare(getBlogPostInfo(b).title);
        });
}

function getPublishedBlogPosts() {
    return getPublishedBlogSlugs().map(slug => getBlogPostInfo(slug));
}

function renderBlogCategoryLinks(activeCategoryKey = '') {
    const allActive = activeCategoryKey ? 'border-base-200 bg-white text-base-content hover:border-primary/30' : 'border-primary bg-primary text-white';
    const links = [
        `<a href="{{BASE_PATH}}blog/" class="inline-flex items-center rounded-full border px-4 py-2 text-sm font-bold transition-colors ${allActive}">All articles</a>`
    ];

    Object.entries(blogCatalog.categories).forEach(([categoryKey, category]) => {
        const isActive = categoryKey === activeCategoryKey;
        const activeClass = isActive ? 'border-primary bg-primary text-white' : 'border-base-200 bg-white text-base-content hover:border-primary/30';
        links.push(`<a href="{{BASE_PATH}}blog/categories/${categoryKey}.html" class="inline-flex items-center rounded-full border px-4 py-2 text-sm font-bold transition-colors ${activeClass}">${escapeHtmlText(category.label)}</a>`);
    });

    return links.join('\n                ');
}

function renderBlogCategoryList(activeCategoryKey = '') {
    return Object.entries(blogCatalog.categories).map(([categoryKey, category]) => {
        const count = getPublishedBlogPosts().filter(post => post.categoryKey === categoryKey).length;
        const activeClass = categoryKey === activeCategoryKey ? 'text-primary' : 'text-base-content hover:text-primary';
        return `<li><a href="{{BASE_PATH}}blog/categories/${categoryKey}.html" class="flex items-center justify-between gap-3 font-bold ${activeClass}"><span>${escapeHtmlText(category.label)}</span><span class="text-sm text-base-content/50">${count}</span></a></li>`;
    }).join('\n                            ');
}

function renderBlogPostCards(posts) {
    return posts.map(post => `
                        <article class="buzz-card bg-white border border-base-200 p-6 md:p-7 shadow-sm hover:shadow-xl transition-shadow">
                            <div class="flex flex-wrap items-center gap-3 text-sm font-bold text-base-content/60 mb-4">
                                <a href="{{BASE_PATH}}blog/categories/${post.categoryKey}.html" class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-primary">${escapeHtmlText(post.category.label)}</a>
                                <span>${escapeHtmlText(post.readTime)}</span>
                            </div>
                            <h2 class="text-2xl md:text-3xl font-black leading-tight mb-3">
                                <a href="{{BASE_PATH}}blog/${post.slug}.html" class="hover:text-primary transition-colors">${escapeHtmlText(post.title)}</a>
                            </h2>
                            <p class="text-base-content/70 leading-relaxed mb-5">${escapeHtmlText(post.excerpt)}</p>
                            <a href="{{BASE_PATH}}blog/${post.slug}.html" class="inline-flex items-center gap-2 font-black text-primary">
                                Read article
                                <span aria-hidden="true">-></span>
                            </a>
                        </article>`).join('\n');
}

function buildBlogListingPage({ outputName, categoryKey = '' }) {
    const templatePath = 'templates/blog-listing.html';
    if (!fs.existsSync(templatePath)) {
        console.warn(`Blog listing template not found: ${templatePath}`);
        return;
    }

    const allPosts = getPublishedBlogPosts();
    const category = categoryKey ? getBlogCategory(categoryKey) : null;
    const posts = categoryKey ? allPosts.filter(post => post.categoryKey === categoryKey) : allPosts;
    if (categoryKey && posts.length === 0) return;

    const depth = outputName.split('/').length - 1;
    const basePath = depth > 0 ? '../'.repeat(depth) : './';
    const canonicalUrl = `https://www.goexpandia.com${toCanonicalPath(outputName.replace(/\/index$/, '/index'))}`;
    const canonicalPath = toCanonicalPath(outputName.replace(/\/index$/, '/index')).replace(/^\//, '');
    const pageTitle = category
        ? `${category.label} Articles | Go Expandia Blog`
        : 'AI Business Operations Blog | Go Expandia';
    const pageDescription = category
        ? category.description
        : 'Practical Go Expandia articles on AI automation, AI consulting, business process automation, workflow software, AI agents, and custom AI solutions.';
    const pageKeywords = category
        ? category.keywords
        : 'AI automation blog, AI consulting blog, business process automation, workflow automation, AI agents, custom AI solutions';

    let content = fs.readFileSync(templatePath, 'utf8')
        .replace(/\{\{BREADCRUMB_CURRENT\}\}/g, category ? category.label : 'Blog')
        .replace(/\{\{BLOG_EYEBROW\}\}/g, category ? 'Blog category' : 'Go Expandia blog')
        .replace(/\{\{BLOG_HEADING\}\}/g, category ? `${category.label} Articles` : 'AI Business Operations Blog')
        .replace(/\{\{BLOG_INTRO\}\}/g, category ? category.description : pageDescription)
        .replace(/\{\{BLOG_CATEGORY_LINKS\}\}/g, renderBlogCategoryLinks(categoryKey))
        .replace(/\{\{BLOG_CATEGORY_LIST\}\}/g, renderBlogCategoryList(categoryKey))
        .replace(/\{\{BLOG_POST_CARDS\}\}/g, renderBlogPostCards(posts))
        .replace(/\{\{BASE_PATH\}\}/g, basePath);

    let nav = navigationEN;
    let foot = footerEN;
    nav = nav.replace(/\{\{BASE_PATH\}\}/g, basePath)
        .replace(/\{\{LOGO_PATH\}\}/g, `${basePath}go-expandia-logo.png`)
        .replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html')
        .replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
    foot = foot.replace(/\{\{BASE_PATH\}\}/g, basePath)
        .replace(/\{\{LOGO_PATH\}\}/g, `${basePath}go-expandia-logo.png`);

    let html = createHTMLTemplate('en');
    html = html.replace(/\{\{BASE_PATH\}\}/g, basePath)
        .replace(/\{\{NAVIGATION\}\}/g, nav)
        .replace(/\{\{MAIN_CONTENT\}\}/g, content)
        .replace(/\{\{FOOTER\}\}/g, foot)
        .replace(/\{\{PAGE_TITLE\}\}/g, pageTitle)
        .replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageDescription)
        .replace(/\{\{PAGE_KEYWORDS\}\}/g, pageKeywords)
        .replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl)
        .replace(/\{\{PAGE_URL_EN\}\}/g, canonicalPath);

    const itemList = posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.goexpandia.com/blog/${post.slug}.html`,
        "name": post.title
    }));
    const schemas = [
        generateOrganizationSchema(),
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": category ? `${category.label} Articles` : 'AI Business Operations Blog',
            "description": pageDescription,
            "url": canonicalUrl,
            "mainEntity": {
                "@type": "ItemList",
                "itemListElement": itemList
            }
        },
        generateBreadcrumbSchema(category ? [
            { name: 'Home', url: 'https://www.goexpandia.com/' },
            { name: 'Blog', url: 'https://www.goexpandia.com/blog/' },
            { name: category.label, url: canonicalUrl }
        ] : [
            { name: 'Home', url: 'https://www.goexpandia.com/' },
            { name: 'Blog', url: canonicalUrl }
        ])
    ];
    html = html.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schemas, null, 2));
    html = clearUnresolvedTemplateTokens(html);

    const outputPath = `${outputName}.html`;
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✅ Built blog listing page: ${outputPath}`);
}

function buildBlogListingPages() {
    buildBlogListingPage({ outputName: 'blog/index' });
    Object.keys(blogCatalog.categories).forEach(categoryKey => {
        buildBlogListingPage({ outputName: `blog/categories/${categoryKey}`, categoryKey });
    });
}

function decorateBlogSchemas(schemas, pageMeta, canonicalUrl, blogInfo) {
    const decorate = (schema) => {
        if (!schema || typeof schema !== 'object') return schema;
        if (Array.isArray(schema)) return schema.map(decorate);
        if (Array.isArray(schema['@graph'])) {
            schema['@graph'] = schema['@graph'].map(decorate);
            return schema;
        }
        const schemaTypes = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
        if (schemaTypes.some(type => ['BlogPosting', 'Article', 'NewsArticle'].includes(type))) {
            schema.articleSection = blogInfo.category.label;
            schema.keywords = pageMeta.keywords;
            schema.url = canonicalUrl;
            schema.mainEntityOfPage = canonicalUrl;
            schema.isPartOf = {
                "@type": "Blog",
                "name": "Go Expandia Blog",
                "url": "https://www.goexpandia.com/blog/"
            };
            schema.about = [
                { "@type": "Thing", "name": blogInfo.category.label },
                { "@type": "Thing", "name": "AI automation" },
                { "@type": "Thing", "name": "Business operations" }
            ];
        }
        return schema;
    };
    return schemas.map(decorate);
}

function enforceBlogCategoryMeta(content, blogInfo) {
    const escapedCategory = escapeHtmlAttr(blogInfo.category.label);
    let next = upsertHeadTag(content, /<meta\s+property=["']article:section["'][^>]*>/i, `<meta property="article:section" content="${escapedCategory}">`);
    next = upsertHeadTag(next, /<meta\s+name=["']category["'][^>]*>/i, `<meta name="category" content="${escapedCategory}">`);
    next = upsertHeadTag(next, /<meta\s+property=["']article:tag["'][^>]*>/i, `<meta property="article:tag" content="${escapeHtmlAttr(blogInfo.keywords)}">`);
    const categoryLink = `<span aria-hidden="true">|</span>\n                                <a href="../blog/categories/${blogInfo.categoryKey}.html" class="text-primary hover:text-primary/80">${escapeHtmlText(blogInfo.category.label)}</a>`;
    if (!next.includes(`blog/categories/${blogInfo.categoryKey}.html`) && next.includes('<span>16 min read</span>')) {
        next = next.replace(/(<span>\d+\s+min read<\/span>)/, `$1\n                                ${categoryLink}`);
    } else if (!next.includes(`blog/categories/${blogInfo.categoryKey}.html`) && next.includes('min read</span>')) {
        next = next.replace(/(<span>[^<]*min read<\/span>)/, `$1\n                                ${categoryLink}`);
    }
    return next;
}

const SERVICE_CATEGORIES = {
    'ai-solutions': {
        label: 'AI Support for Companies',
        promise: 'find the best opportunities, make a clear plan, and train teams to use AI well.',
        icon: 'bot'
    },
    'custom-software': {
        label: 'AI Delivery and Support',
        promise: 'build the tools and workflows around AI, then keep them working.',
        icon: 'code-2'
    }
};

const SOLUTION_PAGE_BLUEPRINTS = {
    'ai-opportunity-review': {
        category: 'ai-solutions',
        hero: {
            badge: 'Service 1',
            titlePrefix: 'AI Opportunity Review',
            titleSuffix: '',
            description: 'We run Big Data Analysis on your company data, generate PDF reports, and define where AI should be implemented first.',
            image: './assets/images/about-team-hive.png',
            alt: 'AI opportunity review and data analysis',
            primaryCtaText: 'Start Review',
            primaryCtaLink: 'contact.html',
            secondaryCtaText: 'See Big Data Analysis',
            secondaryCtaLink: '#big-data-analysis'
        },
        sections: [
            {
                type: 'cards',
                id: 'review-overview',
                sectionClass: 'bg-base-100',
                heading: 'How Service 1 Works',
                intro: 'Everything starts with Big Data Analysis before any build work.',
                gridClass: 'md:grid-cols-2',
                cards: [
                    { title: 'Department-Level Big Data Analysis', description: 'You upload company data by business department: finance, sales, operations, production, and more.', borderClass: 'border-primary' },
                    { title: 'Deep Analysis', description: 'We process large datasets and analyze current business state with department-level detail.', borderClass: 'border-secondary' },
                    { title: 'PDF Report Output', description: 'Each report contains current-data analysis and clear AI implementation opportunities.', borderClass: 'border-accent' },
                    { title: 'Priority Task List', description: 'Reports become the AI task queue used for planning and implementation services.', borderClass: 'border-neutral' }
                ]
            },
            {
                type: 'html',
                html: buildBigDataAnalysisSection()
            },
            {
                type: 'process',
                id: 'review-process',
                sectionClass: 'bg-base-200',
                heading: 'Output of Service 1',
                intro: 'You leave this stage with clear data-backed direction.',
                steps: [
                    { title: 'Analyze company data', description: 'Big Data Analysis turns raw business files into structured findings.' },
                    { title: 'Generate department PDF reports', description: 'Each report shows existing performance and where AI will create impact.' },
                    { title: 'Move into implementation', description: 'Approved priorities feed directly into Service 2 planning and Service 3 build.' }
                ]
            },
            {
                type: 'faq',
                id: 'review-faq',
                sectionClass: 'bg-base-100',
                heading: 'Common Questions',
                intro: 'Questions about AI Opportunity Review and Big Data Analysis.',
                items: [
                    { q: 'What does each PDF include?', a: 'Two things: analysis of your existing data and where to implement AI first.' },
                    { q: 'Can we run new analysis later?', a: 'Yes. We can use previous PDF reports with new data for faster re-analysis.' },
                    { q: 'Do you support large datasets?', a: 'Yes. The model is designed for high-volume enterprise data processing.' },
                    { q: 'What is next after this review?', a: 'We move from report outputs into roadmap planning and implementation.' }
                ]
            }
        ],
        cta: {
            heading: 'Ready to Run AI Opportunity Review?',
            description: 'Start with Big Data Analysis, get your reports, and define the right AI implementation path.',
            buttonText: 'Start Opportunity Review'
        }
    },
    'ai-build-setup': {
        category: 'custom-software',
        hero: {
            badge: 'Service 3',
            titlePrefix: 'AI Build & Setup',
            titleSuffix: '',
            description: 'We implement the approved AI opportunities as working tools, AI systems, automations, and workflows.',
            image: './assets/images/expandia managed operations.png',
            alt: 'AI microapps and workflow setup',
            primaryCtaText: 'Talk to Us',
            primaryCtaLink: 'contact.html',
            secondaryCtaText: 'See Applications',
            secondaryCtaLink: '#real-business-applications'
        },
        sections: [
            {
                type: 'cards',
                id: 'what-you-get',
                sectionClass: 'bg-base-100',
                heading: 'What This Service Really Means',
                intro: 'This service turns approved opportunities into deployed AI applications.',
                gridClass: 'md:grid-cols-2',
                cards: [
                    { title: 'Workflow Build', description: 'We build the AI systems and automation flows defined by your approved AI priorities.', borderClass: 'border-primary' },
                    { title: 'System Integration', description: 'We connect applications to your real systems and data sources.', borderClass: 'border-secondary' },
                    { title: 'Rollout and Training', description: 'We deploy for teams and make sure daily usage is practical and consistent.', borderClass: 'border-accent' },
                    { title: 'Support and Iteration', description: 'We fix, improve, and expand based on real usage after launch.', borderClass: 'border-neutral' }
                ]
            },
            {
                type: 'html',
                html: buildRealBusinessApplicationsSection()
            },
            {
                type: 'process',
                id: 'build-process',
                sectionClass: 'bg-base-200',
                heading: 'How We Turn This Into Real Delivery',
                intro: 'Clear build flow from backlog to production use.',
                steps: [
                    { title: 'Translate priorities into scope', description: 'We convert approved opportunities into delivery scope and milestones.' },
                    { title: 'Build and integrate', description: 'We develop the tools and connect them into your business workflow.' },
                    { title: 'Deploy and optimize', description: 'We launch, support users, and improve based on real outcomes.' }
                ]
            },
            {
                type: 'faq',
                id: 'build-faq',
                sectionClass: 'bg-base-100',
                heading: 'Common Questions',
                intro: 'Questions about implementation and rollout.',
                items: [
                    { q: 'Do you only build from your own review output?', a: 'No. We can also implement from existing client requirements and approved internal plans.' },
                    { q: 'Can you integrate with our current systems?', a: 'Yes. Integration is part of delivery for most projects.' },
                    { q: 'Do we need to launch everything at once?', a: 'No. We typically deploy in stages and expand after validation.' },
                    { q: 'Do you provide support after launch?', a: 'Yes. Ongoing support and iteration are part of our delivery model.' }
                ]
            }
        ],
        cta: {
            heading: 'Want this kind of app built for your business?',
            description: 'Bring approved AI priorities and we will turn them into working systems.',
            buttonText: 'Start the Build'
        }
    }
};

function renderSolutionCardsSection(section) {
    const cardsHtml = section.cards.map((card, index) => {
        const borderClass = card.borderClass || ['border-primary', 'border-secondary', 'border-accent', 'border-neutral'][index % 4];
        const idAttr = card.id ? ` id="${card.id}"` : '';
        return `
            <div${idAttr} class="buzz-card p-8 bg-white shadow-lg border-t-4 ${borderClass}">
                <h3 class="text-2xl font-bold mb-3">${card.title}</h3>
                <p class="text-base-content/70">${card.description}</p>
            </div>`;
    }).join('');

    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-100'}">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">${section.heading}</h2>
            <p class="text-lg text-base-content/60 max-w-3xl mx-auto">${section.intro}</p>
        </div>

        <div class="grid grid-cols-1 ${section.gridClass || 'md:grid-cols-2'} gap-8">
            ${cardsHtml}
        </div>
    </div>
</section>`;
}

function renderSolutionSplitSection(section) {
    const stepStyles = [
        'bg-primary/10 text-primary',
        'bg-secondary/10 text-secondary',
        'bg-neutral/10 text-neutral'
    ];

    const bulletsHtml = (section.bullets || []).map((item) => `
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <i data-lucide="${item.icon || 'check'}" class="w-6 h-6 text-primary"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-lg mb-2">${item.title}</h4>
                            <p class="text-gray-600">${item.description}</p>
                        </div>
                    </div>`).join('');

    const leftCardsHtml = (section.leftCards || []).map((item) => `
                        <div${item.id ? ` id="${item.id}"` : ''} class="p-6 bg-base-100 rounded-2xl">
                            <h3 class="font-bold mb-2">${item.title}</h3>
                            <p class="text-sm text-base-content/60">${item.description}</p>
                        </div>`).join('');

    const panelHtml = section.panel ? `
                <div class="bg-white p-8 rounded-3xl shadow-xl">
                    <h3 class="text-2xl font-bold mb-4">${section.panel.title}</h3>
                    <p class="text-base-content/70 mb-6">${section.panel.description}</p>
                    <div class="space-y-4">
                        ${section.panel.steps.map((step, index) => `
                            <div class="flex items-center gap-3"><span class="w-8 h-8 rounded-full ${stepStyles[index] || stepStyles[0]} flex items-center justify-center font-bold">${index + 1}</span><span>${step}</span></div>
                        `).join('')}
                    </div>
                </div>` : '';

    const rightHtml = section.image ? `
            <div class="relative">
                <img src="${section.image}" alt="${section.alt || ''}" class="rounded-3xl shadow-2xl w-full object-cover aspect-square">
            </div>` : panelHtml;

    const leftHtml = section.leftCards && section.leftCards.length ? `
            <div class="space-y-6">
                <h2 class="text-3xl md:text-5xl font-black leading-tight">${section.heading}</h2>
                ${section.intro ? `<p class="text-lg text-base-content/70">${section.intro}</p>` : ''}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    ${leftCardsHtml}
                </div>
            </div>` : `
            <div class="space-y-6">
                <h2 class="text-3xl md:text-5xl font-black leading-tight">${section.heading}</h2>
                ${section.intro ? `<p class="text-lg text-base-content/70">${section.intro}</p>` : ''}
                <div class="space-y-6">
                    ${bulletsHtml}
                </div>
            </div>`;

    const splitContent = section.reverse ? `${rightHtml}${leftHtml}` : `${leftHtml}${rightHtml}`;
    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-200'}">
    <div class="container mx-auto container-padding">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
            ${splitContent}
        </div>
    </div>
</section>`;
}

function renderSolutionPageCTA(section) {
    return `
<section class="section-spacing bg-primary text-white">
    <div class="container mx-auto container-padding text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">${section.heading}</h2>
        <p class="text-xl mb-8 opacity-90 max-w-3xl mx-auto">${section.description}</p>
        <a href="contact.html" class="btn btn-white btn-lg text-primary border-none">${section.buttonText}</a>
    </div>
</section>`;
}

function renderSolutionProblemsSection(section) {
    const itemsHtml = section.problems.map((problem) => `
        <div class="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-red-100">
            <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i data-lucide="${problem.icon || 'alert-circle'}" class="w-5 h-5 text-red-500"></i>
            </div>
            <div>
                <h3 class="font-bold text-lg mb-1">${problem.title}</h3>
                <p class="text-base-content/70 text-sm">${problem.description}</p>
            </div>
        </div>`).join('');

    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-100'}">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">${section.heading}</h2>
            <p class="text-lg text-base-content/60 max-w-3xl mx-auto">${section.intro}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${itemsHtml}
        </div>
    </div>
</section>`;
}

function renderSolutionProcessSection(section) {
    const stepsHtml = section.steps.map((step, index) => `
        <div class="flex flex-col items-center text-center relative">
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                <span class="text-2xl font-black text-white">${index + 1}</span>
            </div>
            ${index < section.steps.length - 1 ? '<div class="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-primary/20"></div>' : ''}
            <h3 class="text-xl font-bold mb-3">${step.title}</h3>
            <p class="text-base-content/70">${step.description}</p>
        </div>`).join('');

    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-200'}">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">${section.heading}</h2>
            <p class="text-lg text-base-content/60 max-w-3xl mx-auto">${section.intro}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            ${stepsHtml}
        </div>
    </div>
</section>`;
}

function renderSolutionFaqSection(section) {
    const faqItems = section.items.map((item, index) => `
                    <details class="group bg-base-200 rounded-2xl px-6 py-2 shadow-sm" ${index === 0 ? 'open' : ''}>
                        <summary class="list-none cursor-pointer py-4 text-xl font-medium flex items-center justify-between gap-4">
                            <span>${item.q}</span>
                            <span class="text-primary text-2xl leading-none">+</span>
                        </summary>
                        <div class="pb-4 text-base-content/80">
                            <p>${item.a}</p>
                        </div>
                    </details>`).join('');

    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-100'}">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">${section.heading}</h2>
            <p class="text-lg text-base-content/60 max-w-3xl mx-auto">${section.intro}</p>
        </div>
        <div class="space-y-4 max-w-4xl mx-auto">
            ${faqItems}
        </div>
    </div>
</section>`;
}

function renderSolutionHtmlSection(section) {
    return section.html || '';
}

function buildAiPlanDiagramSection() {
    return `
<section id="ai-plan-diagram" class="section-spacing bg-base-100">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-14">
            <h2 class="text-4xl md:text-5xl font-black mb-4">
                <span class="gradient-header">AI Plan Architecture</span>
            </h2>
            <p class="text-base text-base-content/60 max-w-3xl mx-auto">
                How we turn your Opportunity Review findings into a practical, phased implementation roadmap.
            </p>
        </div>

        <style>
            .ddm-diagram { display: flex; flex-direction: column; gap: 0; align-items: center; }
            @media (min-width: 1024px) { .ddm-diagram { flex-direction: row; align-items: stretch; gap: 0; } }
            .ddm-col { display: flex; flex-direction: column; gap: 10px; }
            .ddm-arrow-h {
                display: none; align-self: center; flex-shrink: 0; width: 56px; position: relative;
            }
            @media (min-width: 1024px) { .ddm-arrow-h { display: flex; align-items: center; justify-content: center; } }
            .ddm-arrow-v {
                display: flex; align-items: center; justify-content: center; height: 40px; flex-direction: column;
            }
            @media (min-width: 1024px) { .ddm-arrow-v { display: none; } }
            
            .ddm-connector-v { width: 2px; height: 100%; background: linear-gradient(180deg, rgba(87,13,248,0.25), rgba(87,13,248,0.6)); position: relative; }
            .ddm-connector-v::after { content: ''; position: absolute; bottom: -2px; left: -4px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid rgba(87,13,248,0.6); }

            .ddm-engine-card {
                background: linear-gradient(135deg, rgba(87,13,248,0.05), white);
                border: 2px solid rgba(87,13,248,0.15);
                border-radius: 16px; padding: 24px; position: relative; overflow: hidden;
                box-shadow: 0 10px 30px -10px rgba(87,13,248,0.1);
            }
            .ddm-engine-pulse {
                position: absolute; top: 0; left: 0; width: 100%; height: 3px;
                background: linear-gradient(90deg, transparent, #570df8, transparent);
                animation: ddm-pulse 2.5s infinite linear;
            }
            @keyframes ddm-pulse { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

            .ddm-output-card {
                background: white; border: 1.5px solid rgba(0,0,0,0.05); border-radius: 12px;
                padding: 16px; flex: 1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
            }
            .ddm-output-badge {
                display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
                border-radius: 20px; font-size: 11px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;
            }
            .ddm-tag {
                font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px;
                display: inline-flex; align-items: center;
            }
            .ddm-input-pill {
                display: flex; align-items: center; justify-content: space-between;
                padding: 10px 14px; background: white; border: 1px solid rgba(0,0,0,0.08);
                border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151;
            }
        </style>

        <div class="ddm-diagram max-w-5xl mx-auto">
            <!-- Left: Inputs -->
            <div style="min-width: 0; flex: 1;">
                <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-4 text-center lg:text-right pr-1">Review Findings</div>
                <div class="ddm-col" style="gap:8px;">
                    <div class="ddm-input-pill"><span>Review PDF Reports</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                    <div class="ddm-input-pill"><span>Business Objectives</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
                    <div class="ddm-input-pill"><span>Budget Constraints</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                    <div class="ddm-input-pill"><span>Team Bandwidth</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div class="ddm-input-pill"><span>Technical Readiness</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
                </div>
            </div>

            <!-- Arrow H (desktop) -->
            <div class="ddm-arrow-h" style="padding: 0 8px;">
                <div style="width:100%; position:relative; display:flex; align-items:center;">
                    <div style="flex:1; height:2px; background:linear-gradient(90deg, rgba(87,13,248,0.25),rgba(87,13,248,0.6));"></div>
                    <div style="border-left:9px solid rgba(87,13,248,0.6); border-top:6px solid transparent; border-bottom:6px solid transparent; flex-shrink:0;"></div>
                </div>
            </div>

            <!-- Arrow V (mobile) -->
            <div class="ddm-arrow-v" style="width:100%;"><div class="ddm-connector-v"></div></div>

            <!-- Center: Engine -->
            <div style="min-width: 0; flex: 1.2;">
                <div class="ddm-engine-card h-full flex flex-col justify-center">
                    <div class="ddm-engine-pulse"></div>
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                        <div style="width:40px; height:40px; border-radius:10px; background:#570df8; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow: 0 4px 12px rgba(87,13,248,0.3);">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                        </div>
                        <div>
                            <div style="font-weight:800; font-size:18px; color:#111827; line-height:1.2;">Prioritization Engine</div>
                            <div style="font-size:12px; font-weight:600; color:#570df8;">Impact vs Effort Matrix</div>
                        </div>
                    </div>
                    
                    <div style="background: white; border-radius: 8px; padding: 12px; border: 1px solid rgba(87,13,248,0.1);">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; align-items:center;">
                            <span style="font-size:12px; font-weight:600; color:#6b7280;">High Value / Low Effort</span>
                            <span style="font-size:11px; font-weight:700; color:#059669; background:#ecfdf5; padding:2px 6px; border-radius:4px;">Phase 1</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; align-items:center;">
                            <span style="font-size:12px; font-weight:600; color:#6b7280;">High Value / High Effort</span>
                            <span style="font-size:11px; font-weight:700; color:#d97706; background:#fffbeb; padding:2px 6px; border-radius:4px;">Phase 2</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:12px; font-weight:600; color:#6b7280;">Low Value</span>
                            <span style="font-size:11px; font-weight:700; color:#dc2626; background:#fef2f2; padding:2px 6px; border-radius:4px;">Discard</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Arrow H (desktop) -->
            <div class="ddm-arrow-h" style="padding: 0 8px;">
                <div style="width:100%; position:relative; display:flex; align-items:center;">
                    <div style="flex:1; height:2px; background:linear-gradient(90deg, rgba(87,13,248,0.25),rgba(87,13,248,0.6));"></div>
                    <div style="border-left:9px solid rgba(87,13,248,0.6); border-top:6px solid transparent; border-bottom:6px solid transparent; flex-shrink:0;"></div>
                </div>
            </div>

            <!-- Arrow V (mobile) -->
            <div class="ddm-arrow-v" style="width:100%;"><div class="ddm-connector-v"></div></div>

            <!-- Right: Outputs -->
            <div style="min-width:0; flex:1;">
                <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-4 text-center lg:text-left pl-1">The Working Plan</div>
                <div class="ddm-col" style="gap:16px;">

                    <div class="ddm-output-card" style="border-color: rgba(16,185,129,0.25); background: linear-gradient(135deg, rgba(16,185,129,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(16,185,129,0.1); color:#059669;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            Short Projects
                        </div>
                        <div style="font-weight:700; font-size:14px; margin-bottom:4px; color:#111827;">Quick Wins & Build</div>
                        <div style="font-size:12px; color:#6b7280; line-height:1.5;">Fixed-fee sprints to launch high-ROI tools immediately.</div>
                        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#ecfdf5; color:#065f46;">→ Service 3 (Setup)</span>
                        </div>
                    </div>

                    <div class="ddm-output-card" style="border-color: rgba(59,130,246,0.25); background: linear-gradient(135deg, rgba(59,130,246,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(59,130,246,0.1); color:#2563eb;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                            Monthly Services
                        </div>
                        <div style="font-weight:700; font-size:14px; margin-bottom:4px; color:#111827;">Ongoing Rollout</div>
                        <div style="font-size:12px; color:#6b7280; line-height:1.5;">Continuous integration and workflow improvement.</div>
                        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#eff6ff; color:#1d4ed8;">→ Service 5 (Support)</span>
                        </div>
                    </div>

                    <div class="ddm-output-card" style="border-color: rgba(139,92,246,0.25); background: linear-gradient(135deg, rgba(139,92,246,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(139,92,246,0.1); color:#7c3aed;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            Training Schedule
                        </div>
                        <div style="font-weight:700; font-size:14px; margin-bottom:4px; color:#111827;">Team Enablement</div>
                        <div style="font-size:12px; color:#6b7280; line-height:1.5;">Structured sessions to build daily usage habits.</div>
                        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#f5f3ff; color:#6d28d9;">→ Service 4 (Training)</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</section>
`;
}

function buildBigDataAnalysisSection() {
    return `
<section id="big-data-analysis" class="section-spacing bg-base-100">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-14">
            <h2 class="text-4xl md:text-5xl font-black mb-4">
                <span class="gradient-header">Big Data Analysis</span>
            </h2>
            <p class="text-base text-base-content/60 max-w-3xl mx-auto">
                Every engagement starts here. We process large department datasets and generate structured PDF reports — covering current-state analysis and where to implement AI first.
            </p>
            <p class="text-sm text-base-content/50 max-w-2xl mx-auto mt-2">
                Built for high-volume company datasets where generic public assistants hit file limits.
            </p>
        </div>

        <!-- Diagram -->
        <style>
            .ddm-diagram { display: flex; flex-direction: column; gap: 0; align-items: center; }
            @media (min-width: 1024px) { .ddm-diagram { flex-direction: row; align-items: stretch; gap: 0; } }
            .ddm-col { display: flex; flex-direction: column; gap: 10px; }
            .ddm-arrow-h {
                display: none;
                align-self: center;
                flex-shrink: 0;
                width: 56px;
                position: relative;
            }
            @media (min-width: 1024px) { .ddm-arrow-h { display: flex; align-items: center; justify-content: center; } }
            .ddm-arrow-v {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 40px;
                flex-direction: column;
            }
            @media (min-width: 1024px) { .ddm-arrow-v { display: none; } }
            .ddm-dept-pill {
                display: flex;
                align-items: center;
                gap: 10px;
                background: white;
                border: 1.5px solid #e5e7eb;
                border-radius: 12px;
                padding: 10px 16px;
                font-size: 13px;
                font-weight: 600;
                color: #374151;
                transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
                box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            }
            .ddm-dept-pill:hover { border-color: var(--color-primary, #570df8); box-shadow: 0 4px 16px rgba(87,13,248,0.10); transform: translateX(3px); }
            .ddm-dept-icon {
                width: 28px; height: 28px; border-radius: 8px;
                background: linear-gradient(135deg, rgba(87,13,248,0.12), rgba(87,13,248,0.06));
                display: flex; align-items: center; justify-content: center; flex-shrink: 0;
            }
            .ddm-dept-icon svg { width: 14px; height: 14px; color: var(--color-primary, #570df8); stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
            .ddm-engine {
                background: linear-gradient(135deg, #570df8, #7c3aed);
                border-radius: 20px;
                padding: 32px 28px;
                color: white;
                text-align: center;
                box-shadow: 0 8px 40px rgba(87,13,248,0.30);
                min-width: 220px;
                align-self: center;
                position: relative;
                overflow: hidden;
            }
            .ddm-engine::before {
                content: '';
                position: absolute; inset: 0;
                background: radial-gradient(ellipse at top left, rgba(255,255,255,0.15), transparent 60%);
                pointer-events: none;
            }
            .ddm-engine-icon {
                width: 56px; height: 56px; border-radius: 16px;
                background: rgba(255,255,255,0.15);
                display: flex; align-items: center; justify-content: center;
                margin: 0 auto 14px;
            }
            .ddm-engine-icon svg { width: 28px; height: 28px; stroke: white; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
            .ddm-pulse-ring {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 100%; height: 100%;
                border-radius: 20px;
                border: 2px solid rgba(255,255,255,0.2);
                animation: ddm-pulse 2.5s ease-in-out infinite;
                pointer-events: none;
            }
            @keyframes ddm-pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                50% { transform: translate(-50%, -50%) scale(1.04); opacity: 0.15; }
            }
            .ddm-output-card {
                background: white;
                border-radius: 16px;
                padding: 20px 22px;
                border: 2px solid #e5e7eb;
                box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .ddm-output-card:hover { border-color: var(--color-primary, #570df8); box-shadow: 0 6px 24px rgba(87,13,248,0.12); }
            .ddm-output-badge {
                display: inline-flex; align-items: center; gap: 6px;
                font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
                padding: 4px 10px; border-radius: 20px; margin-bottom: 10px;
            }
            .ddm-connector-line {
                flex: 1;
                height: 2px;
                background: linear-gradient(90deg, rgba(87,13,248,0.3), rgba(87,13,248,0.6));
                position: relative;
            }
            .ddm-connector-line::after {
                content: '';
                position: absolute; right: -6px; top: 50%; transform: translateY(-50%);
                border-left: 8px solid rgba(87,13,248,0.6); border-top: 5px solid transparent; border-bottom: 5px solid transparent;
            }
            .ddm-connector-v {
                width: 2px;
                height: 32px;
                background: linear-gradient(180deg, rgba(87,13,248,0.3), rgba(87,13,248,0.6));
                margin: 0 auto;
                position: relative;
            }
            .ddm-connector-v::after {
                content: '';
                position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
                border-top: 8px solid rgba(87,13,248,0.6); border-left: 5px solid transparent; border-right: 5px solid transparent;
            }
            .ddm-tag {
                display: inline-flex; align-items: center; gap: 4px;
                font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
                padding: 3px 8px; border-radius: 6px;
            }
        </style>

        <div class="ddm-diagram">
            <!-- Left: Input Domains -->
            <div style="min-width:0; flex:1;">
                <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-4 text-center lg:text-left pl-1">Company Data Departments</div>
                <div class="ddm-col">
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>Revenue Collection</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z M8 12h8M8 8h8M8 16h5"/></svg></div>Financial Data</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>Sales Analysis</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m-1 9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2z"/></svg></div>Supply Chain</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM1 9h22M1 15h22"/></svg></div>Invoice Analysis</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg></div>Employee Performance</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>Energy Cost</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div>Production Line</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div>Timesheets</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>Product Analysis</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>Manufacturing</div>
                </div>
            </div>

            <!-- Arrow H (desktop) -->
            <div class="ddm-arrow-h" style="padding: 0 8px;">
                <div style="width:100%; position:relative; display:flex; align-items:center;">
                    <div style="flex:1; height:2px; background:linear-gradient(90deg, rgba(87,13,248,0.25),rgba(87,13,248,0.6));"></div>
                    <div style="border-left:9px solid rgba(87,13,248,0.6); border-top:6px solid transparent; border-bottom:6px solid transparent; flex-shrink:0;"></div>
                </div>
            </div>

            <!-- Arrow V (mobile) -->
            <div class="ddm-arrow-v" style="width:100%;"><div class="ddm-connector-v"></div></div>

            <!-- Center: Engine -->
            <div style="flex-shrink:0; display:flex; align-items:center; justify-content: center;">
                <div class="ddm-engine">
                    <div class="ddm-pulse-ring"></div>
                    <div class="ddm-engine-icon">
                        <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3" stroke="rgba(255,255,255,0.9)" fill="none"/><circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.8)"/><path d="M12 6V4M12 20v-2M6 12H4M20 12h-2" stroke="rgba(255,255,255,0.6)"/></svg>
                    </div>
                    <div style="font-weight:800; font-size:15px; margin-bottom:4px; position:relative;">Big Data Analysis Engine</div>
                    <div style="font-size:11px; opacity:0.8; position:relative; line-height:1.5;">High-volume processing<br>Sensitive data masked<br>Department-level analysis</div>
                    <div style="margin-top:14px; display:flex; gap:6px; justify-content:center; flex-wrap:wrap; position:relative;">
                        <span style="background:rgba(255,255,255,0.15); font-size:10px; padding:3px 8px; border-radius:6px; font-weight:600;">Up to 1 TB</span>
                        <span style="background:rgba(255,255,255,0.15); font-size:10px; padding:3px 8px; border-radius:6px; font-weight:600;">≈ 3 days</span>
                    </div>
                </div>
            </div>

            <!-- Arrow H (desktop) -->
            <div class="ddm-arrow-h" style="padding: 0 8px;">
                <div style="width:100%; position:relative; display:flex; align-items:center;">
                    <div style="flex:1; height:2px; background:linear-gradient(90deg, rgba(87,13,248,0.25),rgba(87,13,248,0.6));"></div>
                    <div style="border-left:9px solid rgba(87,13,248,0.6); border-top:6px solid transparent; border-bottom:6px solid transparent; flex-shrink:0;"></div>
                </div>
            </div>

            <!-- Arrow V (mobile) -->
            <div class="ddm-arrow-v" style="width:100%;"><div class="ddm-connector-v"></div></div>

            <!-- Right: Outputs -->
            <div style="min-width:0; flex:1;">
                <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-4 text-center lg:text-left pl-1">Output Per Department</div>
                <div class="ddm-col" style="gap:16px;">

                    <div class="ddm-output-card" style="border-color: rgba(87,13,248,0.2); background: linear-gradient(135deg, rgba(87,13,248,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(87,13,248,0.1); color:#570df8;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            PDF Report
                        </div>
                        <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#111827;">Department Analysis Report</div>
                        <div style="font-size:13px; color:#6b7280; line-height:1.6;">Current-state performance breakdown — what the data shows about how the department is running today.</div>
                        <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#f3f4f6; color:#374151;">Trends</span>
                            <span class="ddm-tag" style="background:#f3f4f6; color:#374151;">Bottlenecks</span>
                            <span class="ddm-tag" style="background:#f3f4f6; color:#374151;">Anomalies</span>
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; gap:10px; padding: 0 6px;">
                        <div style="flex:1; height:1px; background: linear-gradient(90deg, transparent, rgba(87,13,248,0.2), transparent);"></div>
                        <div style="font-size:11px; font-weight:700; color:rgba(87,13,248,0.5); text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap;">+ also includes</div>
                        <div style="flex:1; height:1px; background: linear-gradient(90deg, transparent, rgba(87,13,248,0.2), transparent);"></div>
                    </div>

                    <div class="ddm-output-card" style="border-color: rgba(16,185,129,0.25); background: linear-gradient(135deg, rgba(16,185,129,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(16,185,129,0.1); color:#059669;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            AI Opportunities
                        </div>
                        <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#111827;">Where to Implement AI First</div>
                        <div style="font-size:13px; color:#6b7280; line-height:1.6;">Ranked list of AI use cases with expected business impact — feeds directly into Service 2 planning.</div>
                        <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#ecfdf5; color:#065f46;">Revenue ↑</span>
                            <span class="ddm-tag" style="background:#ecfdf5; color:#065f46;">Cost ↓</span>
                            <span class="ddm-tag" style="background:#ecfdf5; color:#065f46;">Cash Flow ↑</span>
                        </div>
                    </div>

                    <div class="ddm-output-card" style="border-color: rgba(245,158,11,0.25); background: linear-gradient(135deg, rgba(245,158,11,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(245,158,11,0.1); color:#d97706;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            Task Queue
                        </div>
                        <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#111827;">Prioritised AI Task List</div>
                        <div style="font-size:13px; color:#6b7280; line-height:1.6;">Structured task backlog used as source input for Service 2 (AI Plan) and Service 3 (Build &amp; Setup).</div>
                        <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#fffbeb; color:#92400e;">→ Service 2</span>
                            <span class="ddm-tag" style="background:#fffbeb; color:#92400e;">→ Service 3</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Re-analysis note -->
        <div style="margin-top: 36px; background: linear-gradient(135deg, rgba(87,13,248,0.04), rgba(87,13,248,0.02)); border:1.5px solid rgba(87,13,248,0.12); border-radius:16px; padding: 18px 24px; display:flex; align-items:center; gap:14px; max-width:680px; margin-left:auto; margin-right:auto;">
            <div style="width:36px; height:36px; border-radius:10px; background:rgba(87,13,248,0.1); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </div>
            <div>
                <div style="font-weight:700; font-size:13px; color:#374151; margin-bottom:2px;">Re-analysis available</div>
                <div style="font-size:12px; color:#6b7280;">Subsequent runs reuse the previous PDF report alongside new data — no full reprocessing required.</div>
            </div>
        </div>
    </div>
</section>`;
}

function buildRealBusinessApplicationsSection() {
    return `
<section id="real-business-applications" class="section-spacing bg-base-200">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-black mb-4">
                <span class="gradient-header">Real Business Applications of AI</span>
            </h2>
            <p class="text-base text-base-content/60 max-w-3xl mx-auto">
                Implementation layer for Service 3. We turn approved opportunities into working business applications.
            </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-primary">
                <h3 class="text-xl font-bold mb-2">Revenue Collection Application</h3>
                <p class="text-sm text-base-content/70">Automated follow-up, promise-to-pay tracking, and escalation management.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-secondary">
                <h3 class="text-xl font-bold mb-2">Financial Data Application</h3>
                <p class="text-sm text-base-content/70">Cost control workflows, anomaly detection, and finance decision automation.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-accent">
                <h3 class="text-xl font-bold mb-2">Sales Analysis Application</h3>
                <p class="text-sm text-base-content/70">Pipeline recovery, quote follow-up, and conversion optimization workflows.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-primary">
                <h3 class="text-xl font-bold mb-2">Supply Chain Application</h3>
                <p class="text-sm text-base-content/70">Delay prediction, replenishment priorities, and procurement intelligence.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-secondary">
                <h3 class="text-xl font-bold mb-2">Product Analysis Application</h3>
                <p class="text-sm text-base-content/70">Margin insights, lifecycle actions, and product performance recommendations.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-accent">
                <h3 class="text-xl font-bold mb-2">Invoice and Timesheet Application</h3>
                <p class="text-sm text-base-content/70">Validation controls, exception routing, and approval acceleration.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-primary">
                <h3 class="text-xl font-bold mb-2">Employee Performance Application</h3>
                <p class="text-sm text-base-content/70">Manager signals, workload balancing, and productivity improvement workflows.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-secondary">
                <h3 class="text-xl font-bold mb-2">Energy Cost Application</h3>
                <p class="text-sm text-base-content/70">Peak reduction, energy optimization, and operational schedule improvements.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-accent">
                <h3 class="text-xl font-bold mb-2">Production and Manufacturing Application</h3>
                <p class="text-sm text-base-content/70">Downtime reduction, throughput stability, and process drift correction workflows.</p>
            </div>
        </div>
    </div>
</section>`;
}

function buildSolutionPageContent(templateName) {
    const blueprint = SOLUTION_PAGE_BLUEPRINTS[templateName];
    if (!blueprint) {
        return null;
    }

    const sections = blueprint.sections.map(section => {
        if (section.type === 'cards') {
            return renderSolutionCardsSection(section);
        }
        if (section.type === 'split') {
            return renderSolutionSplitSection(section);
        }
        if (section.type === 'process') {
            return renderSolutionProcessSection(section);
        }
        if (section.type === 'faq') {
            return renderSolutionFaqSection(section);
        }
        if (section.type === 'html') {
            return renderSolutionHtmlSection(section);
        }
        return '';
    });

    return {
        hero: blueprint.hero,
        section_1: sections[0] || '',
        section_2: sections[1] || '',
        section_3: sections[2] || '',
        section_4: sections[3] || '',
        section_5: sections[4] || '',
        section_6: sections[5] || '',
        cta: renderSolutionPageCTA(blueprint.cta),
        category: blueprint.category
    };
}

function stripServiceDescription(description) {
    return description
        .replace(/\s*in\s*\{\{CITY_NAME\}\}/gi, '')
        .replace(/\s*in\s*\{\{COUNTRY_NAME\}\}/gi, '')
        .replace(/\{\{CITY_NAME\}\}/g, '')
        .replace(/\{\{COUNTRY_NAME\}\}/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s([,.;:!?])/g, '$1')
        .trim();
}

function parseBenefitText(text) {
    const match = text.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
    if (match) {
        return { title: match[1], description: match[2] };
    }
    return { title: text.replace(/\*\*/g, ''), description: '' };
}

const SERVICE_PROBLEMS = {};

const SERVICE_PROCESSES = {
    'ai-solutions': [
        { title: 'We review the business need', description: 'We start with the real business question instead of jumping to a random tool.' },
        { title: 'We make the next step clear', description: 'We turn the findings into a simple order of work the business can actually follow.' },
        { title: 'We help people use it well', description: 'We train the team and keep things practical from the start.' }
    ],
    'custom-software': [
        { title: 'We scope the work clearly', description: 'We make the delivery boundaries simple before we start building.' },
        { title: 'We build the working setup', description: 'We build the tool, the workflow, and the connections around it.' },
        { title: 'We support it after launch', description: 'We stay available to fix, improve, and clean up the work over time.' }
    ]
};

function buildGenericServiceBlueprint(service, lang = 'en') {
    const categoryMeta = getCategoryMeta(service.category);
    const categoryContentKey = service.category;
    const categoryContent = serviceContent[categoryContentKey] && (serviceContent[categoryContentKey][lang] || serviceContent[categoryContentKey].en);
    if (!categoryMeta || !categoryContent) {
        return null;
    }

    const heroImageMap = {
        'ai-solutions': './assets/images/ai-workflow-dashboard.png',
        'custom-software': './assets/images/expandia managed operations.png'
    };

    const heroDescription = stripServiceDescription(service.description_template || service.title_template || service.name);
    const normalizeBenefit = (item) => {
        if (typeof item === 'string') return parseBenefitText(item);
        if (item && typeof item === 'object') {
            return {
                title: item.title || '',
                description: item.description || ''
            };
        }
        return { title: '', description: '' };
    };
    const benefits = ((service.outcomes && service.outcomes.length ? service.outcomes : categoryContent.benefits || [])
        .map(normalizeBenefit))
        .filter(item => item.title || item.description);
    const faqItems = ((service.faq && service.faq.length ? service.faq : categoryContent.faq || [])).slice(0, 4);
    const serviceProblems = service.problems || SERVICE_PROBLEMS[service.id] || [];
    const processSteps = service.process_steps || SERVICE_PROCESSES[service.category] || SERVICE_PROCESSES['custom-software'];
    const deliverables = service.deliverables || benefits
        .slice(0, 3)
        .map(item => item.title)
        .filter(Boolean)
        .join(', ');

    const rawSections = [
        // Section 1: Problems
        ...(serviceProblems.length > 0 ? [{
            type: 'problems',
            id: 'problems',
            sectionClass: 'bg-base-200',
            heading: 'Does this sound familiar?',
            intro: `These are the most common situations that lead companies to us for ${service.name}.`,
            problems: serviceProblems
        }] : []),
        // Section 2: What we cover
        {
            type: 'cards',
            id: 'capabilities',
            sectionClass: 'bg-base-100',
            heading: 'Scope, fit, and buying model',
            intro: 'A quick view of the practical deliverables, engagement model, and best-fit use case.',
            gridClass: 'md:grid-cols-2',
            cards: [
                { title: 'Deliverables', description: deliverables || 'Clear scope, implementation work, testing, handover, and the supporting workflow details.', borderClass: 'border-primary' },
                { title: 'Engagement model', description: service.commercial_model || 'We scope the work around the business need.', borderClass: 'border-secondary' },
                { title: 'Best fit', description: service.good_fit || `You need ${service.name.toLowerCase()} done properly, in plain English, with no wasted motion.`, borderClass: 'border-neutral' }
            ]
        },
        // Section 3: Benefits / Why choose us
        {
            type: 'split',
            id: 'why-it-matters',
            sectionClass: 'bg-base-200',
            heading: 'What changes when this is in place',
            intro: `The practical difference ${service.name} makes once it is working properly.`,
            bullets: benefits.slice(0, 3).map((item, index) => ({
                icon: ['shield-check', 'clock-3', 'layers-3'][index] || 'check',
                title: item.title,
                description: item.description
            })),
            image: heroImageMap[service.category] || heroImageMap['custom-software'],
            alt: service.name
        },
        // Section 4: Process
        {
            type: 'process',
            id: 'process',
            sectionClass: 'bg-base-100',
            heading: 'How we work',
            intro: 'A straightforward process with no surprises.',
            steps: processSteps
        },
        // Section 5: FAQ
        {
            type: 'faq',
            id: 'faq',
            sectionClass: 'bg-base-200',
            heading: 'Common questions',
            intro: `Answers to what companies usually ask before getting started with ${service.name}.`,
            items: faqItems
        }
    ];

    if (service.id === 'ai-plan') {
        rawSections.splice(2, 0, {
            type: 'html',
            html: buildAiPlanDiagramSection()
        });
    }

    const renderedSections = rawSections.map(section => {
        if (section.type === 'problems') return renderSolutionProblemsSection(section);
        if (section.type === 'cards') return renderSolutionCardsSection(section);
        if (section.type === 'split') return renderSolutionSplitSection(section);
        if (section.type === 'process') return renderSolutionProcessSection(section);
        if (section.type === 'faq') return renderSolutionFaqSection(section);
        if (section.type === 'html') return renderSolutionHtmlSection(section);
        return '';
    });

    const ctaObj = {
        heading: `Ready to start with ${service.name}?`,
        description: `We can scope ${service.name} in plain English and help you start with the part that matters most.`,
        buttonText: 'Talk to us'
    };

    return {
        hero: {
            badge: service.badge || categoryMeta.label,
            titlePrefix: service.name,
            titleSuffix: '',
            description: heroDescription,
            image: heroImageMap[service.category] || heroImageMap['custom-software'],
            alt: service.name,
            primaryCtaText: 'Get in touch',
            primaryCtaLink: 'contact.html',
            secondaryCtaText: 'See all solutions',
            secondaryCtaLink: 'solutions.html'
        },
        section_1: renderedSections[0] || '',
        section_2: renderedSections[1] || '',
        section_3: renderedSections[2] || '',
        section_4: renderedSections[3] || '',
        section_5: renderedSections[4] || '',
        section_6: renderedSections[5] || '',
        cta: renderSolutionPageCTA(ctaObj),
        category: service.category
    };
}

const LEGACY_REDIRECT_ONLY_PAGES = new Set();
const LEGACY_REDIRECT_TARGETS = {};
const REMOVED_BLOG_POST_SLUGS = new Set();

const RETIRED_CITY_SLUGS = new Set([
    'south-gloucestershire',
    'north-lanarkshire',
    'south-lanarkshire',
    'rhondda-cynon-taf',
    ...EAST_OF_ANKARA_CITY_SLUGS,
    ...RETIRED_LOW_POP_CITY_SLUGS,
    ...RETIRED_EASTERN_EUROPE_CITY_SLUGS,
    ...RETIRED_CONSERVATIVE_TRIM_CITY_SLUGS
]);
const RETIRED_CITY_REDIRECT_TARGET = 'solutions';

const LEGACY_CATEGORY_ANCHORS = {};

function rewriteLegacyHrefTargets(html) {
    return html.replace(/href=(["'])([^"']+)\1/g, (match, quote, url) => {
        if (/^(#|mailto:|tel:|javascript:|https?:\/\/)/i.test(url)) {
            return match;
        }

        const [pathPart, hashPart] = url.split('#');
        const [pathname, query] = pathPart.split('?');
        if (!pathname || !pathname.endsWith('.html')) {
            return match;
        }

        const slashIndex = pathname.lastIndexOf('/');
        const prefix = slashIndex >= 0 ? pathname.slice(0, slashIndex + 1) : '';
        const fileName = slashIndex >= 0 ? pathname.slice(slashIndex + 1) : pathname;
        const slug = fileName.replace(/\.html$/, '');

        if (!LEGACY_REDIRECT_ONLY_PAGES.has(slug)) {
            return match;
        }

        const anchor = LEGACY_CATEGORY_ANCHORS[slug] || '';
        const nextPath = `${prefix}solutions.html${anchor}`;
        const nextUrl = query ? `${nextPath}?${query}` : nextPath;
        const preserveHash = anchor ? '' : (hashPart ? `#${hashPart}` : '');
        return `href=${quote}${nextUrl}${preserveHash}${quote}`;
    });
}

const serviceMapping = {};

function getActiveStates(templateName) {
    const activeStates = {
        'index': { 'HOME_ACTIVE': 'text-primary', 'HOME_MOBILE_ACTIVE': 'class="font-semibold text-primary"' },
        'our-business-model': {},
        'solutions': { 'SOLUTIONS_ACTIVE': 'text-primary', 'SOLUTIONS_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'SOLUTIONS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'about': { 'COMPANY_ACTIVE': 'text-primary', 'ABOUT_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'ABOUT_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'contact': { 'COMPANY_ACTIVE': 'text-primary', 'CONTACT_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'CONTACT_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },

        'vision-mission': { 'COMPANY_ACTIVE': 'text-primary', 'VISION_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'VISION_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'our-ethical-principles': { 'COMPANY_ACTIVE': 'text-primary', 'ETHICS_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'ETHICS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'service-areas': { 'COMPANY_ACTIVE': 'text-primary' },
        'london-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'paris-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'berlin-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'madrid-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'amsterdam-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'milan-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'zurich-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'stockholm-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'dublin-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'lisbon-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'rome-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'vienna-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'copenhagen-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'prague-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'munich-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'hamburg-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'brussels-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'oslo-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'helsinki-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'warsaw-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'frankfurt-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'cologne-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'rotterdam-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'antwerp-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'lyon-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'valencia-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'athens-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'budapest-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'manchester-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'edinburgh-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'istanbul-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'marseille-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'naples-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'bucharest-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'porto-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'seville-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'florence-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'krakow-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'tallinn-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'riga-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'barcelona-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'new-york-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'los-angeles-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'chicago-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'houston-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'phoenix-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'philadelphia-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'san-antonio-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'san-diego-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'dallas-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'jacksonville-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'fort-worth-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'san-jose-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'austin-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'charlotte-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'columbus-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'toronto-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'montreal-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'sydney-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' },
        'melbourne-ai-agency': { 'COMPANY_ACTIVE': 'text-primary' }
    };
    return activeStates[templateName] || activeStates['index'];
}

function buildPage(templateName, outputName, lang = 'en') {
    if (LEGACY_REDIRECT_ONLY_PAGES.has(templateName)) {
        return;
    }

    if (lang !== 'en') {
        console.warn(`Skipping ${templateName} for unsupported language "${lang}". This site is English-only.`);
        return;
    }

    const templatePath = `templates/${templateName}.html`;
    if (!fs.existsSync(templatePath)) {
        console.warn(`Template not found: ${templatePath}`);
        return;
    }

    const rawTemplateContent = fs.readFileSync(templatePath, 'utf8');
    const res = extractAndRemoveSchemas(rawTemplateContent, templatePath);
    let content = res.cleanContent;
    const extractedSchemas = res.extractedSchemas;

    let htmlTemplate = createHTMLTemplate(lang);
    let pageNavigation = navigationEN;
    let pageFooter = footerEN;

    if (templateName === 'id_demo') {
        htmlTemplate = htmlTemplate.replace(
            `<html lang="${lang}" data-theme="bumblebee">`,
            `<html lang="${lang}" data-theme="bumblebee" class="id-demo-page">`
        );
        htmlTemplate = htmlTemplate.replace('</head>', `    <style>
        html.id-demo-page iframe[src*="tawk.to"],
        html.id-demo-page .tawk-min-container,
        html.id-demo-page .tawk-iframe-container {
            display: none !important;
            visibility: hidden !important;
        }

        .id-demo-chat-overlay {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(15, 23, 42, 0.64);
        }

        .id-demo-chat-overlay.is-open {
            display: flex;
        }

        .id-demo-chat-panel {
            width: min(760px, 100%);
            max-height: calc(100vh - 32px);
            min-height: min(680px, calc(100vh - 32px));
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid rgba(15, 23, 42, 0.12);
            background: #ffffff;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.24);
        }

        .id-demo-chat-header,
        .id-demo-chat-form {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border-color: rgba(15, 23, 42, 0.1);
        }

        .id-demo-chat-header {
            justify-content: space-between;
            border-bottom-width: 1px;
        }

        .id-demo-chat-form {
            border-top-width: 1px;
            background: #f8fafc;
        }

        .id-demo-chat-messages {
            flex: 1 1 auto;
            min-height: 280px;
            overflow-y: auto;
            padding: 18px;
            background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }

        .id-demo-chat-message {
            display: flex;
            margin-bottom: 14px;
        }

        .id-demo-chat-message-user {
            justify-content: flex-end;
        }

        .id-demo-chat-bubble {
            max-width: min(520px, 88%);
            border-radius: 14px;
            padding: 12px 14px;
            line-height: 1.5;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        .id-demo-chat-message-agent .id-demo-chat-bubble {
            border: 1px solid rgba(15, 23, 42, 0.1);
            background: #ffffff;
            color: #1f2937;
        }

        .id-demo-chat-message-user .id-demo-chat-bubble {
            background: #1f4b99;
            color: #ffffff;
        }

        .id-demo-chat-label {
            margin-bottom: 4px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            opacity: 0.7;
        }

        .id-demo-icon-button {
            display: inline-flex;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            border: 1px solid rgba(15, 23, 42, 0.12);
            background: #ffffff;
            color: #111827;
        }

        .id-demo-chat-input {
            flex: 1 1 auto;
            min-width: 0;
            height: 48px;
            border-radius: 12px;
            border: 1px solid rgba(15, 23, 42, 0.16);
            padding: 0 14px;
            background: #ffffff;
            color: #111827;
        }

        .id-demo-support-icon {
            background: rgba(31, 75, 153, 0.1);
            color: #1f4b99;
        }

        .id-demo-support-kicker {
            color: #1f4b99;
        }

        .id-demo-support-note {
            border-color: rgba(31, 75, 153, 0.2);
            background: rgba(31, 75, 153, 0.1);
        }

        #open-chatbot-demo,
        #id-demo-chat-submit {
            border-color: #1f4b99;
            background: #1f4b99;
            color: #ffffff;
        }

        #open-chatbot-demo:hover,
        #id-demo-chat-submit:hover {
            border-color: #173a78;
            background: #173a78;
        }

        @media (max-width: 640px) {
            .id-demo-chat-overlay {
                padding: 0;
                align-items: stretch;
            }

            .id-demo-chat-panel {
                min-height: 100vh;
                max-height: 100vh;
                border-radius: 0;
            }

            .id-demo-chat-form {
                align-items: stretch;
                flex-direction: column;
            }

            .id-demo-chat-input,
            .id-demo-chat-form .btn {
                width: 100%;
            }
        }
    </style>
</head>`);
    }

    // Calculate dynamic base path based on output depth
    const depth = outputName.split('/').length - 1;
    let relativePrefix = '';
    for (let i = 0; i < depth; i++) {
        relativePrefix += '../';
    }
    const navPath = relativePrefix || './';

    if (lang !== 'en') {
        relativePrefix += '../';
    }
    const basePath = relativePrefix || './';

    const logoPath = basePath + 'go-expandia-logo.png';
    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);

    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);

    // Flag logic
    pageNavigation = pageNavigation.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">EN</span>`);

    // Get active states for navigation
    const activeStates = getActiveStates(templateName);
    for (const [key, value] of Object.entries(activeStates)) {
        pageNavigation = pageNavigation.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    htmlTemplate = htmlTemplate.split('{{NAVIGATION}}').join(pageNavigation);
    htmlTemplate = htmlTemplate.split('{{MAIN_CONTENT}}').join(content);
    htmlTemplate = htmlTemplate.split('{{FOOTER}}').join(pageFooter);

    const pageMetadata = getPageMetadata(templateName, lang);
    const canonicalOutputName = outputName;
    const canonicalUrl = `https://www.goexpandia.com${toCanonicalPath(canonicalOutputName)}`;

    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/<meta name="robots" content="[^"]*">/i, `<meta name="robots" content="${escapeHtmlAttr(pageMetadata.robots || 'index, follow')}">`);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);

    // Schema - Aggregated
    const orgSchema = generateOrganizationSchema();
    let finalSchemas = [orgSchema];

    // Add dynamic FAQ/Service schema if this is a mapped service page
    const serviceKey = serviceMapping[templateName];
    if (serviceKey && serviceContent[serviceKey] && serviceContent[serviceKey][lang]) {
        const sData = serviceContent[serviceKey][lang];

        // Add Service Schema (reference Organization by name, not nested object)
        finalSchemas.push({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": pageMetadata.title.split('|')[0].trim(),
            "provider": "Go Expandia",
            "description": pageMetadata.description
        });

        if (sData.faq && sData.faq.length > 0) {
            finalSchemas.push({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": sData.faq.map(f => {
                    let question = f.q;
                    let answer = f.a;

                    // Root page cleanup: remove specific mentions of "for {{CITY}}" or "in {{CITY}}"
                    question = question.replace(/\s(for|in|at|across)\s\{\{CITY_NAME\}\}/gi, '')
                        .replace(/\s(in|across)\s\{\{COUNTRY_NAME\}\}/gi, '');
                    answer = answer.replace(/\s(for|in|at|across)\s\{\{CITY_NAME\}\}/gi, '')
                        .replace(/\s(in|across)\s\{\{COUNTRY_NAME\}\}/gi, '');

                    // Final fallback replacements just in case
                    question = question.replace(/\{\{CITY_NAME\}\}/g, 'your business').replace(/\{\{COUNTRY_NAME\}\}/g, 'your region');
                    answer = answer.replace(/\{\{CITY_NAME\}\}/g, 'your business').replace(/\{\{COUNTRY_NAME\}\}/g, 'your region');

                    return {
                        "@type": "Question",
                        "name": question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": answer
                        }
                    };
                })
            });
        }
    }

    extractedSchemas.forEach(s => {
        const schemas = s["@graph"] ? s["@graph"] : [s];

        schemas.forEach(item => {
            // Deduplicate Organization - but check if it's nested in a Service provider
            if (item["@type"] === "Organization" && (item.name === "Go Expandia" || item.url === "https://www.goexpandia.com")) {
                // Skip standalone Organization schemas, but Service schemas with nested Org are OK
                return;
            }

            // For Service schemas, check if they have a nested Organization provider
            // If so, we keep the Service but don't separately add the Organization
            if (item["@type"] === "Service") {
                // If we already generated a Service dynamically, skip this extracted one
                if (serviceKey) {
                    return;
                }
                // Keep the Service schema as-is (with its nested Organization provider)
                finalSchemas.push(item);
                return;
            }

            // Deduplicate FAQPage if we already have one from dynamic logic
            if (item["@type"] === "FAQPage" && serviceKey) {
                return;
            }

            finalSchemas.push(item);
        });
    });

    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(finalSchemas, null, 2));

    // Hreflang Tags in HEAD
    const pageUrlEn = outputName === 'index' ? '' : `${outputName}.html`;
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, pageUrlEn);


    htmlTemplate = rewriteLegacyHrefTargets(htmlTemplate);

    let outputPath = `${outputName}.html`;
    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
    console.log(`✅ Built ${outputPath}`);
}

function buildSolutionPage(templateName, outputName, lang = 'en') {
    if (LEGACY_REDIRECT_ONLY_PAGES.has(templateName)) {
        return;
    }

    if (lang !== 'en') {
        console.warn(`Skipping solution page ${templateName} for unsupported language "${lang}". This site is English-only.`);
        return;
    }

    const service = services.find((item) => item.id === templateName);
    const blueprint = buildSolutionPageContent(templateName) || (service ? buildGenericServiceBlueprint(service, lang) : null);
    if (!blueprint) {
        console.warn(`Solution page blueprint not found for ${templateName}`);
        return;
    }

    const templatePath = 'templates/solution-page.html';
    if (!fs.existsSync(templatePath)) {
        console.warn(`Solution page template not found: ${templatePath}`);
        return;
    }

    const rawTemplateContent = fs.readFileSync(templatePath, 'utf8');
    const res = extractAndRemoveSchemas(rawTemplateContent, templatePath);
    let content = res.cleanContent;
    const extractedSchemas = res.extractedSchemas;

    let htmlTemplate = createHTMLTemplate(lang);
    let pageNavigation = navigationEN;
    let pageFooter = footerEN;

    const depth = outputName.split('/').length - 1;
    let relativePrefix = '';
    for (let i = 0; i < depth; i++) {
        relativePrefix += '../';
    }
    const navPath = relativePrefix || './';

    const basePath = relativePrefix || './';
    const logoPath = basePath + 'go-expandia-logo.png';

    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);

    content = content
        .replace(/\{\{HERO_BADGE\}\}/g, blueprint.hero.badge)
        .replace(/\{\{HERO_TITLE_PREFIX\}\}/g, blueprint.hero.titlePrefix)
        .replace(/\{\{HERO_TITLE_SUFFIX\}\}/g, blueprint.hero.titleSuffix)
        .replace(/\{\{HERO_DESCRIPTION\}\}/g, blueprint.hero.description)
        .replace(/\{\{PRIMARY_CTA_TEXT\}\}/g, blueprint.hero.primaryCtaText)
        .replace(/\{\{PRIMARY_CTA_LINK\}\}/g, blueprint.hero.primaryCtaLink)
        .replace(/\{\{SECONDARY_CTA_TEXT\}\}/g, blueprint.hero.secondaryCtaText)
        .replace(/\{\{SECONDARY_CTA_LINK\}\}/g, blueprint.hero.secondaryCtaLink)
        .replace(/\{\{HERO_IMAGE\}\}/g, blueprint.hero.image)
        .replace(/\{\{HERO_IMAGE_ALT\}\}/g, blueprint.hero.alt)
        .replace(/\{\{SECTION_1\}\}/g, blueprint.section_1 || '')
        .replace(/\{\{SECTION_2\}\}/g, blueprint.section_2 || '')
        .replace(/\{\{SECTION_3\}\}/g, blueprint.section_3 || '')
        .replace(/\{\{SECTION_4\}\}/g, blueprint.section_4 || '')
        .replace(/\{\{SECTION_5\}\}/g, blueprint.section_5 || '')
        .replace(/\{\{SECTION_6\}\}/g, blueprint.section_6 || '')
        .replace(/\{\{CTA_SECTION\}\}/g, blueprint.cta || '');

    pageNavigation = pageNavigation.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">EN</span>`);

    const activeStates = getActiveStates('solutions');
    for (const [key, value] of Object.entries(activeStates)) {
        pageNavigation = pageNavigation.replace(new RegExp(`\\{\\{${key}\\}\}`, 'g'), value);
    }

    htmlTemplate = htmlTemplate.split('{{NAVIGATION}}').join(pageNavigation);
    htmlTemplate = htmlTemplate.split('{{MAIN_CONTENT}}').join(content);
    htmlTemplate = htmlTemplate.split('{{FOOTER}}').join(pageFooter);

    const pageMetadata = getPageMetadata(templateName, lang);
    const canonicalOutputName = outputName;
    const canonicalUrl = `https://www.goexpandia.com${toCanonicalPath(canonicalOutputName)}`;

    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);

    const categoryKey = blueprint.category;
    const serviceKey = categoryKey;
    const serviceData = serviceKey && serviceContent[serviceKey] && serviceContent[serviceKey][lang]
        ? serviceContent[serviceKey][lang]
        : serviceContent[serviceKey] && serviceContent[serviceKey]['en'];

    const orgSchema = generateOrganizationSchema();
    let finalSchemas = [orgSchema];

    if (serviceData && serviceData.faq && serviceData.faq.length > 0) {
        finalSchemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": serviceData.faq.map(f => {
                let question = f.q;
                let answer = f.a;
                question = question.replace(/\s(for|in|at|across)\s\{\{CITY_NAME\}\}/gi, '')
                    .replace(/\s(in|across)\s\{\{COUNTRY_NAME\}\}/gi, '');
                answer = answer.replace(/\s(for|in|at|across)\s\{\{CITY_NAME\}\}/gi, '')
                    .replace(/\s(in|across)\s\{\{COUNTRY_NAME\}\}/gi, '');
                question = question.replace(/\{\{CITY_NAME\}\}/g, 'your business').replace(/\{\{COUNTRY_NAME\}\}/g, 'your region');
                answer = answer.replace(/\{\{CITY_NAME\}\}/g, 'your business').replace(/\{\{COUNTRY_NAME\}\}/g, 'your region');
                return {
                    "@type": "Question",
                    "name": question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": answer
                    }
                };
            })
        });
    }

    extractedSchemas.forEach(s => {
        const schemas = s["@graph"] ? s["@graph"] : [s];
        schemas.forEach(item => {
            if (item["@type"] === "Organization" && (item.name === "Go Expandia" || item.url === "https://www.goexpandia.com")) {
                return;
            }
            if (item["@type"] === "FAQPage" && serviceKey) {
                return;
            }
            finalSchemas.push(item);
        });
    });

    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(finalSchemas, null, 2));
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${outputName}.html`);
    htmlTemplate = clearUnresolvedTemplateTokens(htmlTemplate);

    htmlTemplate = rewriteLegacyHrefTargets(htmlTemplate);

    const outputPath = `${outputName}.html`;
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
    console.log(`✅ Built ${outputPath}`);
}

// Blog Post Building Function
function buildBlogPost(templateName, outputName) {
    // console.log(`🏗️  Building blog post: ${outputName}`);

    const basePath = '../';
    const navPath = '../';
    const logoPath = '../go-expandia-logo.png';

    // Read blog post template
    let blogTemplate;
    const templateDir = 'templates/blog';
    const templatePath = `${templateDir}/${templateName}.html`;

    if (fs.existsSync(templatePath)) {
        blogTemplate = fs.readFileSync(templatePath, 'utf8');
    } else {
        console.log(`⚠️  Blog template ${templatePath} not found`);
        return;
    }

    // Blog pages are now EN-only.
    let nav = navigationEN;
    let foot = footerEN;

    const res = extractAndRemoveSchemas(blogTemplate, templatePath);
    let content = res.cleanContent;
    const extractedSchemas = res.extractedSchemas;

    // Apply navPath to nav/foot BEFORE merging
    nav = nav.replace(/\{\{BASE_PATH\}\}/g, navPath);
    foot = foot.replace(/\{\{BASE_PATH\}\}/g, navPath);

    // Process includes
    content = content.replace('{{HEADER_INCLUDE}}', nav);
    content = content.replace('{{FOOTER_INCLUDE}}', foot);

    // Flag logic
    const currentFlag = 'EN';
    content = content.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">${currentFlag}</span>`);

    // Replace path placeholders
    content = content.replace(/(href|src)="\{\{BASE_PATH\}\}([^"]+\.(css|ico|png|jpg|jpeg|js|svg))"/g, `$1="${basePath}$2"`);
    content = content.replace(/\{\{BASE_PATH\}\}/g, navPath);
    content = content.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

    // Set active states for navigation
    content = content.replace(/\{\{HOME_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{SOLUTIONS_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{ABOUT_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CONTACT_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{BLOG_ACTIVE\}\}/g, 'text-primary');

    // Clear mobile active states
    content = content.replace(/\{\{HOME_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{SOLUTIONS_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{ABOUT_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CONTACT_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{BLOG_MOBILE_ACTIVE\}\}/g, 'class="text-primary font-semibold"');

    // Clear other placeholder states
    content = content.replace(/\{\{SOLUTIONS_ITEM_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CASESTUDIES_ITEM_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{ABOUT_ITEM_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CONTACT_ITEM_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CASESTUDIES_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{COMPANY_ACTIVE\}\}/g, '');

    // Replace navigation page placeholders
    content = content.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    content = content.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');

    const outputPath = `blog/${outputName}.html`;

    const canonicalUrl = `https://www.goexpandia.com${toCanonicalPath(`blog/${outputName}`)}`;
    content = content.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);
    content = enforceCanonicalMeta(content, canonicalUrl);
    content = content.replace(/https:\/\/www\.goexpandia\.com\/templates\/blog\/index\.html/g, 'https://www.goexpandia.com/blog/index.html');

    const blogInfo = getBlogPostInfo(outputName);
    const derivedMeta = deriveBlogMeta(content, outputName);
    const pageMeta = {
        title: /go expandia/i.test(blogInfo.title) ? blogInfo.title : `${blogInfo.title} | Go Expandia`,
        description: blogInfo.description || derivedMeta.description,
        keywords: blogInfo.keywords || derivedMeta.keywords
    };
    content = content.replace(/\{\{PAGE_TITLE\}\}/g, pageMeta.title);
    content = content.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMeta.description);
    content = content.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMeta.keywords);
    content = enforceSeoMetaTags(content, pageMeta.title, pageMeta.description, pageMeta.keywords);
    content = enforceBlogCategoryMeta(content, { ...blogInfo, keywords: pageMeta.keywords });

    // Ensure blog directory exists
    const blogDir = path.dirname(outputPath);
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }

    // Add Lucide icons initialization script before closing body tag
    const lucideScript = `
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
        
        // FAQ Toggle Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const faqItems = document.querySelectorAll('.collapse');
            faqItems.forEach(item => {
                const title = item.querySelector('.collapse-title');
                const content = item.querySelector('.collapse-content');
                const input = item.querySelector('input[type="radio"], input[type="checkbox"]');
                
                if (title && content) {
                    // Initially hide all content except the first one
                    if (!input || !input.checked) {
                        content.style.display = 'none';
                    }
                    
                    title.style.cursor = 'pointer';
                    title.addEventListener('click', function() {
                        const isOpen = content.style.display !== 'none';
                        
                        // Close all other FAQs if using radio buttons
                        if (input && input.type === 'radio') {
                            const allItems = document.querySelectorAll('.collapse');
                            allItems.forEach(otherItem => {
                                const otherContent = otherItem.querySelector('.collapse-content');
                                const otherInput = otherItem.querySelector('input[type="radio"]');
                                if (otherContent && otherItem !== item) {
                                    otherContent.style.display = 'none';
                                    if (otherInput) otherInput.checked = false;
                                }
                            });
                        }
                        
                        // Toggle current item
                        content.style.display = isOpen ? 'none' : 'block';
                        if (input) input.checked = !isOpen;
                    });
                }
            });
        });
    </script>

    <!-- Start of HubSpot Embed Code -->
    <script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/145104780.js"></script>
    <!-- End of HubSpot Embed Code -->
</body>`;
    content = content.replace('</body>', lucideScript);

    // Fix related post links: convert absolute blog hrefs to relative only for anchors.
    content = content.replace(/(<a\b[^>]*\shref=")https:\/\/www\.goexpandia\.com\/blog\//gi, '$1');

    // Fix related posts: ensure all cards have badges and clean structure
    content = content.replace(
        /<div class="card bg-base-200 hover:shadow-lg transition-shadow">\s*<div class="card-body">\s*<h4 class="card-title/g,
        '<div class="card bg-base-200 hover:shadow-lg transition-shadow">\n                <div class="card-body">\n                    <span class="badge badge-primary mb-2">Article</span>\n                    <h4 class="card-title'
    );

    // Normalize stray template/markdown artifacts if present.
    content = content
        .replace(/\{\{CITY_NAME\}\}/g, 'your market')
        .replace(/\{\{COUNTRY_NAME\}\}/g, 'your region')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    content = clearUnresolvedTemplateTokens(content);

    // Clean up overly long titles in related posts (remove " | Go Expandia..." suffix)
    content = content.replace(
        /(<a href="[^"]*"[^>]*>)([^<]+?) \| Go Expandia[^<]*(<\/a>)/g,
        '$1$2$3'
    );

    // Schema - Aggregated for Blog
    const orgSchema = generateOrganizationSchema();
    let finalSchemas = [orgSchema];

    extractedSchemas.forEach(s => {
        if (s["@type"] === "Organization" && (s.name === "Go Expandia" || s.url === "https://www.goexpandia.com")) {
            return;
        }
        finalSchemas.push(s);
    });
    finalSchemas = decorateBlogSchemas(finalSchemas, pageMeta, canonicalUrl, blogInfo);

    const schemaString = `<script type="application/ld+json">\n${JSON.stringify(finalSchemas, null, 2)}\n</script>`;

    if (content.includes('{{SCHEMA_MARKUP}}')) {
        content = content.replace('{{SCHEMA_MARKUP}}', schemaString);
    } else {
        content = content.replace('</head>', `${schemaString}\n</head>`);
    }

            content = rewriteLegacyHrefTargets(content);
            fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`✅ Built blog post: ${outputPath}`);
}

// Blog Post Building Function
function buildBlogPosts() {
    console.log('\n🏗️  Building Blog Posts (EN Only)...');
    const languages = ['en'];
    let totalBuilt = 0;

    // Use English templates as the master list
    const masterBlogDir = 'templates/blog';
    if (!fs.existsSync(masterBlogDir)) {
        console.log('⚠️ Master blog templates directory not found.');
        return;
    }

    const files = fs.readdirSync(masterBlogDir).filter(file => {
        if (!file.endsWith('.html')) return false;
        const slug = file.replace(/\.html$/, '');
        return !REMOVED_BLOG_POST_SLUGS.has(slug);
    });

    languages.forEach(lang => {
        files.forEach(file => {
            const templateName = file.replace('.html', '');
            buildBlogPost(templateName, templateName);
        });
        console.log(`✅ Built ${files.length} blog posts for ${lang.toUpperCase()}.`);
        totalBuilt += files.length;
    });
    console.log(`✅ Total Blog Posts Built: ${totalBuilt}`);
}


function clearUnresolvedTemplateTokens(html) {
    return html.replace(/\{\{[^{}]+\}\}/g, '');
}



const PRIORITY_SERVICE_CITY_PATHS = new Set();


function formatServiceAreaMeta(area) {
    return [area.state, area.country].filter(Boolean).join(', ');
}

function formatServiceAreaSlug(slug) {
    return slug
        .split('-')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function collectServiceAreaPageLinks() {
    const serviceAreaById = new Map(serviceAreas.map(area => [area.id, area]));
    const templateFiles = fs.readdirSync('templates')
        .filter(file => file.endsWith('-ai-agency.html'))
        .sort();

    return templateFiles.map(file => {
        const id = file.replace(/-ai-agency\.html$/, '');
        const area = serviceAreaById.get(id);
        return {
            id,
            city: area ? area.city : formatServiceAreaSlug(id),
            meta: area ? formatServiceAreaMeta(area) : 'AI agency service area',
            market: area ? area.market : 'Europe',
            url: `${id}-ai-agency.html`
        };
    }).sort((a, b) => a.city.localeCompare(b.city));
}

function generateServiceAreaDirectoryLinks(serviceAreaPageLinks) {
    return `
            <div class="service-area-directory-grid">
                ${serviceAreaPageLinks.map(page => `
                    <a href="./${page.url}">
                        <span>${escapeHtmlText(page.city)}</span>
                        <small>${escapeHtmlText(page.meta)}</small>
                    </a>`).join('')}
            </div>`;
}

function generateServiceAreaGroups() {
    const marketOrder = ['Europe', 'United States', 'Canada', 'Australia'];
    const marketColors = {
        Europe: '#cb102c',
        'United States': '#2563eb',
        Canada: '#16a34a',
        Australia: '#f59e0b'
    };

    return marketOrder.map(market => {
        const areas = serviceAreas.filter(area => area.market === market);
        const areaItems = areas.map(area => `
                    <li class="flex items-start justify-between gap-3 py-2 border-b border-base-200 last:border-b-0">
                        <a href="./${area.id}-ai-agency.html" class="font-semibold text-base-content hover:text-primary">${escapeHtmlText(area.city)}</a>
                        <span class="text-sm text-base-content/55 text-right">${escapeHtmlText(formatServiceAreaMeta(area))}</span>
                    </li>`).join('');

        return `
            <section class="rounded-lg border border-base-200 bg-white p-5 shadow-sm">
                <div class="flex items-center gap-3 mb-4">
                    <span class="w-3 h-3 rounded-full" style="background-color: ${marketColors[market]};"></span>
                    <div>
                        <h3 class="text-xl font-black text-base-content">${escapeHtmlText(market)}</h3>
                        <p class="text-sm text-base-content/60">${areas.length} service areas</p>
                    </div>
                </div>
                <ul>
                    ${areaItems}
                </ul>
            </section>`;
    }).join('\n');
}

function buildServiceAreasPage() {
    console.log('\n🏗️  Building Service Areas Page...');

    const templateContent = fs.readFileSync('templates/service-areas.html', 'utf8');
    const lang = 'en';
    const serviceAreaPageLinks = collectServiceAreaPageLinks();
    const marketCounts = serviceAreas.reduce((acc, area) => {
        acc[area.market] = (acc[area.market] || 0) + 1;
        return acc;
    }, {});

    const headContent = `
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin="">
    <style>
        .service-area-tool {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(320px, 390px);
            gap: 1rem;
            align-items: stretch;
        }

        .service-map-frame {
            position: relative;
            min-width: 0;
            border-radius: 0.5rem;
            overflow: hidden;
            border: 1px solid rgba(15, 23, 42, 0.12);
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
            background: #dbe4ee;
        }

        .service-area-map {
            width: 100%;
            min-height: 640px;
            height: min(78vh, 760px);
            z-index: 1;
        }

        .service-map-badge {
            position: absolute;
            left: 1rem;
            top: 1rem;
            z-index: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.55rem 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.5);
            background: rgba(15, 23, 42, 0.82);
            color: #fff;
            font-size: 0.8125rem;
            font-weight: 800;
            box-shadow: 0 12px 24px rgba(15, 23, 42, 0.22);
            backdrop-filter: blur(10px);
        }

        .service-area-controls {
            border-radius: 0.5rem;
            border: 1px solid rgba(15, 23, 42, 0.12);
            background: rgba(255, 255, 255, 0.96);
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            min-height: 640px;
            height: min(78vh, 760px);
            overflow: hidden;
        }

        .service-area-controls > div:last-child {
            flex: 1 1 auto;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }

        .service-filter-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.5rem;
        }

        .service-filter-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            min-height: 2.75rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(15, 23, 42, 0.12);
            background: #fff;
            padding: 0.55rem 0.65rem;
            color: #1f2937;
            font-size: 0.8125rem;
            font-weight: 800;
            transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        }

        .service-filter-button:hover,
        .service-filter-button.is-active {
            border-color: var(--filter-color);
            box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
            transform: translateY(-1px);
        }

        .service-filter-button.is-active {
            background: color-mix(in srgb, var(--filter-color) 10%, white);
        }

        .service-filter-dot {
            width: 0.6rem;
            height: 0.6rem;
            flex: 0 0 auto;
            border-radius: 999px;
            background: var(--filter-color);
        }

        .service-area-selected {
            border-radius: 0.5rem;
            border: 1px solid rgba(203, 16, 44, 0.2);
            background: #fff8f8;
            padding: 1rem;
        }

        .service-area-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex: 1 1 auto;
            min-height: 0;
            max-height: none;
            overflow: auto;
            padding-right: 0.25rem;
        }

        .service-area-row {
            width: 100%;
            min-height: 3.75rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(15, 23, 42, 0.1);
            background: #fff;
            padding: 0.7rem 0.8rem;
            text-align: left;
            transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        }

        .service-area-row:hover,
        .service-area-row.is-selected {
            border-color: var(--row-color);
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.1);
            transform: translateY(-1px);
        }

        .service-marker-pin {
            width: 1.35rem;
            height: 1.35rem;
            border-radius: 999px;
            background: var(--marker-color);
            border: 3px solid #fff;
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.32);
            position: relative;
        }

        .service-marker-pin::after {
            content: "";
            position: absolute;
            inset: -0.42rem;
            border: 1px solid var(--marker-color);
            border-radius: 999px;
            opacity: 0.32;
        }

        .service-marker-pin.is-selected {
            width: 1.65rem;
            height: 1.65rem;
            box-shadow: 0 12px 26px rgba(15, 23, 42, 0.42);
        }

        .service-area-popup .leaflet-popup-content-wrapper {
            border-radius: 0.5rem;
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
        }

        .service-area-popup .leaflet-popup-content {
            margin: 0;
            width: 240px !important;
        }

        .service-popup-inner {
            padding: 1rem;
        }

        .service-area-popup .service-popup-inner a.btn {
            color: #fff !important;
            text-decoration: none;
        }

        .service-area-directory {
            position: absolute;
            left: 1rem;
            bottom: 1rem;
            z-index: 600;
            width: min(420px, calc(100vw - 2rem));
            max-height: min(52vh, 28rem);
            overflow: hidden;
            border: 1px solid rgba(15, 23, 42, 0.16);
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.96);
            box-shadow: 0 18px 44px rgba(15, 23, 42, 0.18);
            backdrop-filter: blur(12px);
        }

        .service-area-directory[open] {
            overflow: auto;
        }

        .service-area-directory summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            min-height: 3rem;
            padding: 0.85rem 1rem;
            color: #0f172a;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 900;
            list-style: none;
        }

        .service-area-directory summary::-webkit-details-marker {
            display: none;
        }

        .service-area-directory summary::after {
            content: "+";
            color: #cb102c;
            font-size: 1.15rem;
            font-weight: 900;
            line-height: 1;
        }

        .service-area-directory[open] summary::after {
            content: "-";
        }

        .service-area-directory-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.45rem;
            max-height: 22rem;
            overflow: auto;
            padding: 0 0.85rem 0.85rem;
        }

        .service-area-directory-grid a {
            display: block;
            min-width: 0;
            border-radius: 0.45rem;
            border: 1px solid rgba(15, 23, 42, 0.1);
            background: #fff;
            padding: 0.55rem 0.65rem;
            color: #0f172a;
            text-decoration: none;
            transition: border-color 160ms ease, transform 160ms ease;
        }

        .service-area-directory-grid a:hover {
            border-color: #cb102c;
            transform: translateY(-1px);
        }

        .service-area-directory-grid span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.8rem;
            font-weight: 900;
            line-height: 1.25;
        }

        .service-area-directory-grid small {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 0.15rem;
            color: #64748b;
            font-size: 0.68rem;
            line-height: 1.2;
        }

        @media (max-width: 1023px) {
            .service-area-tool {
                grid-template-columns: 1fr;
            }

            .service-area-controls {
                height: auto;
                min-height: 0;
                overflow: visible;
            }

            .service-area-controls > div:last-child {
                display: block;
            }

            .service-area-map {
                height: 58vh;
                min-height: 420px;
            }

            .service-area-list {
                max-height: 22rem;
            }
        }

        @media (max-width: 640px) {
            .service-filter-grid {
                grid-template-columns: 1fr;
            }

            .service-area-map {
                height: 68vh;
                min-height: 390px;
            }

            .service-area-directory {
                left: 0.75rem;
                right: 0.75rem;
                bottom: 0.75rem;
                width: auto;
            }

            .service-area-directory-grid {
                grid-template-columns: 1fr;
            }
        }

        html,
        body {
            height: 100%;
            overflow: hidden;
        }

        .service-map-page {
            position: relative;
            width: 100vw;
            height: calc(100vh - 4rem);
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #dbe4ee;
        }

        .service-map-page .service-area-map {
            width: 100vw;
            height: calc(100vh - 4rem) !important;
            min-height: 0 !important;
            border: 0;
            z-index: 1;
        }
    </style>`;

    const scriptContent = `
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossorigin=""></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            if (!window.L) return;

            const serviceAreas = ${JSON.stringify(serviceAreas)};
            const marketColors = {
                Europe: '#cb102c',
                'United States': '#2563eb',
                Canada: '#16a34a',
                Australia: '#f59e0b'
            };
            const mapElement = document.getElementById('service-area-map');
            if (!mapElement) return;

            const allBounds = L.latLngBounds(serviceAreas.map(area => [area.lat, area.lng]));

            const map = L.map(mapElement, {
                scrollWheelZoom: true,
                worldCopyJump: true,
                minZoom: 2
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                maxZoom: 18
            }).addTo(map);

            function escapeHtml(value) {
                return String(value || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }

            function areaMeta(area) {
                return [area.state, area.country].filter(Boolean).join(', ');
            }

            function contactUrl(area) {
                return 'contact.html?service-area=' + encodeURIComponent(area.city + ', ' + area.country);
            }

            function cityPageUrl(area) {
                return area.id + '-ai-agency.html';
            }

            function createIcon(area, isSelected) {
                const color = marketColors[area.market] || '#0f172a';
                return L.divIcon({
                    className: '',
                    html: '<div class="service-marker-pin' + (isSelected ? ' is-selected' : '') + '" style="--marker-color: ' + color + ';"></div>',
                    iconSize: isSelected ? [27, 27] : [22, 22],
                    iconAnchor: isSelected ? [13, 13] : [11, 11],
                    popupAnchor: [0, -10]
                });
            }

            serviceAreas.forEach(area => {
                const color = marketColors[area.market] || '#0f172a';
                const marker = L.marker([area.lat, area.lng], {
                    icon: createIcon(area, false)
                }).addTo(map);
                marker.bindPopup(
                    '<div class="service-popup-inner">' +
                        '<div class="flex items-center gap-2 mb-2"><span class="w-3 h-3 rounded-full" style="background-color: ' + color + ';"></span><strong class="text-base-content">' + escapeHtml(area.city) + '</strong></div>' +
                        '<p class="text-sm text-base-content/65 mb-1">' + escapeHtml(areaMeta(area)) + '</p>' +
                        '<p class="text-sm text-base-content/65 mb-3">Remote AI service area, not an office.</p>' +
                        '<a class="btn btn-primary btn-sm w-full mb-2" href="' + cityPageUrl(area) + '">View ' + escapeHtml(area.city) + ' page</a>' +
                        '<a class="text-sm font-bold text-primary hover:underline" href="' + contactUrl(area) + '">Start in ' + escapeHtml(area.city) + '</a>' +
                    '</div>',
                    { className: 'service-area-popup' }
                );
            });

            function fitMap() {
                map.invalidateSize();
                map.fitBounds(allBounds.pad(0.08), { maxZoom: 4, animate: false });
            }

            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_API.onLoad = function () {
                if (typeof window.Tawk_API.hideWidget === 'function') {
                    window.Tawk_API.hideWidget();
                }
            };

            requestAnimationFrame(fitMap);
            window.addEventListener('resize', fitMap);
        });
    </script>`;

    let htmlTemplate = createHTMLTemplate(lang, headContent, scriptContent);
    let content = templateContent
        .replace(/\{\{SERVICE_AREA_COUNT\}\}/g, String(serviceAreas.length))
        .replace(/\{\{EUROPE_COUNT\}\}/g, String(marketCounts.Europe || 0))
        .replace(/\{\{USA_COUNT\}\}/g, String(marketCounts['United States'] || 0))
        .replace(/\{\{CANADA_COUNT\}\}/g, String(marketCounts.Canada || 0))
        .replace(/\{\{AUSTRALIA_COUNT\}\}/g, String(marketCounts.Australia || 0))
        .replace(/\{\{SERVICE_AREA_LINKS\}\}/g, generateServiceAreaDirectoryLinks(serviceAreaPageLinks))
        .replace(/\{\{SERVICE_AREA_GROUPS\}\}/g, generateServiceAreaGroups());

    let pageNavigation = navigationEN;
    let pageFooter = footerEN;
    const basePath = './';
    const logoPath = 'go-expandia-logo.png';
    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

    htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
    htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
    htmlTemplate = htmlTemplate.replace('{{FOOTER}}', '');

    const pageMetadata = getPageMetadata('service-areas', lang);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, 'https://www.goexpandia.com/service-areas.html');
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, 'service-areas.html');

    const serviceAreaSchema = [
        generateOrganizationSchema(),
        generateBreadcrumbSchema([
            { name: 'Home', url: 'https://www.goexpandia.com/' },
            { name: 'Service Areas', url: 'https://www.goexpandia.com/service-areas.html' }
        ]),
        {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'AI agency service areas',
            serviceType: 'AI automation, AI consulting, AI agents, custom AI solutions, AI training, and AI support',
            provider: {
                '@type': 'Organization',
                name: 'Go Expandia',
                url: 'https://www.goexpandia.com/'
            },
            areaServed: serviceAreas.map(area => ({
                '@type': 'City',
                name: `${area.city}, ${formatServiceAreaMeta(area)}`
            }))
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Go Expandia AI agency service area pages',
            itemListElement: serviceAreaPageLinks.map((page, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: `${page.city} AI agency service area`,
                url: `https://www.goexpandia.com/${page.url}`
            }))
        }
    ];

    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(serviceAreaSchema, null, 2));
    htmlTemplate = clearUnresolvedTemplateTokens(htmlTemplate);
    htmlTemplate = rewriteLegacyHrefTargets(htmlTemplate);
    htmlTemplate = htmlTemplate.replace(/[ \t]+$/gm, '');

    fs.writeFileSync('service-areas.html', htmlTemplate, 'utf8');
    console.log(`✅ Built service-areas.html with ${serviceAreas.length} service areas.`);
}

function collectPublishedHtmlFiles() {
    const outputFiles = new Set();

    fs.readdirSync('.', { withFileTypes: true }).forEach(entry => {
        if (entry.isFile() && entry.name.endsWith('.html')) {
            outputFiles.add(entry.name);
        }
    });

    const outputDirs = ['blog', 'glossary'];
    const collectRecursive = (dirPath) => {
        if (!fs.existsSync(dirPath)) return;
        fs.readdirSync(dirPath, { withFileTypes: true }).forEach(entry => {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                collectRecursive(fullPath);
                return;
            }
            if (entry.isFile() && entry.name.endsWith('.html')) {
                outputFiles.add(fullPath);
            }
        });
    };

    outputDirs.forEach(collectRecursive);
    return outputFiles;
}

const CLARITY_TRACKING_PROJECT_ID = 'w4fzun70vv';
const CLARITY_TRACKING_BLOCK_REGEX = /[ \t]*<!-- Clarity tracking code for https:\/\/goexpandia\.com\/ -->\s*<script>\s*[\s\S]*?\(window,\s*document,\s*["']clarity["'],\s*["']script["'],\s*["']w4fzun70vv["']\);\s*<\/script>\s*/g;

function normalizeClarityTracking(content) {
    const matches = [...content.matchAll(CLARITY_TRACKING_BLOCK_REGEX)];
    if (matches.length <= 1) {
        return content;
    }

    let keptFirstBlock = false;
    return content.replace(CLARITY_TRACKING_BLOCK_REGEX, (match) => {
        if (keptFirstBlock) {
            return '';
        }
        keptFirstBlock = true;
        return match;
    });
}

function injectClarityTracking(content) {
    content = normalizeClarityTracking(content);

    if (content.includes(CLARITY_TRACKING_PROJECT_ID) && content.includes('clarity.ms/tag')) {
        return content;
    }

    const clarityScript = `<!-- Clarity tracking code for https://goexpandia.com/ -->
<script>
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "w4fzun70vv");
</script>`;

    const lower = content.toLowerCase();
    const headIndex = lower.lastIndexOf('</head>');
    if (headIndex !== -1) {
        return `${content.slice(0, headIndex)}\n\n    ${clarityScript}\n${content.slice(headIndex)}`;
    }

    return `${content}\n\n${clarityScript}\n`;
}

function ensureClarityTrackingOnPublishedPages() {
    const outputFiles = collectPublishedHtmlFiles();

    let updatedCount = 0;
    outputFiles.forEach(filePath => {
        const current = fs.readFileSync(filePath, 'utf8');
        const next = injectClarityTracking(current);
        if (next !== current) {
            fs.writeFileSync(filePath, next, 'utf8');
            updatedCount += 1;
        }
    });

    if (updatedCount > 0) {
        console.log(`✅ Injected Clarity tracking into ${updatedCount} HTML files.`);
    } else {
        console.log('✅ Clarity tracking already present in all published HTML files.');
    }
}

function injectHubSpotEmbed(content) {
    if (content.includes('id="hs-script-loader"')) {
        return content;
    }

    const hubSpotEmbed = `<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/145104780.js"></script>
<!-- End of HubSpot Embed Code -->`;

    const lower = content.toLowerCase();
    const bodyIndex = lower.lastIndexOf('</body>');
    if (bodyIndex !== -1) {
        return `${content.slice(0, bodyIndex)}\n\n    ${hubSpotEmbed}\n${content.slice(bodyIndex)}`;
    }

    const htmlIndex = lower.lastIndexOf('</html>');
    if (htmlIndex !== -1) {
        return `${content.slice(0, htmlIndex)}\n\n    ${hubSpotEmbed}\n${content.slice(htmlIndex)}`;
    }

    return `${content}\n\n${hubSpotEmbed}\n`;
}

function ensureHubSpotEmbedOnPublishedPages() {
    const outputFiles = collectPublishedHtmlFiles();

    let updatedCount = 0;
    outputFiles.forEach(filePath => {
        const current = fs.readFileSync(filePath, 'utf8');
        const next = injectHubSpotEmbed(current);
        if (next !== current) {
            fs.writeFileSync(filePath, next, 'utf8');
            updatedCount += 1;
        }
    });

    if (updatedCount > 0) {
        console.log(`✅ Injected HubSpot embed into ${updatedCount} HTML files.`);
    } else {
        console.log('✅ HubSpot embed already present in all published HTML files.');
    }
}

function normalizeGeneratedLinks() {
    const roots = ['.', 'blog', 'glossary'];
    const htmlFiles = [];
    const ignoredDirs = new Set([
        '.git',
        '.github',
        '.playwright-cli',
        'assets',
        'data',
        'dist',
        'includes',
        'node_modules',
        'output',
        'scripts',
        'src',
        'templates'
    ]);

    function collectHtmlFiles(dir) {
        if (!fs.existsSync(dir)) return;
        fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (ignoredDirs.has(entry.name)) {
                    return;
                }
                collectHtmlFiles(fullPath);
                return;
            }
            if (entry.isFile() && entry.name.endsWith('.html')) {
                htmlFiles.push(fullPath);
            }
        });
    }

    roots.forEach(collectHtmlFiles);

    const fileSet = new Set(htmlFiles.map(file => file.replace(/\\/g, '/')));
    const hasFile = (candidate) => fileSet.has(candidate.replace(/\\/g, '/'));
    const tryResolveExistingHref = (normalizedPath, hrefValue) => {
        const [pathAndQuery, hashPart] = hrefValue.split('#');
        const [pathOnly, queryPart] = pathAndQuery.split('?');
        const clean = pathOnly;
        const tryPaths = [];
        const push = (candidate) => {
            if (candidate && !tryPaths.includes(candidate)) {
                tryPaths.push(candidate);
            }
        };

        push(clean);

        if (!clean.startsWith('./') && !clean.startsWith('../') && !clean.startsWith('/')) {
            for (let depth = 0; depth <= 3; depth += 1) {
                push(`${'../'.repeat(depth)}${clean}`);
            }
        }
        if (clean.startsWith('./')) {
            const localTarget = clean.slice(2);
            for (let depth = 1; depth <= 3; depth += 1) {
                push(`${'../'.repeat(depth)}${localTarget}`);
            }
        }

        push(clean.replace(/\/glossary\/solutions\.html$/, '/solutions.html'));
        if (!normalizedPath.includes('/') && clean.startsWith('../')) {
            push(clean.replace(/^(\.\.\/)+/, ''));
            push(`./${clean.replace(/^(\.\.\/)+/, '')}`);
        }

        for (const candidate of tryPaths) {
            const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(normalizedPath), candidate));
            if (hasFile(resolved)) {
                const withQuery = queryPart ? `${candidate}?${queryPart}` : candidate;
                return hashPart ? `${withQuery}#${hashPart}` : withQuery;
            }
        }
        return hrefValue;
    };

    htmlFiles.forEach(filePath => {
        const normalized = filePath.replace(/\\/g, '/');
        let html = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        const rewrittenLegacyLinks = rewriteLegacyHrefTargets(html);
        if (rewrittenLegacyLinks !== html) {
            html = rewrittenLegacyLinks;
            changed = true;
        }
        html = html.replace(/href=(["'])([^"']+\.html(?:[?#][^"']*)?)\1/g, (match, quote, hrefValue) => {
            if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(hrefValue)) {
                return match;
            }
            const nextValue = tryResolveExistingHref(normalized, hrefValue);
            if (nextValue !== hrefValue) {
                changed = true;
                return `href=${quote}${nextValue}${quote}`;
            }
            return match;
        });

        if (changed) {
            fs.writeFileSync(filePath, html, 'utf8');
        }
    });
}

function collectHtmlFilesRecursive(rootDir) {
    const results = [];
    if (!fs.existsSync(rootDir)) return results;

    fs.readdirSync(rootDir, { withFileTypes: true }).forEach(entry => {
        const fullPath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            results.push(...collectHtmlFilesRecursive(fullPath));
            return;
        }
        if (entry.isFile() && entry.name.endsWith('.html')) {
            results.push(fullPath.split(path.sep).join('/'));
        }
    });

    return results.sort();
}

function getSitemapLastmodForPage(page, fallbackDate) {
    if (!page.startsWith('blog/') || page.includes('/categories/')) {
        return fallbackDate;
    }

    const slug = path.basename(page, '.html');
    const post = blogCatalog.posts && blogCatalog.posts[slug];
    return (post && post.modified) || fallbackDate;
}

function writeBlogSitemap(blogPages, baseUrl, today) {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${blogPages.map(page => {
        const canonicalLocPath = toCanonicalPath(page.replace(/\.html$/, ''));
        const lastmod = getSitemapLastmodForPage(page, today);
        return `
    <url>
        <loc>${baseUrl}${canonicalLocPath}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === 'blog/index.html' ? '0.9' : '0.7'}</priority>
    </url>`;
    }).join('')}
</urlset>`;

    fs.writeFileSync('blog-sitemap.xml', sitemapContent);
    console.log(`✅ Generated blog-sitemap.xml with ${blogPages.length} URLs`);
}

function generateSitemap() {
    console.log('\n🗺️  Generating Sitemap...');

    const baseUrl = 'https://www.goexpandia.com';
    const today = new Date().toISOString().split('T')[0];

    // List of static pages
    const staticPages = [
        'index.html', 'about.html', 'our-business-model.html', 'solutions.html', 'contact.html',
        'service-areas.html', 'barcelona-ai-services.html', 'solar-satellite-offer-automatisation.html',
        'london-ai-agency.html', 'paris-ai-agency.html', 'berlin-ai-agency.html', 'madrid-ai-agency.html',
        'amsterdam-ai-agency.html', 'milan-ai-agency.html', 'zurich-ai-agency.html', 'stockholm-ai-agency.html',
        'dublin-ai-agency.html', 'lisbon-ai-agency.html',
        'rome-ai-agency.html', 'vienna-ai-agency.html', 'copenhagen-ai-agency.html', 'prague-ai-agency.html',
        'munich-ai-agency.html', 'hamburg-ai-agency.html', 'brussels-ai-agency.html', 'oslo-ai-agency.html',
        'helsinki-ai-agency.html', 'warsaw-ai-agency.html',
        'frankfurt-ai-agency.html', 'cologne-ai-agency.html', 'rotterdam-ai-agency.html', 'antwerp-ai-agency.html',
        'lyon-ai-agency.html', 'valencia-ai-agency.html', 'athens-ai-agency.html', 'budapest-ai-agency.html',
        'manchester-ai-agency.html', 'edinburgh-ai-agency.html',
        'istanbul-ai-agency.html', 'marseille-ai-agency.html', 'naples-ai-agency.html', 'bucharest-ai-agency.html',
        'porto-ai-agency.html', 'seville-ai-agency.html', 'florence-ai-agency.html', 'krakow-ai-agency.html',
        'tallinn-ai-agency.html', 'riga-ai-agency.html',
        'barcelona-ai-agency.html', 'new-york-ai-agency.html', 'los-angeles-ai-agency.html', 'chicago-ai-agency.html',
        'houston-ai-agency.html', 'phoenix-ai-agency.html', 'philadelphia-ai-agency.html', 'san-antonio-ai-agency.html',
        'san-diego-ai-agency.html', 'dallas-ai-agency.html', 'jacksonville-ai-agency.html', 'fort-worth-ai-agency.html',
        'san-jose-ai-agency.html', 'austin-ai-agency.html', 'charlotte-ai-agency.html', 'columbus-ai-agency.html',
        'toronto-ai-agency.html', 'montreal-ai-agency.html', 'sydney-ai-agency.html', 'melbourne-ai-agency.html',
        'vision-mission.html', 'our-ethical-principles.html',
        'privacy-policy.html', 'terms-of-service.html', 'cookie-policy.html'
    ];

    const legacyStaticPages = new Set(Object.keys(LEGACY_REDIRECT_TARGETS).map(page => `${page}.html`));
    const filteredStaticPages = staticPages.filter(page => !legacyStaticPages.has(page));

    const solutionPages = [];
    services.forEach(service => {
        solutionPages.push(`${service.id}.html`);
    });

    const blogPages = collectHtmlFilesRecursive('blog')
        .filter(page => !LOCALIZED_AI_MARKET_REDIRECT_PATHS.has(page));

    const allPages = [...new Set([...filteredStaticPages, ...solutionPages, ...blogPages])];

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    allPages.forEach(page => {
        const canonicalLocPath = toCanonicalPath(page.replace(/\.html$/, ''));
        const lastmod = getSitemapLastmodForPage(page, today);
        sitemapContent += `
    <url>
        <loc>${baseUrl}${canonicalLocPath}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === 'index.html' ? '1.0' : '0.8'}</priority>
    </url>`;
    });

    sitemapContent += `\n</urlset>`;

    fs.writeFileSync('sitemap.xml', sitemapContent);
    console.log(`✅ Generated sitemap.xml with ${allPages.length} URLs`);
    writeBlogSitemap(blogPages, baseUrl, today);
}

function buildLegacyRedirectRules() {
    const lines = [
        '# 301 Redirects for Retired URLs',
        '# Generated by build-pages.js. Keep these redirects long-term.',
        ''
    ];

    const forcedRedirectSources = new Set();

    REMOVED_BLOG_POST_SLUGS.forEach((slug) => {
        const source = `/blog/${slug}.html`;
        if (forcedRedirectSources.has(source)) return;
        lines.push(`${source}  /blog/index.html  301`);
    });

    lines.push('');

    Object.entries(LEGACY_REDIRECT_TARGETS).forEach(([source, target]) => {
        if (!source || source === target) {
            return;
        }
        const sourcePath = `/${source}.html`;
        const targetPath = `/${target}.html`;
        lines.push(`${sourcePath}  ${targetPath}  301`);
    });

    cities.forEach(city => {
        const canonicalSlug = normalizeCitySlug(city.city || city.slug);
        const legacySlugs = new Set([
            canonicalSlug,
            city.slug,
            ...(Array.isArray(city.legacySlugs) ? city.legacySlugs : [])
        ]);

        legacySlugs.forEach((legacySlug) => {
            if (!legacySlug) return;
            const sourcePath = `/${legacySlug}.html`;
            const targetPath = `/solutions.html`;
            lines.push(`${sourcePath}  ${targetPath}  301`);
        });
    });

    PRIORITY_SERVICE_CITY_PATHS.forEach(sourceSlug => {
        const matchedCity = cities.find(city => {
            const cleanSlug = normalizeCitySlug(city.slug);
            return sourceSlug.endsWith(`-${cleanSlug}`);
        });

        if (!matchedCity) return;

        const sourcePath = `/${sourceSlug}.html`;
        const targetPath = `/solutions.html`;
        lines.push(`${sourcePath}  ${targetPath}  301`);
    });

    RETIRED_CITY_SLUGS.forEach((slug) => {
        const sourcePath = `/${slug}.html`;
        const targetPath = `/${RETIRED_CITY_REDIRECT_TARGET}.html`;
        lines.push(`${sourcePath}  ${targetPath}  301`);
    });

    return lines.join('\n') + '\n';
}

function writeRedirectsFile() {
    const redirectsPath = '_redirects';
    const legacyBlockStart = '# BEGIN AUTO-GENERATED REDIRECTS';
    const legacyBlockEnd = '# END AUTO-GENERATED REDIRECTS';
    const generatedBlock = `${legacyBlockStart}\n${buildLegacyRedirectRules()}${legacyBlockEnd}\n`;

    let existing = '';
    if (fs.existsSync(redirectsPath)) {
        existing = fs.readFileSync(redirectsPath, 'utf8');
        const oldLegacyBlockRegex = new RegExp(`# BEGIN AUTO-GENERATED LEGACY SERVICE REDIRECTS[\\s\\S]*?# END AUTO-GENERATED LEGACY SERVICE REDIRECTS\\n?`, 'm');
        const legacyBlockRegex = new RegExp(`${legacyBlockStart}[\\s\\S]*?${legacyBlockEnd}\\n?`, 'm');
        existing = existing.replace(oldLegacyBlockRegex, '').replace(legacyBlockRegex, '').trimEnd();
    }

    const nextContent = `${existing}\n\n${generatedBlock}`.trimStart();
    fs.writeFileSync(redirectsPath, nextContent, 'utf8');
    console.log(`✅ Wrote redirect rules to ${redirectsPath}`);
}

function renderStaticRedirectPage(targetSlug) {
    const targetPath = `/blog/${targetSlug}.html`;
    const targetUrl = `https://www.goexpandia.com${targetPath}`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, follow">
    <meta http-equiv="refresh" content="0; url=${targetPath}">
    <link rel="canonical" href="${targetUrl}">
    <title>Redirecting | Go Expandia</title>
</head>
<body>
    <p>This article has moved to <a href="${targetPath}">${targetUrl}</a>.</p>
    <script>window.location.replace('${targetPath}');</script>
</body>
</html>
`;
}

function writeLocalizedAiMarketRedirectPages() {
    const blogDir = 'blog';
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }

    Object.entries(LOCALIZED_AI_MARKET_REDIRECTS).forEach(([sourceSlug, targetSlug]) => {
        const outputPath = path.join(blogDir, `${sourceSlug}.html`);
        fs.writeFileSync(outputPath, renderStaticRedirectPage(targetSlug), 'utf8');
    });

    console.log(`✅ Wrote ${Object.keys(LOCALIZED_AI_MARKET_REDIRECTS).length} localized AI market redirect pages`);
}

function cleanupLegacyRedirectOutputs() {
    REMOVED_BLOG_POST_SLUGS.forEach((slug) => {
        const filePath = `blog/${slug}.html`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    LEGACY_REDIRECT_ONLY_PAGES.forEach(page => {
        const filePath = `${page}.html`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    cities.forEach(city => {
        const canonicalSlug = normalizeCitySlug(city.city || city.slug);
        const legacySlugs = new Set([
            canonicalSlug,
            city.slug,
            ...(Array.isArray(city.legacySlugs) ? city.legacySlugs : [])
        ]);

        legacySlugs.forEach((legacySlug) => {
            if (!legacySlug) return;
            const filePath = `${legacySlug}.html`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    });

    PRIORITY_SERVICE_CITY_PATHS.forEach(sourceSlug => {
        const filePath = `${sourceSlug}.html`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    RETIRED_CITY_SLUGS.forEach((slug) => {
        const filePath = `${slug}.html`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
}


// --- EXECUTION ---

// Build English pages
console.log('Building English pages...');
buildPage('index', 'index', 'en');
buildPage('about', 'about', 'en');
buildPage('our-business-model', 'our-business-model', 'en');
buildPage('solutions', 'solutions', 'en');
buildPage('contact', 'contact', 'en');
buildPage('id_demo', 'id_demo', 'en');
buildPage('vision-mission', 'vision-mission', 'en');
buildPage('our-ethical-principles', 'our-ethical-principles', 'en');
buildPage('privacy-policy', 'privacy-policy', 'en');
buildPage('terms-of-service', 'terms-of-service', 'en');
buildPage('cookie-policy', 'cookie-policy', 'en');
buildPage('barcelona-ai-services', 'barcelona-ai-services', 'en');
buildPage('solar-satellite-offer-automatisation', 'solar-satellite-offer-automatisation', 'en');
buildPage('london-ai-agency', 'london-ai-agency', 'en');
buildPage('paris-ai-agency', 'paris-ai-agency', 'en');
buildPage('berlin-ai-agency', 'berlin-ai-agency', 'en');
buildPage('madrid-ai-agency', 'madrid-ai-agency', 'en');
buildPage('amsterdam-ai-agency', 'amsterdam-ai-agency', 'en');
buildPage('milan-ai-agency', 'milan-ai-agency', 'en');
buildPage('zurich-ai-agency', 'zurich-ai-agency', 'en');
buildPage('stockholm-ai-agency', 'stockholm-ai-agency', 'en');
buildPage('dublin-ai-agency', 'dublin-ai-agency', 'en');
buildPage('lisbon-ai-agency', 'lisbon-ai-agency', 'en');
buildPage('rome-ai-agency', 'rome-ai-agency', 'en');
buildPage('vienna-ai-agency', 'vienna-ai-agency', 'en');
buildPage('copenhagen-ai-agency', 'copenhagen-ai-agency', 'en');
buildPage('prague-ai-agency', 'prague-ai-agency', 'en');
buildPage('munich-ai-agency', 'munich-ai-agency', 'en');
buildPage('hamburg-ai-agency', 'hamburg-ai-agency', 'en');
buildPage('brussels-ai-agency', 'brussels-ai-agency', 'en');
buildPage('oslo-ai-agency', 'oslo-ai-agency', 'en');
buildPage('helsinki-ai-agency', 'helsinki-ai-agency', 'en');
buildPage('warsaw-ai-agency', 'warsaw-ai-agency', 'en');
buildPage('frankfurt-ai-agency', 'frankfurt-ai-agency', 'en');
buildPage('cologne-ai-agency', 'cologne-ai-agency', 'en');
buildPage('rotterdam-ai-agency', 'rotterdam-ai-agency', 'en');
buildPage('antwerp-ai-agency', 'antwerp-ai-agency', 'en');
buildPage('lyon-ai-agency', 'lyon-ai-agency', 'en');
buildPage('valencia-ai-agency', 'valencia-ai-agency', 'en');
buildPage('athens-ai-agency', 'athens-ai-agency', 'en');
buildPage('budapest-ai-agency', 'budapest-ai-agency', 'en');
buildPage('manchester-ai-agency', 'manchester-ai-agency', 'en');
buildPage('edinburgh-ai-agency', 'edinburgh-ai-agency', 'en');
buildPage('istanbul-ai-agency', 'istanbul-ai-agency', 'en');
buildPage('marseille-ai-agency', 'marseille-ai-agency', 'en');
buildPage('naples-ai-agency', 'naples-ai-agency', 'en');
buildPage('bucharest-ai-agency', 'bucharest-ai-agency', 'en');
buildPage('porto-ai-agency', 'porto-ai-agency', 'en');
buildPage('seville-ai-agency', 'seville-ai-agency', 'en');
buildPage('florence-ai-agency', 'florence-ai-agency', 'en');
buildPage('krakow-ai-agency', 'krakow-ai-agency', 'en');
buildPage('tallinn-ai-agency', 'tallinn-ai-agency', 'en');
buildPage('riga-ai-agency', 'riga-ai-agency', 'en');
buildPage('barcelona-ai-agency', 'barcelona-ai-agency', 'en');
buildPage('new-york-ai-agency', 'new-york-ai-agency', 'en');
buildPage('los-angeles-ai-agency', 'los-angeles-ai-agency', 'en');
buildPage('chicago-ai-agency', 'chicago-ai-agency', 'en');
buildPage('houston-ai-agency', 'houston-ai-agency', 'en');
buildPage('phoenix-ai-agency', 'phoenix-ai-agency', 'en');
buildPage('philadelphia-ai-agency', 'philadelphia-ai-agency', 'en');
buildPage('san-antonio-ai-agency', 'san-antonio-ai-agency', 'en');
buildPage('san-diego-ai-agency', 'san-diego-ai-agency', 'en');
buildPage('dallas-ai-agency', 'dallas-ai-agency', 'en');
buildPage('jacksonville-ai-agency', 'jacksonville-ai-agency', 'en');
buildPage('fort-worth-ai-agency', 'fort-worth-ai-agency', 'en');
buildPage('san-jose-ai-agency', 'san-jose-ai-agency', 'en');
buildPage('austin-ai-agency', 'austin-ai-agency', 'en');
buildPage('charlotte-ai-agency', 'charlotte-ai-agency', 'en');
buildPage('columbus-ai-agency', 'columbus-ai-agency', 'en');
buildPage('toronto-ai-agency', 'toronto-ai-agency', 'en');
buildPage('montreal-ai-agency', 'montreal-ai-agency', 'en');
buildPage('sydney-ai-agency', 'sydney-ai-agency', 'en');
buildPage('melbourne-ai-agency', 'melbourne-ai-agency', 'en');
// Build Approved Solution Pages (English)
services.forEach(service => buildSolutionPage(service.id, service.id, 'en'));

// Build blog posts from templates/blog into blog/.
buildBlogPosts();
buildBlogListingPages();

buildServiceAreasPage();
normalizeGeneratedLinks();
ensureClarityTrackingOnPublishedPages();
ensureHubSpotEmbedOnPublishedPages();
writeLocalizedAiMarketRedirectPages();
generateSitemap();
cleanupLegacyRedirectOutputs();
writeRedirectsFile();

console.log('\n🎉 BUILD COMPLETE with enhanced SEO!');
console.log('📁 Generated files have been updated from templates/');
console.log('⚠️  REMEMBER: Always edit templates/, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for development guidelines');
console.log('🚀 Ready for deployment!\n');
