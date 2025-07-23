const fs = require('fs');
const path = require('path');

// Consistent header template
const headerTemplate = `<!DOCTYPE html>
<html lang="en" data-theme="bumblebee">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PAGE_TITLE}} | Expandia - AI Solution Partner</title>
    <meta name="description" content="{{PAGE_DESCRIPTION}}">
    <link href="./dist/css/output.css" rel="stylesheet">
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" href="/favicon.png">
        <link rel="apple-touch-icon" href="/favicon.png">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XY2B6K4R6Q"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-XY2B6K4R6Q');
    </script>
</head>
<body class="font-sans">
    <!-- Navigation -->
    <nav class="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
                    </svg>
                </div>
                <!-- Mobile Menu -->
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-72">
                    <li>
                        <details>
                            <summary class="font-semibold">Solutions</summary>
                            <ul class="p-2">
                                <li><a href="solutions.html" {{SOLUTIONS_MOBILE_ACTIVE}}>Our Sales Solutions</a></li>
                                <li><a href="case-studies.html" {{CASESTUDIES_MOBILE_ACTIVE}}>Success Stories</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary class="font-semibold">Company</summary>
                            <ul class="p-2">
                                <li><a href="about.html" {{ABOUT_MOBILE_ACTIVE}}>About Us</a></li>
                                <li><a href="contact.html" {{CONTACT_MOBILE_ACTIVE}}>Contact Us</a></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
            <a href="index.html" class="btn btn-ghost hover:bg-transparent">
                <img src="Expandia-main-logo-koyu-yesil.png" alt="Expandia" class="h-8 md:h-10 w-auto transition-all duration-300 hover:scale-105 logo-bumblebee">
            </a>
        </div>
        
        <!-- Desktop Mega Menu -->
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <!-- Solutions Mega Menu -->
                <li class="dropdown dropdown-hover">
                    <div tabindex="0" role="button" class="btn btn-ghost font-semibold {{SOLUTIONS_ACTIVE}}" data-i18n="header.solutions">
                        Solutions
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                    <div tabindex="0" class="dropdown-content z-[1] card card-compact w-80 p-4 shadow-xl bg-base-100 border border-base-300" style="background-color: white !important; background: white !important;">
                        <div class="card-body" style="background-color: white !important;">
                            <h3 class="card-title text-primary mb-3">Sales Solutions & Services</h3>
                            <div class="grid gap-2">
                                <a href="solutions.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{SOLUTIONS_ITEM_ACTIVE}}">
                                    <span class="text-xl">📞</span>
                                    <div>
                                        <div class="font-semibold">Sales as a Service</div>
                                        <div class="text-sm text-base-content/60">Complete Sales Management</div>
                                    </div>
                                </a>
                                <a href="solutions.html#ai-solutions" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors">
                                    <span class="text-xl">🤖</span>
                                    <div>
                                        <div class="font-semibold">Sales AI Solutions</div>
                                        <div class="text-sm text-base-content/60">BuffSend & AI Tools</div>
                                    </div>
                                </a>
                                <a href="case-studies.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{CASESTUDIES_ITEM_ACTIVE}}">
                                    <span class="text-xl">📈</span>
                                    <div>
                                        <div class="font-semibold">Success Stories</div>
                                        <div class="text-sm text-base-content/60">Real Results from Real Companies</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </li>

                <!-- Company Mega Menu -->
                <li class="dropdown dropdown-hover">
                    <div tabindex="0" role="button" class="btn btn-ghost font-semibold {{COMPANY_ACTIVE}}" data-i18n="header.company">
                        Company
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                    <div tabindex="0" class="dropdown-content z-[1] card card-compact w-72 p-4 shadow-xl bg-base-100 border border-base-300" style="background-color: white !important; background: white !important;">
                        <div class="card-body">
                            <h3 class="card-title text-primary mb-3">About Expandia</h3>
                            <div class="grid gap-2">
                                <a href="about.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{ABOUT_ITEM_ACTIVE}}">
                                    <span class="text-xl">👥</span>
                                    <div>
                                        <div class="font-semibold">About Us</div>
                                        <div class="text-sm text-base-content/60">Our Mission & Team</div>
                                    </div>
                                </a>
                                <a href="contact.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{CONTACT_ITEM_ACTIVE}}">
                                    <span class="text-xl">📞</span>
                                    <div>
                                        <div class="font-semibold">Contact Us</div>
                                        <div class="text-sm text-base-content/60">Boost Your Sales</div>
                                    </div>
                                </a>
                            </div>
                            <div class="border-t border-base-300 mt-4 pt-4">
                                <a href="contact.html" class="btn btn-primary btn-sm w-full buzz-button">
                                    Get Free Consultation
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="navbar-end">
            <select id="language-selector" class="select select-bordered select-sm mr-4">
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
            </select>
            <a href="contact.html" class="btn btn-primary buzz-button" data-i18n="header.get_started">Get Started</a>
        </div>
    </nav>

    <!-- MAIN CONTENT PLACEHOLDER -->
    {{MAIN_CONTENT}}`;

