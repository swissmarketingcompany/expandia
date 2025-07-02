// Global function to set language
let setLanguage;

// Language change function for flag-based selector
window.changeLanguage = (language) => {
    if (setLanguage) {
        setLanguage(language);
    }
    updateFlag(language);
};

const updateFlag = (language) => {
    const currentFlag = document.getElementById('current-flag');
    if (currentFlag) {
        currentFlag.textContent = language === 'en' ? '🇺🇸' : '🇹🇷';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setLanguage = async (language) => {
        try {
            console.log(`Fetching translations for ${language}...`);
            // Adjust path for blog pages
            const basePath = window.location.pathname.includes('/blog/') ? '../' : '';
            const response = await fetch(`${basePath}src/locales/${language}.json`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ${language} translations: ${response.status}`);
            }
            const translations = await response.json();
            console.log(`Translations loaded for ${language}`);

            document.querySelectorAll('[data-i18n]').forEach(element => {
                try {
                    const key = element.getAttribute('data-i18n');
                    const keys = key.split('.');
                    let translation = translations;
                    
                    for (const k of keys) {
                        if (!translation[k]) {
                            console.warn(`Translation missing for key: ${key}`);
                            return;
                        }
                        translation = translation[k];
                    }
                    
                    if (typeof translation === 'string') {
                        element.innerHTML = translation;
                    } else {
                        console.warn(`Invalid translation for key ${key}: ${translation}`);
                    }
                } catch (elementError) {
                    console.error(`Error translating element with key ${element.getAttribute('data-i18n')}:`, elementError);
                }
            });

            localStorage.setItem('language', language);
            console.log(`Language set to ${language}`);
        } catch (error) {
            console.error('Translation error:', error);
        }
    };

    // Set initial language
    const initialLanguage = localStorage.getItem('language') || 'en';
    updateFlag(initialLanguage);
    setLanguage(initialLanguage);
}); 