// Index Page JavaScript - Button Functionality and Interactions

document.addEventListener('DOMContentLoaded', function() {
    console.log('Index page JavaScript loaded');

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
        setupLanguageSwitching();
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

// Language switching functions - STANDARDIZED FOR MULTILINGUAL SUPPORT
function switchToEnglish() {
    console.log('Switching to English, current path:', window.location.pathname);
    const path = window.location.pathname;
    
    // Set user language preference to prevent auto-redirects
    localStorage.setItem('expandia_language_preference', 'en');
    
    if (path.startsWith('/tr/')) {
        // Map Turkish pages to English equivalents
        const englishPath = path.replace('/tr/', '/');
        
        // Handle specific page mappings
        if (englishPath === '/index.html' || englishPath === '/') {
            window.location.href = '/';
        } else if (englishPath === '/about.html') {
            window.location.href = '/about.html';
        } else if (englishPath === '/solutions.html') {
            window.location.href = '/solutions.html';
        } else if (englishPath === '/contact.html') {
            window.location.href = '/contact.html';
        } else if (englishPath === '/case-studies.html') {
            window.location.href = '/case-studies.html';
        } else if (englishPath.startsWith('/blog/')) {
            // Handle blog pages - redirect to English blog
            if (englishPath === '/blog/index.html' || englishPath === '/blog/') {
                window.location.href = '/blog/';
            } else {
                // For specific Turkish blog posts, redirect to English blog index
                window.location.href = '/blog/';
            }
        } else {
            // For other Turkish pages, redirect to homepage
            window.location.href = '/';
        }
    } else if (path.startsWith('/de/')) {
        // Map German pages to English equivalents
        const englishPath = path.replace('/de/', '/');
        
        // Handle specific page mappings
        if (englishPath === '/index.html' || englishPath === '/') {
            window.location.href = '/';
        } else if (englishPath === '/about.html') {
            window.location.href = '/about.html';
        } else if (englishPath === '/solutions.html') {
            window.location.href = '/solutions.html';
        } else if (englishPath === '/contact.html') {
            window.location.href = '/contact.html';
        } else if (englishPath === '/case-studies.html') {
            window.location.href = '/case-studies.html';
        } else if (englishPath.startsWith('/blog/')) {
            // Handle blog pages - redirect to English blog
            window.location.href = '/blog/';
        } else {
            // For other German pages, redirect to homepage
            window.location.href = '/';
        }
    } else if (path === '/tr' || path === '/tr/') {
        // Turkish home to English home
        window.location.href = '/';
    } else if (path === '/de' || path === '/de/') {
        // German home to English home
        window.location.href = '/';
    } else {
        // Already on English
        console.log('Already on English version');
    }
}

function switchToTurkish() {
    console.log('Switching to Turkish, current path:', window.location.pathname);
    const path = window.location.pathname;
    
    // Set user language preference to prevent auto-redirects
    localStorage.setItem('expandia_language_preference', 'tr');
    
    if (path.startsWith('/tr/')) {
        // Already on Turkish
        console.log('Already on Turkish version');
        return;
    } else if (path.startsWith('/de/')) {
        // Map German pages to Turkish equivalents
        const turkishPath = path.replace('/de/', '/tr/');
        window.location.href = turkishPath;
    } else {
        // Map English pages to Turkish equivalents
        if (path === '/' || path === '/index.html' || path === '') {
            window.location.href = '/tr/';
        } else if (path === '/about.html') {
            window.location.href = '/tr/about.html';
        } else if (path === '/solutions.html') {
            window.location.href = '/tr/solutions.html';
        } else if (path === '/contact.html') {
            window.location.href = '/tr/contact.html';
        } else if (path === '/case-studies.html') {
            window.location.href = '/tr/case-studies.html';
        } else if (path.startsWith('/blog/')) {
            // Handle blog pages - redirect to Turkish blog
            if (path === '/blog/index.html' || path === '/blog/' || path === '/blog') {
                window.location.href = '/tr/blog/';
            } else {
                // For specific English blog posts, redirect to Turkish blog index
                window.location.href = '/tr/blog/';
            }
        } else {
            // For other pages, redirect to Turkish home
            window.location.href = '/tr/';
        }
    }
}

function switchToGerman() {
    console.log('Switching to German, current path:', window.location.pathname);
    const path = window.location.pathname;
    
    // Set user language preference to prevent auto-redirects
    localStorage.setItem('expandia_language_preference', 'de');
    
    if (path.startsWith('/de/')) {
        // Already on German
        console.log('Already on German version');
        return;
    } else if (path.startsWith('/tr/')) {
        // Map Turkish pages to German equivalents
        const germanPath = path.replace('/tr/', '/de/');
        window.location.href = germanPath;
    } else {
        // Map English pages to German equivalents
        if (path === '/' || path === '/index.html' || path === '') {
            window.location.href = '/de/';
        } else if (path === '/about.html') {
            window.location.href = '/de/about.html';
        } else if (path === '/solutions.html') {
            window.location.href = '/de/solutions.html';
        } else if (path === '/contact.html') {
            window.location.href = '/de/contact.html';
        } else if (path === '/case-studies.html') {
            window.location.href = '/de/case-studies.html';
        } else if (path.startsWith('/blog/')) {
            // Handle blog pages - redirect to German blog
            window.location.href = '/de/blog/';
        } else {
            // For other pages, redirect to German home
            window.location.href = '/de/';
        }
    }
}

// Geolocation-based language detection
function detectUserLocation() {
    // Check if user has manually selected a language before
    const userLanguagePreference = localStorage.getItem('expandia_language_preference');
    if (userLanguagePreference) {
        console.log('User has language preference:', userLanguagePreference);
        return; // Don't auto-redirect if user has made a choice
    }

    // Avoid redirect loops by checking if we just redirected
    const lastRedirect = sessionStorage.getItem('expandia_last_redirect');
    const now = Date.now();
    if (lastRedirect && (now - parseInt(lastRedirect)) < 5000) {
        console.log('Recently redirected, skipping auto-detection');
        return;
    }

    // Check if we're already on the correct page to avoid redirect loops
    const currentPath = window.location.pathname;
    const isOnTurkish = currentPath.startsWith('/tr/') || currentPath === '/tr';
    const isOnGerman = currentPath.startsWith('/de/') || currentPath === '/de';
    
    // Add a small delay to ensure page is loaded
    setTimeout(() => {
        // Try multiple geolocation methods
        detectLocationByIP()
            .then(country => {
                console.log('Detected country:', country);
                
                // Language-specific countries/regions
                const turkishCountries = ['TR', 'CY']; // Turkey, Cyprus
                const germanCountries = ['DE', 'AT', 'CH']; // Germany, Austria, Switzerland
                
                const shouldShowTurkish = turkishCountries.includes(country);
                const shouldShowGerman = germanCountries.includes(country);
                
                // Show notification and redirect based on location
                if (shouldShowTurkish && !isOnTurkish) {
                    showLanguageNotification('Turkish', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToTurkish();
                    });
                } else if (shouldShowGerman && !isOnGerman) {
                    showLanguageNotification('German', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToGerman();
                    });
                } else if (!shouldShowTurkish && !shouldShowGerman && (isOnTurkish || isOnGerman)) {
                    showLanguageNotification('English', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToEnglish();
                    });
                } else {
                    console.log('User is on correct language version');
                }
            })
            .catch(error => {
                console.log('Geolocation detection failed, using browser language as fallback');
                
                // Fallback to browser language detection
                const browserLang = navigator.language || navigator.userLanguage;
                const isTurkishBrowser = browserLang.startsWith('tr');
                const isGermanBrowser = browserLang.startsWith('de');
                
                if (isTurkishBrowser && !isOnTurkish) {
                    console.log('Browser language is Turkish, redirecting...');
                    showLanguageNotification('Turkish', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToTurkish();
                    });
                } else if (isGermanBrowser && !isOnGerman) {
                    console.log('Browser language is German, redirecting...');
                    showLanguageNotification('German', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToGerman();
                    });
                }
            });
    }, 1000); // 1 second delay
}

