
const fs = require('fs');
const path = require('path');
const cities = require('./data/cities.json');
const industries = require('./data/industries.json');
const services = require('./data/services.json');
const serviceContent = require('./data/service-content.json');
const topCities = require('./data/top-cities.json');
const topIndustries = require('./data/top-industries.json');
const glossary = require('./data/glossary.json');
const metadata = require('./data/metadata.json');
const { createHTMLTemplate, generateOrganizationSchema, generateBreadcrumbSchema } = require('./scripts/utils/template-engine');
const { applyTranslations } = require('./scripts/utils/translations');
const { blogTopics } = require('./scripts/generate-blog-posts');
const legacyBlogPosts = require('./data/legacy-blog-posts.json');

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

const navigationDE = fs.readFileSync('includes/header-de.html', 'utf8');
const navigationFR = fs.readFileSync('includes/header-fr.html', 'utf8');
const footerEN = fs.readFileSync(footerPath, 'utf8');

const footerDE = fs.existsSync('includes/footer-de.html') ? fs.readFileSync('includes/footer-de.html', 'utf8') : footerEN;
const footerFR = fs.existsSync('includes/footer-fr.html') ? fs.readFileSync('includes/footer-fr.html', 'utf8') : footerEN;

console.log(`✅ Successfully loaded headers for all languages`);
console.log(`✅ Successfully loaded footers for all languages`);

function getPageMetadata(templateName, lang = 'en') {
    // Get base metadata from JSON
    const baseMeta = metadata[templateName] || metadata['index'];

    // Check for translations in JSON
    if (baseMeta.translations && baseMeta.translations[lang]) {
        return { ...baseMeta, ...baseMeta.translations[lang] };
    }

    return baseMeta;
}