// Consistent footer template
const footerTemplate = `
    <!-- Footer -->
    <footer class="bg-buzz-neutral text-white">
        <div class="container mx-auto container-padding py-16">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-2xl font-bold gradient-header mb-4">Expandia</h3>
                    <p class="text-white/80 mb-4">
                        Your Partner in Building Practical, Scalable AI Solutions.
                    </p>
                    <div class="flex gap-4">
                        <a href="#" class="text-white/60 hover:text-primary transition-colors">LinkedIn</a>
                        <a href="#" class="text-white/60 hover:text-primary transition-colors">Twitter</a>
                        <a href="#" class="text-white/60 hover:text-primary transition-colors">GitHub</a>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Solutions</h4>
                    <ul class="space-y-2 text-white/80">
                        <li><a href="solutions.html" class="hover:text-primary transition-colors">AI Agents</a></li>
                        <li><a href="solutions.html" class="hover:text-primary transition-colors">Automation</a></li>
                        <li><a href="solutions.html" class="hover:text-primary transition-colors">Predictive Analytics</a></li>
                        <li><a href="solutions.html" class="hover:text-primary transition-colors">Content AI</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Tools</h4>
                    <ul class="space-y-2 text-white/80">
                        <li><a href="roi-calculator.html" class="hover:text-primary transition-colors">ROI Calculator</a></li>
                        <li><a href="ai-readiness-assessment.html" class="hover:text-primary transition-colors">AI Assessment</a></li>
                        <li><a href="cost-estimator.html" class="hover:text-primary transition-colors">Cost Estimator</a></li>
                        <li><a href="competitor-analysis.html" class="hover:text-primary transition-colors">AI Benchmark</a></li>
                        <li><a href="resources.html" class="hover:text-primary transition-colors">Free Resources</a></li>
                        <li><a href="blog.html" class="hover:text-primary transition-colors">AI Blog</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Company</h4>
                    <ul class="space-y-2 text-white/80">
                        <li><a href="about.html" class="hover:text-primary transition-colors">About</a></li>
                        <li><a href="industries.html" class="hover:text-primary transition-colors">Industries</a></li>
                        <li><a href="case-studies.html" class="hover:text-primary transition-colors">Case Studies</a></li>
                        <li><a href="contact.html" class="hover:text-primary transition-colors">Contact</a></li>
                        <li><a href="how-we-work.html" class="hover:text-primary transition-colors">How We Work</a></li>
                    </ul>
                    <div class="mt-6">
                        <h5 class="font-semibold mb-2">Get Started</h5>
                        <p class="text-white/80 mb-3 text-sm">Ready to transform your business with AI?</p>
                        <a href="contact.html" class="btn btn-primary btn-sm w-full buzz-button">Book Consultation</a>
                    </div>
                </div>
            </div>
            
            <div class="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
                <p>&copy; 2024 Expandia. All rights reserved. | Privacy Policy | Terms of Service</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript for translations and functionality -->
    <script src="./dist/js/i18n.js"></script>
    <script src="./dist/js/tools.js"></script>
    <script src="./dist/js/index.js"></script>
</body>
</html>`;

