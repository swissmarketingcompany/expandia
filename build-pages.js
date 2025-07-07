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
    
    if (lang === 'tr') {
        // Update navigation links for Turkish version
        pageHeader = pageHeader.replace(/href="([^"]*\.html)"/g, (match, href) => {
            if (href.startsWith('http') || href.startsWith('#')) return match;
            return `href="/tr/${href}"`;
        });
        
        // Update language switcher functions
        pageHeader = pageHeader.replace(/onclick="switchToEnglish\(\)"/g, `onclick="window.location.href = window.location.pathname.replace('/tr/', '/')"`);
        pageHeader = pageHeader.replace(/onclick="switchToTurkish\(\)"/g, `onclick="window.location.href = window.location.pathname.replace('/tr/', '/')"`);
        
        // Update content links for Turkish version
        content = content.replace(/href="([^"]*\.html)"/g, (match, href) => {
            if (href.startsWith('http') || href.startsWith('#')) return match;
            return `href="/tr/${href}"`;
        });
    } else {
        // For English, update language switcher to point to Turkish
        pageHeader = pageHeader.replace(/onclick="switchToTurkish\(\)"/g, `onclick="window.location.href = '/tr' + window.location.pathname"`);
    }
    
    // Combine header, content, and footer
    const finalContent = `<!DOCTYPE html>
<html lang="${lang}" data-theme="bumblebee">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expandia - Sales Growth & Revenue Acceleration Partner</title>
    <meta name="description" content="We handle your sales operations and provide AI-powered tools to generate more leads, close more deals, and scale your revenue faster.">
    <link href="${lang === 'tr' ? '../' : './'}dist/css/output.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
</head>
<body class="font-sans">
${pageHeader}

${content}

${pageFooter}

    <!-- JavaScript for smooth interactions -->
    <script src="${lang === 'tr' ? '../' : './'}dist/js/index.js"></script>
    <script>
        // Make functions globally available
        window.switchToEnglish = function() {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/tr/')) {
                window.location.href = currentPath.replace('/tr/', '/');
            } else if (currentPath === '/tr' || currentPath === '/tr/index.html') {
                window.location.href = '/';
            }
        };
        
        window.switchToTurkish = function() {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/tr/')) {
                return;
            } else if (currentPath === '/' || currentPath === '/index.html') {
                window.location.href = '/tr/';
            } else {
                window.location.href = '/tr' + currentPath;
            }
        };
        
        // Update flag display
        const currentFlag = document.getElementById('current-flag');
        if (currentFlag) {
            currentFlag.textContent = '${lang === 'tr' ? '🇹🇷' : '🇺🇸'}';
        }
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add animation classes when elements come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        // Observe all service cards and animated elements
        document.querySelectorAll('.service-card, .buzz-card, .animate-slide-up').forEach(card => {
            observer.observe(card);
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