function getHreflangUrls(templateName) {
    const urls = {
        'index': { en: '', de: 'de/', fr: 'fr/' },
        'solutions': { en: 'solutions.html', de: 'de/solutions.html', fr: 'fr/solutions.html' },
        'about': { en: 'about.html', de: 'de/about.html', fr: 'fr/about.html' },
        'contact': { en: 'contact.html', de: 'de/contact.html', fr: 'fr/contact.html' },
        'case-studies': { en: 'case-studies.html', de: 'de/case-studies.html', fr: 'fr/case-studies.html' },
        'managed-it-services': { en: 'managed-it-services.html', de: 'de/managed-it-services.html', fr: 'fr/managed-it-services.html' },
        'vulnerability-assessments': { en: 'vulnerability-assessments.html', de: 'de/vulnerability-assessments.html', fr: 'fr/vulnerability-assessments.html' },
        'email-security': { en: 'email-security.html', de: 'de/email-security.html', fr: 'fr/email-security.html' },
        'website-care-plans': { en: 'website-care-plans.html', de: 'de/website-care-plans.html', fr: 'fr/website-care-plans.html' },
        'revops-crm-setup': { en: 'revops-crm-setup.html', de: 'de/revops-crm-setup.html', fr: 'fr/revops-crm-setup.html' },
        'lost-lead-reactivation': { en: 'lost-lead-reactivation.html', de: 'de/lost-lead-reactivation.html', fr: 'fr/lost-lead-reactivation.html' },
        'speed-to-lead': { en: 'speed-to-lead.html', de: 'de/speed-to-lead.html', fr: 'fr/speed-to-lead.html' },
        'recruitment': { en: 'recruitment.html', de: 'de/recruitment.html', fr: 'fr/recruitment.html' },
        'ai-creative-studio': { en: 'ai-creative-studio.html', de: 'de/ai-creative-studio.html', fr: 'fr/ai-creative-studio.html' },
        'vision-mission': { en: 'vision-mission.html', de: 'de/vision-mission.html', fr: 'fr/vision-mission.html' },
        'vizyon-misyon': { en: 'vision-mission.html', de: 'de/vision-mission.html', fr: 'fr/vision-mission.html' },
        'our-ethical-principles': { en: 'our-ethical-principles.html', de: 'de/our-ethical-principles.html', fr: 'fr/our-ethical-principles.html' },
        'etik-ilkelerimiz': { en: 'our-ethical-principles.html', de: 'de/our-ethical-principles.html', fr: 'fr/our-ethical-principles.html' },
        'market-foundation-program': { en: 'market-foundation-program.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'pazar-temeli-programi': { en: 'market-foundation-program.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'markt-grundlagen-programm': { en: 'market-foundation-program.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'market-accelerator-program': { en: 'market-accelerator-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'pazar-hizlandirici-program': { en: 'market-accelerator-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'markt-beschleuniger-programm': { en: 'market-accelerator-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'part-time-lead-generation-team': { en: 'part-time-lead-generation-team.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'kismi-is-gelistirme-ekibi': { en: 'part-time-lead-generation-team.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'teilzeit-bizdev-team': { en: 'part-time-lead-generation-team.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'abd-pr-hizmeti': { en: 'usa-pr-service.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' },
        'corporate-digital-gifting': { en: 'corporate-digital-gifting.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'usa-pr-service': { en: 'usa-pr-service.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' },
        'kurumsal-dijital-hediye-promosyon': { en: 'corporate-digital-gifting.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'unternehmens-digitale-geschenke': { en: 'corporate-digital-gifting.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'usa-pr-dienst': { en: 'usa-pr-service.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' },
        'international-market-entry': { en: 'international-market-entry.html', de: 'de/international-market-entry.html', fr: 'fr/international-market-entry.html' }
    };
    return urls[templateName] || urls['index'];
}

function getActiveStates(templateName) {
    const activeStates = {
        'index': { 'HOME_ACTIVE': 'text-primary', 'HOME_MOBILE_ACTIVE': 'class="font-semibold text-primary"' },
        'solutions': { 'SOLUTIONS_ACTIVE': 'text-primary', 'SOLUTIONS_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'SOLUTIONS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'about': { 'COMPANY_ACTIVE': 'text-primary', 'ABOUT_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'ABOUT_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'contact': { 'COMPANY_ACTIVE': 'text-primary', 'CONTACT_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'CONTACT_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'case-studies': { 'SOLUTIONS_ACTIVE': 'text-primary', 'CASESTUDIES_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'CASESTUDIES_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'vision-mission': { 'COMPANY_ACTIVE': 'text-primary', 'VISION_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'VISION_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'our-ethical-principles': { 'COMPANY_ACTIVE': 'text-primary', 'ETHICS_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'ETHICS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'city-locations': { 'SOLUTIONS_ACTIVE': 'text-primary' }
    };
    return activeStates[templateName] || activeStates['index'];
}

function buildPage(templateName, outputName, lang = 'en') {
    const templateDir = lang === 'de' || lang === 'fr' ? `templates/${lang}/` : 'templates/';
    const templatePath = `${templateDir}${templateName}.html`;

    if (lang === 'fr' && !fs.existsSync(templatePath)) {
        return;
    }

    if (!fs.existsSync(templatePath)) {
        const fallbackPath = `templates/${templateName}.html`;
        if (!fs.existsSync(fallbackPath)) {
            console.warn(`Template not found: ${templatePath}`);
            return;
        }
    }

    let content = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : fs.readFileSync(`templates/${templateName}.html`, 'utf8');

    let htmlTemplate = createHTMLTemplate(lang);
    let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
    let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

    // Clean up data-i18n attributes as we handle translation on build
    content = content.replace(/\s*data-i18n="[^"]*"/g, '');
    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

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

    const logoPath = basePath + 'Expandia-main-logo-koyu-yesil.png';
    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
    const turkishServicesPath = './';

    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);

    // Language specific logic 
    if (lang === 'de') {
        pageNavigation = applyTranslations(pageNavigation, 'de');
        pageFooter = applyTranslations(pageFooter, 'de');
        content = applyTranslations(content, 'de');
        pageNavigation = pageNavigation.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
    } else if (lang === 'fr') {
        pageNavigation = applyTranslations(pageNavigation, 'fr');
        pageFooter = applyTranslations(pageFooter, 'fr');
        content = applyTranslations(content, 'fr');
        pageNavigation = pageNavigation.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
    }

    // Flag logic
    const currentFlag = lang === 'tr' ? '🇹🇷' : lang === 'de' ? '🇩🇪' : lang === 'fr' ? '🇫🇷' : '🇺🇸';
    pageNavigation = pageNavigation.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">${currentFlag}</span>`);

    // Get active states for navigation
    const activeStates = getActiveStates(templateName);
    for (const [key, value] of Object.entries(activeStates)) {
        pageNavigation = pageNavigation.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    // Hreflang logic for switcher
    const hrefUrls = getHreflangUrls(templateName);
    const relPrefix = lang === 'en' ? './' : '../';
    let enLink = hrefUrls.en || 'index.html';
    if (enLink === '') enLink = 'index.html';
    pageNavigation = pageNavigation.replace(/href=["'][^"']*["']\s+data-lang="en"/g, `href="${relPrefix}${enLink}" data-lang="en"`);
    let trLink = hrefUrls.tr || 'tr/index.html';
    if (trLink.endsWith('/')) trLink += 'index.html';
    pageNavigation = pageNavigation.replace(/href=["'][^"']*["']\s+data-lang="tr"/g, `href="${relPrefix}${trLink}" data-lang="tr"`);
    let deLink = hrefUrls.de || 'de/index.html';
    if (deLink.endsWith('/')) deLink += 'index.html';
    pageNavigation = pageNavigation.replace(/href=["'][^"']*["']\s+data-lang="de"/g, `href="${relPrefix}${deLink}" data-lang="de"`);
    let frLink = hrefUrls.fr || 'fr/index.html';
    if (frLink.endsWith('/')) frLink += 'index.html';
    pageNavigation = pageNavigation.replace(/href=["'][^"']*["']\s+data-lang="fr"/g, `href="${relPrefix}${frLink}" data-lang="fr"`);

    htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
    htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
    htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

    const pageMetadata = getPageMetadata(templateName, lang);
    const canonicalUrl = lang === 'en' ? `https://www.expandia.ch/${outputName}.html` : `https://www.expandia.ch/${lang}/${outputName}.html`;

    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);

    // Schema
    let schemaMarkup = JSON.stringify(generateOrganizationSchema(), null, 2);
    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, schemaMarkup);

    // Hreflang Tags in HEAD
    const hreflangUrls2 = getHreflangUrls(templateName);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, hreflangUrls2.en);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, '');
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, hreflangUrls2.de);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, hreflangUrls2.fr || 'fr/');


    // Dynamic Blog Index Injection
    if (templateName === 'blog-index') {
        const newArticles = blogTopics.map(topic => ({
            title: topic.title[lang] || topic.title['en'],
            tags: `${topic.serviceId} business b2b`,
            url: `${topic.slug}.html`,
            excerpt: topic.title[lang] || topic.title['en'], // Simplified excerpt
            badge: "New",
            readTime: "5 min read"
        }));

        // Combine new and legacy (legacy mostly EN, could filter or translate if needed)
        // We put NEW articles FIRST as requested
        const combinedArticles = [...newArticles, ...legacyBlogPosts];

        htmlTemplate = htmlTemplate.replace('{{BLOG_ARTICLES_JSON}}', JSON.stringify(combinedArticles));
    }

    let outputPath = lang === 'en' ? `${outputName}.html` : `${lang}/${outputName}.html`;
    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
    console.log(`✅ Built ${outputPath}`);
}

// Blog Post Building Function
function buildBlogPost(templateName, outputName, lang = 'en') {
    // console.log(`🏗️  Building blog post: ${outputName} (${lang.toUpperCase()})`);

    const basePath = lang === 'en' ? '../' : '../../';
    const navPath = '../';
    const logoPath = lang === 'en' ? '../Expandia-main-logo-koyu-yesil.png' : '../../Expandia-main-logo-koyu-yesil.png';

    // Read blog post template
    let blogTemplate;
    const templateDir = lang === 'en' ? 'templates/blog' : `templates/${lang}/blog`;
    const templatePath = `${templateDir}/${templateName}.html`;

    if (fs.existsSync(templatePath)) {
        blogTemplate = fs.readFileSync(templatePath, 'utf8');
    } else {
        // Fallback to EN if language template not found (optional, but good for safety)
        const fallbackPath = `templates/blog/${templateName}.html`;
        if (fs.existsSync(fallbackPath)) {
            blogTemplate = fs.readFileSync(fallbackPath, 'utf8');
            // TODO: Apply translations here if we rely on fallback
        } else {
            console.log(`⚠️  Blog template ${templatePath} not found`);
            return;
        }
    }

    // Select Navigation/Footer based on language
    let nav = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
    let foot = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

    // Clean i18n
    nav = nav.replace(/\s*data-i18n="[^"]*"/g, '');
    foot = foot.replace(/\s*data-i18n="[^"]*"/g, '');

    // Apply navPath to nav/foot BEFORE merging
    nav = nav.replace(/\{\{BASE_PATH\}\}/g, navPath);
    foot = foot.replace(/\{\{BASE_PATH\}\}/g, navPath);

    // Process includes
    blogTemplate = blogTemplate.replace('{{HEADER_INCLUDE}}', nav);
    blogTemplate = blogTemplate.replace('{{FOOTER_INCLUDE}}', foot);

    // Turkish services path
    const turkishServicesPath = './';
    blogTemplate = blogTemplate.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

    // Flag logic
    const currentFlag = lang === 'de' ? '🇩🇪' : lang === 'fr' ? '🇫🇷' : '🇺🇸';
    blogTemplate = blogTemplate.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">${currentFlag}</span>`);

    // Hreflang logic for switcher (Simple relative adjustment)
    const relPrefix = lang === 'en' ? './' : '../';
    // This assumes blog posts have same filenames across languages!
    blogTemplate = blogTemplate.replace(/href=["'][^"']*["']\s+data-lang="en"/g, `href="${relPrefix}${templateName}.html" data-lang="en"`);
    blogTemplate = blogTemplate.replace(/href=["'][^"']*["']\s+data-lang="tr"/g, `href="${relPrefix}tr/blog/${templateName}.html" data-lang="tr"`);
    blogTemplate = blogTemplate.replace(/href=["'][^"']*["']\s+data-lang="de"/g, `href="${relPrefix}de/blog/${templateName}.html" data-lang="de"`);
    blogTemplate = blogTemplate.replace(/href=["'][^"']*["']\s+data-lang="fr"/g, `href="${relPrefix}fr/blog/${templateName}.html" data-lang="fr"`);

    // Fix paths in nav/footer
    // blogTemplate = blogTemplate.replace(/\{\{BASE_PATH\}\}/g, navPath); // Moved above

    // Replace path placeholders
    // Smart replacement: Assets use basePath, Links use navPath
    blogTemplate = blogTemplate.replace(/(href|src)="\{\{BASE_PATH\}\}([^"]+\.(css|ico|png|jpg|jpeg|js|svg))"/g, `$1="${basePath}$2"`);
    blogTemplate = blogTemplate.replace(/\{\{BASE_PATH\}\}/g, navPath);
    blogTemplate = blogTemplate.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

    // Set active states for navigation
    blogTemplate = blogTemplate.replace(/\{\{HOME_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{SOLUTIONS_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{ABOUT_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CONTACT_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{BLOG_ACTIVE\}\}/g, 'text-primary');

    // Clear mobile active states
    blogTemplate = blogTemplate.replace(/\{\{HOME_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{SOLUTIONS_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{ABOUT_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CONTACT_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{BLOG_MOBILE_ACTIVE\}\}/g, 'class="text-primary font-semibold"');

    // Clear other placeholder states
    blogTemplate = blogTemplate.replace(/\{\{SOLUTIONS_ITEM_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CASESTUDIES_ITEM_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{ABOUT_ITEM_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CONTACT_ITEM_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CASESTUDIES_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{COMPANY_ACTIVE\}\}/g, '');

    // Determine output path
    let outputPath;
    if (lang === 'tr') {
        outputPath = `tr/blog/${outputName}.html`;
    } else if (lang === 'de') {
        outputPath = `de/blog/${outputName}.html`;
    } else if (lang === 'fr') {
        outputPath = `fr/blog/${outputName}.html`;
    } else {
        outputPath = `blog/${outputName}.html`;
    }

    // Canonical tag logic
    const canonicalUrl = lang === 'en'
        ? `https://www.expandia.ch/blog/${outputName}.html`
        : `https://www.expandia.ch/${lang}/blog/${outputName}.html`;
    blogTemplate = blogTemplate.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);

    // --- Metadata Replacement Logic ---
    let pageTitle = 'Expandia Blog';
    let pageDesc = 'Deep dive into B2B sales, lead generation, and operations strategies.';
    let pageKeywords = 'B2B sales, lead generation, Expandia blog';

    // 1. Check generated blog topics
    const topic = blogTopics.find(t => t.slug === templateName);
    if (topic) {
        pageTitle = topic.title[lang] || topic.title['en'];
        pageDesc = pageTitle + '. Read expert insights on Expandia Blog.';
    }
    // 2. Check legacy posts
    else {
        const legacy = legacyBlogPosts.find(p => p.url === templateName + '.html' || p.url === templateName);
        if (legacy) {
            pageTitle = legacy.title;
            pageDesc = legacy.excerpt;
        }
    }

    // Apply replacements
    blogTemplate = blogTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageTitle + ' | Expandia');
    blogTemplate = blogTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageDesc);
    blogTemplate = blogTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageKeywords);

    // Ensure blog directory exists
    const blogDir = path.dirname(outputPath);
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, blogTemplate, 'utf8');
    console.log(`✅ Built blog post: ${outputPath}`);
}

// Blog Post Building Function
function buildBlogPosts() {
    console.log('\n🏗️  Building Blog Posts (Multi-Language)...');
    const languages = ['en', 'de', 'fr'];
    let totalBuilt = 0;

    // Use English templates as the master list
    const masterBlogDir = 'templates/blog';
    if (!fs.existsSync(masterBlogDir)) {
        console.log('⚠️ Master blog templates directory not found.');
        return;
    }

    const files = fs.readdirSync(masterBlogDir).filter(file => file.endsWith('.html'));

    languages.forEach(lang => {
        files.forEach(file => {
            const templateName = file.replace('.html', '');
            buildBlogPost(templateName, templateName, lang);
        });
        console.log(`✅ Built ${files.length} blog posts for ${lang.toUpperCase()}.`);
        totalBuilt += files.length;
    });
    console.log(`✅ Total Blog Posts Built: ${totalBuilt}`);
}

// Helper: Haversine distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// -------------------------------------------------------------------------
// NEW: Build Service x City Pages (Multi-Language)
// -------------------------------------------------------------------------
function buildServiceCityPages() {
    console.log('\n🏗️  Building Service x City Landing Pages (Multi-Language)...');

    // Read the mega template
    const templateContent = fs.readFileSync('templates/service-city-landing.html', 'utf8');
    let pageCount = 0;
    const languages = ['en', 'de', 'fr'];

    languages.forEach(lang => {
        services.forEach(service => {
            // Get content for specific language, fallback to EN if missing
            const contentData = (serviceContent[service.id] && serviceContent[service.id][lang])
                ? serviceContent[service.id][lang]
                : (serviceContent[service.id] ? serviceContent[service.id]['en'] : null);

            if (!contentData) {
                console.warn(`No content found for service ID: ${service.id} (Lang: ${lang})`);
                return;
            }

            cities.forEach(cityData => {
                const city = cityData.city;
                const country = cityData.country;

                // Replace dynamic parts in slug
                let slug = service.slug_pattern.replace('{{CITY_SLUG}}', cityData.slug.replace('b2b-lead-generation-', ''));

                // Determine title/desc based on language
                let titleTemplate = service.title_template;
                let descTemplate = service.description_template;

                if (lang !== 'en' && service.translations && service.translations[lang]) {
                    titleTemplate = service.translations[lang].title_template;
                    descTemplate = service.translations[lang].description_template;
                }

                // Replace dynamic parts in title/desc
                const title = titleTemplate
                    .replace('{{CITY_NAME}}', city)
                    .replace('{{COUNTRY_NAME}}', country);

                const description = descTemplate
                    .replace('{{CITY_NAME}}', city)
                    .replace('{{COUNTRY_NAME}}', country);

                // Construct Content Blocks
                const intro = contentData.intro.map(p => `<p>${p.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}</p>`).join('\n');

                const painPoints = contentData.pain_points.map(point => `
                    <div class="flex gap-3 items-start">
                        <span class="text-error text-xl">⚠️</span>
                        <p>${point.replace(/\{\{CITY_NAME\}\}/g, city)}</p>
                    </div>
                `).join('');

                const benefits = contentData.benefits.map(benefit => {
                    // Split bold text
                    const parts = benefit.split('**');
                    if (parts.length === 3) {
                        return `
                        <div class="flex gap-3">
                            <span class="text-secondary text-xl">✓</span>
                            <p><strong class="text-secondary-content">${parts[1]}</strong> ${parts[2].replace(/\{\{CITY_NAME\}\}/g, city)}</p>
                        </div>`;
                    }
                    return `<p>${benefit}</p>`;
                }).join('');

                const faq = contentData.faq.map(item => `
                    <div class="collapse collapse-plus bg-base-200">
                        <input type="radio" name="my-accordion-3" /> 
                        <div class="collapse-title text-xl font-medium">
                            ${item.q.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}
                        </div>
                        <div class="collapse-content"> 
                            <p>${item.a.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}</p>
                        </div>
                    </div>
                `).join('');

                // Calculate Nearby Cities (same logic as before)
                const nearby = cities
                    .filter(c => c.slug !== cityData.slug && c.lat && c.lng && cityData.lat && cityData.lng)
                    .map(c => ({
                        ...c,
                        distance: getDistanceFromLatLonInKm(cityData.lat, cityData.lng, c.lat, c.lng)
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 5);

                const nearbyLinks = nearby.map(c => {
                    const nearbySlug = service.slug_pattern.replace('{{CITY_SLUG}}', c.slug.replace('b2b-lead-generation-', ''));
                    // Handle relative linking for subdirectories
                    const linkPrefix = lang === 'en' ? './' : '../';
                    // If we are in a lang folder, we link to other pages in THAT lang folder (conceptually). 
                    // But currently flat structure for EN, subdirs for others.
                    // Wait, if I am in `de/`, linking to `de/other.html`, it is just `./other.html`.
                    // Yes.
                    return `<a href="./${nearbySlug}.html" class="link link-hover hover:text-primary transition-colors">${c.city}</a>`;
                }).join(' • ');

                // Build HTML
                let htmlTemplate = createHTMLTemplate(lang);
                let content = templateContent;

                // Replacements
                content = content.replace(/\{\{SERVICE_NAME\}\}/g, service.name);
                content = content.replace(/\{\{SERVICE_ICON\}\}/g, service.icon);
                content = content.replace(/\{\{CITY_NAME\}\}/g, city);
                content = content.replace(/\{\{COUNTRY_NAME\}\}/g, country);
                content = content.replace('{{INTRO_TEXT}}', intro);
                content = content.replace('{{PAIN_POINTS_LIST}}', painPoints);
                content = content.replace('{{BENEFITS_LIST}}', benefits);
                content = content.replace('{{FAQ_LIST}}', faq);
                content = content.replace('{{NEARBY_CITIES_LINKS}}', nearbyLinks);
                content = content.replace(/\{\{CITY_POPULATION\}\}/g, cityData.population || 'growing');
                content = content.replace(/\{\{CITY_LANDMARK\}\}/g, cityData.landmark || 'the city center');

                // Navigation/Footer
                let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
                let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

                // Clean i18n
                pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
                pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

                const basePath = (lang === 'de' || lang === 'fr') ? '../' : './';
                const logoPath = (lang === 'de' || lang === 'fr') ? '../Expandia-main-logo-koyu-yesil.png' : 'Expandia-main-logo-koyu-yesil.png';
                htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
                const turkishServicesPath = './';

                pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
                pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
                pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
                pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
                pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
                pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
                pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
                pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

                // Apply Translation Helper
                if (lang !== 'en') {
                    pageNavigation = applyTranslations(pageNavigation, lang);
                    pageFooter = applyTranslations(pageFooter, lang);
                }

                // Flag logic
                const currentFlag = lang === 'de' ? '🇩🇪' : lang === 'fr' ? '🇫🇷' : '🇺🇸';
                pageNavigation = pageNavigation.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">${currentFlag}</span>`);

                htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
                htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
                htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

                // Metadata & Schema
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, description);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, `${service.name} ${city}, ${service.name} Agency ${city}, ${country} B2B Services`);

                const canonicalSlug = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;
                htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.expandia.ch/${canonicalSlug}`);

                // Hreflang logic
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${slug}.html`);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, ``);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `de/${slug}.html`);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `fr/${slug}.html`);

                // Fix missing FR hreflang in template logic (hacky patch based on previous code)
                if (!htmlTemplate.includes('hreflang="fr"')) {
                    htmlTemplate = htmlTemplate.replace(
                        `<link rel="alternate" hreflang="de" href="https://www.expandia.ch/de/${slug}.html">`,
                        `<link rel="alternate" hreflang="de" href="https://www.expandia.ch/de/${slug}.html">\n    <link rel="alternate" hreflang="fr" href="https://www.expandia.ch/fr/${slug}.html">`
                    );
                }

                const schema = {
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": `${service.name} in ${city}`,
                    "provider": { "@type": "Organization", "name": "Expandia", "url": "https://www.expandia.ch" },
                    "areaServed": {
                        "@type": "City",
                        "name": city,
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": country
                        }
                    },
                    "description": description
                };
                htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schema, null, 2));

                // Write File
                const outputPath = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;

                // Ensure dir exists
                const dir = path.dirname(outputPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
                pageCount++;
            });
        });
    });
    console.log(`✅ Built ${pageCount} Service x City pages.`);
}

// -------------------------------------------------------------------------
// NEW: Build Service x Industry x City Pages (Multi-Language)
// -------------------------------------------------------------------------
function buildServiceIndustryCityPages() {
    console.log('\n🏗️  Building Service x Industry x City Landing Pages (Multi-Language)...');

    // Read the mega template
    const templateContent = fs.readFileSync('templates/service-industry-city-landing.html', 'utf8');
    let pageCount = 0;
    const languages = ['en', 'de', 'fr'];

    languages.forEach(lang => {
        services.forEach(service => {
            topIndustries.forEach(industry => {
                topCities.forEach(cityData => {
                    const city = cityData.city;
                    const country = cityData.country;

                    // Slug: service-industry-city.html
                    // E.g. managed-it-services-fintech-london.html
                    const slug = `${service.slug_pattern.replace('-{{CITY_SLUG}}', '')}-${industry.slug.replace('b2b-lead-generation-', '')}-${cityData.slug.replace('b2b-lead-generation-', '')}`;

                    // Determine title/desc based on language (Simplified for this massive scale)
                    let title = `${service.name} for ${industry.name} in ${city}`;
                    let description = `${service.name} tailored for ${industry.name} companies in ${city}.`;

                    // Service Slug Mapping
                    const serviceSlugMap = {
                        'managed-it': 'managed-it-services',
                        'cybersecurity': 'vulnerability-assessments',
                        'recruitment': 'recruitment',
                        'ai-studio': 'ai-creative-studio',
                        'revops': 'revops-crm-setup'
                    };
                    const serviceSlug = serviceSlugMap[service.id] || 'index';

                    // Build HTML
                    let htmlTemplate = createHTMLTemplate(lang);
                    let content = templateContent;

                    // Replacements
                    content = content.replace(/\{\{SERVICE_NAME\}\}/g, service.name);
                    content = content.replace(/\{\{SERVICE_ICON\}\}/g, service.icon);
                    content = content.replace(/\{\{INDUSTRY_NAME\}\}/g, industry.name);
                    content = content.replace(/\{\{CITY_NAME\}\}/g, city);
                    content = content.replace(/\{\{COUNTRY_NAME\}\}/g, country);
                    content = content.replace(/\{\{SERVICE_SLUG\}\}/g, serviceSlug);
                    content = content.replace(/\{\{INDUSTRY_SLUG\}\}/g, industry.slug);

                    // Navigation/Footer
                    let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
                    let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

                    // Clean i18n
                    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
                    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

                    const basePath = (lang === 'de' || lang === 'fr') ? '../' : './';
                    const logoPath = (lang === 'de' || lang === 'fr') ? '../Expandia-main-logo-koyu-yesil.png' : 'Expandia-main-logo-koyu-yesil.png';
                    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
                    const turkishServicesPath = './';

                    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
                    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
                    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
                    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
                    pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
                    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
                    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
                    pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

                    // Apply Translation Helper
                    if (lang !== 'en') {
                        pageNavigation = applyTranslations(pageNavigation, lang);
                        pageFooter = applyTranslations(pageFooter, lang);
                    }

                    htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
                    htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
                    htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

                    // Metadata & Schema
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, description);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, `${service.name} ${industry.name} ${city}`);

                    const canonicalSlug = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;
                    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.expandia.ch/${canonicalSlug}`);

                    // Hreflang logic
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${slug}.html`);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, ``);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `de/${slug}.html`);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `fr/${slug}.html`);

                    // Fix missing FR hreflang
                    if (!htmlTemplate.includes('hreflang="fr"')) {
                        htmlTemplate = htmlTemplate.replace(
                            `<link rel="alternate" hreflang="de" href="https://www.expandia.ch/de/${slug}.html">`,
                            `<link rel="alternate" hreflang="de" href="https://www.expandia.ch/de/${slug}.html">\n    <link rel="alternate" hreflang="fr" href="https://www.expandia.ch/fr/${slug}.html">`
                        );
                    }

                    const schema = {
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": `${service.name} for ${industry.name} in ${city}`,
                        "provider": { "@type": "Organization", "name": "Expandia", "url": "https://www.expandia.ch" },
                        "areaServed": { "@type": "City", "name": city },
                        "audience": { "@type": "Audience", "audienceType": industry.name }
                    };
                    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schema, null, 2));

                    // Write File
                    const outputPath = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;

                    // Ensure dir exists
                    const dir = path.dirname(outputPath);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }

                    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
                    pageCount++;
                });
            });
        });
    });
    console.log(`✅ Built ${pageCount} Service x Industry x City pages.`);
}

