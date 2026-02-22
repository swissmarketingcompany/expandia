import re

def main():
    with open('/Users/busraocak/expandia/b2b-lead-generation-agency.html', 'r', encoding='utf-8') as f:
        en_content = f.read()

    with open('/Users/busraocak/expandia/de/index.html', 'r', encoding='utf-8') as f:
        de_index = f.read()

    # 1. Extract Head
    head_match = re.search(r'(<head>.*?</head>)', en_content, re.DOTALL)
    head_content = head_match.group(1) if head_match else ""

    # Translate head
    head_content = head_content.replace(
        '<title>B2B Growth Agency Europe & USA | Managed Sales | Go Expandia</title>',
        '<title>B2B Wachstumsagentur Europa & USA | Managed Sales | Go Expandia</title>'
    )
    head_content = head_content.replace(
        'content="B2B lead generation agency for Europe and the USA. Generate qualified leads, book sales appointments, and grow pipeline for exporters and high-ticket B2B services."',
        'content="B2B Lead-Generierungsagentur für Europa und die USA. Generieren Sie qualifizierte Leads, buchen Sie Vertriebstermine und bauen Sie eine Pipeline für Exporteure und hochpreisige B2B-Services auf."'
    )
    head_content = head_content.replace(
        '<link rel="canonical" href="https://www.goexpandia.com/b2b-lead-generation-agency.html">',
        '<link rel="canonical" href="https://www.goexpandia.com/de/b2b-lead-generation-agency.html">'
    )
    head_content = head_content.replace(
        '<meta property="og:title" content="B2B Growth Agency Europe & USA | Managed Sales | Go Expandia">',
        '<meta property="og:title" content="B2B Wachstumsagentur Europa & USA | Managed Sales | Go Expandia">'
    )
    head_content = head_content.replace(
        '<meta property="og:url" content="https://www.goexpandia.com/b2b-lead-generation-agency.html">',
        '<meta property="og:url" content="https://www.goexpandia.com/de/b2b-lead-generation-agency.html">'
    )
    head_content = head_content.replace(
        '<meta name="twitter:title" content="B2B Growth Agency Europe & USA | Managed Sales | Go Expandia">',
        '<meta name="twitter:title" content="B2B Wachstumsagentur Europa & USA | Managed Sales | Go Expandia">'
    )
    head_content = head_content.replace('./dist/css/output.css', '../dist/css/output.css')
    head_content = head_content.replace('./favicon.ico', '../favicon.ico')
    head_content = head_content.replace('./favicon.png', '../favicon.png')

    # FAQ Schema translation
    head_content = head_content.replace(
        '"name": "What is B2B lead generation and how does it work?"',
        '"name": "Was ist B2B-Lead-Generierung und wie funktioniert sie?"'
    ).replace(
        '"text": "B2B lead generation Europe is the process of identifying and attracting potential business customers for your products or services. Our systematic approach includes: Target market research and ideal customer profiling, Multi-channel outreach campaigns (email, LinkedIn, phone), Lead qualification and scoring processes, Appointment setting with qualified prospects, and CRM integration and lead nurturing workflows."',
        '"text": "B2B Lead-Generierung ist der Prozess der Identifizierung und Gewinnung potenzieller Geschäftskunden für Ihre Produkte oder Dienstleistungen. Unser systematischer Ansatz umfasst: Zielmarktforschung. Profilerstellung idealer Kunden. Multi-Channel Outreach Kampagnen (E-Mail, LinkedIn, Telefon). Lead-Qualifizierung und -Scoring. Terminvereinbarung mit qualifizierten Interessenten und CRM-Integration."'
    ).replace(
        '"name": "How quickly can we see results from B2B lead generation?"',
        '"name": "Wie schnell können wir erste Ergebnisse sehen?"'
    ).replace(
        '"text": "Most clients see initial qualified leads within 2-4 weeks of campaign launch. Week 1-2: Setup, research, campaign creation. Week 3-4: Campaign launch, initial outreach, first qualified leads. Month 2-3: Optimization, scaling, consistent lead flow."',
        '"text": "Die meisten Kunden sehen die ersten qualifizierten Leads innerhalb von 2-4 Wochen nach Kampagnenstart. Woche 1-2: Setup, Recherche, Kampagnenerstellung. Woche 3-4: Kampagnenstart, anfänglicher Outreach, erste qualifizierte Leads. Monat 2-3: Optimierung, Skalierung, konstanter Lead-Fluss."'
    ).replace(
        '"name": "What makes Go Expandia\'s approach to appointment setting different?"',
        '"name": "Was unterscheidet den Ansatz von Go Expandia von anderen Agenturen?"'
    ).replace(
        '"text": "Our appointment setting for exporters service combines deep market knowledge with advanced technology: 8+ years specializing in European B2B markets, Multilingual team with native speakers for German, Turkish, and English markets, Quality focus on booking meetings only with decision-makers, Full transparency with real-time reporting and campaign analytics, and Proven ROI with average 300% increase in qualified meetings."',
        '"text": "Unser Terminvereinbarungsservice für Exporteure kombiniert tiefes Marktwissen mit modernster Technologie: 8+ Jahre Erfahrung in europäischen B2B-Märkten, mehrsprachiges Team, Qualitätsfokus auf Entscheidertreffen, volle Transparenz und nachweislicher ROI."'
    ).replace(
        '"name": "Do you work with companies outside of Europe?"',
        '"name": "Arbeiten Sie auch mit Unternehmen außerhalb Europas zusammen?"'
    ).replace(
        '"text": "While we specialize in export market entry to European markets, we work with companies worldwide who want to expand into Europe. Our expertise includes helping businesses from the US, Asia, and other regions successfully enter German, Austrian, Swiss, and Turkish markets. We also support European companies expanding to other European countries."',
        '"text": "Ja. Obwohl wir uns auf den Markteintritt in europäische Märkte spezialisiert haben, arbeiten wir mit Unternehmen weltweit zusammen, die nach Europa expandieren möchten."'
    ).replace(
        '"name": "What industries do you serve for B2B lead generation?"',
        '"name": "Welche Branchen bedienen Sie bei der B2B-Lead-Generierung?"'
    ).replace(
        '"text": "Our B2B lead generation Europe expertise spans multiple industries: Software & Technology (SaaS, IT Services), Manufacturing & Industrial Equipment, Healthcare & Medical Devices, Corporate Services & Corporate Enterprises, Professional Services (Consulting, Legal), Logistics & Supply Chain, Clean Energy & Sustainability, and Education & Training."',
        '"text": "Unsere Expertise umfasst mehrere Branchen: Software & Technologie, Maschinen- und Anlagenbau, Gesundheitswesen, Corporate Services, Professional Services, Logistik, erneuerbare Energien und Bildungswesen."'
    ).replace(
        '"name": "How do you ensure GDPR compliance in European markets?"',
        '"name": "Wie gewährleisten Sie die DSGVO-Konformität in den europäischen Märkten?"'
    ).replace(
        '"text": "GDPR compliance is fundamental to our B2B lead generation Europe operations. We maintain strict data protection protocols, only contact business professionals with legitimate business interests, provide clear opt-out mechanisms, and maintain detailed records of all communications. Our team is trained on the latest GDPR requirements and we regularly audit our processes to ensure full compliance across all European markets."',
        '"text": "Die Einhaltung der DSGVO ist grundlegend für unsere Operationen in Europa. Wir pflegen strenge Datenschutzprotokolle, kontaktieren nur Personen mit berechtigtem geschäftlichen Interesse und bieten klare Opt-Out-Mechanismen."'
    )

    # 2. Extract German Header (from <nav ...> to the end of the <script> block for menus)
    nav_match = re.search(r'(<nav class="navbar.*?</nav>\s*<script>.*?</script>)', de_index, re.DOTALL)
    de_nav = nav_match.group(1) if nav_match else ""

    # Fix language switcher in de_nav for THIS page
    de_nav = re.sub(
        r'<ul tabindex="0"\s*class="dropdown-content.*?</ul>',
        """<ul tabindex="0"
                        class="dropdown-content z-[999] menu p-2 shadow-lg bg-white rounded-xl border border-gray-100 w-36 mt-2">
                        <li><a href="../b2b-lead-generation-agency.html" data-lang="en" class="lang-switch text-sm">🇺🇸 English</a></li>
                        <li><a href="./b2b-lead-generation-agency.html" data-lang="de" class="lang-switch text-sm active">🇩🇪 Deutsch</a></li>
                        <li><a href="../fr/b2b-lead-generation-agency.html" data-lang="fr" class="lang-switch text-sm">🇫🇷 Français</a></li>
                    </ul>""",
        de_nav,
        flags=re.DOTALL
    )

    # 3. Extract main content from English page
    main_match = re.search(r'(<!-- Hero Section -->.*?)<!-- Footer -->', en_content, re.DOTALL)
    main_content = main_match.group(1) if main_match else ""

    # Translation dictionary
    translations = [
        ("B2B Lead Generation", "B2B Lead-Generierung"),
        ("As a leading B2B Lead Generation agency, we", "Als führende Agentur für B2B-Lead-Generierung"),
        ("generate qualified leads", "generieren wir qualifizierte Leads"),
        ("and continuously feed your sales pipeline to accelerate your business growth.", "und füllen Ihre Vertriebspipeline kontinuierlich, um das Wachstum Ihres Unternehmens zu beschleunigen."),
        ("Get Free Analysis", "Kostenlose Analyse sichern"),
        ("Explore Our Services", "Unsere Dienstleistungen entdecken"),
        ("Reliable", "Zuverlässig"),
        ("Verified Sources", "Geprüfte Quellen"),
        ("Email Delivery Rate", "E-Mail-Zustellrate"),
        ("Average Response Rate", "Durchschnittliche Antwortrate"),
        ("What is B2B Lead Generation?", "Was ist B2B-Lead-Generierung?"),
        ("B2B Lead Generation is the process of identifying, qualifying, and preparing potential\n                business customers who show interest in your products or services for your sales team.", "B2B Lead-Generierung ist der Prozess der Identifizierung, Qualifizierung und Vorbereitung von potenziellen Geschäftskunden, die Interesse an Ihren Produkten oder Dienstleistungen zeigen, für Ihr Vertriebsteam."),
        ("Traditional vs Modern Lead Generation", "Traditionelle vs. moderne Lead-Generierung"),
        ("Traditional Methods", "Traditionelle Methoden"),
        ("Cold calls, generic email lists, random business card\n                                collection at trade shows", "Kaltakquise, generische E-Mail-Listen, zufälliges Sammeln von Visitenkarten auf Messen"),
        ("Modern Go Expandia Approach", "Der moderne Go Expandia Ansatz"),
        ("AI-powered targeting, personalized outreach, multi-channel\n                                nurturing", "KI-gestütztes Targeting, personalisierte Ansprache, Multi-Channel-Nurturing"),
        ("Lead Generation ROI", "Lead-Generierung ROI"),
        ("Average Lead Cost", "Durchschnittliche Lead-Kosten"),
        ("Lead-to-Customer Rate", "Lead-zu-Kunde-Rate"),
        ("Average Deal Size", "Durchschnittliche Deal-Größe"),
        ("Expected ROI", "Erwarteter ROI"),
        ("B2B Lead Generation Services", "B2B Lead-Generierungs Services"),
        ("As Go Expandia, we provide comprehensive Lead Generation solutions to continuously feed your sales\n                pipeline.", "Als Go Expandia bieten wir umfassende Lead-Generierungslösungen, um Ihre Vertriebspipeline kontinuierlich zu füllen."),
        ("AI-Powered Lead Research", "KI-gestützte Lead-Recherche"),
        ("Using AI-powered research and verified sources, we identify prospects that match your ideal customer\n                    profile.", "Mithilfe KI-gestützter Recherche und verifizierter Quellen identifizieren wir Interessenten, die Ihrem idealen Kundenprofil entsprechen."),
        ("Firmographic and technographic analysis", "Firmografische und technografische Analyse"),
        ("Intent data timing optimization", "Optimierung des Timings auf Basis von Intent-Daten"),
        ("Social media signals tracking", "Tracking von Social-Media-Signalen"),
        ("Trigger event monitoring", "Überwachung von Trigger-Ereignissen"),
        ("Multi-Channel Outreach", "Multi-Channel-Outreach"),
        ("We coordinate email, LinkedIn, phone, and other channels to ensure\n                    maximum reach and engagement.", "Wir koordinieren E-Mail, LinkedIn, Telefon und andere Kanäle, um eine maximale Reichweite und Interaktion zu gewährleisten."),
        ("Personalized email sequences", "Personalisierte E-Mail-Sequenzen"),
        ("LinkedIn Sales Navigator campaigns", "LinkedIn Sales Navigator Kampagnen"),
        ("Cold calling and warm transfers", "Kaltakquise und Warm-Transfers"),
        ("Social media engagement", "Social-Media-Interaktion"),
        ("Lead Qualification", "Lead-Qualifizierung"),
        ("Using BANT and MEDDIC frameworks, we qualify your leads and\n                    prepare them for your sales team.", "Mithilfe der BANT- und MEDDIC-Frameworks qualifizieren wir Ihre Leads und bereiten sie für Ihr Vertriebsteam vor."),
        ("Budget verification", "Budget-Verifizierung"),
        ("Authority mapping", "Mapping der Entscheidungsbefugnisse"),
        ("Need assessment", "Bedarfsanalyse"),
        ("Timeline confirmation", "Ermittlung des Zeitplans"),
        ("CRM Integration", "CRM-Integration"),
        ("We integrate with CRM systems like HubSpot, Salesforce, Pipedrive\n                    to ensure seamless data transfer.", "Wir integrieren Systeme wie HubSpot, Salesforce und Pipedrive, um eine reibungslose Datenübertragung sicherzustellen."),
        ("Automatic data synchronization", "Automatische Datensynchronisation"),
        ("Lead scoring integration", "Integration des Lead-Scorings"),
        ("Sales pipeline management", "Verwaltung der Vertriebspipeline"),
        ("Reporting and analytics", "Reporting und Analysen"),
        ("Performance Analytics", "Performance-Analysen"),
        ("With detailed reporting and analytics, we continuously optimize\n                    your campaign performance.", "Durch detailliertes Reporting und Analytics optimieren wir kontinuierlich Ihre Kampagnen-Performance."),
        ("Real-time dashboard", "Echtzeit-Dashboard"),
        ("Conversion tracking", "Conversion-Tracking"),
        ("ROI measurement", "ROI-Messung"),
        ("A/B test results", "A/B-Testergebnisse"),
        ("Account-Based Marketing", "Account-Based Marketing"),
        ("We design and execute special ABM campaigns for high-value\n                    target accounts.", "Wir entwerfen und steuern spezielle ABM-Kampagnen für besonders wertvolle Ziel-Accounts."),
        ("Strategic account selection", "Strategische Account-Auswahl"),
        ("Stakeholder mapping", "Stakeholder-Mapping"),
        ("Personalized content creation", "Erstellung personalisierter Inhalte"),
        ("Multi-touch campaigns", "Multi-Touch-Kampagnen"),
        ("Ready to Start B2B Lead Generation?", "Bereit für professionelle B2B-Leadgenerierung?"),
        ("Get a free analysis of your current Lead Generation potential.\n            Let's create your custom strategy within 24 hours.", "Fordern Sie eine kostenlose Analyse Ihres aktuellen Lead-Generierungs-Potenzials an. Lassen Sie uns innerhalb von 24 Stunden Ihre individuelle Strategie erstellen."),
        ("Free Lead Analysis", "Kostenlose Lead-Analyse"),
        ("Companies optimize their Lead Generation processes with Expandia.", "Unternehmen optimieren ihre Lead-Generierungsprozesse mit Expandia."),
        ("Free 30-minute strategy consultation", "Kostenlose 30-minütige Strategieberatung"),
        ("Performance guarantee", "Leistungsgarantie"),
        ("Frequently Asked Questions", "Häufig gestellte Fragen (FAQ)"),
        ("Get answers to common questions about our <strong>B2B lead generation Europe</strong> services and\n                process.", "Hier finden Sie Antworten auf häufig gestellte Fragen zu unseren B2B-Leadgenerierungs-Services in Europa."),
        ("What is B2B lead generation and how does it\n                    work?", "Was ist B2B-Leadgenerierung und wie funktioniert sie?"),
        ("<strong>B2B lead generation Europe</strong> is the process of identifying and attracting potential\n                    business customers for your products or services. Our systematic approach includes:", "B2B-Leadgenerierung umfasst den Prozess der Identifizierung und Gewinnung potenzieller Geschäftskunden für Ihre Produkte oder Dienstleistungen. Unser Ansatz beinhaltet:"),
        ("Target market research and ideal customer profiling", "Zielmarktanalyse und Erstellung von Kundenprofilen"),
        ("Multi-channel outreach campaigns (email, LinkedIn, phone)", "Multi-Channel-Kampagnen (E-Mail, LinkedIn, Telefon)"),
        ("Lead qualification and scoring processes", "Lead-Qualifizierung und Scoring"),
        ("Appointment setting with qualified prospects", "Terminvereinbarungen mit qualifizierten Leads"),
        ("CRM integration and lead nurturing workflows", "CRM-Integration und Lead-Nurturing-Prozesse"),
        ("How quickly can we see results from B2B\n                    lead generation?", "Wie schnell können wir erste Ergebnisse sehen?"),
        ("Most clients see initial qualified leads within <strong>2-4 weeks</strong> of campaign launch. Our\n                    proven process follows this timeline:", "Die meisten Kunden erhalten innerhalb von 2-4 Wochen nach Kampagnenstart erste qualifizierte Leads. Unser Projektplan:"),
        ("Timeframe", "Zeitrahmen"),
        ("Key Activities", "Wichtigste Aktivitäten"),
        ("Expected Results", "Erwartete Ergebnisse"),
        ("Week 1-2", "Woche 1-2"),
        ("Setup, research, campaign creation", "Setup, Recherche, Erstellung von Kampagnen"),
        ("Foundation completed", "Grundlage abgeschlossen"),
        ("Week 3-4", "Woche 3-4"),
        ("Campaign launch, initial outreach", "Kampagnen-Launch, erste Ansprache"),
        ("First qualified leads", "Erste qualifizierte Leads"),
        ("Month 2-3", "Monat 2-3"),
        ("Optimization, scaling", "Optimierung, Skalierung"),
        ("Consistent lead flow", "Konstanter Lead-Fluss"),
        ("What makes Go Expandia's approach to\n                    appointment setting different?", "Was unterscheidet den Ansatz von Go Expandia von anderen?"),
        ("Our <strong>appointment setting for exporters</strong> service combines deep market knowledge with\n                    advanced technology:", "Unser Terminvereinbarungsservice für Exporteure kombiniert tiefgreifendes Marktwissen mit moderner Technologie:"),
        ("<strong>Market Expertise:</strong> 8+ years specializing in European B2B markets", "<strong>Marktexpertise:</strong> Über 8 Jahre Spezialisierung auf europäische B2B-Märkte"),
        ("<strong>Multilingual Team:</strong> Native speakers for German, Turkish, and English markets", "<strong>Mehrsprachiges Team:</strong> Muttersprachler für den deutschen, türkischen und englischen Markt"),
        ("<strong>Quality Focus:</strong> We only book meetings with decision-makers", "<strong>Qualitätsfokus:</strong> Wir buchen Meetings ausschließlich mit Entscheidungsträgern"),
        ("<strong>Full Transparency:</strong> Real-time reporting and campaign analytics", "<strong>Volle Transparenz:</strong> Echtzeit-Reporting und Kampagnenanalyse"),
        ("<strong>Proven ROI:</strong> Average 300% increase in qualified meetings", "<strong>Nachweislicher ROI:</strong> Durchschnittlich 300 % mehr qualifizierte Meetings"),
        ("Do you work with companies outside of\n                    Europe?", "Arbeiten Sie auch mit Unternehmen außerhalb Europas zusammen?"),
        ("While we specialize in <strong>export market entry</strong> to European markets, we work with\n                    companies worldwide who want to expand into Europe. Our expertise includes helping businesses from\n                    the US, Asia, and other regions successfully enter German, Austrian, Swiss, and Turkish markets. We\n                    also support European companies expanding to other European countries.", "Ja. Auch wenn wir uns auf Markteintritte in Europa konzentrieren, arbeiten wir mit Unternehmen weltweit zusammen, die nach Europa expandieren wollen. Wir helfen Unternehmen z. B. aus den USA und Asien beim Eintritt in den D-A-CH- und türkischen Markt."),
        ("What industries do you serve for B2B lead\n                    generation?", "In welchen Branchen sind Sie tätig?"),
        ("Our <strong>B2B lead generation Europe</strong> expertise spans multiple industries:", "Unsere Branchenerfahrung umfasst:"),
        ("Software & Technology (SaaS, IT Services)", "Software & Technologie (SaaS, IT-Dienstleistungen)"),
        ("Manufacturing & Industrial Equipment", "Maschinen- & Anlagenbau"),
        ("Healthcare & Medical Devices", "Gesundheitswesen & Medizintechnik"),
        ("Corporate Services & Corporate Enterprises", "Unternehmensberatung & Corporates"),
        ("Professional Services (Consulting, Legal)", "Professionelle Dienstleistungen (Consulting, Recht)"),
        ("Logistics & Supply Chain", "Logistik & Supply Chain"),
        ("Clean Energy & Sustainability", "Erneuerbare Energien & Nachhaltigkeit"),
        ("Education & Training", "Bildung & Weiterbildung"),
        ("How do you ensure GDPR compliance in\n                    European markets?", "Wie stellen Sie die DSGVO-Konformität sicher?"),
        ("GDPR compliance is fundamental to our <strong>B2B lead generation Europe</strong> operations. We\n                    maintain strict data protection protocols, only contact business professionals with legitimate\n                    business interests, provide clear opt-out mechanisms, and maintain detailed records of all\n                    communications. Our team is trained on the latest GDPR requirements and we regularly audit our\n                    processes to ensure full compliance across all European markets.", "Die DSGVO-Konformität ist grundlegend für unsere Geschäftspraktiken. Wir pflegen strenge Datenschutzprotokolle, sprechen ausschließlich Geschäftskontakte mit berechtigtem Interesse an, bieten Opt-out-Möglichkeiten und schulen unser Team regelmäßig zur europäischen Datenschutzgrundverordnung.")
    ]
    for eng, ger in translations:
        main_content = main_content.replace(eng, ger)

    # 4. Extract German footer and js tags
    footer_match = re.search(r'(<!-- Footer -->.*)', de_index, re.DOTALL)
    de_footer = footer_match.group(1) if footer_match else ""
    
    # 5. Assemble
    final_html = f'''<!DOCTYPE html>
<html lang="de" data-theme="bumblebee">
{head_content}
<body class="font-sans">
    {de_nav}
    {main_content}
    {de_footer}
'''
    
    with open('/Users/busraocak/expandia/de/b2b-lead-generation-agency.html', 'w', encoding='utf-8') as f:
        f.write(final_html)

if __name__ == '__main__':
    main()
