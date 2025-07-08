const fs = require('fs');
const path = require('path');

// Read header and footer once
const header = fs.readFileSync('includes/header.html', 'utf8');
const footer = fs.readFileSync('includes/footer.html', 'utf8');

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
    
    // Replace footer template variables based on language
    if (lang === 'tr') {
        // For Turkish version, links need to go up one level since we're in /tr/ directory
        pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, '../');
        pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, '../');
        
        // Update navigation links for Turkish version
        pageHeader = pageHeader.replace(/href="([^"]*\.html)"/g, (match, href) => {
            if (href.startsWith('http') || href.startsWith('#')) return match;
            return `href="/tr/${href}"`;
        });
        
        // Update content links for Turkish version
        content = content.replace(/href="([^"]*\.html)"/g, (match, href) => {
            if (href.startsWith('http') || href.startsWith('#')) return match;
            return `href="/tr/${href}"`;
        });
        
        // Fix image paths for Turkish version (they need to go up one level)
        content = content.replace(/src="src\/assets\//g, 'src="../src/assets/');
    } else {
        // For English version, use relative paths from root
        pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, '');
        pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, '');
        
        // For English version, keep the same paths
        // Images are served from root, so src/assets/ works
    }
    
    // Combine header, content, and footer
    const finalContent = `<!DOCTYPE html>
<html lang="${lang}" data-theme="bumblebee">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expandia - Sales Growth & Revenue Acceleration Partner</title>
    <meta name="description" content="We handle your sales operations and provide AI-powered tools to generate more leads, close more deals, and scale your revenue faster.">
    <link href="${lang === 'tr' ? '../dist/css/output.css' : 'dist/css/output.css'}" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
</head>
<body class="font-sans">
${pageHeader}

${content}

${pageFooter}

    <!-- JavaScript for smooth interactions -->
    <script src="${lang === 'tr' ? '../dist/js/index.js' : 'dist/js/index.js'}"></script>
    <script>
        // Update flag display based on current language
        document.addEventListener('DOMContentLoaded', function() {
            const currentFlag = document.getElementById('current-flag');
            if (currentFlag) {
                currentFlag.textContent = '${lang === 'tr' ? '🇹🇷' : '🇺🇸'}';
            }
        });
    </script>
</body>
</html>`;
    
    // Determine output path
    const outputDir = lang === 'tr' ? 'tr' : '.';
    const outputPath = path.join(outputDir, `${outputName}.html`);
    
    // Ensure output directory exists
    if (lang === 'tr' && !fs.existsSync('tr')) {
        fs.mkdirSync('tr', { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(outputPath, finalContent);
    console.log(`Built ${outputPath}`);
}

// Build all pages for both languages
const pages = [
    { template: 'index', output: 'index' },
    { template: 'about', output: 'about' },
    { template: 'solutions', output: 'solutions' },
    { template: 'contact', output: 'contact' },
    { template: 'case-studies', output: 'case-studies' }
];

console.log('Building English pages...');
pages.forEach(page => {
    buildPage(page.template, page.output, 'en');
});

console.log('Building Turkish pages...');
pages.forEach(page => {
    buildPage(page.template, page.output, 'tr');
});

console.log('Build complete!'); 