// -------------------------------------------------------------------------
// NEW: Build City Landing Pages (Refactored) - B2B/Corporate/Manufacturing Focus
// -------------------------------------------------------------------------

// Region-based content for unique city pages
const regionContent = {
    'DACH': {
        targetHeadline: 'Corporate Enterprises & Industrial Manufacturers',
        industries: ['Industrial Manufacturing', 'Engineering Companies', 'Corporate Enterprises', 'Automotive Suppliers', 'Machinery & Equipment', 'Chemicals & Materials', 'Logistics & Supply Chain', 'Business Services', 'Wholesale & Distribution', 'Construction & Infrastructure'],
        insights: [
            { title: 'Industrial Precision', text: 'Our approach matches the DACH region\'s emphasis on quality and precision. We identify decision-makers who value long-term partnerships over transactional relationships.' },
            { title: 'Cross-Border Expertise', text: 'Navigate the German, Austrian, and Swiss markets effectively with campaigns tailored to local business cultures and procurement processes.' },
            { title: 'Mid-Market Focus', text: 'Reach the Mittelstand—the backbone of DACH manufacturing. Our campaigns connect you with privately-owned, export-oriented companies.' },
            { title: 'Multi-Language Campaigns', text: 'German-language outreach combined with English for international divisions. We adapt messaging to regional business expectations.' }
        ],
        marketStats: [
            { stat: '3M+', desc: 'B2B companies across DACH region' },
            { stat: '€2.1T', desc: 'Combined manufacturing output' },
            { stat: '68%', desc: 'Companies actively seeking suppliers' }
        ],
        marketContext: 'The DACH region represents one of Europe\'s most mature B2B markets, with strong demand for quality-focused suppliers and service providers.',
        serviceIntro: 'Our B2B lead generation methodology is designed for the complex, relationship-driven sales cycles typical of corporate and industrial buyers across Germany, Austria, and Switzerland.'
    },
    'Western Europe': {
        targetHeadline: 'B2B Companies & Corporate Enterprises',
        industries: ['Corporate Services', 'Manufacturing Companies', 'Business Consulting', 'Logistics & Freight', 'Industrial Equipment', 'Construction & Engineering', 'Telecommunications', 'Energy & Utilities', 'Retail & Wholesale', 'Professional Services'],
        insights: [
            { title: 'Enterprise Connections', text: 'Access decision-makers at corporate headquarters and regional offices across Western European markets.' },
            { title: 'Cross-Border Campaigns', text: 'Expand from one market to multiple countries with campaigns that respect local business practices and languages.' },
            { title: 'Procurement Expertise', text: 'We understand formal procurement processes and help you position effectively in competitive tender situations.' },
            { title: 'Quality Over Quantity', text: 'Focus on qualified meetings with buyers who have budget and authority, not just contact lists.' }
        ],
        marketStats: [
            { stat: '5M+', desc: 'Active B2B enterprises' },
            { stat: '€4.2T', desc: 'Annual B2B commerce value' },
            { stat: '72%', desc: 'Digital procurement adoption' }
        ],
        marketContext: 'Western Europe offers mature B2B markets with sophisticated buyers who expect professional, value-driven sales approaches and clear ROI.',
        serviceIntro: 'From the UK to the Benelux, our lead generation services help you connect with corporate buyers and industrial decision-makers across Western Europe\'s diverse markets.'
    },
    'Scandinavia': {
        targetHeadline: 'Industrial Companies & Corporate Groups',
        industries: ['Maritime & Shipping', 'Energy & Clean Tech', 'Industrial Manufacturing', 'Engineering Services', 'Forest & Paper Products', 'Corporate Enterprises', 'Telecommunications', 'Construction & Real Estate', 'Business Services', 'Healthcare Industry'],
        insights: [
            { title: 'Sustainability Focus', text: 'Scandinavian buyers prioritize sustainable practices. We help position your offering around long-term value and environmental responsibility.' },
            { title: 'Direct Communication', text: 'Nordic business culture values straightforward communication. Our outreach reflects this—clear, honest, and results-oriented.' },
            { title: 'Innovation-Driven', text: 'Connect with companies at the forefront of industrial innovation, from clean energy to advanced manufacturing.' },
            { title: 'Regional Expansion', text: 'Use Scandinavia as a springboard to Nordic and Baltic markets with integrated campaign strategies.' }
        ],
        marketStats: [
            { stat: '800K+', desc: 'B2B companies in the Nordics' },
            { stat: '€890B', desc: 'Combined GDP' },
            { stat: '85%', desc: 'Digital business adoption' }
        ],
        marketContext: 'The Nordic region combines industrial heritage with technology leadership, creating opportunities for B2B providers who can deliver innovation and reliability.',
        serviceIntro: 'Reach industrial manufacturers, corporate groups, and service providers across Norway, Sweden, Denmark, and Finland with campaigns tailored to Nordic business values.'
    },
    'Turkey': {
        targetHeadline: 'Manufacturing Companies & Corporate Groups',
        industries: ['Manufacturing & Production', 'Textile & Apparel', 'Automotive Industry', 'Construction & Building Materials', 'Food & Beverage Production', 'Corporate Enterprises', 'Logistics & Export', 'Industrial Machinery', 'Wholesale & Trading', 'Business Services'],
        insights: [
            { title: 'Manufacturing Hub', text: 'Turkey is a major manufacturing center for Europe and the Middle East. Connect with producers seeking international partners and suppliers.' },
            { title: 'Export-Oriented', text: 'Reach companies actively exporting to Europe, MENA, and beyond—businesses that understand international B2B relationships.' },
            { title: 'Growing Corporate Sector', text: 'Turkish corporate groups are expanding rapidly. Position your services to support their growth ambitions.' },
            { title: 'Local & International', text: 'Campaigns in Turkish and English to reach both domestic industrial players and internationally-focused enterprises.' }
        ],
        marketStats: [
            { stat: '1.2M+', desc: 'Active industrial companies' },
            { stat: '€210B', desc: 'Annual manufacturing output' },
            { stat: '45%', desc: 'Export-oriented businesses' }
        ],
        marketContext: 'Turkey\'s strategic position bridges European and Asian markets, with a strong manufacturing base and growing corporate sector seeking B2B partnerships.',
        serviceIntro: 'Connect with Turkish manufacturers, corporate groups, and export-oriented businesses through campaigns that understand the local business landscape.'
    },
    'Eastern Europe': {
        targetHeadline: 'Industrial Manufacturers & Growing Enterprises',
        industries: ['Manufacturing & Assembly', 'Automotive Suppliers', 'IT & Business Services', 'Logistics & Warehousing', 'Construction & Development', 'Industrial Equipment', 'Corporate Services', 'Wholesale & Distribution', 'Energy & Utilities', 'Agriculture & Food Processing'],
        insights: [
            { title: 'Manufacturing Growth', text: 'Eastern Europe has emerged as a manufacturing powerhouse. Connect with companies expanding production and seeking suppliers.' },
            { title: 'Cost-Competitive Quality', text: 'Reach enterprises that combine competitive costs with European quality standards—attractive partners for Western companies.' },
            { title: 'EU Integration', text: 'Companies in EU member states follow familiar procurement practices, making cross-border B2B relationships straightforward.' },
            { title: 'Nearshoring Hub', text: 'As companies nearshore operations to Eastern Europe, new B2B opportunities emerge across the supply chain.' }
        ],
        marketStats: [
            { stat: '2M+', desc: 'B2B enterprises' },
            { stat: '€580B', desc: 'Regional GDP' },
            { stat: '7.2%', desc: 'Average growth rate' }
        ],
        marketContext: 'Eastern Europe continues to grow as a B2B hub, with expanding manufacturing capacity and increasingly sophisticated corporate buyers.',
        serviceIntro: 'Tap into Eastern Europe\'s growing industrial base and corporate sector with lead generation campaigns designed for emerging market dynamics.'
    },
    'Southern Europe': {
        targetHeadline: 'Corporate Enterprises & Industrial Companies',
        industries: ['Manufacturing & Production', 'Fashion & Luxury Goods', 'Food & Beverage', 'Construction & Real Estate', 'Corporate Services', 'Automotive & Machinery', 'Tourism Infrastructure', 'Logistics & Transport', 'Wholesale & Retail', 'Professional Services'],
        insights: [
            { title: 'Relationship-Driven', text: 'Southern European business culture emphasizes personal relationships. Our approach builds trust before pushing for meetings.' },
            { title: 'Industry Clusters', text: 'Connect with companies in regional industry clusters—from Italian manufacturing to Spanish construction.' },
            { title: 'Mediterranean Markets', text: 'Reach buyers across Italy, Spain, Portugal, and Greece with campaigns adapted to local business practices.' },
            { title: 'Export Champions', text: 'Many Southern European companies are export leaders in their sectors—ideal partners for international B2B relationships.' }
        ],
        marketStats: [
            { stat: '3.5M+', desc: 'Active B2B companies' },
            { stat: '€2.8T', desc: 'Combined GDP' },
            { stat: '58%', desc: 'Export-active businesses' }
        ],
        marketContext: 'Southern Europe combines industrial tradition with entrepreneurial energy, offering diverse B2B opportunities across manufacturing and services.',
        serviceIntro: 'From Italian manufacturing to Spanish corporate enterprises, we help you connect with decision-makers across Southern Europe\'s diverse B2B landscape.'
    },
    'North America': {
        targetHeadline: 'B2B Enterprises & Corporate Companies',
        industries: ['Corporate Enterprises', 'Manufacturing & Production', 'Business Services', 'Industrial Equipment', 'Construction & Engineering', 'Logistics & Distribution', 'Healthcare Industry', 'Energy & Utilities', 'Telecommunications', 'Professional Services'],
        insights: [
            { title: 'Enterprise Scale', text: 'Access decision-makers at large enterprises and mid-market companies across the US and Canada.' },
            { title: 'Competitive Markets', text: 'Stand out in competitive North American markets with targeted, personalized outreach that cuts through the noise.' },
            { title: 'Time Zone Coverage', text: 'Campaign execution aligned with North American business hours for optimal engagement and response rates.' },
            { title: 'Cross-Border Expansion', text: 'Use North America as your launchpad for global expansion or target specific regional markets.' }
        ],
        marketStats: [
            { stat: '6M+', desc: 'B2B companies' },
            { stat: '$25T', desc: 'Annual B2B commerce' },
            { stat: '78%', desc: 'Digital buying preference' }
        ],
        marketContext: 'North America represents the world\'s largest B2B market, with sophisticated buyers who expect data-driven, value-focused sales approaches.',
        serviceIntro: 'Reach corporate buyers and industrial decision-makers across the United States and Canada with campaigns that match American business expectations.'
    }
};

