

const fs = require('fs');
const path = require('path');
const ANKARA_LONGITUDE_CUTOFF = 32.8597;
const RETIRED_EAST_OF_ANKARA_CITY_SLUGS = [
    'jeddah',
    'busan',
    'yokohama',
    'new-taipei-city',
    'singapore',
    'ahmedabad',
    'riyadh',
    'hyderabad',
    'chennai',
    'hong-kong',
    'hangzhou',
    'nanjing',
    'bengaluru',
    'xian',
    'wuhan',
    'seoul',
    'chengdu',
    'tokyo',
    'shenzhen',
    'mumbai',
    'delhi',
    'guangzhou',
    'beijing',
    'shanghai',
    'zaporizhzhia',
    'saratov',
    'donetsk',
    'dnipro',
    'volgograd',
    'perm',
    'voronezh',
    'yerevan',
    'krasnodar',
    'rostov-on-don',
    'ufa',
    'samara',
    'tbilisi',
    'nizhny-novgorod',
    'kazan',
    'kharkiv',
    'baku',
    'moscow'
];
const RETIRED_LOW_POP_CITY_SLUGS = [
    'sankt-polten',
    'roskilde',
    'waterford',
    'biel-bienne',
    'sarpsborg',
    'horsens',
    'neuilly-sur-seine',
    'issy-les-moulineaux',
    'kolding',
    'levallois-perret',
    'la-seyne-sur-mer',
    'villeneuve-dascq',
    'randers',
    'saint-nazaire',
    'vila-nova-de-gaia',
    'esbjerg',
    'saint-maur-des-fosses',
    'rueil-malmaison',
    'champigny-sur-marne',
    'la-rochelle',
    'gateshead',
    'szombathely',
    'stockton-on-tees',
    'kristiansand',
    'rotherham',
    'nyiregyhaza',
    'offenbach',
    'pforzheim',
    'perugia',
    'ingolstadt',
    'heilbronn',
    'gottingen',
    'recklinghausen',
    'wolfsburg',
    'salerno',
    'vasteras',
    'regensburg',
    'villeurbanne',
    'ferrara',
    'innsbruck',
    'stockport',
    'darmstadt',
    'bremerhaven',
    'st-gallen',
    'winterthur',
    'klagenfurt',
    'reutlingen',
    'boulogne-billancourt',
    'asnieres-sur-seine',
    'aulnay-sous-bois',
    'vitry-sur-seine',
    'courbevoie',
    'versailles',
    'doncaster',
    'perpignan',
    'ravenna',
    'funchal',
    'helsingborg',
    'fredrikstad',
    'norrkoping',
    'jonkoping',
    'drammen',
    'sandnes',
    'ceske-budejovice',
    'hradec-kralove',
    'usti-nad-labem',
    'szekesfehervar',
    'pardubice',
    'kecskemet',
    'wichita',
    'tampa',
    'bakersfield',
    'tulsa',
    'minneapolis',
    'oakland',
    'long-beach',
    'miami',
    'raleigh',
    'omaha',
    'kansas-city',
    'mesa',
    'colorado-springs',
    'fort-lauderdale',
    'virginia-beach',
    'corpus-christi',
    'st-petersburg',
    'salt-lake-city',
    'winston-salem',
    'overland-park',
    'santa-clarita',
    'grand-rapids'
];
const RETIRED_EASTERN_EUROPE_CITY_SLUGS = [
    'zagreb',
    'sofia',
    'minsk',
    'saint-petersburg',
    'czestochowa',
    'cluj-napoca',
    'ljubljana',
    'bydgoszcz',
    'bialystok',
    'sosnowiec',
    'timisoara',
    'constanta',
    'belgrade',
    'szczecin',
    'debrecen',
    'ploiesti',
    'tallinn',
    'vilnius',
    'rzeszow',
    'gliwice',
    'ostrava'
];
const RETIRED_CONSERVATIVE_TRIM_CITY_SLUGS = [
    'monchengladbach',
    'gelsenkirchen',
    'braunschweig',
    'ludwigshafen',
    'saarbrucken',
    'oberhausen',
    'leverkusen',
    'wuppertal',
    'bielefeld',
    'kingston-upon-hull',
    'southend-on-sea',
    'stoke-on-trent',
    'wolverhampton',
    'peterborough',
    'northampton',
    'bournemouth',
    'sunderland',
    'portsmouth',
    'warrington',
    'st-helens',
    'las-palmas',
    'santa-cruz'
];
const rawCities = require('./data/cities-top250.json');
const cities = rawCities.filter((city) => Number(city.lng) <= ANKARA_LONGITUDE_CUTOFF);
const industries = require('./data/industries.json');
const services = require('./data/services.json');
const serviceContent = require('./data/service-content.json');
const topCities = require('./data/top-cities.json');
const topIndustries = require('./data/top-industries.json');
const glossary = require('./data/glossary.json');
const metadata = require('./data/metadata.json');
const { createHTMLTemplate, generateOrganizationSchema, generateBreadcrumbSchema } = require('./scripts/utils/template-engine');
const { applyTranslations } = require('./scripts/utils/translations');
const { blogTopics } = require('./scripts/generate-blog-posts');
const legacyBlogPosts = require('./data/legacy-blog-posts.json');

// Helper to extract schemas from content and remove them to avoid duplicates in body
function extractAndRemoveSchemas(content, templateName) {
    const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let extractedSchemas = [];
    let match;
    let cleanContent = content;

    while ((match = schemaRegex.exec(content)) !== null) {
        const schemaContent = match[1].trim();
        if (schemaContent === '{{SCHEMA_MARKUP}}') continue;

        try {
            const schemaJson = JSON.parse(schemaContent);
            if (Array.isArray(schemaJson)) {
                extractedSchemas = extractedSchemas.concat(schemaJson);
            } else {
                // Check if this is a Service schema with nested Organization in provider
                // We'll extract it but mark it specially so deduplication knows to handle it
                if (schemaJson["@type"] === "Service" && schemaJson.provider && schemaJson.provider["@type"] === "Organization") {
                    // Don't extract the nested Organization separately
                    extractedSchemas.push(schemaJson);
                } else {
                    extractedSchemas.push(schemaJson);
                }
            }
        } catch (e) {
            console.warn(`⚠️ Failed to parse schema in ${templateName}: ${e.message}`);
        }
    }

    cleanContent = cleanContent.replace(schemaRegex, (m, p1) => {
        if (p1.trim() === '{{SCHEMA_MARKUP}}') return m;
        return '';
    });

    return { cleanContent, extractedSchemas };
}

// 🚨 BUILD SYSTEM WARNING
console.log('\n🔧 EXPANDIA BUILD SYSTEM STARTING...');
console.log('⚠️  WARNING: This will OVERWRITE generated HTML files!');
console.log('📝 Always edit templates/ directory, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for full instructions\n');

// Read navigation and footer once - with validation
const includesDir = 'includes';
if (!fs.existsSync(includesDir)) {
    console.error(`❌ ERROR: includes directory not found at ${includesDir}`);
    process.exit(1);
}

const headerPath = `${includesDir}/header.html`;
const footerPath = `${includesDir}/footer.html`;

if (!fs.existsSync(headerPath)) {
    console.error(`❌ ERROR: Header file not found at ${headerPath}`);
    process.exit(1);
}

if (!fs.existsSync(footerPath)) {
    console.error(`❌ ERROR: Footer file not found at ${footerPath}`);
    process.exit(1);
}

const navigationEN = fs.readFileSync(headerPath, 'utf8');

const navigationDE = fs.readFileSync('includes/header-de.html', 'utf8');
const navigationFR = fs.readFileSync('includes/header-fr.html', 'utf8');
const footerEN = fs.readFileSync(footerPath, 'utf8');

const footerDE = fs.existsSync('includes/footer-de.html') ? fs.readFileSync('includes/footer-de.html', 'utf8') : footerEN;
const footerFR = fs.existsSync('includes/footer-fr.html') ? fs.readFileSync('includes/footer-fr.html', 'utf8') : footerEN;
const latestBlogPosts = fs.readFileSync('includes/latest-blog-posts.html', 'utf8');

console.log(`✅ Successfully loaded headers for all languages`);
console.log(`✅ Successfully loaded footers for all languages`);
console.log(`✅ Successfully loaded latest blog posts snippet`);

