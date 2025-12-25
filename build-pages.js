
const fs = require('fs');
const path = require('path');
const cities = require('./data/cities.json');
const industries = require('./data/industries.json');
const services = require('./data/services.json');
const serviceContent = require('./data/service-content.json');
const metadata = require('./data/metadata.json');
const { createHTMLTemplate, generateOrganizationSchema, generateBreadcrumbSchema } = require('./scripts/utils/template-engine');
const { applyTranslations } = require('./scripts/utils/translations');

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
const navigationTR = fs.readFileSync('includes/header-tr.html', 'utf8');
const navigationDE = fs.readFileSync('includes/header-de.html', 'utf8');
const navigationFR = fs.readFileSync('includes/header-fr.html', 'utf8');
const footerEN = fs.readFileSync(footerPath, 'utf8');
const footerTR = fs.existsSync('includes/footer-tr.html') ? fs.readFileSync('includes/footer-tr.html', 'utf8') : footerEN;
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
        'index': { en: '', tr: 'tr/', de: 'de/', fr: 'fr/' },
        'solutions': { en: 'solutions.html', tr: 'tr/solutions.html', de: 'de/solutions.html', fr: 'fr/solutions.html' },
        'about': { en: 'about.html', tr: 'tr/about.html', de: 'de/about.html', fr: 'fr/about.html' },
        'contact': { en: 'contact.html', tr: 'tr/contact.html', de: 'de/contact.html', fr: 'fr/contact.html' },
        'case-studies': { en: 'case-studies.html', tr: 'tr/case-studies.html', de: 'de/case-studies.html', fr: 'fr/case-studies.html' },
        'managed-it-services': { en: 'managed-it-services.html', tr: 'tr/managed-it-services.html', de: 'de/managed-it-services.html', fr: 'fr/managed-it-services.html' },
        'vulnerability-assessments': { en: 'vulnerability-assessments.html', tr: 'tr/vulnerability-assessments.html', de: 'de/vulnerability-assessments.html', fr: 'fr/vulnerability-assessments.html' },
        'email-security': { en: 'email-security.html', tr: 'tr/email-security.html', de: 'de/email-security.html', fr: 'fr/email-security.html' },
        'website-care-plans': { en: 'website-care-plans.html', tr: 'tr/website-care-plans.html', de: 'de/website-care-plans.html', fr: 'fr/website-care-plans.html' },
        'revops-crm-setup': { en: 'revops-crm-setup.html', tr: 'tr/revops-crm-setup.html', de: 'de/revops-crm-setup.html', fr: 'fr/revops-crm-setup.html' },
        'lost-lead-reactivation': { en: 'lost-lead-reactivation.html', tr: 'tr/lost-lead-reactivation.html', de: 'de/lost-lead-reactivation.html', fr: 'fr/lost-lead-reactivation.html' },
        'speed-to-lead': { en: 'speed-to-lead.html', tr: 'tr/speed-to-lead.html', de: 'de/speed-to-lead.html', fr: 'fr/speed-to-lead.html' },
        'recruitment': { en: 'recruitment.html', tr: 'tr/recruitment.html', de: 'de/recruitment.html', fr: 'fr/recruitment.html' },
        'ai-creative-studio': { en: 'ai-creative-studio.html', tr: 'tr/ai-creative-studio.html', de: 'de/ai-creative-studio.html', fr: 'fr/ai-creative-studio.html' },
        'vision-mission': { en: 'vision-mission.html', tr: 'tr/vizyon-misyon.html', de: 'de/vision-mission.html', fr: 'fr/vision-mission.html' },
        'vizyon-misyon': { en: 'vision-mission.html', tr: 'tr/vizyon-misyon.html', de: 'de/vision-mission.html', fr: 'fr/vision-mission.html' },
        'our-ethical-principles': { en: 'our-ethical-principles.html', tr: 'tr/etik-ilkelerimiz.html', de: 'de/our-ethical-principles.html', fr: 'fr/our-ethical-principles.html' },
        'etik-ilkelerimiz': { en: 'our-ethical-principles.html', tr: 'tr/etik-ilkelerimiz.html', de: 'de/our-ethical-principles.html', fr: 'fr/our-ethical-principles.html' },
        'market-foundation-program': { en: 'market-foundation-program.html', tr: 'tr/pazar-temeli-programi.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'pazar-temeli-programi': { en: 'market-foundation-program.html', tr: 'tr/pazar-temeli-programi.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'markt-grundlagen-programm': { en: 'market-foundation-program.html', tr: 'tr/pazar-temeli-programi.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'market-accelerator-program': { en: 'market-accelerator-program.html', tr: 'tr/pazar-hizlandirici-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'pazar-hizlandirici-program': { en: 'market-accelerator-program.html', tr: 'tr/pazar-hizlandirici-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'markt-beschleuniger-programm': { en: 'market-accelerator-program.html', tr: 'tr/pazar-hizlandirici-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'part-time-lead-generation-team': { en: 'part-time-lead-generation-team.html', tr: 'tr/kismi-is-gelistirme-ekibi.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'kismi-is-gelistirme-ekibi': { en: 'part-time-lead-generation-team.html', tr: 'tr/kismi-is-gelistirme-ekibi.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'teilzeit-bizdev-team': { en: 'part-time-lead-generation-team.html', tr: 'tr/kismi-is-gelistirme-ekibi.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'abd-pr-hizmeti': { en: 'usa-pr-service.html', tr: 'tr/abd-pr-hizmeti.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' },
        'corporate-digital-gifting': { en: 'corporate-digital-gifting.html', tr: 'tr/kurumsal-dijital-hediye-promosyon.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'usa-pr-service': { en: 'usa-pr-service.html', tr: 'tr/abd-pr-hizmeti.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' },
        'kurumsal-dijital-hediye-promosyon': { en: 'corporate-digital-gifting.html', tr: 'tr/kurumsal-dijital-hediye-promosyon.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'unternehmens-digitale-geschenke': { en: 'corporate-digital-gifting.html', tr: 'tr/kurumsal-dijital-hediye-promosyon.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'usa-pr-dienst': { en: 'usa-pr-service.html', tr: 'tr/abd-pr-hizmeti.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' }
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
    const templateDir = lang === 'tr' || lang === 'de' || lang === 'fr' ? `templates/${lang}/` : 'templates/';
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
    let pageNavigation = lang === 'tr' ? navigationTR : lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
    let pageFooter = lang === 'tr' ? footerTR : lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

    // Clean up data-i18n attributes as we handle translation on build
    content = content.replace(/\s*data-i18n="[^"]*"/g, '');
    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

    const basePath = (lang === 'tr' || lang === 'de' || lang === 'fr') ? '../' : './';
    const logoPath = (lang === 'tr' || lang === 'de' || lang === 'fr') ? '../Expandia-main-logo-koyu-yesil.png' : 'Expandia-main-logo-koyu-yesil.png';
    const turkishServicesPath = lang === 'tr' ? './' : './tr/';

    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);

     // Language specific logic 
    if (lang === 'tr') {
         pageNavigation = applyTranslations(pageNavigation, 'tr');
         pageFooter = applyTranslations(pageFooter, 'tr');
         content = applyTranslations(content, 'tr');
         pageNavigation = pageNavigation.replace(/href="\.\.\/b2b-lead-generation-agency\.html"/g, 'href="./b2b-lead-generation-ajansi.html"');
    } else if (lang === 'de') {
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
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, hreflangUrls2.tr);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, hreflangUrls2.de);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, hreflangUrls2.fr || 'fr/');
    
    htmlTemplate = htmlTemplate.replace(
        `<link rel="alternate" hreflang="de" href="https://www.expandia.ch/${hreflangUrls2.de}">`,
        `<link rel="alternate" hreflang="de" href="https://www.expandia.ch/${hreflangUrls2.de}">\n    <link rel="alternate" hreflang="fr" href="https://www.expandia.ch/${hreflangUrls2.fr || 'fr/'}">`
    );

    let outputPath = lang === 'en' ? `${outputName}.html` : `${lang}/${outputName}.html`;
    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
    console.log(`✅ Built ${outputPath}`);
}

// Blog Post Building Function
function buildBlogPost(templateName, outputName, lang = 'en') {
    console.log(`🏗️  Building blog post: ${outputName} (${lang.toUpperCase()})`);

    const basePath = lang === 'en' ? '../' : '../../';
    const logoPath = lang === 'en' ? '../Expandia-main-logo-koyu-yesil.png' : '../../Expandia-main-logo-koyu-yesil.png';

    // Read blog post template
    let blogTemplate;
    const templatePath = `templates/blog/${templateName}.html`;

    if (fs.existsSync(templatePath)) {
        blogTemplate = fs.readFileSync(templatePath, 'utf8');
    } else {
        console.log(`⚠️  Blog template ${templatePath} not found`);
        return;
    }

    // Process includes
    blogTemplate = blogTemplate.replace('{{HEADER_INCLUDE}}', navigationEN);
    blogTemplate = blogTemplate.replace('{{FOOTER_INCLUDE}}', footerEN);

    // Replace path placeholders
    blogTemplate = blogTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
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
    console.log('\n🏗️  Building Blog Posts...');
    const blogDir = 'templates/blog';
    if (fs.existsSync(blogDir)) {
        const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));
        files.forEach(file => {
            const templateName = file.replace('.html', '');
            // For now only English
            buildBlogPost(templateName, templateName, 'en');
        });
        console.log(`✅ Built ${files.length} blog posts.`);
    } else {
        console.log('⚠️ Blog templates directory not found.');
    }
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
    const languages = ['en', 'de', 'fr', 'tr'];

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
                let pageNavigation = lang === 'tr' ? navigationTR : lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
                let pageFooter = lang === 'tr' ? footerTR : lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;
                
                // Clean i18n
                pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
                pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

                const basePath = (lang === 'tr' || lang === 'de' || lang === 'fr') ? '../' : './';
                const logoPath = (lang === 'tr' || lang === 'de' || lang === 'fr') ? '../Expandia-main-logo-koyu-yesil.png' : 'Expandia-main-logo-koyu-yesil.png';
                const turkishServicesPath = lang === 'tr' ? './' : './tr/';

                pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
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
                const currentFlag = lang === 'tr' ? '🇹🇷' : lang === 'de' ? '🇩🇪' : lang === 'fr' ? '🇫🇷' : '🇺🇸';
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
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `tr/${slug}.html`);
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
// NEW: Build City Landing Pages (Refactored)
// -------------------------------------------------------------------------
function buildCityPages() {
    console.log('\n🏗️  Building City Landing Pages...');
    
    const templateContent = fs.readFileSync('templates/city-landing.html', 'utf8');
    
    cities.forEach(cityData => {
        const lang = 'en'; // Currently only EN for cities
        const city = cityData.city;
        const country = cityData.country;
        const slug = cityData.slug; // e.g., 'b2b-lead-generation-london'
        const image = cityData.image || './assets/local/default-city.jpg';
        
        // Prepare metadata
        const title = `B2B Lead Generation Agency in ${city} | Financial & Corporate Hub | Expandia`;
        const description = `B2B lead generation agency in ${city} helping financial services, technology, and professional services companies win qualified leads across the UK and Europe.`;
        const keywords = `B2B lead generation ${city}, lead generation agency ${city}, sales agency ${city}, appointment setting ${city}, ${country} B2B leads`;

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

        // Replace placeholders in content
        content = content.replace(/\{\{CITY_NAME\}\}/g, city);
        content = content.replace(/\{\{COUNTRY_NAME\}\}/g, country);
        content = content.replace(/\{\{HERO_IMAGE\}\}/g, image);
        content = content.replace(/\{\{CITY_SLUG\}\}/g, slug);
        content = content.replace(/\{\{NEARBY_CITIES\}\}/g, nearbyHtml);
        content = content.replace(/\{\{CITY_POPULATION\}\}/g, cityData.population || 'growing');
        content = content.replace(/\{\{CITY_LANDMARK\}\}/g, cityData.landmark || 'the city center');
        
        // Navigation and Footer (EN)
        let pageNavigation = navigationEN;
        let pageFooter = footerEN;
        
        // Common replacements
        const basePath = './';
        const logoPath = 'Expandia-main-logo-koyu-yesil.png';
        
        pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
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
        
        // Enhanced Schema for City Page
        const schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `B2B Lead Generation ${city}`,
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
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "B2B Sales Services",
                "itemListElement": [
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Outbound Lead Generation" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Appointment Setting" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "B2B List Building" } }
                ]
            }
        };
        htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schema, null, 2));

        // Write file
        fs.writeFileSync(`${slug}.html`, htmlTemplate, 'utf8');
    });
    console.log(`✅ Built ${cities.length} city pages.`);
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
            serviceCityPages.push(`tr/${slug}.html`); // TR
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

    const allPages = [...staticPages, ...localizedPages, ...cityPages, ...industryPages, ...serviceCityPages, ...blogPages];
    
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

