const fs = require('fs');
const path = require('path');

// 🚨 BUILD SYSTEM WARNING
console.log('\n🔧 EXPANDIA BUILD SYSTEM STARTING...');
console.log('⚠️  WARNING: This will OVERWRITE generated HTML files!');
console.log('📝 Always edit templates/ directory, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for full instructions\n');

// Read navigation and footer once
const navigation = fs.readFileSync('includes/header.html', 'utf8');
const footer = fs.readFileSync('includes/footer.html', 'utf8');

// SEO Keywords by page type
const seoKeywords = {
    index: 'B2B lead generation Europe, sales as a service, export market entry, appointment setting for exporters',
    solutions: 'B2B sales solutions, lead generation services Europe, sales automation, export sales consulting',
    about: 'B2B sales agency Europe, export market specialists, international sales consulting',
    contact: 'B2B lead generation consultation, export sales consultation, international market entry',
    'case-studies': 'B2B sales success stories, export market case studies, international expansion results'
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
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "CH"
        },
        "sameAs": [
            "https://www.linkedin.com/company/expandia-ch/"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+41-XXX-XXX-XXXX",
            "contactType": "sales",
            "areaServed": ["CH", "DE", "AT", "TR", "EU"],
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
</body>
</html>`;
}

// Translation content for Turkish
const turkishTranslations = {
    // Navigation Menu Items
    'Home': 'Ana Sayfa',
    'Sales University': 'Satış Üniversitesi',
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
    'Sales Protection Services': 'Satış Koruma Hizmetleri',
    'AI Sales Solutions': 'AI Satış Çözümleri',
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
    'Sales Protection': 'Satış Koruması',
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
    "Sales Protection": "Satış Koruma",
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
    'Sales Protection Services': 'Vertriebsschutz-Services',
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
    '250,000,000+ Verified Contacts': '250.000.000+ verifizierte Kontakte',
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
    'Sales Protection': 'Vertriebsschutz',
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
                : 'B2B Lead Generation Europe | Sales Growth Experts',
            description: isturkish 
                ? 'Türkiye\'nin önde gelen B2B lead üretimi uzmanları. İhracat pazarları için randevu ayarlama ve satış otomasyonu ile büyümenizi hızlandırın.'
                : isgerman
                ? 'Deutschlands führende B2B Lead-Generierung Spezialisten. Wir helfen Exporteuren beim Markteintritt mit Terminvereinbarung und Verkaufsautomation.'
                : 'Expert B2B lead generation in Europe. We help exporters enter new markets with proven appointment setting and sales automation solutions.',
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
                : 'Export Sales Solutions | B2B Growth Services Europe',
            description: isturkish 
                ? 'Avrupa pazarları için B2B satış çözümleri. İhracat danışmanlığı, lead üretimi ve satış otomasyonu hizmetleri.'
                : isgerman
                ? 'B2B Verkaufslösungen für europäische Märkte. Export-Beratung, Lead-Generierung und Verkaufsautomation.'
                : 'Complete export sales solutions for European markets. B2B consulting, lead generation services, and sales automation for international growth.',
            keywords: isturkish 
                ? 'B2B satış çözümleri, ihracat danışmanlığı, satış otomasyonu, Avrupa pazarları'
                : isgerman
                ? 'B2B Verkaufslösungen, Export Beratung, Verkaufsautomation, europäische Märkte'
                : 'export sales solutions, B2B consulting Europe, international sales services, European market expansion'
        },
        'about': {
            title: isturkish 
                ? 'Hakkımızda | B2B Satış Ajansı | Expandia' 
                : isgerman 
                ? 'Über uns | B2B Verkaufsagentur | Expandia' 
                : 'About Us | B2B Sales Agency Europe | Expandia',
            description: isturkish 
                ? 'Avrupa\'da faaliyet gösteren B2B satış ajansı. İhracat pazarı uzmanları ve uluslararası satış danışmanları.'
                : isgerman
                ? 'B2B Verkaufsagentur in Europa. Export-Marktspezialisten und internationale Verkaufsberater.'
                : 'B2B sales agency Europe. Export market specialists & international sales consultants helping companies expand globally.',
            keywords: isturkish 
                ? 'B2B satış ajansı Avrupa, ihracat pazarı uzmanları, uluslararası satış danışmanlığı'
                : isgerman
                ? 'B2B Verkaufsagentur Europa, Export Marktspezialisten, internationale Verkaufsberatung'
                : 'B2B sales agency Europe, export market specialists, international sales consulting'
        },
        'contact': {
            title: isturkish 
                ? 'İletişim | B2B Potansiyel Müşteri Yaratma Danışmanlığı | Expandia' 
                : isgerman 
                ? 'Kontakt | B2B Lead-Generierung Beratung | Expandia' 
                : 'Contact | B2B Lead Generation Consultation | Expandia',
            description: isturkish 
                ? 'B2B lead üretimi ve ihracat satış danışmanlığı için ücretsiz konsültasyon. Uluslararası pazar girişi uzmanları.'
                : isgerman
                ? 'Kostenlose Beratung für B2B Lead-Generierung und Export-Verkauf. Internationale Markteintritt-Spezialisten.'
                : 'Free consultation for B2B lead generation & export sales. International market entry specialists ready to help.',
            keywords: isturkish 
                ? 'B2B lead üretimi danışmanlığı, ihracat satış konsültasyonu, uluslararası pazar girişi'
                : isgerman
                ? 'B2B Lead-Generierung Beratung, Export Verkaufs Konsultation, internationaler Markteintritt'
                : 'B2B lead generation consultation, export sales consultation, international market entry'
        },
        'case-studies': {
            title: isturkish 
                ? 'Başarı Hikayeleri | B2B Satış Sonuçları | Expandia' 
                : isgerman 
                ? 'Erfolgsgeschichten | B2B Verkaufsergebnisse | Expandia' 
                : 'Success Stories | B2B Sales Results | Expandia',
            description: isturkish 
                ? 'B2B satış başarı hikayeleri ve ihracat pazarı örnek çalışmaları. Uluslararası genişleme sonuçları.'
                : isgerman
                ? 'B2B Verkaufs-Erfolgsgeschichten und Export-Markt-Fallstudien. Internationale Expansionsergebnisse.'
                : 'B2B sales success stories & export market case studies. International expansion results from our clients.',
            keywords: isturkish 
                ? 'B2B satış başarı hikayeleri, ihracat pazarı örnek çalışmaları, uluslararası genişleme sonuçları'
                : isgerman
                ? 'B2B Verkaufs Erfolgsgeschichten, Export Markt Fallstudien, internationale Expansion Ergebnisse'
                : 'B2B sales success stories, export market case studies, international expansion results'
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
    let pageNavigation = navigation;
    let pageFooter = footer;
    
    // Remove data-i18n attributes and keep the content as is
    content = content.replace(/\s*data-i18n="[^"]*"/g, '');
    pageNavigation = pageNavigation.replace(/\s*data-i18n="[^"]*"/g, '');
    pageFooter = pageFooter.replace(/\s*data-i18n="[^"]*"/g, '');
    
    // Apply template variables based on language
    const basePath = './';
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
        // Lead Generation & Sales section
        pageNavigation = pageNavigation.replace(/href="\.\.\/b2b-lead-generation-agency\.html"/g, 'href="./b2b-lead-generation-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/lead-generation-service\.html"/g, 'href="./lead-generation-hizmeti.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/prospect-finding-service\.html"/g, 'href="./potansiyel-musteri-bulma-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/sales-development-agency\.html"/g, 'href="./satis-gelistirme-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/appointment-setting-service\.html"/g, 'href="./randevu-ayarlama-hizmeti.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/outsourced-sales-team-service\.html"/g, 'href="./dis-kaynakli-satis-ekibi.html"');
        
        // Marketing & Outreach section
        pageNavigation = pageNavigation.replace(/href="\.\.\/outbound-marketing-agency\.html"/g, 'href="./outbound-pazarlama-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/cold-email-agency\.html"/g, 'href="./soguk-e-posta-ajansi.html"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/email-automation\.html"/g, 'href="./solutions.html#email-automation"');
        pageNavigation = pageNavigation.replace(/href="\.\.\/sales-protection-services\.html"/g, 'href="./satis-koruma-hizmetleri.html"');
        
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
        pageNavigation = pageNavigation.replace(/href="\.\.\/sales-protection-services\.html"/g, 'href="./schutzdienstleistungen.html"');
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
    
    // Add generation warning comment at the top
    const warningComment = `<!-- 
🚨 AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY!
This file is automatically generated from templates/ directory.
Edit templates/${lang === 'en' ? '' : lang + '/'}${templateName}.html instead.
See README-DEVELOPMENT.md for instructions.
Generated: ${new Date().toISOString()}
-->
`;
    
    // Insert warning at the beginning
    htmlTemplate = warningComment + htmlTemplate;
    
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
buildPage('export-marketing-consulting', 'export-marketing-consulting', 'en');
buildPage('international-market-entry', 'international-market-entry', 'en');
buildPage('distributor-finding', 'distributor-finding', 'en');
buildPage('overseas-sales-consulting', 'overseas-sales-consulting', 'en');
buildPage('europe-market-entry', 'europe-market-entry', 'en');

// Build Turkish pages
console.log('Building Turkish pages...');
buildPage('index', 'index', 'tr');
buildPage('about', 'about', 'tr');
buildPage('solutions', 'solutions', 'tr');
buildPage('contact', 'contact', 'tr');
buildPage('case-studies', 'case-studies', 'tr');
buildPage('satis-koruma-hizmetleri', 'satis-koruma-hizmetleri', 'tr');

// Build German pages
console.log('Building German pages...');
buildPage('index', 'index', 'de');
buildPage('about', 'about', 'de');
buildPage('solutions', 'solutions', 'de');
buildPage('contact', 'contact', 'de');
buildPage('case-studies', 'case-studies', 'de');
buildPage('schutzdienstleistungen', 'schutzdienstleistungen', 'de');

console.log('\n🎉 BUILD COMPLETE with enhanced SEO!');
console.log('📁 Generated files have been updated from templates/');
console.log('⚠️  REMEMBER: Always edit templates/, not root HTML files');
console.log('📖 See README-DEVELOPMENT.md for development guidelines');
console.log('🚀 Ready for deployment!\n');