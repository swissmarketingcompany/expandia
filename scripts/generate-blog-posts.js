const fs = require('fs');
const path = require('path');
const services = require('../data/services.json');
const serviceContent = require('../data/service-content.json');

const languages = ['en', 'de', 'fr', 'tr'];

const blogTopics = [
    // Managed IT
    {
        slug: 'why-managed-it-services-are-essential-2026',
        serviceId: 'managed-it',
        title: {
            en: 'Why Managed IT Services Are Essential in 2026',
            de: 'Warum Managed IT Services im Jahr 2026 unerlässlich sind',
            fr: 'Pourquoi les services informatiques gérés sont essentiels en 2026',
            tr: '2026\'da Yönetilen BT Hizmetleri Neden Gereklidir?'
        }
    },
    {
        slug: 'cost-benefits-of-outsourcing-it-support',
        serviceId: 'managed-it',
        title: {
            en: 'The Cost Benefits of Outsourcing IT Support',
            de: 'Die Kostenvorteile des Outsourcings von IT-Support',
            fr: 'Les avantages financiers de l\'externalisation du support informatique',
            tr: 'BT Desteğini Dış Kaynak Kullanmanın Maliyet Avantajları'
        }
    },
    {
        slug: 'proactive-vs-reactive-it-support',
        serviceId: 'managed-it',
        title: {
            en: 'Proactive vs. Reactive IT Support: Which is Better?',
            de: 'Proaktiver vs. reaktiver IT-Support: Was ist besser?',
            fr: 'Support informatique proactif ou réactif : lequel choisir ?',
            tr: 'Proaktif ve Reaktif BT Desteği: Hangisi Daha İyi?'
        }
    },
    // Security
    {
        slug: 'top-cybersecurity-threats-b2b-2026',
        serviceId: 'cybersecurity',
        title: {
            en: 'Top Cybersecurity Threats for B2B Companies in 2026',
            de: 'Die größten Cybersicherheitsbedrohungen für B2B-Unternehmen im Jahr 2026',
            fr: 'Les principales menaces de cybersécurité pour les entreprises B2B en 2026',
            tr: '2026\'da B2B Şirketleri İçin En Büyük Siber Güvenlik Tehditleri'
        }
    },
    {
        slug: 'importance-of-penetration-testing',
        serviceId: 'cybersecurity',
        title: {
            en: 'Why Regular Penetration Testing is Crucial',
            de: 'Warum regelmäßige Penetrationstests entscheidend sind',
            fr: 'Pourquoi les tests d\'intrusion réguliers sont cruciaux',
            tr: 'Düzenli Sızma Testleri Neden Önemlidir?'
        }
    },
    {
        slug: 'vulnerability-assessment-checklist',
        serviceId: 'cybersecurity',
        title: {
            en: 'The Ultimate Vulnerability Assessment Checklist',
            de: 'Die ultimative Checkliste für Sicherheitsbewertungen',
            fr: 'La liste de contrôle ultime pour l\'évaluation des vulnérabilités',
            tr: 'Nihai Güvenlik Açığı Değerlendirme Kontrol Listesi'
        }
    },
    // Email Security (Mapped to cybersecurity for content if specific ID missing)
    {
        slug: 'email-security-spf-dkim-dmarc-explained',
        serviceId: 'cybersecurity',
        title: {
            en: 'Email Security: SPF, DKIM, and DMARC Explained',
            de: 'E-Mail-Sicherheit: SPF, DKIM und DMARC erklärt',
            fr: 'Sécurité des e-mails : SPF, DKIM et DMARC expliqués',
            tr: 'E-posta Güvenliği: SPF, DKIM ve DMARC Açıklaması'
        }
    },
    {
        slug: 'preventing-business-email-compromise',
        serviceId: 'cybersecurity',
        title: {
            en: 'How to Prevent Business Email Compromise (BEC)',
            de: 'Wie man Business Email Compromise (BEC) verhindert',
            fr: 'Comment prévenir la compromission des e-mails professionnels (BEC)',
            tr: 'İş E-postası Ele Geçirme (BEC) Nasıl Önlenir?'
        }
    },
    // Website Care (Mapped to managed-it or generic)
    {
        slug: 'why-website-maintenance-matters',
        serviceId: 'managed-it',
        title: {
            en: 'Why Regular Website Maintenance Matters for SEO',
            de: 'Warum regelmäßige Website-Wartung für SEO wichtig ist',
            fr: 'Pourquoi la maintenance régulière du site web est importante pour le SEO',
            tr: 'Düzenli Web Sitesi Bakımı SEO İçin Neden Önemlidir?'
        }
    },
    {
        slug: 'wordpress-security-best-practices',
        serviceId: 'managed-it',
        title: {
            en: 'WordPress Security Best Practices for Businesses',
            de: 'WordPress-Sicherheits-Best-Practices für Unternehmen',
            fr: 'Les meilleures pratiques de sécurité WordPress pour les entreprises',
            tr: 'İşletmeler İçin WordPress Güvenlik En İyi Uygulamaları'
        }
    },
    // Recruitment
    {
        slug: 'how-to-hire-top-sales-talent',
        serviceId: 'recruitment',
        title: {
            en: 'How to Hire Top Sales Talent in a Competitive Market',
            de: 'Wie man Top-Vertriebstalente in einem wettbewerbsintensiven Markt einstellt',
            fr: 'Comment recruter les meilleurs talents commerciaux sur un marché concurrentiel',
            tr: 'Rekabetçi Bir Pazarda En İyi Satış Yetenekleri Nasıl İşe Alınır?'
        }
    },
    {
        slug: 'headhunting-vs-recruitment-agencies',
        serviceId: 'recruitment',
        title: {
            en: 'Headhunting vs. Traditional Recruitment Agencies: What\'s the Difference?',
            de: 'Headhunting vs. traditionelle Personalvermittlungen: Was ist der Unterschied?',
            fr: 'Chasse de têtes vs agences de recrutement traditionnelles : quelle différence ?',
            tr: 'Headhunting ve Geleneksel İşe Alım Ajansları: Fark Nedir?'
        }
    },
    {
        slug: 'benefits-of-bridge-staffing',
        serviceId: 'recruitment',
        title: {
            en: 'The Strategic Benefits of Bridge Staffing',
            de: 'Die strategischen Vorteile von Bridge Staffing',
            fr: 'Les avantages stratégiques du personnel de transition',
            tr: 'Köprü Personel İstihdamının Stratejik Avantajları'
        }
    },
    // Corporate Gifting (Generic content)
    {
        slug: 'corporate-gifting-trends-2026',
        serviceId: 'recruitment', // Using recruitment/HR context
        title: {
            en: 'Corporate Gifting Trends for 2026',
            de: 'Trends bei Firmengeschenken für 2026',
            fr: 'Tendances des cadeaux d\'entreprise pour 2026',
            tr: '2026 Kurumsal Hediye Trendleri'
        }
    },
    {
        slug: 'digital-gifting-for-remote-teams',
        serviceId: 'recruitment',
        title: {
            en: 'Digital Gifting Strategies for Remote Teams',
            de: 'Digitale Geschenkstrategien für Remote-Teams',
            fr: 'Stratégies de cadeaux numériques pour les équipes à distance',
            tr: 'Uzaktan Çalışan Ekipler İçin Dijital Hediye Stratejileri'
        }
    },
    // AI Studio
    {
        slug: 'ai-in-b2b-marketing-video',
        serviceId: 'ai-studio',
        title: {
            en: 'Revolutionizing B2B Marketing with AI Video',
            de: 'Revolutionierung des B2B-Marketings mit KI-Video',
            fr: 'Révolutionner le marketing B2B avec la vidéo IA',
            tr: 'YZ Video ile B2B Pazarlamada Devrim'
        }
    },
    {
        slug: 'using-ai-avatars-for-sales',
        serviceId: 'ai-studio',
        title: {
            en: 'Using AI Avatars to Scale Personalized Sales Outreach',
            de: 'Einsatz von KI-Avataren zur Skalierung der personalisierten Vertriebsansprache',
            fr: 'Utiliser des avatars IA pour faire évoluer la prospection commerciale personnalisée',
            tr: 'Kişiselleştirilmiş Satış Erişimini Ölçeklendirmek İçin YZ Avatarlarını Kullanma'
        }
    },
    {
        slug: 'future-of-content-creation-ai',
        serviceId: 'ai-studio',
        title: {
            en: 'The Future of Content Creation: AI Studios',
            de: 'Die Zukunft der Inhaltserstellung: KI-Studios',
            fr: 'L\'avenir de la création de contenu : les studios IA',
            tr: 'İçerik Oluşturmanın Geleceği: YZ Stüdyoları'
        }
    },
    // RevOps
    {
        slug: 'what-is-revops',
        serviceId: 'revops',
        title: {
            en: 'What is RevOps and Why Does Your Business Need It?',
            de: 'Was ist RevOps und warum braucht Ihr Unternehmen es?',
            fr: 'Qu\'est-ce que RevOps et pourquoi votre entreprise en a-t-elle besoin ?',
            tr: 'RevOps Nedir ve İşletmenizin Neden İhtiyacı Var?'
        }
    },
    {
        slug: 'crm-optimization-strategies',
        serviceId: 'revops',
        title: {
            en: 'CRM Optimization Strategies for High-Growth Teams',
            de: 'CRM-Optimierungsstrategien für wachstumsstarke Teams',
            fr: 'Stratégies d\'optimisation CRM pour les équipes à forte croissance',
            tr: 'Hızlı Büyüyen Ekipler İçin CRM Optimizasyon Stratejileri'
        }
    },
    // Speed to Lead
    {
        slug: 'importance-of-speed-to-lead',
        serviceId: 'revops',
        title: {
            en: 'The Critical Importance of Speed-to-Lead in 2026',
            de: 'Die entscheidende Bedeutung von Speed-to-Lead im Jahr 2026',
            fr: 'L\'importance critique de la rapidité de réponse (Speed-to-Lead) en 2026',
            tr: '2026\'da Hızlı Yanıtın (Speed-to-Lead) Kritik Önemi'
        }
    },
    // Market Entry
    {
        slug: 'international-market-entry-strategies',
        serviceId: 'revops', // Mapping to sales growth
        title: {
            en: 'International Market Entry Strategies for SaaS',
            de: 'Internationale Markteintrittsstrategien für SaaS',
            fr: 'Stratégies d\'entrée sur le marché international pour le SaaS',
            tr: 'SaaS İçin Uluslararası Pazara Giriş Stratejileri'
        }
    },
    // General Growth
    {
        slug: 'b2b-growth-trends-2026',
        serviceId: 'managed-it', // Generic
        title: {
            en: 'Key B2B Growth Trends to Watch in 2026',
            de: 'Wichtige B2B-Wachstumstrends für 2026',
            fr: 'Les principales tendances de croissance B2B à surveiller en 2026',
            tr: '2026\'da İzlenmesi Gereken Önemli B2B Büyüme Trendleri'
        }
    },
    {
        slug: 'scaling-sales-operations',
        serviceId: 'revops',
        title: {
            en: 'A Guide to Scaling Your Sales Operations',
            de: 'Ein Leitfaden zur Skalierung Ihrer Vertriebsabläufe',
            fr: 'Un guide pour faire évoluer vos opérations de vente',
            tr: 'Satış Operasyonlarınızı Ölçeklendirme Rehberi'
        }
    },
    {
        slug: 'technology-role-in-business-growth',
        serviceId: 'managed-it',
        title: {
            en: 'The Role of Technology in Accelerating Business Growth',
            de: 'Die Rolle der Technologie bei der Beschleunigung des Unternehmenswachstums',
            fr: 'Le rôle de la technologie dans l\'accélération de la croissance des entreprises',
            tr: 'İş Büyümesini Hızlandırmada Teknolojinin Rolü'
        }
    }
];

