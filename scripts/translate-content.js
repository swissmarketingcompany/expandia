
const fs = require('fs');
const content = require('../data/service-content.json');

const newContent = {};

const languages = ['de', 'fr', 'tr'];

const prefixes = {
    'de': '[DE] ',
    'fr': '[FR] ',
    'tr': '[TR] '
};

Object.keys(content).forEach(serviceId => {
    const serviceData = content[serviceId];
    newContent[serviceId] = {
        en: serviceData
    };

    languages.forEach(lang => {
        const translated = JSON.parse(JSON.stringify(serviceData)); // Deep clone
        
        // Prefix strings
        translated.intro = translated.intro.map(s => prefixes[lang] + s);
        translated.pain_points = translated.pain_points.map(s => prefixes[lang] + s);
        translated.benefits = translated.benefits.map(s => prefixes[lang] + s);
        translated.faq = translated.faq.map(item => ({
            q: prefixes[lang] + item.q,
            a: prefixes[lang] + item.a
        }));

        newContent[serviceId][lang] = translated;
    });
});

fs.writeFileSync('data/service-content.json', JSON.stringify(newContent, null, 2));
console.log('✅ Content "translated" (mocked) for multi-language support.');
