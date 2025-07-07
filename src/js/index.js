// Index Page JavaScript - Button Functionality and Interactions

document.addEventListener('DOMContentLoaded', function() {
    console.log('Index page JavaScript loaded');

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

    // Hero Section Button Handlers
    function setupHeroButtons() {
        console.log('Setting up hero buttons...');
        
        // Main CTA button - Book Free AI Consultation
        const heroConsultationBtn = document.querySelector('.credit-badge');
        if (heroConsultationBtn) {
            console.log('Found hero consultation button:', heroConsultationBtn);
            heroConsultationBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Hero consultation button clicked');
                window.location.href = 'contact.html';
            });
            heroConsultationBtn.style.cursor = 'pointer';
        } else {
            console.warn('Hero consultation button not found');
        }

        // View Our Work button
        const viewWorkBtn = document.querySelector('.btn-outline.btn-neutral');
        if (viewWorkBtn) {
            console.log('Found view work button:', viewWorkBtn);
            viewWorkBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('View our work button clicked');
                window.location.href = 'case-studies.html';
            });
        } else {
            console.warn('View work button not found');
        }
    }

    // Solutions Section Button Handlers
    function setupSolutionButtons() {
        console.log('Setting up solution buttons...');
        const solutionButtons = document.querySelectorAll('.service-card .btn');
        console.log(`Found ${solutionButtons.length} solution buttons`);
        
        solutionButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`Solution button ${index + 1} clicked`);
                // Navigate to solutions page with specific anchor
                const solutionAnchors = [
                    '#ai-agents',
                    '#automation', 
                    '#predictive-analytics',
                    '#lead-enrichment',
                    '#nlp-documents',
                    '#content-ai'
                ];
                
                if (solutionAnchors[index]) {
                    console.log(`Navigating to: solutions.html${solutionAnchors[index]}`);
                    window.location.href = `solutions.html${solutionAnchors[index]}`;
                } else {
                    console.log('Navigating to: solutions.html');
                    window.location.href = 'solutions.html';
                }
            });
        });
    }

    // CTA Section Button Handlers
    function setupCTAButtons() {
        console.log('Setting up CTA buttons...');
        // Find CTA section buttons
        const ctaSection = document.querySelector('.bg-gradient-to-r.from-primary.to-secondary');
        if (ctaSection) {
            const ctaButtons = ctaSection.querySelectorAll('.btn');
            console.log(`Found ${ctaButtons.length} CTA buttons`);
            
            // Book Free AI Consultation button
            if (ctaButtons[0]) {
                console.log('Found CTA consultation button');
                ctaButtons[0].addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('CTA consultation button clicked');
                    window.location.href = 'contact.html';
                });
            }
            
            // View Our Solutions button
            if (ctaButtons[1]) {
                console.log('Found CTA solutions button');
                ctaButtons[1].addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('View solutions button clicked');
                    window.location.href = 'solutions.html';
                });
            }
        } else {
            console.warn('CTA section not found');
        }
    }

    // Interactive Demo Button Handler
    function setupDemoButton() {
        const demoButton = document.querySelector('button[class*="text-xs text-primary"]');
        if (demoButton) {
            demoButton.addEventListener('click', function() {
                console.log('Demo details button clicked');
                // Show a modal or navigate to a demo page
                showDemoModal();
            });
        }
    }

    // Demo Modal Function
    function showDemoModal() {
        // Create a simple modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md mx-4 relative">
                <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl" onclick="this.parentElement.parentElement.remove()">
                    ×
                </button>
                <h3 class="text-2xl font-bold mb-4 text-primary">AI Agent Demo Details</h3>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Processing Speed:</span>
                        <span class="font-semibold text-primary">2.3ms avg</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Accuracy Rate:</span>
                        <span class="font-semibold text-secondary">94.2%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Tasks Completed:</span>
                        <span class="font-semibold text-accent">1,247</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Cost Savings:</span>
                        <span class="font-semibold text-green-600">$12,500/month</span>
                    </div>
                </div>
                <div class="mt-6 flex gap-3">
                    <button class="btn btn-primary flex-1" onclick="window.location.href='contact.html'">
                        Get Your Demo
                    </button>
                    <button class="btn btn-outline flex-1" onclick="window.location.href='solutions.html'">
                        Learn More
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Footer Button Handler
    function setupFooterButton() {
        console.log('Setting up footer button...');
        const footerButton = document.querySelector('footer .btn-primary');
        if (footerButton) {
            console.log('Found footer button');
            footerButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Footer consultation button clicked');
                window.location.href = 'contact.html';
            });
        } else {
            console.warn('Footer button not found');
        }
    }

    // Add animation classes when elements come into view
    function setupAnimations() {
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
    }

    // Enhanced button hover effects
    function setupButtonEffects() {
        const buttons = document.querySelectorAll('.buzz-button, .credit-badge');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(249, 194, 60, 0.3)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });
    }

    // Add click feedback for all buttons
    function setupClickFeedback() {
        const allButtons = document.querySelectorAll('button, .btn, a.btn');
        allButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add a subtle click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // Setup additional button handlers for new sections
    function setupAdditionalButtons() {
        console.log('Setting up additional buttons...');
        
        // Industry cards - make them clickable
        const industryCards = document.querySelectorAll('.buzz-card[class*="hover:scale-105"]');
        industryCards.forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                console.log(`Industry card ${index + 1} clicked`);
                window.location.href = 'industries.html';
            });
        });
        
        // Process cards - add hover effects
        const processCards = document.querySelectorAll('.buzz-card[class*="relative"]');
        processCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 30px rgba(249, 194, 60, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });
        
        // Testimonial cards - add subtle hover effects
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Initialize all functionality
    function init() {
        setupHeroButtons();
        setupSolutionButtons();
        setupCTAButtons();
        setupDemoButton();
        setupFooterButton();
        setupAnimations();
        setupButtonEffects();
        setupClickFeedback();
        setupAdditionalButtons();
        
        console.log('Index page functionality initialized');
    }

    // Start the initialization
    init();
});

// Additional utility functions
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function trackButtonClick(buttonName) {
    console.log(`Button clicked: ${buttonName}`);
    // Here you could add analytics tracking
}

// Logo Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.logo-carousel');
    const track = document.querySelector('.logo-track');
    
    if (carousel && track) {
        // Pause animation on hover
        carousel.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
        
        // Touch handling
        let startX;
        let scrollLeft;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            track.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('touchend', () => {
            track.style.animationPlayState = 'running';
        });
        
        carousel.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }
});

// Language switching functions
function switchToEnglish() {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/tr/')) {
        window.location.href = currentPath.replace('/tr/', '/');
    } else if (currentPath === '/tr' || currentPath === '/tr/index.html') {
        window.location.href = '/';
    } else {
        // Already on English version
        return;
    }
}

function switchToTurkish() {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/tr/')) {
        // Already on Turkish version
        return;
    } else if (currentPath === '/' || currentPath === '/index.html') {
        window.location.href = '/tr/';
    } else {
        window.location.href = '/tr' + currentPath;
    }
}

// Update flag display based on current language
function updateFlagDisplay() {
    const currentFlag = document.getElementById('current-flag');
    if (currentFlag) {
        if (window.location.pathname.startsWith('/tr/')) {
            currentFlag.textContent = '🇹🇷';
        } else {
            currentFlag.textContent = '🇺🇸';
        }
    }
}

// Call updateFlagDisplay when page loads
document.addEventListener('DOMContentLoaded', updateFlagDisplay); 