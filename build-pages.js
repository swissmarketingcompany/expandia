const fs = require('fs');
const path = require('path');

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
const navigationTR = fs.readFileSync('includes/header-tr.html', 'utf8');
const navigationDE = fs.readFileSync('includes/header-de.html', 'utf8');
const footerEN = fs.readFileSync(footerPath, 'utf8');
const footerTR = fs.existsSync('includes/footer-tr.html') ? fs.readFileSync('includes/footer-tr.html', 'utf8') : footerEN;
const footerDE = fs.existsSync('includes/footer-de.html') ? fs.readFileSync('includes/footer-de.html', 'utf8') : footerEN;

console.log(`✅ Successfully loaded headers for all languages`);
console.log(`✅ Successfully loaded footers for all languages`);

// Template variable validation function
function validateTemplateVariables(content, fileName) {
    const requiredVars = ['{{BASE_PATH}}', '{{LOGO_PATH}}', '{{NAVIGATION}}', '{{MAIN_CONTENT}}', '{{FOOTER}}', '{{PAGE_TITLE}}', '{{PAGE_DESCRIPTION}}', '{{PAGE_KEYWORDS}}'];
    const missingVars = [];

    for (const varName of requiredVars) {
        if (content.includes(varName)) {
            missingVars.push(varName);
        }
    }

    if (missingVars.length > 0) {
        console.warn(`⚠️  WARNING: ${fileName} contains unreplaced template variables: ${missingVars.join(', ')}`);
    }

    return missingVars.length === 0;
}

// SEO Keywords by page type
const seoKeywords = {
    index: 'B2B lead generation Europe, inbound lead generation, outbound lead generation',
    solutions: 'lead generation solutions, inbound lead generation, outbound lead generation, Europe',
    about: 'B2B sales agency Europe, export market specialists, international sales consulting',
    contact: 'B2B lead generation consultation, export sales consultation, international market entry',
    'case-studies': 'B2B sales success stories, export market case studies, international expansion results',
    onboarding: 'Expandia client onboarding, sales service setup, B2B sales onboarding process, get started form, sales growth onboarding',
    'email-marketing-management': 'email marketing management, email marketing service, B2B email marketing, email automation, email campaigns'
};

// Schema markup generators
function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Expandia",
        "url": "https://www.expandia.ch",
        "logo": "https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png",
        "email": "hello@expandia.ch",
        // International company. No single-country address to avoid implying Swiss-only identity.
        // If a physical office needs to be listed later, add an appropriate PostalAddress here.
        "sameAs": [
            "https://www.linkedin.com/company/expandia-ch/"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            // Keep a generic contact point without country-specific signaling
            "telephone": "+000-000-0000",
            "contactType": "sales",
            "areaServed": ["EU", "UK", "US", "MEA", "APAC"],
            "availableLanguage": ["en", "de", "tr"]
        }
    };
}

function generateServiceSchema(serviceName, description, lang = 'en') {
    const baseUrl = lang === 'en' ? 'https://www.expandia.ch' : `https://www.expandia.ch/${lang}`;
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": serviceName,
        "description": description,
        "provider": {
            "@type": "Organization",
            "name": "Expandia",
            "url": baseUrl
        },
        "areaServed": {
            "@type": "Place",
            "name": "Europe"
        },
        "serviceType": "B2B Lead Generation",
        "category": "Business Services"
    };
}

function generateArticleSchema(title, description, url, datePublished = "2024-12-30") {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "url": url,
        "datePublished": datePublished,
        "dateModified": datePublished,
        "author": {
            "@type": "Organization",
            "name": "Expandia"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Expandia",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png"
            }
        }
    };
}

// HTML Document Template with enhanced SEO
function createHTMLTemplate(lang = 'en') {
    const assetPath = (lang === 'tr' || lang === 'de') ? '../' : './';
    const baseUrl = lang === 'en' ? 'https://www.expandia.ch' : `https://www.expandia.ch/${lang}`;
    
    return `<!DOCTYPE html>
<html lang="${lang}" data-theme="bumblebee">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PAGE_TITLE}} | Expandia - Sales Growth Partner</title>
    <meta name="description" content="{{PAGE_DESCRIPTION}}">
    <meta name="keywords" content="{{PAGE_KEYWORDS}}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Expandia">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{CANONICAL_URL}}">
    
    <!-- Hreflang Links -->
    <link rel="alternate" hreflang="en" href="https://www.expandia.ch/{{PAGE_URL_EN}}">
    <link rel="alternate" hreflang="tr" href="https://www.expandia.ch/{{PAGE_URL_TR}}">
    <link rel="alternate" hreflang="de" href="https://www.expandia.ch/{{PAGE_URL_DE}}">
    <link rel="alternate" hreflang="x-default" href="https://www.expandia.ch/{{PAGE_URL_EN}}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{{PAGE_TITLE}} | Expandia">
    <meta property="og:description" content="{{PAGE_DESCRIPTION}}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{CANONICAL_URL}}">
    <meta property="og:image" content="https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png">
    <meta property="og:site_name" content="Expandia">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{PAGE_TITLE}} | Expandia">
    <meta name="twitter:description" content="{{PAGE_DESCRIPTION}}">
    <meta name="twitter:image" content="https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png">
    
    <link href="${assetPath}dist/css/output.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="${assetPath}favicon.ico">
    <link rel="icon" type="image/png" href="${assetPath}favicon.png">
    <link rel="apple-touch-icon" href="${assetPath}favicon.png">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XY2B6K4R6Q"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-XY2B6K4R6Q');
    </script>
    
    <!-- Lordicon Script -->
    <script src="https://cdn.lordicon.com/lordicon.js"></script>
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    {{SCHEMA_MARKUP}}
    </script>
</head>
<body class="font-sans">
    {{NAVIGATION}}
    
    {{MAIN_CONTENT}}
    
    {{FOOTER}}
    
    <script src="${assetPath}dist/js/index.js"></script>
    
    <!--Start of Tawk.to Script-->
    <script type="text/javascript">
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/6911e3f950ba1a195e0a2c28/1j9mu527m';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
    </script>
    <!--End of Tawk.to Script-->
</body>
</html>`;
}

// Translation content for Turkish
const turkishTranslations = {
    // Navigation Menu Items
    'Home': 'Ana Sayfa',
    'Sales University': 'Blog',
    'Get Started': 'Başlayın',
    'Solutions': 'Çözümler',
    'About': 'Hakkımızda',
    'Contact': 'İletişim',
    'Company': 'Şirket',
    'About Us': 'Hakkımızda',
    'Contact Us': 'İletişim',
    'Success Stories': 'Başarı Hikayeleri',
    
    // Mega Menu Headers
    'Sales Solutions & Services': 'Satış Çözümleri & Hizmetleri',
    'Sales Çözümler & Services': 'Satış Çözümleri & Hizmetleri',
    'About Expandia': 'Expandia Hakkında',
    'Hakkımızda Expandia': 'Expandia Hakkında',
    
    // Main Service Cards
    'Sales as a Service': 'Hizmet Olarak Satış',

    'Sales Development Services': 'Satış Geliştirme Hizmetleri',
    'Defend your revenue with data protection and threat monitoring': 'Gelirinizi veri koruması ve tehdit izleme ile koruyun',
    'BuffSend platform and AI-powered sales tools': 'BuffSend platformu ve AI destekli satış araçları',
    'Complete sales management and operations outsourcing': 'Tüm satış yönetimi ve operasyonlarınız için dış kaynak kullanımı',
    'Real results from companies we\'ve helped': 'Yardım ettiğimiz şirketlerden gerçek sonuçlar',
    'Comprehensive sales growth solutions for your business': 'İşletmeniz için kapsamlı satış büyüme çözümleri',
    
    // Footer Links
    'Privacy Policy': 'Gizlilik Politikası',
    'Terms of Service': 'Hizmet Şartları', 
    'Cookie Policy': 'Çerez Politikası',
    
    // CTAs and Button Text
    'Get Started': 'Başlayın',
    'Contact Us': 'İletişim',
    'Get Free Consultation': 'Ücretsiz Danışmanlık Alın',
    'Let\'s discuss how we can help': 'Size nasıl yardımcı olabileceğimizi görüşelim',
    'Let\'s discuss how we can help': 'Size nasıl yardımcı olabileceğimizi görüşelim',
    
    // Section Headers
    'Special Services': 'Özel Hizmetler',
    'Lead Generation & Sales': 'Potansiyel Müşteri Üretimi & Satış',
    'Potansiyel Müşteri Üretimi & Sales': 'Potansiyel Müşteri Üretimi & Satış',
    'Marketing & Outreach': 'Pazarlama ve İletişim',
    'International Expansion': 'Uluslararası Genişleme',
    
    // Service Items - English terms that need translation
    'Appointment Setting': 'Randevu Ayarlama',
    'Cold Email': 'Soğuk E-posta',
    'Email Automation': 'E-posta Otomasyonu',

    'Export Marketing': 'İhracat Pazarlaması',
    'Europe Market Entry': 'Avrupa Pazarına Giriş',
    'Prospect Finding': 'Potansiyel Müşteri Bulma',
    'Outbound Marketing': 'Outbound Pazarlama',
    'Cold Email Agency': 'Soğuk E-posta Ajansı',
    'Outsourced Sales Team': 'Dış Kaynaklı Satış Ekibi',
    'Overseas Sales Consulting': 'Yurt Dışı Satış Danışmanlığı',
    'Distributor Finding': 'Distribütör Bulma',
    'International Market Entry': 'Uluslararası Pazar Girişi',
    'Sales Development': 'Satış Geliştirme',
    'Agency': 'Ajansı',
    'B2B Lead Generation': 'B2B Potansiyel Müşteri Üretimi',
    'Lead Generation Service': 'Potansiyel Müşteri Üretimi Hizmeti',
    'Our Sales Solutions': 'Satış Çözümlerimiz',
    
    // Call to Action Section
    'Ready to accelerate your sales growth?': 'Satış büyümenizi hızlandırmaya hazır mısınız?',
    'Let\'s discuss your specific needs': 'Özel ihtiyaçlarınızı konuşalım',
    'Get Free Consultation →': 'Ücretsiz Danışmanlık Alın →',
    'Get Free Consultation': 'Ücretsiz Danışmanlık Alın',
    
    // Company Menu
    'Our Mission': 'Misyonumuz',
    'Boost Your Sales': 'Satışlarınızı Artırın',
    
    // Footer Newsletter
    'Stay Updated with Sales Insights': 'Satış Görüşleri ile Güncel Kalın',
    'Get the latest sales strategies and industry updates.': 'En son satış stratejilerini ve sektör güncellemelerini alın.',
    'Enter your email': 'E-postanızı girin',
    'Subscribe': 'Abone Ol',
    
    // Footer Company Info
    'Your Partner in Sales Growth and Revenue Acceleration. We help businesses scale their sales operations with proven strategies and cutting-edge solutions.': 'Satış Büyümesi ve Gelir Hızlandırma Ortağınız. İşletmelerin satış operasyonlarını kanıtlanmış stratejiler ve son teknoloji çözümlerle ölçeklendirmelerine yardımcı oluyoruz.',
    
    // Footer Contact
    'Get in Touch': 'İletişime Geçin',
    'Ready to accelerate your sales growth? Let\'s discuss how we can help.': 'Satış büyümenizi hızlandırmaya hazır mısınız? Size nasıl yardımcı olabileceğimizi konuşalım.',
    'Schedule a Call': 'Toplantı Ayarlayın',
    
    // Footer Links
    'Lead Generation': 'Potansiyel Müşteri Üretimi',
    'BuffSend Platform': 'BuffSend Platformu',
    
    // Footer Bottom
    '&copy; 2024 Expandia. All rights reserved.': '&copy; 2024 Expandia. Tüm hakları saklıdır.',
    'Privacy Policy': 'Gizlilik Politikası',
    'Terms of Service': 'Hizmet Şartları',
    'Cookie Policy': 'Çerez Politikası',
    
    // Clean up partial translations
    'Hakkımızda Us': 'Hakkımızda',
    'İletişim Us': 'İletişim',
    'Our Sales Çözümler': 'Satış Çözümlerimiz',
    'Our Sales': 'Satış',
    'Potansiyel Müşteri Üretimi Service': 'Potansiyel Müşteri Üretimi Hizmeti',
    'Let\'s discuss how we can help': 'Size nasıl yardımcı olabileceğimizi konuşalım',
    'Blog': 'Blog',
    "Get Started": "Başlayın",
    "Contact Us": "İletişim",
    "Let's discuss how we can help": "Size nasıl yardımcı olabileceğimizi görüşelim",
    "Lead Generation": "Potansiyel Müşteri Üretimi",
    "Lead Generation Service": "Potansiyel Müşteri Üretimi Hizmeti",
    "Sales Development": "Satış Geliştirme",
    "Outbound Marketing": "Dışa Dönük Pazarlama",
    "Cold Email": "Soğuk E‑posta",
    "Cold Email Agency": "Soğuk E‑posta Ajansı",

    "Lead Generation & Sales": "Potansiyel Müşteri Üretimi & Satış",
    "B2B Lead Generation": "B2B Potansiyel Müşteri Üretimi",
};

