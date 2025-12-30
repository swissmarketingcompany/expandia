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
        const ctaSection = document.querySelector('.bg-gradient-to-r.from-primary.to-secondary');
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
                        <span class="font-semibold text-secondary">94.2%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Qualified Leads:</span>
                        <span class="font-semibold text-accent">1,247</span>
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
        setupLanguageSwitching();
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

// Language switching functions - STANDARDIZED FOR MULTILINGUAL SUPPORT
function switchToEnglish() {
    const path = window.location.pathname;
    const origin = window.location.origin;

    // Set user language preference to prevent auto-redirects
    localStorage.setItem('expandia_language_preference', 'en');

    // Detect if already on English (not in any language subfolder)
    const isOnEnglish = !path.includes('/tr/') && !path.includes('/de/') && !path.includes('/fr/') &&
        !path.endsWith('/tr') && !path.endsWith('/de') && !path.endsWith('/fr');

    if (isOnEnglish) {
        console.log('Already on English version');
        return;
    }

    // Extract the page name from current path
    let pageName = path.split('/').pop() || 'index.html';
    if (pageName === '' || pageName === 'fr' || pageName === 'tr' || pageName === 'de') {
        pageName = 'index.html';
    }

    // Build the English URL (no language prefix)
    window.location.href = origin + '/' + pageName;
}

function switchToTurkish() {
    const path = window.location.pathname;
    const origin = window.location.origin;

    // Set user language preference to prevent auto-redirects
    localStorage.setItem('expandia_language_preference', 'tr');

    // Detect if already on Turkish
    const isOnTurkish = path.includes('/tr/') || path.endsWith('/tr');

    if (isOnTurkish) {
        console.log('Already on Turkish version');
        return;
    }

    // Extract the page name from current path
    let pageName = path.split('/').pop() || 'index.html';
    if (pageName === '' || pageName === 'fr' || pageName === 'tr' || pageName === 'de') {
        pageName = 'index.html';
    }

    // Build the Turkish URL
    window.location.href = origin + '/tr/' + pageName;
}

function switchToGerman() {
    const path = window.location.pathname;
    const origin = window.location.origin;

    // Set user language preference to prevent auto-redirects
    localStorage.setItem('expandia_language_preference', 'de');

    // Detect current language from path
    const isOnFrench = path.includes('/fr/') || path.endsWith('/fr');
    const isOnTurkish = path.includes('/tr/') || path.endsWith('/tr');
    const isOnGerman = path.includes('/de/') || path.endsWith('/de');

    if (isOnGerman) {
        console.log('Already on German version');
        return;
    }

    // Extract the page name from current path
    let pageName = path.split('/').pop() || 'index.html';
    if (pageName === '' || pageName === 'fr' || pageName === 'tr' || pageName === 'de') {
        pageName = 'index.html';
    }

    // Build the German URL
    window.location.href = origin + '/de/' + pageName;
}

function switchToFrench() {
    const path = window.location.pathname;
    const origin = window.location.origin;

    // Set user language preference to prevent auto-redirects
    localStorage.setItem('expandia_language_preference', 'fr');

    // Detect if already on French
    const isOnFrench = path.includes('/fr/') || path.endsWith('/fr');

    if (isOnFrench) {
        console.log('Already on French version');
        return;
    }

    // Extract the page name from current path
    let pageName = path.split('/').pop() || 'index.html';
    if (pageName === '' || pageName === 'fr' || pageName === 'tr' || pageName === 'de') {
        pageName = 'index.html';
    }

    // Build the French URL
    window.location.href = origin + '/fr/' + pageName;
}

// Geolocation-based language detection
function detectUserLocation() {
    // Check if user has manually selected a language before
    const userLanguagePreference = localStorage.getItem('expandia_language_preference');
    if (userLanguagePreference) {
        return; // Don't auto-redirect if user has made a choice
    }

    // Avoid redirect loops by checking if we just redirected
    const lastRedirect = sessionStorage.getItem('expandia_last_redirect');
    const now = Date.now();
    if (lastRedirect && (now - parseInt(lastRedirect)) < 5000) {
        return;
    }

    // Check if we're already on the correct page to avoid redirect loops
    const currentPath = window.location.pathname;
    const isOnTurkish = currentPath.startsWith('/tr/') || currentPath === '/tr';
    const isOnGerman = currentPath.startsWith('/de/') || currentPath === '/de';
    const isOnFrench = currentPath.startsWith('/fr/') || currentPath === '/fr';

    // Add a small delay to ensure page is loaded
    setTimeout(() => {
        // Try multiple geolocation methods
        detectLocationByIP()
            .then(country => {

                // Language-specific countries/regions
                const turkishCountries = ['TR', 'CY']; // Turkey, Cyprus
                const germanCountries = ['DE', 'AT', 'CH']; // Germany, Austria, Switzerland
                const frenchCountries = ['FR', 'BE', 'CA', 'LU', 'MC', 'SN', 'CI']; // France, Belgium, Canada, Luxembourg, Monaco, etc.

                const shouldShowTurkish = turkishCountries.includes(country);
                const shouldShowGerman = germanCountries.includes(country);
                const shouldShowFrench = frenchCountries.includes(country);

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
                } else if (shouldShowFrench && !isOnFrench) {
                    showLanguageNotification('French', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToFrench();
                    });
                } else if (!shouldShowTurkish && !shouldShowGerman && !shouldShowFrench && (isOnTurkish || isOnGerman || isOnFrench)) {
                    showLanguageNotification('English', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToEnglish();
                    });
                } else {
                    // User is on correct language version
                }
            })
            .catch(error => {
                // Fallback to browser language detection
                const browserLang = navigator.language || navigator.userLanguage;
                const isTurkishBrowser = browserLang.startsWith('tr');
                const isGermanBrowser = browserLang.startsWith('de');
                const isFrenchBrowser = browserLang.startsWith('fr');

                if (isTurkishBrowser && !isOnTurkish) {
                    showLanguageNotification('Turkish', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToTurkish();
                    });
                } else if (isGermanBrowser && !isOnGerman) {
                    showLanguageNotification('German', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToGerman();
                    });
                } else if (isFrenchBrowser && !isOnFrench) {
                    showLanguageNotification('French', () => {
                        sessionStorage.setItem('expandia_last_redirect', Date.now().toString());
                        switchToFrench();
                    });
                }
            });
    }, 1000); // 1 second delay
}

