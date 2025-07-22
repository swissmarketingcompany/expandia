const fs = require('fs');
const path = require('path');

// Read navigation and footer once
const navigation = fs.readFileSync('includes/header.html', 'utf8');
const footer = fs.readFileSync('includes/footer.html', 'utf8');

// HTML Document Template
function createHTMLTemplate(lang = 'en') {
    const basePath = lang === 'tr' ? '../' : './';
    
    return `<!DOCTYPE html>
<html lang="${lang}" data-theme="bumblebee">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PAGE_TITLE}} | Expandia - Sales Growth Partner</title>
    <meta name="description" content="{{PAGE_DESCRIPTION}}">
    <link href="${basePath}dist/css/output.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="${basePath}favicon.ico">
    <link rel="icon" type="image/png" href="${basePath}favicon.png">
    <link rel="apple-touch-icon" href="${basePath}favicon.png">
</head>
<body class="font-sans">
    {{NAVIGATION}}
    
    {{MAIN_CONTENT}}
    
    {{FOOTER}}
    
    <script src="${basePath}src/js/index.js"></script>
</body>
</html>`;
}

// Translation content for Turkish
const turkishTranslations = {
    // Navigation
    'Get Started': 'Başlayın',
    'Solutions': 'Çözümler',
    'About': 'Hakkımızda',
    'Contact': 'İletişim',
    'Special Services': 'Özel Hizmetler',
    'Lead Generation': 'Potansiyel Müşteri Üretimi',
    'Sales Development': 'Satış Geliştirme',
    'Marketing': 'Pazarlama',
    'International': 'Uluslararası',
    'Local Markets': 'Yerel Pazarlar',
    'Ready to accelerate your sales growth?': 'Satış büyümenizi hızlandırmaya hazır mısınız?',
    'Let\'s discuss your specific needs': 'Özel ihtiyaçlarınızı konuşalım',
    'Get Free Consultation →': 'Ücretsiz Danışmanlık Alın →',
    'Comprehensive sales growth solutions for your business': 'İşletmeniz için kapsamlı satış büyüme çözümleri',
    'Complete sales management and operations outsourcing': 'Komple satış yönetimi ve operasyon dış kaynak kullanımı',
    'BuffSend platform and AI-powered sales tools': 'BuffSend platformu ve AI destekli satış araçları',
    'Real results from companies we\'ve helped': 'Yardım ettiğimiz şirketlerden gerçek sonuçlar',
    'Istanbul Services': 'İstanbul Hizmetleri',
    'Lead Generation & Sales': 'Potansiyel Müşteri Üretimi & Satış',
    'Marketing & Outreach': 'Pazarlama & İletişim',
    'International Expansion': 'Uluslararası Genişleme',
    'Cold Email Agency': 'Soğuk E-posta Ajansı',
    'Outsourced Sales Team': 'Dış Kaynaklı Satış Ekibi',
    'Overseas Sales Consulting': 'Yurt Dışı Satış Danışmanlığı',
    
    // Footer Newsletter
    'Stay Updated with Sales Insights': 'Satış Görüşleri ile Güncel Kalın',
    'Get the latest sales strategies and industry updates.': 'En son satış stratejilerini ve sektör güncellemelerini alın.',
    'Enter your email': 'E-postanızı girin',
    'Subscribe': 'Abone Ol',
    
    // Footer Company Info
    'Your Partner in Sales Growth and Revenue Acceleration. We help businesses scale their sales operations with proven strategies and cutting-edge solutions.': 'Satış Büyümesi ve Gelir Hızlandırma Ortağınız. İşletmelerin satış operasyonlarını kanıtlanmış stratejiler ve son teknoloji çözümlerle ölçeklendirmelerine yardımcı oluyoruz.',
    
    // Footer Links (removing duplicate)
    'Sales as a Service': 'Hizmet Olarak Satış',
    'Sales AI Solutions': 'Satış AI Çözümleri',
    'Lead Generation': 'Potansiyel Müşteri Üretimi',
    'BuffSend Platform': 'BuffSend Platformu',
    'Company': 'Şirket',
    'Success Stories': 'Başarı Hikayeleri',
    'About Us': 'Hakkımızda',
    'Contact Us': 'İletişim',
    'Contact': 'İletişim',
    // Handle partial translations
    'Hakkımızda Us': 'Hakkımızda',
    'İletişim Us': 'İletişim',
    'Blog': 'Blog',
    
    // Footer Contact
    'Get in Touch': 'İletişime Geçin',
    'Ready to accelerate your sales growth? Let\'s discuss how we can help.': 'Satış büyümenizi hızlandırmaya hazır mısınız? Size nasıl yardımcı olabileceğimizi konuşalım.',
    'Get Free Consultation': 'Ücretsiz Danışmanlık Alın',
    'Schedule a Call': 'Toplantı Ayarlayın',
    
    // Footer Bottom
    '&copy; 2024 Expandia. All rights reserved.': '&copy; 2024 Expandia. Tüm hakları saklıdır.',
    'Privacy Policy': 'Gizlilik Politikası',
    'Terms of Service': 'Hizmet Şartları',
    'Cookie Policy': 'Çerez Politikası'
};