// Build Turkish pages
console.log('Building Turkish pages...');
buildPage('index', 'index', 'tr');
buildPage('about', 'about', 'tr');
buildPage('solutions', 'solutions', 'tr');
buildPage('contact', 'contact', 'tr');
buildPage('case-studies', 'case-studies', 'tr');
buildPage('satis-koruma-hizmetleri', 'satis-koruma-hizmetleri', 'tr');
buildPage('vizyon-misyon', 'vizyon-misyon', 'tr');
buildPage('etik-ilkelerimiz', 'etik-ilkelerimiz', 'tr');
buildPage('pazar-temeli-programi', 'pazar-temeli-programi', 'tr');
buildPage('pazar-hizlandirici-program', 'pazar-hizlandirici-program', 'tr');
buildPage('kismi-is-gelistirme-ekibi', 'kismi-is-gelistirme-ekibi', 'tr');
// Build New Pillar Pages (Turkish)
buildPage('managed-it-services', 'managed-it-services', 'tr');
buildPage('vulnerability-assessments', 'vulnerability-assessments', 'tr');
buildPage('email-security', 'email-security', 'tr');
buildPage('website-care-plans', 'website-care-plans', 'tr');
buildPage('revops-crm-setup', 'revops-crm-setup', 'tr');
buildPage('lost-lead-reactivation', 'lost-lead-reactivation', 'tr');
buildPage('speed-to-lead', 'speed-to-lead', 'tr');
buildPage('recruitment', 'recruitment', 'tr');
buildPage('ai-creative-studio', 'ai-creative-studio', 'tr');

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

// Call new functions
buildCityPages();
buildIndustryPages();
buildServiceCityPages();
buildCityLocationsPage();
buildBlogPosts();
generateSitemap();

console.log('\n🎉 BUILD COMPLETE with enhanced SEO!');
console.log('📁 Generated files have been updated from templates/');
console.log('⚠️  REMEMBER: Always edit templates/, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for development guidelines');
console.log('🚀 Ready for deployment!\n');
