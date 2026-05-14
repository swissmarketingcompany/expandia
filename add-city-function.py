#!/usr/bin/env python3
"""
Add buildCityLandingPages function to build-pages.js
This function generates generic city landing pages for all 250 cities × 3 languages
"""

# Insert location: After buildServiceCityPages function (around line 663)

BUILD_CITY_LANDING_PAGES_FUNCTION = '''
// -------------------------------------------------------------------------
// BUILD CITY LANDING PAGES (Generic pages showcasing all 19 services)
// -------------------------------------------------------------------------
function buildCityLandingPages() {
    console.log('\\n🏙️  Building Generic City Landing Pages (Multi-Language)...');
    
    // Load top 250 cities
    const top250Cities = JSON.parse(fs.readFileSync('data/cities-top250.json', 'utf8'));
    const templateContent = fs.readFileSync('templates/city-landing.html', 'utf8');
    
    const languages = ['en', 'de', 'fr'];
    let pageCount = 0;
    
    languages.forEach(lang => {
        top250Cities.forEach(cityData => {
            const city = cityData.city;
            const country = cityData.country;
            const region = cityData.region || 'Europe';
            const landmark = cityData.landmark || 'the city center';
            
            // Generate clean city slug (remove b2b-lead-generation- prefix if exists)
            let citySlug = cityData.slug.replace('b2b-lead-generation-', '');
            
            // Build page title and description
            const title = lang === 'de' 
                ? `Geschäftswachstum Services in ${city} | Go Expandia`
                : lang === 'fr'
                ? `Services de Croissance d'Entreprise à ${city} | Go Expandia`
                : `Business Growth Services in ${city} | Go Expandia`;
            
            const description = lang === 'de'
                ? `Professionelle Geschäftswachstum-Services in ${city}. Wir helfen Unternehmen mit IT-Infrastruktur, Lead-Generierung und KI-Content.`
                : lang === 'fr'
                ? `Services professionnels de croissance d'entreprise à ${city}. Nous aidons les entreprises avec l'infrastructure IT, la génération de leads et le contenu IA.`
                : `Professional business growth services in ${city}. We help companies with IT infrastructure, lead generation, and AI content.`;
            
            // Create page content
            let htmlTemplate = templateContent;
            
            // Replace placeholders
            htmlTemplate = htmlTemplate.replace(/{{PAGE_TITLE}}/g, title);
            htmlTemplate = htmlTemplate.replace(/{{PAGE_DESCRIPTION}}/g, description);
            htmlTemplate = htmlTemplate.replace(/{{CITY_NAME}}/g, city);
            htmlTemplate = htmlTemplate.replace(/{{COUNTRY_NAME}}/g, country);
            htmlTemplate = htmlTemplate.replace(/{{REGION_NAME}}/g, region);
            htmlTemplate = htmlTemplate.replace(/{{LANDMARK}}/g, landmark);
            
            // Hero image
            const heroImage = `./assets/local/b2b-lead-generation-${citySlug}-hero.jpg`;
            htmlTemplate = htmlTemplate.replace(/{{HERO_IMAGE}}/g, heroImage);
            
            // Navigation/Footer
            let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
            let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;
            
            // Clean i18n
            pageNavigation = pageNavigation.replace(/\\s*data-i18n="[^"]*"/g, '');
            pageFooter = pageFooter.replace(/\\s*data-i18n="[^"]*"/g, '');
            
            const basePath = (lang === 'de' || lang === 'fr') ? '../' : './';
            const logoPath = (lang === 'de' || lang === 'fr') ? '../go-expandia-logo.png' : 'go-expandia-logo.png';
            htmlTemplate = htmlTemplate.replace(/{{BASE_PATH}}/g, basePath);
            htmlTemplate = htmlTemplate.replace(/{{LOGO_PATH}}/g, logoPath);
            
            htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
            htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);
            
            // Canonical URL
            const canonicalSlug = lang === 'en' ? `${citySlug}.html` : `${lang}/${citySlug}.html`;
            htmlTemplate = htmlTemplate.replace(/{{CANONICAL_URL}}/g, `https://www.goexpandia.com/${canonicalSlug}`);
            
            // Hreflang
            htmlTemplate = htmlTemplate.replace(/{{PAGE_URL_EN}}/g, `${citySlug}.html`);
            htmlTemplate = htmlTemplate.replace(/{{PAGE_URL_DE}}/g, `de/${citySlug}.html`);
            htmlTemplate = htmlTemplate.replace(/{{PAGE_URL_FR}}/g, `fr/${citySlug}.html`);
            htmlTemplate = htmlTemplate.replace(/{{PAGE_URL_TR}}/g, ``);
            
            // Output path
            const outputPath = lang === 'en' ? `${citySlug}.html` : `${lang}/${citySlug}.html`;
            
            // Ensure directory exists
            if (lang !== 'en') {
                if (!fs.existsSync(lang)) {
                    fs.mkdirSync(lang, { recursive: true });
                }
            }
            
            // Write file
            fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
            pageCount++;
        });
    });
    
    console.log(`✅ Built ${pageCount} generic city landing pages.`);
}
'''

print("Function created. Ready to insert into build-pages.js")
print(f"Function length: {len(BUILD_CITY_LANDING_PAGES_FUNCTION)} characters")