function normalizeCitySlug(slug) {
    return String(slug || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['’\\.]/g, '')
        .replace(/&/g, ' and ')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

const EAST_OF_ANKARA_CITY_SLUGS = Array.from(new Set([
    ...RETIRED_EAST_OF_ANKARA_CITY_SLUGS,
    ...rawCities
        .filter((city) => Number(city.lng) > ANKARA_LONGITUDE_CUTOFF)
        .map((city) => normalizeCitySlug(city.city || city.slug))
]));

if (EAST_OF_ANKARA_CITY_SLUGS.length > 0) {
    const rawEastCount = rawCities.filter((city) => Number(city.lng) > ANKARA_LONGITUDE_CUTOFF).length;
    if (rawEastCount > 0) {
        console.warn(`⚠️ Excluding ${rawEastCount} cities east of Ankara (lng > ${ANKARA_LONGITUDE_CUTOFF}).`);
    }
    console.log(`🧹 Retiring ${EAST_OF_ANKARA_CITY_SLUGS.length} east-of-Ankara city slugs for cleanup/redirects.`);
}
if (RETIRED_LOW_POP_CITY_SLUGS.length > 0) {
    console.log(`🧹 Retiring ${RETIRED_LOW_POP_CITY_SLUGS.length} low-population city slugs for cleanup/redirects.`);
}
if (RETIRED_EASTERN_EUROPE_CITY_SLUGS.length > 0) {
    console.log(`🧹 Retiring ${RETIRED_EASTERN_EUROPE_CITY_SLUGS.length} Eastern Europe/Balkan city slugs for cleanup/redirects.`);
}
if (RETIRED_CONSERVATIVE_TRIM_CITY_SLUGS.length > 0) {
    console.log(`🧹 Retiring ${RETIRED_CONSERVATIVE_TRIM_CITY_SLUGS.length} conservative-trim city slugs for cleanup/redirects.`);
}

// Function to generate unique SEO content for each city
function generateUniqueCityContent(cityName, countryName, regionName) {
    // Categorize cities for targeted messaging
    const techHubs = ['San Francisco', 'Austin', 'Seattle', 'Berlin', 'Singapore', 'Tokyo', 'Bengaluru'];
    const financialCenters = ['New York', 'London', 'Hong Kong', 'Frankfurt', 'Zurich', 'Dubai'];
    const industrialCities = ['Detroit', 'Stuttgart', 'Turin', 'Manchester'];

    const isTechHub = techHubs.includes(cityName);
    const isFinancial = financialCenters.includes(cityName);
    const isIndustrial = industrialCities.includes(cityName);

    // Content variations centered on the 5-step AI business model
    const templates = [
        {
            p1: `${cityName} is a high-momentum market in ${regionName}, where teams are under pressure to reduce manual work and move decisions faster. Companies in ${countryName} need practical AI implementation, not vague innovation projects.`,
            p2: `Our model in ${cityName} is simple: AI Opportunity Review, AI Plan, Build & Setup, Training, and Support. This gives leadership a clear path from analysis to execution, without adding process overhead.`,
            p3: `Instead of forcing long transformation programs, we sequence implementation into manageable service steps so teams in ${cityName} can start with one priority workflow and expand with confidence.`,
            p4: `This approach helps ${cityName} companies create measurable operational gains while keeping governance, rollout pace, and team adoption under control across ${countryName}.`
        },
        {
            p1: `${cityName} is an important commercial center in ${regionName}. To stay competitive in ${countryName}, teams need repeatable AI execution with accountable milestones.`,
            p2: `The 5-step model used in ${cityName} starts with a data-backed review, then a scoped plan, then build and setup, followed by workforce training and ongoing support.`,
            p3: `This structure makes budgets easier to control and keeps stakeholders aligned on what gets implemented first, what gets deferred, and how success is measured.`,
            p4: `For companies in ${cityName}, it means AI delivery becomes an operational program with clear ownership rather than scattered one-off initiatives.`
        },
        {
            p1: `${cityName} combines established operations with growing pressure for automation. Businesses in ${regionName} need a delivery model that is both fast and controllable.`,
            p2: `Our five services for ${cityName} teams map directly to execution stages: identify opportunities, set priorities, implement systems, train teams, and keep outcomes stable with support.`,
            p3: `The model is built for cross-functional organizations where finance, operations, sales, and IT must coordinate around one AI roadmap in ${countryName}.`,
            p4: `By using staged implementation, companies in ${cityName} can reduce risk, improve adoption, and scale AI capabilities in a way that makes commercial sense.`
        },
        {
            p1: `The pace of change in ${cityName} is high, and teams in ${regionName} need practical AI leverage without long planning cycles.`,
            p2: `Our business model for ${cityName} focuses on five clear services that move companies from “what should we automate?” to “this is now running in production.”`,
            p3: `Every step has a defined output, so leaders in ${countryName} can track progress, control scope, and connect implementation work to operational KPIs.`,
            p4: `This keeps AI adoption realistic for growing teams in ${cityName} while still enabling enterprise-level process improvements.`
        },
        {
            p1: `${cityName} has strong growth potential in ${regionName}, but execution quality determines whether AI investments produce real business impact.`,
            p2: `For companies in ${countryName}, the most effective approach is phased: review opportunities, design a prioritized plan, implement workflows, train users, and sustain results with ongoing support.`,
            p3: `This is the operating model we use with teams in ${cityName} so delivery stays measurable and aligned with commercial goals.`,
            p4: `As priorities evolve, the same five-service framework helps ${cityName} organizations expand implementation without losing focus or implementation quality.`
        }
    ];

    // Select template based on city characteristics
    let templateIndex;
    if (isTechHub) {
        templateIndex = 0; // More tech-focused language
    } else if (isFinancial) {
        templateIndex = 1; // More formal, business-focused
    } else if (isIndustrial) {
        templateIndex = 2; // Industrial transformation focus
    } else {
        // Use hash of city name for consistent but varied selection
        const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        templateIndex = hash % templates.length;
    }

    const selectedTemplate = templates[templateIndex];

    return `
                <div class="prose prose-lg max-w-none text-base-content/80">
                    <p class="mb-4">
                        ${selectedTemplate.p1}
                    </p>
                    
                    <p class="mb-4">
                        ${selectedTemplate.p2}
                    </p>
                    
                    <p class="mb-4">
                        ${selectedTemplate.p3}
                    </p>
                    
                    <p class="mb-4">
                        ${selectedTemplate.p4}
                    </p>
                </div>`;
}

const LOCALIZED_CATEGORY_COPY = {
    en: {
        'ai-solutions': { label: 'AI Support for Companies', promise: 'find the best places to use AI, make a clear plan, and help teams use it well.' },
        'custom-software': { label: 'AI Delivery and Support', promise: 'build the tools and workflows around AI, then keep them working.' }
    },
    de: {
        'ai-solutions': { label: 'KI-Lösungen', promise: 'reduzieren Sie operative Personalkosten und beschleunigen Sie Entscheidungen mit sicherer Unternehmens-KI.' },
        'custom-software': { label: 'Individuelle Softwareentwicklung', promise: 'modernisieren Sie komplexe Strukturen und bauen Sie maßgeschneiderte Business-Intelligence- und Engineering-Software.' }
    },
    fr: {
        'ai-solutions': { label: 'Solutions IA', promise: 'réduisez les coûts opérationnels et accélérez la prise de décision avec une IA d’entreprise sécurisée.' },
        'custom-software': { label: 'Développement logiciel sur mesure', promise: 'modernisez des structures lourdes et créez des logiciels métiers et d’ingénierie adaptés à vos besoins.' }
    }
};

function getLocalizedCategoryMeta(category, lang = 'en') {
    return (LOCALIZED_CATEGORY_COPY[lang] && LOCALIZED_CATEGORY_COPY[lang][category]) ||
        LOCALIZED_CATEGORY_COPY.en[category] ||
        SERVICE_CATEGORIES[category] ||
        { label: 'Solutions', promise: 'deliver secure, scalable infrastructure.' };
}

const CITY_LANDING_COPY = {
    en: {
        breadcrumbHome: 'Home',
        breadcrumbLocations: 'Locations',
        heroTitle: 'AI Services for Business Teams',
        heroButton: 'Get Free Analysis',
        heroSecondary: 'Explore 5 Services',
        whyTitle: 'Why {{CITY_NAME}}?',
        whyBody: '{{CITY_NAME}} sits in the {{REGION_NAME}} market, where teams need a practical AI rollout model they can execute step by step.',
        localHeading: 'Built for local teams with a clear 5-step model',
        cardTitle: 'Five simple services',
        cardSubtitles: { ai: 'From review to support', software: 'Execution you can measure' },
        servicesTitle: 'Start AI delivery in {{CITY_NAME}}',
        servicesBody: 'Pick your first service, then expand with the same model as your operations grow.',
        seoHeading: 'AI delivery in {{CITY_NAME}}, {{COUNTRY_NAME}}',
        faqTitle: 'Frequently Asked Questions',
        faqBody: 'Common questions from teams evaluating our 5-service AI model.',
        faq: [
            { q: 'How quickly can we start Service 1 (Review)?', a: 'Most teams can start with the AI Opportunity Review after a short kickoff and data handover alignment.' },
            { q: 'Can we start from a later service instead?', a: 'Yes. If you already have analysis and priorities, we can begin with planning, build and setup, training, or support.' },
            { q: 'Do you deliver remotely for teams in {{CITY_NAME}}?', a: 'Yes. The model is built for remote-first delivery with structured milestones and regular working sessions.' },
            { q: 'How do you keep implementation compliant and secure?', a: 'Security controls, access boundaries, and data handling requirements are integrated into each service stage.' }
        ]
    },
    de: {
        breadcrumbHome: 'Startseite',
        breadcrumbLocations: 'Standorte',
        heroTitle: 'Unternehmenslösungen',
        heroButton: 'Kostenlose Analyse anfordern',
        heroSecondary: 'Kategorien ansehen',
        whyTitle: 'Warum {{CITY_NAME}}?',
        whyBody: '{{CITY_NAME}} liegt im Markt von {{REGION_NAME}}, wo Teams sichere KI-Systeme, schnellere Automatisierung und skalierbare Software brauchen.',
        localHeading: 'Für lokale Umsetzung, nach globalen Standards',
        cardTitle: 'Zwei Kernkategorien',
        cardSubtitles: { ai: 'Automatisierung und Kontrolle', software: 'Entwicklung und Integration' },
        servicesTitle: 'Lösungen für {{CITY_NAME}}',
        servicesBody: 'Wählen Sie die Kategorie, die aktuell am wichtigsten ist, und erweitern Sie bei Bedarf Schritt für Schritt.',
        seoHeading: 'Unternehmensumsetzung in {{CITY_NAME}}, {{COUNTRY_NAME}}',
        faqTitle: 'Häufig gestellte Fragen',
        faqBody: 'Häufige Fragen von Teams, die KI- und Software-Services bewerten.',
        faq: [
            { q: 'Wie schnell können Sie starten?', a: 'In der Regel beginnen wir nach der ersten Analyse und Scope-Abstimmung und gehen dann zügig in die Umsetzung.' },
            { q: 'Welche Arten von Projekten unterstützen Sie?', a: 'Wir arbeiten an Infrastruktur, KI-Automatisierung, Systemintegrationen, internen Tools, Portalen und Modernisierungsvorhaben.' },
            { q: 'Bieten Sie Remote-Umsetzung an?', a: 'Ja. Unser Delivery-Modell ist für Remote-Implementierung, Monitoring und Support über Regionen hinweg ausgelegt.' },
            { q: 'Wie gehen Sie mit Compliance um?', a: 'Wir berücksichtigen Datenschutz, Logging, Zugriffskontrolle und Recovery-Anforderungen als Teil der Umsetzung.' }
        ]
    },
    fr: {
        breadcrumbHome: 'Accueil',
        breadcrumbLocations: 'Villes',
        heroTitle: 'Solutions d’entreprise',
        heroButton: 'Obtenir une analyse gratuite',
        heroSecondary: 'Découvrir les catégories',
        whyTitle: 'Pourquoi {{CITY_NAME}} ?',
        whyBody: '{{CITY_NAME}} se situe sur le marché de {{REGION_NAME}}, où les équipes ont besoin de systèmes IA sécurisés, d’automatisation plus rapide et de logiciels capables de suivre leur croissance.',
        localHeading: 'Pensé pour une exécution locale, selon des standards globaux',
        cardTitle: 'Deux catégories clés',
        cardSubtitles: { ai: 'Automatisation et contrôle', software: 'Développement et intégration' },
        servicesTitle: 'Solutions pour {{CITY_NAME}}',
        servicesBody: 'Choisissez la catégorie la plus prioritaire aujourd’hui, puis faites évoluer la stack au rythme de votre activité.',
        seoHeading: 'Déploiement d’entreprise à {{CITY_NAME}}, {{COUNTRY_NAME}}',
        faqTitle: 'Questions fréquentes',
        faqBody: 'Les questions les plus courantes des équipes qui évaluent des services IA et logiciels sur mesure.',
        faq: [
            { q: 'Sous quel délai pouvez-vous démarrer ?', a: 'Nous commençons généralement après l’analyse initiale et la validation du périmètre, puis passons rapidement à l’exécution.' },
            { q: 'Quels types de projets prenez-vous en charge ?', a: 'Nous intervenons sur l’infrastructure, l’automatisation IA, les intégrations systèmes, les outils internes, les portails et les projets de modernisation.' },
            { q: 'Proposez-vous une exécution à distance ?', a: 'Oui. Notre modèle de delivery est conçu pour l’implémentation à distance, la supervision et le support multi-régions.' },
            { q: 'Comment gérez-vous la conformité ?', a: 'Nous intégrons la protection des données, le logging, le contrôle d’accès et les besoins de reprise dans la conception.' }
        ]
    }
};

const SERVICE_CITY_COPY = {
    en: {
        getConsultation: 'Get Free Consultation',
        howItWorks: 'How It Works',
        marketStats: 'Market Stats',
        marketSize: 'Market Size',
        marketFocus: 'Market Focus',
        currentlyTaking: 'Currently taking projects in {{COUNTRY_NAME}}',
        challenges: 'Challenges in {{CITY_NAME}}',
        solution: 'Our {{SERVICE_NAME}} Solution',
        faqTitle: 'Frequently Asked Questions',
        nearbyTitle: 'Also Serving These Areas Near {{CITY_NAME}}'
    },
    de: {
        getConsultation: 'Kostenlose Beratung',
        howItWorks: 'So funktioniert es',
        marketStats: 'Marktdaten',
        marketSize: 'Marktgröße',
        marketFocus: 'Marktfokus',
        currentlyTaking: 'Aktuell verfügbar für Projekte in {{COUNTRY_NAME}}',
        challenges: 'Herausforderungen in {{CITY_NAME}}',
        solution: 'Unsere {{SERVICE_NAME}}-Lösung',
        faqTitle: 'Häufig gestellte Fragen',
        nearbyTitle: 'Auch aktiv in diesen Gebieten nahe {{CITY_NAME}}'
    },
    fr: {
        getConsultation: 'Obtenir une consultation gratuite',
        howItWorks: 'Comment ça marche',
        marketStats: 'Données du marché',
        marketSize: 'Taille du marché',
        marketFocus: 'Focus du marché',
        currentlyTaking: 'Nous prenons actuellement des projets dans {{COUNTRY_NAME}}',
        challenges: 'Défis à {{CITY_NAME}}',
        solution: 'Notre solution {{SERVICE_NAME}}',
        faqTitle: 'Questions fréquentes',
        nearbyTitle: 'Nous intervenons aussi dans ces zones près de {{CITY_NAME}}'
    }
};

function getCityPageCopy(lang = 'en') {
    return CITY_LANDING_COPY[lang] || CITY_LANDING_COPY.en;
}

function getServiceCityCopy(lang = 'en') {
    return SERVICE_CITY_COPY[lang] || SERVICE_CITY_COPY.en;
}

function generateLocalizedCityContent(cityName, countryName, regionName, lang = 'en') {
    if (lang === 'en') {
        return generateUniqueCityContent(cityName, countryName, regionName);
    }

    const templates = {
        de: [
            `${cityName} ist ein dynamischer Wirtschaftsstandort in ${regionName}, in dem Unternehmen Technologie gezielt einsetzen, um sich einen Wettbewerbsvorteil zu verschaffen.`,
            `Go Expandia liefert für ${cityName} sichere KI-Integration und maßgeschneiderte Software, die auf die Anforderungen von Unternehmen in ${countryName} zugeschnitten ist.`,
            `Von der schnellen Bereitstellung bis zur laufenden Optimierung helfen wir Unternehmen in ${cityName}, interne Abläufe zu beschleunigen und ihre Systeme belastbar zu skalieren.`,
            `Mit Go Expandia erhalten ${cityName}-Unternehmen eine technische Partnerschaft, die auf langfristige Stabilität, Compliance und Wachstum ausgelegt ist.`
        ],
        fr: [
            `${cityName} représente un environnement économique dynamique dans ${regionName}, où les entreprises utilisent la technologie pour gagner en compétitivité.`,
            `Go Expandia fournit à ${cityName} une intégration IA sécurisée et des logiciels sur mesure adaptés aux besoins des entreprises de ${countryName}.`,
            `Du déploiement rapide à l’optimisation continue, nous aidons les entreprises de ${cityName} à accélérer leurs opérations et à faire évoluer leurs systèmes de façon fiable.`,
            `Avec Go Expandia, les entreprises de ${cityName} bénéficient d’un partenaire technique pensé pour la stabilité, la conformité et la croissance à long terme.`
        ]
    };

    const selected = templates[lang] || templates.de;
    return `
                <div class="prose prose-lg max-w-none text-base-content/80">
                    <p class="mb-4">${selected[0]}</p>
                    <p class="mb-4">${selected[1]}</p>
                    <p class="mb-4">${selected[2]}</p>
                    <p class="mb-4">${selected[3]}</p>
                </div>`;
}

function replaceCityLandingCopy(content, lang = 'en') {
    const copy = getCityPageCopy(lang);
    return content
        .replace(/Home/g, copy.breadcrumbHome)
        .replace(/Locations/g, copy.breadcrumbLocations)
        .replace(/Enterprise Solutions/g, copy.heroTitle)
        .replace(/Get Free Analysis/g, copy.heroButton)
        .replace(/Explore Categories/g, copy.heroSecondary)
        .replace(/Why \{\{CITY_NAME\}\}\?/g, copy.whyTitle)
        .replace(/\{\{CITY_NAME\}\} sits in the \{\{REGION_NAME\}\} market, where teams need secure AI systems, faster automation, and software that can scale with their operations\./g, copy.whyBody)
        .replace(/Built for local delivery, global standards/g, copy.localHeading)
        .replace(/Two core categories/g, copy.cardTitle)
        .replace(/Automation and control/g, copy.cardSubtitles.ai)
        .replace(/Build and integration/g, copy.cardSubtitles.software)
        .replace(/Solutions for \{\{CITY_NAME\}\}/g, copy.servicesTitle)
        .replace(/Choose the category that matches your current priority and expand as your operations grow\./g, copy.servicesBody)
        .replace(/Enterprise delivery in \{\{CITY_NAME\}\}, \{\{COUNTRY_NAME\}\}/g, copy.seoHeading)
        .replace(/Frequently Asked Questions/g, copy.faqTitle)
        .replace(/Common questions from teams evaluating AI and custom software delivery\./g, copy.faqBody)
        .replace(/How quickly can you start\?/g, copy.faq[0].q)
        .replace(/We can usually begin after the initial discovery and scope review, then move quickly into implementation\./g, copy.faq[0].a)
        .replace(/What kinds of projects do you support\?/g, copy.faq[1].q)
        .replace(/We work on infrastructure, AI automation, system integrations, internal tools, portals, and modernization projects\./g, copy.faq[1].a)
        .replace(/Do you provide remote delivery\?/g, copy.faq[2].q)
        .replace(/Yes\. Our delivery model is designed for remote implementation, monitoring, and support across regions\./g, copy.faq[2].a)
        .replace(/How do you handle compliance\?/g, copy.faq[3].q)
        .replace(/We account for data protection, logging, access control, and recovery requirements as part of the build\./g, copy.faq[3].a);
}

function replaceServiceCityCopy(content, lang = 'en') {
    const copy = getServiceCityCopy(lang);
    return content
        .replace(/Get Free Consultation/g, copy.getConsultation)
        .replace(/How It Works/g, copy.howItWorks)
        .replace(/Market Stats/g, copy.marketStats)
        .replace(/Market Size/g, copy.marketSize)
        .replace(/Market Focus/g, copy.marketFocus)
        .replace(/Currently taking projects in \{\{COUNTRY_NAME\}\}/g, copy.currentlyTaking)
        .replace(/Challenges in \{\{CITY_NAME\}\}/g, copy.challenges)
        .replace(/Our \{\{SERVICE_NAME\}\} Solution/g, copy.solution)
        .replace(/Frequently Asked Questions/g, copy.faqTitle)
        .replace(/Also Serving These Areas Near \{\{CITY_NAME\}\}/g, copy.nearbyTitle);
}

const BUSINESS_MODEL_DEFAULT_KEYWORDS = 'AI support for companies, AI opportunity review, AI plan, AI build and setup, AI training, AI support, business AI';

const PAGE_METADATA_OVERRIDES = {
    index: {
        title: 'AI Support for Companies | Go Expandia',
        description: 'We help companies find where AI can make or save money, build the right tools, train teams, and support the work after launch.',
        keywords: BUSINESS_MODEL_DEFAULT_KEYWORDS
    },
    solutions: {
        title: 'AI Support Services for Companies | 5 Simple Services | Go Expandia',
        description: 'One main solution with five simple services: AI Opportunity Review, AI Plan, AI Build & Setup, AI Training, and AI Support.',
        keywords: BUSINESS_MODEL_DEFAULT_KEYWORDS
    },
    'ai-opportunity-review': {
        title: 'AI Opportunity Review | Data Dump Model | Go Expandia',
        description: 'Service 1. We run your business data through our Data Dump model, hide sensitive details, and show where AI can increase revenue, reduce cost, and improve cash flow first.',
        keywords: 'AI opportunity review, Data Dump model, AI use case discovery, business AI analysis, AI revenue and cost improvement'
    },
    'ai-plan': {
        title: 'AI Plan | Go Expandia',
        description: 'Service 2. We turn findings into a simple working plan with clear order, clear buying model, and clear next steps.',
        keywords: 'AI plan, AI rollout plan, AI project roadmap, AI business model planning'
    },
    'ai-build-setup': {
        title: 'AI Build & Setup | Real Business Applications | Go Expandia',
        description: 'Service 3. We build real AI applications, software, and workflows around your business and connect them to your daily operations.',
        keywords: 'AI build and setup, AI applications, AI workflow automation, AI implementation service'
    },
    'ai-training': {
        title: 'AI Training | Go Expandia',
        description: 'Service 4. We train your team on new AI tools, existing tools, or both so usage is clear and results improve.',
        keywords: 'AI training, AI team training, business AI adoption, practical AI training'
    },
    'ai-support': {
        title: 'AI Support | Go Expandia',
        description: 'Service 5. We support new or existing AI setups, fix issues, improve outputs, and handle edge cases over time.',
        keywords: 'AI support, AI maintenance, AI workflow support, ongoing AI operations'
    },
    about: {
        title: 'About Go Expandia | AI Support for Companies',
        description: 'We help companies use AI in a real business way: find opportunities, build applications, train teams, and support long-term performance.',
        keywords: BUSINESS_MODEL_DEFAULT_KEYWORDS
    },
    'our-business-model': {
        title: 'Our Business Model | Go Expandia',
        description: 'See how Go Expandia analyzes company data, finds the right AI opportunities, builds the software, and trains teams for adoption.',
        keywords: BUSINESS_MODEL_DEFAULT_KEYWORDS
    },
    contact: {
        title: 'Contact Go Expandia | Start Your AI Project',
        description: 'Talk to us about the 5 services: AI Opportunity Review, AI Plan, AI Build & Setup, AI Training, and AI Support.',
        keywords: BUSINESS_MODEL_DEFAULT_KEYWORDS
    },
    'vision-mission': {
        title: 'Vision & Mission | AI Support for Companies | Go Expandia',
        description: 'Our mission is simple: help companies use AI to improve revenue, cost, cash flow, and operational control through practical delivery.',
        keywords: BUSINESS_MODEL_DEFAULT_KEYWORDS
    },
    'our-ethical-principles': {
        title: 'Our Ethical Principles | Go Expandia',
        description: 'We build AI systems with clear data handling, honest communication, and practical business value.',
        keywords: 'AI ethics, responsible AI delivery, data handling, business AI governance'
    },
    'city-locations': {
        title: 'AI Support Locations | 5 Services by City | Go Expandia',
        description: 'See where we deliver our 5 AI services: opportunity review, planning, build & setup, training, and support.',
        keywords: 'AI support locations, AI services by city, AI opportunity review cities, AI build setup cities'
    },
    'blog-index': {
        title: 'AI Business Operations Blog | Go Expandia',
        description: 'Practical articles on using AI to increase revenue, collect payments faster, reduce costs, and run operations with better control.',
        keywords: 'AI business blog, AI operations, AI revenue improvement, AI cost reduction, AI support for companies'
    }
};

function getPageMetadata(templateName, lang = 'en') {
    // Get base metadata from JSON
    const baseMeta = metadata[templateName] || metadata['index'];

    // Check for translations in JSON
    let resolvedMeta = baseMeta;
    if (baseMeta.translations && baseMeta.translations[lang]) {
        resolvedMeta = { ...baseMeta, ...baseMeta.translations[lang] };
    }

    const overrideMeta = PAGE_METADATA_OVERRIDES[templateName];
    if (overrideMeta) {
        resolvedMeta = { ...resolvedMeta, ...overrideMeta };
    }

    if (!resolvedMeta.keywords) {
        resolvedMeta.keywords = BUSINESS_MODEL_DEFAULT_KEYWORDS;
    }

    return resolvedMeta;
}

function escapeHtmlAttr(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function upsertHeadTag(content, matcher, replacement) {
    if (matcher.test(content)) {
        return content.replace(matcher, replacement);
    }

    if (!content.includes('</head>')) {
        return content;
    }

    return content.replace('</head>', `    ${replacement}\n</head>`);
}

function enforceSeoMetaTags(content, pageTitle, pageDescription, pageKeywords) {
    const escapedTitle = escapeHtmlAttr(pageTitle);
    const escapedDescription = escapeHtmlAttr(pageDescription);
    const escapedKeywords = escapeHtmlAttr(pageKeywords);

    let next = content;
    next = upsertHeadTag(next, /<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);
    next = upsertHeadTag(next, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapedDescription}">`);
    next = upsertHeadTag(next, /<meta\s+name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${escapedKeywords}">`);
    next = upsertHeadTag(next, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapedTitle}" />`);
    next = upsertHeadTag(next, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapedDescription}" />`);
    next = upsertHeadTag(next, /<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapedTitle}" />`);
    next = upsertHeadTag(next, /<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapedDescription}" />`);

    return next;
}

function enforceCanonicalMeta(content, canonicalUrl) {
    let next = content;
    next = upsertHeadTag(next, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}">`);
    next = upsertHeadTag(next, /<meta\s+[^>]*property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
    next = upsertHeadTag(next, /<meta\s+[^>]*(?:name|property)=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);
    return next;
}

function cleanHtmlText(value) {
    return String(value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\{\{[^{}]+\}\}/g, '')
        .replace(/\*\*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function slugToReadableTitle(slug) {
    const acronyms = new Set(['ai', 'it', 'b2b', 'seo', 'crm', 'cpq', 'rag', 'm365', 'revops', 'finops', 'uk', 'us']);
    return String(slug || '')
        .split('-')
        .filter(Boolean)
        .map(part => {
            const lower = part.toLowerCase();
            if (acronyms.has(lower)) return lower.toUpperCase();
            if (/^\d+$/.test(lower)) return lower;
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join(' ');
}

function deriveBlogMeta(content, outputName) {
    const genericTitle = 'AI Business Operations Article | AI Support for Companies | Go Expandia';
    const genericDesc = 'Practical AI guide from Go Expandia\'s 5-service model: review, plan, build, training, and support for real business results.';
    const genericKeywords = 'AI business operations, AI opportunity review, AI plan, AI build and setup, AI training, AI support';

    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
    const keywordsMatch = content.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']*)["'][^>]*>/i);
    const leadMatch = content.match(/<p[^>]*class=["'][^"']*lead[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
    const firstParagraphMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);

    const h1Text = cleanHtmlText(h1Match ? h1Match[1] : '');
    const fallbackTitleBase = h1Text || slugToReadableTitle(outputName) || 'Business Growth Guide';

    let title = cleanHtmlText(titleMatch ? titleMatch[1] : '');
    if (!title || title === genericTitle || title.includes('{{PAGE_TITLE}}')) {
        title = `${fallbackTitleBase} | Go Expandia`;
    } else if (!/go expandia/i.test(title)) {
        title = `${title} | Go Expandia`;
    }

    let description = cleanHtmlText(descMatch ? descMatch[1] : '');
    if (!description || description === genericDesc || description.includes('{{PAGE_DESCRIPTION}}')) {
        const fallbackParagraph = cleanHtmlText(leadMatch ? leadMatch[1] : (firstParagraphMatch ? firstParagraphMatch[1] : ''));
        description = fallbackParagraph || `${fallbackTitleBase} practical guide for business teams.`;
    }
    if (description.length > 160) {
        description = `${description.slice(0, 157).replace(/\s+\S*$/, '')}...`;
    }

    let keywords = cleanHtmlText(keywordsMatch ? keywordsMatch[1] : '');
    if (!keywords || keywords === genericKeywords || keywords.includes('{{PAGE_KEYWORDS}}')) {
        const stopWords = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'are', 'how', 'what', 'why', 'into', 'over', 'under', 'than', 'when', 'where', 'guide', 'complete']);
        const candidateWords = `${fallbackTitleBase} ${description}`
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.has(word));
        const uniqueWords = [...new Set(candidateWords)].slice(0, 8);
        keywords = [...uniqueWords, 'go expandia'].join(', ');
    }

    return { title, description, keywords };
}

const SERVICE_CATEGORIES = {
    'ai-solutions': {
        label: 'AI Support for Companies',
        promise: 'find the best opportunities, make a clear plan, and train teams to use AI well.',
        icon: 'bot'
    },
    'custom-software': {
        label: 'AI Delivery and Support',
        promise: 'build the tools and workflows around AI, then keep them working.',
        icon: 'code-2'
    }
};

const CITY_MODEL_SERVICES = [
    {
        slug: 'ai-opportunity-review',
        title: '1. AI Opportunity Review',
        summary: 'Find high-impact automation opportunities using your real operating data.',
        icon: 'search-check'
    },
    {
        slug: 'ai-plan',
        title: '2. AI Plan',
        summary: 'Define priorities, timeline, ownership, and KPI targets before implementation.',
        icon: 'map'
    },
    {
        slug: 'ai-build-setup',
        title: '3. Build & Setup',
        summary: 'Implement AI workflows and integrations that match your operating model.',
        icon: 'wrench'
    },
    {
        slug: 'ai-training',
        title: '4. Training',
        summary: 'Train teams so adoption is consistent and operationally useful.',
        icon: 'graduation-cap'
    },
    {
        slug: 'ai-support',
        title: '5. Support',
        summary: 'Maintain, optimize, and expand the AI system as priorities evolve.',
        icon: 'life-buoy'
    }
];

const SOLUTION_PAGE_BLUEPRINTS = {
    'managed-it-services': {
        category: 'it-solutions',
        hero: {
            badge: 'Secure. Compliant. Enterprise-grade.',
            titlePrefix: 'IT Solutions',
            titleSuffix: 'That Keep Teams Online',
            description: 'We build secure, uninterrupted, and plug-and-play cloud and network infrastructure for companies that need reliability, protection, and support.',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
            alt: 'Enterprise IT infrastructure',
            primaryCtaText: 'Get Free IT Audit',
            primaryCtaLink: 'contact.html',
            secondaryCtaText: 'Explore Capabilities',
            secondaryCtaLink: '#capabilities'
        },
        sections: [
            {
                type: 'cards',
                id: 'capabilities',
                sectionClass: 'bg-base-100',
                heading: 'Everything Your IT Stack Needs',
                intro: 'From Microsoft 365 management to disaster recovery, we cover the full operating layer.',
                gridClass: 'md:grid-cols-2',
                cards: [
                    { title: 'Microsoft 365 & Workspace Management', description: 'End-to-end setup, licensing, and administration for your corporate email and office stack.', borderClass: 'border-primary' },
                    { title: 'Cloud Architecture & Azure Transition', description: 'Migrate on-premise servers to secure and scalable Azure or AWS environments.', borderClass: 'border-secondary' },
                    { title: 'Endpoint Security', description: 'Centralized protection for corporate laptops, desktops, and mobile devices.', borderClass: 'border-accent' },
                    { title: 'Advanced Email Security', description: 'Automated defense against phishing, ransomware, spoofing, and spam attacks.', borderClass: 'border-primary' },
                    { title: 'Zero Trust Architecture', description: 'Strong authentication and access controls that reduce internal and external attack paths.', borderClass: 'border-secondary' },
                    { title: 'Disaster Recovery & Business Continuity', description: 'Backups and restore workflows designed to recover data in seconds, not days.', borderClass: 'border-neutral' },
                    { title: 'Continuous Vulnerability Scanning', description: 'Autonomous scanning that identifies security flaws before attackers do.', borderClass: 'border-primary' },
                    { title: 'GDPR Compliance Infrastructure', description: 'Logging and technical controls aligned with European and local privacy standards.', borderClass: 'border-secondary' },
                    { title: 'Secure Network & VPN Setup', description: 'High-speed, encrypted connectivity for remote teams and branch offices.', borderClass: 'border-accent' },
                    { title: '24/7 IT Support & Monitoring', description: 'Remote helpdesk and monitoring that responds instantly when issues appear.', borderClass: 'border-neutral' }
                ]
            },
            {
                type: 'split',
                id: 'why-choose-us',
                sectionClass: 'bg-base-200',
                heading: 'Infrastructure the Business Can Depend On',
                bullets: [
                    { icon: 'shield-check', title: 'Enterprise security by default', description: 'We harden the stack from day one, not after problems show up.' },
                    { icon: 'clock-3', title: 'Fast deployment', description: 'We move quickly from assessment to implementation so your team can operate without delay.' },
                    { icon: 'headphones', title: 'Always-on support', description: '24/7 monitoring and a support path that actually resolves issues.' }
                ],
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
                alt: 'Managed IT support'
            }
        ],
        cta: {
            heading: 'Need a secure IT foundation?',
            description: 'We can design the stack, migrate the systems, and keep them running.',
            buttonText: 'Book the IT Audit'
        }
    },
    'ai-content-infrastructure': {
        category: 'ai-solutions',
        hero: {
            badge: 'AI automation with data control',
            titlePrefix: 'AI Solutions',
            titleSuffix: 'for Enterprise Teams',
            description: 'We reduce operational headcount costs and speed up decisions by deploying secure AI systems that fit your workflows and data rules.',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
            alt: 'Enterprise AI infrastructure',
            primaryCtaText: 'Build AI Infrastructure',
            primaryCtaLink: '#infrastructure',
            secondaryCtaText: 'See AI Automation',
            secondaryCtaLink: '#automation'
        },
        sections: [
            {
                type: 'split',
                id: 'infrastructure',
                sectionClass: 'bg-white',
                heading: 'Corporate AI infrastructure, built for your company',
                intro: 'We set up company-specific AI workspaces, on-premise models, and AI safety layers so your teams can work with confidence.',
                leftCards: [
                    { title: 'Corporate AI Infrastructure Setup', description: 'Secure workspaces connected to your workflow.' },
                    { title: 'AI Data Security Layer', description: 'Stop sensitive data from training external LLMs.', id: 'security-layer' }
                ],
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
                alt: 'AI operations dashboard'
            },
            {
                type: 'cards',
                id: 'automation',
                sectionClass: 'bg-base-100',
                heading: 'What AI can automate',
                intro: 'We focus on systems that actually reduce manual work and improve decision speed.',
                gridClass: 'md:grid-cols-2 lg:grid-cols-3',
                cards: [
                    { title: 'Agentic AI Development', description: 'Autonomous agents that execute tasks in ERP and CRM systems under company rules.' },
                    { title: 'Smart Factory Optimization', description: 'Analyze IoT and SCADA data to reduce idle time and energy waste.' },
                    { title: 'Sales & Marketing Automation', description: 'Instant lead qualification, proposals, and faster sales-cycle execution.' },
                    { title: 'Customer Service Automation', description: 'Voice and chat assistants that handle routine dealer and customer questions.' },
                    { title: 'Data Silo Automation', description: 'Capture PDFs, Excel sheets, and email data into ERP and CRM systems automatically.' },
                    { title: 'Operational Load Reduction', description: 'Offload repetitive paperwork and manual processing to AI-enabled workflows.' }
                ]
            }
        ],
        cta: {
            heading: 'Ready for AI that fits your operations?',
            description: 'We build secure AI systems that improve speed without sacrificing control.',
            buttonText: 'Talk to an AI Architect'
        }
    },
    'custom-software-development': {
        category: 'custom-software',
        hero: {
            badge: 'Modern systems for modern teams',
            titlePrefix: 'Custom Software',
            titleSuffix: 'Built Around Your Company',
            description: 'We design and build business software that connects your systems, removes manual work, and gives teams the interfaces they need to move faster.',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
            alt: 'Custom software development',
            primaryCtaText: 'Discuss Your Build',
            primaryCtaLink: 'contact.html',
            secondaryCtaText: 'View Capabilities',
            secondaryCtaLink: '#capabilities'
        },
        sections: [
            {
                type: 'cards',
                id: 'capabilities',
                sectionClass: 'bg-base-100',
                heading: 'What We Build',
                intro: 'Custom software, integrations, dashboards, portals, and internal tools that fit your processes instead of forcing new ones.',
                gridClass: 'md:grid-cols-2 lg:grid-cols-3',
                cards: [
                    { id: 'erp-crm-integrations', title: 'ERP / CRM Integrations', description: 'Connect SAP, Salesforce, Odoo, and other systems into a single reliable workflow.' },
                    { title: 'Digital Engineering', description: 'Algorithms and engineering software that accelerate prototyping and R&D.' },
                    { title: 'Dealer & Customer Portals', description: 'Self-service platforms for orders, stock, service requests, and account access.' },
                    { title: 'Human-in-the-Loop QA', description: 'AI-speed testing with expert review for data, content, and critical workflows.' },
                    { id: 'legacy-modernization', title: 'Legacy Modernization', description: 'Move old software onto modern cloud architecture without losing data or continuity.' },
                    { id: 'bi-dashboards', title: 'BI Dashboards & Internal Apps', description: 'Real-time reporting interfaces and operational apps for teams in the field and office.' },
                    { id: 'internal-applications', title: 'Internal Operational Applications', description: 'Mobile and web apps for technicians, sales teams, and back-office operations.' },
                    { title: 'Corporate Website Development', description: 'Fast, structured corporate websites built to support marketing and sales operations.' },
                    { title: 'MVP Development', description: 'Build a working prototype in weeks to validate new business ideas before scaling.' }
                ]
            },
            {
                type: 'split',
                id: 'data-architecture',
                sectionClass: 'bg-base-200',
                heading: 'Custom Data Architecture',
                intro: 'Clean, categorize, and structure your company data so future AI integrations can use it safely and effectively.',
                bullets: [
                    { icon: 'database', title: 'Database design and normalization', description: 'Model data for maintainability and operational clarity.' },
                    { icon: 'workflow', title: 'Data cleansing and transformation pipelines', description: 'Prepare fragmented data for reliable use across systems.' },
                    { icon: 'layout-dashboard', title: 'ERP / CRM-ready schema planning', description: 'Structure tables and relationships around business workflows.' },
                    { icon: 'shield-check', title: 'AI-ready data governance', description: 'Create the control layer needed for safe future AI use.' }
                ],
                panel: {
                    title: 'Build path',
                    description: 'We start with your operational pain points, map the workflow, then ship the smallest reliable version first.',
                    steps: [
                        'Discovery and process mapping',
                        'Architecture and integration design',
                        'Build, test, and launch'
                    ]
                }
            }
        ],
        cta: {
            heading: 'Ready to build the software your team actually needs?',
            description: 'We can modernize what you have or design the new system from scratch.',
            buttonText: 'Start the Project'
        }
    },
    'ai-opportunity-review': {
        category: 'ai-solutions',
        hero: {
            badge: 'Service 1',
            titlePrefix: 'AI Opportunity Review',
            titleSuffix: '',
            description: 'We run the Data Dump Model on your company data, generate PDF reports, and define where AI should be implemented first.',
            image: './assets/images/about-team-hive.png',
            alt: 'AI opportunity review and data analysis',
            primaryCtaText: 'Start Review',
            primaryCtaLink: 'contact.html',
            secondaryCtaText: 'See Data Dump Model',
            secondaryCtaLink: '#data-dump-model'
        },
        sections: [
            {
                type: 'cards',
                id: 'review-overview',
                sectionClass: 'bg-base-100',
                heading: 'How Service 1 Works',
                intro: 'Everything starts with Data Dump analysis before any build work.',
                gridClass: 'md:grid-cols-2',
                cards: [
                    { title: 'Department Data Dump', description: 'You upload company data by business department: finance, sales, operations, production, and more.', borderClass: 'border-primary' },
                    { title: 'Deep Analysis', description: 'We process large datasets and analyze current business state with department-level detail.', borderClass: 'border-secondary' },
                    { title: 'PDF Report Output', description: 'Each report contains current-data analysis and clear AI implementation opportunities.', borderClass: 'border-accent' },
                    { title: 'Priority Task List', description: 'Reports become the AI task queue used for planning and implementation services.', borderClass: 'border-neutral' }
                ]
            },
            {
                type: 'html',
                html: buildDataDumpModelSection()
            },
            {
                type: 'process',
                id: 'review-process',
                sectionClass: 'bg-base-200',
                heading: 'Output of Service 1',
                intro: 'You leave this stage with clear data-backed direction.',
                steps: [
                    { title: 'Analyze company data', description: 'Data Dump processing turns raw business files into structured findings.' },
                    { title: 'Generate department PDF reports', description: 'Each report shows existing performance and where AI will create impact.' },
                    { title: 'Move into implementation', description: 'Approved priorities feed directly into Service 2 planning and Service 3 build.' }
                ]
            },
            {
                type: 'faq',
                id: 'review-faq',
                sectionClass: 'bg-base-100',
                heading: 'Common Questions',
                intro: 'Questions about AI Opportunity Review and Data Dump.',
                items: [
                    { q: 'What does each PDF include?', a: 'Two things: analysis of your existing data and where to implement AI first.' },
                    { q: 'Can we run new analysis later?', a: 'Yes. We can use previous PDF reports with new data for faster re-analysis.' },
                    { q: 'Do you support large datasets?', a: 'Yes. The model is designed for high-volume enterprise data processing.' },
                    { q: 'What is next after this review?', a: 'We move from report outputs into roadmap planning and implementation.' }
                ]
            }
        ],
        cta: {
            heading: 'Ready to Run AI Opportunity Review?',
            description: 'Start with Data Dump, get your reports, and define the right AI implementation path.',
            buttonText: 'Start Opportunity Review'
        }
    },
    'ai-build-setup': {
        category: 'custom-software',
        hero: {
            badge: 'Service 3',
            titlePrefix: 'AI Build & Setup',
            titleSuffix: '',
            description: 'We implement the approved AI opportunities as working tools, software, automations, and workflows.',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
            alt: 'AI microapps and workflow setup',
            primaryCtaText: 'Talk to Us',
            primaryCtaLink: 'contact.html',
            secondaryCtaText: 'See Applications',
            secondaryCtaLink: '#real-business-applications'
        },
        sections: [
            {
                type: 'cards',
                id: 'what-you-get',
                sectionClass: 'bg-base-100',
                heading: 'What This Service Really Means',
                intro: 'This service turns approved opportunities into deployed AI applications.',
                gridClass: 'md:grid-cols-2',
                cards: [
                    { title: 'Workflow Build', description: 'We build the software and automation flows defined by your approved AI priorities.', borderClass: 'border-primary' },
                    { title: 'System Integration', description: 'We connect applications to your real systems and data sources.', borderClass: 'border-secondary' },
                    { title: 'Rollout and Training', description: 'We deploy for teams and make sure daily usage is practical and consistent.', borderClass: 'border-accent' },
                    { title: 'Support and Iteration', description: 'We fix, improve, and expand based on real usage after launch.', borderClass: 'border-neutral' }
                ]
            },
            {
                type: 'html',
                html: buildRealBusinessApplicationsSection()
            },
            {
                type: 'process',
                id: 'build-process',
                sectionClass: 'bg-base-200',
                heading: 'How We Turn This Into Real Delivery',
                intro: 'Clear build flow from backlog to production use.',
                steps: [
                    { title: 'Translate priorities into scope', description: 'We convert approved opportunities into delivery scope and milestones.' },
                    { title: 'Build and integrate', description: 'We develop the tools and connect them into your business workflow.' },
                    { title: 'Deploy and optimize', description: 'We launch, support users, and improve based on real outcomes.' }
                ]
            },
            {
                type: 'faq',
                id: 'build-faq',
                sectionClass: 'bg-base-100',
                heading: 'Common Questions',
                intro: 'Questions about implementation and rollout.',
                items: [
                    { q: 'Do you only build from your own review output?', a: 'No. We can also implement from existing client requirements and approved internal plans.' },
                    { q: 'Can you integrate with our current systems?', a: 'Yes. Integration is part of delivery for most projects.' },
                    { q: 'Do we need to launch everything at once?', a: 'No. We typically deploy in stages and expand after validation.' },
                    { q: 'Do you provide support after launch?', a: 'Yes. Ongoing support and iteration are part of our delivery model.' }
                ]
            }
        ],
        cta: {
            heading: 'Want this kind of app built for your business?',
            description: 'Bring approved AI priorities and we will turn them into working systems.',
            buttonText: 'Start the Build'
        }
    }
};

function renderSolutionCardsSection(section) {
    const cardsHtml = section.cards.map((card, index) => {
        const borderClass = card.borderClass || ['border-primary', 'border-secondary', 'border-accent', 'border-neutral'][index % 4];
        const idAttr = card.id ? ` id="${card.id}"` : '';
        return `
            <div${idAttr} class="buzz-card p-8 bg-white shadow-lg border-t-4 ${borderClass}">
                <h3 class="text-2xl font-bold mb-3">${card.title}</h3>
                <p class="text-base-content/70">${card.description}</p>
            </div>`;
    }).join('');

    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-100'}">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">${section.heading}</h2>
            <p class="text-lg text-base-content/60 max-w-3xl mx-auto">${section.intro}</p>
        </div>

        <div class="grid grid-cols-1 ${section.gridClass || 'md:grid-cols-2'} gap-8">
            ${cardsHtml}
        </div>
    </div>
</section>`;
}

function renderSolutionSplitSection(section) {
    const stepStyles = [
        'bg-primary/10 text-primary',
        'bg-secondary/10 text-secondary',
        'bg-neutral/10 text-neutral'
    ];

    const bulletsHtml = (section.bullets || []).map((item) => `
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <i data-lucide="${item.icon || 'check'}" class="w-6 h-6 text-primary"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-lg mb-2">${item.title}</h4>
                            <p class="text-gray-600">${item.description}</p>
                        </div>
                    </div>`).join('');

    const leftCardsHtml = (section.leftCards || []).map((item, index) => `
                        <div${item.id ? ` id="${item.id}"` : ''} class="p-6 bg-base-100 rounded-2xl">
                            <h3 class="font-bold mb-2">${item.title}</h3>
                            <p class="text-sm text-base-content/60">${item.description}</p>
                        </div>`).join('');

    const panelHtml = section.panel ? `
                <div class="bg-white p-8 rounded-3xl shadow-xl">
                    <h3 class="text-2xl font-bold mb-4">${section.panel.title}</h3>
                    <p class="text-base-content/70 mb-6">${section.panel.description}</p>
                    <div class="space-y-4">
                        ${section.panel.steps.map((step, index) => `
                            <div class="flex items-center gap-3"><span class="w-8 h-8 rounded-full ${stepStyles[index] || stepStyles[0]} flex items-center justify-center font-bold">${index + 1}</span><span>${step}</span></div>
                        `).join('')}
                    </div>
                </div>` : '';

    const rightHtml = section.image ? `
            <div class="relative">
                <img src="${section.image}" alt="${section.alt || ''}" class="rounded-3xl shadow-2xl w-full object-cover aspect-square">
            </div>` : panelHtml;

    const leftHtml = section.leftCards && section.leftCards.length ? `
            <div class="space-y-6">
                <h2 class="text-3xl md:text-5xl font-black leading-tight">${section.heading}</h2>
                ${section.intro ? `<p class="text-lg text-base-content/70">${section.intro}</p>` : ''}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    ${leftCardsHtml}
                </div>
            </div>` : `
            <div class="space-y-6">
                <h2 class="text-3xl md:text-5xl font-black leading-tight">${section.heading}</h2>
                ${section.intro ? `<p class="text-lg text-base-content/70">${section.intro}</p>` : ''}
                <div class="space-y-6">
                    ${bulletsHtml}
                </div>
            </div>`;

    const splitContent = section.reverse ? `${rightHtml}${leftHtml}` : `${leftHtml}${rightHtml}`;
    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-200'}">
    <div class="container mx-auto container-padding">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
            ${splitContent}
        </div>
    </div>
</section>`;
}

function renderSolutionPageCTA(section) {
    return `
<section class="section-spacing bg-primary text-white">
    <div class="container mx-auto container-padding text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">${section.heading}</h2>
        <p class="text-xl mb-8 opacity-90 max-w-3xl mx-auto">${section.description}</p>
        <a href="contact.html" class="btn btn-white btn-lg text-primary border-none">${section.buttonText}</a>
    </div>
</section>`;
}

function renderSolutionProblemsSection(section) {
    const itemsHtml = section.problems.map((problem, index) => `
        <div class="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-red-100">
            <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i data-lucide="${problem.icon || 'alert-circle'}" class="w-5 h-5 text-red-500"></i>
            </div>
            <div>
                <h3 class="font-bold text-lg mb-1">${problem.title}</h3>
                <p class="text-base-content/70 text-sm">${problem.description}</p>
            </div>
        </div>`).join('');

    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-100'}">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">${section.heading}</h2>
            <p class="text-lg text-base-content/60 max-w-3xl mx-auto">${section.intro}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${itemsHtml}
        </div>
    </div>
</section>`;
}

function renderSolutionProcessSection(section) {
    const stepsHtml = section.steps.map((step, index) => `
        <div class="flex flex-col items-center text-center relative">
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                <span class="text-2xl font-black text-white">${index + 1}</span>
            </div>
            ${index < section.steps.length - 1 ? '<div class="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-primary/20"></div>' : ''}
            <h3 class="text-xl font-bold mb-3">${step.title}</h3>
            <p class="text-base-content/70">${step.description}</p>
        </div>`).join('');

    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-200'}">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">${section.heading}</h2>
            <p class="text-lg text-base-content/60 max-w-3xl mx-auto">${section.intro}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            ${stepsHtml}
        </div>
    </div>
</section>`;
}

function renderSolutionFaqSection(section) {
    const faqItems = section.items.map((item, index) => `
                    <details class="group bg-base-200 rounded-2xl px-6 py-2 shadow-sm" ${index === 0 ? 'open' : ''}>
                        <summary class="list-none cursor-pointer py-4 text-xl font-medium flex items-center justify-between gap-4">
                            <span>${item.q}</span>
                            <span class="text-primary text-2xl leading-none">+</span>
                        </summary>
                        <div class="pb-4 text-base-content/80">
                            <p>${item.a}</p>
                        </div>
                    </details>`).join('');

    return `
<section${section.id ? ` id="${section.id}"` : ''} class="section-spacing ${section.sectionClass || 'bg-base-100'}">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4">${section.heading}</h2>
            <p class="text-lg text-base-content/60 max-w-3xl mx-auto">${section.intro}</p>
        </div>
        <div class="space-y-4 max-w-4xl mx-auto">
            ${faqItems}
        </div>
    </div>
</section>`;
}

function renderSolutionHtmlSection(section) {
    return section.html || '';
}

function buildAiPlanDiagramSection() {
    return `
<section id="ai-plan-diagram" class="section-spacing bg-base-100">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-14">
            <h2 class="text-4xl md:text-5xl font-black mb-4">
                <span class="gradient-header">AI Plan Architecture</span>
            </h2>
            <p class="text-base text-base-content/60 max-w-3xl mx-auto">
                How we turn your Opportunity Review findings into a practical, phased implementation roadmap.
            </p>
        </div>

        <style>
            .ddm-diagram { display: flex; flex-direction: column; gap: 0; align-items: center; }
            @media (min-width: 1024px) { .ddm-diagram { flex-direction: row; align-items: stretch; gap: 0; } }
            .ddm-col { display: flex; flex-direction: column; gap: 10px; }
            .ddm-arrow-h {
                display: none; align-self: center; flex-shrink: 0; width: 56px; position: relative;
            }
            @media (min-width: 1024px) { .ddm-arrow-h { display: flex; align-items: center; justify-content: center; } }
            .ddm-arrow-v {
                display: flex; align-items: center; justify-content: center; height: 40px; flex-direction: column;
            }
            @media (min-width: 1024px) { .ddm-arrow-v { display: none; } }
            
            .ddm-connector-v { width: 2px; height: 100%; background: linear-gradient(180deg, rgba(87,13,248,0.25), rgba(87,13,248,0.6)); position: relative; }
            .ddm-connector-v::after { content: ''; position: absolute; bottom: -2px; left: -4px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid rgba(87,13,248,0.6); }

            .ddm-engine-card {
                background: linear-gradient(135deg, rgba(87,13,248,0.05), white);
                border: 2px solid rgba(87,13,248,0.15);
                border-radius: 16px; padding: 24px; position: relative; overflow: hidden;
                box-shadow: 0 10px 30px -10px rgba(87,13,248,0.1);
            }
            .ddm-engine-pulse {
                position: absolute; top: 0; left: 0; width: 100%; height: 3px;
                background: linear-gradient(90deg, transparent, #570df8, transparent);
                animation: ddm-pulse 2.5s infinite linear;
            }
            @keyframes ddm-pulse { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

            .ddm-output-card {
                background: white; border: 1.5px solid rgba(0,0,0,0.05); border-radius: 12px;
                padding: 16px; flex: 1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
            }
            .ddm-output-badge {
                display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
                border-radius: 20px; font-size: 11px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;
            }
            .ddm-tag {
                font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px;
                display: inline-flex; align-items: center;
            }
            .ddm-input-pill {
                display: flex; align-items: center; justify-content: space-between;
                padding: 10px 14px; background: white; border: 1px solid rgba(0,0,0,0.08);
                border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151;
            }
        </style>

        <div class="ddm-diagram max-w-5xl mx-auto">
            <!-- Left: Inputs -->
            <div style="min-width: 0; flex: 1;">
                <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-4 text-center lg:text-right pr-1">Review Findings</div>
                <div class="ddm-col" style="gap:8px;">
                    <div class="ddm-input-pill"><span>Review PDF Reports</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                    <div class="ddm-input-pill"><span>Business Objectives</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
                    <div class="ddm-input-pill"><span>Budget Constraints</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                    <div class="ddm-input-pill"><span>Team Bandwidth</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div class="ddm-input-pill"><span>Technical Readiness</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
                </div>
            </div>

            <!-- Arrow H (desktop) -->
            <div class="ddm-arrow-h" style="padding: 0 8px;">
                <div style="width:100%; position:relative; display:flex; align-items:center;">
                    <div style="flex:1; height:2px; background:linear-gradient(90deg, rgba(87,13,248,0.25),rgba(87,13,248,0.6));"></div>
                    <div style="border-left:9px solid rgba(87,13,248,0.6); border-top:6px solid transparent; border-bottom:6px solid transparent; flex-shrink:0;"></div>
                </div>
            </div>

            <!-- Arrow V (mobile) -->
            <div class="ddm-arrow-v" style="width:100%;"><div class="ddm-connector-v"></div></div>

            <!-- Center: Engine -->
            <div style="min-width: 0; flex: 1.2;">
                <div class="ddm-engine-card h-full flex flex-col justify-center">
                    <div class="ddm-engine-pulse"></div>
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                        <div style="width:40px; height:40px; border-radius:10px; background:#570df8; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow: 0 4px 12px rgba(87,13,248,0.3);">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                        </div>
                        <div>
                            <div style="font-weight:800; font-size:18px; color:#111827; line-height:1.2;">Prioritization Engine</div>
                            <div style="font-size:12px; font-weight:600; color:#570df8;">Impact vs Effort Matrix</div>
                        </div>
                    </div>
                    
                    <div style="background: white; border-radius: 8px; padding: 12px; border: 1px solid rgba(87,13,248,0.1);">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; align-items:center;">
                            <span style="font-size:12px; font-weight:600; color:#6b7280;">High Value / Low Effort</span>
                            <span style="font-size:11px; font-weight:700; color:#059669; background:#ecfdf5; padding:2px 6px; border-radius:4px;">Phase 1</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px; align-items:center;">
                            <span style="font-size:12px; font-weight:600; color:#6b7280;">High Value / High Effort</span>
                            <span style="font-size:11px; font-weight:700; color:#d97706; background:#fffbeb; padding:2px 6px; border-radius:4px;">Phase 2</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:12px; font-weight:600; color:#6b7280;">Low Value</span>
                            <span style="font-size:11px; font-weight:700; color:#dc2626; background:#fef2f2; padding:2px 6px; border-radius:4px;">Discard</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Arrow H (desktop) -->
            <div class="ddm-arrow-h" style="padding: 0 8px;">
                <div style="width:100%; position:relative; display:flex; align-items:center;">
                    <div style="flex:1; height:2px; background:linear-gradient(90deg, rgba(87,13,248,0.25),rgba(87,13,248,0.6));"></div>
                    <div style="border-left:9px solid rgba(87,13,248,0.6); border-top:6px solid transparent; border-bottom:6px solid transparent; flex-shrink:0;"></div>
                </div>
            </div>

            <!-- Arrow V (mobile) -->
            <div class="ddm-arrow-v" style="width:100%;"><div class="ddm-connector-v"></div></div>

            <!-- Right: Outputs -->
            <div style="min-width:0; flex:1;">
                <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-4 text-center lg:text-left pl-1">The Working Plan</div>
                <div class="ddm-col" style="gap:16px;">

                    <div class="ddm-output-card" style="border-color: rgba(16,185,129,0.25); background: linear-gradient(135deg, rgba(16,185,129,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(16,185,129,0.1); color:#059669;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            Short Projects
                        </div>
                        <div style="font-weight:700; font-size:14px; margin-bottom:4px; color:#111827;">Quick Wins & Build</div>
                        <div style="font-size:12px; color:#6b7280; line-height:1.5;">Fixed-fee sprints to launch high-ROI tools immediately.</div>
                        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#ecfdf5; color:#065f46;">→ Service 3 (Setup)</span>
                        </div>
                    </div>

                    <div class="ddm-output-card" style="border-color: rgba(59,130,246,0.25); background: linear-gradient(135deg, rgba(59,130,246,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(59,130,246,0.1); color:#2563eb;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                            Monthly Services
                        </div>
                        <div style="font-weight:700; font-size:14px; margin-bottom:4px; color:#111827;">Ongoing Rollout</div>
                        <div style="font-size:12px; color:#6b7280; line-height:1.5;">Continuous integration and workflow improvement.</div>
                        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#eff6ff; color:#1d4ed8;">→ Service 5 (Support)</span>
                        </div>
                    </div>

                    <div class="ddm-output-card" style="border-color: rgba(139,92,246,0.25); background: linear-gradient(135deg, rgba(139,92,246,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(139,92,246,0.1); color:#7c3aed;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            Training Schedule
                        </div>
                        <div style="font-weight:700; font-size:14px; margin-bottom:4px; color:#111827;">Team Enablement</div>
                        <div style="font-size:12px; color:#6b7280; line-height:1.5;">Structured sessions to build daily usage habits.</div>
                        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#f5f3ff; color:#6d28d9;">→ Service 4 (Training)</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</section>
`;
}

function buildDataDumpModelSection() {
    return `
<section id="data-dump-model" class="section-spacing bg-base-100">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-14">
            <h2 class="text-4xl md:text-5xl font-black mb-4">
                <span class="gradient-header">Data Dump Model</span>
            </h2>
            <p class="text-base text-base-content/60 max-w-3xl mx-auto">
                Every engagement starts here. We process large department datasets and generate structured PDF reports — covering current-state analysis and where to implement AI first.
            </p>
            <p class="text-sm text-base-content/50 max-w-2xl mx-auto mt-2">
                Built for high-volume company datasets where generic public assistants hit file limits.
            </p>
        </div>

        <!-- Diagram -->
        <style>
            .ddm-diagram { display: flex; flex-direction: column; gap: 0; align-items: center; }
            @media (min-width: 1024px) { .ddm-diagram { flex-direction: row; align-items: stretch; gap: 0; } }
            .ddm-col { display: flex; flex-direction: column; gap: 10px; }
            .ddm-arrow-h {
                display: none;
                align-self: center;
                flex-shrink: 0;
                width: 56px;
                position: relative;
            }
            @media (min-width: 1024px) { .ddm-arrow-h { display: flex; align-items: center; justify-content: center; } }
            .ddm-arrow-v {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 40px;
                flex-direction: column;
            }
            @media (min-width: 1024px) { .ddm-arrow-v { display: none; } }
            .ddm-dept-pill {
                display: flex;
                align-items: center;
                gap: 10px;
                background: white;
                border: 1.5px solid #e5e7eb;
                border-radius: 12px;
                padding: 10px 16px;
                font-size: 13px;
                font-weight: 600;
                color: #374151;
                transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
                box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            }
            .ddm-dept-pill:hover { border-color: var(--color-primary, #570df8); box-shadow: 0 4px 16px rgba(87,13,248,0.10); transform: translateX(3px); }
            .ddm-dept-icon {
                width: 28px; height: 28px; border-radius: 8px;
                background: linear-gradient(135deg, rgba(87,13,248,0.12), rgba(87,13,248,0.06));
                display: flex; align-items: center; justify-content: center; flex-shrink: 0;
            }
            .ddm-dept-icon svg { width: 14px; height: 14px; color: var(--color-primary, #570df8); stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
            .ddm-engine {
                background: linear-gradient(135deg, #570df8, #7c3aed);
                border-radius: 20px;
                padding: 32px 28px;
                color: white;
                text-align: center;
                box-shadow: 0 8px 40px rgba(87,13,248,0.30);
                min-width: 220px;
                align-self: center;
                position: relative;
                overflow: hidden;
            }
            .ddm-engine::before {
                content: '';
                position: absolute; inset: 0;
                background: radial-gradient(ellipse at top left, rgba(255,255,255,0.15), transparent 60%);
                pointer-events: none;
            }
            .ddm-engine-icon {
                width: 56px; height: 56px; border-radius: 16px;
                background: rgba(255,255,255,0.15);
                display: flex; align-items: center; justify-content: center;
                margin: 0 auto 14px;
            }
            .ddm-engine-icon svg { width: 28px; height: 28px; stroke: white; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
            .ddm-pulse-ring {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 100%; height: 100%;
                border-radius: 20px;
                border: 2px solid rgba(255,255,255,0.2);
                animation: ddm-pulse 2.5s ease-in-out infinite;
                pointer-events: none;
            }
            @keyframes ddm-pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                50% { transform: translate(-50%, -50%) scale(1.04); opacity: 0.15; }
            }
            .ddm-output-card {
                background: white;
                border-radius: 16px;
                padding: 20px 22px;
                border: 2px solid #e5e7eb;
                box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .ddm-output-card:hover { border-color: var(--color-primary, #570df8); box-shadow: 0 6px 24px rgba(87,13,248,0.12); }
            .ddm-output-badge {
                display: inline-flex; align-items: center; gap: 6px;
                font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
                padding: 4px 10px; border-radius: 20px; margin-bottom: 10px;
            }
            .ddm-connector-line {
                flex: 1;
                height: 2px;
                background: linear-gradient(90deg, rgba(87,13,248,0.3), rgba(87,13,248,0.6));
                position: relative;
            }
            .ddm-connector-line::after {
                content: '';
                position: absolute; right: -6px; top: 50%; transform: translateY(-50%);
                border-left: 8px solid rgba(87,13,248,0.6); border-top: 5px solid transparent; border-bottom: 5px solid transparent;
            }
            .ddm-connector-v {
                width: 2px;
                height: 32px;
                background: linear-gradient(180deg, rgba(87,13,248,0.3), rgba(87,13,248,0.6));
                margin: 0 auto;
                position: relative;
            }
            .ddm-connector-v::after {
                content: '';
                position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
                border-top: 8px solid rgba(87,13,248,0.6); border-left: 5px solid transparent; border-right: 5px solid transparent;
            }
            .ddm-tag {
                display: inline-flex; align-items: center; gap: 4px;
                font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
                padding: 3px 8px; border-radius: 6px;
            }
        </style>

        <div class="ddm-diagram">
            <!-- Left: Input Domains -->
            <div style="min-width:0; flex:1;">
                <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-4 text-center lg:text-left pl-1">Company Data Departments</div>
                <div class="ddm-col">
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>Revenue Collection</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z M8 12h8M8 8h8M8 16h5"/></svg></div>Financial Data</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>Sales Analysis</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m-1 9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2z"/></svg></div>Supply Chain</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM1 9h22M1 15h22"/></svg></div>Invoice Analysis</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg></div>Employee Performance</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>Energy Cost</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div>Production Line</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div>Timesheets</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>Product Analysis</div>
                    <div class="ddm-dept-pill"><div class="ddm-dept-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>Manufacturing</div>
                </div>
            </div>

            <!-- Arrow H (desktop) -->
            <div class="ddm-arrow-h" style="padding: 0 8px;">
                <div style="width:100%; position:relative; display:flex; align-items:center;">
                    <div style="flex:1; height:2px; background:linear-gradient(90deg, rgba(87,13,248,0.25),rgba(87,13,248,0.6));"></div>
                    <div style="border-left:9px solid rgba(87,13,248,0.6); border-top:6px solid transparent; border-bottom:6px solid transparent; flex-shrink:0;"></div>
                </div>
            </div>

            <!-- Arrow V (mobile) -->
            <div class="ddm-arrow-v" style="width:100%;"><div class="ddm-connector-v"></div></div>

            <!-- Center: Engine -->
            <div style="flex-shrink:0; display:flex; align-items:center; justify-content: center;">
                <div class="ddm-engine">
                    <div class="ddm-pulse-ring"></div>
                    <div class="ddm-engine-icon">
                        <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3" stroke="rgba(255,255,255,0.9)" fill="none"/><circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.8)"/><path d="M12 6V4M12 20v-2M6 12H4M20 12h-2" stroke="rgba(255,255,255,0.6)"/></svg>
                    </div>
                    <div style="font-weight:800; font-size:15px; margin-bottom:4px; position:relative;">Data Dump Engine</div>
                    <div style="font-size:11px; opacity:0.8; position:relative; line-height:1.5;">High-volume processing<br>Sensitive data masked<br>Department-level analysis</div>
                    <div style="margin-top:14px; display:flex; gap:6px; justify-content:center; flex-wrap:wrap; position:relative;">
                        <span style="background:rgba(255,255,255,0.15); font-size:10px; padding:3px 8px; border-radius:6px; font-weight:600;">Up to 1 TB</span>
                        <span style="background:rgba(255,255,255,0.15); font-size:10px; padding:3px 8px; border-radius:6px; font-weight:600;">≈ 3 days</span>
                    </div>
                </div>
            </div>

            <!-- Arrow H (desktop) -->
            <div class="ddm-arrow-h" style="padding: 0 8px;">
                <div style="width:100%; position:relative; display:flex; align-items:center;">
                    <div style="flex:1; height:2px; background:linear-gradient(90deg, rgba(87,13,248,0.25),rgba(87,13,248,0.6));"></div>
                    <div style="border-left:9px solid rgba(87,13,248,0.6); border-top:6px solid transparent; border-bottom:6px solid transparent; flex-shrink:0;"></div>
                </div>
            </div>

            <!-- Arrow V (mobile) -->
            <div class="ddm-arrow-v" style="width:100%;"><div class="ddm-connector-v"></div></div>

            <!-- Right: Outputs -->
            <div style="min-width:0; flex:1;">
                <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-4 text-center lg:text-left pl-1">Output Per Department</div>
                <div class="ddm-col" style="gap:16px;">

                    <div class="ddm-output-card" style="border-color: rgba(87,13,248,0.2); background: linear-gradient(135deg, rgba(87,13,248,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(87,13,248,0.1); color:#570df8;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            PDF Report
                        </div>
                        <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#111827;">Department Analysis Report</div>
                        <div style="font-size:13px; color:#6b7280; line-height:1.6;">Current-state performance breakdown — what the data shows about how the department is running today.</div>
                        <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#f3f4f6; color:#374151;">Trends</span>
                            <span class="ddm-tag" style="background:#f3f4f6; color:#374151;">Bottlenecks</span>
                            <span class="ddm-tag" style="background:#f3f4f6; color:#374151;">Anomalies</span>
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; gap:10px; padding: 0 6px;">
                        <div style="flex:1; height:1px; background: linear-gradient(90deg, transparent, rgba(87,13,248,0.2), transparent);"></div>
                        <div style="font-size:11px; font-weight:700; color:rgba(87,13,248,0.5); text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap;">+ also includes</div>
                        <div style="flex:1; height:1px; background: linear-gradient(90deg, transparent, rgba(87,13,248,0.2), transparent);"></div>
                    </div>

                    <div class="ddm-output-card" style="border-color: rgba(16,185,129,0.25); background: linear-gradient(135deg, rgba(16,185,129,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(16,185,129,0.1); color:#059669;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            AI Opportunities
                        </div>
                        <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#111827;">Where to Implement AI First</div>
                        <div style="font-size:13px; color:#6b7280; line-height:1.6;">Ranked list of AI use cases with expected business impact — feeds directly into Service 2 planning.</div>
                        <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#ecfdf5; color:#065f46;">Revenue ↑</span>
                            <span class="ddm-tag" style="background:#ecfdf5; color:#065f46;">Cost ↓</span>
                            <span class="ddm-tag" style="background:#ecfdf5; color:#065f46;">Cash Flow ↑</span>
                        </div>
                    </div>

                    <div class="ddm-output-card" style="border-color: rgba(245,158,11,0.25); background: linear-gradient(135deg, rgba(245,158,11,0.03), white);">
                        <div class="ddm-output-badge" style="background:rgba(245,158,11,0.1); color:#d97706;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            Task Queue
                        </div>
                        <div style="font-weight:700; font-size:15px; margin-bottom:6px; color:#111827;">Prioritised AI Task List</div>
                        <div style="font-size:13px; color:#6b7280; line-height:1.6;">Structured task backlog used as source input for Service 2 (AI Plan) and Service 3 (Build &amp; Setup).</div>
                        <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="ddm-tag" style="background:#fffbeb; color:#92400e;">→ Service 2</span>
                            <span class="ddm-tag" style="background:#fffbeb; color:#92400e;">→ Service 3</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Re-analysis note -->
        <div style="margin-top: 36px; background: linear-gradient(135deg, rgba(87,13,248,0.04), rgba(87,13,248,0.02)); border:1.5px solid rgba(87,13,248,0.12); border-radius:16px; padding: 18px 24px; display:flex; align-items:center; gap:14px; max-width:680px; margin-left:auto; margin-right:auto;">
            <div style="width:36px; height:36px; border-radius:10px; background:rgba(87,13,248,0.1); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#570df8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </div>
            <div>
                <div style="font-weight:700; font-size:13px; color:#374151; margin-bottom:2px;">Re-analysis available</div>
                <div style="font-size:12px; color:#6b7280;">Subsequent runs reuse the previous PDF report alongside new data — no full reprocessing required.</div>
            </div>
        </div>
    </div>
</section>`;
}

function buildRealBusinessApplicationsSection() {
    return `
<section id="real-business-applications" class="section-spacing bg-base-200">
    <div class="container mx-auto container-padding">
        <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-black mb-4">
                <span class="gradient-header">Real Business Applications of AI</span>
            </h2>
            <p class="text-base text-base-content/60 max-w-3xl mx-auto">
                Implementation layer for Service 3. We turn approved opportunities into working business applications.
            </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-primary">
                <h3 class="text-xl font-bold mb-2">Revenue Collection Application</h3>
                <p class="text-sm text-base-content/70">Automated follow-up, promise-to-pay tracking, and escalation management.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-secondary">
                <h3 class="text-xl font-bold mb-2">Financial Data Application</h3>
                <p class="text-sm text-base-content/70">Cost control workflows, anomaly detection, and finance decision automation.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-accent">
                <h3 class="text-xl font-bold mb-2">Sales Analysis Application</h3>
                <p class="text-sm text-base-content/70">Pipeline recovery, quote follow-up, and conversion optimization workflows.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-primary">
                <h3 class="text-xl font-bold mb-2">Supply Chain Application</h3>
                <p class="text-sm text-base-content/70">Delay prediction, replenishment priorities, and procurement intelligence.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-secondary">
                <h3 class="text-xl font-bold mb-2">Product Analysis Application</h3>
                <p class="text-sm text-base-content/70">Margin insights, lifecycle actions, and product performance recommendations.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-accent">
                <h3 class="text-xl font-bold mb-2">Invoice and Timesheet Application</h3>
                <p class="text-sm text-base-content/70">Validation controls, exception routing, and approval acceleration.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-primary">
                <h3 class="text-xl font-bold mb-2">Employee Performance Application</h3>
                <p class="text-sm text-base-content/70">Manager signals, workload balancing, and productivity improvement workflows.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-secondary">
                <h3 class="text-xl font-bold mb-2">Energy Cost Application</h3>
                <p class="text-sm text-base-content/70">Peak reduction, energy optimization, and operational schedule improvements.</p>
            </div>
            <div class="buzz-card p-6 bg-white shadow-lg border-t-4 border-accent">
                <h3 class="text-xl font-bold mb-2">Production and Manufacturing Application</h3>
                <p class="text-sm text-base-content/70">Downtime reduction, throughput stability, and process drift correction workflows.</p>
            </div>
        </div>
    </div>
</section>`;
}

function buildSolutionPageContent(templateName) {
    const blueprint = SOLUTION_PAGE_BLUEPRINTS[templateName];
    if (!blueprint) {
        return null;
    }

    const sections = blueprint.sections.map(section => {
        if (section.type === 'cards') {
            return renderSolutionCardsSection(section);
        }
        if (section.type === 'split') {
            return renderSolutionSplitSection(section);
        }
        if (section.type === 'process') {
            return renderSolutionProcessSection(section);
        }
        if (section.type === 'faq') {
            return renderSolutionFaqSection(section);
        }
        if (section.type === 'html') {
            return renderSolutionHtmlSection(section);
        }
        return '';
    });

    return {
        hero: blueprint.hero,
        section_1: sections[0] || '',
        section_2: sections[1] || '',
        section_3: sections[2] || '',
        section_4: sections[3] || '',
        section_5: sections[4] || '',
        section_6: sections[5] || '',
        cta: renderSolutionPageCTA(blueprint.cta),
        category: blueprint.category
    };
}

function stripServiceDescription(description) {
    return description
        .replace(/\s*in\s*\{\{CITY_NAME\}\}/gi, '')
        .replace(/\s*in\s*\{\{COUNTRY_NAME\}\}/gi, '')
        .replace(/\{\{CITY_NAME\}\}/g, '')
        .replace(/\{\{COUNTRY_NAME\}\}/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s([,.;:!?])/g, '$1')
        .trim();
}

function parseBenefitText(text) {
    const match = text.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
    if (match) {
        return { title: match[1], description: match[2] };
    }
    return { title: text.replace(/\*\*/g, ''), description: '' };
}

const SERVICE_PROBLEMS = {
    'microsoft-365-workspace-management': [
        { icon: 'mail-x', title: 'Email chaos across devices', description: 'Your team uses personal emails or outdated inboxes. Licenses are untracked, access is inconsistent.' },
        { icon: 'key-round', title: 'No control over who has access', description: 'Former employees still have active accounts. Nobody knows the full list of licenses in use.' },
        { icon: 'cloud-off', title: 'Files stored in the wrong place', description: 'Documents live on local drives, USB sticks, or personal cloud accounts instead of a secure shared space.' }
    ],
    'cloud-architecture-azure-transition': [
        { icon: 'server-crash', title: 'You still run physical servers', description: 'Hardware failures, maintenance costs, and the risk of losing everything if a server dies.' },
        { icon: 'trending-up', title: 'Scaling is slow and expensive', description: 'Every time your business grows, you have to buy more hardware. It costs too much and takes too long.' },
        { icon: 'shield-off', title: 'Backups are unreliable', description: 'Your data lives in one place. If something goes wrong, recovery is slow or impossible.' }
    ],
    'endpoint-security': [
        { icon: 'laptop-2', title: 'Devices are unprotected', description: 'Staff laptops and phones have no centralized protection. One infected device can compromise the whole network.' },
        { icon: 'wifi-off', title: 'Remote workers create blind spots', description: 'When people work from home or travel, you have no visibility into what threats they face.' },
        { icon: 'eye-off', title: 'No alert when something goes wrong', description: 'You find out about security incidents days or weeks later, long after damage has been done.' }
    ],
    'advanced-email-security': [
        { icon: 'fish', title: 'Phishing emails reach inboxes', description: 'Realistic fake emails trick staff into clicking dangerous links or sharing passwords.' },
        { icon: 'mail-warning', title: 'Ransomware delivered by email', description: 'Attachments carry malware that can lock your files and demand payment to restore access.' },
        { icon: 'user-x', title: 'Emails impersonating your company', description: 'Attackers send emails pretending to be you, damaging your reputation with clients and suppliers.' }
    ],
    'zero-trust-architecture': [
        { icon: 'unlock', title: 'Too much internal access', description: 'Employees can access files and systems they do not need for their job, creating unnecessary risk.' },
        { icon: 'user-check', title: 'Weak or shared passwords', description: 'Accounts rely on simple passwords or one password used across multiple systems.' },
        { icon: 'network', title: 'No verification for internal traffic', description: 'Once inside the network, anything goes. An attacker or malware spreads without challenge.' }
    ],
    'disaster-recovery-business-continuity': [
        { icon: 'zap-off', title: 'No backup plan for outages', description: 'If power fails, a server crashes, or ransomware hits, your team cannot work and data may be gone.' },
        { icon: 'clock', title: 'Recovery takes days', description: 'When incidents happen, restoring systems takes so long the business loses significant revenue.' },
        { icon: 'archive-x', title: 'Backups exist but have never been tested', description: 'You have backups, but nobody knows if they actually work until it is too late.' }
    ],
    'continuous-vulnerability-scanning': [
        { icon: 'binoculars', title: 'You only find problems after an attack', description: 'Security gaps go unnoticed until a hacker exploits them and your data is already compromised.' },
        { icon: 'git-branch', title: 'New software creates new risks', description: 'Every software update or new tool can introduce vulnerabilities that are invisible without scanning.' },
        { icon: 'siren', title: 'No early warning system', description: 'There is no automated way to know when something is wrong before it becomes a serious incident.' }
    ],
    'gdpr-compliance-infrastructure': [
        { icon: 'file-warning', title: 'You handle personal data without proper controls', description: 'Customer and employee data is stored in ways that do not meet legal requirements.' },
        { icon: 'scale', title: 'Risk of fines', description: 'GDPR violations can result in significant penalties. Without the right infrastructure, you are exposed.' },
        { icon: 'clipboard-x', title: 'No audit trail for data access', description: 'You cannot show regulators or clients who accessed what data or when.' }
    ],
    'secure-network-vpn-setup': [
        { icon: 'wifi', title: 'Staff connect on unsecured networks', description: 'Remote workers use public Wi-Fi or home routers with no protection, exposing company data.' },
        { icon: 'split', title: 'No separation between office locations', description: 'Branch offices connect directly to the main network with no security boundaries between them.' },
        { icon: 'lock-open', title: 'Sensitive systems are reachable from anywhere', description: 'Without a VPN, internal tools and servers are exposed to the open internet.' }
    ],
    'it-support-monitoring': [
        { icon: 'phone-off', title: 'Support is slow when things break', description: 'When IT problems happen, nobody responds quickly and your team loses hours waiting for a fix.' },
        { icon: 'eye-off', title: 'Problems are invisible until users complain', description: 'There is no system watching your infrastructure 24/7 to catch issues before they affect your team.' },
        { icon: 'headphones', title: 'No dedicated IT contact', description: 'Staff have no clear person or service to call when they need help with a technology problem.' }
    ],
    'corporate-ai-infrastructure-setup': [
        { icon: 'shield-alert', title: 'Staff use public AI tools with company data', description: 'Employees paste sensitive internal documents into ChatGPT and similar tools with no oversight.' },
        { icon: 'git-merge', title: 'No AI integrated into your workflows', description: 'Your team uses AI as individuals with no connection to your actual business systems or processes.' },
        { icon: 'building-2', title: 'Generic AI does not know your business', description: 'Public tools have no knowledge of your products, clients, or internal processes, limiting their value.' }
    ],
    'on-premise-ai-setup': [
        { icon: 'cloud-off', title: 'Sensitive data cannot go to the cloud', description: 'Legal, financial, or industrial data that must stay on your servers cannot be used with public AI.' },
        { icon: 'server', title: 'Regulatory restrictions apply', description: 'Your industry or country has rules about where data can be processed and stored.' },
        { icon: 'wifi-off', title: 'No internet access in your environment', description: 'Air-gapped facilities or high-security environments cannot connect to external AI services.' }
    ],
    'ai-data-security-layer': [
        { icon: 'leak', title: 'Confidential data leaks into AI models', description: 'When staff use public AI tools, your client data and trade secrets may be used to train external systems.' },
        { icon: 'user-x', title: 'No policy enforcement', description: 'There is no technical barrier stopping employees from sending sensitive files to external AI platforms.' },
        { icon: 'eye', title: 'No visibility into AI usage', description: 'You have no way to see what your team is sharing with external AI tools or what risks that creates.' }
    ],
    'agentic-ai-development': [
        { icon: 'repeat', title: 'Repetitive tasks consume your team', description: 'Staff manually update records, send follow-ups, and process the same type of data entry every day.' },
        { icon: 'layers', title: 'Workflows span too many systems', description: 'A single process touches five different tools and requires manual steps between each one.' },
        { icon: 'clock', title: 'Delays cost you business', description: 'Slow human-driven processes mean leads go cold, approvals take too long, and deadlines are missed.' }
    ],
    'smart-factory-optimization': [
        { icon: 'activity', title: 'Machines sit idle without warning', description: 'You only know a machine has a problem when it has already stopped or produced defective output.' },
        { icon: 'zap', title: 'High energy costs with no clear reason', description: 'Energy consumption is high but there is no data to show what is consuming the most or when.' },
        { icon: 'bar-chart', title: 'Production planning is guesswork', description: 'Scheduling is based on experience rather than real data from your machines and production line.' }
    ],
    'sales-marketing-automation': [
        { icon: 'inbox', title: 'Inbound leads go cold', description: 'Leads come in but nobody follows up fast enough. By the time sales contacts them, the interest is gone.' },
        { icon: 'file-text', title: 'Proposals take too long to prepare', description: 'Assembling a proposal requires hours of manual work that delays the whole sales cycle.' },
        { icon: 'funnel', title: 'No clear view of your pipeline', description: 'You have no reliable way to see which leads are progressing and which have been forgotten.' }
    ],
    'customer-service-automation': [
        { icon: 'clock-3', title: 'Customers wait too long for answers', description: 'Simple questions about opening hours, order status, or pricing require a human to respond every time.' },
        { icon: 'headphones', title: 'Support team overwhelmed with routine queries', description: 'Your team spends most of the day answering the same questions instead of handling complex issues.' },
        { icon: 'moon', title: 'No support outside business hours', description: 'Customers from other time zones or urgent weekend needs get no response until the next working day.' }
    ],
    'data-silos-automation': [
        { icon: 'database-zap', title: 'Data lives in dozens of different places', description: 'Emails, spreadsheets, PDFs, and forms all contain different pieces of the same data with no connection.' },
        { icon: 'keyboard', title: 'Staff re-enter data manually', description: 'Information is typed into one system, then retyped into another. Mistakes are common and time is wasted.' },
        { icon: 'search-x', title: 'No single source of truth', description: 'Different departments have different versions of the same data, causing confusion and wrong decisions.' }
    ],
    'operational-load-reduction': [
        { icon: 'hourglass', title: 'Too much time on low-value work', description: 'Your team spends hours every day on tasks that do not require skill or judgment — just time.' },
        { icon: 'users', title: 'Headcount grows faster than revenue', description: 'As the business scales, the amount of manual work grows at the same rate as customer volume.' },
        { icon: 'frown', title: 'Good people are stuck doing bad work', description: 'Talented staff spend most of their time on paperwork and admin instead of the work they were hired to do.' }
    ],
    'custom-erp-crm-integrations': [
        { icon: 'plug-zap', title: 'Your tools do not talk to each other', description: 'Your CRM has one version of customer data, your accounting system has another. Neither is complete.' },
        { icon: 'copy', title: 'Same data entered in multiple systems', description: 'Every order, client, or invoice is entered by hand into two or three different platforms.' },
        { icon: 'alert-triangle', title: 'Errors from manual data transfer', description: 'When humans copy data between systems, mistakes happen. Wrong prices, wrong names, wrong addresses.' }
    ],
    'digital-engineering-rd-software': [
        { icon: 'calculator', title: 'Engineers rely on generic tools', description: 'Your team uses Excel or off-the-shelf software to do work that needs a custom calculation or simulation tool.' },
        { icon: 'timer', title: 'R&D processes are slow', description: 'Design iterations take longer than they should because the tools do not match the specific workflow.' },
        { icon: 'refresh-ccw', title: 'No way to automate test cycles', description: 'Every test run requires manual setup, making it hard to run experiments quickly at scale.' }
    ],
    'b2b-dealer-customer-portals': [
        { icon: 'phone', title: 'Dealers call for everything', description: 'Dealers and clients contact your team to check prices, availability, and order status multiple times a day.' },
        { icon: 'folders', title: 'Orders come in by email and phone', description: 'There is no system for clients to place orders themselves, so everything goes through your staff.' },
        { icon: 'user-cog', title: 'Account management is entirely manual', description: 'Updating customer details, raising invoices, and tracking service requests all happen by hand.' }
    ],
    'human-in-the-loop-ai-testing': [
        { icon: 'bot', title: 'Automated testing misses nuanced errors', description: 'Scripts and tools can check for obvious failures but miss context errors, tone problems, and edge cases.' },
        { icon: 'files', title: 'QA is a bottleneck before every release', description: 'Manual review of large datasets or content batches takes weeks, delaying projects and launches.' },
        { icon: 'x-circle', title: 'Mistakes reach clients', description: 'Without a robust review process, errors in data, content, or outputs damage your reputation.' }
    ],
    'legacy-system-modernization': [
        { icon: 'server-crash', title: 'Old software is slow and unreliable', description: 'Your system crashes, runs slowly, and is built on technology that vendors no longer support.' },
        { icon: 'lock', title: 'You cannot add new features', description: 'The existing system is so rigid that adding even small improvements takes months and huge cost.' },
        { icon: 'hard-drive', title: 'Data is trapped in an old format', description: 'Years of valuable business data sits inside a system that cannot easily export or connect to modern tools.' }
    ],
    'enterprise-bi-dashboards': [
        { icon: 'table-2', title: 'Reports live in spreadsheets', description: 'Every Monday someone manually pulls numbers from three systems and puts them into a spreadsheet.' },
        { icon: 'timer', title: 'Decisions wait for data', description: 'Managers ask for a number and get it two days later after someone has had time to run the report.' },
        { icon: 'puzzle', title: 'Data from different sources does not match', description: 'Sales says one revenue figure, finance says another. Nobody is sure which is correct.' }
    ],
    'internal-operational-applications': [
        { icon: 'clipboard-list', title: 'Field staff use paper', description: 'Technicians, delivery workers, or inspectors fill in paper forms that then have to be re-entered into a computer.' },
        { icon: 'wifi-off', title: 'No mobile access to company systems', description: 'Staff in the warehouse or on site cannot access the tools they need from their phone or tablet.' },
        { icon: 'layers-3', title: 'Fragmented tools for internal processes', description: 'Different departments use different apps that do not connect, creating gaps in operational data.' }
    ],
    'corporate-website-development': [
        { icon: 'turtle', title: 'Your website is slow', description: 'Pages take more than 3 seconds to load, losing visitors before they even see what you do.' },
        { icon: 'search', title: 'Visitors cannot find you', description: 'Your site does not rank in search results for the things your customers are looking for.' },
        { icon: 'mouse-pointer-x', title: 'No one takes action on your site', description: 'People visit but do not call, fill out a form, or enquire. The site does not convert visitors into leads.' }
    ],
    'mvp-development-corporate-spinoff': [
        { icon: 'piggy-bank', title: 'Afraid to invest before validating', description: 'You have a new business idea but do not want to build the full product before knowing users want it.' },
        { icon: 'clock', title: 'Time to market is too slow', description: 'By the time a full product is built, the market opportunity may have already moved on.' },
        { icon: 'git-fork', title: 'Hard to get budget for unproven ideas', description: 'Stakeholders want proof the idea works before committing resources to a full development cycle.' }
    ],
    'custom-data-architecture-database-design': [
        { icon: 'database-zap', title: 'Your data is a mess', description: 'Duplicate records, inconsistent formats, and missing values make your data unreliable for any serious use.' },
        { icon: 'ban', title: 'AI tools cannot use your data', description: 'You want to use AI but your data is too fragmented and unstructured to feed into any model.' },
        { icon: 'activity', title: 'Reports are slow and inaccurate', description: 'Queries take too long to run because the database was never designed for how it is actually being used.' }
    ]
};

const SERVICE_PROCESSES = {
    'ai-solutions': [
        { title: 'We review the business need', description: 'We start with the real business question instead of jumping to a random tool.' },
        { title: 'We make the next step clear', description: 'We turn the findings into a simple order of work the business can actually follow.' },
        { title: 'We help people use it well', description: 'We train the team and keep things practical from the start.' }
    ],
    'custom-software': [
        { title: 'We scope the work clearly', description: 'We make the delivery boundaries simple before we start building.' },
        { title: 'We build the working setup', description: 'We build the tool, the workflow, and the connections around it.' },
        { title: 'We support it after launch', description: 'We stay available to fix, improve, and clean up the work over time.' }
    ]
};

function buildGenericServiceBlueprint(service, lang = 'en') {
    const categoryMeta = getLocalizedCategoryMeta(service.category, lang);
    const categoryContentKey = service.category === 'custom-software' ? 'custom-software-development' : service.category;
    const categoryContent = serviceContent[categoryContentKey] && (serviceContent[categoryContentKey][lang] || serviceContent[categoryContentKey].en);
    if (!categoryMeta || !categoryContent) {
        return null;
    }

    const heroImageMap = {
        'ai-solutions': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        'custom-software': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80'
    };

    const heroDescription = stripServiceDescription(service.description_template || service.title_template || service.name);
    const normalizeBenefit = (item) => {
        if (typeof item === 'string') return parseBenefitText(item);
        if (item && typeof item === 'object') {
            return {
                title: item.title || '',
                description: item.description || ''
            };
        }
        return { title: '', description: '' };
    };
    const benefits = ((service.outcomes && service.outcomes.length ? service.outcomes : categoryContent.benefits || [])
        .map(normalizeBenefit))
        .filter(item => item.title || item.description);
    const faqItems = ((service.faq && service.faq.length ? service.faq : categoryContent.faq || [])).slice(0, 4);
    const serviceProblems = service.problems || SERVICE_PROBLEMS[service.id] || [];
    const processSteps = service.process_steps || SERVICE_PROCESSES[service.category] || SERVICE_PROCESSES['custom-software'];

    const rawSections = [
        // Section 1: Problems
        ...(serviceProblems.length > 0 ? [{
            type: 'problems',
            id: 'problems',
            sectionClass: 'bg-base-200',
            heading: 'Does this sound familiar?',
            intro: `These are the most common situations that lead companies to us for ${service.name.toLowerCase()}.`,
            problems: serviceProblems
        }] : []),
        // Section 2: What we cover
        {
            type: 'cards',
            id: 'capabilities',
            sectionClass: 'bg-base-100',
            heading: 'What you get',
            intro: heroDescription,
            gridClass: 'md:grid-cols-2',
            cards: [
                { title: 'What this service is', description: heroDescription, borderClass: 'border-primary' },
                { title: 'How you buy it', description: service.commercial_model || 'We scope the work around the business need.', borderClass: 'border-secondary' },
                { title: 'Starting price', description: service.starting_price || 'Custom quote', borderClass: 'border-accent' },
                { title: 'Good fit if', description: service.good_fit || `You need ${service.name.toLowerCase()} done properly, in plain English, with no wasted motion.`, borderClass: 'border-neutral' }
            ]
        },
        // Section 3: Benefits / Why choose us
        {
            type: 'split',
            id: 'why-it-matters',
            sectionClass: 'bg-base-200',
            heading: 'What changes when this is in place',
            intro: `The practical difference ${service.name.toLowerCase()} makes once it is working properly.`,
            bullets: benefits.slice(0, 3).map((item, index) => ({
                icon: ['shield-check', 'clock-3', 'layers-3'][index] || 'check',
                title: item.title,
                description: item.description
            })),
            image: heroImageMap[service.category] || heroImageMap['custom-software'],
            alt: service.name
        },
        // Section 4: Process
        {
            type: 'process',
            id: 'process',
            sectionClass: 'bg-base-100',
            heading: 'How we work',
            intro: 'A straightforward process with no surprises.',
            steps: processSteps
        },
        // Section 5: FAQ
        {
            type: 'faq',
            id: 'faq',
            sectionClass: 'bg-base-200',
            heading: 'Common questions',
            intro: `Answers to what companies usually ask before getting started with ${service.name.toLowerCase()}.`,
            items: faqItems
        }
    ];

    if (service.id === 'ai-plan') {
        rawSections.splice(2, 0, {
            type: 'html',
            html: buildAiPlanDiagramSection()
        });
    }

    const renderedSections = rawSections.map(section => {
        if (section.type === 'problems') return renderSolutionProblemsSection(section);
        if (section.type === 'cards') return renderSolutionCardsSection(section);
        if (section.type === 'split') return renderSolutionSplitSection(section);
        if (section.type === 'process') return renderSolutionProcessSection(section);
        if (section.type === 'faq') return renderSolutionFaqSection(section);
        if (section.type === 'html') return renderSolutionHtmlSection(section);
        return '';
    });

    const ctaObj = {
        heading: `Ready to start with ${service.name}?`,
        description: `We can scope ${service.name.toLowerCase()} in plain English and help you start with the part that matters most.`,
        buttonText: 'Talk to us'
    };

    return {
        hero: {
            badge: service.badge || categoryMeta.label,
            titlePrefix: service.name,
            titleSuffix: '',
            description: heroDescription,
            image: heroImageMap[service.category] || heroImageMap['custom-software'],
            alt: service.name,
            primaryCtaText: 'Get in touch',
            primaryCtaLink: 'contact.html',
            secondaryCtaText: 'See all solutions',
            secondaryCtaLink: 'solutions.html'
        },
        section_1: renderedSections[0] || '',
        section_2: renderedSections[1] || '',
        section_3: renderedSections[2] || '',
        section_4: renderedSections[3] || '',
        section_5: renderedSections[4] || '',
        section_6: renderedSections[5] || '',
        cta: renderSolutionPageCTA(ctaObj),
        category: service.category
    };
}

const LEGACY_LEAD_GEN_AGENCY = ['b2b', 'lead', 'generation', 'agency'].join('-');

const LEGACY_REDIRECT_ONLY_PAGES = new Set([
    'managed-it-services',
    'ai-content-infrastructure',
    'custom-software-development',
    'services',
    'case-studies',
    LEGACY_LEAD_GEN_AGENCY,
    'crm-management',
    'fractional-bizdev-team',
    'inbound-lead-generation',
    'outbound-lead-generation',
    'outbound-marketing-agency',
    'lead-generation-service',
    'prospect-finding-service',
    'appointment-setting-service',
    'cold-email-agency',
    'sales-protection-services',
    'outsourced-sales-team-service',
    'email-automation',
    'email-marketing-management',
    'speed-to-lead',
    'secure-email-workplace-setup',
    'schutzdienstleistungen',
    'export-marketing-consulting',
    'international-market-entry',
    'distributor-finding',
    'overseas-sales-consulting',
    'europe-market-entry',
    'corporate-digital-gifting',
    'usa-pr-service',
    'market-foundation-program',
    'market-accelerator-program',
    'part-time-lead-generation-team'
]);

const LEGACY_REDIRECT_TARGETS = {
    'managed-it-services': 'solutions',
    'ai-content-infrastructure': 'solutions',
    'custom-software-development': 'solutions',
    'services': 'solutions',
    'case-studies': 'solutions',
    [LEGACY_LEAD_GEN_AGENCY]: 'solutions',
    'crm-management': 'custom-software-development',
    'fractional-bizdev-team': 'solutions',
    'inbound-lead-generation': 'solutions',
    'outbound-lead-generation': 'solutions',
    'outbound-marketing-agency': 'solutions',
    'lead-generation-service': 'solutions',
    'prospect-finding-service': 'solutions',
    'appointment-setting-service': 'solutions',
    'cold-email-agency': 'solutions',
    'sales-protection-services': 'solutions',
    'outsourced-sales-team-service': 'solutions',
    'email-automation': 'ai-content-infrastructure',
    'email-marketing-management': 'ai-content-infrastructure',
    'speed-to-lead': 'solutions',
    'secure-email-workplace-setup': 'solutions',
    'schutzdienstleistungen': 'managed-it-services',
    'export-marketing-consulting': 'solutions',
    'international-market-entry': 'solutions',
    'distributor-finding': 'solutions',
    'overseas-sales-consulting': 'solutions',
    'europe-market-entry': 'solutions',
    'corporate-digital-gifting': 'solutions',
    'usa-pr-service': 'solutions',
    'market-foundation-program': 'solutions',
    'market-accelerator-program': 'solutions',
    'part-time-lead-generation-team': 'solutions'
};

const LEGACY_DELETED_SERVICE_PAGES = new Set([
  "agentic-ai-development",
  "ai-data-security-layer",
  "ai-creative-studio",
  "corporate-ai-infrastructure-setup",
  "customer-service-automation",
  "data-silos-automation",
  "b2b-dealer-customer-portals",
  "appointment-setting-service",
  "cold-email-agency",
  "cold-email-infrastructure",
  "corporate-digital-gifting",
  "corporate-website-development",
  "crm-management",
  "custom-data-architecture-database-design",
  "custom-erp-crm-integrations",
  "distributor-finding",
  "digital-engineering-rd-software",
  "email-automation",
  "email-deliverability-checkup",
  "email-marketing-management",
  "email-security",
  "enterprise-bi-dashboards",
  "europe-market-entry",
  "export-marketing-consulting",
  "fractional-bizdev-team",
  "growth-programs",
  "human-in-the-loop-ai-testing",
  "image-content-engine",
  "inbound-lead-generation",
  "internal-operational-applications",
  "international-market-entry",
  "legacy-system-modernization",
  "lead-generation-service",
  "lead-generation-services",
  "lost-lead-reactivation",
  "managed-services",
  "market-accelerator-program",
  "market-foundation-program",
  "markt-beschleuniger-programm",
  "markt-grundlagen-programm",
  "mvp-development-corporate-spinoff",
  "on-premise-ai-setup",
  "onboarding",
  "operational-load-reduction",
  "unternehmens-digitale-geschenke",
  "outbound-lead-generation",
  "outbound-marketing-agency",
  "outreach-software-management",
  "outsourced-sales-team-service",
  "overseas-sales-consulting",
  "part-time-lead-generation-team",
  "prospect-finding-service",
  "recruitment",
  "revops-crm-setup",
  "revops-infrastructure",
  "sales-development-agency",
  "sales-marketing-automation",
  "sales-protection-services",
  "schutzdienstleistungen",
  "secure-email-workplace-setup",
  "smart-factory-optimization",
  "speed-to-lead",
  "teilzeit-bizdev-team",
  "turnkey-growth-infrastructure",
  "turnkey-it-infrastructure",
  "usa-pr-dienst",
  "usa-pr-service",
  "verified-lead-list",
  "video-content-engine",
  "vulnerability-assessments",
  "website-care-plans",
  "website-care-services",
  "written-content-engine"
]);
const LEGACY_DELETED_SERVICE_TARGETS = {
  "agentic-ai-development": "solutions",
  "ai-data-security-layer": "solutions",
  "ai-creative-studio": "ai-content-infrastructure",
  "appointment-setting-service": "solutions",
  "b2b-dealer-customer-portals": "solutions",
  "cold-email-agency": "solutions",
  "cold-email-infrastructure": "solutions",
  "corporate-ai-infrastructure-setup": "solutions",
  "corporate-digital-gifting": "solutions",
  "corporate-website-development": "solutions",
  "crm-management": "custom-software-development",
  "custom-data-architecture-database-design": "solutions",
  "custom-erp-crm-integrations": "solutions",
  "customer-service-automation": "solutions",
  "data-silos-automation": "solutions",
  "distributor-finding": "solutions",
  "digital-engineering-rd-software": "solutions",
  "email-automation": "solutions",
  "email-deliverability-checkup": "solutions",
  "email-marketing-management": "solutions",
  "email-security": "solutions",
  "enterprise-bi-dashboards": "solutions",
  "europe-market-entry": "solutions",
  "export-marketing-consulting": "solutions",
  "fractional-bizdev-team": "solutions",
  "growth-programs": "solutions",
  "image-content-engine": "ai-content-infrastructure",
  "inbound-lead-generation": "solutions",
  "internal-operational-applications": "solutions",
  "international-market-entry": "solutions",
  "legacy-system-modernization": "solutions",
  "lead-generation-service": "solutions",
  "lead-generation-services": "solutions",
  "lost-lead-reactivation": "ai-content-infrastructure",
  "managed-services": "solutions",
  "market-accelerator-program": "solutions",
  "market-foundation-program": "solutions",
  "markt-beschleuniger-programm": "solutions",
  "markt-grundlagen-programm": "solutions",
  "onboarding": "solutions",
  "on-premise-ai-setup": "solutions",
  "operational-load-reduction": "solutions",
  "unternehmens-digitale-geschenke": "solutions",
  "outbound-lead-generation": "solutions",
  "outbound-marketing-agency": "solutions",
  "outreach-software-management": "solutions",
  "outsourced-sales-team-service": "solutions",
  "overseas-sales-consulting": "solutions",
  "part-time-lead-generation-team": "solutions",
  "prospect-finding-service": "solutions",
  "recruitment": "solutions",
  "revops-crm-setup": "ai-content-infrastructure",
  "revops-infrastructure": "ai-content-infrastructure",
  "sales-development-agency": "solutions",
  "sales-marketing-automation": "solutions",
  "sales-protection-services": "solutions",
  "schutzdienstleistungen": "solutions",
  "secure-email-workplace-setup": "solutions",
  "smart-factory-optimization": "solutions",
  "speed-to-lead": "solutions",
  "teilzeit-bizdev-team": "solutions",
  "turnkey-growth-infrastructure": "solutions",
  "turnkey-it-infrastructure": "solutions",
  "usa-pr-dienst": "solutions",
  "usa-pr-service": "solutions",
  "verified-lead-list": "ai-content-infrastructure",
  "video-content-engine": "ai-content-infrastructure",
  "vulnerability-assessments": "solutions",
  "website-care-plans": "solutions",
  "website-care-services": "solutions",
  "written-content-engine": "ai-content-infrastructure"
};
LEGACY_DELETED_SERVICE_PAGES.forEach((page) => LEGACY_REDIRECT_ONLY_PAGES.add(page));
Object.entries(LEGACY_DELETED_SERVICE_TARGETS).forEach(([source, target]) => {
    LEGACY_REDIRECT_TARGETS[source] = target;
});
Object.keys(LEGACY_REDIRECT_TARGETS).forEach((source) => {
    if (source !== 'solutions') {
        LEGACY_REDIRECT_TARGETS[source] = 'solutions';
    }
});
delete LEGACY_REDIRECT_TARGETS.solutions;

const REACTIVATED_SERVICE_PAGES = [];

REACTIVATED_SERVICE_PAGES.forEach((slug) => {
    LEGACY_REDIRECT_ONLY_PAGES.delete(slug);
    delete LEGACY_REDIRECT_TARGETS[slug];
});

const DECOMMISSIONED_IT_SERVICE_PAGES = [
    'microsoft-365-workspace-management',
    'cloud-architecture-azure-transition',
    'endpoint-security',
    'advanced-email-security',
    'zero-trust-architecture',
    'disaster-recovery-business-continuity',
    'continuous-vulnerability-scanning',
    'gdpr-compliance-infrastructure',
    'secure-network-vpn-setup',
    'it-support-monitoring'
];

DECOMMISSIONED_IT_SERVICE_PAGES.forEach((slug) => {
    LEGACY_REDIRECT_ONLY_PAGES.add(slug);
    LEGACY_REDIRECT_TARGETS[slug] = 'solutions';
});

const RETIRED_CITY_SLUGS = new Set([
    'south-gloucestershire',
    'north-lanarkshire',
    'south-lanarkshire',
    'rhondda-cynon-taf',
    ...EAST_OF_ANKARA_CITY_SLUGS,
    ...RETIRED_LOW_POP_CITY_SLUGS,
    ...RETIRED_EASTERN_EUROPE_CITY_SLUGS,
    ...RETIRED_CONSERVATIVE_TRIM_CITY_SLUGS
]);
const RETIRED_CITY_REDIRECT_TARGET = 'city-locations';

const LEGACY_CATEGORY_ANCHORS = {
    'managed-it-services': '',
    'vulnerability-assessments': '',
    'email-security': '',
    'website-care-plans': '#custom-software',
    'website-care-services': '#custom-software',
    'revops-crm-setup': '#custom-software',
    'ai-content-infrastructure': '#ai-solutions',
    'custom-software-development': '#custom-software',
    'b2b-dealer-customer-portals': '#custom-software',
    'corporate-website-development': '#custom-software',
    'custom-data-architecture-database-design': '#custom-software',
    'custom-erp-crm-integrations': '#custom-software',
    'digital-engineering-rd-software': '#custom-software',
    'enterprise-bi-dashboards': '#custom-software',
    'human-in-the-loop-ai-testing': '#custom-software',
    'internal-operational-applications': '#custom-software',
    'legacy-system-modernization': '#custom-software',
    'mvp-development-corporate-spinoff': '#custom-software'
};

function applyLanguageSwitcherLinks(markup, links) {
    const resultLinks = {
        en: links.en || '#',
        tr: links.tr || '#',
        de: links.de || '#',
        fr: links.fr || '#'
    };

    return markup
        .replace(/href=["'][^"']*["']\s+data-lang="en"/g, `href="${resultLinks.en}" data-lang="en"`)
        .replace(/href=["'][^"']*["']\s+data-lang="tr"/g, `href="${resultLinks.tr}" data-lang="tr"`)
        .replace(/href=["'][^"']*["']\s+data-lang="de"/g, `href="${resultLinks.de}" data-lang="de"`)
        .replace(/href=["'][^"']*["']\s+data-lang="fr"/g, `href="${resultLinks.fr}" data-lang="fr"`);
}

function rewriteLegacyHrefTargets(html) {
    return html.replace(/href=(["'])([^"']+)\1/g, (match, quote, url) => {
        if (/^(#|mailto:|tel:|javascript:|https?:\/\/)/i.test(url)) {
            return match;
        }

        const [pathPart, hashPart] = url.split('#');
        const [pathname, query] = pathPart.split('?');
        if (!pathname || !pathname.endsWith('.html')) {
            return match;
        }

        const slashIndex = pathname.lastIndexOf('/');
        const prefix = slashIndex >= 0 ? pathname.slice(0, slashIndex + 1) : '';
        const fileName = slashIndex >= 0 ? pathname.slice(slashIndex + 1) : pathname;
        const slug = fileName.replace(/\.html$/, '');

        if (!LEGACY_REDIRECT_ONLY_PAGES.has(slug)) {
            return match;
        }

        const anchor = LEGACY_CATEGORY_ANCHORS[slug] || '';
        const nextPath = `${prefix}solutions.html${anchor}`;
        const nextUrl = query ? `${nextPath}?${query}` : nextPath;
        const preserveHash = anchor ? '' : (hashPart ? `#${hashPart}` : '');
        return `href=${quote}${nextUrl}${preserveHash}${quote}`;
    });
}

const serviceMapping = {
    'managed-it-services': 'it-solutions',
    'email-security': 'it-solutions',
    'turnkey-it-infrastructure': 'it-solutions',
    'ai-content-infrastructure': 'ai-solutions',
    'website-care-plans': 'custom-software',
    'vulnerability-assessments': 'it-solutions',
    'revops-crm-setup': 'custom-software',
    'lost-lead-reactivation': 'ai-solutions',
    'ai-creative-studio': 'ai-solutions',
    'recruitment': 'custom-software',
    'market-foundation-program': 'custom-software',
    'market-accelerator-program': 'custom-software',
    'part-time-lead-generation-team': 'custom-software',
    'lead-generation-service': 'custom-software',
    'custom-software-development': 'custom-software'
};

function getHreflangUrls(templateName) {
    if (services.some(service => service.id === templateName)) {
        const enPath = `${templateName}.html`;
        return {
            en: enPath,
            de: enPath,
            fr: enPath
        };
    }

    const urls = {
        'index': { en: '', de: 'de/', fr: 'fr/' },
        'solutions': { en: 'solutions.html', de: 'de/solutions.html', fr: 'fr/solutions.html' },
        'about': { en: 'about.html', de: 'de/about.html', fr: 'fr/about.html' },
        'our-business-model': { en: 'our-business-model.html', de: 'de/our-business-model.html', fr: 'fr/our-business-model.html' },
        'contact': { en: 'contact.html', de: 'de/contact.html', fr: 'fr/contact.html' },

        'managed-it-services': { en: 'managed-it-services.html', de: 'de/managed-it-services.html', fr: 'fr/managed-it-services.html' },
        'turnkey-it-infrastructure': { en: 'solutions.html', de: 'de/solutions.html', fr: 'fr/solutions.html' },
        'ai-content-infrastructure': { en: 'ai-content-infrastructure.html', de: 'de/ai-content-infrastructure.html', fr: 'fr/ai-content-infrastructure.html' },
        'turnkey-growth-infrastructure': { en: 'solutions.html', de: 'de/solutions.html', fr: 'fr/solutions.html' },
        'custom-software-development': { en: 'custom-software-development.html', de: 'de/custom-software-development.html', fr: 'fr/custom-software-development.html' },
        'vulnerability-assessments': { en: 'vulnerability-assessments.html', de: 'de/vulnerability-assessments.html', fr: 'fr/vulnerability-assessments.html' },
        'email-security': { en: 'email-security.html', de: 'de/email-security.html', fr: 'fr/email-security.html' },
        'website-care-plans': { en: 'website-care-plans.html', de: 'de/website-care-plans.html', fr: 'fr/website-care-plans.html' },
        'revops-crm-setup': { en: 'revops-crm-setup.html', de: 'de/revops-crm-setup.html', fr: 'fr/revops-crm-setup.html' },
        'lost-lead-reactivation': { en: 'lost-lead-reactivation.html', de: 'de/lost-lead-reactivation.html', fr: 'fr/lost-lead-reactivation.html' },
        'speed-to-lead': { en: 'speed-to-lead.html', de: 'de/speed-to-lead.html', fr: 'fr/speed-to-lead.html' },
        'recruitment': { en: 'recruitment.html', de: 'de/recruitment.html', fr: 'fr/recruitment.html' },
        'ai-creative-studio': { en: 'ai-creative-studio.html', de: 'de/ai-creative-studio.html', fr: 'fr/ai-creative-studio.html' },
        'city-locations': { en: 'city-locations.html', de: 'de/city-locations.html', fr: 'fr/city-locations.html' },
        'blog-index': { en: 'blog/index.html', de: 'blog/index.html', fr: 'blog/index.html' },
        'vision-mission': { en: 'vision-mission.html', de: 'de/vision-mission.html', fr: 'fr/vision-mission.html' },
        'vizyon-misyon': { en: 'vision-mission.html', de: 'de/vision-mission.html', fr: 'fr/vision-mission.html' },
        'our-ethical-principles': { en: 'our-ethical-principles.html', de: 'de/our-ethical-principles.html', fr: 'fr/our-ethical-principles.html' },
        'etik-ilkelerimiz': { en: 'our-ethical-principles.html', de: 'de/our-ethical-principles.html', fr: 'fr/our-ethical-principles.html' },
        'market-foundation-program': { en: 'market-foundation-program.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'pazar-temeli-programi': { en: 'market-foundation-program.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'markt-grundlagen-programm': { en: 'market-foundation-program.html', de: 'de/markt-grundlagen-programm.html', fr: 'fr/market-foundation-program.html' },
        'market-accelerator-program': { en: 'market-accelerator-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'pazar-hizlandirici-program': { en: 'market-accelerator-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'markt-beschleuniger-programm': { en: 'market-accelerator-program.html', de: 'de/markt-beschleuniger-programm.html', fr: 'fr/market-accelerator-program.html' },
        'part-time-lead-generation-team': { en: 'part-time-lead-generation-team.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'kismi-is-gelistirme-ekibi': { en: 'part-time-lead-generation-team.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'teilzeit-bizdev-team': { en: 'part-time-lead-generation-team.html', de: 'de/teilzeit-bizdev-team.html', fr: 'fr/part-time-lead-generation-team.html' },
        'abd-pr-hizmeti': { en: 'usa-pr-service.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' },
        'corporate-digital-gifting': { en: 'corporate-digital-gifting.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'usa-pr-service': { en: 'usa-pr-service.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' },
        'kurumsal-dijital-hediye-promosyon': { en: 'corporate-digital-gifting.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'unternehmens-digitale-geschenke': { en: 'corporate-digital-gifting.html', de: 'de/unternehmens-digitale-geschenke.html', fr: 'fr/corporate-digital-gifting.html' },
        'usa-pr-dienst': { en: 'usa-pr-service.html', de: 'de/usa-pr-dienst.html', fr: 'fr/usa-pr-service.html' },
        'international-market-entry': { en: 'international-market-entry.html', de: 'de/international-market-entry.html', fr: 'fr/international-market-entry.html' }
    };
    const resolved = urls[templateName] || urls['index'];
    const enPath = resolved.en || '';
    return {
        en: enPath,
        de: enPath,
        fr: enPath
    };
}

function getActiveStates(templateName) {
    const activeStates = {
        'index': { 'HOME_ACTIVE': 'text-primary', 'HOME_MOBILE_ACTIVE': 'class="font-semibold text-primary"' },
        'our-business-model': {},
        'solutions': { 'SOLUTIONS_ACTIVE': 'text-primary', 'SOLUTIONS_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'SOLUTIONS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'about': { 'COMPANY_ACTIVE': 'text-primary', 'ABOUT_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'ABOUT_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'contact': { 'COMPANY_ACTIVE': 'text-primary', 'CONTACT_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'CONTACT_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },

        'vision-mission': { 'COMPANY_ACTIVE': 'text-primary', 'VISION_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'VISION_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'our-ethical-principles': { 'COMPANY_ACTIVE': 'text-primary', 'ETHICS_MOBILE_ACTIVE': 'class="font-semibold text-primary"', 'ETHICS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20' },
        'city-locations': { 'SOLUTIONS_ACTIVE': 'text-primary' }
    };
    return activeStates[templateName] || activeStates['index'];
}

function buildPage(templateName, outputName, lang = 'en') {
    if (LEGACY_REDIRECT_ONLY_PAGES.has(templateName)) {
        return;
    }

    const templateDir = lang === 'de' || lang === 'fr' ? `templates/${lang}/` : 'templates/';
    let templatePath = `${templateDir}${templateName}.html`;
    const nativeLocalizedTemplates = new Set([
        'index',
        'solutions',
        'managed-it-services',
        'turnkey-it-infrastructure',
        'ai-content-infrastructure',
        'custom-software-development',
        'city-locations'
    ]);
    const forceEnglishTemplates = new Set([
        'index',
        'solutions',
        'managed-it-services',
        'email-security',
        'turnkey-growth-infrastructure',
        'blog-index'
    ]);

    if ((lang === 'de' || lang === 'fr') && forceEnglishTemplates.has(templateName)) {
        // Use the English source template for these core pages so the updated taxonomy
        // stays centralized and the translation pass can keep localized pages in sync.
        templatePath = `templates/${templateName}.html`;
    }

    let filePath = templatePath;
    if (!fs.existsSync(templatePath)) {
        const fallbackPath = `templates/${templateName}.html`;
        if (!fs.existsSync(fallbackPath)) {
            console.warn(`Template not found: ${templatePath}`);
            return;
        }
        filePath = fallbackPath;
    }

    const rawTemplateContent = fs.readFileSync(filePath, 'utf8');
    const res = extractAndRemoveSchemas(rawTemplateContent, filePath);
    let content = res.cleanContent;
    const extractedSchemas = res.extractedSchemas;

    let htmlTemplate = createHTMLTemplate(lang);
    let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
    let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

    // Clean up data-i18n attributes as we handle translation on build
    content = content.replace(/\s*data-i18n="[^"]*"/g, '');
    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

    // Calculate dynamic base path based on output depth
    const depth = outputName.split('/').length - 1;
    let relativePrefix = '';
    for (let i = 0; i < depth; i++) {
        relativePrefix += '../';
    }
    const navPath = relativePrefix || './';

    if (lang !== 'en') {
        relativePrefix += '../';
    }
    const basePath = relativePrefix || './';

    const logoPath = basePath + 'go-expandia-logo.png';
    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
    const turkishServicesPath = './';

    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);

    // Language specific logic 
    if (lang === 'de') {
        pageNavigation = applyTranslations(pageNavigation, 'de');
        pageFooter = applyTranslations(pageFooter, 'de');
        if (!nativeLocalizedTemplates.has(templateName)) {
            content = applyTranslations(content, 'de');
        }
        pageNavigation = pageNavigation.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
    } else if (lang === 'fr') {
        pageNavigation = applyTranslations(pageNavigation, 'fr');
        pageFooter = applyTranslations(pageFooter, 'fr');
        if (!nativeLocalizedTemplates.has(templateName)) {
            content = applyTranslations(content, 'fr');
        }
        pageNavigation = pageNavigation.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
    }

    // Flag logic
    const currentFlag = lang === 'tr' ? 'TR' : lang === 'de' ? 'DE' : lang === 'fr' ? 'FR' : 'EN';
    pageNavigation = pageNavigation.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">${currentFlag}</span>`);

    // Get active states for navigation
    const activeStates = getActiveStates(templateName);
    for (const [key, value] of Object.entries(activeStates)) {
        pageNavigation = pageNavigation.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    // Hreflang logic for switcher
    const hrefUrls = getHreflangUrls(templateName);
    const relPrefix = outputName.includes('/')
        ? '../'.repeat(outputName.split('/').length - 1)
        : (lang === 'en' ? './' : '../');
    let enLink = hrefUrls.en || 'index.html';
    if (enLink === '') enLink = 'index.html';
    let trLink = hrefUrls.tr || 'tr/index.html';
    if (trLink.endsWith('/')) trLink += 'index.html';
    let deLink = hrefUrls.de || 'index.html';
    if (deLink.endsWith('/')) deLink += 'index.html';
    let frLink = hrefUrls.fr || 'index.html';
    if (frLink.endsWith('/')) frLink += 'index.html';
    pageNavigation = applyLanguageSwitcherLinks(pageNavigation, {
        en: `${relPrefix}${enLink}`,
        tr: `${relPrefix}${trLink}`,
        de: `${relPrefix}${deLink}`,
        fr: `${relPrefix}${frLink}`
    });

    htmlTemplate = htmlTemplate.split('{{NAVIGATION}}').join(pageNavigation);
    htmlTemplate = htmlTemplate.split('{{MAIN_CONTENT}}').join(content);
    htmlTemplate = htmlTemplate.split('{{FOOTER}}').join(pageFooter);

    const pageMetadata = getPageMetadata(templateName, lang);
    const canonicalUrl = lang === 'en' ? `https://www.goexpandia.com/${outputName}.html` : `https://www.goexpandia.com/${lang}/${outputName}.html`;

    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);

    // Schema - Aggregated
    const orgSchema = generateOrganizationSchema();
    let finalSchemas = [orgSchema];

    // Add dynamic FAQ/Service schema if this is a mapped service page
    const serviceKey = serviceMapping[templateName];
    if (serviceKey && serviceContent[serviceKey] && serviceContent[serviceKey][lang]) {
        const sData = serviceContent[serviceKey][lang];

        // Add Service Schema (reference Organization by name, not nested object)
        finalSchemas.push({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": pageMetadata.title.split('|')[0].trim(),
            "provider": "Go Expandia",
            "description": pageMetadata.description
        });

        if (sData.faq && sData.faq.length > 0) {
            finalSchemas.push({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": sData.faq.map(f => {
                    let question = f.q;
                    let answer = f.a;

                    // Root page cleanup: remove specific mentions of "for {{CITY}}" or "in {{CITY}}"
                    question = question.replace(/\s(for|in|at|across)\s\{\{CITY_NAME\}\}/gi, '')
                        .replace(/\s(in|across)\s\{\{COUNTRY_NAME\}\}/gi, '');
                    answer = answer.replace(/\s(for|in|at|across)\s\{\{CITY_NAME\}\}/gi, '')
                        .replace(/\s(in|across)\s\{\{COUNTRY_NAME\}\}/gi, '');

                    // Final fallback replacements just in case
                    question = question.replace(/\{\{CITY_NAME\}\}/g, 'your business').replace(/\{\{COUNTRY_NAME\}\}/g, 'your region');
                    answer = answer.replace(/\{\{CITY_NAME\}\}/g, 'your business').replace(/\{\{COUNTRY_NAME\}\}/g, 'your region');

                    return {
                        "@type": "Question",
                        "name": question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": answer
                        }
                    };
                })
            });
        }
    }

    extractedSchemas.forEach(s => {
        const schemas = s["@graph"] ? s["@graph"] : [s];

        schemas.forEach(item => {
            // Deduplicate Organization - but check if it's nested in a Service provider
            if (item["@type"] === "Organization" && (item.name === "Go Expandia" || item.url === "https://www.goexpandia.com")) {
                // Skip standalone Organization schemas, but Service schemas with nested Org are OK
                return;
            }

            // For Service schemas, check if they have a nested Organization provider
            // If so, we keep the Service but don't separately add the Organization
            if (item["@type"] === "Service") {
                // If we already generated a Service dynamically, skip this extracted one
                if (serviceKey) {
                    return;
                }
                // Keep the Service schema as-is (with its nested Organization provider)
                finalSchemas.push(item);
                return;
            }

            // Deduplicate FAQPage if we already have one from dynamic logic
            if (item["@type"] === "FAQPage" && serviceKey) {
                return;
            }

            finalSchemas.push(item);
        });
    });

    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(finalSchemas, null, 2));

    // Hreflang Tags in HEAD
    const hreflangUrls2 = getHreflangUrls(templateName);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, hreflangUrls2.en);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, '');
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, hreflangUrls2.de);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, hreflangUrls2.fr);


    // Dynamic Blog Index Injection
    if (templateName === 'blog-index') {
        const newArticles = blogTopics.map(topic => ({
            title: topic.title[lang] || topic.title['en'],
            tags: `${topic.serviceId} business b2b`,
            url: `${topic.slug}.html`,
            excerpt: topic.title[lang] || topic.title['en'], // Simplified excerpt
            badge: "New",
            readTime: "5 min read"
        }));

        const featuredPlaybookUrls = new Set([
            'ai-governance-operating-model-playbook.html',
            'ai-service-desk-copilot-playbook.html',
            'ai-change-management-adoption-playbook.html',
            'enterprise-rag-knowledge-ops-playbook.html',
            'ai-finops-cost-control-playbook.html',
            'zero-trust-identity-management-playbook.html',
            'incident-response-automation-itops-playbook.html',
            'microsoft-365-device-security-playbook.html',
            'it-service-management-modernization-playbook.html'
        ]);

        const isLeadGenerationArticle = (article) => {
            const haystack = `${article.title || ''} ${article.url || ''} ${article.tags || ''} ${article.excerpt || ''}`.toLowerCase();
            return (
                haystack.includes('lead generation') ||
                haystack.includes('lead-gen') ||
                haystack.includes('lead scoring') ||
                haystack.includes('speed-to-lead') ||
                haystack.includes('pipeline generation')
            );
        };

        // Keep new AI/IT management playbooks first and remove lead-generation focused posts.
        const filteredNewArticles = newArticles.filter(
            article => !isLeadGenerationArticle(article) && !featuredPlaybookUrls.has(article.url)
        );
        const filteredLegacyArticles = legacyBlogPosts.filter(article => !isLeadGenerationArticle(article));
        const combinedArticles = [...filteredNewArticles, ...filteredLegacyArticles];

        htmlTemplate = htmlTemplate.replace('{{BLOG_ARTICLES_JSON}}', JSON.stringify(combinedArticles));
    }

    htmlTemplate = rewriteLegacyHrefTargets(htmlTemplate);

    let outputPath = lang === 'en' ? `${outputName}.html` : `${lang}/${outputName}.html`;
    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
    console.log(`✅ Built ${outputPath}`);
}

function buildSolutionPage(templateName, outputName, lang = 'en') {
    if (LEGACY_REDIRECT_ONLY_PAGES.has(templateName)) {
        return;
    }

    const service = services.find((item) => item.id === templateName);
    const blueprint = buildSolutionPageContent(templateName) || (service ? buildGenericServiceBlueprint(service, lang) : null);
    if (!blueprint) {
        console.warn(`Solution page blueprint not found for ${templateName}`);
        return;
    }

    const templatePath = 'templates/solution-page.html';
    if (!fs.existsSync(templatePath)) {
        console.warn(`Solution page template not found: ${templatePath}`);
        return;
    }

    const rawTemplateContent = fs.readFileSync(templatePath, 'utf8');
    const res = extractAndRemoveSchemas(rawTemplateContent, templatePath);
    let content = res.cleanContent;
    const extractedSchemas = res.extractedSchemas;

    let htmlTemplate = createHTMLTemplate(lang);
    let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
    let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

    content = content.replace(/\s*data-i18n="[^"]*"/g, '');
    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

    const depth = outputName.split('/').length - 1;
    let relativePrefix = '';
    for (let i = 0; i < depth; i++) {
        relativePrefix += '../';
    }
    const navPath = relativePrefix || './';

    if (lang !== 'en') {
        relativePrefix += '../';
    }
    const basePath = relativePrefix || './';
    const logoPath = basePath + 'go-expandia-logo.png';

    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, './');
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, navPath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, './');
    content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);

    content = content
        .replace(/\{\{HERO_BADGE\}\}/g, blueprint.hero.badge)
        .replace(/\{\{HERO_TITLE_PREFIX\}\}/g, blueprint.hero.titlePrefix)
        .replace(/\{\{HERO_TITLE_SUFFIX\}\}/g, blueprint.hero.titleSuffix)
        .replace(/\{\{HERO_DESCRIPTION\}\}/g, blueprint.hero.description)
        .replace(/\{\{PRIMARY_CTA_TEXT\}\}/g, blueprint.hero.primaryCtaText)
        .replace(/\{\{PRIMARY_CTA_LINK\}\}/g, blueprint.hero.primaryCtaLink)
        .replace(/\{\{SECONDARY_CTA_TEXT\}\}/g, blueprint.hero.secondaryCtaText)
        .replace(/\{\{SECONDARY_CTA_LINK\}\}/g, blueprint.hero.secondaryCtaLink)
        .replace(/\{\{HERO_IMAGE\}\}/g, blueprint.hero.image)
        .replace(/\{\{HERO_IMAGE_ALT\}\}/g, blueprint.hero.alt)
        .replace(/\{\{SECTION_1\}\}/g, blueprint.section_1 || '')
        .replace(/\{\{SECTION_2\}\}/g, blueprint.section_2 || '')
        .replace(/\{\{SECTION_3\}\}/g, blueprint.section_3 || '')
        .replace(/\{\{SECTION_4\}\}/g, blueprint.section_4 || '')
        .replace(/\{\{SECTION_5\}\}/g, blueprint.section_5 || '')
        .replace(/\{\{SECTION_6\}\}/g, blueprint.section_6 || '')
        .replace(/\{\{CTA_SECTION\}\}/g, blueprint.cta || '');

    if (lang === 'de') {
        pageNavigation = applyTranslations(pageNavigation, 'de');
        pageFooter = applyTranslations(pageFooter, 'de');
        content = applyTranslations(content, 'de');
        pageNavigation = pageNavigation.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
    } else if (lang === 'fr') {
        pageNavigation = applyTranslations(pageNavigation, 'fr');
        pageFooter = applyTranslations(pageFooter, 'fr');
        content = applyTranslations(content, 'fr');
        pageNavigation = pageNavigation.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
    }

    const currentFlag = lang === 'de' ? 'DE' : lang === 'fr' ? 'FR' : 'EN';
    pageNavigation = pageNavigation.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">${currentFlag}</span>`);

    const activeStates = getActiveStates('solutions');
    for (const [key, value] of Object.entries(activeStates)) {
        pageNavigation = pageNavigation.replace(new RegExp(`\\{\\{${key}\\}\}`, 'g'), value);
    }

    const hrefUrls = getHreflangUrls(templateName);
    const relPrefix = lang === 'en' ? './' : '../';
    let enLink = hrefUrls.en || 'index.html';
    if (enLink === '') enLink = 'index.html';
    let trLink = hrefUrls.tr || 'tr/index.html';
    if (trLink.endsWith('/')) trLink += 'index.html';
    let deLink = hrefUrls.de || 'index.html';
    if (deLink.endsWith('/')) deLink += 'index.html';
    let frLink = hrefUrls.fr || 'index.html';
    if (frLink.endsWith('/')) frLink += 'index.html';
    pageNavigation = applyLanguageSwitcherLinks(pageNavigation, {
        en: `${relPrefix}${enLink}`,
        tr: `${relPrefix}${trLink}`,
        de: `${relPrefix}${deLink}`,
        fr: `${relPrefix}${frLink}`
    });

    htmlTemplate = htmlTemplate.split('{{NAVIGATION}}').join(pageNavigation);
    htmlTemplate = htmlTemplate.split('{{MAIN_CONTENT}}').join(content);
    htmlTemplate = htmlTemplate.split('{{FOOTER}}').join(pageFooter);

    const pageMetadata = getPageMetadata(templateName, lang);
    const canonicalUrl = lang === 'en' ? `https://www.goexpandia.com/${outputName}.html` : `https://www.goexpandia.com/${lang}/${outputName}.html`;

    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);

    const categoryKey = blueprint.category;
    const serviceKey = categoryKey;
    const serviceData = serviceKey && serviceContent[serviceKey] && serviceContent[serviceKey][lang]
        ? serviceContent[serviceKey][lang]
        : serviceContent[serviceKey] && serviceContent[serviceKey]['en'];

    const orgSchema = generateOrganizationSchema();
    let finalSchemas = [orgSchema];

    if (serviceData && serviceData.faq && serviceData.faq.length > 0) {
        finalSchemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": serviceData.faq.map(f => {
                let question = f.q;
                let answer = f.a;
                question = question.replace(/\s(for|in|at|across)\s\{\{CITY_NAME\}\}/gi, '')
                    .replace(/\s(in|across)\s\{\{COUNTRY_NAME\}\}/gi, '');
                answer = answer.replace(/\s(for|in|at|across)\s\{\{CITY_NAME\}\}/gi, '')
                    .replace(/\s(in|across)\s\{\{COUNTRY_NAME\}\}/gi, '');
                question = question.replace(/\{\{CITY_NAME\}\}/g, 'your business').replace(/\{\{COUNTRY_NAME\}\}/g, 'your region');
                answer = answer.replace(/\{\{CITY_NAME\}\}/g, 'your business').replace(/\{\{COUNTRY_NAME\}\}/g, 'your region');
                return {
                    "@type": "Question",
                    "name": question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": answer
                    }
                };
            })
        });
    }

    extractedSchemas.forEach(s => {
        const schemas = s["@graph"] ? s["@graph"] : [s];
        schemas.forEach(item => {
            if (item["@type"] === "Organization" && (item.name === "Go Expandia" || item.url === "https://www.goexpandia.com")) {
                return;
            }
            if (item["@type"] === "FAQPage" && serviceKey) {
                return;
            }
            finalSchemas.push(item);
        });
    });

    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(finalSchemas, null, 2));
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, hrefUrls.en);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, '');
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, hrefUrls.de);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, hrefUrls.fr);
    htmlTemplate = clearUnresolvedTemplateTokens(htmlTemplate);

    htmlTemplate = rewriteLegacyHrefTargets(htmlTemplate);

    const outputPath = lang === 'en' ? `${outputName}.html` : `${lang}/${outputName}.html`;
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
    console.log(`✅ Built ${outputPath}`);
}

