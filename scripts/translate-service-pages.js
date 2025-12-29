#!/usr/bin/env node

/**
 * Translate Service Pages to German and French
 * This script translates English content in DE and FR folders
 */

const fs = require('fs');
const path = require('path');

// Translation dictionaries
const translations = {
    de: {
        // Common phrases
        'Predictable Pipeline': 'Vorhersehbare Pipeline',
        'On Demand': 'Auf Abruf',
        'View Packages': 'Pakete ansehen',
        'Custom Strategy': 'Individuelle Strategie',
        'Meetings Booked': 'Gebuchte Meetings',
        'Show Rate': 'Teilnahmequote',
        'Avg. Ramp Up': 'Durchschn. Anlaufzeit',
        'Client Rating': 'Kundenbewertung',
        'Get Started': 'Jetzt starten',
        'Learn More': 'Mehr erfahren',
        'Contact Us': 'Kontaktieren Sie uns',
        'Get Free Consultation': 'Kostenlose Beratung erhalten',

        // Recruitment page
        'Talent Without Borders': 'Talente ohne Grenzen',
        'Global Talent Solutions': 'Globale Talent-Lösungen',
        'We bridge the gap between world-class talent and high-growth companies. Precision headhunting, compliant staffing, and executive assistance—all in one place.': 'Wir schließen die Lücke zwischen erstklassigen Talenten und wachstumsstarken Unternehmen. Präzises Headhunting, konforme Personalbesetzung und Executive Assistance – alles an einem Ort.',
        'Hire Top Talent': 'Top-Talente einstellen',
        'Specialized Headhunting': 'Spezialisiertes Headhunting',
        'We don\'t search. We find.': 'Wir suchen nicht. Wir finden.',
        'Our recruiters specialize in high-impact roles for tech, sales, and operations. We use a data-driven approach combined with deep human networking to find candidates that aren\'t even looking.': 'Unsere Recruiter sind auf wirkungsvolle Positionen in Tech, Vertrieb und Operations spezialisiert. Wir nutzen einen datengesteuerten Ansatz kombiniert mit tiefem menschlichem Networking, um Kandidaten zu finden, die nicht einmal suchen.',

        // Website Care Plans
        'Website Care': 'Website-Pflege',
        'Performance Plans': 'Performance-Pläne',
        'Your website is your most valuable 24/7 salesperson. We keep it fast, secure, and fully optimized while you focus on closing deals.': 'Ihre Website ist Ihr wertvollster 24/7-Verkäufer. Wir halten sie schnell, sicher und vollständig optimiert, während Sie sich auf den Geschäftsabschluss konzentrieren.',
        'Compare Plans': 'Pläne vergleichen',
        'Get Free Speed Audit': 'Kostenlose Geschwindigkeitsanalyse erhalten',
        'Real-time Security': 'Echtzeit-Sicherheit',
        'Performance Monitoring': 'Performance-Überwachung',
        'SEO Optimization': 'SEO-Optimierung',
        'Content Updates': 'Inhalts-Updates',

        // Lead Generation
        'We don\'t just find leads. We engineer conversations. Our data-driven approach delivers a consistent flow of qualified meetings directly to your sales team.': 'Wir finden nicht nur Leads. Wir gestalten Gespräche. Unser datengesteuerter Ansatz liefert einen konstanten Fluss qualifizierter Meetings direkt an Ihr Vertriebsteam.',

        // Common buttons and CTAs
        'Book a Demo': 'Demo buchen',
        'Request Quote': 'Angebot anfordern',
        'Free Trial': 'Kostenlose Testversion',
        'Schedule Call': 'Anruf vereinbaren'
    },

    fr: {
        // Common phrases
        'Predictable Pipeline': 'Pipeline Prévisible',
        'On Demand': 'Sur Demande',
        'View Packages': 'Voir les forfaits',
        'Custom Strategy': 'Stratégie personnalisée',
        'Meetings Booked': 'Réunions réservées',
        'Show Rate': 'Taux de présence',
        'Avg. Ramp Up': 'Démarrage moyen',
        'Client Rating': 'Évaluation client',
        'Get Started': 'Commencer',
        'Learn More': 'En savoir plus',
        'Contact Us': 'Contactez-nous',
        'Get Free Consultation': 'Obtenir une consultation gratuite',

        // Recruitment page
        'Talent Without Borders': 'Talents Sans Frontières',
        'Global Talent Solutions': 'Solutions de Talents Globales',
        'We bridge the gap between world-class talent and high-growth companies. Precision headhunting, compliant staffing, and executive assistance—all in one place.': 'Nous comblons le fossé entre les talents de classe mondiale et les entreprises à forte croissance. Chasse de têtes de précision, dotation conforme et assistance exécutive – tout en un seul endroit.',
        'Hire Top Talent': 'Recruter les meilleurs talents',
        'Specialized Headhunting': 'Chasse de têtes spécialisée',
        'We don\'t search. We find.': 'Nous ne cherchons pas. Nous trouvons.',
        'Our recruiters specialize in high-impact roles for tech, sales, and operations. We use a data-driven approach combined with deep human networking to find candidates that aren\'t even looking.': 'Nos recruteurs se spécialisent dans les rôles à fort impact pour la tech, les ventes et les opérations. Nous utilisons une approche basée sur les données combinée à un réseau humain profond pour trouver des candidats qui ne cherchent même pas.',

        // Website Care Plans
        'Website Care': 'Maintenance de site Web',
        'Performance Plans': 'Plans de performance',
        'Your website is your most valuable 24/7 salesperson. We keep it fast, secure, and fully optimized while you focus on closing deals.': 'Votre site Web est votre vendeur 24/7 le plus précieux. Nous le maintenons rapide, sécurisé et entièrement optimisé pendant que vous vous concentrez sur la conclusion de contrats.',
        'Compare Plans': 'Comparer les plans',
        'Get Free Speed Audit': 'Obtenir un audit de vitesse gratuit',
        'Real-time Security': 'Sécurité en temps réel',
        'Performance Monitoring': 'Surveillance des performances',
        'SEO Optimization': 'Optimisation SEO',
        'Content Updates': 'Mises à jour de contenu',

        // Lead Generation
        'We don\'t just find leads. We engineer conversations. Our data-driven approach delivers a consistent flow of qualified meetings directly to your sales team.': 'Nous ne trouvons pas seulement des prospects. Nous créons des conversations. Notre approche basée sur les données fournit un flux constant de réunions qualifiées directement à votre équipe de vente.',

        // Common buttons and CTAs
        'Book a Demo': 'Réserver une démo',
        'Request Quote': 'Demander un devis',
        'Free Trial': 'Essai gratuit',
        'Schedule Call': 'Planifier un appel'
    }
};