// Translation content for German
const germanTranslations = {
    // Navigation Menu Items
    'Home': 'Startseite',
    'Sales University': 'Vertriebsschule', // Shorter than "Verkaufs-Universität" to fix width issue
    'Get Started': 'Jetzt starten',
    'Solutions': 'Lösungen',
    'About': 'Über uns',
    'Contact': 'Kontakt',
    'Company': 'Unternehmen',
    'About Us': 'Über uns',
    'Contact Us': 'Kontakt',
    'Success Stories': 'Erfolgsgeschichten',
    'Special Services': 'Spezialservices',
    'Our Sales Solutions': 'Unsere Verkaufslösungen',
    
    // Mega Menu Headers
    'Sales Solutions & Services': 'Verkaufslösungen & Services',
    'Sales Lösungen & Services': 'Verkaufslösungen & Services',
    'About Expandia': 'Über Expandia',
    
    // Main Service Cards
    'Sales as a Service': 'Verkauf als Service',

    'Defend your revenue with data protection and threat monitoring': 'Schützen Sie Ihren Umsatz mit Datenschutz und Bedrohungsüberwachung',
    'Complete sales management and operations outsourcing': 'Vollständiges Outsourcing von Verkaufsmanagement und -abläufen',
    'Real results from companies we\'ve helped': 'Echte Ergebnisse von Unternehmen, denen wir geholfen haben',
    'Comprehensive sales growth solutions for your business': 'Umfassende Umsatzwachstumslösungen für Ihr Unternehmen',
    
    // Critical Legal Compliance Fix - Replace Turkish KVKK with German GDPR
    'Expandia ticari sırlar ve KVKK\'ya saygılıdır; müşteri/tedarikçi listelerini temin etmez ve paylaşmaz.': 'Expandia respektiert Geschäftsgeheimnisse und die DSGVO; wir beschaffen oder teilen keine Kunden-/Lieferantenlisten.',
    'Expandia ticari sırlar ve KVKK’ya saygılıdır; müşteri/tedarikçi listelerini temin etmez ve paylaşmaz.': 'Expandia respektiert Geschäftsgeheimnisse und die DSGVO; wir beschaffen oder teilen keine Kunden-/Lieferantenlisten.',
    
    // Section Headers
    'Special Services': 'Spezialservices',
    'Lead Generation & Sales': 'Lead-Generierung & Verkauf',
    'Marketing & Outreach': 'Marketing & Outreach',
    'International Expansion': 'Internationale Expansion',
    
    // Fix Denglisch (mixed German-English) issues
    'Sales als Service': 'Ausgelagerte Vertriebslösung',
    'Sales AI Lösungen': 'KI-Verkaufslösungen', 
    'AI Sales Lösungen': 'KI-Verkaufslösungen',
    'Lead-Generierung Increase': 'Steigerung der Potenzialkundengewinnung',
    'Hassas veri işleme': 'Verarbeitung sensibler Daten',
    'İlk Silmeler': 'Erste Löschungen',
    '0-3 Gün': '0–3 Tage',
    '30+ Gün': '30+ Tage',
    '250,000,000+ Verified Contacts': 'Verifizierte, hochwertige Datenquellen',
    // Turkish-to-German fixes on DE pages
    'Kapsamlı koruma için 640 veri broker ve herkese açık veri tabanını sürekli izliyoruz': 'Für umfassenden Schutz überwachen wir kontinuierlich 640 Datenbroker und öffentliche Datenbanken',
    'Toplam Kapsama Alanı': 'Gesamtabdeckung',
    'Toplam Veri Broker': 'Gesamtzahl der Datenbroker',
    'Veri Gizleme Oranı': 'Datenverschleierungsrate',
    'Sürekli İzleme': 'Kontinuierliche Überwachung',
    'PRICE CALCULATOR': 'Preisrechner',
    'Fiyat Hesaplayıcısı': 'Preisrechner',
    'Bilgilerinizi Girin': 'Geben Sie Ihre Daten ein',
    'Korunacak Çalışan Sayısı': 'Anzahl der zu schützenden Mitarbeiter',
    "C-level, VP'ler, satış personeli": 'C‑Level, VPs, Vertriebsmitarbeiter',
    'Ticari Veri Koruması': 'Handelsdatenschutz',
    'Hayır': 'Nein',
    'Sadece kişisel veri koruması': 'Nur persönlicher Datenschutz',
    'Evet': 'Ja',
    'Gümrük + kişisel veri koruması': 'Zolldaten + persönlicher Datenschutz',
    'Aylık Ortalama İhracat/İthalat Sevkiyat Sayısı:': 'Monatliche durchschnittliche Anzahl von Export/Import‑Sendungen:',
    'Örn: 50': 'Z. B.: 50',
    'B/L, AWB, konteyner sevkiyatları dahil': 'Inklusive B/L, AWB, Container‑Sendungen',
    'Maliyet & Özellikler': 'Kosten & Funktionen',
    'Tahmini Yıllık Maliyet': 'Geschätzte Jahreskosten',
    '/ yıl': '/ Jahr',
    'Maliyet Detayı': 'Kostenübersicht',
    'Kişisel veri koruması:': 'Persönlicher Datenschutz:',
    'Ticari veri koruması:': 'Handelsdatenschutz:',
    'Toplam:': 'Gesamt:',
    'Hemen Teklif Al': 'Jetzt Angebot erhalten',
    'Ücretsiz danışmanlık ile başlayın': 'Beginnen Sie mit einer kostenlosen Beratung',
    "📊 Aylık İzleme Dashboard'u": '📊 Monatliches Überwachungs‑Dashboard',
    'Gerçek zamanlı koruma durumunuzu takip edin': 'Verfolgen Sie Ihren Schutzstatus in Echtzeit',
    'Koruma Merkezi': 'Schutzzentrum',
    'Son güncelleme: Bugün, 14:32': 'Letzte Aktualisierung: Heute, 14:32',
    'CANLI': 'LIVE',
    'Bu Ay Silinen': 'Diesen Monat gelöscht',
    'Beklemede': 'Ausstehend',
    '5-15 gün': '5–15 Tage',
    'Yeni Tespit': 'Neu erkannt',
    'Son 7 gün': 'Letzte 7 Tage',
    'Başarı Oranı': 'Erfolgsquote',
    'KVKK Uyumlu': 'DSGVO‑konform',
    'Aylık İlerleme': 'Monatlicher Fortschritt',
    'Silme Talepleri': 'Löschanträge',
    'Veri Broker Taramaları': 'Datenbroker‑Scans',
    'GDPR Uyumlu İşlemler': 'DSGVO‑konforme Vorgänge',
    'Son Aktiviteler': 'Neueste Aktivitäten',
    "ZoomInfo'dan 23 kayıt silindi": '23 Einträge bei ZoomInfo gelöscht',
    '2 saat önce': 'vor 2 Stunden',
    'Apollo.io taraması tamamlandı': 'Apollo.io‑Scan abgeschlossen',
    '4 saat önce': 'vor 4 Stunden',
    '12 yeni veri broker tespit edildi': '12 neue Datenbroker identifiziert',
    '6 saat önce': 'vor 6 Stunden',
    'Lusha silme talebi onaylandı': 'Löschantrag bei Lusha genehmigt',
    '8 saat önce': 'vor 8 Stunden',
    'Haftalık rapor hazırlandı': 'Wöchentlicher Bericht erstellt',
    '1 gün önce': 'vor 1 Tag',
    'Akıllı İpucu': 'Tipp',
    'Bu dashboard\'a': 'Für dieses Dashboard',
    'Süreç Nasıl İşliyor?': 'Wie läuft der Prozess ab?',
    'Veri koruma sürecimizin her adımını şeffaf şekilde izleyin': 'Verfolgen Sie jeden Schritt unseres Datenschutzprozesses transparent',
    'Veri Toplama': 'Datensammlung',
    '1-2 Gün': '1–2 Tage',
    'Kapsamlı Tarama': 'Umfassende Überprüfung',
    '3-5 Gün': '3–5 Tage',
    'Yasal Süreç': 'Rechtlicher Prozess',
    'KVKK/GDPR uyumlu silme talepleri otomatik olarak gönderiliyor': 'DSGVO/GDPR‑konforme Löschanträge werden automatisch übermittelt',
    '7-21 Gün': '7–21 Tage',
    'Sürekli Koruma': 'Kontinuierlicher Schutz',
    'Aylık izleme ve yeni tehditlere karşı koruma': 'Monatliche Überwachung und Schutz vor neuen Bedrohungen',
    'Süreç Zaman Çizelgesi': 'Prozess‑Zeitplan',
    'Başlangıç': 'Start',
    'Veri toplama ve ilk tarama başlangıcı': 'Datensammlung und Beginn der ersten Überprüfung',
    "Veri broker'larından ilk silme işlemleri": 'Erste Löschvorgänge von Datenbrokern',
    'Our Sales Solutions': 'Unsere Verkaufslösungen',
    'Cold Email': 'Cold‑Email',
    
    // Service Items - English terms that need translation
    'B2B Lead Generation': 'B2B-Potenzialkundengewinnung',
    'Lead Generation Service': 'Potenzialkundengewinnungs-Service',
    'Prospect Finding': 'Prospect Finding',
    'Sales Development': 'Verkaufsentwicklung',
    'Appointment Setting': 'Terminvereinbarung',
    'Outsourced Sales Team': 'Ausgelagertes Verkaufsteam',
    'Outbound Marketing': 'Outbound Marketing',
    'Cold Email Agency': 'Cold-E-Mail-Agentur',
    'Email Automation': 'E-Mail-Automatisierung',

    'Export Marketing': 'Export-Marketing',
    'International Market Entry': 'Internationaler Markteintritt',
    'Distributor Finding': 'Distributor-Suche',
    'Overseas Sales Consulting': 'Übersee-Verkaufsberatung',
    'Europe Market Entry': 'Europa-Markteintritt',
    
    // Call to Action Section
    'Ready to accelerate your sales growth?': 'Bereit, Ihr Umsatzwachstum zu beschleunigen?',
    'Let\'s discuss your specific needs': 'Lassen Sie uns Ihre spezifischen Bedürfnisse besprechen',
    'Get Free Consultation →': 'Kostenlose Beratung erhalten →',
    'Get Free Consultation': 'Kostenlose Beratung erhalten',
    '📍 Get Started': '📍 Jetzt starten',
    
    // Company Menu
    'Our Mission': 'Unsere Mission',
    'Boost Your Sales': 'Steigern Sie Ihren Umsatz',
    
    // Footer Newsletter
    'Stay Updated with Sales Insights': 'Bleiben Sie mit Verkaufseinblicken auf dem Laufenden',
    'Get the latest sales strategies and industry updates.': 'Erhalten Sie die neuesten Verkaufsstrategien und Branchenupdates.',
    'Enter your email': 'E-Mail eingeben',
    'Subscribe': 'Abonnieren',
    
    // Footer Company Info
    'Your Partner in Sales Growth and Revenue Acceleration. We help businesses scale their sales operations with proven strategies and cutting-edge solutions.': 'Ihr Partner für Umsatzwachstum und Umsatzbeschleunigung. Wir helfen Unternehmen, ihre Verkaufsabläufe mit bewährten Strategien und modernsten Lösungen zu skalieren.',
    
    // Footer Contact
    'Get in Touch': 'Kontakt aufnehmen',
    'Ready to accelerate your sales growth? Let\'s discuss how we can help.': 'Bereit, Ihr Umsatzwachstum zu beschleunigen? Lassen Sie uns besprechen, wie wir helfen können.',
    'Schedule a Call': 'Anruf planen',
    
    // Footer Links
    'Lead Generation': 'Lead-Generierung',
    'BuffSend Platform': 'BuffSend-Plattform',
    
    // Footer Bottom
    '&copy; 2024 Expandia. All rights reserved.': '&copy; 2024 Expandia. Alle Rechte vorbehalten.',
    'Privacy Policy': 'Datenschutzrichtlinie',
    'Terms of Service': 'Nutzungsbedingungen',
    'Cookie Policy': 'Cookie-Richtlinie',
    
    // Clean up partial translations
    'Über uns Us': 'Über uns',
    'Kontakt Us': 'Kontakt',
    'Our Sales': 'Unsere Verkaufs',
    'Case Studies': 'Fallstudien',
    'Resources': 'Ressourcen',
    'Services': 'Services',
    'Blog': 'Blog',
    'Let\'s discuss how we can help': 'Lassen Sie uns besprechen, wie wir Ihnen helfen können',
    'Let\'s discuss how our sales solutions can help you generate more leads': 'Lassen Sie uns besprechen, wie unsere Verkaufslösungen Ihnen helfen können, mehr Leads zu generieren'
};