// Default content for regions not explicitly defined
const defaultRegionContent = {
    targetHeadline: 'B2B Companies & Corporate Enterprises',
    industries: ['Corporate Enterprises', 'Manufacturing Companies', 'Business Services', 'Industrial Suppliers', 'Logistics & Distribution', 'Construction & Engineering', 'Professional Services', 'Wholesale & Trading', 'Technology Companies', 'Energy & Utilities'],
    insights: [
        { title: 'Global Reach', text: 'Connect with B2B decision-makers worldwide through targeted, professional outreach campaigns.' },
        { title: 'Industry Expertise', text: 'Our team understands B2B sales cycles and helps position your offering for enterprise and mid-market buyers.' },
        { title: 'Quality Meetings', text: 'Focus on qualified conversations with buyers who have budget, authority, and genuine interest.' },
        { title: 'Scalable Approach', text: 'Start with targeted campaigns and scale as you identify successful patterns and markets.' }
    ],
    marketStats: [
        { stat: '100M+', desc: 'B2B companies globally' },
        { stat: '$50T+', desc: 'Global B2B commerce' },
        { stat: '65%', desc: 'Prefer digital engagement' }
    ],
    marketContext: 'B2B markets worldwide are increasingly open to professional outreach from qualified providers offering clear value propositions.',
    serviceIntro: 'Our lead generation services help B2B companies connect with corporate and industrial buyers across diverse global markets.'
};