function generateContent(topic, lang) {
    const serviceId = topic.serviceId;
    const contentData = (serviceContent[serviceId] && serviceContent[serviceId][lang]) 
        ? serviceContent[serviceId][lang] 
        : (serviceContent[serviceId] ? serviceContent[serviceId]['en'] : null);

    // Clean content helpers
    const cleanText = (text) => {
        if (!text) return '';
        return text
            .replace(/\{\{CITY_NAME\}\}/g, lang === 'tr' ? 'şehrinizde' : lang === 'de' ? 'Ihrer Stadt' : lang === 'fr' ? 'votre ville' : 'your city')
            .replace(/\{\{COUNTRY_NAME\}\}/g, lang === 'tr' ? 'ülkenizde' : lang === 'de' ? 'Ihrem Land' : lang === 'fr' ? 'votre pays' : 'your country')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    // Default fallbacks if content data missing
    const introText = contentData ? cleanText(contentData.intro[0]) : "In today's competitive landscape, businesses must leverage every advantage.";
    const painPoints = contentData ? contentData.pain_points.map(p => `<li>${cleanText(p)}</li>`).join('') : "<li>Efficiency gaps</li><li>Security risks</li>";
    const benefits = contentData ? contentData.benefits.map(b => `<li>${cleanText(b)}</li>`).join('') : "<li>Increased revenue</li><li>Better security</li>";
    const faq = contentData ? contentData.faq.map(f => `<h3>${cleanText(f.q)}</h3><p>${cleanText(f.a)}</p>`).join('') : "";

    const labels = {
        en: { intro: 'Introduction', challenges: 'Common Challenges', benefits: 'Key Benefits', conclusion: 'Conclusion', cta: 'Ready to learn more? Contact Expandia today.' },
        de: { intro: 'Einführung', challenges: 'Häufige Herausforderungen', benefits: 'Wichtige Vorteile', conclusion: 'Fazit', cta: 'Möchten Sie mehr erfahren? Kontaktieren Sie Expandia noch heute.' },
        fr: { intro: 'Introduction', challenges: 'Défis Courants', benefits: 'Principaux Avantages', conclusion: 'Conclusion', cta: 'Prêt à en savoir plus ? Contactez Expandia dès aujourd\'hui.' },
        tr: { intro: 'Giriş', challenges: 'Yaygın Zorluklar', benefits: 'Temel Avantajlar', conclusion: 'Sonuç', cta: 'Daha fazla bilgi almaya hazır mısınız? Bugün Expandia ile iletişime geçin.' }
    };
    
    const label = labels[lang] || labels['en'];

    return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PAGE_TITLE}}</title>
    <meta name="description" content="{{PAGE_DESCRIPTION}}">
    <meta name="keywords" content="{{PAGE_KEYWORDS}}">
    <link rel="canonical" href="{{CANONICAL_URL}}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="{{CANONICAL_URL}}">
    <meta property="og:title" content="{{PAGE_TITLE}}">
    <meta property="og:description" content="{{PAGE_DESCRIPTION}}">
    <meta property="og:image" content="{{LOGO_PATH}}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{CANONICAL_URL}}">
    <meta property="twitter:title" content="{{PAGE_TITLE}}">
    <meta property="twitter:description" content="{{PAGE_DESCRIPTION}}">
    <meta property="twitter:image" content="{{LOGO_PATH}}">

    <!-- Favicon -->
    <link rel="icon" href="{{BASE_PATH}}favicon.ico" type="image/x-icon">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Styles -->
    <link href="{{BASE_PATH}}dist/css/output.css" rel="stylesheet">