// Blog Post Building Function
function buildBlogPost(templateName, outputName) {
    // console.log(`🏗️  Building blog post: ${outputName}`);

    const basePath = '../';
    const navPath = '../';
    const logoPath = '../go-expandia-logo.png';

    // Read blog post template
    let blogTemplate;
    const templateDir = 'templates/blog';
    const templatePath = `${templateDir}/${templateName}.html`;

    if (fs.existsSync(templatePath)) {
        blogTemplate = fs.readFileSync(templatePath, 'utf8');
    } else {
        console.log(`⚠️  Blog template ${templatePath} not found`);
        return;
    }

    // Blog pages are now EN-only.
    let nav = navigationEN;
    let foot = footerEN;

    const res = extractAndRemoveSchemas(blogTemplate, templatePath);
    let content = res.cleanContent;
    const extractedSchemas = res.extractedSchemas;

    // Clean i18n
    nav = nav.replace(/\s*data-i18n="[^"]*"/g, '');
    foot = foot.replace(/\s*data-i18n="[^"]*"/g, '');

    // Apply navPath to nav/foot BEFORE merging
    nav = nav.replace(/\{\{BASE_PATH\}\}/g, navPath);
    foot = foot.replace(/\{\{BASE_PATH\}\}/g, navPath);

    // Process includes
    content = content.replace('{{HEADER_INCLUDE}}', nav);
    content = content.replace('{{FOOTER_INCLUDE}}', foot);

    // Turkish services path
    const turkishServicesPath = './';
    content = content.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

    // Flag logic
    const currentFlag = 'EN';
    content = content.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">${currentFlag}</span>`);

    content = applyLanguageSwitcherLinks(content, {
        en: `./${templateName}.html`,
        tr: './index.html',
        de: './index.html',
        fr: './index.html'
    });

    // Replace path placeholders
    content = content.replace(/(href|src)="\{\{BASE_PATH\}\}([^"]+\.(css|ico|png|jpg|jpeg|js|svg))"/g, `$1="${basePath}$2"`);
    content = content.replace(/\{\{BASE_PATH\}\}/g, navPath);
    content = content.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

    // Set active states for navigation
    content = content.replace(/\{\{HOME_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{SOLUTIONS_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{ABOUT_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CONTACT_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{BLOG_ACTIVE\}\}/g, 'text-primary');

    // Clear mobile active states
    content = content.replace(/\{\{HOME_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{SOLUTIONS_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{ABOUT_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CONTACT_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{BLOG_MOBILE_ACTIVE\}\}/g, 'class="text-primary font-semibold"');

    // Clear other placeholder states
    content = content.replace(/\{\{SOLUTIONS_ITEM_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CASESTUDIES_ITEM_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{ABOUT_ITEM_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CONTACT_ITEM_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{CASESTUDIES_MOBILE_ACTIVE\}\}/g, '');
    content = content.replace(/\{\{COMPANY_ACTIVE\}\}/g, '');

    // Replace navigation page placeholders
    content = content.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    content = content.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');

    const outputPath = `blog/${outputName}.html`;

    const canonicalUrl = `https://www.goexpandia.com/blog/${outputName}.html`;
    content = content.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);
    content = enforceCanonicalMeta(content, canonicalUrl);
    content = content.replace(/https:\/\/www\.goexpandia\.com\/templates\/blog\/index\.html/g, 'https://www.goexpandia.com/blog/index.html');

    const pageMeta = deriveBlogMeta(content, outputName);
    content = content.replace(/\{\{PAGE_TITLE\}\}/g, pageMeta.title);
    content = content.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMeta.description);
    content = content.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMeta.keywords);
    content = enforceSeoMetaTags(content, pageMeta.title, pageMeta.description, pageMeta.keywords);

    // Ensure blog directory exists
    const blogDir = path.dirname(outputPath);
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }

    // Add Lucide icons initialization script before closing body tag
    const lucideScript = `
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();
        
        // FAQ Toggle Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const faqItems = document.querySelectorAll('.collapse');
            faqItems.forEach(item => {
                const title = item.querySelector('.collapse-title');
                const content = item.querySelector('.collapse-content');
                const input = item.querySelector('input[type="radio"], input[type="checkbox"]');
                
                if (title && content) {
                    // Initially hide all content except the first one
                    if (!input || !input.checked) {
                        content.style.display = 'none';
                    }
                    
                    title.style.cursor = 'pointer';
                    title.addEventListener('click', function() {
                        const isOpen = content.style.display !== 'none';
                        
                        // Close all other FAQs if using radio buttons
                        if (input && input.type === 'radio') {
                            const allItems = document.querySelectorAll('.collapse');
                            allItems.forEach(otherItem => {
                                const otherContent = otherItem.querySelector('.collapse-content');
                                const otherInput = otherItem.querySelector('input[type="radio"]');
                                if (otherContent && otherItem !== item) {
                                    otherContent.style.display = 'none';
                                    if (otherInput) otherInput.checked = false;
                                }
                            });
                        }
                        
                        // Toggle current item
                        content.style.display = isOpen ? 'none' : 'block';
                        if (input) input.checked = !isOpen;
                    });
                }
            });
        });
    </script>
</body>`;
    content = content.replace('</body>', lucideScript);

    // Fix related post links: convert absolute blog hrefs to relative only for anchors.
    content = content.replace(/(<a\b[^>]*\shref=")https:\/\/www\.goexpandia\.com\/blog\//gi, '$1');

    // Fix related posts: ensure all cards have badges and clean structure
    content = content.replace(
        /<div class="card bg-base-200 hover:shadow-lg transition-shadow">\s*<div class="card-body">\s*<h4 class="card-title/g,
        '<div class="card bg-base-200 hover:shadow-lg transition-shadow">\n                <div class="card-body">\n                    <span class="badge badge-primary mb-2">Article</span>\n                    <h4 class="card-title'
    );

    // Fix badge "Low" to proper category
    content = content.replace(
        /<span class="badge badge-secondary mb-2">Low<\/span>/g,
        '<span class="badge badge-secondary mb-2">Lead Generation</span>'
    );

    // Normalize stray template/markdown artifacts if present.
    content = content
        .replace(/\{\{CITY_NAME\}\}/g, 'your market')
        .replace(/\{\{COUNTRY_NAME\}\}/g, 'your region')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    content = clearUnresolvedTemplateTokens(content);

    // Clean up overly long titles in related posts (remove " | Go Expandia..." suffix)
    content = content.replace(
        /(<a href="[^"]*"[^>]*>)([^<]+?) \| Go Expandia[^<]*(<\/a>)/g,
        '$1$2$3'
    );

    // Schema - Aggregated for Blog
    const orgSchema = generateOrganizationSchema();
    let finalSchemas = [orgSchema];

    extractedSchemas.forEach(s => {
        if (s["@type"] === "Organization" && (s.name === "Go Expandia" || s.url === "https://www.goexpandia.com")) {
            return;
        }
        finalSchemas.push(s);
    });

    const schemaString = `<script type="application/ld+json">\n${JSON.stringify(finalSchemas, null, 2)}\n</script>`;

    if (content.includes('{{SCHEMA_MARKUP}}')) {
        content = content.replace('{{SCHEMA_MARKUP}}', schemaString);
    } else {
        content = content.replace('</head>', `${schemaString}\n</head>`);
    }

            content = rewriteLegacyHrefTargets(content);
            fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`✅ Built blog post: ${outputPath}`);
}

// Blog Post Building Function
function buildBlogPosts() {
    console.log('\n🏗️  Building Blog Posts (EN Only)...');
    const languages = ['en'];
    let totalBuilt = 0;

    // Use English templates as the master list
    const masterBlogDir = 'templates/blog';
    if (!fs.existsSync(masterBlogDir)) {
        console.log('⚠️ Master blog templates directory not found.');
        return;
    }

    const files = fs.readdirSync(masterBlogDir).filter(file => file.endsWith('.html'));

    languages.forEach(lang => {
        files.forEach(file => {
            const templateName = file.replace('.html', '');
            buildBlogPost(templateName, templateName);
        });
        console.log(`✅ Built ${files.length} blog posts for ${lang.toUpperCase()}.`);
        totalBuilt += files.length;
    });
    console.log(`✅ Total Blog Posts Built: ${totalBuilt}`);
}

// Helper: Haversine distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function sanitizeLandmark(landmark, cityName) {
    const value = (landmark || '').trim();
    const generic = new Set(['City Center', 'Central Business District', 'the city center', 'City centre']);
    if (!value || generic.has(value)) {
        return `${cityName} business hub`;
    }
    return value;
}

function buildServiceFocusedContent(serviceName) {
    const serviceLower = serviceName.toLowerCase();
    return {
        intro: [
            `Businesses in {{CITY_NAME}} need ${serviceLower} that is measurable, fast to deploy, and aligned with local buying behavior in {{COUNTRY_NAME}}.`,
            `Our team builds and manages a practical ${serviceLower} system so your team can focus on pipeline, delivery, and client growth instead of tool friction.`,
            `We tailor implementation, reporting, and optimization for {{CITY_NAME}} so you can scale with predictable execution and clear ROI.`
        ],
        pain_points: [
            `Inconsistent execution and unclear ownership across ${serviceLower} workflows in {{CITY_NAME}}.`,
            `Low visibility into performance signals, making it hard to improve conversion outcomes in {{COUNTRY_NAME}}.`,
            `Too much manual work and fragmented tooling that slows growth and increases operating cost.`
        ],
        benefits: [
            `**Operational Clarity:** We map and standardize your ${serviceLower} workflow for consistent delivery in {{CITY_NAME}}.`,
            `**Faster Iteration:** Continuous testing and optimization improves quality, speed, and conversion performance over time.`,
            `**Measurable Results:** Clear dashboards and reporting tie activity to pipeline and revenue outcomes in {{COUNTRY_NAME}}.`
        ],
        faq: [
            {
                q: `What is included in your ${serviceName} setup for {{CITY_NAME}} businesses?`,
                a: `We provide setup, implementation, workflow design, KPI tracking, and ongoing optimization tailored to your team, market, and goals in {{CITY_NAME}}.`
            },
            {
                q: `How long does it take to launch and see first results in {{CITY_NAME}}?`,
                a: `Most clients launch the core system quickly, then see progressive improvement as we optimize targeting, messaging, and execution quality.`
            },
            {
                q: `Can you adapt the program for our sector in {{COUNTRY_NAME}}?`,
                a: `Yes. We tailor strategy, operations, and reporting to your ICP, sales motion, and compliance needs in {{COUNTRY_NAME}}.`
            }
        ]
    };
}

function getServiceContentFor(service, lang = 'en') {
    const byId = serviceContent[service.id] && serviceContent[service.id][lang];
    if (byId) return byId;

    const categoryKey = service.category || serviceMapping[service.id];
    const byCategory = categoryKey && serviceContent[categoryKey] && serviceContent[categoryKey][lang];
    if (byCategory) return byCategory;

    const categoryFallback = categoryKey && serviceContent[categoryKey] && serviceContent[categoryKey]['en'];
    if (categoryFallback) return categoryFallback;

    return null;
}

function normalizeServiceContent(service, contentData) {
    if (!contentData) return buildServiceFocusedContent(service.name);
    return contentData;
}


function clearUnresolvedTemplateTokens(html) {
    return html.replace(/\{\{[^{}]+\}\}/g, '');
}

function removeEmptyNearbySection(content) {
    return content.replace(/\n<!-- Nearby Cities -->[\s\S]*?<\/section>\s*/g, '\n');
}



// Whitelist for high-potential Service x City pages (derived from SEO opportunity list)
// Note: non-service pages (blog/contact/solutions/etc.) are handled by other build steps.
const PRIORITY_SERVICE_CITY_PATHS = new Set([
    'microsoft-365-workspace-management-london',
    'cloud-architecture-azure-transition-zurich',
    'endpoint-security-new-york',
    'advanced-email-security-dubai',
    'zero-trust-architecture-berlin',
    'disaster-recovery-business-continuity-istanbul',
    'continuous-vulnerability-scanning-frankfurt',
    'gdpr-compliance-infrastructure-amsterdam',
    'secure-network-vpn-setup-barcelona',
    'it-support-monitoring-chicago',
    'corporate-ai-infrastructure-setup-london',
    'on-premise-ai-setup-zurich',
    'ai-data-security-layer-berlin',
    'agentic-ai-development-paris',
    'smart-factory-optimization-stuttgart',
    'sales-marketing-automation-new-york',
    'customer-service-automation-dallas',
    'data-silos-automation-madrid',
    'operational-load-reduction-amsterdam',
    'custom-erp-crm-integrations-london',
    'digital-engineering-rd-software-zurich',
    'b2b-dealer-customer-portals-paris',
    'human-in-the-loop-ai-testing-berlin',
    'legacy-system-modernization-chicago',
    'enterprise-bi-dashboards-new-york',
    'internal-operational-applications-istanbul',
    'corporate-website-development-amsterdam',
    'mvp-development-corporate-spinoff-dubai',
    'custom-data-architecture-database-design-frankfurt'
]);

// -------------------------------------------------------------------------
// NEW: Build Service x City Pages (Multi-Language)
// -------------------------------------------------------------------------
function buildServiceCityPages() {
    console.log('\n🏗️  Building Service x City Landing Pages (EN Only)...');

    // Read the mega template
    const templateContent = fs.readFileSync('templates/city-landing.html', 'utf8');
    let pageCount = 0;
    const languages = ['en'];

    languages.forEach(lang => {
        services.forEach(service => {
            // Get content for specific language, fallback to category content or EN if missing
            const rawContentData = getServiceContentFor(service, lang);
            const contentData = normalizeServiceContent(service, rawContentData);

            if (!contentData) {
                console.warn(`No content found for service ID: ${service.id} (Lang: ${lang})`);
                return;
            }

            cities.forEach(cityData => {
                const city = cityData.city;
                const country = cityData.country;

                // Replace dynamic parts in slug
                let slug = service.slug_pattern.replace('{{CITY_SLUG}}', normalizeCitySlug(cityData.slug));

                const categoryMeta = getLocalizedCategoryMeta(service.category, lang);

                // Determine title/desc based on language
                let titleTemplate = service.title_template;
                let descTemplate = service.description_template;

                if (lang !== 'en' && service.translations && service.translations[lang]) {
                    titleTemplate = service.translations[lang].title_template;
                    descTemplate = service.translations[lang].description_template;
                }

                // Replace dynamic parts in title/desc
                const title = titleTemplate
                    .replace('{{CITY_NAME}}', city)
                    .replace('{{COUNTRY_NAME}}', country);

                const description = descTemplate
                    .replace('{{CITY_NAME}}', city)
                    .replace('{{COUNTRY_NAME}}', country);

                // Construct Content Blocks
                const intro = contentData.intro.map(p => `<p>${p.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}</p>`).join('\n');

                const painPoints = contentData.pain_points.map(point => `
                    <div class="flex gap-3 items-start">
                        <span class="text-error text-xl">⚠️</span>
                        <p>${point.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}</p>
                    </div>
                `).join('');

                const benefits = contentData.benefits.map(benefit => {
                    // Split bold text
                    const parts = benefit.split('**');
                    if (parts.length === 3) {
                        return `
                        <div class="flex gap-3">
                            <span class="text-secondary text-xl">✓</span>
                            <p><strong class="text-secondary-content">${parts[1]}</strong> ${parts[2].replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}</p>
                        </div>`;
                    }
                    return `<p>${benefit.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}</p>`;
                }).join('');

                const faq = contentData.faq.map(item => `
                    <div class="collapse collapse-plus bg-base-200">
                        <input type="checkbox" /> 
                        <div class="collapse-title text-xl font-medium">
                            ${item.q.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}
                        </div>
                        <div class="collapse-content"> 
                            <p>${item.a.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)}</p>
                        </div>
                    </div>
                `).join('');

                // Calculate Nearby Cities (same logic as before)
                const nearby = cities
                    .filter(c => c.slug !== cityData.slug && c.lat && c.lng && cityData.lat && cityData.lng)
                    .map(c => ({
                        ...c,
                        distance: getDistanceFromLatLonInKm(cityData.lat, cityData.lng, c.lat, c.lng)
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 5);

                const nearbyLinks = nearby.map(c => {
                    const nearbySlug = service.slug_pattern.replace('{{CITY_SLUG}}', normalizeCitySlug(c.slug));
                    // Handle relative linking for subdirectories
                    const linkPrefix = lang === 'en' ? './' : '../';
                    // If we are in a lang folder, we link to other pages in THAT lang folder (conceptually). 
                    // But currently flat structure for EN, subdirs for others.
                    // Wait, if I am in `de/`, linking to `de/other.html`, it is just `./other.html`.
                    // Yes.
                    return `<a href="./${nearbySlug}.html" class="link link-hover hover:text-primary transition-colors">${c.city}</a>`;
                }).join(' • ');

                const generatedPath = lang === 'en' ? slug : `${lang}/${slug}`;
                if (!PRIORITY_SERVICE_CITY_PATHS.has(generatedPath)) {
                    return;
                }

                // Build HTML
                let htmlTemplate = createHTMLTemplate(lang);
                const res = extractAndRemoveSchemas(templateContent, `city-landing-template`);
                let content = res.cleanContent;
                const extractedSchemas = res.extractedSchemas;
                const basePath = (lang === 'de' || lang === 'fr') ? '../' : './';

                // Replacements
                content = content.replace(/\{\{SERVICE_NAME\}\}/g, service.name);
                content = content.replace(/\{\{SERVICE_ICON\}\}/g, service.icon);
                content = content.replace(/\{\{CITY_NAME\}\}/g, city);
                content = content.replace(/\{\{COUNTRY_NAME\}\}/g, country);
                content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);
                content = content.replace('{{INTRO_TEXT}}', intro);
                content = content.replace('{{PAIN_POINTS_LIST}}', painPoints);
                content = content.replace('{{BENEFITS_LIST}}', benefits);
                content = content.replace('{{FAQ_LIST}}', faq);
                content = content.replace('{{NEARBY_CITIES_LINKS}}', nearbyLinks);
                content = content.replace(/\{\{SERVICE_CATEGORY\}\}/g, categoryMeta.label);
                content = content.replace(/\{\{SERVICE_CATEGORY_PROMISE\}\}/g, categoryMeta.promise);
                content = content.replace(/\{\{CITY_POPULATION\}\}/g, 'established');
                content = content.replace(/\{\{CITY_LANDMARK\}\}/g, sanitizeLandmark(cityData.landmark, city));

                if (!nearbyLinks.trim()) {
                    content = content.replace(/\n<!-- Nearby Cities CTA -->[\s\S]*?<\/section>\n\n/, '\n');
                }
                content = replaceServiceCityCopy(content, lang);
                if (lang !== 'en') {
                    content = applyTranslations(content, lang);
                }

                // Navigation/Footer
                let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
                let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

                // Clean i18n
                pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
                pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

                const logoPath = (lang === 'de' || lang === 'fr') ? '../go-expandia-logo.png' : 'go-expandia-logo.png';
                htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
                const turkishServicesPath = './';

                pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
                pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
                pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
                pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
                pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
                pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
                pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
                pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

                // Apply Translation Helper
                if (lang !== 'en') {
                    pageNavigation = applyTranslations(pageNavigation, lang);
                    pageFooter = applyTranslations(pageFooter, lang);
                }

                // Flag logic
                const currentFlag = lang === 'de' ? 'DE' : lang === 'fr' ? 'FR' : 'EN';
                pageNavigation = pageNavigation.replace(/<span id="current-flag">.*?<\/span>/g, `<span id="current-flag">${currentFlag}</span>`);

                htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
                htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
                htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

                // Metadata & Schema
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, description);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, `${service.name} ${city}, ${categoryMeta.label} ${city}, ${country} enterprise solutions`);

                const canonicalSlug = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;
                htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.goexpandia.com/${canonicalSlug}`);

                // Hreflang logic
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${slug}.html`);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, ``);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `${slug}.html`);
                htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `${slug}.html`);

                // Fix missing FR hreflang in template logic (hacky patch based on previous code)
                if (!htmlTemplate.includes('hreflang="fr"')) {
                    htmlTemplate = htmlTemplate.replace(
                        `<link rel="alternate" hreflang="de" href="https://www.goexpandia.com/de/${slug}.html">`,
                        `<link rel="alternate" hreflang="de" href="https://www.goexpandia.com/de/${slug}.html">\n    <link rel="alternate" hreflang="fr" href="https://www.goexpandia.com/fr/${slug}.html">`
                    );
                }

                const serviceSchema = {
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": `${service.name} in ${city}`,
                    "provider": "Go Expandia",
                    "areaServed": {
                        "@type": "City",
                        "name": city,
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": country
                        }
                    },
                    "description": description
                };

                const faqSchema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": contentData.faq.map(item => ({
                        "@type": "Question",
                        "name": item.q.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country),
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.a.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country)
                        }
                    }))
                };

                // Schema - Aggregated
                const orgSchema = generateOrganizationSchema();
                let finalSchemas = [orgSchema, serviceSchema, faqSchema];

                extractedSchemas.forEach(s => {
                    if (s["@type"] === "Organization" || s["@type"] === "Service" || s["@type"] === "FAQPage") return;
                    finalSchemas.push(s);
                });

                htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(finalSchemas, null, 2));

                // Write File
                const outputPath = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;

                // Ensure dir exists
                const dir = path.dirname(outputPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
                pageCount++;
            });
        });
    });
    console.log(`✅ Built ${pageCount} Service x City pages.`);
}