// Show language notification banner
function showLanguageNotification(suggestedLanguage, redirectCallback) {
    const banner = document.createElement('div');
    banner.className = 'fixed top-0 left-0 right-0 bg-primary text-white p-4 z-50 shadow-lg';
    banner.innerHTML = `
        <div class="container mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-xl">${suggestedLanguage === 'Turkish' ? '🇹🇷' : suggestedLanguage === 'German' ? '🇩🇪' : '🇺🇸'}</span>
                <span>
                    ${suggestedLanguage === 'Turkish' 
                        ? 'Türkiye\'den erişiyor gibi görünüyorsunuz. Türkçe versiyonu görüntülemek ister misiniz?' 
                        : suggestedLanguage === 'German'
                        ? 'Es sieht so aus, als würden Sie aus einem deutschsprachigen Land zugreifen. Möchten Sie die deutsche Version anzeigen?'
                        : 'It looks like you\'re accessing from outside Turkey. Would you like to view the English version?'}
                </span>
            </div>
            <div class="flex gap-2">
                <button id="accept-language" class="btn btn-sm btn-secondary">
                    ${suggestedLanguage === 'Turkish' ? 'Evet, Türkçe' : suggestedLanguage === 'German' ? 'Ja, Deutsch' : 'Yes, English'}
                </button>
                <button id="decline-language" class="btn btn-sm btn-ghost">
                    ${suggestedLanguage === 'Turkish' ? 'Hayır, English kalsın' : suggestedLanguage === 'German' ? 'Nein, English beibehalten' : 'No, keep Turkish'}
                </button>
            </div>
        </div>
    `;

    document.body.prepend(banner);

    // Add event listeners
    document.getElementById('accept-language').addEventListener('click', () => {
        banner.remove();
        redirectCallback();
    });

    document.getElementById('decline-language').addEventListener('click', () => {
        banner.remove();
        // Save user preference to not show again
        localStorage.setItem('expandia_language_preference', suggestedLanguage === 'Turkish' ? 'en' : 'tr');
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (banner.parentElement) {
            banner.remove();
        }
    }, 10000);
}