// Function to apply Turkish translations
function applyTurkishTranslations(content) {
    let translatedContent = content;
    
    // Apply all translations
    for (const [english, turkish] of Object.entries(turkishTranslations)) {
        // For longer phrases, do exact string replacement first
        if (english.includes(' ')) {
            translatedContent = translatedContent.replace(new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), turkish);
        } else {
            // For single words, use word boundary regex to avoid partial matches
            const regex = new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
            translatedContent = translatedContent.replace(regex, turkish);
        }
    }
    
    return translatedContent;
}

// Function to apply German translations
function applyGermanTranslations(content) {
    let translatedContent = content;
    
    // Apply all translations
    for (const [english, german] of Object.entries(germanTranslations)) {
        // For longer phrases, do exact string replacement first
        if (english.includes(' ')) {
            translatedContent = translatedContent.replace(new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), german);
        } else {
            // For single words, use word boundary regex to avoid partial matches
            const regex = new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
            translatedContent = translatedContent.replace(regex, german);
        }
    }
    
    return translatedContent;
}

// Function to get page metadata with enhanced SEO
function getPageMetadata(templateName, lang = 'en') {
    const isturkish = lang === 'tr';
    const isgerman = lang === 'de';
    
    const metadata = {
        'index': {
            title: isturkish 
                ? 'B2B Potansiyel Müşteri Yaratma Türkiye | İhracat Satış Danışmanlığı' 
                : isgerman 
                ? 'B2B Lead-Generierung Deutschland | Export Beratung' 
                : 'B2B Lead Generation Europe | Inbound & Outbound',
            description: isturkish 
                ? 'Türkiye\'nin önde gelen B2B lead üretimi uzmanları. İhracat pazarları için randevu ayarlama ve satış otomasyonu ile büyümenizi hızlandırın.'
                : isgerman
                ? 'Deutschlands führende B2B Lead-Generierung Spezialisten. Wir helfen Exporteuren beim Markteintritt mit Terminvereinbarung und Verkaufsautomation.'
                : 'Expert B2B lead generation in Europe. Inbound lead generation and outbound lead generation for predictable pipeline.',
            keywords: isturkish 
                ? 'B2B lead üretimi Türkiye, ihracat satış danışmanlığı, randevu ayarlama hizmeti, Avrupa pazarı girişi'
                : isgerman
                ? 'B2B Lead-Generierung Deutschland, Terminvereinbarung Exporteure, europäischer Markteintritt, Verkaufsautomation Deutschland'
                : 'B2B lead generation Europe, sales as a service, export market entry, appointment setting for exporters'
        },
        'solutions': {
            title: isturkish 
                ? 'B2B Satış Çözümleri | İhracat Danışmanlığı | Expandia' 
                : isgerman 
                ? 'B2B Verkaufslösungen | Export Beratung | Expandia' 
                : 'Lead Generation Solutions | Inbound & Outbound',
            description: isturkish 
                ? 'Avrupa pazarları için B2B satış çözümleri. İhracat danışmanlığı, lead üretimi ve satış otomasyonu hizmetleri.'
                : isgerman
                ? 'B2B Verkaufslösungen für europäische Märkte. Export-Beratung, Lead-Generierung und Verkaufsautomation.'
                : 'Inbound lead generation and outbound lead generation tailored to your growth goals.',
            keywords: isturkish 
                ? 'B2B satış çözümleri, ihracat danışmanlığı, satış otomasyonu, Avrupa pazarları'
                : isgerman
                ? 'B2B Verkaufslösungen, Export Beratung, Verkaufsautomation, europäische Märkte'
                : 'export sales solutions, B2B consulting Europe, international sales services, European market expansion'
        },
        'about': {
            title: isturkish 
                ? 'Hakkımızda | B2B Lead Generation Ajansı | Expandia' 
                : isgerman 
                ? 'Über uns | B2B Lead-Generierung Agentur | Expandia' 
                : 'About Us | Lead Generation Agency Europe | Expandia',
            description: isturkish 
                ? 'Avrupa\'da faaliyet gösteren B2B lead generation ajansı. Inbound ve outbound programları ile büyüyün.'
                : isgerman
                ? 'B2B Lead-Generierung Agentur in Europa. Inbound und Outbound für planbare Pipeline.'
                : 'Lead generation agency in Europe. Inbound lead generation and outbound lead generation for predictable pipeline.',
            keywords: isturkish 
                ? 'B2B satış ajansı Avrupa, ihracat pazarı uzmanları, uluslararası satış danışmanlığı'
                : isgerman
                ? 'B2B Verkaufsagentur Europa, Export Marktspezialisten, internationale Verkaufsberatung'
                : 'lead generation agency Europe, inbound lead generation, outbound lead generation'
        },
        'contact': {
            title: isturkish 
                ? 'İletişim | B2B Lead Generation Danışmanlığı | Expandia' 
                : isgerman 
                ? 'Kontakt | B2B Lead-Generierung Beratung | Expandia' 
                : 'Contact | Lead Generation Consultation | Expandia',
            description: isturkish 
                ? 'Inbound, outbound lead generation ve eğitim programları için ücretsiz danışmanlık. Planlı pipeline oluşturun.'
                : isgerman
                ? 'Kostenlose Beratung für Inbound, Outbound und Trainings. Planbare Pipeline aufbauen.'
                : 'Free consultation for inbound lead generation, outbound lead generation, and training. Build predictable pipeline fast.',
            keywords: isturkish 
                ? 'B2B lead üretimi danışmanlığı, ihracat satış konsültasyonu, uluslararası pazar girişi'
                : isgerman
                ? 'B2B Lead-Generierung Beratung, Export Verkaufs Konsultation, internationaler Markteintritt'
                : 'lead generation consultation, inbound lead generation, outbound lead generation, training'
        },
        'case-studies': {
            title: isturkish 
                ? 'Başarı Hikayeleri | B2B Lead Generation Sonuçları | Expandia' 
                : isgerman 
                ? 'Erfolgsgeschichten | B2B Lead-Generierung Ergebnisse | Expandia' 
                : 'Success Stories | Lead Generation Results | Expandia',
            description: isturkish 
                ? 'B2B lead generation başarı hikayeleri ve örnek çalışmalar. Inbound ve outbound program sonuçları.'
                : isgerman
                ? 'B2B Lead-Generierung Erfolgsgeschichten und Fallstudien. Inbound und Outbound Resultate.'
                : 'Lead generation case studies and proof of results. Inbound and outbound program outcomes from our clients.',
            keywords: isturkish 
                ? 'B2B satış başarı hikayeleri, ihracat pazarı örnek çalışmaları, uluslararası genişleme sonuçları'
                : isgerman
                ? 'B2B Verkaufs Erfolgsgeschichten, Export Markt Fallstudien, internationale Expansion Ergebnisse'
                : 'lead generation success stories, inbound lead gen case studies, outbound lead gen results'
        },
        'lead-generation-service': {
            title: 'Lead Generation Service | Inbound & Outbound | Expandia',
            description: 'Inbound lead generation, outbound lead generation, and conversion optimization to build predictable pipeline.',
            keywords: 'lead generation service, inbound lead generation, outbound lead generation, conversion optimization'
        },
        'appointment-setting-service': {
            title: 'Appointment Setting Service | Qualified Meetings | Expandia',
            description: 'Qualified meeting booking via multi-channel outbound: research, email, native calling, and follow-up.',
            keywords: 'appointment setting, outbound lead generation, SDR, B2B meetings'
        },
        'cold-email-agency': {
            title: 'Cold Email Agency | Deliverability & Replies | Expandia',
            description: 'High-deliverability cold email programs with research, personalization, sequencing, and reply-to-booking.',
            keywords: 'cold email agency, deliverability, inboxing, b2b outreach'
        },
        'b2b-lead-generation-agency': {
            title: 'B2B Lead Generation Agency | Qualified Leads | Expandia',
            description: 'Leading B2B Lead Generation agency. Generate qualified leads and continuously feed your sales pipeline with Expandia\'s proven strategies.',
            keywords: 'B2B lead generation Europe, qualified leads, appointment setting for exporters, export market entry'
        },
        'sales-development-agency': {
            title: 'Sales Development Agency | B2B Growth Experts | Expandia',
            description: 'Professional Sales Development agency specializing in B2B growth. Complete sales team outsourcing and performance optimization.',
            keywords: 'sales development agency, B2B sales outsourcing, sales team management, business development Europe'
        },
        'outbound-marketing-agency': {
            title: 'Outbound Marketing Agency | B2B Outreach | Expandia',
            description: 'Expert Outbound Marketing agency for B2B companies. Multi-channel outreach campaigns and customer acquisition strategies.',
            keywords: 'outbound marketing agency, B2B outreach, cold email campaigns, LinkedIn outreach, multi-channel marketing'
        },
        'email-marketing-management': {
            title: 'B2B Email Marketing Management | Lead Generation & Sales Development | Expandia',
            description: 'Professional B2B email marketing management service for lead generation and business development. Achieve $36 ROI per $1 invested with expert email campaigns.',
            keywords: 'B2B email marketing, lead generation, business development, email marketing management, sales development, ROI optimization'
        },
        'email-automation': {
            title: 'B2B Email Automation | Lead Generation & Sales Development | Expandia',
            description: 'Professional B2B email automation service for lead generation and business development. Automate sales sequences, nurture leads, and close deals while you focus on strategy.',
            keywords: 'B2B email automation, lead generation, business development, email sequences, sales automation, lead nurturing'
        },
        'prospect-finding-service': {
            title: 'Prospect Finding Service | B2B Lead Generation | Expandia',
            description: 'Professional prospect finding service for B2B companies. Identify and target ideal customers with our proven research and data intelligence methods.',
            keywords: 'prospect finding, B2B lead generation, business development, target account lists, ideal customer profile, lead research'
        },
        'outsourced-sales-team-service': {
            title: 'Outsourced Sales Team Service | B2B Sales as a Service | Expandia',
            description: 'Complete outsourced sales team service for B2B companies. Professional sales representatives and business development experts to accelerate your growth.',
            keywords: 'outsourced sales team, B2B sales as a service, business development, sales outsourcing, sales team management, revenue growth'
        },
        'distributor-finding': {
            title: 'Distributor Finding Service | International Business Development | Expandia',
            description: 'Professional distributor finding service for international expansion. Connect with the right partners and distributors in new markets across Europe.',
            keywords: 'distributor finding, international business development, export consulting, market entry, channel partners, distribution network'
        },
        'international-market-entry': {
            title: 'International Market Entry | Business Development Consulting | Expandia',
            description: 'Expert international market entry consulting for European expansion. Strategic planning and execution for successful market penetration.',
            keywords: 'international market entry, business development consulting, export consulting, market expansion, international growth, European markets'
        },
        'export-marketing-consulting': {
            title: 'Export Marketing Consulting | International Business Development | Expandia',
            description: 'Professional export marketing consulting for international business development. Strategic export planning and execution for global growth.',
            keywords: 'export marketing consulting, international business development, export strategy, global expansion, international sales, market development'
        },
        'overseas-sales-consulting': {
            title: 'Overseas Sales Consulting | International Business Development | Expandia',
            description: 'Expert overseas sales consulting for international business development. Strategic sales planning and execution for successful global expansion.',
            keywords: 'overseas sales consulting, international business development, global sales strategy, international expansion, overseas markets, sales consulting'
        },
        'europe-market-entry': {
            title: 'Europe Market Entry | Business Development Consulting | Expandia',
            description: 'Professional Europe market entry consulting for international expansion. Expert guidance and execution for successful European market penetration.',
            keywords: 'Europe market entry, business development consulting, European expansion, international growth, market entry strategy, European business development'
        },
        'vision-mission': {
            title: isturkish 
                ? 'Vizyon & Misyon | Expandia' 
                : isgerman 
                ? 'Vision & Mission | Expandia' 
                : 'Vision & Mission | Expandia',
            description: isturkish 
                ? 'Expandia\'nın vizyonu ve misyonu. B2B satış geliştirmenin geleceğini şekillendiriyoruz.'
                : isgerman
                ? 'Expandias Vision und Mission. Wir gestalten die Zukunft der B2B-Vertriebsentwicklung.'
                : 'Expandia\'s vision and mission. Shaping the future of B2B sales development.',
            keywords: isturkish 
                ? 'Expandia vizyon, Expandia misyon, B2B satış ajansı değerleri'
                : isgerman
                ? 'Expandia Vision, Expandia Mission, B2B-Verkaufsagentur Werte'
                : 'Expandia vision, Expandia mission, B2B sales agency values'
        },
        'vizyon-misyon': {
            title: 'Vizyon & Misyon | Expandia',
            description: 'Expandia\'nın vizyonu ve misyonu. B2B satış geliştirmenin geleceğini şekillendiriyoruz.',
            keywords: 'Expandia vizyon, Expandia misyon, B2B satış ajansı değerleri'
        },
        'our-ethical-principles': {
            title: isturkish 
                ? 'Etik İlkelerimiz | Expandia' 
                : isgerman 
                ? 'Unsere ethischen Grundsätze | Expandia' 
                : 'Our Ethical Principles | Expandia',
            description: isturkish 
                ? 'Expandia\'nın etik ilkeleri ve değerleri. Güven ve dürüstlüğün temeli.'
                : isgerman
                ? 'Expandias ethische Grundsätze und Werte. Die Grundlage von Vertrauen und Integrität.'
                : 'Expandia\'s ethical principles and values. The foundation of trust and integrity.',
            keywords: isturkish 
                ? 'Expandia etik ilkeleri, iş etiği, KVKK uyumu, dürüstlük'
                : isgerman
                ? 'Expandia ethische Grundsätze, Geschäftsethik, DSGVO-Konformität, Integrität'
                : 'Expandia ethical principles, business ethics, GDPR compliance, integrity'
        },
        'etik-ilkelerimiz': {
            title: 'Etik İlkelerimiz | Expandia',
            description: 'Expandia\'nın etik ilkeleri ve değerleri. Güven ve dürüstlüğün temeli.',
            keywords: 'Expandia etik ilkeleri, iş etiği, KVKK uyumu, dürüstlük'
        },
        'market-foundation-program': {
            title: isturkish 
                ? 'Pazar Temeli Programı | Expandia' 
                : 'Market Foundation Program | Expandia',
            description: isturkish 
                ? 'Yeni pazarlara giren şirketler için. Konumlandırma, mesajlaşma ve ilk nitelikli toplantılar.'
                : 'Perfect for companies entering new markets. Build positioning, messaging and first qualified meetings.',
            keywords: isturkish 
                ? 'pazar girişi, B2B satış programı, lead generation, pazar geliştirme'
                : 'market entry, B2B sales program, lead generation, market development'
        },
        'pazar-temeli-programi': {
            title: 'Pazar Temeli Programı | Expandia',
            description: 'Yeni pazarlara giren şirketler için. Konumlandırma, mesajlaşma ve ilk nitelikli toplantılar.',
            keywords: 'pazar girişi, B2B satış programı, lead generation, pazar geliştirme'
        },
        'market-accelerator-program': {
            title: isturkish 
                ? 'Pazar Hızlandırıcı Program | Expandia' 
                : 'Market Accelerator Program | Expandia',
            description: isturkish 
                ? 'Büyük pazarlara hızla hakim olun. Agresif iletişim ve ölçeklenebilir büyüme.'
                : 'Dominate large markets fast. Aggressive outreach and scalable growth.',
            keywords: isturkish 
                ? 'pazar hızlandırma, hızlı büyüme, B2B ölçeklendirme, satış hızlandırma'
                : 'market acceleration, rapid growth, B2B scaling, sales acceleration'
        },
        'pazar-hizlandirici-program': {
            title: 'Pazar Hızlandırıcı Program | Expandia',
            description: 'Büyük pazarlara hızla hakim olun. Agresif iletişim ve ölçeklenebilir büyüme.',
            keywords: 'pazar hızlandırma, hızlı büyüme, B2B ölçeklendirme, satış hızlandırma'
        },
        'part-time-lead-generation-team': {
            title: isturkish
                ? 'Part-Time Lead Generation Ekibi | Expandia'
                : 'Part-Time Lead Generation Team | Expandia',
            description: isturkish
                ? '5-50 kişilik şirketler için özel ekip üyesi. Ayda 40 saat, düşük maliyet, yüksek performans.'
                : 'Dedicated team member for 5-50 headcount companies. 40 hours/month, low cost, high performance.',
            keywords: isturkish
                ? 'part-time lead generation, part-time Lead Generation, dış kaynak satış, B2B ekip'
                : 'part-time lead generation, part-time Lead Generation, outsourced sales, B2B team'
        },
        'kismi-is-gelistirme-ekibi': {
            title: 'Part-Time Lead Generation Ekibi | Expandia',
            description: '5-50 kişilik şirketler için özel ekip üyesi. Ayda 40 saat, düşük maliyet, yüksek performans.',
            keywords: 'part-time lead generation, fractional Lead Generation, dış kaynak satış, B2B ekip'
        },
        'kurumsal-dijital-hediye-promosyon': {
            title: 'Kurumsal Dijital Hediye Paketleri | Netflix, Spotify, Disney+ | Expandia',
            description: 'Netflix, Spotify, Disney+ ve onlarca global markayı çalışanlarınıza hediye edin. Gerçek kullanım takibi, çok ülke desteği. Abonelik yok, kullandıkça öde.',
            keywords: 'kurumsal hediye, dijital hediye kartı, çalışan motivasyonu, kurumsal promosyon, Netflix hediye, Spotify hediye'
        },
        'corporate-digital-gifting': {
            title: isturkish
                ? 'Kurumsal Dijital Hediye Paketleri | Netflix, Spotify, Disney+ | Expandia'
                : isgerman
                ? 'Unternehmens-Digitale Geschenke | Netflix, Spotify, Disney+ | Expandia'
                : 'Corporate Digital Gifting | Netflix, Spotify, Disney+ | Expandia',
            description: isturkish
                ? 'Netflix, Spotify, Disney+ ve onlarca global markayı çalışanlarınıza hediye edin. Gerçek kullanım takibi, çok ülke desteği.'
                : isgerman
                ? 'Schenken Sie Netflix, Spotify, Disney+ und Dutzende globaler Marken an Ihre Mitarbeiter. Echtes Nutzungstracking, Multi-Land-Unterstützung.'
                : 'Gift Netflix, Spotify, Disney+, and dozens of global brands to your employees. Real usage tracking, multi-country support.',
            keywords: isturkish
                ? 'kurumsal hediye, dijital hediye kartı, çalışan motivasyonu, kurumsal promosyon'
                : isgerman
                ? 'Unternehmensgeschenke, digitale Geschenkkarte, Mitarbeitermotivation, Unternehmenspromotion'
                : 'corporate gifting, digital gift card, employee motivation, corporate promotion, Netflix gift, Spotify gift'
        },
        'unternehmens-digitale-geschenke': {
            title: 'Unternehmens-Digitale Geschenke | Netflix, Spotify, Disney+ | Expandia',
            description: 'Schenken Sie Netflix, Spotify, Disney+ und Dutzende globaler Marken an Ihre Mitarbeiter. Echtes Nutzungstracking, Multi-Land-Unterstützung.',
            keywords: 'Unternehmensgeschenke, digitale Geschenkkarte, Mitarbeitermotivation, Unternehmenspromotion'
        },
        'abd-pr-hizmeti': {
            title: 'USA PR Service | Basın Bülteni Dağıtım Hizmeti | Expandia',
            description: 'ABD pazarına yönelik profesyonel basın bülteni yazımı ve wire dağıtım hizmeti. Haberinizi ABD medyasına ulaştırın.',
            keywords: 'USA PR service, basın bülteni dağıtımı, ABD medya, press release wire, kurumsal PR'
        },
        'usa-pr-service': {
            title: isturkish
                ? 'USA PR Service | Basın Bülteni Dağıtım Hizmeti | Expandia'
                : isgerman
                ? 'USA PR-Dienst | Pressemitteilung Vertriebsservice | Expandia'
                : 'USA PR Service | Press Release Distribution Service | Expandia',
            description: isturkish
                ? 'ABD pazarına yönelik profesyonel basın bülteni yazımı ve wire dağıtım hizmeti.'
                : isgerman
                ? 'Professioneller Pressemitteilungsschreibservice und Wire-Verteilung für den US-Markt.'
                : 'Professional press release writing and wire distribution service for the US market. Get your news featured in US media.',
            keywords: isturkish
                ? 'USA PR service, basın bülteni dağıtımı, ABD medya, press release wire'
                : isgerman
                ? 'USA PR-Dienst, Pressemitteilungsverteilung, US-Medien, Pressemitteilung'
                : 'USA PR service, press release distribution, US media, press release wire, corporate PR'
        },
        'usa-pr-dienst': {
            title: 'USA PR-Dienst | Pressemitteilung Vertriebsservice | Expandia',
            description: 'Professioneller Pressemitteilungsschreibservice und Wire-Verteilung für den US-Markt. Bringen Sie Ihre Nachricht in US-Medien.',
            keywords: 'USA PR-Dienst, Pressemitteilungsverteilung, US-Medien, Pressemitteilung'
        },
        'markt-grundlagen-programm': {
            title: 'Markt-Grundlagen-Programm | Expandia',
            description: 'Perfekt für Unternehmen, die in neue Märkte eintreten. Positionierung, Messaging und erste qualifizierte Meetings.',
            keywords: 'Markteintritt, B2B Vertriebsprogramm, Lead-Generierung, Marktentwicklung'
        },
        'markt-beschleuniger-programm': {
            title: 'Markt-Beschleuniger-Programm | Expandia',
            description: 'Dominieren Sie große Märkte schnell. Aggressives Outreach und skalierbares Wachstum.',
            keywords: 'Marktbeschleunigung, schnelles Wachstum, B2B-Skalierung, Vertriebsbeschleunigung'
        },
        'teilzeit-bizdev-team': {
            title: 'Teilzeit Lead Generation Team | Expandia',
            description: 'Dediziertes Teammitglied für Unternehmen mit 5-50 Mitarbeitern. 40 Stunden/Monat, niedrige Kosten, hohe Leistung.',
            keywords: 'Teilzeit Lead Generation, Fractional Lead Generation, ausgelagerter Vertrieb, B2B-Team'
        }
    };
    
    return metadata[templateName] || metadata['index'];
}

