import re

def main():
    # 1. Read the English original
    with open('/Users/busraocak/expandia/lead-generation-services.html', 'r', encoding='utf-8') as f:
        en_content = f.read()

    # 2. Read the German index.html to extract its head (partially, but maybe it's better to just reuse English head and translate), header, and footer.
    with open('/Users/busraocak/expandia/de/index.html', 'r', encoding='utf-8') as f:
        de_index = f.read()

    # Extract head from English
    head_match = re.search(r'(<head>.*?</head>)', en_content, re.DOTALL)
    head_content = head_match.group(1) if head_match else ""

    # Translate meta tags in head
    head_content = head_content.replace(
        '<title>Lead Generation Services | B2B Sales, Outreach & CRM Management | Go Expandia</title>',
        '<title>Lead-Generierung Services | B2B-Vertrieb, Outreach & CRM-Management | Go Expandia</title>'
    )
    head_content = re.sub(
        r'<meta name="description"\s*content="[^"]*">',
        '<meta name="description"\n        content="Sichern Sie sich lukrative Vertragsabschlüsse in den USA, Großbritannien und der EU. Wir bauen schnelle Growth-Infrastruktur, Managed-Sales-Systeme und IT-Lösungen. Beginnen Sie in 48 Stunden mit dem Abschluss größerer Deals.">',
        head_content, flags=re.DOTALL
    )
    head_content = re.sub(
        r'<meta name="keywords"\s*content="[^"]*">',
        '<meta name="keywords"\n        content="Growth-Infrastruktur, Managed Sales, IT-Beratung, B2B-Lead-Generierung, Cold Emailing, RevOps, High Ticket Sales, US-Marktexpansion, EU-Geschäftsentwicklung, Vertriebsautomatisierung, 48-Stunden-Lieferung, schnelle Skalierung, Enterprise-Sales-Systeme, Go Expandia">',
        head_content, flags=re.DOTALL
    )
    head_content = head_content.replace(
        '<link rel="canonical" href="https://www.goexpandia.com/lead-generation-services.html">',
        '<link rel="canonical" href="https://www.goexpandia.com/de/lead-generation-services.html">'
    )
    head_content = head_content.replace(
        '<meta property="og:title"\n        content="Growth Infrastructure | Lead Generation, Cold Emailing, IT Consulting | Go Expandia">',
        '<meta property="og:title"\n        content="Growth-Infrastruktur | Lead-Generierung, Cold Emailing, IT-Beratung | Go Expandia">'
    )
    head_content = re.sub(
        r'<meta property="og:description"\s*content="[^"]*">',
        '<meta property="og:description"\n        content="Sichern Sie sich lukrative Vertragsabschlüsse in den USA, Großbritannien und der EU. Wir bauen schnelle Growth-Infrastruktur, Managed-Sales-Systeme und IT-Lösungen. Beginnen Sie in 48 Stunden mit dem Abschluss größerer Deals.">',
        head_content, flags=re.DOTALL
    )
    head_content = head_content.replace(
        '<meta property="og:url" content="https://www.goexpandia.com/lead-generation-services.html">',
        '<meta property="og:url" content="https://www.goexpandia.com/de/lead-generation-services.html">'
    )
    head_content = head_content.replace(
        '<meta name="twitter:title"\n        content="Growth Infrastructure | Lead Generation, Cold Emailing, IT Consulting | Go Expandia">',
        '<meta name="twitter:title"\n        content="Growth-Infrastruktur | Lead-Generierung, Cold Emailing, IT-Beratung | Go Expandia">'
    )
    head_content = re.sub(
        r'<meta name="twitter:description"\s*content="[^"]*">',
        '<meta name="twitter:description"\n        content="Sichern Sie sich lukrative Vertragsabschlüsse in den USA, Großbritannien und der EU. Wir bauen schnelle Growth-Infrastruktur, Managed-Sales-Systeme und IT-Lösungen. Beginnen Sie in 48 Stunden mit dem Abschluss größerer Deals.">',
        head_content, flags=re.DOTALL
    )

    # 3. Extract the German Header (from <nav ...> to the end of the <script> block for menus)
    nav_match = re.search(r'(<nav class="navbar.*?</nav>\s*<script>.*?</script>)', de_index, re.DOTALL)
    de_nav = nav_match.group(1) if nav_match else ""

    # Fix language switcher in de_nav for THIS page
    de_nav = re.sub(
        r'<ul tabindex="0"\s*class="dropdown-content.*?</ul>',
        '''<ul tabindex="0"
                        class="dropdown-content z-[999] menu p-2 shadow-lg bg-white rounded-xl border border-gray-100 w-36 mt-2">
                        <li><a href="../lead-generation-services.html" data-lang="en" class="lang-switch text-sm">🇺🇸 English</a>
                        </li>
                        <li><a href="./lead-generation-services.html" data-lang="de" class="lang-switch text-sm active">🇩🇪 Deutsch</a></li>
                        <li><a href="../fr/lead-generation-services.html" data-lang="fr" class="lang-switch text-sm">🇫🇷 Français</a></li>
                    </ul>''',
        de_nav,
        flags=re.DOTALL
    )

    # 4. Extract main content from English page
    main_match = re.search(r'(<!-- Hero Section -->.*?)<!-- Footer -->', en_content, re.DOTALL)
    main_content = main_match.group(1) if main_match else ""

    # Apply translations to main_content
    translations = [
        ("Lead Generation Services\n", "Lead-Generierungs Services\n"),
        ("Lead Generation Services", "Lead-Generierung Services"),
        ("B2B Lead Generation", "B2B Lead-Generierung"),
        ("Services That Fill Your Pipeline", "Services, die Ihre Pipeline füllen"),
        ("From outbound prospecting to CRM optimization, our lead generation services help B2B companies build\n                    consistent pipelines and close more deals.", "Von der Outbound-Kundenakquise bis zur CRM-Optimierung helfen unsere Lead-Generierungs-Services B2B-Unternehmen dabei, konsistente Pipelines aufzubauen und mehr Deals abzuschließen."),
        ("Start Generating Leads", "Starten Sie die Lead-Generierung"),
        ("View Services", "Services ansehen"),
        ("Our Lead Generation Services", "Unsere Lead-Generierungs Services"),
        ("Choose the service that matches your sales goals, or combine multiple services for maximum impact.", "Wählen Sie den Service, der zu Ihren Vertriebszielen passt, oder kombinieren Sie mehrere Services für maximale Wirkung."),
        ("Full-service outbound prospecting, appointment setting, and pipeline building for B2B companies\n                        targeting corporate and enterprise accounts.", "Full-Service-Outbound-Akquise, Terminvereinbarung und Pipeline-Aufbau für B2B-Unternehmen, die auf Firmen- und Großkunden abzielen."),
        ("Multi-channel outreach (email, LinkedIn, phone)", "Multi-Channel-Outreach (E-Mail, LinkedIn, Telefon)"),
        ("Qualified appointment setting", "Qualifizierte Terminvereinbarung"),
        ("Account-based marketing campaigns", "Account-Based Marketing (ABM) Kampagnen"),
        ("Learn More", "Mehr erfahren"),
        ("Cold Calling Services", "Cold Calling Services"),
        ("Professional cold calling campaigns to reach decision-makers directly and book qualified\n                        meetings with your ideal prospects.", "Professionelle Kaltakquise-Kampagnen, um Entscheidungsträger direkt zu erreichen und qualifizierte Meetings mit Ihren idealen Interessenten zu buchen."),
        ("Direct phone outreach to decision makers", "Direkte telefonische Kontaktaufnahme zu Entscheidungsträgern"),
        ("Custom script development & objection handling", "Erstellung individueller Skripte & Einwandbehandlung"),
        ("CRM Management", "CRM-Management"),
        ("Professional CRM setup, data hygiene, automation, and ongoing optimization to keep your sales\n                        pipeline running smoothly.", "Professionelles CRM-Setup, Datenpflege, Automatisierung und fortlaufende Optimierung, damit Ihre Vertriebspipeline reibungslos läuft."),
        ("HubSpot, Salesforce, Pipedrive setup", "Einrichtung von HubSpot, Salesforce, Pipedrive"),
        ("Sales automation workflows", "Vertriebsautomatisierungs-Workflows"),
        ("Data cleanup and enrichment", "Datenbereinigung und -anreicherung"),
        ("How Our Lead Generation Works", "Wie unsere Lead-Generierung funktioniert"),
        ("A proven process that delivers consistent, qualified leads every month.", "Ein bewährter Prozess, der jeden Monat konsistente, qualifizierte Leads liefert."),
        ("Define ICP", "ICP definieren"),
        ("We identify your ideal customer profile and target accounts", "Wir identifizieren Ihr ideales Kundenprofil (ICP) und Ihre Zielaccounts"),
        ("Build Lists", "Listen erstellen"),
        ("Create verified contact lists of decision-makers", "Erstellen verifizierter Kontaktlisten von Entscheidungsträgern"),
        ("Launch Campaigns", "Kampagnen starten"),
        ("Execute multi-channel outreach with personalized messaging", "Durchführung von Multi-Channel-Outreach mit personalisierten Nachrichten"),
        ("Deliver Meetings", "Meetings liefern"),
        ("Hand over qualified appointments to your sales team", "Übergabe qualifizierter Termine an Ihr Vertriebsteam"),
        ("Ready to Fill Your Pipeline?", "Bereit, Ihre Pipeline zu füllen?"),
        ("Let's build a lead generation system that delivers consistent, qualified opportunities every month.", "Lassen Sie uns ein Lead-Generierungs-System aufbauen, das jeden Monat konsistente, qualifizierte Chancen liefert."),
        ("Get Your Free Strategy Session", "Kostenlose Strategie-Session vereinbaren"),
    ]
    for eng, ger in translations:
        main_content = main_content.replace(eng, ger)

    # 5. Extract German footer and end tags from de_index
    footer_match = re.search(r'(<!-- Footer -->.*)', de_index, re.DOTALL)
    de_footer = footer_match.group(1) if footer_match else ""

    # Assemble HTML
    final_html = f'''<!DOCTYPE html>
<html lang="de" data-theme="bumblebee">

{head_content}

<body class="font-sans">
    {de_nav}

    {main_content}

    {de_footer}
'''

    with open('/Users/busraocak/expandia/de/lead-generation-services.html', 'w', encoding='utf-8') as f:
        f.write(final_html)

    print("Generation complete")

if __name__ == '__main__':
    main()