function buildCityPages() {
    console.log('\n🏗️  Building City Landing Pages (B2B/Corporate/Manufacturing Focus)...');

    const templateContent = fs.readFileSync('templates/city-landing.html', 'utf8');

    cities.forEach(cityData => {
        const lang = 'en'; // Currently only EN for cities
        const city = cityData.city;
        const country = cityData.country;
        const region = cityData.region || 'Global';
        const slug = cityData.slug;
        const image = cityData.image || './assets/local/default-city.jpg';

        // Get region-specific content
        const regionData = regionContent[region] || defaultRegionContent;

        // SEO-optimized metadata (no Financial Services, focus on B2B/Corporate/Manufacturing)
        const title = `B2B Lead Generation Agency in ${city}, ${country} | Corporate & Industrial Sales | Expandia`;
        const description = `Professional B2B lead generation services in ${city}. We help corporate enterprises, manufacturers, and industrial companies generate qualified sales meetings and expand their ${region} market presence. Outbound prospecting, appointment setting, and account-based marketing for complex B2B sales cycles.`;
        const keywords = `B2B lead generation ${city}, corporate sales ${city}, industrial lead generation ${country}, appointment setting ${city}, B2B sales agency ${country}, manufacturing leads, enterprise sales, outbound prospecting, account-based marketing ${city}`;

        let htmlTemplate = createHTMLTemplate(lang);
        let content = templateContent;

        // Calculate Nearby Cities
        const nearby = cities
            .filter(c => c.slug !== slug && c.lat && c.lng && cityData.lat && cityData.lng)
            .map(c => ({
                ...c,
                distance: getDistanceFromLatLonInKm(cityData.lat, cityData.lng, c.lat, c.lng)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 4);

        const nearbyHtml = nearby.map(c => `
            <a href="${c.slug}.html" class="block p-4 rounded-lg border border-base-300 hover:border-primary transition-all group bg-base-100">
                <div class="font-bold text-lg group-hover:text-primary">${c.city}</div>
                <div class="text-sm text-base-content/60">${c.country}</div>
                <div class="text-xs text-base-content/40 mt-1">${Math.round(c.distance)} km away</div>
            </a>
        `).join('');

        // Generate Service Links for this City
        const serviceLinksHtml = services.map(service => {
            const serviceSlug = service.slug_pattern.replace('{{CITY_SLUG}}', cityData.slug.replace('b2b-lead-generation-', ''));
            return `
            <a href="${serviceSlug}.html" class="flex items-center gap-4 p-4 rounded-xl bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all group">
                <div class="text-2xl"><i data-lucide="${service.icon}"></i></div>
                <div>
                    <h3 class="font-bold group-hover:text-primary transition-colors">${service.name}</h3>
                    <p class="text-xs text-base-content/60">Available globally</p>
                </div>
            </a>`;
        }).join('');

        // Intro paragraph (unique per region, mentions city)
        const introParagraph = `We help B2B companies reach corporate enterprises, manufacturers, and industrial buyers across ${region}. Whether you're targeting decision-makers in ${city} or expanding across ${country}, our lead generation services deliver qualified sales meetings with buyers who have genuine interest and budget.`;

        // Replace all placeholders
        content = content.replace(/\{\{CITY_NAME\}\}/g, city);
        content = content.replace(/\{\{COUNTRY_NAME\}\}/g, country);
        content = content.replace(/\{\{REGION_NAME\}\}/g, region);
        content = content.replace(/\{\{SERVICE_LINKS\}\}/g, serviceLinksHtml);
        content = content.replace(/\{\{HERO_IMAGE\}\}/g, image);
        content = content.replace(/\{\{CITY_SLUG\}\}/g, slug);
        content = content.replace(/\{\{NEARBY_CITIES\}\}/g, nearbyHtml);

        // Dynamic content from region
        content = content.replace(/\{\{TARGET_HEADLINE\}\}/g, regionData.targetHeadline);
        content = content.replace(/\{\{INTRO_PARAGRAPH\}\}/g, introParagraph);
        content = content.replace(/\{\{SERVICE_INTRO\}\}/g, regionData.serviceIntro);

        // 10 Target Industries
        regionData.industries.forEach((industry, i) => {
            content = content.replace(`{{TARGET_INDUSTRY_${i + 1}}}`, industry);
        });

        // 4 Insights
        regionData.insights.forEach((insight, i) => {
            content = content.replace(`{{INSIGHT_TITLE_${i + 1}}}`, insight.title);
            content = content.replace(`{{INSIGHT_TEXT_${i + 1}}}`, insight.text);
        });

        // 3 Market Stats
        regionData.marketStats.forEach((stat, i) => {
            content = content.replace(`{{MARKET_STAT_${i + 1}}}`, stat.stat);
            content = content.replace(`{{MARKET_STAT_DESC_${i + 1}}}`, stat.desc);
        });
        content = content.replace(/\{\{MARKET_CONTEXT\}\}/g, regionData.marketContext);

        // Navigation and Footer (EN)
        let pageNavigation = navigationEN;
        let pageFooter = footerEN;

        // Common replacements
        const basePath = './';
        const logoPath = 'Expandia-main-logo-koyu-yesil.png';
        htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);

        pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
        pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
        pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
        pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

        // Inject Content
        htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
        htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
        htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

        // Metadata
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, description);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, keywords);
        htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.expandia.ch/${slug}.html`);

        // Hreflang URLs
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `${slug}.html`);

        // Enhanced Schema for City Page (B2B/Corporate focus)
        const schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `B2B Lead Generation Services in ${city}`,
            "provider": { "@type": "Organization", "name": "Expandia", "url": "https://www.expandia.ch" },
            "areaServed": {
                "@type": "City",
                "name": city,
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": country
                }
            },
            "description": description,
            "audience": {
                "@type": "BusinessAudience",
                "audienceType": "B2B companies, corporate enterprises, manufacturers"
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "B2B Sales Services",
                "itemListElement": [
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Outbound Lead Generation" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Appointment Setting" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Account-Based Marketing" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "B2B List Building" } }
                ]
            }
        };
        htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schema, null, 2));

        // Write file
        fs.writeFileSync(`${slug}.html`, htmlTemplate, 'utf8');
    });
    console.log(`✅ Built ${cities.length} city pages with region-specific B2B content.`);
}


// -------------------------------------------------------------------------
// NEW: Build Industry Pages
// -------------------------------------------------------------------------
function buildIndustryPages() {
    console.log('\n🏗️  Building Industry Pages...');

    const templateContent = fs.readFileSync('templates/industry-landing.html', 'utf8');

    industries.forEach(industryData => {
        const lang = 'en';
        const name = industryData.name;
        const slug = industryData.slug;
        const image = industryData.image || './assets/local/default-industry.jpg';
        const title = industryData.title;
        const description = industryData.description;
        const keywords = `B2B lead generation ${name}, lead generation agency ${name}, appointment setting ${name}`;

        let htmlTemplate = createHTMLTemplate(lang);
        let content = templateContent;

        // Replace placeholders in content
        content = content.replace(/\{\{INDUSTRY_NAME\}\}/g, name);
        content = content.replace(/\{\{HERO_IMAGE\}\}/g, image);

        // Navigation and Footer (EN)
        let pageNavigation = navigationEN;
        let pageFooter = footerEN;

        // Common replacements
        const basePath = './';
        const logoPath = 'Expandia-main-logo-koyu-yesil.png';

        pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
        pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
        pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
        pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

        // Inject Content
        htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
        htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
        htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

        // Metadata
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, description);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, keywords);
        htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.expandia.ch/${slug}.html`);

        // Hreflang URLs
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `${slug}.html`);

        // Schema
        const schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `B2B Lead Generation for ${name}`,
            "provider": { "@type": "Organization", "name": "Expandia", "url": "https://www.expandia.ch" },
            "description": description,
            "audience": {
                "@type": "Audience",
                "audienceType": name
            }
        };
        htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schema, null, 2));

        // Write file
        fs.writeFileSync(`${slug}.html`, htmlTemplate, 'utf8');
    });
    console.log(`✅ Built ${industries.length} industry pages.`);
}

