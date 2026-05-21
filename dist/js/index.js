// Index Page JavaScript - Button Functionality and Interactions

document.addEventListener('DOMContentLoaded', function () {

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') { // Fix: avoid invalid selector '#'
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Hero Section Button Handlers
    function setupHeroButtons() {
        // Main CTA button
        const heroConsultationBtn = document.querySelector('.credit-badge');
        if (heroConsultationBtn) {
            heroConsultationBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'contact.html';
            });
            heroConsultationBtn.style.cursor = 'pointer';
        }

        // View Our Work button
        const viewWorkBtn = document.querySelector('.btn-outline.btn-neutral');
        if (viewWorkBtn) {
            viewWorkBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'case-studies.html';
            });
        }
    }

    // Solutions Section Button Handlers
    function setupSolutionButtons() {
        const solutionButtons = document.querySelectorAll('.service-card .btn');

        solutionButtons.forEach((button, index) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                // Navigate to solutions page with specific anchor
                const solutionAnchors = [
                    '#lead-generation',
                    '#sales-development',
                    '#outbound-marketing',
                    '#appointment-setting',
                    '#cold-emailing',
                    '#business-development'
                ];

                if (solutionAnchors[index]) {
                    window.location.href = `solutions.html${solutionAnchors[index]}`;
                } else {
                    window.location.href = 'solutions.html';
                }
            });
        });
    }

    // CTA Section Button Handlers
    function setupCTAButtons() {
        // Find CTA section buttons
        const ctaSection = document.querySelector('.bg-gradient-to-r.from-primary.to-primary');
        if (ctaSection) {
            const ctaButtons = ctaSection.querySelectorAll('.btn');

            // Book Free Consultation button
            if (ctaButtons[0]) {
                ctaButtons[0].addEventListener('click', function (e) {
                    e.preventDefault();
                    window.location.href = 'contact.html';
                });
            }

            // View Our Solutions button
            if (ctaButtons[1]) {
                ctaButtons[1].addEventListener('click', function (e) {
                    e.preventDefault();
                    window.location.href = 'solutions.html';
                });
            }
        }
    }

    // Interactive Demo Button Handler
    function setupDemoButton() {
        const demoButton = document.querySelector('button[class*="text-xs text-primary"]');
        if (demoButton) {
            demoButton.addEventListener('click', function () {
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
                <h3 class="text-2xl font-bold mb-4 text-primary">Sales Development Demo</h3>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Lead Generation Speed:</span>
                        <span class="font-semibold text-primary">2.3 days avg</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Conversion Rate:</span>
                        <span class="font-semibold text-primary">94.2%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Qualified Leads:</span>
                        <span class="font-semibold text-primary">1,247</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Revenue Growth:</span>
                        <span class="font-semibold text-green-600">+65%</span>
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
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Footer Button Handler
    function setupFooterButton() {
        const footerButton = document.querySelector('footer .btn-primary');
        if (footerButton) {
            footerButton.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'contact.html';
            });
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
            button.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(249, 194, 60, 0.3)';
            });

            button.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });
    }

    // Add click feedback for all buttons
    function setupClickFeedback() {
        const allButtons = document.querySelectorAll('button, .btn, a.btn');
        allButtons.forEach(button => {
            button.addEventListener('click', function () {
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
        // Industry cards - make them clickable
        const industryCards = document.querySelectorAll('.buzz-card[class*="hover:scale-105"]');
        industryCards.forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function () {
                window.location.href = 'industries.html';
            });
        });

        // Process cards - add hover effects
        const processCards = document.querySelectorAll('.buzz-card[class*="relative"]');
        processCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 30px rgba(249, 194, 60, 0.2)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });

        // Testimonial cards - add subtle hover effects
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Video Facade Functionality
    function setupVideoFacade() {
        const facade = document.getElementById('hero-video-facade');
        const container = document.getElementById('video-container');

        if (facade && container) {
            facade.addEventListener('click', function () {
                const videoId = 'q-G9zgf1twU';
                // Use YouTube Enhanced Privacy Mode with minimal UI
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1`);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                iframe.className = 'absolute inset-0 w-full h-full rounded-3xl';

                // Clear container and append iframe
                container.innerHTML = '';
                container.appendChild(iframe);

                // Remove pointer cursor
                facade.style.cursor = 'default';
            }, { once: true });
        }
    }

    // Initialize all functionality
    function init() {
        setupEnglishOnlyLanguageState();
        setupHeroButtons();
        setupVideoFacade();
        setupSolutionButtons();
        setupCTAButtons();
        setupDemoButton();
        setupFooterButton();
        setupAnimations();
        setupButtonEffects();
        setupClickFeedback();
        setupAdditionalButtons();

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

// Language handling is intentionally English-only. Legacy multilingual helpers
// remain as safe shims because older generated markup may still reference them.
function switchToEnglish() {
    localStorage.setItem('expandia_language_preference', 'en');

    const path = window.location.pathname;
    const legacyLanguagePath = /^\/(?:de|fr)(?:\/|$)/;
    if (!legacyLanguagePath.test(path)) return;

    const englishPath = path.replace(legacyLanguagePath, '/') || '/';
    window.location.href = `${window.location.origin}${englishPath}${window.location.search}${window.location.hash}`;
}

function switchToGerman() {
    switchToEnglish();
}

function switchToFrench() {
    switchToEnglish();
}

function detectUserLocation() {
    switchToEnglish();
}

function showLanguageNotification(suggestedLanguage, redirectCallback) {
    if (typeof redirectCallback === 'function') {
        redirectCallback();
    }
}

async function detectLocationByIP() {
    return 'EN';
}

function setupEnglishOnlyLanguageState() {
    localStorage.setItem('expandia_language_preference', 'en');

    document.querySelectorAll('.lang-switch').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            switchToEnglish();
        });
    });

    const currentFlag = document.getElementById('current-flag');
    if (currentFlag) {
        currentFlag.textContent = 'EN';
    }

    window.clearLanguagePreference = function () {
        localStorage.removeItem('expandia_language_preference');
        sessionStorage.removeItem('expandia_last_redirect');
    };

    switchToEnglish();
}