// -------------------------------------------------------------------------
// REMOVED: Build Service x Industry x City Pages (Multi-Language)
// This function generated too many low-quality pages and has been disabled
// -------------------------------------------------------------------------
/*
function buildServiceIndustryCityPages() {
    console.log('\n🏗️  Building Service x Industry x City Landing Pages (Multi-Language)...');

    // Read the mega template
    const templateContent = fs.readFileSync('templates/service-industry-city-landing.html', 'utf8');
    let pageCount = 0;
    const languages = ['en', 'de', 'fr'];

    languages.forEach(lang => {
        services.forEach(service => {
            topIndustries.forEach(industry => {
                topCities.forEach(cityData => {
                    const city = cityData.city;
                    const country = cityData.country;

                    // Slug: service-industry-city.html
                    // E.g. managed-it-services-fintech-london.html
                    const slug = `${service.slug_pattern.replace('-{{CITY_SLUG}}', '')}-${industry.slug}-${cityData.slug}`;

                    // Determine title/desc based on language (Simplified for this massive scale)
                    let title = `${service.name} for ${industry.name} in ${city}`;
                    let description = `${service.name} tailored for ${industry.name} companies in ${city}.`;

                    // Service Slug Mapping
                    const serviceSlugMap = {
                        'managed-it': 'managed-it-services',
                        'cybersecurity': 'vulnerability-assessments',
                        'recruitment': 'recruitment',
                        'ai-studio': 'ai-creative-studio',
                        'revops': 'revops-crm-setup'
                    };
                    const serviceSlug = serviceSlugMap[service.id] || 'index';

                    // Build HTML
                    let htmlTemplate = createHTMLTemplate(lang);
                    let content = templateContent;

                    // Replacements
                    content = content.replace(/\{\{SERVICE_NAME\}\}/g, service.name);
                    content = content.replace(/\{\{SERVICE_ICON\}\}/g, service.icon);
                    content = content.replace(/\{\{INDUSTRY_NAME\}\}/g, industry.name);
                    content = content.replace(/\{\{CITY_NAME\}\}/g, city);
                    content = content.replace(/\{\{COUNTRY_NAME\}\}/g, country);
                    content = content.replace(/\{\{SERVICE_SLUG\}\}/g, serviceSlug);
                    content = content.replace(/\{\{INDUSTRY_SLUG\}\}/g, industry.slug);

                    // Navigation/Footer
                    let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
                    let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

                    // Clean i18n
                    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
                    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

                    const basePath = (lang === 'de' || lang === 'fr') ? '../' : './';
                    const logoPath = (lang === 'de' || lang === 'fr') ? '../go-expandia-logo.png' : 'go-expandia-logo.png';
                    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
                    const turkishServicesPath = './';

                    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
                    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
                    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
                    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
                    pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
                    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
                    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
                    pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

                    // Apply Translation Helper
                    if (lang !== 'en') {
                        pageNavigation = applyTranslations(pageNavigation, lang);
                        pageFooter = applyTranslations(pageFooter, lang);
                    }

                    htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
                    htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
                    htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

                    // Metadata & Schema
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, description);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, `${service.name} ${industry.name} ${city}`);

                    const canonicalSlug = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;
                    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.goexpandia.com/${canonicalSlug}`);

                    // Hreflang logic
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${slug}.html`);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, ``);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `de/${slug}.html`);
                    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `fr/${slug}.html`);

                    // Fix missing FR hreflang
                    if (!htmlTemplate.includes('hreflang="fr"')) {
                        htmlTemplate = htmlTemplate.replace(
                            `<link rel="alternate" hreflang="de" href="https://www.goexpandia.com/de/${slug}.html">`,
                            `<link rel="alternate" hreflang="de" href="https://www.goexpandia.com/de/${slug}.html">\n    <link rel="alternate" hreflang="fr" href="https://www.goexpandia.com/fr/${slug}.html">`
                        );
                    }

                    const schema = {
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": `${service.name} for ${industry.name} in ${city}`,
                        "provider": { "@type": "Organization", "name": "Go Expandia", "url": "https://www.goexpandia.com" },
                        "areaServed": { "@type": "City", "name": city },
                        "audience": { "@type": "Audience", "audienceType": industry.name }
                    };
                    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schema, null, 2));

                    // Write File
                    const outputPath = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;

                    // Ensure dir exists
                    const dir = path.dirname(outputPath);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }

                    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
                    pageCount++;
                });
            });
        });
    });
    console.log(`✅ Built ${pageCount} Service x Industry x City pages.`);
}
*/