// Detect location using IP geolocation API
async function detectLocationByIP() {
    try {
        // Try multiple free geolocation services
        const services = [
            'https://ipapi.co/country_code/',
            'https://ipinfo.io/country',
            'https://api.country.is/'
        ];
        
        for (const service of services) {
            try {
                const response = await fetch(service, { 
                    timeout: 3000,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    if (service.includes('country.is')) {
                        const data = await response.json();
                        return data.country;
                    } else {
                        const countryCode = await response.text();
                        return countryCode.trim().toUpperCase();
                    }
                }
            } catch (error) {
                console.log(`Service ${service} failed:`, error);
                continue;
            }
        }
        
        throw new Error('All geolocation services failed');
    } catch (error) {
        console.error('IP geolocation failed:', error);
        throw error;
    }
}

// Setup language switching event listeners
function setupLanguageSwitching() {
    console.log('Setting up language switching...');
    
    // Handle language switch clicks
    document.querySelectorAll('.lang-switch').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            console.log('Language switch clicked:', lang);
            
            // Save user's language preference
            localStorage.setItem('expandia_language_preference', lang);
            
            if (lang === 'en') {
                switchToEnglish();
            } else if (lang === 'tr') {
                switchToTurkish();
            } else if (lang === 'de') {
                switchToGerman();
            }
        });
    });
    
    // Update flag display
    const currentFlag = document.getElementById('current-flag');
    if (currentFlag) {
        const isOnTurkish = window.location.pathname.startsWith('/tr/') || window.location.pathname === '/tr';
        const isOnGerman = window.location.pathname.startsWith('/de/') || window.location.pathname === '/de';
        
        if (isOnTurkish) {
            currentFlag.textContent = '🇹🇷';
        } else if (isOnGerman) {
            currentFlag.textContent = '🇩🇪';
        } else {
            currentFlag.textContent = '🇺🇸';
        }
        console.log('Updated flag for path:', window.location.pathname, 'Turkish:', isOnTurkish, 'German:', isOnGerman);
    }
    
    // Run geolocation detection on page load
    detectUserLocation();
    
    // Add debug function to clear language preferences (available in console)
    window.clearLanguagePreference = function() {
        localStorage.removeItem('expandia_language_preference');
        sessionStorage.removeItem('expandia_last_redirect');
        console.log('Language preferences cleared. Refresh the page to test geolocation again.');
    };
}