</head>
<body class="font-sans antialiased text-gray-900 bg-white">
    {{HEADER_INCLUDE}}

    <main class="pt-24 pb-16">
        <article class="container mx-auto px-4 max-w-4xl">
            <!-- Breadcrumb -->
            <nav class="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    <li class="inline-flex items-center">
                        <a href="{{BASE_PATH}}index.html" class="inline-flex items-center hover:text-primary">
                            <i data-lucide="home" class="w-4 h-4 mr-2"></i>
                            Home
                        </a>
                    </li>
                    <li>
                        <div class="flex items-center">
                            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
                            <a href="{{BASE_PATH}}blog/index.html" class="ml-1 md:ml-2 hover:text-primary">Blog</a>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div class="flex items-center">
                            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
                            <span class="ml-1 md:ml-2 text-gray-700 font-medium truncate">${topic.title[lang]}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <!-- Header -->
            <header class="mb-12 text-center">
                <span class="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                    ${topic.serviceId.replace('-', ' ').toUpperCase()}
                </span>
                <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">${topic.title[lang]}</h1>
                <div class="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div class="flex items-center gap-2">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        <span>2026</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="clock" class="w-4 h-4"></i>
                        <span>5 min read</span>
                    </div>
                </div>
            </header>

            <!-- Content -->
            <div class="prose prose-lg prose-primary mx-auto">
                <p class="lead text-xl text-gray-600 mb-8">
                    ${introText}
                </p>

                <h2>${label.challenges}</h2>
                <ul>
                    ${painPoints}
                </ul>

                <h2>${label.benefits}</h2>
                <ul>
                    ${benefits}
                </ul>

                <div class="bg-gray-50 p-8 rounded-2xl my-12 border border-gray-100">
                    <h3 class="text-2xl font-bold mb-4">Expandia Insights</h3>
                    <p class="mb-0">
                        At Expandia, we specialize in ${topic.serviceId.replace('-', ' ')}. Our solutions are designed to address these exact challenges and drive measurable growth for your business.
                    </p>
                </div>

                ${faq ? `<h2>FAQ</h2>${faq}` : ''}

                <h2>${label.conclusion}</h2>
                <p>
                    ${label.cta}
                </p>
            </div>

            <!-- CTA -->
            <div class="mt-16 text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12">
                <h2 class="text-3xl font-bold mb-4">${label.cta.split('?')[0]}?</h2>
                <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
                    ${label.cta.split('?')[1] || label.cta}
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="{{BASE_PATH}}contact.html" class="btn btn-primary btn-lg">
                        ${lang === 'tr' ? 'İletişime Geç' : lang === 'de' ? 'Kontakt' : lang === 'fr' ? 'Contactez-nous' : 'Contact Us'}
                    </a>
                    <a href="{{BASE_PATH}}services.html" class="btn btn-outline btn-lg">
                        ${lang === 'tr' ? 'Hizmetler' : lang === 'de' ? 'Dienstleistungen' : lang === 'fr' ? 'Services' : 'View Services'}
                    </a>
                </div>
            </div>
        </article>
    </main>

    {{FOOTER_INCLUDE}}
    
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
    `;
}

function generate() {
    console.log('🚀 Generating blog posts...');
    
    languages.forEach(lang => {
        const outputDir = lang === 'en' ? 'templates/blog' : `templates/${lang}/blog`;
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        blogTopics.forEach(topic => {
            const content = generateContent(topic, lang);
            const filePath = path.join(outputDir, `${topic.slug}.html`);
            fs.writeFileSync(filePath, content, 'utf8');
            // console.log(`Created ${filePath}`);
        });
        
        console.log(`✅ Generated ${blogTopics.length} posts for ${lang.toUpperCase()}`);
    });
}

// generate(); // Don't auto-run on require

module.exports = { blogTopics, generate };

if (require.main === module) {
    generate();
}