// -------------------------------------------------------------------------
// NEW: Build City Landing Pages (Refactored) - B2B/Corporate/Manufacturing Focus
// -------------------------------------------------------------------------

// Region-based content for unique city pages
const regionContent = {
    'DACH': {
        targetHeadline: 'Corporate Enterprises & Industrial Manufacturers',
        industries: ['Industrial Manufacturing', 'Engineering Companies', 'Corporate Enterprises', 'Automotive Suppliers', 'Machinery & Equipment', 'Chemicals & Materials', 'Logistics & Supply Chain', 'Business Services', 'Wholesale & Distribution', 'Construction & Infrastructure'],
        insights: [
            { title: 'Industrial Precision', text: 'Our approach matches the DACH region\'s emphasis on quality and precision. We identify decision-makers who value long-term partnerships over transactional relationships.' },
            { title: 'Cross-Border Expertise', text: 'Navigate the German, Austrian, and Swiss markets effectively with campaigns tailored to local business cultures and procurement processes.' },
            { title: 'Mid-Market Focus', text: 'Reach the Mittelstand—the backbone of DACH manufacturing. Our campaigns connect you with privately-owned, export-oriented companies.' },
            { title: 'Multi-Language Campaigns', text: 'German-language outreach combined with English for international divisions. We adapt messaging to regional business expectations.' }
        ],
        marketStats: [
            { stat: '3M+', desc: 'B2B companies across DACH region' },
            { stat: '€2.1T', desc: 'Combined manufacturing output' },
            { stat: '68%', desc: 'Companies actively seeking suppliers' }
        ],
        marketContext: 'The DACH region represents one of Europe\'s most mature B2B markets, with strong demand for quality-focused suppliers and service providers.',
        serviceIntro: 'Our B2B lead generation methodology is designed for the complex, relationship-driven sales cycles typical of corporate and industrial buyers across Germany, Austria, and Switzerland.'
    },
    'Western Europe': {
        targetHeadline: 'B2B Companies & Corporate Enterprises',
        industries: ['Corporate Services', 'Manufacturing Companies', 'Business Consulting', 'Logistics & Freight', 'Industrial Equipment', 'Construction & Engineering', 'Telecommunications', 'Energy & Utilities', 'Retail & Wholesale', 'Professional Services'],
        insights: [
            { title: 'Enterprise Connections', text: 'Access decision-makers at corporate headquarters and regional offices across Western European markets.' },
            { title: 'Cross-Border Campaigns', text: 'Expand from one market to multiple countries with campaigns that respect local business practices and languages.' },
            { title: 'Procurement Expertise', text: 'We understand formal procurement processes and help you position effectively in competitive tender situations.' },
            { title: 'Quality Over Quantity', text: 'Focus on qualified meetings with buyers who have budget and authority, not just contact lists.' }
        ],
        marketStats: [
            { stat: '5M+', desc: 'Active B2B enterprises' },
            { stat: '€4.2T', desc: 'Annual B2B commerce value' },
            { stat: '72%', desc: 'Digital procurement adoption' }
        ],
        marketContext: 'Western Europe offers mature B2B markets with sophisticated buyers who expect professional, value-driven sales approaches and clear ROI.',
        serviceIntro: 'From the UK to the Benelux, our lead generation services help you connect with corporate buyers and industrial decision-makers across Western Europe\'s diverse markets.'
    },
    'Scandinavia': {
        targetHeadline: 'Industrial Companies & Corporate Groups',
        industries: ['Maritime & Shipping', 'Energy & Clean Tech', 'Industrial Manufacturing', 'Engineering Services', 'Forest & Paper Products', 'Corporate Enterprises', 'Telecommunications', 'Construction & Real Estate', 'Business Services', 'Healthcare Industry'],
        insights: [
            { title: 'Sustainability Focus', text: 'Scandinavian buyers prioritize sustainable practices. We help position your offering around long-term value and environmental responsibility.' },
            { title: 'Direct Communication', text: 'Nordic business culture values straightforward communication. Our outreach reflects this—clear, honest, and results-oriented.' },
            { title: 'Innovation-Driven', text: 'Connect with companies at the forefront of industrial innovation, from clean energy to advanced manufacturing.' },
            { title: 'Regional Expansion', text: 'Use Scandinavia as a springboard to Nordic and Baltic markets with integrated campaign strategies.' }
        ],
        marketStats: [
            { stat: '800K+', desc: 'B2B companies in the Nordics' },
            { stat: '€890B', desc: 'Combined GDP' },
            { stat: '85%', desc: 'Digital business adoption' }
        ],
        marketContext: 'The Nordic region combines industrial heritage with technology leadership, creating opportunities for B2B providers who can deliver innovation and reliability.',
        serviceIntro: 'Reach industrial manufacturers, corporate groups, and service providers across Norway, Sweden, Denmark, and Finland with campaigns tailored to Nordic business values.'
    },
    'Turkey': {
        targetHeadline: 'Manufacturing Companies & Corporate Groups',
        industries: ['Manufacturing & Production', 'Textile & Apparel', 'Automotive Industry', 'Construction & Building Materials', 'Food & Beverage Production', 'Corporate Enterprises', 'Logistics & Export', 'Industrial Machinery', 'Wholesale & Trading', 'Business Services'],
        insights: [
            { title: 'Manufacturing Hub', text: 'Turkey is a major manufacturing center for Europe and the Middle East. Connect with producers seeking international partners and suppliers.' },
            { title: 'Export-Oriented', text: 'Reach companies actively exporting to Europe, MENA, and beyond—businesses that understand international B2B relationships.' },
            { title: 'Growing Corporate Sector', text: 'Turkish corporate groups are expanding rapidly. Position your services to support their growth ambitions.' },
            { title: 'Local & International', text: 'Campaigns in Turkish and English to reach both domestic industrial players and internationally-focused enterprises.' }
        ],
        marketStats: [
            { stat: '1.2M+', desc: 'Active industrial companies' },
            { stat: '€210B', desc: 'Annual manufacturing output' },
            { stat: '45%', desc: 'Export-oriented businesses' }
        ],
        marketContext: 'Turkey\'s strategic position bridges European and Asian markets, with a strong manufacturing base and growing corporate sector seeking B2B partnerships.',
        serviceIntro: 'Connect with Turkish manufacturers, corporate groups, and export-oriented businesses through campaigns that understand the local business landscape.'
    },
    'Eastern Europe': {
        targetHeadline: 'Industrial Manufacturers & Growing Enterprises',
        industries: ['Manufacturing & Assembly', 'Automotive Suppliers', 'IT & Business Services', 'Logistics & Warehousing', 'Construction & Development', 'Industrial Equipment', 'Corporate Services', 'Wholesale & Distribution', 'Energy & Utilities', 'Agriculture & Food Processing'],
        insights: [
            { title: 'Manufacturing Growth', text: 'Eastern Europe has emerged as a manufacturing powerhouse. Connect with companies expanding production and seeking suppliers.' },
            { title: 'Cost-Competitive Quality', text: 'Reach enterprises that combine competitive costs with European quality standards—attractive partners for Western companies.' },
            { title: 'EU Integration', text: 'Companies in EU member states follow familiar procurement practices, making cross-border B2B relationships straightforward.' },
            { title: 'Nearshoring Hub', text: 'As companies nearshore operations to Eastern Europe, new B2B opportunities emerge across the supply chain.' }
        ],
        marketStats: [
            { stat: '2M+', desc: 'B2B enterprises' },
            { stat: '€580B', desc: 'Regional GDP' },
            { stat: '7.2%', desc: 'Average growth rate' }
        ],
        marketContext: 'Eastern Europe continues to grow as a B2B hub, with expanding manufacturing capacity and increasingly sophisticated corporate buyers.',
        serviceIntro: 'Tap into Eastern Europe\'s growing industrial base and corporate sector with lead generation campaigns designed for emerging market dynamics.'
    },
    'Southern Europe': {
        targetHeadline: 'Corporate Enterprises & Industrial Companies',
        industries: ['Manufacturing & Production', 'Fashion & Luxury Goods', 'Food & Beverage', 'Construction & Real Estate', 'Corporate Services', 'Automotive & Machinery', 'Tourism Infrastructure', 'Logistics & Transport', 'Wholesale & Retail', 'Professional Services'],
        insights: [
            { title: 'Relationship-Driven', text: 'Southern European business culture emphasizes personal relationships. Our approach builds trust before pushing for meetings.' },
            { title: 'Industry Clusters', text: 'Connect with companies in regional industry clusters—from Italian manufacturing to Spanish construction.' },
            { title: 'Mediterranean Markets', text: 'Reach buyers across Italy, Spain, Portugal, and Greece with campaigns adapted to local business practices.' },
            { title: 'Export Champions', text: 'Many Southern European companies are export leaders in their sectors—ideal partners for international B2B relationships.' }
        ],
        marketStats: [
            { stat: '3.5M+', desc: 'Active B2B companies' },
            { stat: '€2.8T', desc: 'Combined GDP' },
            { stat: '58%', desc: 'Export-active businesses' }
        ],
        marketContext: 'Southern Europe combines industrial tradition with entrepreneurial energy, offering diverse B2B opportunities across manufacturing and services.',
        serviceIntro: 'From Italian manufacturing to Spanish corporate enterprises, we help you connect with decision-makers across Southern Europe\'s diverse B2B landscape.'
    },
    'North America': {
        targetHeadline: 'B2B Enterprises & Corporate Companies',
        industries: ['Corporate Enterprises', 'Manufacturing & Production', 'Business Services', 'Industrial Equipment', 'Construction & Engineering', 'Logistics & Distribution', 'Healthcare Industry', 'Energy & Utilities', 'Telecommunications', 'Professional Services'],
        insights: [
            { title: 'Enterprise Scale', text: 'Access decision-makers at large enterprises and mid-market companies across the US and Canada.' },
            { title: 'Competitive Markets', text: 'Stand out in competitive North American markets with targeted, personalized outreach that cuts through the noise.' },
            { title: 'Time Zone Coverage', text: 'Campaign execution aligned with North American business hours for optimal engagement and response rates.' },
            { title: 'Cross-Border Expansion', text: 'Use North America as your launchpad for global expansion or target specific regional markets.' }
        ],
        marketStats: [
            { stat: '6M+', desc: 'B2B companies' },
            { stat: '$25T', desc: 'Annual B2B commerce' },
            { stat: '78%', desc: 'Digital buying preference' }
        ],
        marketContext: 'North America represents the world\'s largest B2B market, with sophisticated buyers who expect data-driven, value-focused sales approaches.',
        serviceIntro: 'Reach corporate buyers and industrial decision-makers across the United States and Canada with campaigns that match American business expectations.'
    }
};

