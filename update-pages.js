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
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
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
                                <li><a href="solutions.html" {{SOLUTIONS_MOBILE_ACTIVE}}>Our AI Solutions</a></li>
                                <li><a href="industries.html" {{INDUSTRIES_MOBILE_ACTIVE}}>Industries We Serve</a></li>
                                <li><a href="how-we-work.html" {{HOWWEWORK_MOBILE_ACTIVE}}>How We Work</a></li>
                                <li><a href="case-studies.html" {{CASESTUDIES_MOBILE_ACTIVE}}>Success Stories</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary class="font-semibold">Resources</summary>
                            <ul class="p-2">
                                <li><a href="roi-calculator.html" {{ROI_MOBILE_ACTIVE}}>ROI Calculator</a></li>
                                <li><a href="ai-readiness-assessment.html" {{ASSESSMENT_MOBILE_ACTIVE}}>AI Assessment</a></li>
                                <li><a href="cost-estimator.html" {{COST_MOBILE_ACTIVE}}>Cost Estimator</a></li>
                                <li><a href="competitor-analysis.html" {{COMPETITOR_MOBILE_ACTIVE}}>AI Benchmark</a></li>
                                <li><a href="resources.html" {{RESOURCES_MOBILE_ACTIVE}}>Free Downloads</a></li>
                                <li><a href="blog.html" {{BLOG_MOBILE_ACTIVE}}>AI Insights Blog</a></li>
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
            <a href="index.html" class="btn btn-ghost text-2xl font-bold gradient-header">Expandia</a>
        </div>
        
        <!-- Desktop Mega Menu -->
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">
                <!-- Solutions Mega Menu -->
                <li class="dropdown dropdown-hover">
                    <div tabindex="0" role="button" class="btn btn-ghost font-semibold {{SOLUTIONS_ACTIVE}}">
                        Solutions
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                    <div tabindex="0" class="dropdown-content z-[1] card card-compact w-80 p-4 shadow-xl bg-base-100 border border-base-300">
                        <div class="card-body">
                            <h3 class="card-title text-primary mb-3">AI Solutions & Services</h3>
                            <div class="grid gap-2">
                                <a href="solutions.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{SOLUTIONS_ITEM_ACTIVE}}">
                                    <span class="text-xl">🤖</span>
                                    <div>
                                        <div class="font-semibold">Our AI Solutions</div>
                                        <div class="text-sm text-base-content/60">AI Agents, Automation & More</div>
                                    </div>
                                </a>
                                <a href="industries.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{INDUSTRIES_ITEM_ACTIVE}}">
                                    <span class="text-xl">🏢</span>
                                    <div>
                                        <div class="font-semibold">Industries We Serve</div>
                                        <div class="text-sm text-base-content/60">Healthcare, Finance, Retail & More</div>
                                    </div>
                                </a>
                                <a href="how-we-work.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{HOWWEWORK_ITEM_ACTIVE}}">
                                    <span class="text-xl">⚙️</span>
                                    <div>
                                        <div class="font-semibold">How We Work</div>
                                        <div class="text-sm text-base-content/60">Our Proven 5-Step Process</div>
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

                <!-- Resources Mega Menu -->
                <li class="dropdown dropdown-hover">
                    <div tabindex="0" role="button" class="btn btn-ghost font-semibold {{RESOURCES_ACTIVE}}">
                        Resources
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                    <div tabindex="0" class="dropdown-content z-[1] card card-compact w-96 p-4 shadow-xl bg-base-100 border border-base-300">
                        <div class="card-body">
                            <h3 class="card-title text-primary mb-3">Tools & Resources</h3>
                            <div class="grid md:grid-cols-2 gap-2">
                                <a href="roi-calculator.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{ROI_ITEM_ACTIVE}}">
                                    <span class="text-xl">💰</span>
                                    <div>
                                        <div class="font-semibold">ROI Calculator</div>
                                        <div class="text-sm text-base-content/60">Calculate AI Returns</div>
                                    </div>
                                </a>
                                <a href="ai-readiness-assessment.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{ASSESSMENT_ITEM_ACTIVE}}">
                                    <span class="text-xl">🎯</span>
                                    <div>
                                        <div class="font-semibold">AI Assessment</div>
                                        <div class="text-sm text-base-content/60">Check Your Readiness</div>
                                    </div>
                                </a>
                                <a href="cost-estimator.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{COST_ITEM_ACTIVE}}">
                                    <span class="text-xl">📊</span>
                                    <div>
                                        <div class="font-semibold">Cost Estimator</div>
                                        <div class="text-sm text-base-content/60">Project Cost Analysis</div>
                                    </div>
                                </a>
                                <a href="competitor-analysis.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{COMPETITOR_ITEM_ACTIVE}}">
                                    <span class="text-xl">🏆</span>
                                    <div>
                                        <div class="font-semibold">AI Benchmark</div>
                                        <div class="text-sm text-base-content/60">Competitive Analysis</div>
                                    </div>
                                </a>
                                <a href="resources.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{RESOURCES_ITEM_ACTIVE}}">
                                    <span class="text-xl">📚</span>
                                    <div>
                                        <div class="font-semibold">Free Downloads</div>
                                        <div class="text-sm text-base-content/60">Guides & Templates</div>
                                    </div>
                                </a>
                                <a href="blog.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors {{BLOG_ITEM_ACTIVE}}">
                                    <span class="text-xl">✍️</span>
                                    <div>
                                        <div class="font-semibold">AI Insights Blog</div>
                                        <div class="text-sm text-base-content/60">Latest Trends & Tips</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </li>

                <!-- Company Mega Menu -->
                <li class="dropdown dropdown-hover">
                    <div tabindex="0" role="button" class="btn btn-ghost font-semibold {{COMPANY_ACTIVE}}">
                        Company
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                    <div tabindex="0" class="dropdown-content z-[1] card card-compact w-72 p-4 shadow-xl bg-base-100 border border-base-300">
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
                                        <div class="text-sm text-base-content/60">Let's Start Your AI Journey</div>
                                    </div>
                                </a>
                            </div>
                            <div class="border-t border-base-300 mt-4 pt-4">
                                <a href="contact.html" class="btn btn-primary btn-sm w-full buzz-button">
                                    Book Free Consultation
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="navbar-end">
            <a href="contact.html" class="btn btn-primary buzz-button">Get Started</a>
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

    <!-- JavaScript for smooth interactions -->
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

        {{CUSTOM_JS}}
    </script>
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
        RESOURCES_ACTIVE: '',
        COMPANY_ACTIVE: '',
        SOLUTIONS_ITEM_ACTIVE: '',
        INDUSTRIES_ITEM_ACTIVE: '',
        HOWWEWORK_ITEM_ACTIVE: '',
        CASESTUDIES_ITEM_ACTIVE: '',
        ROI_ITEM_ACTIVE: '',
        ASSESSMENT_ITEM_ACTIVE: '',
        COST_ITEM_ACTIVE: '',
        COMPETITOR_ITEM_ACTIVE: '',
        RESOURCES_ITEM_ACTIVE: '',
        BLOG_ITEM_ACTIVE: '',
        ABOUT_ITEM_ACTIVE: '',
        CONTACT_ITEM_ACTIVE: '',
        // Mobile states
        SOLUTIONS_MOBILE_ACTIVE: '',
        INDUSTRIES_MOBILE_ACTIVE: '',
        HOWWEWORK_MOBILE_ACTIVE: '',
        CASESTUDIES_MOBILE_ACTIVE: '',
        ROI_MOBILE_ACTIVE: '',
        ASSESSMENT_MOBILE_ACTIVE: '',
        COST_MOBILE_ACTIVE: '',
        COMPETITOR_MOBILE_ACTIVE: '',
        RESOURCES_MOBILE_ACTIVE: '',
        BLOG_MOBILE_ACTIVE: '',
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
        case 'industries':
            states.SOLUTIONS_ACTIVE = 'text-primary';
            states.INDUSTRIES_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.INDUSTRIES_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'howwework':
            states.SOLUTIONS_ACTIVE = 'text-primary';
            states.HOWWEWORK_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.HOWWEWORK_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'casestudies':
            states.SOLUTIONS_ACTIVE = 'text-primary';
            states.CASESTUDIES_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.CASESTUDIES_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'roi':
            states.RESOURCES_ACTIVE = 'text-primary';
            states.ROI_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.ROI_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'assessment':
            states.RESOURCES_ACTIVE = 'text-primary';
            states.ASSESSMENT_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.ASSESSMENT_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'cost':
            states.RESOURCES_ACTIVE = 'text-primary';
            states.COST_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.COST_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'competitor':
            states.RESOURCES_ACTIVE = 'text-primary';
            states.COMPETITOR_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.COMPETITOR_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'resources':
            states.RESOURCES_ACTIVE = 'text-primary';
            states.RESOURCES_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.RESOURCES_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
            break;
        case 'blog':
            states.RESOURCES_ACTIVE = 'text-primary';
            states.BLOG_ITEM_ACTIVE = 'bg-primary/10 border border-primary/20';
            states.BLOG_MOBILE_ACTIVE = 'class="text-primary font-semibold"';
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