// Function to apply Turkish translations
function applyTurkishTranslations(content) {
    let translatedContent = content;
    
    // Apply all translations
    for (const [english, turkish] of Object.entries(turkishTranslations)) {
        // For longer phrases, do exact string replacement first
        if (english.includes(' ')) {
            translatedContent = translatedContent.replace(new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), turkish);
        } else {
            // For single words, use word boundary regex to avoid partial matches
            const regex = new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
            translatedContent = translatedContent.replace(regex, turkish);
        }
    }
    
    return translatedContent;
}

// Function to get page metadata
function getPageMetadata(templateName, lang = 'en') {
    const isturkish = lang === 'tr';
    
    const metadata = {
        'index': {
            title: isturkish ? 'Ana Sayfa' : 'Home',
            description: isturkish 
                ? 'Satış büyümesi ve gelir hızlandırma ortağınız. Kanıtlanmış stratejiler ve son teknoloji çözümlerle işletmenizi büyütün.'
                : 'Your partner in sales growth and revenue acceleration. Scale your business with proven strategies and cutting-edge solutions.'
        },
        'solutions': {
            title: isturkish ? 'Çözümler' : 'Solutions',
            description: isturkish 
                ? 'Satış operasyonlarınızı ölçeklendirin. Hizmet Olarak Satış ve AI destekli araçlarla daha fazla müşteri kazanın.'
                : 'Scale your sales operations with Sales as a Service and AI-powered tools to win more customers.'
        },
        'about': {
            title: isturkish ? 'Hakkımızda' : 'About',
            description: isturkish 
                ? 'Expandia ekibi ve satış büyümesi konusundaki uzmanlığımız hakkında bilgi edinin.'
                : 'Learn about the Expandia team and our expertise in sales growth.'
        },
        'contact': {
            title: isturkish ? 'İletişim' : 'Contact',
            description: isturkish 
                ? 'Ücretsiz danışmanlık için bizimle iletişime geçin ve satış büyümenizi hızlandırın.'
                : 'Get in touch for a free consultation and accelerate your sales growth.'
        },
        'case-studies': {
            title: isturkish ? 'Başarı Hikayeleri' : 'Case Studies',
            description: isturkish 
                ? 'Müşterilerimizin satış büyümesi başarı hikayelerini keşfedin.'
                : 'Discover our clients\' sales growth success stories.'
        }
    };
    
    return metadata[templateName] || { title: 'Expandia', description: 'Sales Growth Partner' };
}

