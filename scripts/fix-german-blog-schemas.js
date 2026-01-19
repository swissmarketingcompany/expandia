const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const GERMAN_FAQ_SCHEMA = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Wie schnell können wir mit der Zusammenarbeit beginnen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In der Regel können wir innerhalb von 1 bis 2 Wochen nach unserem Erstgespräch beginnen. Wir richten alles Notwendige ein und fangen schnell an, Ergebnisse zu liefern."
      }
    },
    {
      "@type": "Question",
      "name": "Was unterscheidet Expandia von anderen Agenturen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wir kombinieren tiefgreifende Expertise im europäischen Markt mit datengesteuerten Strategien und Mehrsprachigkeit. Unser Team verfügt über mehr als 8 Jahre Erfahrung darin, Unternehmen bei der internationalen Skalierung zu unterstützen."
      }
    },
    {
      "@type": "Question",
      "name": "Arbeiten Sie mit Unternehmen jeder Größe zusammen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja, wir arbeiten mit Start-ups, KMU und Konzernen zusammen. Unsere Lösungen sind skalierbar und auf Ihre spezifischen Geschäftsanforderungen und Wachstumsphasen zugeschnitten."
      }
    },
    {
      "@type": "Question",
      "name": "Wie sieht Ihr Preismodell aus?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wir bieten eine flexible Preisgestaltung an, die auf Ihren spezifischen Bedürfnissen und Gielen basiert. Kontaktieren Sie uns für ein kostenloses Beratungsgespräch und ein individuelles Angebot, das auf Ihre Geschäftsziele zugeschnitten ist."
      }
    },
    {
      "@type": "Question",
      "name": "Wie messen Sie den Erfolg?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wir konzentrieren uns auf messbare KPIs wie Lead-Generierung, Konversionsraten, ROI und Auswirkungen auf den Umsatz. Sie erhalten detaillierte Analysen und regelmäßige Leistungsberichte."
      }
    }
  ]
}
</script>`;

const ENGLISH_FAQ_START = '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "How quickly can we start working together?"';

const processFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace English FAQ Schema
    if (content.includes('How quickly can we start working together?')) {
        // Find the start and end of the FAQ schema
        const startIndex = content.lastIndexOf('<script type="application/ld+json">', content.indexOf('How quickly can we start working together?'));
        const endIndex = content.indexOf('</script>', startIndex) + 9;

        if (startIndex !== -1 && endIndex !== -1) {
            content = content.substring(0, startIndex) + GERMAN_FAQ_SCHEMA + content.substring(endIndex);
            modified = true;
        }
    }

    // Fix Breadcrumbs to be more German
    if (content.includes('"name": "Home"')) {
        // Leave Home as is, it's fine in German context too
    }

    // If the breadcrumb title is slugified English, let's try to capitalize it better or at least translate some words
    // But safely, only if it's clearly English
    content = content.replace(/"name": "Blog"/g, '"name": "Blog"'); // Safe

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
    } else {
        console.log(`⏭️  Skipped: ${filePath}`);
    }
};

const main = async () => {
    const blogDir = '/Users/oguzhanocak/Downloads/expandia_web_2026/expandia/templates/de/blog/';
    const files = await glob(`${blogDir}*.html`);
    console.log(`Found ${files.length} blog files. Starting fix...`);
    files.forEach(processFile);
    console.log('Done!');
};

main();