// Function to get URL mappings for hreflang - FIXED VERSION
function getHreflangUrls(templateName) {
    const urls = {
        'index': { 
            en: '', 
            tr: 'tr/', 
            de: 'de/' 
        },
        'solutions': { 
            en: 'solutions.html', 
            tr: 'tr/solutions.html', 
            de: 'de/solutions.html' 
        },
        'about': { 
            en: 'about.html', 
            tr: 'tr/about.html', 
            de: 'de/about.html' 
        },
        'contact': { 
            en: 'contact.html', 
            tr: 'tr/contact.html', 
            de: 'de/contact.html' 
        },
        'case-studies': { 
            en: 'case-studies.html', 
            tr: 'tr/case-studies.html', 
            de: 'de/case-studies.html' 
        },
        'vision-mission': { 
            en: 'vision-mission.html', 
            tr: 'tr/vizyon-misyon.html', 
            de: 'de/vision-mission.html' 
        },
        'vizyon-misyon': { 
            en: 'vision-mission.html', 
            tr: 'tr/vizyon-misyon.html', 
            de: 'de/vision-mission.html' 
        },
        'our-ethical-principles': { 
            en: 'our-ethical-principles.html', 
            tr: 'tr/etik-ilkelerimiz.html', 
            de: 'de/our-ethical-principles.html' 
        },
        'etik-ilkelerimiz': { 
            en: 'our-ethical-principles.html', 
            tr: 'tr/etik-ilkelerimiz.html', 
            de: 'de/our-ethical-principles.html' 
        },
        'market-foundation-program': {
            en: 'market-foundation-program.html',
            tr: 'tr/pazar-temeli-programi.html',
            de: 'de/markt-grundlagen-programm.html'
        },
        'pazar-temeli-programi': {
            en: 'market-foundation-program.html',
            tr: 'tr/pazar-temeli-programi.html',
            de: 'de/markt-grundlagen-programm.html'
        },
        'markt-grundlagen-programm': {
            en: 'market-foundation-program.html',
            tr: 'tr/pazar-temeli-programi.html',
            de: 'de/markt-grundlagen-programm.html'
        },
        'market-accelerator-program': {
            en: 'market-accelerator-program.html',
            tr: 'tr/pazar-hizlandirici-program.html',
            de: 'de/markt-beschleuniger-programm.html'
        },
        'pazar-hizlandirici-program': {
            en: 'market-accelerator-program.html',
            tr: 'tr/pazar-hizlandirici-program.html',
            de: 'de/markt-beschleuniger-programm.html'
        },
        'markt-beschleuniger-programm': {
            en: 'market-accelerator-program.html',
            tr: 'tr/pazar-hizlandirici-program.html',
            de: 'de/markt-beschleuniger-programm.html'
        },
        'part-time-lead-generation-team': {
            en: 'part-time-lead-generation-team.html',
            tr: 'tr/kismi-is-gelistirme-ekibi.html',
            de: 'de/teilzeit-bizdev-team.html'
        },
        'kismi-is-gelistirme-ekibi': {
            en: 'part-time-lead-generation-team.html',
            tr: 'tr/kismi-is-gelistirme-ekibi.html',
            de: 'de/teilzeit-bizdev-team.html'
        },
        'teilzeit-bizdev-team': {
            en: 'part-time-lead-generation-team.html',
            tr: 'tr/kismi-is-gelistirme-ekibi.html',
            de: 'de/teilzeit-bizdev-team.html'
        },
        'abd-pr-hizmeti': {
            en: 'usa-pr-service.html',
            tr: 'tr/abd-pr-hizmeti.html',
            de: 'de/usa-pr-dienst.html'
        },
        'corporate-digital-gifting': {
            en: 'corporate-digital-gifting.html',
            tr: 'tr/kurumsal-dijital-hediye-promosyon.html',
            de: 'de/unternehmens-digitale-geschenke.html'
        },
        'usa-pr-service': {
            en: 'usa-pr-service.html',
            tr: 'tr/abd-pr-hizmeti.html',
            de: 'de/usa-pr-dienst.html'
        },
        'kurumsal-dijital-hediye-promosyon': {
            en: 'corporate-digital-gifting.html',
            tr: 'tr/kurumsal-dijital-hediye-promosyon.html',
            de: 'de/unternehmens-digitale-geschenke.html'
        },
        'unternehmens-digitale-geschenke': {
            en: 'corporate-digital-gifting.html',
            tr: 'tr/kurumsal-dijital-hediye-promosyon.html',
            de: 'de/unternehmens-digitale-geschenke.html'
        },
        'usa-pr-dienst': {
            en: 'usa-pr-service.html',
            tr: 'tr/abd-pr-hizmeti.html',
            de: 'de/usa-pr-dienst.html'
        }
    };
    
    return urls[templateName] || urls['index'];
}