// -------------------------------------------------------------------------
// NEW: Build City Locations Page (Map)
// -------------------------------------------------------------------------
function buildCityLocationsPage() {
    console.log('\n🏗️  Building City Locations Page...');

    const templateContent = fs.readFileSync('templates/city-locations.html', 'utf8');
    const lang = 'en';

    // Prepare Head Content (Leaflet CSS)
    const headContent = `
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""/>
    <style>
        #map { height: 80vh; width: 100%; z-index: 1; }
        .city-marker { cursor: pointer; transition: all 0.3s ease; }
        .city-marker:hover { transform: scale(1.2); z-index: 1000; }
        .custom-popup { font-family: inherit; }
        .custom-popup h3 { color: #f9c23c; font-weight: bold; margin-bottom: 0.5rem; }
        .custom-popup a { color: #e86100; text-decoration: none; font-weight: 600; }
        .custom-popup a:hover { text-decoration: underline; }
        .map-container { position: relative; width: 100%; }
        .map-legend { position: absolute; top: 20px; right: 20px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 200px; }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .legend-color { width: 20px; height: 20px; border-radius: 50%; }
    </style>`;

    // Prepare Script Content (Leaflet JS + Logic)
    // Transform cities data for JS
    const citiesForJs = cities.map(c => ({
        name: c.city,
        lat: c.lat || 0,
        lng: c.lng || 0,
        url: `./${c.slug}.html`,
        region: c.region || 'Global'
    }));

    const scriptContent = `
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossorigin=""></script>
    <script>
        const cities = ${JSON.stringify(citiesForJs)};
        
        // Initialize map
        const map = L.map('map').setView([50, 10], 3);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);
        
        const regionColors = {
            'DACH': '#f9c23c',
            'Western Europe': '#e86100',
            'Southern Europe': '#ff6b35',
            'Scandinavia': '#4a90e2',
            'Eastern Europe': '#9b59b6',
            'North America': '#e74c3c',
            'Turkey': '#95a5a6'
        };

        function createCustomIcon(color) {
            return L.divIcon({
                className: 'city-marker',
                html: \`<div style="width: 20px; height: 20px; background-color: \${color}; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.3s ease;"></div>\`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
        }

        cities.forEach(city => {
            if(city.lat === 0 && city.lng === 0) return;
            const color = regionColors[city.region] || '#ff6b35';
            const icon = createCustomIcon(color);
            const marker = L.marker([city.lat, city.lng], { icon: icon }).addTo(map);
            
            const popupContent = \`
                <div class="custom-popup">
                    <h3>\${city.name}</h3>
                    <p style="margin: 0.5rem 0; color: #666;">\${city.region}</p>
                    <a href="\${city.url}" style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1rem; background-color: #f9c23c; color: #000; border-radius: 0.25rem; font-weight: 600; text-decoration: none;">View Services →</a>
                </div>
            \`;
            marker.bindPopup(popupContent);
            marker.on('mouseover', function() { this.openPopup(); });
        });

        const cityListContainer = document.getElementById('city-list');
        cities.sort((a, b) => a.name.localeCompare(b.name)).forEach(city => {
            const cityCard = document.createElement('a');
            cityCard.href = city.url;
            cityCard.className = 'buzz-card p-4 hover:scale-105 transition-transform cursor-pointer';
            cityCard.innerHTML = \`
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full" style="background-color: \${regionColors[city.region] || '#ff6b35'};"></div>
                    <div>
                        <h3 class="font-semibold">\${city.name}</h3>
                        <p class="text-sm text-base-content/60">\${city.region}</p>
                    </div>
                </div>
            \`;
            cityListContainer.appendChild(cityCard);
        });
    </script>`;

    let htmlTemplate = createHTMLTemplate(lang, headContent, scriptContent);
    let content = templateContent.replace('{{CITY_COUNT}}', cities.length);

    // Navigation/Footer replacements... (standard)
    let pageNavigation = navigationEN;
    let pageFooter = footerEN;
    const basePath = './';
    const logoPath = 'Expandia-main-logo-koyu-yesil.png';
    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

    htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
    htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
    htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

    const pageMetadata = getPageMetadata('city-locations', lang);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, 'https://www.expandia.ch/city-locations.html');
    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, '{}'); // TODO: Add schema

    fs.writeFileSync('city-locations.html', htmlTemplate, 'utf8');
    console.log(`✅ Built city-locations.html`);
}