// Default content for regions not explicitly defined
const defaultRegionContent = {
    targetHeadline: 'B2B Companies & Corporate Enterprises',
    industries: ['Corporate Enterprises', 'Manufacturing Companies', 'Business Services', 'Industrial Suppliers', 'Logistics & Distribution', 'Construction & Engineering', 'Professional Services', 'Wholesale & Trading', 'Technology Companies', 'Energy & Utilities'],
    insights: [
        { title: 'Global Reach', text: 'Connect with B2B decision-makers worldwide through targeted, professional outreach campaigns.' },
        { title: 'Industry Expertise', text: 'Our team understands B2B sales cycles and helps position your offering for enterprise and mid-market buyers.' },
        { title: 'Quality Meetings', text: 'Focus on qualified conversations with buyers who have budget, authority, and genuine interest.' },
        { title: 'Scalable Approach', text: 'Start with targeted campaigns and scale as you identify successful patterns and markets.' }
    ],
    marketStats: [
        { stat: '100M+', desc: 'B2B companies globally' },
        { stat: '$50T+', desc: 'Global B2B commerce' },
        { stat: '65%', desc: 'Prefer digital engagement' }
    ],
    marketContext: 'B2B markets worldwide are increasingly open to professional outreach from qualified providers offering clear value propositions.',
    serviceIntro: 'Our lead generation services help B2B companies connect with corporate and industrial buyers across diverse global markets.'
};