// Function to get active navigation states
function getActiveStates(templateName) {
    const activeStates = {
        'index': {
            'HOME_ACTIVE': 'text-primary',
            'SOLUTIONS_ACTIVE': '',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': '',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': '',
            'ABOUT_ITEM_ACTIVE': '',
            'CONTACT_ITEM_ACTIVE': '',
            'CASESTUDIES_ITEM_ACTIVE': '',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'SOLUTIONS_MOBILE_ACTIVE': '',
            'ABOUT_MOBILE_ACTIVE': '',
            'CONTACT_MOBILE_ACTIVE': '',
            'CASESTUDIES_MOBILE_ACTIVE': '',
            'BLOG_MOBILE_ACTIVE': ''
        },
        'solutions': {
            'HOME_ACTIVE': '',
            'SOLUTIONS_ACTIVE': 'text-primary',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': '',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20',
            'ABOUT_ITEM_ACTIVE': '',
            'CONTACT_ITEM_ACTIVE': '',
            'CASESTUDIES_ITEM_ACTIVE': '',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': '',
            'SOLUTIONS_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'ABOUT_MOBILE_ACTIVE': '',
            'CONTACT_MOBILE_ACTIVE': '',
            'CASESTUDIES_MOBILE_ACTIVE': '',
            'BLOG_MOBILE_ACTIVE': ''
        },
        'about': {
            'HOME_ACTIVE': '',
            'SOLUTIONS_ACTIVE': '',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': 'text-primary',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': '',
            'ABOUT_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20',
            'CONTACT_ITEM_ACTIVE': '',
            'CASESTUDIES_ITEM_ACTIVE': '',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': '',
            'SOLUTIONS_MOBILE_ACTIVE': '',
            'ABOUT_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'CONTACT_MOBILE_ACTIVE': '',
            'CASESTUDIES_MOBILE_ACTIVE': '',
            'BLOG_MOBILE_ACTIVE': ''
        },
        'contact': {
            'HOME_ACTIVE': '',
            'SOLUTIONS_ACTIVE': '',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': 'text-primary',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': '',
            'ABOUT_ITEM_ACTIVE': '',
            'CONTACT_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20',
            'CASESTUDIES_ITEM_ACTIVE': '',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': '',
            'SOLUTIONS_MOBILE_ACTIVE': '',
            'ABOUT_MOBILE_ACTIVE': '',
            'CONTACT_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'CASESTUDIES_MOBILE_ACTIVE': '',
            'BLOG_MOBILE_ACTIVE': ''
        },
        'case-studies': {
            'HOME_ACTIVE': '',
            'SOLUTIONS_ACTIVE': 'text-primary',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': '',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': '',
            'ABOUT_ITEM_ACTIVE': '',
            'CONTACT_ITEM_ACTIVE': '',
            'CASESTUDIES_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': '',
            'SOLUTIONS_MOBILE_ACTIVE': '',
            'ABOUT_MOBILE_ACTIVE': '',
            'CONTACT_MOBILE_ACTIVE': '',
            'CASESTUDIES_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'BLOG_MOBILE_ACTIVE': ''
        },
        'vision-mission': {
            'HOME_ACTIVE': '',
            'SOLUTIONS_ACTIVE': '',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': 'text-primary',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': '',
            'ABOUT_ITEM_ACTIVE': '',
            'VISION_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20',
            'ETHICS_ITEM_ACTIVE': '',
            'CONTACT_ITEM_ACTIVE': '',
            'CASESTUDIES_ITEM_ACTIVE': '',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': '',
            'SOLUTIONS_MOBILE_ACTIVE': '',
            'ABOUT_MOBILE_ACTIVE': '',
            'VISION_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'ETHICS_MOBILE_ACTIVE': '',
            'CONTACT_MOBILE_ACTIVE': '',
            'CASESTUDIES_MOBILE_ACTIVE': '',
            'BLOG_MOBILE_ACTIVE': ''
        },
        'vizyon-misyon': {
            'HOME_ACTIVE': '',
            'SOLUTIONS_ACTIVE': '',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': 'text-primary',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': '',
            'ABOUT_ITEM_ACTIVE': '',
            'VISION_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20',
            'ETHICS_ITEM_ACTIVE': '',
            'CONTACT_ITEM_ACTIVE': '',
            'CASESTUDIES_ITEM_ACTIVE': '',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': '',
            'SOLUTIONS_MOBILE_ACTIVE': '',
            'ABOUT_MOBILE_ACTIVE': '',
            'VISION_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'ETHICS_MOBILE_ACTIVE': '',
            'CONTACT_MOBILE_ACTIVE': '',
            'CASESTUDIES_MOBILE_ACTIVE': '',
            'BLOG_MOBILE_ACTIVE': ''
        },
        'our-ethical-principles': {
            'HOME_ACTIVE': '',
            'SOLUTIONS_ACTIVE': '',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': 'text-primary',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': '',
            'ABOUT_ITEM_ACTIVE': '',
            'VISION_ITEM_ACTIVE': '',
            'ETHICS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20',
            'CONTACT_ITEM_ACTIVE': '',
            'CASESTUDIES_ITEM_ACTIVE': '',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': '',
            'SOLUTIONS_MOBILE_ACTIVE': '',
            'ABOUT_MOBILE_ACTIVE': '',
            'VISION_MOBILE_ACTIVE': '',
            'ETHICS_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'CONTACT_MOBILE_ACTIVE': '',
            'CASESTUDIES_MOBILE_ACTIVE': '',
            'BLOG_MOBILE_ACTIVE': ''
        },
        'etik-ilkelerimiz': {
            'HOME_ACTIVE': '',
            'SOLUTIONS_ACTIVE': '',
            'ABOUT_ACTIVE': '',
            'CONTACT_ACTIVE': '',
            'CASESTUDIES_ACTIVE': '',
            'BLOG_ACTIVE': '',
            'COMPANY_ACTIVE': 'text-primary',
            'HOME_ITEM_ACTIVE': '',
            'SOLUTIONS_ITEM_ACTIVE': '',
            'ABOUT_ITEM_ACTIVE': '',
            'VISION_ITEM_ACTIVE': '',
            'ETHICS_ITEM_ACTIVE': 'bg-primary/10 border border-primary/20',
            'CONTACT_ITEM_ACTIVE': '',
            'CASESTUDIES_ITEM_ACTIVE': '',
            'BLOG_ITEM_ACTIVE': '',
            'HOME_MOBILE_ACTIVE': '',
            'SOLUTIONS_MOBILE_ACTIVE': '',
            'ABOUT_MOBILE_ACTIVE': '',
            'VISION_MOBILE_ACTIVE': '',
            'ETHICS_MOBILE_ACTIVE': 'class="font-semibold text-primary"',
            'CONTACT_MOBILE_ACTIVE': '',
            'CASESTUDIES_MOBILE_ACTIVE': '',
            'BLOG_MOBILE_ACTIVE': ''
        }
    };
    
    return activeStates[templateName] || activeStates['index'];
}

