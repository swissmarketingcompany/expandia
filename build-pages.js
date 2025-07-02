const fs = require('fs');
const path = require('path');

// Read the header and footer templates
const headerTemplate = fs.readFileSync(path.join(__dirname, 'includes/header.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(__dirname, 'includes/footer.html'), 'utf8');

// Page configurations
const pages = [
    {
        name: 'index',
        title: 'Expand What\'s Possible with AI | Expandia - AI Solution Partner',
        description: 'Your Partner in Building Practical, Scalable AI Solutions. We help companies build real, working AI – fast.',
        activeStates: { solutions: '', company: '', solutionsItem: '', companyItem: '' }
    },
    {
        name: 'solutions', 
        title: 'AI Solutions | Expandia - AI Solution Partner',
        description: 'Comprehensive AI solutions including AI Agents, Automation, Predictive Analytics, and Content AI.',
        activeStates: { solutions: 'text-primary', company: '', solutionsItem: 'bg-primary/10 border border-primary/20', companyItem: '' }
    },
    {
        name: 'about',
        title: 'About Us | Expandia - AI Solution Partner', 
        description: 'Meet the team behind Expandia. We\'re builders, not just consultants, focused on practical AI solutions.',
        activeStates: { solutions: '', company: 'text-primary', solutionsItem: '', companyItem: 'bg-primary/10 border border-primary/20' }
    },
    {
        name: 'contact',
        title: 'Contact Us | Expandia - AI Solution Partner',
        description: 'Ready to transform your business with AI? Let\'s start your AI journey together.',
        activeStates: { solutions: '', company: 'text-primary', solutionsItem: '', companyItem: 'bg-primary/10 border border-primary/20' }
    },
    {
        name: 'case-studies',
        title: 'Success Stories | Expandia - AI Solution Partner',
        description: 'Real results from real companies. See how AI transformed businesses across industries.',
        activeStates: { solutions: 'text-primary', company: '', solutionsItem: 'bg-primary/10 border border-primary/20', companyItem: '' }
    }
];

// Function to build a page
function buildPage(pageConfig) {
    const templatePath = path.join(__dirname, 'templates', `${pageConfig.name}.html`);
    
    // Check if template exists
    if (!fs.existsSync(templatePath)) {
        console.log(`Template not found: ${templatePath}, skipping...`);
        return;
    }
    
    // Read the page template
    const pageTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders in header
    let processedHeader = headerTemplate
        .replace(/{{SOLUTIONS_ACTIVE}}/g, pageConfig.activeStates.solutions)
        .replace(/{{COMPANY_ACTIVE}}/g, pageConfig.activeStates.company)
        .replace(/{{SOLUTIONS_ITEM_ACTIVE}}/g, pageConfig.activeStates.solutionsItem)
        .replace(/{{ABOUT_ITEM_ACTIVE}}/g, pageConfig.activeStates.companyItem)
        .replace(/{{CONTACT_ITEM_ACTIVE}}/g, pageConfig.activeStates.companyItem)
        .replace(/{{CASESTUDIES_ITEM_ACTIVE}}/g, pageConfig.activeStates.solutionsItem);
    
    // Replace placeholders in footer
    let processedFooter = footerTemplate
        .replace(/{{SOLUTIONS_URL}}/g, 'solutions.html')
        .replace(/{{ABOUT_URL}}/g, 'about.html')
        .replace(/{{CONTACT_URL}}/g, 'contact.html')
        .replace(/{{CASE_STUDIES_URL}}/g, 'case-studies.html')
        .replace(/{{BLOG_URL}}/g, 'blog/index.html')
        .replace(/{{JS_PATH}}/g, '.')
        .replace(/{{SOLUTIONS_FOOTER_ACTIVE}}/g, pageConfig.name === 'solutions' ? 'text-primary' : '')
        .replace(/{{ABOUT_FOOTER_ACTIVE}}/g, pageConfig.name === 'about' ? 'text-primary' : '')
        .replace(/{{CONTACT_FOOTER_ACTIVE}}/g, pageConfig.name === 'contact' ? 'text-primary' : '')
        .replace(/{{CASE_STUDIES_FOOTER_ACTIVE}}/g, pageConfig.name === 'case-studies' ? 'text-primary' : '')
        .replace(/{{BLOG_FOOTER_ACTIVE}}/g, pageConfig.name === 'blog' ? 'text-primary' : '');
    
    // Add page-specific scripts
    let pageSpecificScripts = '';
    if (pageConfig.name === 'contact') {
        pageSpecificScripts = '<script src="./src/js/contact.js"></script>';
    }
    
    // Build the final HTML
    const finalHTML = `<!DOCTYPE html>
<html lang="en" data-theme="bumblebee">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageConfig.title}</title>
    <meta name="description" content="${pageConfig.description}">
    <link href="./dist/css/output.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
</head>
<body class="font-sans">
${processedHeader}

${pageTemplate}

${processedFooter}

    <!-- JavaScript for smooth interactions -->
    <script src="./dist/js/index.js"></script>
    <script src="./src/js/i18n.js"></script>
    ${pageSpecificScripts}
    <script>
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
    
    // Write the final HTML file
    const outputPath = path.join(__dirname, `${pageConfig.name}.html`);
    fs.writeFileSync(outputPath, finalHTML);
    console.log(`✅ Built: ${pageConfig.name}.html`);
}

// Create templates directory if it doesn't exist
const templatesDir = path.join(__dirname, 'templates');
if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir);
    console.log('📁 Created templates directory');
}

// Build all pages
console.log('🚀 Building pages...');
pages.forEach(buildPage);
console.log('✨ All pages built successfully!'); 