// Page configurations
const pageConfigs = {
    'index.html': {
        title: 'Expand What\'s Possible with AI',
        description: 'Your Partner in Building Practical, Scalable AI Solutions. We help companies build real, working AI – fast.',
        activeSection: 'home'
    },
    'solutions.html': {
        title: 'AI Solutions',
        description: 'Comprehensive AI solutions including AI Agents, Automation, Predictive Analytics, and Content AI.',
        activeSection: 'solutions'
    },
    'industries.html': {
        title: 'Industries We Serve',
        description: 'AI solutions tailored for Healthcare, Financial Services, Retail, Manufacturing, and more.',
        activeSection: 'industries'
    },
    'how-we-work.html': {
        title: 'How We Work',
        description: 'Our proven 5-step process: Discovery, Strategy, MVP, Deploy, and Scale.',
        activeSection: 'howwework'
    },
    'case-studies.html': {
        title: 'Success Stories',
        description: 'Real results from real companies. See how AI transformed businesses across industries.',
        activeSection: 'casestudies'
    },
    'about.html': {
        title: 'About Us',
        description: 'Meet the team behind Expandia. We\'re builders, not just consultants, focused on practical AI solutions.',
        activeSection: 'about'
    },
    'contact.html': {
        title: 'Contact Us',
        description: 'Ready to transform your business with AI? Let\'s start your AI journey together.',
        activeSection: 'contact'
    },
    'blog.html': {
        title: 'AI Insights Blog',
        description: 'Latest trends, tutorials, and insights in AI implementation and strategy.',
        activeSection: 'blog'
    },
    'resources.html': {
        title: 'Free Resources',
        description: 'Download free AI guides, templates, whitepapers, and tools to accelerate your AI journey.',
        activeSection: 'resources'
    },
    'roi-calculator.html': {
        title: 'AI ROI Calculator',
        description: 'Calculate the potential return on investment for your AI initiatives.',
        activeSection: 'roi'
    },
    'ai-readiness-assessment.html': {
        title: 'AI Readiness Assessment',
        description: 'Assess your organization\'s readiness for AI implementation.',
        activeSection: 'assessment'
    },
    'cost-estimator.html': {
        title: 'AI Cost Estimator',
        description: 'Get accurate cost estimates for your AI project.',
        activeSection: 'cost'
    },
    'competitor-analysis.html': {
        title: 'AI Competitor Benchmark',
        description: 'Benchmark your AI capabilities against industry leaders.',
        activeSection: 'competitor'
    }
};