// -------------------------------------------------------------------------
// NEW: Generate Dynamic Sitemap
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// NEW: Build Glossary Pages
// -------------------------------------------------------------------------
function buildGlossaryTerms() {
    console.log('\n📖 Building Glossary Term Pages...');

    const templateContent = fs.readFileSync('templates/glossary-term.html', 'utf8');
    const languages = ['en', 'de', 'fr'];

    languages.forEach(lang => {
        const glossaryIndexUrl = lang === 'en' ? 'glossary.html' : 'glossary.html'; // Relative path handling below

        glossary.forEach(termData => {
            let termName = termData.term;
            let definition = termData.definition;

            // Handle Translation
            if (lang !== 'en' && termData.translations && termData.translations[lang]) {
                termName = termData.translations[lang].term;
                definition = termData.translations[lang].definition;
            }

            // Fallback for missing translation
            if (!termName) termName = termData.term;
            if (!definition) definition = termData.definition;

            let htmlTemplate = createHTMLTemplate(lang);
            let content = templateContent;

            // Common Replacements
            content = content.replace(/\{\{TERM_NAME\}\}/g, termName);
            content = content.replace(/\{\{TERM_DEFINITION\}\}/g, definition);
            content = content.replace(/\{\{TERM_CATEGORY\}\}/g, termData.category);

            // Labels
            const labels = {
                en: { glossary: 'Glossary', related: 'Related Terms', ctaTitle: 'Ready to Scale?', ctaDesc: 'Let us help you implement these strategies.', ctaBtn: 'Get Started' },
                de: { glossary: 'Glossar', related: 'Verwandte Begriffe', ctaTitle: 'Bereit zu skalieren?', ctaDesc: 'Lassen Sie uns Ihnen bei der Umsetzung helfen.', ctaBtn: 'Loslegen' },
                fr: { glossary: 'Glossaire', related: 'Termes Connexes', ctaTitle: 'Prêt à évoluer ?', ctaDesc: 'Laissez-nous vous aider à mettre en œuvre ces stratégies.', ctaBtn: 'Commencer' },
                tr: { glossary: 'Sözlük', related: 'İlgili Terimler', ctaTitle: 'Büyümeye Hazır mısınız?', ctaDesc: 'Bu stratejileri uygulamanıza yardımcı olalım.', ctaBtn: 'Hemen Başla' }
            };
            const label = labels[lang] || labels['en'];

            content = content.replace(/\{\{GLOSSARY_LABEL\}\}/g, label.glossary);
            content = content.replace(/\{\{RELATED_TERMS_LABEL\}\}/g, label.related);
            content = content.replace(/\{\{CTA_TITLE\}\}/g, label.ctaTitle);
            content = content.replace(/\{\{CTA_DESCRIPTION\}\}/g, label.ctaDesc);
            content = content.replace(/\{\{CTA_BUTTON\}\}/g, label.ctaBtn);

            // Related Terms Logic (Random 3 from same category or random)
            const related = glossary
                .filter(t => t.slug !== termData.slug)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            const relatedHtml = related.map(t => {
                let rName = t.term;
                let rDef = t.definition;
                if (lang !== 'en' && t.translations && t.translations[lang]) {
                    rName = t.translations[lang].term;
                    rDef = t.translations[lang].definition;
                }
                const link = `./${t.slug}.html`; // Glossary structure is flat per lang folder
                return `
                <a href="${link}" class="buzz-card p-6 block hover:border-primary transition-colors group">
                    <h3 class="font-bold text-lg mb-2 group-hover:text-primary">${rName}</h3>
                    <p class="text-sm text-base-content/60 line-clamp-3">${rDef}</p>
                </a>`;
            }).join('');
            content = content.replace(/\{\{RELATED_TERMS_LIST\}\}/g, relatedHtml);


            // Navigation/Footer
            let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
            let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

            // Clean i18n
            pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
            pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

            // Glossary is in a subfolder 'glossary/' for EN? Or just 'glossary.html' and flat terms?
            // To support "Programmatic Glossary" scale (2000 pages), we should probably put them in a folder.
            // Let's say: en: /glossary/term.html, de: /de/glossary/term.html

            const basePath = (lang === 'en') ? '../' : '../../'; // glossary/ or lang/glossary/
            const logoPath = (lang === 'en') ? '../Expandia-main-logo-koyu-yesil.png' : '../../Expandia-main-logo-koyu-yesil.png';
            htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
            const turkishServicesPath = lang === 'tr' ? '../' : '../tr/'; // Adjusted for depth

            pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
            pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
            pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
            pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
            pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
            pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

            content = content.replace(/\{\{GLOSSARY_INDEX_URL\}\}/g, './index.html'); // Points to index inside glossary folder

            // Apply Translation Helper
            if (lang !== 'en') {
                pageNavigation = applyTranslations(pageNavigation, lang);
                pageFooter = applyTranslations(pageFooter, lang);
            }

            htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
            htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
            htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

            // Metadata
            const pageTitle = `${termName} - Definition & Business Context | Expandia Glossary`;
            const pageDesc = `What is ${termName}? Definition and business importance for ${termData.category}.`;

            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageTitle);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageDesc);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, `${termName} definition, what is ${termName}, ${termName} meaning, ${termData.category} glossary`);

            const canonicalSlug = lang === 'en' ? `glossary/${termData.slug}.html` : `${lang}/glossary/${termData.slug}.html`;
            htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.expandia.ch/${canonicalSlug}`);

            // Hreflang
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `glossary/${termData.slug}.html`);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `tr/glossary/${termData.slug}.html`);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `de/glossary/${termData.slug}.html`);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `fr/glossary/${termData.slug}.html`);

            // Schema
            const definedTermSchema = {
                "@context": "https://schema.org",
                "@type": "DefinedTerm",
                "name": termName,
                "description": definition,
                "inDefinedTermSet": "https://www.expandia.ch/glossary"
            };

            const faqSchema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [{
                    "@type": "Question",
                    "name": `What is ${termName}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": definition
                    }
                }]
            };

            const schema = [definedTermSchema, faqSchema];
            htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schema, null, 2));

            // Write File
            let outputDir;
            if (lang === 'en') {
                outputDir = 'glossary';
            } else {
                outputDir = `${lang}/glossary`;
            }

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(`${outputDir}/${termData.slug}.html`, htmlTemplate, 'utf8');
        });
    });
    console.log(`✅ Built ${glossary.length * languages.length} Glossary Term pages.`);
}

function buildGlossaryIndex() {
    console.log('\n📖 Building Glossary Index Pages...');

    const templateContent = fs.readFileSync('templates/glossary-index.html', 'utf8');
    const languages = ['en', 'de', 'fr'];

    languages.forEach(lang => {
        let htmlTemplate = createHTMLTemplate(lang);
        let content = templateContent;

        const labels = {
            en: {
                glossary: 'Glossary',
                title: 'Business & Tech Glossary',
                desc: 'Comprehensive definitions for key terms in B2B marketing, sales, and technology.',
                ctaTitle: 'Ready to Scale?', ctaDesc: 'Let us help you implement these strategies.', ctaBtn: 'Get Started'
            },
            de: {
                glossary: 'Glossar',
                title: 'Business & Tech Glossar',
                desc: 'Umfassende Definitionen für Schlüsselbegriffe in B2B-Marketing, Vertrieb und Technologie.',
                ctaTitle: 'Bereit zu skalieren?', ctaDesc: 'Lassen Sie uns Ihnen bei der Umsetzung helfen.', ctaBtn: 'Loslegen'
            },
            fr: {
                glossary: 'Glossaire',
                title: 'Glossaire Business & Tech',
                desc: 'Définitions complètes des termes clés du marketing B2B, des ventes et de la technologie.',
                ctaTitle: 'Prêt à évoluer ?', ctaDesc: 'Laissez-nous vous aider à mettre en œuvre ces stratégies.', ctaBtn: 'Commencer'
            },
            tr: {
                glossary: 'Sözlük',
                title: 'İş ve Teknoloji Sözlüğü',
                desc: 'B2B pazarlama, satış ve teknoloji alanındaki temel terimler için kapsamlı tanımlar.',
                ctaTitle: 'Büyümeye Hazır mısınız?', ctaDesc: 'Bu stratejileri uygulamanıza yardımcı olalım.', ctaBtn: 'Hemen Başla'
            }
        };
        const label = labels[lang] || labels['en'];

        content = content.replace(/\{\{GLOSSARY_LABEL\}\}/g, label.glossary);
        content = content.replace(/\{\{PAGE_TITLE_TEXT\}\}/g, label.title);
        content = content.replace(/\{\{PAGE_DESCRIPTION_TEXT\}\}/g, label.desc);
        content = content.replace(/\{\{CTA_TITLE\}\}/g, label.ctaTitle);
        content = content.replace(/\{\{CTA_DESCRIPTION\}\}/g, label.ctaDesc);
        content = content.replace(/\{\{CTA_BUTTON\}\}/g, label.ctaBtn);

        // Build List
        // Group by letter or just list? For 2000 pages, we need grouping. But for now with 6 terms, just a list is fine.
        // Let's do a simple grid of cards.
        const listHtml = glossary.map(termData => {
            let termName = termData.term;
            let definition = termData.definition;
            if (lang !== 'en' && termData.translations && termData.translations[lang]) {
                termName = termData.translations[lang].term;
                definition = termData.translations[lang].definition;
            }
            if (!termName) termName = termData.term;
            if (!definition) definition = termData.definition;

            const link = `./${termData.slug}.html`;

            return `
             <a href="${link}" class="buzz-card p-6 block hover:border-primary transition-colors group" data-category="${termData.category}">
                <div class="text-sm text-primary mb-2 font-semibold tracking-wide">${termData.category}</div>
                <h3 class="font-bold text-xl mb-3 group-hover:text-primary">${termName}</h3>
                <p class="text-base-content/70 line-clamp-3">${definition}</p>
             </a>
             `;
        }).join('');

        content = content.replace(/\{\{GLOSSARY_LIST\}\}/g, listHtml);

        // Navigation/Footer
        let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
        let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

        pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
        pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

        const basePath = (lang === 'en') ? '../' : '../../';
        const logoPath = (lang === 'en') ? '../Expandia-main-logo-koyu-yesil.png' : '../../Expandia-main-logo-koyu-yesil.png';
        htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
        const turkishServicesPath = lang === 'tr' ? '../' : '../tr/';

        pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
        pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
        pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
        pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

        if (lang !== 'en') {
            pageNavigation = applyTranslations(pageNavigation, lang);
            pageFooter = applyTranslations(pageFooter, lang);
        }

        htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
        htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
        htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

        // Metadata
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, label.title + ' | Expandia');
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, label.desc);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, 'glossary, terms, definitions, B2B, sales, marketing');

        const canonicalSlug = lang === 'en' ? `glossary/index.html` : `${lang}/glossary/index.html`;
        htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.expandia.ch/${canonicalSlug}`);

        // Hreflang
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `glossary/index.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `tr/glossary/index.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `de/glossary/index.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `fr/glossary/index.html`);

        // Schema
        htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, '{}');

        // Write File
        let outputDir;
        if (lang === 'en') {
            outputDir = 'glossary';
        } else {
            outputDir = `${lang}/glossary`;
        }

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(`${outputDir}/index.html`, htmlTemplate, 'utf8');
    });
    console.log(`✅ Built Glossary Index pages.`);
}

