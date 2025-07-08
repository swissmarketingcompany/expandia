const fs = require('fs');
const path = require('path');

// Read header and footer once
const header = fs.readFileSync('includes/header.html', 'utf8');
const footer = fs.readFileSync('includes/footer.html', 'utf8');

// Translation content for Turkish
const turkishTranslations = {
    // Navigation
    'Get Started': 'Başlayın',
    'Solutions': 'Çözümler',
    'About': 'Hakkımızda',
    'Contact': 'İletişim',
    
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

// Function to build a page
function buildPage(templateName, outputName, lang = 'en') {
    const templatePath = lang === 'tr' ? `templates/tr/${templateName}.html` : `templates/${templateName}.html`;
    
    if (!fs.existsSync(templatePath)) {
        console.log(`Template ${templatePath} not found, skipping...`);
        return;
    }
    
    let content = fs.readFileSync(templatePath, 'utf8');
    
    // Update header for language switching
    let pageHeader = header;
    
    // Remove data-i18n attributes and keep the content as is
    content = content.replace(/\s*data-i18n="[^"]*"/g, '');
    pageHeader = pageHeader.replace(/\s*data-i18n="[^"]*"/g, '');
    let pageFooter = footer.replace(/\s*data-i18n="[^"]*"/g, '');
    
    // Apply template variables based on language
    const basePath = lang === 'tr' ? '../' : './';
    const logoPath = lang === 'tr' ? '../Expandia-main-logo-koyu-yesil.png' : 'Expandia-main-logo-koyu-yesil.png';
    
    // Replace template variables in footer and header
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageHeader = pageHeader.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageHeader = pageHeader.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    
    // Apply Turkish translations if building Turkish version
    if (lang === 'tr') {
        pageFooter = applyTurkishTranslations(pageFooter);
        pageHeader = applyTurkishTranslations(pageHeader);
    }
    
    // Build the complete page
    const fullPage = pageHeader + '\n' + content + '\n' + pageFooter;
    
    // Write to appropriate location
    const outputPath = lang === 'tr' ? `tr/${outputName}.html` : `${outputName}.html`;
    fs.writeFileSync(outputPath, fullPage);
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