// Function to get active states for navigation
function getActiveStates(pageType) {
    const states = {
        HOME_ACTIVE: '',
        SOLUTIONS_ACTIVE: '',
        COMPANY_ACTIVE: '',
        BLOG_ACTIVE: '',
        SOLUTIONS_ITEM_ACTIVE: '',
        CASESTUDIES_ITEM_ACTIVE: '',
        ABOUT_ITEM_ACTIVE: '',
        CONTACT_ITEM_ACTIVE: '',
        // Mobile states
        HOME_MOBILE_ACTIVE: '',
        SOLUTIONS_MOBILE_ACTIVE: '',
        CASESTUDIES_MOBILE_ACTIVE: '',
        ABOUT_MOBILE_ACTIVE: '',
        CONTACT_MOBILE_ACTIVE: '',
        BLOG_MOBILE_ACTIVE: ''
    };

    // Set active states based on current page
    switch (pageType) {
        case 'index':
            states.HOME_ACTIVE = 'text-primary';
            states.HOME_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'solutions':
            states.SOLUTIONS_ACTIVE = 'text-primary';
            states.SOLUTIONS_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.SOLUTIONS_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'case-studies':
            states.SOLUTIONS_ACTIVE = 'text-primary';
            states.CASESTUDIES_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.CASESTUDIES_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'about':
            states.COMPANY_ACTIVE = 'text-primary';
            states.ABOUT_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.ABOUT_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'contact':
            states.COMPANY_ACTIVE = 'text-primary';
            states.CONTACT_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.CONTACT_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
    }

    return states;
}

// Function to build a page
function buildPage(templateName, outputName, lang = 'en') {
    const templatePath = lang === 'tr' ? `templates/tr/${templateName}.html` : `templates/${templateName}.html`;
    
    if (!fs.existsSync(templatePath)) {
        console.log(`Template ${templatePath} not found, skipping...`);
        return;
    }
    
    let content = fs.readFileSync(templatePath, 'utf8');
    
    // Create the HTML document template
    let htmlTemplate = createHTMLTemplate(lang);
    let pageNavigation = navigation;
    let pageFooter = footer;
    
    // Remove data-i18n attributes and keep the content as is
    content = content.replace(/\s*data-i18n="[^"]*"/g, '');
    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');
    
    // Apply template variables based on language
    const basePath = lang === 'tr' ? '../' : './';
    const logoPath = lang === 'tr' ? '../Expandia-main-logo-koyu-yesil.png' : 'Expandia-main-logo-koyu-yesil.png';
    const turkishServicesPath = lang === 'tr' ? './' : './tr/';
    
    // Replace template variables in navigation and footer
    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    
    // Get active states for navigation
    const activeStates = getActiveStates(templateName);
    
    // Replace navigation template variables
    for (const [key, value] of Object.entries(activeStates)) {
        pageNavigation = pageNavigation.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    
    // Apply Turkish translations if building Turkish version
    if (lang === 'tr') {
        pageNavigation = applyTurkishTranslations(pageNavigation);
        pageFooter = applyTurkishTranslations(pageFooter);
        content = applyTurkishTranslations(content);
    }
    
    // Insert navigation, content, and footer into HTML template
    htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
    htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
    htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);
    
    // Set page-specific metadata
    const pageMetadata = getPageMetadata(templateName, lang);
    htmlTemplate = htmlTemplate.replace('{{PAGE_TITLE}}', pageMetadata.title);
    htmlTemplate = htmlTemplate.replace('{{PAGE_DESCRIPTION}}', pageMetadata.description);
    
    // Write to appropriate location
    const outputPath = lang === 'tr' ? `tr/${outputName}.html` : `${outputName}.html`;
    fs.writeFileSync(outputPath, htmlTemplate);
    console.log(`Built ${outputPath}`);
}

// Build all pages
console.log('Building English pages...');
buildPage('index', 'index');
buildPage('about', 'about');
buildPage('solutions', 'solutions');
buildPage('contact', 'contact');
buildPage('case-studies', 'case-studies');

console.log('Building Turkish pages...');
buildPage('index', 'index', 'tr');
buildPage('about', 'about', 'tr');
buildPage('solutions', 'solutions', 'tr');
buildPage('contact', 'contact', 'tr');
buildPage('case-studies', 'case-studies', 'tr');

console.log('Build complete!'); 