// Main build function with enhanced SEO
function buildPage(templateName, outputName, lang = 'en') {
    const templateDir = lang === 'tr' || lang === 'de' ? `templates/${lang}/` : 'templates/';
    const templatePath = `${templateDir}${templateName}.html`;
    
    if (!fs.existsSync(templatePath)) {
        console.warn(`Template not found: ${templatePath}, using fallback`);
        return;
    }
    
    let content = fs.readFileSync(templatePath, 'utf8');
    
    // Create the HTML document template
    let htmlTemplate = createHTMLTemplate(lang);
    // Select the correct header based on language
    let pageNavigation = lang === 'tr' ? navigationTR : lang === 'de' ? navigationDE : navigationEN;
    let pageFooter = lang === 'tr' ? footerTR : lang === 'de' ? footerDE : footerEN;
    
    // Remove data-i18n attributes and keep the content as is
    content = content.replace(/\s*data-i18n="[^"]*"/g, '');
    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');
    
    // Apply template variables based on language
    const basePath = (lang === 'tr' || lang === 'de') ? '../' : './';
    const logoPath = (lang === 'tr' || lang === 'de') ? '../Expandia-main-logo-koyu-yesil.png' : 'Expandia-main-logo-koyu-yesil.png';
    const turkishServicesPath = lang === 'tr' ? './' : './tr/';
    
    // Replace template variables in navigation, footer, and content
    pageNavigation = pageNavigation.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageNavigation = pageNavigation.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageNavigation = pageNavigation.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    pageFooter = pageFooter.replace(/\{\{BASE_PATH\}\}/g, basePath);
    pageFooter = pageFooter.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    pageFooter = pageFooter.replace(/\{\{TURKISH_SERVICES_PATH\}\}/g, turkishServicesPath);
    content = content.replace(/\{\{BASE_PATH\}\}/g, basePath);
    
    // Replace language-specific service page names
    const servicePages = {
        en: {
            foundation: 'market-foundation-program.html',
            accelerator: 'market-accelerator-program.html',
            fractional: 'part-time-lead-generation-team.html',
            vision: 'vision-mission.html',
            ethics: 'our-ethical-principles.html'
        },
        tr: {
            foundation: 'pazar-temeli-programi.html',
            accelerator: 'pazar-hizlandirici-program.html',
            fractional: 'kismi-is-gelistirme-ekibi.html',
            vision: 'vizyon-misyon.html',
            ethics: 'etik-ilkelerimiz.html'
        },
        de: {
            foundation: 'markt-grundlagen-programm.html',
            accelerator: 'markt-beschleuniger-programm.html',
            fractional: 'teilzeit-bizdev-team.html',
            vision: 'vision-mission.html',
            ethics: 'our-ethical-principles.html'
        }
    };
    
    const currentLangPages = servicePages[lang] || servicePages.en;
    pageNavigation = pageNavigation.replace(/\{\{MARKET_FOUNDATION_PAGE\}\}/g, currentLangPages.foundation);
    pageNavigation = pageNavigation.replace(/\{\{MARKET_ACCELERATOR_PAGE\}\}/g, currentLangPages.accelerator);
    pageNavigation = pageNavigation.replace(/\{\{FRACTIONAL_BIZDEV_PAGE\}\}/g, currentLangPages.fractional);
    pageNavigation = pageNavigation.replace(/\{\{VISION_MISSION_PAGE\}\}/g, currentLangPages.vision);
    pageNavigation = pageNavigation.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, currentLangPages.ethics);
    pageFooter = pageFooter.replace(/\{\{MARKET_FOUNDATION_PAGE\}\}/g, currentLangPages.foundation);
    pageFooter = pageFooter.replace(/\{\{MARKET_ACCELERATOR_PAGE\}\}/g, currentLangPages.accelerator);
    pageFooter = pageFooter.replace(/\{\{FRACTIONAL_BIZDEV_PAGE\}\}/g, currentLangPages.fractional);
    pageFooter = pageFooter.replace(/\{\{VISION_MISSION_PAGE\}\}/g, currentLangPages.vision);
    pageFooter = pageFooter.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, currentLangPages.ethics);
    content = content.replace(/\{\{MARKET_FOUNDATION_PAGE\}\}/g, currentLangPages.foundation);
    content = content.replace(/\{\{MARKET_ACCELERATOR_PAGE\}\}/g, currentLangPages.accelerator);
    content = content.replace(/\{\{FRACTIONAL_BIZDEV_PAGE\}\}/g, currentLangPages.fractional);
    content = content.replace(/\{\{VISION_MISSION_PAGE\}\}/g, currentLangPages.vision);
    content = content.replace(/\{\{ETHICAL_PRINCIPLES_PAGE\}\}/g, currentLangPages.ethics);
    
    // For German pages, fix ALL solutions.html links to be local AFTER BASE_PATH replacement
    if (lang === 'de') {
        // Convert ALL ../solutions.html links to ./solutions.html for German pages
        pageNavigation = pageNavigation.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
        content = content.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
        pageFooter = pageFooter.replace(/href="\.\.\/solutions\.html/g, 'href="./solutions.html');
    }
    
    // Get active states for navigation
    const activeStates = getActiveStates(templateName);
    
    // Replace navigation template variables
    for (const [key, value] of Object.entries(activeStates)) {
        pageNavigation = pageNavigation.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    
    // Apply language-specific translations and fixes
    if (lang === 'tr') {
        // Apply Turkish translations to all content
        pageNavigation = applyTurkishTranslations(pageNavigation);
        pageFooter = applyTurkishTranslations(pageFooter);
        content = applyTurkishTranslations(content);
        
        // Fix Turkish service page links - Turkish has comprehensive standalone service pages
        // Lead Generation & Sales section (handle both ../ and ./ patterns)
        pageNavigation = pageNavigation.replace(/href="\.\.\/b2b-lead-generation-agency\.html"/g, 'href="./b2b-lead-generation-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/b2b-lead-generation-agency\.html"/g, 'href="./b2b-lead-generation-ajansi.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/lead-generation-service\.html"/g, 'href="./lead-generation-hizmeti.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/lead-generation-service\.html"/g, 'href="./lead-generation-hizmeti.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/prospect-finding-service\.html"/g, 'href="./potansiyel-musteri-bulma-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/prospect-finding-service\.html"/g, 'href="./potansiyel-musteri-bulma-ajansi.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/sales-development-agency\.html"/g, 'href="./satis-gelistirme-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/sales-development-agency\.html"/g, 'href="./satis-gelistirme-ajansi.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/appointment-setting-service\.html"/g, 'href="./randevu-ayarlama-hizmeti.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/appointment-setting-service\.html"/g, 'href="./randevu-ayarlama-hizmeti.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/outsourced-sales-team-service\.html"/g, 'href="./dis-kaynakli-satis-ekibi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/outsourced-sales-team-service\.html"/g, 'href="./dis-kaynakli-satis-ekibi.html"');

        // Marketing & Outreach section
        pageNavigation = pageNavigation.replace(/href="\.\.\/outbound-marketing-agency\.html"/g, 'href="./outbound-pazarlama-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/outbound-marketing-agency\.html"/g, 'href="./outbound-pazarlama-ajansi.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/cold-email-agency\.html"/g, 'href="./soguk-e-posta-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/cold-email-agency\.html"/g, 'href="./soguk-e-posta-ajansi.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/email-automation\.html"/g, 'href="./solutions.html#email-automation"');
        pageNavigation = pageNavigation.replace(/href="\.\/email-automation\.html"/g, 'href="./solutions.html#email-automation"');



        // International Expansion section
        pageNavigation = pageNavigation.replace(/href="\.\.\/export-marketing-consulting\.html"/g, 'href="./ihracat-pazarlama-danismanligi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/export-marketing-consulting\.html"/g, 'href="./ihracat-pazarlama-danismanligi.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/international-market-entry\.html"/g, 'href="./uluslararasi-pazar-girisi-danismanligi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/international-market-entry\.html"/g, 'href="./uluslararasi-pazar-girisi-danismanligi.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/distributor-finding\.html"/g, 'href="./distributor-bulma-hizmeti.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/distributor-finding\.html"/g, 'href="./distributor-bulma-hizmeti.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/overseas-sales-consulting\.html"/g, 'href="./yurt-disi-satis-danismanligi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/overseas-sales-consulting\.html"/g, 'href="./yurt-disi-satis-danismanligi.html"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/europe-market-entry\.html"/g, 'href="./avrupa-pazarina-giris.html"');
        pageNavigation = pageNavigation.replace(/href="\.\/europe-market-entry\.html"/g, 'href="./avrupa-pazarina-giris.html"');

        // Legal policy links for Turkish pages
        pageFooter = pageFooter.replace(/href="\.\/privacy-policy\.html"/g, 'href="./gizlilik-politikasi.html"');
        pageFooter = pageFooter.replace(/href="\.\/terms-of-service\.html"/g, 'href="../terms-of-service.html"');
        pageFooter = pageFooter.replace(/href="\.\/cookie-policy\.html"/g, 'href="../cookie-policy.html"');
        
        // International Expansion section
        pageNavigation = pageNavigation.replace(/href="\.\.\/export-marketing-consulting\.html"/g, 'href="./ihracat-pazarlama-danismanligi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/international-market-entry\.html"/g, 'href="./uluslararasi-pazar-girisi-danismanligi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/distributor-finding\.html"/g, 'href="./distributor-bulma-hizmeti.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/overseas-sales-consulting\.html"/g, 'href="./yurt-disi-satis-danismanligi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/europe-market-entry\.html"/g, 'href="./avrupa-pazarina-giris.html"');
        
        // Remove data-i18n attributes from Turkish pages
        content = content.replace(/\s*data-i18n="[^"]*"/g, '');
        pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
        pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');
    } else if (lang === 'de') {
        // Convert ALL standalone service page links to German solutions.html sections
        // since German doesn't have standalone service pages
        pageNavigation = pageNavigation.replace(/href="\.\.\/b2b-lead-generation-agency\.html"/g, 'href="./solutions.html#b2b-lead-generation"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/lead-generation-service\.html"/g, 'href="./solutions.html#lead-generation"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/prospect-finding-service\.html"/g, 'href="./solutions.html#prospect-finding"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/sales-development-agency\.html"/g, 'href="./solutions.html#sales-development"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/appointment-setting-service\.html"/g, 'href="./solutions.html#appointment-setting"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/outsourced-sales-team-service\.html"/g, 'href="./solutions.html#outsourced-sales-team"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/outbound-marketing-agency\.html"/g, 'href="./solutions.html#outbound-marketing"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/cold-email-agency\.html"/g, 'href="./solutions.html#cold-email"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/email-automation\.html"/g, 'href="./solutions.html#email-automation"');

        pageNavigation = pageNavigation.replace(/href="\.\.\/export-marketing-consulting\.html"/g, 'href="./solutions.html#export-marketing"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/international-market-entry\.html"/g, 'href="./solutions.html#international-market-entry"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/distributor-finding\.html"/g, 'href="./solutions.html#distributor-finding"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/overseas-sales-consulting\.html"/g, 'href="./solutions.html#overseas-sales-consulting"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/europe-market-entry\.html"/g, 'href="./solutions.html#europe-market-entry"');
        
        // Fix Company menu links for German pages
        pageNavigation = pageNavigation.replace(/href="\.\.\/about\.html"/g, 'href="./about.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/contact\.html"/g, 'href="./contact.html"');
        
        // Fix language switcher for German pages  
        pageNavigation = pageNavigation.replace(
            /<span id="current-flag">🇺🇸<\/span>/g,
            '<span id="current-flag">🇩🇪</span>'
        );
        // Also fix any other instances
        pageNavigation = pageNavigation.replace(
            /id="current-flag">🇺🇸</g,
            'id="current-flag">🇩🇪<'
        );
        pageNavigation = pageNavigation.replace(
            /href="#" data-lang="en"/g,
            `href="../${outputName}.html" data-lang="en"`
        );
        pageNavigation = pageNavigation.replace(
            /href="#" data-lang="tr"/g,
            `href="../tr/${outputName}.html" data-lang="tr"`
        );
        pageNavigation = pageNavigation.replace(
            /href="#" data-lang="de"/g,
            `href="${outputName}.html" data-lang="de"`
        );
        
        // Apply German translations to all content
        pageNavigation = applyGermanTranslations(pageNavigation);
        pageFooter = applyGermanTranslations(pageFooter);
        content = applyGermanTranslations(content);
        
        // Remove broken links to non-existent German service pages
        pageNavigation = pageNavigation.replace(/<li><a href="\.\/sales-development-agency\.html"[^>]*>.*?<\/a><\/li>/g, '');
        pageNavigation = pageNavigation.replace(/<a href="\.\/sales-development-agency\.html"[^>]*>.*?<\/a>/g, '');
        pageNavigation = pageNavigation.replace(/<li><a href="\.\/export-marketing-consulting\.html"[^>]*>.*?<\/a><\/li>/g, '');
        pageNavigation = pageNavigation.replace(/<a href="\.\/export-marketing-consulting\.html"[^>]*>.*?<\/a>/g, '');
        pageNavigation = pageNavigation.replace(/<li><a href="\.\/b2b-lead-generation-agency\.html"[^>]*>.*?<\/a><\/li>/g, '');
        pageNavigation = pageNavigation.replace(/<a href="\.\/b2b-lead-generation-agency\.html"[^>]*>.*?<\/a>/g, '');
        pageNavigation = pageNavigation.replace(/<li><a href="\.\/lead-generation-service\.html"[^>]*>.*?<\/a><\/li>/g, '');
        pageNavigation = pageNavigation.replace(/<a href="\.\/lead-generation-service\.html"[^>]*>.*?<\/a>/g, '');
        pageNavigation = pageNavigation.replace(/<li><a href="\.\/appointment-setting-service\.html"[^>]*>.*?<\/a><\/li>/g, '');
        pageNavigation = pageNavigation.replace(/<a href="\.\/appointment-setting-service\.html"[^>]*>.*?<\/a>/g, '');
        pageNavigation = pageNavigation.replace(/<li><a href="\.\/outbound-marketing-agency\.html"[^>]*>.*?<\/a><\/li>/g, '');
        pageNavigation = pageNavigation.replace(/<a href="\.\/outbound-marketing-agency\.html"[^>]*>.*?<\/a>/g, '');
        pageNavigation = pageNavigation.replace(/<li><a href="\.\/cold-email-agency\.html"[^>]*>.*?<\/a><\/li>/g, '');
        pageNavigation = pageNavigation.replace(/<a href="\.\/cold-email-agency\.html"[^>]*>.*?<\/a>/g, '');
        
        // Remove data-i18n attributes from German pages
        content = content.replace(/\s*data-i18n="[^"]*"/g, '');
        pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
        pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');
        // Force-replace any remaining Turkish legal text in footer/navigation/content
        const turkishFooterLegal1 = 'Expandia ticari sırlar ve KVKK’ya saygılıdır; müşteri/tedarikçi listelerini temin etmez ve paylaşmaz.';
        const turkishFooterLegal2 = 'Expandia ticari sırlar ve KVKK\'ya saygılıdır; müşteri/tedarikçi listelerini temin etmez ve paylaşmaz.';
        const germanFooterLegal = 'Expandia respektiert Geschäftsgeheimnisse und die DSGVO; wir beschaffen oder teilen keine Kunden-/Lieferantenlisten.';
        pageFooter = pageFooter.replace(new RegExp(turkishFooterLegal1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), germanFooterLegal);
        pageFooter = pageFooter.replace(new RegExp(turkishFooterLegal2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), germanFooterLegal);
        content = content.replace(new RegExp(turkishFooterLegal1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), germanFooterLegal);
        content = content.replace(new RegExp(turkishFooterLegal2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), germanFooterLegal);

        // Additional Turkish -> German cleanup for DE pages
        const trDePairs = [
            ['Kapsamlı koruma için 640 veri broker ve herkese açık veri tabanını sürekli izliyoruz', 'Für umfassenden Schutz überwachen wir kontinuierlich 640 Datenbroker und öffentliche Datenbanken'],
            ['Toplam Kapsama Alanı', 'Gesamtabdeckung'],
            ['Toplam Veri Broker', 'Gesamtzahl der Datenbroker'],
            ['Veri Gizleme Oranı', 'Datenverschleierungsrate'],
            ['Sürekli İzleme', 'Kontinuierliche Überwachung'],
            ['Fiyat Hesaplayıcısı', 'Preisrechner'],
            ['Bilgilerinizi Girin', 'Geben Sie Ihre Daten ein'],
            ['Korunacak Çalışan Sayısı', 'Anzahl der zu schützenden Mitarbeiter'],
            ["C-level, VP'ler, satış personeli", 'C‑Level, VPs, Vertriebsmitarbeiter'],
            ['Ticari Veri Koruması', 'Handelsdatenschutz'],
            ['Hayır', 'Nein'],
            ['Sadece kişisel veri koruması', 'Nur persönlicher Datenschutz'],
            ['Evet', 'Ja'],
            ['Gümrük + kişisel veri koruması', 'Zolldaten + persönlicher Datenschutz'],
            ['Aylık Ortalama İhracat/İthalat Sevkiyat Sayısı:', 'Monatliche durchschnittliche Anzahl von Export/Import‑Sendungen:'],
            ['Örn: 50', 'Z. B.: 50'],
            ['B/L, AWB, konteyner sevkiyatları dahil', 'Inklusive B/L, AWB, Container‑Sendungen'],
            ['Maliyet & Özellikler', 'Kosten & Funktionen'],
            ['Tahmini Yıllık Maliyet', 'Geschätzte Jahreskosten'],
            ['/ yıl', '/ Jahr'],
            ['Maliyet Detayı', 'Kostenübersicht'],
            ['Kişisel veri koruması:', 'Persönlicher Datenschutz:'],
            ['Ticari veri koruması:', 'Handelsdatenschutz:'],
            ['Toplam:', 'Gesamt:'],
            ['Hemen Teklif Al', 'Jetzt Angebot erhalten'],
            ['Ücretsiz danışmanlık ile başlayın', 'Beginnen Sie mit einer kostenlosen Beratung'],
            ["📊 Aylık İzleme Dashboard'u", '📊 Monatliches Überwachungs‑Dashboard'],
            ['Gerçek zamanlı koruma durumunuzu takip edin', 'Verfolgen Sie Ihren Schutzstatus in Echtzeit'],
            ['Koruma Merkezi', 'Schutzzentrum'],
            ['Son güncelleme: Bugün, 14:32', 'Letzte Aktualisierung: Heute, 14:32'],
            ['CANLI', 'LIVE'],
            ['Bu Ay Silinen', 'Diesen Monat gelöscht'],
            ['Beklemede', 'Ausstehend'],
            ['5-15 gün', '5–15 Tage'],
            ['Yeni Tespit', 'Neu erkannt'],
            ['Son 7 gün', 'Letzte 7 Tage'],
            ['Başarı Oranı', 'Erfolgsquote'],
            ['KVKK Uyumlu', 'DSGVO‑konform'],
            ['Aylık İlerleme', 'Monatlicher Fortschritt'],
            ['Silme Talepleri', 'Löschanträge'],
            ['Veri Broker Taramaları', 'Datenbroker‑Scans'],
            ['GDPR Uyumlu İşlemler', 'DSGVO‑konforme Vorgänge'],
            ['Son Aktiviteler', 'Neueste Aktivitäten'],
            ["ZoomInfo'dan 23 kayıt silindi", '23 Einträge bei ZoomInfo gelöscht'],
            ['2 saat önce', 'vor 2 Stunden'],
            ['Apollo.io taraması tamamlandı', 'Apollo.io‑Scan abgeschlossen'],
            ['4 saat önce', 'vor 4 Stunden'],
            ['12 yeni veri broker tespit edildi', '12 neue Datenbroker identifiziert'],
            ['6 saat önce', 'vor 6 Stunden'],
            ['Lusha silme talebi onaylandı', 'Löschantrag bei Lusha genehmigt'],
            ['8 saat önce', 'vor 8 Stunden'],
            ['Haftalık rapor hazırlandı', 'Wöchentlicher Bericht erstellt'],
            ['1 gün önce', 'vor 1 Tag'],
            ['Akıllı İpucu', 'Tipp'],
            ['Bu dashboard\'a', 'Für dieses Dashboard'],
            ['Süreç Nasıl İşliyor?', 'Wie läuft der Prozess ab?'],
            ['Veri koruma sürecimizin her adımını şeffaf şekilde izleyin', 'Verfolgen Sie jeden Schritt unseres Datenschutzprozesses transparent'],
            ['Veri Toplama', 'Datensammlung'],
            ['1-2 Gün', '1–2 Tage'],
            ['Kapsamlı Tarama', 'Umfassende Überprüfung'],
            ['3-5 Gün', '3–5 Tage'],
            ['Yasal Süreç', 'Rechtlicher Prozess'],
            ['KVKK/GDPR uyumlu silme talepleri otomatik olarak gönderiliyor', 'DSGVO/GDPR‑konforme Löschanträge werden automatisch übermittelt'],
            ['7-21 Gün', '7–21 Tage'],
            ['Sürekli Koruma', 'Kontinuierlicher Schutz'],
            ['Aylık izleme ve yeni tehditlere karşı koruma', 'Monatliche Überwachung und Schutz vor neuen Bedrohungen'],
            ['Süreç Zaman Çizelgesi', 'Prozess‑Zeitplan'],
            ['Başlangıç', 'Start'],
            ['Veri toplama ve ilk tarama başlangıcı', 'Datensammlung und Beginn der ersten Überprüfung'],
            ["Veri broker'larından ilk silme işlemleri", 'Erste Löschvorgänge von Datenbrokern'],
            ['0-3 Gün', '0–3 Tage'],
            ['30+ Gün', '30+ Tage']
        ];
        for (const [tr, de] of trDePairs) {
            const re = new RegExp(tr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            content = content.replace(re, de);
            pageNavigation = pageNavigation.replace(re, de);
            pageFooter = pageFooter.replace(re, de);
        }
    } else {
        // For English pages, ensure correct service page linking
        // Fix Lead Generation Service to point to solutions section, not standalone page
        pageNavigation = pageNavigation.replace(/href="\.\/b2b-lead-generation-agency\.html" class="block text-xs p-2 rounded-lg hover:bg-primary\/10 hover:text-primary transition-colors">Lead Generation Service</g, 'href="./solutions.html#lead-generation" class="block text-xs p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">Lead Generation Service</');
        pageNavigation = pageNavigation.replace(/href="\.\/b2b-lead-generation-agency\.html" class="text-xs">Lead Generation Service</g, 'href="./solutions.html#lead-generation" class="text-xs">Lead Generation Service</');
        
        // Remove data-i18n attributes from English pages
        content = content.replace(/\s*data-i18n="[^"]*"/g, '');
        pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
        pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');
    }
    
    // Global replacements for all languages - update old AI Solutions anchors to Sales Protection
    content = content.replace(/#ai-solutions/g, '#sales-protection');
    pageNavigation = pageNavigation.replace(/#ai-solutions/g, '#sales-protection');
    pageFooter = pageFooter.replace(/#ai-solutions/g, '#sales-protection');
    
    // Insert navigation, content, and footer into HTML template
    htmlTemplate = htmlTemplate.replace('{{NAVIGATION}}', pageNavigation);
    htmlTemplate = htmlTemplate.replace('{{MAIN_CONTENT}}', content);
    htmlTemplate = htmlTemplate.replace('{{FOOTER}}', pageFooter);

    // Validate template variables after replacement
    validateTemplateVariables(htmlTemplate, `HTML template for ${outputName} (${lang})`);
    
    // Set page-specific metadata with SEO enhancements
    const pageMetadata = getPageMetadata(templateName, lang);
    const hreflangUrls = getHreflangUrls(templateName);
    const baseUrl = lang === 'en' ? 'https://www.expandia.ch' : `https://www.expandia.ch/${lang}`;
    
    // Generate canonical URL
    const canonicalUrl = lang === 'en' ? 
        `https://www.expandia.ch/${outputName === 'index' ? '' : outputName + '.html'}` :
        `https://www.expandia.ch/${lang}/${outputName === 'index' ? '' : outputName + '.html'}`;
    
    // Generate schema markup
    let schemaMarkup;
    if (templateName === 'index') {
        schemaMarkup = JSON.stringify(generateOrganizationSchema(), null, 2);
    } else if (templateName === 'solutions') {
        const serviceName = lang === 'tr' ? 'B2B Satış Çözümleri' : lang === 'de' ? 'B2B Verkaufslösungen' : 'B2B Sales Solutions';
        const serviceDesc = pageMetadata.description;
        schemaMarkup = JSON.stringify(generateServiceSchema(serviceName, serviceDesc, lang), null, 2);
    } else {
        // For other pages, use basic organization schema
        schemaMarkup = JSON.stringify(generateOrganizationSchema(), null, 2);
    }
    
    // Replace all template variables
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageMetadata.title);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageMetadata.description);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_KEYWORDS\}\}/g, pageMetadata.keywords);
    htmlTemplate = htmlTemplate.replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_EN\}\}/g, hreflangUrls.en);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_TR\}\}/g, hreflangUrls.tr);
    htmlTemplate = htmlTemplate.replace(/\{\{PAGE_URL_DE\}\}/g, hreflangUrls.de);
    htmlTemplate = htmlTemplate.replace(/\{\{SCHEMA_MARKUP\}\}/g, schemaMarkup);
    
    // Write to appropriate location
    let outputPath;
    if (lang === 'tr') {
        outputPath = `tr/${outputName}.html`;
    } else if (lang === 'de') {
        outputPath = `de/${outputName}.html`;
    } else {
        outputPath = `${outputName}.html`;
    }
    
    // Safety check: warn if template is missing
    const templateFilePath = `templates/${lang === 'en' ? '' : lang + '/'}${templateName}.html`;
    if (!fs.existsSync(templateFilePath)) {
        console.log(`⚠️  WARNING: Template ${templateFilePath} not found, using fallback`);
    }
    
    // Write with backup check
    if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        const now = new Date();
        const fileAge = (now - stats.mtime) / (1000 * 60); // Age in minutes
        
        if (fileAge < 5) {
            console.log(`🔄 Overwriting recently modified file: ${outputPath} (${Math.round(fileAge)}min ago)`);
        }
    }
    
    // Generation comment removed per user request
    
    fs.writeFileSync(outputPath, htmlTemplate, 'utf8');
    console.log(`✅ Built ${outputPath} with enhanced SEO`);
}