function generateSitemap() {
    console.log('\n🗺️  Generating Sitemap...');

    const baseUrl = 'https://www.expandia.ch';
    const today = new Date().toISOString().split('T')[0];

    // List of static pages
    const staticPages = [
        'index.html', 'about.html', 'solutions.html', 'contact.html', 'case-studies.html',
        'managed-it-services.html', 'vulnerability-assessments.html', 'email-security.html',
        'website-care-plans.html', 'revops-crm-setup.html', 'lost-lead-reactivation.html',
        'speed-to-lead.html', 'recruitment.html', 'ai-creative-studio.html', 'city-locations.html'
    ];

    // Add TR/DE/FR versions
    const languages = ['tr', 'de', 'fr'];
    const localizedPages = [];
    languages.forEach(lang => {
        staticPages.forEach(page => {
            localizedPages.push(`${lang}/${page}`);
        });
    });

    // Add City Pages
    const cityPages = cities.map(c => `${c.slug}.html`);

    // Add Industry Pages
    const industryPages = industries.map(i => `${i.slug}.html`);

    // Add Service x City Pages
    const serviceCityPages = [];
    services.forEach(service => {
        cities.forEach(city => {
            const slug = service.slug_pattern.replace('{{CITY_SLUG}}', city.slug.replace('b2b-lead-generation-', ''));
            serviceCityPages.push(`${slug}.html`); // EN
            serviceCityPages.push(`de/${slug}.html`); // DE
            serviceCityPages.push(`fr/${slug}.html`); // FR
        });
    });

    // Add Service x Industry x City Pages
    const serviceIndustryCityPages = [];
    services.forEach(service => {
        topIndustries.forEach(industry => {
            topCities.forEach(cityData => {
                const slug = `${service.slug_pattern.replace('-{{CITY_SLUG}}', '')}-${industry.slug.replace('b2b-lead-generation-', '')}-${cityData.slug.replace('b2b-lead-generation-', '')}`;
                serviceIndustryCityPages.push(`${slug}.html`); // EN
                serviceIndustryCityPages.push(`de/${slug}.html`); // DE
                serviceIndustryCityPages.push(`fr/${slug}.html`); // FR
            });
        });
    });

    // Add Blog Pages
    const blogDir = 'templates/blog';
    let blogPages = [];
    if (fs.existsSync(blogDir)) {
        blogPages = fs.readdirSync(blogDir)
            .filter(file => file.endsWith('.html'))
            .map(file => `blog/${file}`);
    }

    const allPages = [...staticPages, ...localizedPages, ...cityPages, ...industryPages, ...serviceCityPages, ...serviceIndustryCityPages, ...blogPages];

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    allPages.forEach(page => {
        sitemapContent += `
    <url>
        <loc>${baseUrl}/${page}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === 'index.html' ? '1.0' : '0.8'}</priority>
    </url>`;
    });

    sitemapContent += `\n</urlset>`;

    fs.writeFileSync('sitemap.xml', sitemapContent);
    console.log(`✅ Generated sitemap.xml with ${allPages.length} URLs`);
}


// --- EXECUTION ---

// Build English pages
console.log('Building English pages...');
buildPage('index', 'index', 'en');
buildPage('about', 'about', 'en');
buildPage('solutions', 'solutions', 'en');
buildPage('contact', 'contact', 'en');
buildPage('case-studies', 'case-studies', 'en');
buildPage('onboarding', 'onboarding', 'en');
buildPage('vision-mission', 'vision-mission', 'en');
buildPage('our-ethical-principles', 'our-ethical-principles', 'en');
buildPage('market-foundation-program', 'market-foundation-program', 'en');
buildPage('market-accelerator-program', 'market-accelerator-program', 'en');
buildPage('part-time-lead-generation-team', 'part-time-lead-generation-team', 'en');

// Build English service pages
console.log('Building English service pages...');
buildPage('b2b-lead-generation-agency', 'b2b-lead-generation-agency', 'en');
buildPage('sales-development-agency', 'sales-development-agency', 'en');
buildPage('outbound-marketing-agency', 'outbound-marketing-agency', 'en');
buildPage('lead-generation-service', 'lead-generation-service', 'en');
buildPage('prospect-finding-service', 'prospect-finding-service', 'en');
buildPage('appointment-setting-service', 'appointment-setting-service', 'en');
buildPage('cold-email-agency', 'cold-email-agency', 'en');
buildPage('sales-protection-services', 'sales-protection-services', 'en');
buildPage('outsourced-sales-team-service', 'outsourced-sales-team-service', 'en');
buildPage('email-automation', 'email-automation', 'en');
buildPage('email-marketing-management', 'email-marketing-management', 'en');
buildPage('export-marketing-consulting', 'export-marketing-consulting', 'en');
buildPage('international-market-entry', 'international-market-entry', 'en');
buildPage('distributor-finding', 'distributor-finding', 'en');
buildPage('overseas-sales-consulting', 'overseas-sales-consulting', 'en');
buildPage('europe-market-entry', 'europe-market-entry', 'en');
buildPage('corporate-digital-gifting', 'corporate-digital-gifting', 'en');
buildPage('usa-pr-service', 'usa-pr-service', 'en');

// Build New Pillar Pages (English)
console.log('Building New Pillar Pages (English)...');
buildPage('managed-it-services', 'managed-it-services', 'en');
buildPage('vulnerability-assessments', 'vulnerability-assessments', 'en');
buildPage('email-security', 'email-security', 'en');
buildPage('website-care-plans', 'website-care-plans', 'en');
buildPage('revops-crm-setup', 'revops-crm-setup', 'en');
buildPage('lost-lead-reactivation', 'lost-lead-reactivation', 'en');
buildPage('speed-to-lead', 'speed-to-lead', 'en');
buildPage('recruitment', 'recruitment', 'en');
buildPage('ai-creative-studio', 'ai-creative-studio', 'en');
buildPage('blog-index', 'blog/index', 'en');



// Build German pages
console.log('Building German pages...');
buildPage('index', 'index', 'de');
buildPage('about', 'about', 'de');
buildPage('solutions', 'solutions', 'de');
buildPage('contact', 'contact', 'de');
buildPage('case-studies', 'case-studies', 'de');
buildPage('schutzdienstleistungen', 'schutzdienstleistungen', 'de');
buildPage('vision-mission', 'vision-mission', 'de');
buildPage('our-ethical-principles', 'our-ethical-principles', 'de');
buildPage('markt-grundlagen-programm', 'markt-grundlagen-programm', 'de');
buildPage('markt-beschleuniger-programm', 'markt-beschleuniger-programm', 'de');
buildPage('teilzeit-bizdev-team', 'teilzeit-bizdev-team', 'de');
// Build New Pillar Pages (German)
buildPage('managed-it-services', 'managed-it-services', 'de');
buildPage('vulnerability-assessments', 'vulnerability-assessments', 'de');
buildPage('email-security', 'email-security', 'de');
buildPage('website-care-plans', 'website-care-plans', 'de');
buildPage('revops-crm-setup', 'revops-crm-setup', 'de');
buildPage('lost-lead-reactivation', 'lost-lead-reactivation', 'de');
buildPage('speed-to-lead', 'speed-to-lead', 'de');
buildPage('recruitment', 'recruitment', 'de');
buildPage('ai-creative-studio', 'ai-creative-studio', 'de');
buildPage('blog-index', 'blog/index', 'de');

// Build French pages
console.log('Building French pages...');
buildPage('index', 'index', 'fr');
buildPage('about', 'about', 'fr');
buildPage('solutions', 'solutions', 'fr');
buildPage('contact', 'contact', 'fr');
buildPage('case-studies', 'case-studies', 'fr');
buildPage('vision-mission', 'vision-mission', 'fr');
buildPage('our-ethical-principles', 'our-ethical-principles', 'fr');
buildPage('market-foundation-program', 'market-foundation-program', 'fr');
buildPage('market-accelerator-program', 'market-accelerator-program', 'fr');
buildPage('part-time-lead-generation-team', 'part-time-lead-generation-team', 'fr');
// Build New Pillar Pages (French)
buildPage('managed-it-services', 'managed-it-services', 'fr');
buildPage('vulnerability-assessments', 'vulnerability-assessments', 'fr');
buildPage('email-security', 'email-security', 'fr');
buildPage('website-care-plans', 'website-care-plans', 'fr');
buildPage('revops-crm-setup', 'revops-crm-setup', 'fr');
buildPage('lost-lead-reactivation', 'lost-lead-reactivation', 'fr');
buildPage('speed-to-lead', 'speed-to-lead', 'fr');
buildPage('recruitment', 'recruitment', 'fr');
buildPage('ai-creative-studio', 'ai-creative-studio', 'fr');
buildPage('blog-index', 'blog/index', 'fr');

// Call new functions
buildCityPages();
buildIndustryPages();
buildServiceCityPages();
buildServiceIndustryCityPages(); // NEW
buildCityLocationsPage();
buildBlogPosts();
buildGlossaryTerms(); // NEW
buildGlossaryIndex(); // NEW
generateSitemap();

console.log('\n🎉 BUILD COMPLETE with enhanced SEO!');
console.log('📁 Generated files have been updated from templates/');
console.log('⚠️  REMEMBER: Always edit templates/, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for development guidelines');
console.log('🚀 Ready for deployment!\n');