// Function to get active states for navigation
function getActiveStates(activeSection) {
    const states = {
        SOLUTIONS_ACTIVE: '',
        COMPANY_ACTIVE: '',
        SOLUTIONS_ITEM_ACTIVE: '',
        CASESTUDIES_ITEM_ACTIVE: '',
        ABOUT_ITEM_ACTIVE: '',
        CONTACT_ITEM_ACTIVE: '',
        // Mobile states
        SOLUTIONS_MOBILE_ACTIVE: '',
        CASESTUDIES_MOBILE_ACTIVE: '',
        ABOUT_MOBILE_ACTIVE: '',
        CONTACT_MOBILE_ACTIVE: ''
    };

    // Set active states based on current page
    switch (activeSection) {
        case 'solutions':
            states.SOLUTIONS_ACTIVE = 'text-primary';
            states.SOLUTIONS_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.SOLUTIONS_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'casestudies':
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

// Function to extract main content from existing HTML
function extractMainContent(htmlContent) {
    // Find the main content between nav and footer
    const navEndIndex = htmlContent.indexOf('</nav>');
    const footerStartIndex = htmlContent.indexOf('<!-- Footer -->');
    
    if (navEndIndex === -1 || footerStartIndex === -1) {
        console.log('Could not find nav or footer markers, extracting between body tags');
        const bodyStartIndex = htmlContent.indexOf('<body');
        const bodyEndIndex = htmlContent.indexOf('</body>');
        if (bodyStartIndex !== -1 && bodyEndIndex !== -1) {
            const bodyContent = htmlContent.substring(bodyStartIndex, bodyEndIndex);
            const contentStart = bodyContent.indexOf('>') + 1;
            return bodyContent.substring(contentStart);
        }
        return htmlContent;
    }
    
    return htmlContent.substring(navEndIndex + 6, footerStartIndex).trim();
}

// Function to process a single page
function processPage(filename) {
    const config = pageConfigs[filename];
    if (!config) {
        console.log(`No configuration found for ${filename}, skipping...`);
        return;
    }

    try {
        // Read the existing file
        const existingContent = fs.readFileSync(filename, 'utf8');
        
        // Extract main content
        const mainContent = extractMainContent(existingContent);
        
        // Get active states
        const activeStates = getActiveStates(config.activeSection);
        
        // Create new content
        let newContent = headerTemplate
            .replace('{{PAGE_TITLE}}', config.title)
            .replace('{{PAGE_DESCRIPTION}}', config.description)
            .replace('{{MAIN_CONTENT}}', mainContent);
        
        // Replace all active state placeholders
        for (const [key, value] of Object.entries(activeStates)) {
            newContent = newContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        
        // Add footer
        newContent += footerTemplate.replace('{{CUSTOM_JS}}', '');
        
        // Write the updated file
        fs.writeFileSync(filename, newContent, 'utf8');
        console.log(`✅ Updated ${filename}`);
        
    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
    }
}

// Main execution
console.log('🚀 Starting page updates...\n');

// Process all pages
Object.keys(pageConfigs).forEach(filename => {
    if (fs.existsSync(filename)) {
        processPage(filename);
    } else {
        console.log(`⚠️  File ${filename} not found, skipping...`);
    }
});

console.log('\n✨ Page updates completed!');
console.log('🔧 Run "npm run build && npm run serve" to see the changes.');

// Function to read footer include
function getFooterInclude() {
    return fs.readFileSync('includes/footer.html', 'utf8');
}

// Function to get all HTML files
function getHtmlFiles() {
    const files = fs.readdirSync('.')
        .filter(file => file.endsWith('.html') && file !== 'base-template.html')
        .filter(file => !file.startsWith('.'));
    
    return files;
}

// Function to replace footer in a file
function replaceFooterInFile(filename) {
    console.log(`Processing ${filename}...`);
    
    let content = fs.readFileSync(filename, 'utf8');
    
    // Pattern to match the footer section - looking for the footer tag and everything until closing body tag
    const footerPattern = /    <!-- Footer -->\s*<footer[\s\S]*?<\/footer>\s*(?=    <!-- JavaScript|<script|<\/body>)/;
    
    // Alternative pattern for simpler footers
    const simpleFooterPattern = /<footer[\s\S]*?<\/footer>/;
    
    // Check if file has a footer
    if (footerPattern.test(content) || simpleFooterPattern.test(content)) {
        // Replace with include placeholder
        content = content.replace(footerPattern, '{{FOOTER_INCLUDE}}');
        content = content.replace(simpleFooterPattern, '{{FOOTER_INCLUDE}}');
        
        // Now replace the placeholder with the actual include content
        const footerInclude = getFooterInclude();
        content = content.replace('{{FOOTER_INCLUDE}}', footerInclude);
        
        // Write back to file
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`✓ Updated footer in ${filename}`);
        return true;
    } else {
        console.log(`⚠ No footer found in ${filename}`);
        return false;
    }
}

// Main function
function main() {
    console.log('Starting footer standardization...\n');
    
    const htmlFiles = getHtmlFiles();
    let updatedCount = 0;
    
    for (const file of htmlFiles) {
        try {
            if (replaceFooterInFile(file)) {
                updatedCount++;
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }
    
    console.log(`\nFooter standardization complete!`);
    console.log(`Updated ${updatedCount} out of ${htmlFiles.length} files.`);
}

// Run the script
main(); 