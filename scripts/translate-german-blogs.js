const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const TRANSLATIONS = {
    ai: {
        intro: 'Die Zukunft der Inhalte ist KI. Unser KI-Kreativstudio hilft zukunftsorientierten Marken dabei, hyper-realistische Video-, Audio- und visuelle Inhalte in großem Umfang zu generieren. Hören Sie auf zu filmen, fangen Sie an zu generieren.',
        challenges: [
            'Hohe Kosten für herkömmliche Videoproduktion',
            'Skarilierungsschwierigkeiten bei Videoinhalten für Social Media',
            'Sprachbarrieren, die die globale Reichweite einschränken',
            'Zeitliche Einschränkungen des Managements für Videoaufnahmen',
            'Inkonsistente Markenbotschaften in verschiedenen Regionen',
            'Langsame Durchlaufzeiten für die Erstellung von Assets',
            'Hohe Kosten für professionelle Synchronsprecher',
            'Schwierigkeit, Schulungsmaterialien aktuell zu halten',
            'Geringes Engagement bei rein textbasierten Inhalten',
            'Bedarf an personalisierter Video-Ansprache im großen Stil'
        ],
        benefits: [
            '<strong>Inhalte 10x skalieren:</strong> Mehr Videos in kürzerer Zeit produzieren.',
            '<strong>Globale Reichweite:</strong> Videos in über 30 Sprachen übersetzen und synchronisieren.',
            '<strong>Kosteneffizienz:</strong> Ein Bruchteil der Kosten einer physischen Produktion.',
            '<strong>Konsistenz:</strong> Ihr digitaler Zwilling ist immer Marken-konform und kamerabereit.',
            '<strong>Personalisierung:</strong> Erstellen Sie Tausende personalisierte Videos für Interessenten.',
            '<strong>Geschwindigkeit:</strong> Verwandeln Sie Skripte in Minuten statt Tagen in fertige Videos.',
            '<strong>Engagement:</strong> Steigern Sie die Konversionsraten mit Rich Media.',
            '<strong>Innovation:</strong> Positionieren Sie Ihre Marke in Ihrer Stadt als Technologieführer.'
        ],
        insights: 'Bei Expandia sind wir spezialisiert auf KI-Kreativstudios. Unsere Lösungen sind darauf ausgelegt, genau diese Herausforderungen anzugehen und messbares Wachstum für Ihr Unternehmen zu generieren.',
        faqs: [
            { q: 'Wie realistisch sind die KI-Avatare?', a: 'Extrem realistisch. Wir nutzen die neuesten generativen KI-Modelle, um Avatare zu erstellen, die Mikro-Expressionen und natürliche Bewegungen einfangen, die in vielen Kontexten nicht von echten Videos zu unterscheiden sind.' },
            { q: 'Können Sie meine bestehenden Videoinhalte lokalisieren?', a: 'Ja, wir können Ihre bestehenden Inhalte nehmen und sie in Sprachen wie Deutsch, Französisch oder Spanisch synchronisieren, wobei die Lippenbewegungen an die neue Sprache angepasst werden.' },
            { q: 'Ist dies für Unternehmensschulungen in Ihrer Stadt geeignet?', a: 'Absolut. Es ermöglicht Ihnen, Schulungsmodule sofort zu aktualisieren, indem Sie einfach das Textskript ändern, anstatt den Trainer neu aufzunehmen.' }
        ]
    },
    it: {
        intro: 'In der schnelllebigen Geschäftswelt von heute ist eine zuverlässige IT-Infrastruktur kein Luxus – sie ist eine Notwendigkeit. Unternehmen setzen verstärkt auf Managed IT Services, um ihre Abläufe zu rationalisieren, die Sicherheit zu erhöhen und Kosten planbar zu machen.',
        challenges: [
            'Unvorhersehbare IT-Kosten, die Ihr Budget belasten',
            'Häufige Systemausfälle, die die Produktivität stören',
            'Mangel an internem IT-Expertenwissen für komplexe Probleme',
            'Wachsende Cybersicherheitsbedrohungen und Compliance-Anforderungen',
            'Langsame Reaktionszeiten bei aktuellen Support-Anbietern',
            'Schwierigkeiten bei der Skalierung der Technik mit dem Unternehmenswachstum',
            'Veraltete Hard- und Software, die Mitarbeiter ausbremst',
            'Sorgen um Datensicherung und Disaster Recovery',
            'Ineffiziente Cloud-Migrationsstrategien',
            'Mangel an strategischer IT-Planung für die Zukunft'
        ],
        benefits: [
            '<strong>Planbare monatliche Kosten:</strong> Wechseln Sie von CapEx zu OpEx mit Pauschalpreisen.',
            '<strong>24/7/365 Überwachung:</strong> Wir erkennen Probleme, bevor sie zu Ausfällen führen.',
            '<strong>Erhöhte Sicherheit:</strong> Schutz auf Enterprise-Niveau für Ihre Daten und Ihr Netzwerk.',
            '<strong>Zugang zu Experten:</strong> Spezialisierte Talente ohne die hohen Einstellungskosten.',
            '<strong>Fokus auf das Kerngeschäft:</strong> Wir kümmern uns um die Technik, während Sie wachsen.',
            '<strong>Skalierbarkeit:</strong> Services, die mit Ihrem Unternehmen in Ihrer Stadt mitwachsen.',
            '<strong>Einhaltung von Compliance:</strong> Wir unterstützen Sie bei DSGVO, nFADP und anderen Standards.',
            '<strong>Anbietermanagement:</strong> Wir koordinieren ISPs, Software- und Hardwarehersteller.'
        ],
        insights: 'Bei Expandia sind wir spezialisiert auf Managed IT. Unsere Lösungen sind darauf ausgelegt, genau diese Herausforderungen anzugehen und messbares Wachstum für Ihr Unternehmen zu generieren.',
        faqs: [
            { q: 'Was ist in Ihren Managed IT Services für Unternehmen enthalten?', a: 'Unsere Pakete umfassen 24/7-Überwachung, Helpdesk-Support, Cyberschutz, Patch-Management, Backup-Lösungen und strategische vCIO-Beratung.' },
            { q: 'Wie schnell ist Ihre Reaktionszeit?', a: 'Wir garantieren Reaktionszeiten basierend auf der Priorität, oft innerhalb von 15 Minuten bei kritischen Problemen. Unsere lokale Präsenz ermöglicht vor-Ort-Support, falls Remote nicht ausreicht.' },
            { q: 'Unterstützen Sie auch Remote-Mitarbeiter?', a: 'Ja, unsere Support-Infrastruktur ist Cloud-optimiert. Wir können Ihr Team unterstützen, egal ob sie in Ihrer Stadt oder weltweit arbeiten.' }
        ]
    },
    recruitment: {
        intro: 'Top-Talente zu finden ist heute eine große Herausforderung. Unsere B2B-Recruiting-Services sind darauf spezialisiert, hochkarätige Kandidaten für Vertrieb, Technik und Führungspositionen zu finden, die Ihr Unternehmen voranbringen.',
        challenges: [
            'Lange Einstellungszeiten, die das Wachstum bremsen',
            'Geringe Qualität der Bewerber von Jobbörsen',
            'Kandidaten, die während des Interviewprozesses abtauchen',
            'Hohe Fluktuationsraten in Vertriebsteams',
            'Schwierigkeit bei der Bewertung technischer Fähigkeiten',
            'Mangelndes Employer Branding im lokalen Markt',
            'Herausforderungen bei Gehaltsverhandlungen',
            'Kulturelle Unstimmigkeiten bei Neueinstellungen',
            'Zeitverschwendung durch die Sichtung unqualifizierter Lebensläufe',
            'Wettbewerb mit großen Tech-Giganten'
        ],
        benefits: [
            '<strong>Zugang zu passiven Kandidaten:</strong> Wir erreichen die 70% der Talente, die nicht aktiv suchen.',
            '<strong>Strenges Screening:</strong> Wir prüfen Kandidaten intensiv, bevor Sie sie kennenlernen.',
            '<strong>Branchenexpertise:</strong> Wir sprechen die Sprache von Vertrieb und Technik.',
            '<strong>Schnellere Einstellungen:</strong> Reduzieren Sie Ihre Besetzungszeit um bis zu 50%.',
            '<strong>Fokus auf Retention:</strong> Wir achten auf kulturelle Passung und langfristigen Erfolg.',
            '<strong>Marktkenntnisse:</strong> Erhalten Sie Daten zu Gehalts- und Einstellungstrends.',
            '<strong>Risikominimierung:</strong> Nachbesetzungsgarantien für alle Vermittlungen.',
            '<strong>Skalierbarer Support:</strong> Besetzen Sie eine Schlüsselrolle oder bauen Sie eine ganze Abteilung auf.'
        ],
        insights: 'Bei Expandia sind wir spezialisiert auf Recruiting. Unsere Lösungen sind darauf ausgelegt, genau diese Herausforderungen anzugehen und messbares Wachstum für Ihr Unternehmen zu generieren.',
        faqs: [
            { q: 'Auf welche Rollen sind Sie spezialisiert?', a: 'Wir konzentrieren uns primär auf B2B-Vertrieb (SDR, AE, VP Sales), Marketing, Customer Success und technische Rollen (Software-Entwickler, DevOps, CTOs).' },
            { q: 'Wie finden Sie Kandidaten?', a: 'Wir nutzen eine Mischung aus KI-gestütztem Sourcing, direktem Headhunting auf LinkedIn und unserer eigenen Datenbank vor-geprüfter Profis.' },
            { q: 'Wie sieht Ihre Gebührenstruktur aus?', a: 'Wir arbeiten meist erfolgsbasiert, das heißt, Sie zahlen nur, wenn wir erfolgreich den richtigen Kandidaten für Sie finden.' }
        ]
    },
    revops: {
        intro: 'Revenue Operations (RevOps) ist der Motor für Wachstum. Die Ausrichtung von Vertrieb, Marketing und Customer Success ist heute entscheidend. Unsere RevOps-Beratung optimiert Ihren Tech-Stack und Ihre Prozesse.',
        challenges: [
            'Streit zwischen Vertriebs- und Marketingteams über Lead-Qualität',
            'Unordentliche CRM-Daten und doppelte Datensätze',
            'Mangelnde Transparenz in der Sales-Pipeline',
            'Manuelle Dateneingabe, die Zeit im Vertrieb verschwendet',
            'Ungenaues Revenue Forecasting (Umsatzprognosen)',
            'Tools, die nicht miteinander kommunizieren (Tech-Stack-Wildwuchs)',
            'Leads, die im Prozess verloren gehen',
            'Inkonsistente Verkaufsprozesse',
            'Schwierigkeiten bei der ROI-Messung von Marketingkampagnen',
            'Einarbeitungszeit neuer Vertriebsmitarbeiter ist zu lang'
        ],
        benefits: [
            '<strong>Alignment:</strong> Bringen Sie alle Abteilungen auf den gleichen Kurs.',
            '<strong>Effizienz:</strong> Automatisieren Sie manuelle Aufgaben und Workflows.',
            '<strong>Sichtbarkeit:</strong> Präzise Dashboards und Berichterstattung.',
            '<strong>Skalierbarkeit:</strong> Prozesse, die auch bei schnellem Wachstum stabil bleiben.',
            '<strong>Datenhygiene:</strong> Saubere, verlässliche Daten, denen Sie vertrauen können.',
            '<strong>Umsatzwachstum:</strong> Optimierte Funnel führen zu mehr abgeschlossenen Deals.',
            '<strong>Bessere CX:</strong> Nahtlose Übergaben zwischen den Abteilungen.',
            '<strong>Tech-Optimierung:</strong> Holen Sie das Beste aus Ihrer teuren Software heraus.'
        ],
        insights: 'Bei Expandia sind wir spezialisiert auf RevOps. Unsere Lösungen sind darauf ausgelegt, genau diese Herausforderungen anzugehen und messbares Wachstum für Ihr Unternehmen zu generieren.',
        faqs: [
            { q: 'Arbeiten Sie mit HubSpot oder Salesforce?', a: 'Wir sind Experten für beide Plattformen. Wir unterstützen bei Implementierung, Migration, Bereinigung und komplexer Automatisierung.' },
            { q: 'Was ist der erste Schritt für ein lokales Unternehmen?', a: 'Wir beginnen mit einem umfassenden Audit Ihres aktuellen Tech-Stacks, der Datenqualität und der Team-Workflows.' },
            { q: 'Wie unterscheidet sich RevOps von Sales Ops?', a: 'Sales Ops konzentriert sich nur auf den Vertrieb. RevOps bricht Silos auf und betrachtet den gesamten Kundenlebenszyklus.' }
        ]
    },
    gifting: {
        intro: 'Firmengeschenke sind ein mächtiges Instrument für den Beziehungsaufbau. In der digitalen Welt von heute helfen wir Marken dabei, einen bleibenden Eindruck zu hinterlassen, der über das Übliche hinausgeht.',
        challenges: [
            'Messung des ROI von Gifting-Kampagnen',
            'Logistischer Aufwand beim Versand von Geschenken',
            'Auswahl von Geschenken, die wirklich relevant sind',
            'Einhaltung von Compliance-Richtlinien',
            'Personalisierung in großem Maßstab',
            'Mangel an Daten über Empfängerpräferenzen',
            'Hohe Versandkosten und Zollprobleme',
            'Unkoordinierte Gifting-Aktionen in verschiedenen Teams',
            'Schwierigkeit, den richtigen Moment für ein Geschenk zu finden',
            'Veraltete Gifting-Strategien, die nicht mehr wirken'
        ],
        benefits: [
            '<strong>Kundenbindung:</strong> Stärken Sie Beziehungen durch Wertschätzung.',
            '<strong>Markendifferenzierung:</strong> Heben Sie sich von der Konkurrenz ab.',
            '<strong>Automatisierung:</strong> Versenden Sie Geschenke direkt aus Ihrem CRM.',
            '<strong>Globale Logistik:</strong> Wir kümmern uns um den Versand weltweit.',
            '<strong>Nachhaltigkeit:</strong> Auswahl an umweltfreundlichen Geschenken.',
            '<strong>Höhere Conversion:</strong> Nutzen Sie Gifting, um Termine zu buchen.',
            '<strong>Compliance-Sicherheit:</strong> Alle Aktionen entsprechen Ihren Richtlinien.',
            '<strong>Datengetrieben:</strong> Verfolgen Sie den Erfolg jeder einzelnen Gifting-Aktion.'
        ],
        insights: 'Bei Expandia sind wir spezialisiert auf digitales Gifting. Unsere Lösungen sind darauf ausgelegt, genau diese Herausforderungen anzugehen und messbares Wachstum für Ihr Unternehmen zu generieren.',
        faqs: [
            { q: 'Bieten Sie physische oder digitale Geschenke an?', a: 'Beides. Von hochwertigen physischen Boxen bis hin zu flexiblen E-Gifts und Gutscheinen bieten wir das volle Spektrum.' },
            { q: 'Kann Gifting in Salesforce integriert werden?', a: 'Ja, wir können Gifting-Aktionen direkt in Ihren Workflow integrieren, sodass Geschenke automatisch bei bestimmten Ereignissen versendet werden.' },
            { q: 'Bieten Sie auch internationale Lösungen an?', a: 'Ja, wir haben ein globales Netzwerk, das den Versand und die Logistik in fast jedes Land übernimmt.' }
        ]
    },
    website: {
        intro: 'Ihre Website ist Ihr wichtigster digitaler Mitarbeiter. Eine professionelle Wartung stellt sicher, dass sie sicher, schnell und immer einsatzbereit bleibt, um neue Kunden zu gewinnen.',
        challenges: [
            'Sicherheitslücken, die zu Datenverlust führen können',
            'Langsame Ladezeiten, die Besucher abschrecken',
            'Veraltete Plugins und Themes, die Fehler verursachen',
            'Mangel an regelmäßigen Backups',
            'Schlechte Performance bei Google (SEO)',
            'Fehlermeldungen, die das Vertrauen mindern',
            'Schwierigkeit, Inhalte schnell zu aktualisieren',
            'Keine Strategie für kontinuierliche Verbesserungen',
            'Hohe Kosten für Ad-hoc-Reparaturen statt Wartung',
            'Fehlendes Monitoring der Erreichbarkeit'
        ],
        benefits: [
            '<strong>Maximale Sicherheit:</strong> Proaktiver Schutz vor Angriffen.',
            '<strong>Optimale Speed:</strong> Blitzschnelle Ladezeiten für bessere Conversions.',
            '<strong>Top-Aktualität:</strong> Wir halten Ihre Software immer auf dem neuesten Stand.',
            '<strong>Verlässliche Backups:</strong> Tägliche Sicherungen Ihrer wichtigen Daten.',
            '<strong>SEO-Vorteile:</strong> Saubere Technik hilft Ihrem Google-Ranking.',
            '<strong>Fokus auf Business:</strong> Sie kümmern sich um Ihr Geschäft, wir um die Technik.',
            '<strong>Schneller Support:</strong> Wir sind da, wenn Sie Änderungen benötigen.',
            '<strong>Planbare Kosten:</strong> Keine Überraschungen durch feste Wartungspakete.'
        ],
        insights: 'Bei Expandia sind wir spezialisiert auf Website-Wartung und Pflege. Unsere Lösungen sind darauf ausgelegt, genau diese Herausforderungen anzugehen und messbares Wachstum für Ihr Unternehmen zu generieren.',
        faqs: [
            { q: 'Warum reicht ein normales Hosting nicht aus?', a: 'Hosting stellt nur den Speicherplatz bereit. Wartung sorgt dafür, dass die Software darauf sicher, aktuell und performant bleibt.' },
            { q: 'Bieten Sie auch Support für WordPress an?', a: 'Ja, wir sind Experten für WordPress-Sicherheit und -Optimierung.' },
            { q: 'Gibt es eine Mindestlaufzeit für die Care Plans?', a: 'Wir bieten flexible Modelle an, meist auf monatlicher Basis, damit Sie immer volle Kontrolle behalten.' }
        ]
    }
};

