
const fs = require('fs');
const services = require('../data/services.json');

const languages = ['de', 'fr', 'tr'];
const prefixes = { 'de': '[DE] ', 'fr': '[FR] ', 'tr': '[TR] ' };

const newServices = services.map(service => {
    const translations = {};
    languages.forEach(lang => {
        translations[lang] = {
            title_template: prefixes[lang] + service.title_template,
            description_template: prefixes[lang] + service.description_template
        };
    });
    
    return {
        ...service,
        translations
    };
});

fs.writeFileSync('data/services.json', JSON.stringify(newServices, null, 2));
console.log('✅ Services metadata translated.');