function buildCityPages() {
    console.log('\n🏗️  Building City Landing Pages (B2B/Corporate/Manufacturing Focus)...');

    const templateContent = fs.readFileSync('templates/city-landing.html', 'utf8');

    cities.forEach(cityData => {
        const lang = 'en'; // Currently only EN for cities
        const city = cityData.city;
        const country = cityData.country;
        const region = cityData.region || 'Global';
        const slug = cityData.slug;
        const image = cityData.image || './assets/local/default-city.jpg';

        // Get region-specific content
        const regionData = regionContent[region] || defaultRegionContent;

        // SEO-optimized metadata - Short titles (50-60 chars) and descriptions (150-155 chars)
        const title = `B2B Lead Generation ${city} | Go Expandia`;
        const description = `Professional B2B lead generation in ${city}. We help ${region} companies generate qualified meetings with corporate buyers. Proven results.`;
        const keywords = `B2B lead generation ${city}, corporate sales ${city}, ${country} B2B agency, appointment setting ${city}`;

        let htmlTemplate = createHTMLTemplate(lang);
        const res = extractAndRemoveSchemas(templateContent, `templates/city-landing.html`);
        let content = res.cleanContent;
        const extractedSchemas = res.extractedSchemas;

        // Calculate Nearby Cities
        const nearby = cities
            .filter(c => c.slug !== slug && c.lat && c.lng && cityData.lat && cityData.lng)
            .map(c => ({
                ...c,
                distance: getDistanceFromLatLonInKm(cityData.lat, cityData.lng, c.lat, c.lng)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 4);

        const nearbyHtml = nearby.map(c => {
            const nearbySlug = normalizeCitySlug(c.slug);
            return `
            <a href="${nearbySlug}.html" class="block p-4 rounded-lg border border-base-300 hover:border-primary transition-all group bg-base-100">
                <div class="font-bold text-lg group-hover:text-primary">${c.city}</div>
                <div class="text-sm text-base-content/60">${c.country}</div>
                <div class="text-xs text-base-content/40 mt-1">${Math.round(c.distance)} km away</div>
            </a>
        `;
        }).join('');

        // Generate Service Links for this City
        const serviceLinksHtml = services.map(service => {
            const serviceSlug = service.slug_pattern.replace('{{CITY_SLUG}}', normalizeCitySlug(cityData.slug));
            return `
            <a href="${serviceSlug}.html" class="flex items-center gap-4 p-4 rounded-xl bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-all group">
                <div class="text-2xl"><i data-lucide="${service.icon}"></i></div>
                <div>
                    <h3 class="font-bold group-hover:text-primary transition-colors">${service.name}</h3>
                    <p class="text-xs text-base-content/60">Available globally</p>
                </div>
            </a>`;
        }).join('');

        // Intro paragraph (unique per region, mentions city)
        const introParagraph = `We help B2B companies reach corporate enterprises, manufacturers, and industrial buyers across ${region}. Whether you're targeting decision-makers in ${city} or expanding across ${country}, our lead generation services deliver qualified sales meetings with buyers who have genuine interest and budget.`;

        // Common replacements
        const basePath = './';

        // Replace all placeholders
        content = content.replace(/\{\{CITY_NAME\}\}/g, city);
        content = content.replace(/\{\{COUNTRY_NAME\}\}/g, country);
        content = content.replace(/\{\{REGION_NAME\}\}/g, region);
        content = content.replace(/\{\{SERVICE_LINKS\}\}/g, serviceLinksHtml);
        content = content.replace(/\{\{HERO_IMAGE\}\}/g, image);
        content = content.replace(/\{\{CITY_SLUG\}\}/g, slug);
        content = content.replace(/\{\{NEARBY_CITIES\}\}/g, nearbyHtml);
        content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);

        if (!nearbyHtml.trim()) {
            content = removeEmptyNearbySection(content);
        }
        content = content.replace(/\{\{LATEST_BLOG_POSTS\}\}/g, latestBlogPosts.replace(/\{\{BASE_PATH\}\}/g, basePath));
        content = content.replace(/\{\{FOOTER\}\}/g, '');

        // Dynamic content from region
        content = content.replace(/\{\{TARGET_HEADLINE\}\}/g, regionData.targetHeadline);
        content = content.replace(/\{\{INTRO_PARAGRAPH\}\}/g, introParagraph);
        content = content.replace(/\{\{SERVICE_INTRO\}\}/g, regionData.serviceIntro);

        // 10 Target Industries
        regionData.industries.forEach((industry, i) => {
            content = content.replace(`{{TARGET_INDUSTRY_${i + 1}}}`, industry);
        });

        // 4 Insights
        regionData.insights.forEach((insight, i) => {
            content = content.replace(`{{INSIGHT_TITLE_${i + 1}}}`, insight.title);
            content = content.replace(`{{INSIGHT_TEXT_${i + 1}}}`, insight.text);
        });

        // 3 Market Stats
        regionData.marketStats.forEach((stat, i) => {
            content = content.replace(`{{MARKET_STAT_${i + 1}}}`, stat.stat);
            content = content.replace(`{{MARKET_STAT_DESC_${i + 1}}}`, stat.desc);
        });
        content = content.replace(/\{\{MARKET_CONTEXT\}\}/g, regionData.marketContext);

        // Navigation and Footer (EN)
        let pageNavigation = navigationEN;
        let pageFooter = footerEN;

        // Common replacements
        const logoPath = 'go-expandia-logo.png';
        htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);

        pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
        pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
        pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
        pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

        // Inject Content
        htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
        htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
        htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

        // Metadata
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, description);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, keywords);
        htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.goexpandia.com/${slug}.html`);

        // Hreflang URLs
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `${slug}.html`);

        // Enhanced Schema for City Page (B2B/Corporate focus)
        const schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `B2B Lead Generation Services in ${city}`,
            "provider": "Go Expandia",
            "areaServed": {
                "@type": "City",
                "name": city,
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": country
                }
            },
            "description": description,
            "audience": {
                "@type": "BusinessAudience",
                "audienceType": "B2B companies, corporate enterprises, manufacturers"
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "B2B Sales Services",
                "itemListElement": [
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Outbound Lead Generation" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Appointment Setting" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Account-Based Marketing" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "B2B List Building" } }
                ]
            }
        };

        // Schema - Aggregated
        const orgSchema = generateOrganizationSchema();
        let finalSchemas = [orgSchema, schema];

        extractedSchemas.forEach(s => {
            if (s["@type"] === "Organization" || s["@type"] === "Service") return;
            finalSchemas.push(s);
        });

        htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(finalSchemas, null, 2));
        htmlTemplate = clearUnresolvedTemplateTokens(htmlTemplate);

        // Write file
        fs.writeFileSync(`${slug}.html`, htmlTemplate, 'utf8');
    });
    console.log(`✅ Built ${cities.length} city pages with region-specific B2B content.`);
}


// -------------------------------------------------------------------------
// NEW: Build Industry Pages
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// REMOVED: Build Industry Landing Pages
// These generic industry pages have been removed in favor of city-specific pages
// -------------------------------------------------------------------------
/*
function buildIndustryPages() {
    console.log('\n🏗️  Building Industry Pages...');

    const templateContent = fs.readFileSync('templates/industry-landing.html', 'utf8');

    industries.forEach(industryData => {
        const lang = 'en';
        const name = industryData.name;
        const slug = industryData.slug;
        const image = industryData.image || './assets/local/default-industry.jpg';
        const title = industryData.title;
        const description = industryData.description;
        const keywords = `B2B lead generation ${name}, lead generation agency ${name}, appointment setting ${name}`;

        let htmlTemplate = createHTMLTemplate(lang);
        let content = templateContent;

        // Replace placeholders in content
        content = content.replace(/\{\{INDUSTRY_NAME\}\}/g, name);
        content = content.replace(/\{\{HERO_IMAGE\}\}/g, image);

        // Navigation and Footer (EN)
        let pageNavigation = navigationEN;
        let pageFooter = footerEN;

        // Common replacements
        const basePath = './';
        const logoPath = 'go-expandia-logo.png';

        pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
        pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
        pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
        pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

        // Inject Content
        htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
        htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
        htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

        // Metadata
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, description);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, keywords);
        htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.goexpandia.com/${slug}.html`);

        // Hreflang URLs
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `${slug}.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `${slug}.html`);

        // Schema
        const schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `B2B Lead Generation for ${name}`,
            "provider": { "@type": "Organization", "name": "Go Expandia", "url": "https://www.goexpandia.com" },
            "description": description,
            "audience": {
                "@type": "Audience",
                "audienceType": name
            }
        };
        htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(schema, null, 2));

        // Write file
        fs.writeFileSync(`${slug}.html`, htmlTemplate, 'utf8');
    });
    console.log(`✅ Built ${industries.length} industry pages.`);
}
*/


// -------------------------------------------------------------------------
// NEW: Build City Locations Page (Map)
// -------------------------------------------------------------------------
function buildCityLocationsPage() {
    console.log('\n🏗️  Building City Locations Page...');

    const templateContent = fs.readFileSync('templates/city-locations.html', 'utf8');
    const lang = 'en';

    // Prepare Head Content (Leaflet CSS)
    const headContent = `
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""/>
    <style>
        #map { height: 80vh; width: 100%; z-index: 1; }
        .city-marker { cursor: pointer; transition: all 0.3s ease; }
        .city-marker:hover { transform: scale(1.2); z-index: 1000; }
        .custom-popup { font-family: inherit; }
        .custom-popup h3 { color: #f9c23c; font-weight: bold; margin-bottom: 0.5rem; }
        .custom-popup a { color: #e86100; text-decoration: none; font-weight: 600; }
        .custom-popup a:hover { text-decoration: underline; }
        .map-container { position: relative; width: 100%; }
        .map-legend { position: absolute; top: 20px; right: 20px; background: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 200px; }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .legend-color { width: 20px; height: 20px; border-radius: 50%; }
    </style>`;

    // Prepare Script Content (Leaflet JS + Logic)
    // Transform cities data for JS and prepend main office (Delaware)
    const mainOffice = {
        name: 'Delaware Main Office',
        country: 'United States',
        lat: 39.7391,
        lng: -75.5398,
        url: './contact.html',
        region: 'Main Office',
        isMainOffice: true
    };
    const citiesForJs = [
        mainOffice,
        ...cities.map(c => ({
            name: c.city,
            country: c.country || '',
            lat: c.lat || 0,
            lng: c.lng || 0,
            url: `./${normalizeCitySlug(c.city)}.html`,
            region: c.region || 'Global',
            isMainOffice: false
        }))
    ];

    const scriptContent = `
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossorigin=""></script>
    <script>
        const cities = ${JSON.stringify(citiesForJs)};
        
        // Initialize map
        const map = L.map('map').setView([50, 10], 3);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);
        
        const regionColors = {
            'Main Office': '#111827',
            'DACH': '#cb102c',
            'Western Europe': '#e86100',
            'Southern Europe': '#ff6b35',
            'Scandinavia': '#4a90e2',
            'Eastern Europe': '#9b59b6',
            'North America': '#e74c3c',
            'Western Asia': '#16a085',
            'Europe': '#95a5a6'
        };

        function createCustomIcon(color, isMainOffice = false) {
            if (isMainOffice) {
                return L.divIcon({
                    className: 'city-marker',
                    html: \`<div style="width: 24px; height: 24px; background-color: \${color}; border: 3px solid white; border-radius: 0.4rem; box-shadow: 0 2px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700;">★</div>\`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
            }
            return L.divIcon({
                className: 'city-marker',
                html: \`<div style="width: 20px; height: 20px; background-color: \${color}; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.3s ease;"></div>\`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
        }

        cities.forEach(city => {
            if(city.lat === 0 && city.lng === 0) return;
            const color = regionColors[city.region] || '#ff6b35';
            const icon = createCustomIcon(color, city.isMainOffice);
            const marker = L.marker([city.lat, city.lng], { icon: icon }).addTo(map);
            const ctaLabel = city.isMainOffice ? 'Contact Main Office →' : 'View Services →';
            const subtitle = city.isMainOffice ? 'Main Office • Delaware' : city.region;
            
            const popupContent = \`
                <div class="custom-popup">
                    <h3>\${city.name}</h3>
                    <p style="margin: 0.25rem 0; color: #666;">\${city.country}</p>
                    <p style="margin: 0.25rem 0 0.5rem; color: #666;">\${subtitle}</p>
                    <a href="\${city.url}" style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1rem; background-color: #f9c23c; color: #000; border-radius: 0.25rem; font-weight: 600; text-decoration: none;">\${ctaLabel}</a>
                </div>
            \`;
            marker.bindPopup(popupContent);
            marker.on('mouseover', function() { this.openPopup(); });
        });

        const cityListContainer = document.getElementById('city-list');
        const mainOffice = cities.find(city => city.isMainOffice);
        const regularCities = cities.filter(city => !city.isMainOffice).sort((a, b) => a.name.localeCompare(b.name));
        const orderedCities = mainOffice ? [mainOffice, ...regularCities] : regularCities;

        orderedCities.forEach(city => {
            const cityCard = document.createElement('a');
            cityCard.href = city.url;
            cityCard.className = city.isMainOffice
                ? 'buzz-card p-4 border-2 border-primary/40 bg-primary/5 hover:scale-105 transition-transform cursor-pointer'
                : 'buzz-card p-4 hover:scale-105 transition-transform cursor-pointer';
            const listSubtitle = city.isMainOffice ? 'United States • Main Office (Delaware)' : \`\${city.country} • \${city.region}\`;
            const markerDot = city.isMainOffice
                ? \`<div class="w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold text-white" style="background-color: \${regionColors[city.region] || '#111827'};">★</div>\`
                : \`<div class="w-3 h-3 rounded-full" style="background-color: \${regionColors[city.region] || '#ff6b35'};"></div>\`;
            cityCard.innerHTML = \`
                <div class="flex items-center gap-3">
                    \${markerDot}
                    <div>
                        <h3 class="font-semibold">\${city.name}</h3>
                        <p class="text-sm text-base-content/60">\${listSubtitle}</p>
                    </div>
                </div>
            \`;
            cityListContainer.appendChild(cityCard);
        });
    </script>`;

    let htmlTemplate = createHTMLTemplate(lang, headContent, scriptContent);
    let content = templateContent.replace('{{CITY_COUNT}}', cities.length);

    // Navigation/Footer replacements... (standard)
    let pageNavigation = navigationEN;
    let pageFooter = footerEN;
    const basePath = './';
    const logoPath = 'go-expandia-logo.png';
    htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, 'vision-mission.html');
    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, 'our-ethical-principles.html');
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageNavigation = applyLanguageSwitcherLinks(pageNavigation, {
        en: './city-locations.html',
        de: './city-locations.html',
        fr: './city-locations.html'
    });
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);

    htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
    htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
    htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

    const pageMetadata = getPageMetadata('city-locations', lang);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, 'https://www.goexpandia.com/city-locations.html');
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, 'city-locations.html');
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, '');
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, 'city-locations.html');
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, 'city-locations.html');
    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, '{}'); // TODO: Add schema
    htmlTemplate = clearUnresolvedTemplateTokens(htmlTemplate);
    htmlTemplate = rewriteLegacyHrefTargets(htmlTemplate);

    fs.writeFileSync('city-locations.html', htmlTemplate, 'utf8');
    console.log(`✅ Built city-locations.html`);
}

function normalizeLanguageSwitchPlaceholders() {
    const roots = ['.', 'blog', 'glossary'];
    const htmlFiles = [];

    function collectHtmlFiles(dir) {
        if (!fs.existsSync(dir)) return;
        fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                collectHtmlFiles(fullPath);
                return;
            }
            if (entry.isFile() && entry.name.endsWith('.html')) {
                htmlFiles.push(fullPath);
            }
        });
    }

    roots.forEach(collectHtmlFiles);

    const fileSet = new Set(htmlFiles.map(file => file.replace(/\\/g, '/')));
    const hasFile = (candidate) => fileSet.has(candidate.replace(/\\/g, '/'));
    const tryResolveExistingHref = (normalizedPath, hrefValue) => {
        const [pathAndQuery, hashPart] = hrefValue.split('#');
        const [pathOnly, queryPart] = pathAndQuery.split('?');
        const clean = pathOnly;
        const tryPaths = [];
        const push = (candidate) => {
            if (candidate && !tryPaths.includes(candidate)) {
                tryPaths.push(candidate);
            }
        };

        push(clean);

        if (!clean.startsWith('./') && !clean.startsWith('../') && !clean.startsWith('/')) {
            for (let depth = 0; depth <= 3; depth += 1) {
                push(`${'../'.repeat(depth)}${clean}`);
            }
        }
        if (clean.startsWith('./')) {
            const localTarget = clean.slice(2);
            for (let depth = 1; depth <= 3; depth += 1) {
                push(`${'../'.repeat(depth)}${localTarget}`);
            }
        }

        push(clean.replace(/^(\.\.\/)de\//, '$1'));
        push(clean.replace(/^(\.\.\/)fr\//, '$1'));
        push(clean.replace(/^\.\/de\//, './'));
        push(clean.replace(/^\.\/fr\//, './'));
        push(clean.replace(/\/glossary\/solutions\.html$/, '/solutions.html'));
        if (!normalizedPath.includes('/') && clean.startsWith('../')) {
            push(clean.replace(/^(\.\.\/)+/, ''));
            push(`./${clean.replace(/^(\.\.\/)+/, '')}`);
        }

        for (const candidate of tryPaths) {
            const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(normalizedPath), candidate));
            if (hasFile(resolved)) {
                const withQuery = queryPart ? `${candidate}?${queryPart}` : candidate;
                return hashPart ? `${withQuery}#${hashPart}` : withQuery;
            }
        }
        return hrefValue;
    };

    const buildLinksForFile = (normalizedPath) => {
        const pathPosix = normalizedPath.replace(/\\/g, '/');
        const fileName = path.posix.basename(pathPosix);

        const blogMatch = pathPosix.match(/^(?:(de|fr)\/)?blog\/([^/]+\.html)$/);
        if (blogMatch) {
            const lang = blogMatch[1] || 'en';
            const slugFile = blogMatch[2];
            const enExists = hasFile(`blog/${slugFile}`);
            const deExists = hasFile(`de/blog/${slugFile}`);
            const frExists = hasFile(`fr/blog/${slugFile}`);
            const deIndexExists = hasFile('de/blog/index.html');
            const frIndexExists = hasFile('fr/blog/index.html');

            if (lang === 'en') {
                return {
                    en: `./${enExists ? slugFile : 'index.html'}`,
                    de: `./${enExists ? slugFile : 'index.html'}`,
                    fr: `./${enExists ? slugFile : 'index.html'}`
                };
            }
            if (lang === 'de') {
                return {
                    en: `../../blog/${enExists ? slugFile : 'index.html'}`,
                    de: `../../blog/${enExists ? slugFile : 'index.html'}`,
                    fr: `../../blog/${enExists ? slugFile : 'index.html'}`
                };
            }
            return {
                en: `../../blog/${enExists ? slugFile : 'index.html'}`,
                de: `../../blog/${enExists ? slugFile : 'index.html'}`,
                fr: `../../blog/${enExists ? slugFile : 'index.html'}`
            };
        }

        const glossaryMatch = pathPosix.match(/^(?:(de|fr)\/)?glossary\/([^/]+\.html)$/);
        if (glossaryMatch) {
            const lang = glossaryMatch[1] || 'en';
            const slugFile = glossaryMatch[2];
            const enExists = hasFile(`glossary/${slugFile}`);
            const deExists = hasFile(`de/glossary/${slugFile}`);
            const frExists = hasFile(`fr/glossary/${slugFile}`);

            if (lang === 'en') {
                return {
                    en: `./${enExists ? slugFile : 'index.html'}`,
                    de: `./${enExists ? slugFile : 'index.html'}`,
                    fr: `./${enExists ? slugFile : 'index.html'}`
                };
            }
            if (lang === 'de') {
                return {
                    en: `../../glossary/${enExists ? slugFile : 'index.html'}`,
                    de: `../../glossary/${enExists ? slugFile : 'index.html'}`,
                    fr: `../../glossary/${enExists ? slugFile : 'index.html'}`
                };
            }
            return {
                en: `../../glossary/${enExists ? slugFile : 'index.html'}`,
                de: `../../glossary/${enExists ? slugFile : 'index.html'}`,
                fr: `../../glossary/${enExists ? slugFile : 'index.html'}`
            };
        }

        const deRootMatch = pathPosix.match(/^de\/([^/]+\.html)$/);
        if (deRootMatch) {
            const slugFile = deRootMatch[1];
            return {
                en: `../${hasFile(slugFile) ? slugFile : 'index.html'}`,
                de: `../${hasFile(slugFile) ? slugFile : 'index.html'}`,
                fr: `../${hasFile(slugFile) ? slugFile : 'index.html'}`
            };
        }
        const frRootMatch = pathPosix.match(/^fr\/([^/]+\.html)$/);
        if (frRootMatch) {
            const slugFile = frRootMatch[1];
            return {
                en: `../${hasFile(slugFile) ? slugFile : 'index.html'}`,
                de: `../${hasFile(slugFile) ? slugFile : 'index.html'}`,
                fr: `../${hasFile(slugFile) ? slugFile : 'index.html'}`
            };
        }

        return {
            en: `./${fileName}`,
            de: `./${fileName}`,
            fr: `./${fileName}`
        };
    };

    htmlFiles.forEach(filePath => {
        const normalized = filePath.replace(/\\/g, '/');
        let html = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        const rewrittenLegacyLinks = rewriteLegacyHrefTargets(html);
        if (rewrittenLegacyLinks !== html) {
            html = rewrittenLegacyLinks;
            changed = true;
        }
        if (/href=["']#["']\s+data-lang="(en|de|fr)"/.test(html)) {
            html = applyLanguageSwitcherLinks(html, buildLinksForFile(normalized));
            changed = true;
        }

        html = html.replace(/href=(["'])([^"']+\.html(?:[?#][^"']*)?)\1/g, (match, quote, hrefValue) => {
            if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(hrefValue)) {
                return match;
            }
            const nextValue = tryResolveExistingHref(normalized, hrefValue);
            if (nextValue !== hrefValue) {
                changed = true;
                return `href=${quote}${nextValue}${quote}`;
            }
            return match;
        });

        if (changed) {
            fs.writeFileSync(filePath, html, 'utf8');
        }
    });
}

// -------------------------------------------------------------------------
// NEW: Generate Dynamic Sitemap
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// NEW: Build Glossary Pages
// -------------------------------------------------------------------------
function buildGlossaryTerms() {
    console.log('\n📖 Building Glossary Term Pages...');

    const templateContent = fs.readFileSync('templates/glossary-term.html', 'utf8');
    const languages = ['en'];

    languages.forEach(lang => {
        const glossaryIndexUrl = lang === 'en' ? 'glossary.html' : 'glossary.html'; // Relative path handling below

        glossary.forEach(termData => {
            let termName = termData.term;
            let definition = termData.definition;

            // Handle Translation
            if (lang !== 'en' && termData.translations && termData.translations[lang]) {
                termName = termData.translations[lang].term;
                definition = termData.translations[lang].definition;
            }

            // Fallback for missing translation
            if (!termName) termName = termData.term;
            if (!definition) definition = termData.definition;

            let htmlTemplate = createHTMLTemplate(lang);
            const res = extractAndRemoveSchemas(templateContent, `templates/glossary-term.html`);
            let content = res.cleanContent;
            const extractedSchemas = res.extractedSchemas;

            // Common Replacements
            content = content.replace(/\{\{TERM_NAME\}\}/g, termName);
            content = content.replace(/\{\{TERM_DEFINITION\}\}/g, definition);
            content = content.replace(/\{\{TERM_CATEGORY\}\}/g, termData.category);

            // Labels
            const labels = {
                en: { glossary: 'Glossary', related: 'Related Terms', ctaTitle: 'Ready to Scale?', ctaDesc: 'Let us help you implement these strategies.', ctaBtn: 'Get Started' },
                de: { glossary: 'Glossar', related: 'Verwandte Begriffe', ctaTitle: 'Bereit zu skalieren?', ctaDesc: 'Lassen Sie uns Ihnen bei der Umsetzung helfen.', ctaBtn: 'Loslegen' },
                fr: { glossary: 'Glossaire', related: 'Termes Connexes', ctaTitle: 'Prêt à évoluer ?', ctaDesc: 'Laissez-nous vous aider à mettre en œuvre ces stratégies.', ctaBtn: 'Commencer' },
                tr: { glossary: 'Sözlük', related: 'İlgili Terimler', ctaTitle: 'Büyümeye Hazır mısınız?', ctaDesc: 'Bu stratejileri uygulamanıza yardımcı olalım.', ctaBtn: 'Hemen Başla' }
            };
            const label = labels[lang] || labels['en'];

            content = content.replace(/\{\{GLOSSARY_LABEL\}\}/g, label.glossary);
            content = content.replace(/\{\{RELATED_TERMS_LABEL\}\}/g, label.related);
            content = content.replace(/\{\{CTA_TITLE\}\}/g, label.ctaTitle);
            content = content.replace(/\{\{CTA_DESCRIPTION\}\}/g, label.ctaDesc);
            content = content.replace(/\{\{CTA_BUTTON\}\}/g, label.ctaBtn);

            // Related Terms Logic (Random 3 from same category or random)
            const related = glossary
                .filter(t => t.slug !== termData.slug)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            const relatedHtml = related.map(t => {
                let rName = t.term;
                let rDef = t.definition;
                if (lang !== 'en' && t.translations && t.translations[lang]) {
                    rName = t.translations[lang].term;
                    rDef = t.translations[lang].definition;
                }
                const link = `./${t.slug}.html`; // Glossary structure is flat per lang folder
                return `
                <a href="${link}" class="buzz-card p-6 block hover:border-primary transition-colors group">
                    <h3 class="font-bold text-lg mb-2 group-hover:text-primary">${rName}</h3>
                    <p class="text-sm text-base-content/60 line-clamp-3">${rDef}</p>
                </a>`;
            }).join('');
            content = content.replace(/\{\{RELATED_TERMS_LIST\}\}/g, relatedHtml);


            // Navigation/Footer
            let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
            let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

            // Clean i18n
            pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
            pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

            // Glossary is in a subfolder 'glossary/' for EN? Or just 'glossary.html' and flat terms?
            // To support "Programmatic Glossary" scale (2000 pages), we should probably put them in a folder.
            // Let's say: en: /glossary/term.html, de: /de/glossary/term.html

            const basePath = (lang === 'en') ? '../' : '../../'; // glossary/ or lang/glossary/
            const logoPath = (lang === 'en') ? '../go-expandia-logo.png' : '../../go-expandia-logo.png';
            htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
            const turkishServicesPath = lang === 'tr' ? '../' : '../tr/'; // Adjusted for depth

            pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
            pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
            pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
            pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
            pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
            pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

            content = content.replace(/\{\{GLOSSARY_INDEX_URL\}\}/g, './index.html'); // Points to index inside glossary folder

            // Apply Translation Helper
            if (lang !== 'en') {
                pageNavigation = applyTranslations(pageNavigation, lang);
                pageFooter = applyTranslations(pageFooter, lang);
            }
            const termLangLinks = lang === 'en'
                ? {
                    en: `./${termData.slug}.html`,
                    de: `./${termData.slug}.html`,
                    fr: `./${termData.slug}.html`
                }
                : lang === 'de'
                    ? {
                        en: `../../glossary/${termData.slug}.html`,
                        de: `../../glossary/${termData.slug}.html`,
                        fr: `../../glossary/${termData.slug}.html`
                    }
                    : {
                        en: `../../glossary/${termData.slug}.html`,
                        de: `../../glossary/${termData.slug}.html`,
                        fr: `../../glossary/${termData.slug}.html`
                    };
            pageNavigation = applyLanguageSwitcherLinks(pageNavigation, termLangLinks);

            htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
            htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
            htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

            // Metadata
            const pageTitle = `${termName} | AI Business Glossary | Go Expandia`;
            const pageDesc = `Plain-language definition of ${termName} for teams using AI to improve revenue, costs, cash flow, and operations.`;

            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageTitle);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageDesc);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, `${termName} definition, AI glossary, business AI terms, AI operations glossary`);

            const canonicalSlug = lang === 'en' ? `glossary/${termData.slug}.html` : `${lang}/glossary/${termData.slug}.html`;
            htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.goexpandia.com/${canonicalSlug}`);

            // Hreflang
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `glossary/${termData.slug}.html`);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `tr/glossary/${termData.slug}.html`);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `glossary/${termData.slug}.html`);
            htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `glossary/${termData.slug}.html`);

            // Schema
            const definedTermSchema = {
                "@context": "https://schema.org",
                "@type": "DefinedTerm",
                "name": termName,
                "description": definition,
                "inDefinedTermSet": "https://www.goexpandia.com/glossary"
            };

            const faqSchema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [{
                    "@type": "Question",
                    "name": `What is ${termName}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": definition
                    }
                }]
            };

            // Schema - Aggregated
            const orgSchema = generateOrganizationSchema();
            let finalSchemas = [orgSchema, definedTermSchema, faqSchema];

            extractedSchemas.forEach(s => {
                if (s["@type"] === "Organization" || s["@type"] === "DefinedTerm" || s["@type"] === "FAQPage") return;
                finalSchemas.push(s);
            });

            htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(finalSchemas, null, 2));

            // Write File
            let outputDir;
            if (lang === 'en') {
                outputDir = 'glossary';
            } else {
                outputDir = `${lang}/glossary`;
            }

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            htmlTemplate = rewriteLegacyHrefTargets(htmlTemplate);
            fs.writeFileSync(`${outputDir}/${termData.slug}.html`, htmlTemplate, 'utf8');
        });
    });
    console.log(`✅ Built ${glossary.length * languages.length} Glossary Term pages.`);
}