// Files to translate
const filesToTranslate = [
    'lead-generation-service.html',
    'recruitment.html',
    'website-care-plans.html',
    'ai-creative-studio.html',
    'email-security.html',
    'vulnerability-assessments.html',
    'managed-it-services.html',
    'usa-pr-service.html',
    'international-market-entry.html',
    'lost-lead-reactivation.html',
    'revops-crm-setup.html',
    'speed-to-lead.html'
];

const translateContent = (content, lang) => {
    let translated = content;
    const dict = translations[lang];

    // Replace each phrase
    Object.entries(dict).forEach(([english, translation]) => {
        // Use regex with word boundaries for more accurate replacement
        const regex = new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        translated = translated.replace(regex, translation);
    });

    return translated;
};

const processFile = (filePath, lang) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⏭️  Skipped (not found): ${filePath}`);
            return { skipped: true };
        }

        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Translate the content
        content = translateContent(content, lang);

        // Only write if content changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Translated (${lang}): ${path.basename(filePath)}`);
            return { success: true };
        } else {
            console.log(`⏭️  No changes needed: ${path.basename(filePath)}`);
            return { skipped: true };
        }

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return { error: true };
    }
};

const main = () => {
    console.log('🌍 Starting Translation Process...\n');

    const baseDir = '/Users/oguzhanocak/Downloads/expandia_web_2026/expandia/templates';
    const languages = ['de', 'fr'];

    const stats = {
        total: 0,
        success: 0,
        skipped: 0,
        errors: 0
    };

    languages.forEach(lang => {
        console.log(`\n📝 Processing ${lang.toUpperCase()} files...`);

        filesToTranslate.forEach(file => {
            const filePath = path.join(baseDir, lang, file);
            stats.total++;

            const result = processFile(filePath, lang);
            if (result.success) stats.success++;
            else if (result.skipped) stats.skipped++;
            else if (result.error) stats.errors++;
        });
    });

    console.log('\n' + '='.repeat(60));
    console.log('✨ TRANSLATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files processed: ${stats.total}`);
    console.log(`✅ Translated:         ${stats.success}`);
    console.log(`⏭️  Skipped:            ${stats.skipped}`);
    console.log(`❌ Errors:             ${stats.errors}`);
    console.log('='.repeat(60));
    console.log('\n🎉 Translation complete!');
};

main();