// Build English pages
console.log('Building English pages...');
buildPage('index', 'index', 'en');
buildPage('about', 'about', 'en');
buildPage('solutions', 'solutions', 'en');
buildPage('contact', 'contact', 'en');
buildPage('case-studies', 'case-studies', 'en');
buildPage('onboarding', 'onboarding', 'en');
buildPage('vision-mission', 'vision-mission', 'en');
buildPage('our-ethical-principles', 'our-ethical-principles', 'en');
buildPage('market-foundation-program', 'market-foundation-program', 'en');
buildPage('market-accelerator-program', 'market-accelerator-program', 'en');
buildPage('part-time-lead-generation-team', 'part-time-lead-generation-team', 'en');

// Build English service pages
console.log('Building English service pages...');
buildPage('b2b-lead-generation-agency', 'b2b-lead-generation-agency', 'en');
buildPage('sales-development-agency', 'sales-development-agency', 'en');
buildPage('outbound-marketing-agency', 'outbound-marketing-agency', 'en');
buildPage('lead-generation-service', 'lead-generation-service', 'en');
buildPage('prospect-finding-service', 'prospect-finding-service', 'en');
buildPage('appointment-setting-service', 'appointment-setting-service', 'en');
buildPage('cold-email-agency', 'cold-email-agency', 'en');
buildPage('sales-protection-services', 'sales-protection-services', 'en');
buildPage('outsourced-sales-team-service', 'outsourced-sales-team-service', 'en');
buildPage('email-automation', 'email-automation', 'en');
buildPage('email-marketing-management', 'email-marketing-management', 'en');
buildPage('export-marketing-consulting', 'export-marketing-consulting', 'en');
buildPage('international-market-entry', 'international-market-entry', 'en');
buildPage('distributor-finding', 'distributor-finding', 'en');
buildPage('overseas-sales-consulting', 'overseas-sales-consulting', 'en');
buildPage('europe-market-entry', 'europe-market-entry', 'en');
buildPage('corporate-digital-gifting', 'corporate-digital-gifting', 'en');
buildPage('usa-pr-service', 'usa-pr-service', 'en');