function buildGlossaryIndex() {
    console.log('\n📖 Building Glossary Index Pages...');

    const templateContent = fs.readFileSync('templates/glossary-index.html', 'utf8');
    const languages = ['en'];

    languages.forEach(lang => {
        let htmlTemplate = createHTMLTemplate(lang);
        let content = templateContent;

        const labels = {
            en: {
                glossary: 'Glossary',
                title: 'AI Business Glossary',
                desc: 'Simple definitions for AI terms used in business operations, automation, and delivery.',
                ctaTitle: 'Ready to Scale?', ctaDesc: 'Let us help you implement these strategies.', ctaBtn: 'Get Started'
            },
            de: {
                glossary: 'Glossar',
                title: 'Business & Tech Glossar',
                desc: 'Umfassende Definitionen für Schlüsselbegriffe in B2B-Marketing, Vertrieb und Technologie.',
                ctaTitle: 'Bereit zu skalieren?', ctaDesc: 'Lassen Sie uns Ihnen bei der Umsetzung helfen.', ctaBtn: 'Loslegen'
            },
            fr: {
                glossary: 'Glossaire',
                title: 'Glossaire Business & Tech',
                desc: 'Définitions complètes des termes clés du marketing B2B, des ventes et de la technologie.',
                ctaTitle: 'Prêt à évoluer ?', ctaDesc: 'Laissez-nous vous aider à mettre en œuvre ces stratégies.', ctaBtn: 'Commencer'
            },
            tr: {
                glossary: 'Sözlük',
                title: 'İş ve Teknoloji Sözlüğü',
                desc: 'B2B pazarlama, satış ve teknoloji alanındaki temel terimler için kapsamlı tanımlar.',
                ctaTitle: 'Büyümeye Hazır mısınız?', ctaDesc: 'Bu stratejileri uygulamanıza yardımcı olalım.', ctaBtn: 'Hemen Başla'
            }
        };
        const label = labels[lang] || labels['en'];

        content = content.replace(/\{\{GLOSSARY_LABEL\}\}/g, label.glossary);
        content = content.replace(/\{\{PAGE_TITLE_TEXT\}\}/g, label.title);
        content = content.replace(/\{\{PAGE_DESCRIPTION_TEXT\}\}/g, label.desc);
        content = content.replace(/\{\{CTA_TITLE\}\}/g, label.ctaTitle);
        content = content.replace(/\{\{CTA_DESCRIPTION\}\}/g, label.ctaDesc);
        content = content.replace(/\{\{CTA_BUTTON\}\}/g, label.ctaBtn);

        // Build List
        // Group by letter or just list? For 2000 pages, we need grouping. But for now with 6 terms, just a list is fine.
        // Let's do a simple grid of cards.
        const listHtml = glossary.map(termData => {
            let termName = termData.term;
            let definition = termData.definition;
            if (lang !== 'en' && termData.translations && termData.translations[lang]) {
                termName = termData.translations[lang].term;
                definition = termData.translations[lang].definition;
            }
            if (!termName) termName = termData.term;
            if (!definition) definition = termData.definition;

            const link = `./${termData.slug}.html`;

            return `
             <a href="${link}" class="buzz-card p-6 block hover:border-primary transition-colors group" data-category="${termData.category}">
                <div class="text-sm text-primary mb-2 font-semibold tracking-wide">${termData.category}</div>
                <h3 class="font-bold text-xl mb-3 group-hover:text-primary">${termName}</h3>
                <p class="text-base-content/70 line-clamp-3">${definition}</p>
             </a>
             `;
        }).join('');

        content = content.replace(/\{\{GLOSSARY_LIST\}\}/g, listHtml);

        // Navigation/Footer
        let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
        let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

        pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
        pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

        const basePath = (lang === 'en') ? '../' : '../../';
        const logoPath = (lang === 'en') ? '../go-expandia-logo.png' : '../../go-expandia-logo.png';
        htmlTemplate = htmlTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
        const turkishServicesPath = lang === 'tr' ? '../' : '../tr/';

        pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
        pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
        pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
        pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
        pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);

        if (lang !== 'en') {
            pageNavigation = applyTranslations(pageNavigation, lang);
            pageFooter = applyTranslations(pageFooter, lang);
        }
        const indexLangLinks = lang === 'en'
            ? {
                en: './index.html',
                de: './index.html',
                fr: './index.html'
            }
            : lang === 'de'
                ? {
                    en: '../../glossary/index.html',
                    de: '../../glossary/index.html',
                    fr: '../../glossary/index.html'
                }
                : {
                    en: '../../glossary/index.html',
                    de: '../../glossary/index.html',
                    fr: '../../glossary/index.html'
                };
        pageNavigation = applyLanguageSwitcherLinks(pageNavigation, indexLangLinks);

        htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
        htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
        htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

        // Metadata
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, label.title + ' | Go Expandia');
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, label.desc);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, 'AI glossary, AI terms, business AI definitions, automation glossary');

        const canonicalSlug = lang === 'en' ? `glossary/index.html` : `${lang}/glossary/index.html`;
        htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, `https://www.goexpandia.com/${canonicalSlug}`);

        // Hreflang
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, `glossary/index.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, `tr/glossary/index.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, `glossary/index.html`);
        htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_FR\}\}/g, `glossary/index.html`);

        // Schema
        htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, '{}');

        // Write File
        let outputDir;
        if (lang === 'en') {
            outputDir = 'glossary';
        } else {
            outputDir = `${lang}/glossary`;
        }

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        htmlTemplate = rewriteLegacyHrefTargets(htmlTemplate);
        fs.writeFileSync(`${outputDir}/index.html`, htmlTemplate, 'utf8');
    });
    console.log(`✅ Built Glossary Index pages.`);
}

// -------------------------------------------------------------------------
// BUILD CITY LANDING PAGES (5-step AI business model)
// -------------------------------------------------------------------------
function buildCityLandingPages() {
    console.log('\n🏙️  Building Generic City Landing Pages (EN Only)...');

    // Use filtered city list (west of Ankara cutoff)
    const top250Cities = cities;
    const templateContent = fs.readFileSync('templates/city-landing.html', 'utf8');

    const languages = ['en'];
    let pageCount = 0;

    languages.forEach(lang => {
        top250Cities.forEach(cityData => {
            const city = cityData.city;
            const country = cityData.country;
            const region = cityData.region || 'Europe';
            const landmark = cityData.landmark || 'the city center';

            // Generate clean city slug from city name
            const citySlug = normalizeCitySlug(cityData.city);

            // Build page title and description
            const title = lang === 'de'
                ? `KI-Services in ${city} | 5 einfache Services | Go Expandia`
                : lang === 'fr'
                    ? `Services IA à ${city} | 5 services simples | Go Expandia`
                    : `AI Support Services in ${city} | 5 Simple Services | Go Expandia`;

            const description = lang === 'de'
                ? `Wir helfen Unternehmen in ${city} mit 5 einfachen KI-Services: Analyse, Plan, Build & Setup, Training und Support.`
                : lang === 'fr'
                    ? `Nous aidons les entreprises à ${city} avec 5 services IA simples : revue, plan, build & setup, formation et support.`
                    : `We help companies in ${city} with 5 simple AI services: review, plan, build & setup, training, and support.`;

            // Create page content
            const { cleanContent: content, extractedSchemas } = extractAndRemoveSchemas(templateContent, `templates/city-landing.html`);
            let htmlTemplate = content;

            // Replace placeholders
            htmlTemplate = htmlTemplate.replace(/{{PAGE_TITLE}}/g, title);
            htmlTemplate = htmlTemplate.replace(/{{PAGE_DESCRIPTION}}/g, description);
            htmlTemplate = htmlTemplate.replace(/{{CITY_NAME}}/g, city);
            htmlTemplate = htmlTemplate.replace(/{{COUNTRY_NAME}}/g, country);
            htmlTemplate = htmlTemplate.replace(/{{REGION_NAME}}/g, region);
            htmlTemplate = htmlTemplate.replace(/{{LANDMARK}}/g, landmark);
            const basePath = (lang === 'de' || lang === 'fr') ? '../' : './';
            htmlTemplate = htmlTemplate.replace(/{{BASE_PATH}}/g, basePath);
            htmlTemplate = htmlTemplate.replace(/{{VISION_MISSION_PAGE}}/g, 'vision-mission.html');
            htmlTemplate = htmlTemplate.replace(/{{ETHICAL_PRINCIPLES_PAGE}}/g, 'our-ethical-principles.html');
            htmlTemplate = htmlTemplate.replace(/\{\{\s*LATEST_BLOG_POSTS\s*\}\}/g, latestBlogPosts.replace(/{{BASE_PATH}}/g, basePath));
            htmlTemplate = htmlTemplate.replace(/\{\{\s*FOOTER\s*\}\}/g, '');

            // Generate and insert unique SEO content
            const uniqueContent = generateLocalizedCityContent(city, country, region, lang);
            htmlTemplate = htmlTemplate.replace(/{{UNIQUE_SEO_CONTENT}}/g, uniqueContent);
            const categoryCardsHtml = CITY_MODEL_SERVICES.map(serviceStep => {
                return `
                    <a href="${basePath}${serviceStep.slug}.html" class="buzz-card p-8 bg-white shadow-lg hover:shadow-xl transition-all block">
                        <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                            <i data-lucide="${serviceStep.icon}" class="w-6 h-6 text-primary"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">${serviceStep.title}</h3>
                        <p class="text-base-content/70 mb-0">${serviceStep.summary}</p>
                    </a>`;
            }).join('');
            htmlTemplate = htmlTemplate.replace(/{{SERVICE_LINKS}}/g, categoryCardsHtml);
            htmlTemplate = replaceCityLandingCopy(htmlTemplate, lang);

            // Schema.org - Use proper schema generator
            const orgSchema = generateOrganizationSchema();
            const cityCopy = getCityPageCopy(lang);

            const faqSchema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": cityCopy.faq.map(item => ({
                    "@type": "Question",
                    "name": item.q.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country).replace(/\{\{REGION_NAME\}\}/g, region),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.a.replace(/\{\{CITY_NAME\}\}/g, city).replace(/\{\{COUNTRY_NAME\}\}/g, country).replace(/\{\{REGION_NAME\}\}/g, region)
                    }
                }))
            };

            // Aggregate all schemas
            let finalSchemas = [orgSchema, faqSchema];
            extractedSchemas.forEach(s => {
                if (s["@type"] === "Organization" || s["@type"] === "FAQPage") return;
                finalSchemas.push(s);
            });

            // Create proper HTML template with head
            let fullHtmlTemplate = createHTMLTemplate(lang);
            fullHtmlTemplate = fullHtmlTemplate.replace(/\{\{\s*MAIN_CONTENT\s*\}\}/g, htmlTemplate);
            fullHtmlTemplate = fullHtmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, JSON.stringify(finalSchemas, null, 2));

            // Hero image
            const heroImage = (lang === 'de' || lang === 'fr')
                ? `../assets/local/default-city.jpg`
                : `./assets/local/default-city.jpg`;
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{HERO_IMAGE}}/g, heroImage);

            // Navigation/Footer (Simple placeholder replacement)
            let pageNavigation = lang === 'de' ? navigationDE : lang === 'fr' ? navigationFR : navigationEN;
            let pageFooter = lang === 'de' ? footerDE : lang === 'fr' ? footerFR : footerEN;

            // Clean i18n
            pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
            pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');

            const logoPath = (lang === 'de' || lang === 'fr') ? '../go-expandia-logo.png' : 'go-expandia-logo.png';
            pageNavigation = pageNavigation.replace(/{{BASE_PATH}}/g, basePath);
            pageNavigation = pageNavigation.replace(/{{VISION_MISSION_PAGE}}/g, 'vision-mission.html');
            pageNavigation = pageNavigation.replace(/{{ETHICAL_PRINCIPLES_PAGE}}/g, 'our-ethical-principles.html');
            pageNavigation = pageNavigation.replace(/{{LOGO_PATH}}/g, logoPath);
            const cityLangLinks = lang === 'en'
                ? {
                    en: `./${citySlug}.html`,
                    de: `./${citySlug}.html`,
                    fr: `./${citySlug}.html`
                }
                : lang === 'de'
                    ? {
                        en: `../${citySlug}.html`,
                        de: `../${citySlug}.html`,
                        fr: `../${citySlug}.html`
                    }
                    : {
                        en: `../${citySlug}.html`,
                        de: `../${citySlug}.html`,
                        fr: `../${citySlug}.html`
                    };
            pageNavigation = applyLanguageSwitcherLinks(pageNavigation, cityLangLinks);
            pageFooter = pageFooter.replace(/{{BASE_PATH}}/g, basePath);
            pageFooter = pageFooter.replace(/{{LOGO_PATH}}/g, logoPath);

            // Replace placeholders
            fullHtmlTemplate = fullHtmlTemplate.replace(/\{\{\s*NAVIGATION\s*\}\}/g, pageNavigation);
            fullHtmlTemplate = fullHtmlTemplate.replace(/\{\{\s*FOOTER\s*\}\}/g, pageFooter);
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{BASE_PATH}}/g, basePath);
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{LOGO_PATH}}/g, logoPath);

            // Metadata
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{PAGE_TITLE}}/g, title);
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{PAGE_DESCRIPTION}}/g, description);
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{PAGE_KEYWORDS}}/g, `AI support services ${city}, AI opportunity review ${city}, AI build and setup ${city}, AI training ${city}, AI support ${city}`);

            // Canonical URL
            const canonicalSlug = lang === 'en' ? `${citySlug}.html` : `${lang}/${citySlug}.html`;
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{CANONICAL_URL}}/g, `https://www.goexpandia.com/${canonicalSlug}`);

            // Hreflang
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{PAGE_URL_EN}}/g, `${citySlug}.html`);
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{PAGE_URL_DE}}/g, `${citySlug}.html`);
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{PAGE_URL_FR}}/g, `${citySlug}.html`);
            fullHtmlTemplate = fullHtmlTemplate.replace(/{{PAGE_URL_TR}}/g, ``);

            // Safety net: remove any unresolved {{TOKEN}} placeholders before writing.
            fullHtmlTemplate = clearUnresolvedTemplateTokens(fullHtmlTemplate);
            fullHtmlTemplate = rewriteLegacyHrefTargets(fullHtmlTemplate);

            // Output path
            const outputPath = lang === 'en' ? `${citySlug}.html` : `${lang}/${citySlug}.html`;

            // Ensure directory exists
            if (lang !== 'en') {
                if (!fs.existsSync(lang)) {
                    fs.mkdirSync(lang, { recursive: true });
                }
            }

            // Write file
            fs.writeFileSync(outputPath, fullHtmlTemplate, 'utf8');
            pageCount++;
        });
    });

    console.log(`✅ Built ${pageCount} generic city landing pages.`);
}

function generateSitemap() {
    console.log('\n🗺️  Generating Sitemap...');

    const baseUrl = 'https://www.goexpandia.com';
    const today = new Date().toISOString().split('T')[0];

    // List of static pages
    const staticPages = [
        'index.html', 'about.html', 'our-business-model.html', 'solutions.html', 'contact.html', 'city-locations.html',
        'vision-mission.html', 'our-ethical-principles.html'
    ];

    const legacyStaticPages = new Set(Object.keys(LEGACY_REDIRECT_TARGETS).map(page => `${page}.html`));
    const filteredStaticPages = staticPages.filter(page => !legacyStaticPages.has(page));

    const solutionPages = [];
    services.forEach(service => {
        solutionPages.push(`${service.id}.html`);
    });

    // Add DE/FR versions (removed TR as it's no longer supported)
    const languages = [];
    const localizedPages = [];
    languages.forEach(lang => {
        filteredStaticPages.forEach(page => {
            localizedPages.push(`${lang}/${page}`);
        });
    });

    // Add Broad City Landing Pages (EN, DE, FR) as built by buildCityLandingPages
    const broadCityPages = [];
    cities.forEach(cityData => {
        const citySlug = normalizeCitySlug(cityData.slug);
        broadCityPages.push(`${citySlug}.html`); // EN
    });

    // REMOVED: Industry Pages - buildIndustryPages() function is disabled
    // const industryPages = industries.map(i => `${i.slug}.html`);

    // REMOVED: Service x Industry x City Pages - too complex, focusing on Service x City only
    // const serviceIndustryCityPages = [];
    // services.forEach(service => {
    //     topIndustries.forEach(industry => {
    //         topCities.forEach(cityData => {
    //             const slug = `${service.slug_pattern.replace('-{{CITY_SLUG}}', '')}-${industry.slug}-${cityData.slug}`;
    //             serviceIndustryCityPages.push(`${slug}.html`); // EN
    //             serviceIndustryCityPages.push(`de/${slug}.html`); // DE
    //             serviceIndustryCityPages.push(`fr/${slug}.html`); // FR
    //         });
    //     });
    // });

    // Add Blog Pages
    const blogDir = 'templates/blog';
    let blogPages = [];
    if (fs.existsSync(blogDir)) {
        blogPages = fs.readdirSync(blogDir)
            .filter(file => file.endsWith('.html'))
            .map(file => `blog/${file}`);
    }

    // Add Glossary Pages
    const glossaryPages = [];
    glossary.forEach(term => {
        glossaryPages.push(`glossary/${term.slug}.html`); // EN
    });
    glossaryPages.push('glossary/index.html');

    const allPages = [...new Set([...filteredStaticPages, ...solutionPages, ...localizedPages, ...broadCityPages, ...blogPages, ...glossaryPages])];

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    allPages.forEach(page => {
        sitemapContent += `
    <url>
        <loc>${baseUrl}/${page}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === 'index.html' ? '1.0' : '0.8'}</priority>
    </url>`;
    });

    sitemapContent += `\n</urlset>`;

    fs.writeFileSync('sitemap.xml', sitemapContent);
    console.log(`✅ Generated sitemap.xml with ${allPages.length} URLs`);
}

function buildLegacyRedirectRules() {
    const languages = ['en'];
    const lines = [
        '# 301 Redirects for Deprecated Legacy Service URLs',
        '# Generated by build-pages.js. Keep these redirects long-term.',
        ''
    ];

    const forcedLegacyPaths = [
        { source: '/cold-calling-services.html', target: '/ai-opportunity-review.html' },
        { source: '/blog/why-speed-to-lead-matters.html', target: '/blog/index.html' },
        { source: '/blog/mastering-cold-email-deliverability.html', target: '/blog/cross-channel-lead-generation-guide.html' },
        { source: '/blog/psychological-triggers-sales.html', target: '/blog/marketing-psychology-guide.html' },
        { source: '/blog/sales-psychology-cialdini-principles-in-b2b.html', target: '/blog/marketing-psychology-guide.html' },
        { source: '/blog/lead-generation-strategies.html', target: '/blog/lead-generation-strategies-2026-complete-guide.html' },
        { source: '/blog/cross-channel-lead-generation-complete-guide.html', target: '/blog/cross-channel-lead-generation-guide.html' },
        { source: '/blog/digital-transformation-sales-operations.html', target: '/blog/pipeline-generation-complete-guide.html' },
        { source: '/blog/data-driven-sales-forecasting-methods.html', target: '/blog/pipeline-generation-complete-guide.html' },
        { source: '/blog/ai-lead-scoring-for-b2b-saas.html', target: '/blog/lead-scoring-saas-complete-guide.html' },
        { source: '/blog/ai-sales-forecasting-pipeline-accuracy.html', target: '/blog/pipeline-generation-complete-guide.html' },
        { source: '/blog/b2b-customer-acquisition-guide.html', target: '/blog/what-is-business-development-complete-guide.html' },
        { source: '/blog/sales-process-optimization-guide.html', target: '/blog/proposal-cpq-guide.html' },
        { source: '/blog/sales-process-engineering-optimization.html', target: '/blog/proposal-cpq-guide.html' },
        { source: '/blog/lead-nurturing-conversion.html', target: '/blog/cross-channel-lead-generation-guide.html' },
        { source: '/blog/ai-pricing-optimization-dynamic-discounts.html', target: '/blog/proposal-cpq-guide.html' },
        { source: '/blog/habit-formation-sales-process-compliance.html', target: '/blog/proposal-cpq-guide.html' },
        { source: '/blog/ai-cold-email-personalization-at-scale.html', target: '/blog/cross-channel-lead-generation-guide.html' },
        { source: '/blog/marketing-automation-lead-generation.html', target: '/blog/lead-generation-strategies-2026-complete-guide.html' },
        { source: '/blog/social-media-lead-generation.html', target: '/blog/cross-channel-lead-generation-guide.html' },
        { source: '/blog/advanced-negotiation-strategies-complex-deals.html', target: '/blog/sales-agent-europe-guide.html' },
        { source: '/blog/sales-as-a-service-guide.html', target: '/blog/outsourced-sales-management-europe-guide.html' },
        { source: '/blog/email-personalization-at-scale.html', target: '/blog/cross-channel-lead-generation-guide.html' },
        { source: '/blog/pricing-pilot-design-and-fees.html', target: '/blog/proposal-cpq-guide.html' },
        { source: '/blog/revenue-operations-optimization-strategies.html', target: '/blog/what-is-revops.html' }
    ];

    forcedLegacyPaths.forEach(({ source, target }) => {
        lines.push(`${source}  ${target}  301!`);
    });

    lines.push('');

    Object.entries(LEGACY_REDIRECT_TARGETS).forEach(([source, target]) => {
        if (!source || source === target) {
            return;
        }
        languages.forEach(lang => {
            const sourcePath = lang === 'en' ? `/${source}.html` : `/${lang}/${source}.html`;
            const targetPath = lang === 'en' ? `/${target}.html` : `/${lang}/${target}.html`;
            lines.push(`${sourcePath}  ${targetPath}  301`);
        });
    });

    cities.forEach(city => {
        const canonicalSlug = normalizeCitySlug(city.city || city.slug);
        const legacySlugs = new Set([
            city.slug,
            ...(Array.isArray(city.legacySlugs) ? city.legacySlugs : [])
        ]);

        legacySlugs.forEach((legacySlug) => {
            if (!legacySlug || legacySlug === canonicalSlug) return;
            languages.forEach(lang => {
                const sourcePath = lang === 'en' ? `/${legacySlug}.html` : `/${lang}/${legacySlug}.html`;
                const targetPath = lang === 'en' ? `/${canonicalSlug}.html` : `/${lang}/${canonicalSlug}.html`;
                lines.push(`${sourcePath}  ${targetPath}  301`);
            });
        });
    });

    PRIORITY_SERVICE_CITY_PATHS.forEach(sourceSlug => {
        const matchedCity = cities.find(city => {
            const cleanSlug = normalizeCitySlug(city.slug);
            return sourceSlug.endsWith(`-${cleanSlug}`);
        });

        if (!matchedCity) return;

        const cleanSlug = normalizeCitySlug(matchedCity.slug);
        languages.forEach(lang => {
            const sourcePath = lang === 'en' ? `/${sourceSlug}.html` : `/${lang}/${sourceSlug}.html`;
            const targetPath = lang === 'en' ? `/${cleanSlug}.html` : `/${lang}/${cleanSlug}.html`;
            lines.push(`${sourcePath}  ${targetPath}  301`);
        });
    });

    RETIRED_CITY_SLUGS.forEach((slug) => {
        languages.forEach((lang) => {
            const sourcePath = lang === 'en' ? `/${slug}.html` : `/${lang}/${slug}.html`;
            const targetPath = lang === 'en'
                ? `/${RETIRED_CITY_REDIRECT_TARGET}.html`
                : `/${lang}/${RETIRED_CITY_REDIRECT_TARGET}.html`;
            lines.push(`${sourcePath}  ${targetPath}  301`);
        });
    });

    return lines.join('\n') + '\n';
}

function writeRedirectsFile() {
    const redirectsPath = '_redirects';
    const legacyBlockStart = '# BEGIN AUTO-GENERATED LEGACY SERVICE REDIRECTS';
    const legacyBlockEnd = '# END AUTO-GENERATED LEGACY SERVICE REDIRECTS';
    const generatedBlock = `${legacyBlockStart}\n${buildLegacyRedirectRules()}${legacyBlockEnd}\n`;

    let existing = '';
    if (fs.existsSync(redirectsPath)) {
        existing = fs.readFileSync(redirectsPath, 'utf8');
        const legacyBlockRegex = new RegExp(`${legacyBlockStart}[\\s\\S]*?${legacyBlockEnd}\\n?`, 'm');
        existing = existing.replace(legacyBlockRegex, '').trimEnd();
    }

    const nextContent = `${existing}\n\n${generatedBlock}`.trimStart();
    fs.writeFileSync(redirectsPath, nextContent, 'utf8');
    console.log(`✅ Wrote legacy redirect rules to ${redirectsPath}`);
}

function cleanupLegacyRedirectOutputs() {
    const languages = ['en'];

    LEGACY_REDIRECT_ONLY_PAGES.forEach(page => {
        languages.forEach(lang => {
            const filePath = lang === 'en' ? `${page}.html` : `${lang}/${page}.html`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    });

    cities.forEach(city => {
        const canonicalSlug = normalizeCitySlug(city.city || city.slug);
        const legacySlugs = new Set([
            city.slug,
            ...(Array.isArray(city.legacySlugs) ? city.legacySlugs : [])
        ]);

        legacySlugs.forEach((legacySlug) => {
            if (!legacySlug || legacySlug === canonicalSlug) return;
            languages.forEach(lang => {
                const filePath = lang === 'en' ? `${legacySlug}.html` : `${lang}/${legacySlug}.html`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        });
    });

    PRIORITY_SERVICE_CITY_PATHS.forEach(sourceSlug => {
        languages.forEach(lang => {
            const filePath = lang === 'en' ? `${sourceSlug}.html` : `${lang}/${sourceSlug}.html`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    });

    RETIRED_CITY_SLUGS.forEach((slug) => {
        languages.forEach((lang) => {
            const filePath = lang === 'en' ? `${slug}.html` : `${lang}/${slug}.html`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    });
}


// --- EXECUTION ---

// Build English pages
console.log('Building English pages...');
buildPage('index', 'index', 'en');
buildPage('about', 'about', 'en');
buildPage('our-business-model', 'our-business-model', 'en');
buildPage('solutions', 'solutions', 'en');
buildPage('contact', 'contact', 'en');
buildPage('onboarding', 'onboarding', 'en');
buildPage('vision-mission', 'vision-mission', 'en');
buildPage('our-ethical-principles', 'our-ethical-principles', 'en');
// Build Approved Solution Pages (English)
services.forEach(service => buildSolutionPage(service.id, service.id, 'en'));

buildPage('blog-index', 'blog/index', 'en');

// Call new functions
buildCityLandingPages(); // NEW: Generic city pages showcasing all 19 services
// Deprecated for SEO migration: city pages now live on clean city slugs.
// buildCityPages();
// REMOVED: Industry landing pages - focusing on city-specific pages only
// buildIndustryPages();
// RETIRED: Service x City pages and legacy lead-gen city pages are no longer generated
// buildServiceCityPages();
// REMOVED: Service x Industry x City pages - too complex, focusing on Service x City only
// buildServiceIndustryCityPages();
buildCityLocationsPage();
buildBlogPosts();
buildGlossaryTerms(); // NEW
buildGlossaryIndex(); // NEW
normalizeLanguageSwitchPlaceholders();
generateSitemap();
cleanupLegacyRedirectOutputs();
writeRedirectsFile();

console.log('\n🎉 BUILD COMPLETE with enhanced SEO!');
console.log('📁 Generated files have been updated from templates/');
console.log('⚠️  REMEMBER: Always edit templates/, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for development guidelines');
console.log('🚀 Ready for deployment!\n');