// Show language notification banner
function showLanguageNotification(suggestedLanguage, redirectCallback) {
    const banner = document.createElement('div');
    banner.className = 'fixed top-0 left-0 right-0 bg-primary text-white p-4 z-50 shadow-lg';

    let message = '';
    let acceptText = '';
    let declineText = '';

    if (suggestedLanguage === 'Turkish') {
        message = 'Türkiye\'den erişiyor gibi görünüyorsunuz. Türkçe versiyonu görüntülemek ister misiniz?';
        acceptText = 'Evet, Türkçe';
        declineText = 'Hayır, English kalsın';
    } else if (suggestedLanguage === 'German') {
        message = 'Es sieht so aus, als würden Sie aus einem deutschsprachigen Land zugreifen. Möchten Sie die deutsche Version anzeigen?';
        acceptText = 'Ja, Deutsch';
        declineText = 'Nein, English beibehalten';
    } else if (suggestedLanguage === 'French') {
        message = 'Il semble que vous accédiez depuis un pays francophone. Voulez-vous voir la version française ?';
        acceptText = 'Oui, Français';
        declineText = 'Non, garder l\'anglais';
    } else {
        message = 'It looks like you\'re accessing from outside Turkey. Would you like to view the English version?';
        acceptText = 'Yes, English';
        declineText = 'No, keep Turkish';
    }

    const flag = suggestedLanguage === 'Turkish' ? '🇹🇷' : suggestedLanguage === 'German' ? '🇩🇪' : suggestedLanguage === 'French' ? '🇫🇷' : '🇺🇸';

    banner.innerHTML = `
        <div class="container mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-xl">${flag}</span>
                <span>${message}</span>
            </div>
            <div class="flex gap-2">
                <button id="accept-language" class="btn btn-sm btn-secondary">
                    ${acceptText}
                </button>
                <button id="decline-language" class="btn btn-sm btn-ghost">
                    ${declineText}
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
        let pref = 'en';
        if (suggestedLanguage === 'Turkish') pref = 'en'; // Was Turkish, keep English/current? No, decline means keep CURRENT.
        // The logic in original code was: if suggested is Turkish (so currently NOT Turkish), decline means keep English (or whatever it is).
        // Actually the original code hardcoded: localStorage.setItem('expandia_language_preference', suggestedLanguage === 'Turkish' ? 'en' : 'tr');
        // This is a bit simplistic. It should probably save the CURRENT language as preference.

        // Let's improve this: save the CURRENT detected language as preference.
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/tr/')) pref = 'tr';
        else if (currentPath.startsWith('/de/')) pref = 'de';
        else if (currentPath.startsWith('/fr/')) pref = 'fr';
        else pref = 'en';

        localStorage.setItem('expandia_language_preference', pref);
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
                continue;
            }
        }

        throw new Error('All geolocation services failed');
    } catch (error) {
        throw error;
    }
}

// Setup language switching event listeners
function setupLanguageSwitching() {
    // Handle language switch clicks
    document.querySelectorAll('.lang-switch').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');

            // Save user's language preference
            localStorage.setItem('expandia_language_preference', lang);

            if (lang === 'en') {
                switchToEnglish();
            } else if (lang === 'tr') {
                switchToTurkish();
            } else if (lang === 'de') {
                switchToGerman();
            } else if (lang === 'fr') {
                switchToFrench();
            }
        });
    });

    // Update flag display
    const currentFlag = document.getElementById('current-flag');
    if (currentFlag) {
        const isOnTurkish = window.location.pathname.startsWith('/tr/') || window.location.pathname === '/tr';
        const isOnGerman = window.location.pathname.startsWith('/de/') || window.location.pathname === '/de';
        const isOnFrench = window.location.pathname.startsWith('/fr/') || window.location.pathname === '/fr';

        if (isOnTurkish) {
            currentFlag.textContent = '🇹🇷';
        } else if (isOnGerman) {
            currentFlag.textContent = '🇩🇪';
        } else if (isOnFrench) {
            currentFlag.textContent = '🇫🇷';
        } else {
            currentFlag.textContent = '🇺🇸';
        }
    }

    // Run geolocation detection on page load
    detectUserLocation();

    // Add debug function to clear language preferences (available in console)
    window.clearLanguagePreference = function () {
        localStorage.removeItem('expandia_language_preference');
        sessionStorage.removeItem('expandia_last_redirect');
    };
}