// Build Turkish pages
console.log('Building Turkish pages...');
buildPage('index', 'index', 'tr');
buildPage('about', 'about', 'tr');
buildPage('solutions', 'solutions', 'tr');
buildPage('contact', 'contact', 'tr');
buildPage('case-studies', 'case-studies', 'tr');
buildPage('satis-koruma-hizmetleri', 'satis-koruma-hizmetleri', 'tr');
buildPage('vizyon-misyon', 'vizyon-misyon', 'tr');
buildPage('etik-ilkelerimiz', 'etik-ilkelerimiz', 'tr');
buildPage('pazar-temeli-programi', 'pazar-temeli-programi', 'tr');
buildPage('pazar-hizlandirici-program', 'pazar-hizlandirici-program', 'tr');
buildPage('kismi-is-gelistirme-ekibi', 'kismi-is-gelistirme-ekibi', 'tr');
buildPage('kurumsal-dijital-hediye-promosyon', 'kurumsal-dijital-hediye-promosyon', 'tr');
buildPage('abd-pr-hizmeti', 'abd-pr-hizmeti', 'tr');

// Build German pages
console.log('Building German pages...');
buildPage('index', 'index', 'de');
buildPage('about', 'about', 'de');
buildPage('solutions', 'solutions', 'de');
buildPage('contact', 'contact', 'de');
buildPage('case-studies', 'case-studies', 'de');
buildPage('schutzdienstleistungen', 'schutzdienstleistungen', 'de');
buildPage('vision-mission', 'vision-mission', 'de');
buildPage('our-ethical-principles', 'our-ethical-principles', 'de');
buildPage('markt-grundlagen-programm', 'markt-grundlagen-programm', 'de');
buildPage('markt-beschleuniger-programm', 'markt-beschleuniger-programm', 'de');
buildPage('teilzeit-bizdev-team', 'teilzeit-bizdev-team', 'de');
buildPage('unternehmens-digitale-geschenke', 'unternehmens-digitale-geschenke', 'de');
buildPage('usa-pr-dienst', 'usa-pr-dienst', 'de');

// Blog Post Building Function
function buildBlogPost(templateName, outputName, lang = 'en') {
    console.log(`🏗️  Building blog post: ${outputName} (${lang.toUpperCase()})`);
    
    const basePath = lang === 'en' ? '../' : '../../';
    const logoPath = lang === 'en' ? '../Expandia-main-logo-koyu-yesil.png' : '../../Expandia-main-logo-koyu-yesil.png';
    
    // Read blog post template
    let blogTemplate;
    const templatePath = `templates/blog/${templateName}.html`;
    
    if (fs.existsSync(templatePath)) {
        blogTemplate = fs.readFileSync(templatePath, 'utf8');
    } else {
        console.log(`⚠️  Blog template ${templatePath} not found`);
        return;
    }
    
    // Process includes
    blogTemplate = blogTemplate.replace('{{HEADER_INCLUDE}}', navigationEN);
    blogTemplate = blogTemplate.replace('{{FOOTER_INCLUDE}}', footerEN);
    
    // Replace path placeholders
    blogTemplate = blogTemplate.replace(/\{\{BASE_PATH\}\}/g, basePath);
    blogTemplate = blogTemplate.replace(/\{\{LOGO_PATH\}\}/g, logoPath);
    
    // Set active states for navigation
    blogTemplate = blogTemplate.replace(/\{\{HOME_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{SOLUTIONS_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{ABOUT_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CONTACT_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{BLOG_ACTIVE\}\}/g, 'text-primary');
    
    // Clear mobile active states
    blogTemplate = blogTemplate.replace(/\{\{HOME_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{SOLUTIONS_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{ABOUT_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CONTACT_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{BLOG_MOBILE_ACTIVE\}\}/g, 'class="text-primary font-semibold"');
    
    // Clear other placeholder states
    blogTemplate = blogTemplate.replace(/\{\{SOLUTIONS_ITEM_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CASESTUDIES_ITEM_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{ABOUT_ITEM_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CONTACT_ITEM_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{CASESTUDIES_MOBILE_ACTIVE\}\}/g, '');
    blogTemplate = blogTemplate.replace(/\{\{COMPANY_ACTIVE\}\}/g, '');
    
    // Determine output path
    let outputPath;
    if (lang === 'tr') {
        outputPath = `tr/blog/${outputName}.html`;
    } else if (lang === 'de') {
        outputPath = `de/blog/${outputName}.html`;
    } else {
        outputPath = `blog/${outputName}.html`;
    }
    
    // Ensure blog directory exists
    const blogDir = path.dirname(outputPath);
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }
    
    // Generation comment removed per user request
    
    fs.writeFileSync(outputPath, blogTemplate, 'utf8');
    console.log(`✅ Built blog post: ${outputPath}`);
}

// Build Blog Posts
console.log('\nBuilding Blog Posts...');
buildBlogPost('digital-marketing-complete-guide-2025-full', 'digital-marketing-complete-guide-2025', 'en');
buildBlogPost('online-marketing-strategy-guide', 'online-marketing-complete-strategy-guide', 'en');
buildBlogPost('lead-generation-complete-guide-2025', 'lead-generation-complete-guide-2025', 'en');
buildBlogPost('digital-marketing-services-guide', 'digital-marketing-services-complete-breakdown', 'en');
buildBlogPost('digital-marketing-agency-selection-guide', 'how-to-choose-digital-marketing-agency', 'en');
buildBlogPost('online-advertising-complete-guide', 'online-advertising-complete-guide', 'en');
buildBlogPost('marketing-strategy-complete-guide', 'marketing-strategy-complete-guide', 'en');
buildBlogPost('digital-marketing-company-guide', 'digital-marketing-company-guide', 'en');
buildBlogPost('seo-agency-selection-guide', 'seo-agency-selection-guide', 'en');
buildBlogPost('internet-marketing-complete-guide', 'internet-marketing-complete-guide', 'en');
buildBlogPost('content-marketing-strategy-guide', 'content-marketing-strategy-guide', 'en');
buildBlogPost('digital-advertising-alliance-guide', 'digital-advertising-alliance-guide', 'en');
buildBlogPost('certified-digital-marketer-guide', 'certified-digital-marketer-guide', 'en');
buildBlogPost('squared-online-marketing-guide', 'squared-online-marketing-guide', 'en');
buildBlogPost('digital-marketing-firms-selection-guide', 'digital-marketing-firms-selection-guide', 'en');
buildBlogPost('social-marketing-agencies-guide', 'social-marketing-agencies-guide', 'en');
buildBlogPost('search-engine-optimization-agencies-guide', 'search-engine-optimization-agencies-guide', 'en');
buildBlogPost('pipeline-generation-complete-guide', 'pipeline-generation-complete-guide', 'en');
buildBlogPost('digital-agency-marketing-guide', 'digital-agency-marketing-guide', 'en');
buildBlogPost('online-marketing-advertising-complete-guide', 'online-marketing-advertising-complete-guide', 'en');
buildBlogPost('search-engine-optimisation-companies-guide', 'search-engine-optimisation-companies-guide', 'en');
buildBlogPost('online-internet-marketing-guide', 'online-internet-marketing-guide', 'en');
buildBlogPost('digital-marketing-advertising-agency-guide', 'digital-marketing-advertising-agency-guide', 'en');
buildBlogPost('marketing-agency-near-me-guide', 'marketing-agency-near-me-guide', 'en');
buildBlogPost('digital-marketing-near-me-guide', 'digital-marketing-near-me-guide', 'en');
buildBlogPost('digital-marketing-agency-near-me-guide', 'digital-marketing-agency-near-me-guide', 'en');
buildBlogPost('internet-marketing-service-near-me-guide', 'internet-marketing-service-near-me-guide', 'en');
buildBlogPost('lead-gen-complete-strategy-guide', 'lead-gen-complete-strategy-guide', 'en');
buildBlogPost('internet-advertising-complete-guide', 'internet-advertising-complete-guide', 'en');
buildBlogPost('content-marketers-strategy-guide', 'content-marketers-strategy-guide', 'en');
buildBlogPost('marketing-automation-complete-guide', 'marketing-automation-complete-guide', 'en');
buildBlogPost('b2b-marketing-strategy-guide', 'b2b-marketing-strategy-guide', 'en');
buildBlogPost('conversion-rate-optimization-guide', 'conversion-rate-optimization-guide', 'en');
buildBlogPost('email-marketing-mastery-guide', 'email-marketing-mastery-guide', 'en');
buildBlogPost('social-media-marketing-guide', 'social-media-marketing-guide', 'en');
buildBlogPost('ai-marketing-strategy-guide', 'ai-marketing-strategy-guide', 'en');
buildBlogPost('marketing-analytics-guide', 'marketing-analytics-guide', 'en');
buildBlogPost('voice-search-marketing-guide', 'voice-search-marketing-guide', 'en');
buildBlogPost('mobile-marketing-strategy-guide', 'mobile-marketing-strategy-guide', 'en');
buildBlogPost('video-marketing-strategy-guide', 'video-marketing-strategy-guide', 'en');
buildBlogPost('influencer-marketing-guide', 'influencer-marketing-guide', 'en');
buildBlogPost('content-marketing-excellence-guide', 'content-marketing-excellence-guide', 'en');
buildBlogPost('international-marketing-guide', 'international-marketing-guide', 'en');
buildBlogPost('marketing-psychology-guide', 'marketing-psychology-guide', 'en');
buildBlogPost('marketing-automation-workflows-guide', 'marketing-automation-workflows-guide', 'en');
buildBlogPost('marketing-innovation-strategy-guide', 'marketing-innovation-strategy-guide', 'en');
buildBlogPost('advanced-digital-transformation-guide', 'advanced-digital-transformation-guide', 'en');
buildBlogPost('marketing-leadership-excellence-guide', 'marketing-leadership-excellence-guide', 'en');
buildBlogPost('advanced-customer-experience-guide', 'advanced-customer-experience-guide', 'en');
buildBlogPost('future-marketing-trends-2025-guide', 'future-marketing-trends-2025-guide', 'en');

console.log('\n🎉 BUILD COMPLETE with enhanced SEO!');
console.log('📁 Generated files have been updated from templates/');
console.log('⚠️  REMEMBER: Always edit templates/, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for development guidelines');
console.log('🚀 Ready for deployment!\n');