const CATEGORY_MAP = {
    'ai-in-b2b-marketing-video.html': 'ai',
    'future-of-content-creation-ai.html': 'ai',
    'using-ai-avatars-for-sales.html': 'ai',
    'cost-benefits-of-outsourcing-it-support.html': 'it',
    'email-security-spf-dkim-dmarc-explained.html': 'it',
    'importance-of-penetration-testing.html': 'it',
    'preventing-business-email-compromise.html': 'it',
    'proactive-vs-reactive-it-support.html': 'it',
    'top-cybersecurity-threats-b2b-2025.html': 'it',
    'top-cybersecurity-threats-b2b-2026.html': 'it',
    'vulnerability-assessment-checklist.html': 'it',
    'why-managed-it-services-are-essential-2025.html': 'it',
    'why-managed-it-services-are-essential-2026.html': 'it',
    'wordpress-security-best-practices.html': 'it',
    'b2b-growth-trends-2025.html': 'it', // Not ideal but better than English
    'b2b-growth-trends-2026.html': 'it',
    'crm-optimization-strategies.html': 'revops',
    'how-to-hire-top-sales-talent.html': 'recruitment',
    'importance-of-speed-to-lead.html': 'it', // Often security/latency focused in these placeholders
    'international-market-entry-strategies.html': 'revops',
    'scaling-sales-operations.html': 'revops',
    'what-is-revops.html': 'revops',
    'benefits-of-bridge-staffing.html': 'recruitment',
    'headhunting-vs-recruitment-agencies.html': 'recruitment',
    'corporate-gifting-trends-2025.html': 'gifting',
    'corporate-gifting-trends-2026.html': 'gifting',
    'digital-gifting-for-remote-teams.html': 'gifting',
    'why-website-maintenance-matters.html': 'website',
    'technology-role-in-business-growth.html': 'it'
};

const processFile = (filePath) => {
    const fileName = path.basename(filePath);
    const categoryKey = CATEGORY_MAP[fileName] || 'it';
    const t = TRANSLATIONS[categoryKey];

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace Intro
    content = content.replace(/<p class="lead text-xl text-gray-600 mb-8">[\s\S]*?<\/p>/,
        `<p class="lead text-xl text-gray-600 mb-8">\n                    ${t.intro}\n                </p>`);

    // 2. Replace Challenges
    const challengeList = t.challenges.map(c => `<li>${c}</li>`).join('');
    content = content.replace(/<h2>Häufige Herausforderungen<\/h2>\s*<ul>[\s\S]*?<\/ul>/,
        `<h2>Häufige Herausforderungen</h2>\n                <ul>\n                    ${challengeList}\n                </ul>`);

    // 3. Replace Benefits
    const benefitList = t.benefits.map(b => `<li>${b}</li>`).join('');
    content = content.replace(/<h2>Wichtige Vorteile<\/h2>\s*<ul>[\s\S]*?<\/ul>/,
        `<h2>Wichtige Vorteile</h2>\n                <ul>\n                    ${benefitList}\n                </ul>`);

    // 4. Replace Insights
    content = content.replace(/<div class="bg-gray-50 p-8 rounded-2xl my-12 border border-gray-100">[\s\S]*?<\/div>/,
        `<div class="bg-gray-50 p-8 rounded-2xl my-12 border border-gray-100">\n                    <h3 class="text-2xl font-bold mb-4">Expandia Insights</h3>\n                    <p class="mb-0">\n                        ${t.insights}\n                    </p>\n                </div>`);

    // 5. Replace FAQ
    const faqHtml = t.faqs.map(f => `<h3>${f.q}</h3><p>${f.a}</p>`).join('');
    content = content.replace(/<h2>FAQ<\/h2>[\s\S]*?<h2>Fazit<\/h2>/,
        `<h2>FAQ</h2>${faqHtml}\n\n                <h2>Fazit</h2>`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Translated: ${fileName} (${categoryKey})`);
};

const main = async () => {
    const blogDir = '/Users/oguzhanocak/Downloads/expandia_web_2026/expandia/templates/de/blog/';
    const files = await glob(`${blogDir}*.html`);
    console.log(`Starting translation for ${files.length} blog files...`);
    files.forEach(processFile);
    console.log('All blog body content translated!');
};

main();
