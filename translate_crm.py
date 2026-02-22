import re

def main():
    # 1. Read sources
    with open('/Users/busraocak/expandia/crm-management.html', 'r', encoding='utf-8') as f:
        en_content = f.read()
    
    with open('/Users/busraocak/expandia/de/index.html', 'r', encoding='utf-8') as f:
        de_index = f.read()

    # 2. Extract Head from English and translate
    head_match = re.search(r'(<head>.*?</head>)', en_content, re.DOTALL)
    head_content = head_match.group(1) if head_match else ""

    # Translate head meta tags
    head_content = head_content.replace(
        '<title>CRM Management & Optimization Services | HubSpot & Salesforce Experts | Go Expandia</title>',
        '<title>CRM Management & Optimierung Services | HubSpot & Salesforce Experten | Go Expandia</title>'
    )
    head_content = head_content.replace(
        'content="Professional CRM optimization, data cleaning, and workflow automation for HubSpot and Salesforce. Turn your messy CRM into a growth engine."',
        'content="Professionelle CRM-Optimierung, Datenbereinigung und Workflow-Automatisierung für HubSpot und Salesforce. Verwandeln Sie Ihr unübersichtliches CRM in einen Wachstumsmotor."'
    )
    head_content = head_content.replace(
        'content="crm management services, HubSpot optimization, Salesforce consulting, CRM data hygiene, sales workflow automation"',
        'content="CRM management services, HubSpot Optimierung, Salesforce Beratung, CRM-Datenhygiene, Vertriebs-Workflow-Automatisierung"'
    )
    head_content = head_content.replace(
        '<link rel="canonical" href="https://www.goexpandia.com/crm-management.html">',
        '<link rel="canonical" href="https://www.goexpandia.com/de/crm-management.html">'
    )
    
    # Update asset paths
    head_content = head_content.replace('./dist/', '../dist/')
    head_content = head_content.replace('./favicon', '../favicon')

    # FAQ Schema translation
    faq_translations = [
        ("How long does a CRM audit take?", "Wie lange dauert ein CRM-Audit?"),
        ("A typical comprehensive audit takes 3-5 business days. We analyze your data structure, automation workflows, user adoption, and integration health.", 
         "Ein typisches umfassendes Audit dauert 3-5 Werktage. Wir analysieren Ihre Datenstruktur, Automatisierungs-Workflows, Benutzerakzeptanz und Integrationsstatus."),
        ("Can you fix messy data without deleting important records?", "Können Sie unordentliche Daten bereinigen, ohne wichtige Datensätze zu löschen?"),
        ("Absolutely. We use advanced deduplication and merging strategies that preserve all historical activity and notes while cleaning up your database. We always backup before changes.",
         "Absolut. Wir verwenden fortschrittliche Deduplizierungs- und Zusammenführungsstrategien, die alle historischen Aktivitäten ve Notizen bewahren, während wir Ihre Datenbank bereinigen. Wir erstellen vor Änderungen immer ein Backup."),
        ("Do you build custom automations?", "Erstellen Sie benutzerdefinierte Automatisierungen?"),
        ("Yes, we build custom workflows for lead routing, deal stage alerts, renewal reminders, and cross-object updates tailored to your specific sales process.",
         "Ja, wir erstellen maßgeschneiderte Workflows für Lead-Routing, Deal-Stage-Alerts, Verlängerungserinnerungen ve objektübergreifende Aktualisierungen, die auf Ihren spezifischen Vertriebsprozess zugeschnitten sind."),
        ("Do you offer training for our team?", "Bieten Sie Schulungen für unser Team an?"),
        ("Yes, we provide recorded training sessions and documentation to ensure your sales team knows exactly how to use the optimized CRM efficiently.",
         "Ja, wir bieten aufgezeichnete Schulungssitzungen ve Dokumentationen an, um sicherzustellen, dass Ihr Vertriebsteam genau weiß, wie es das optimierte CRM effizient nutzt.")
    ]
    for en, de in faq_translations:
        head_content = head_content.replace(f'"{en}"', f'"{de}"')

    # 3. Extract German Navbar and Footer
    nav_match = re.search(r'(<nav class="navbar.*?</nav>\s*<script>.*?</script>)', de_index, re.DOTALL)
    de_nav = nav_match.group(1) if nav_match else ""

    # Fix language switcher in de_nav for THIS page
    de_nav = re.sub(
        r'<ul tabindex="0"\s*class="dropdown-content.*?</ul>',
        """<ul tabindex="0"
                        class="dropdown-content z-[999] menu p-2 shadow-lg bg-white rounded-xl border border-gray-100 w-36 mt-2">
                        <li><a href="../crm-management.html" data-lang="en" class="lang-switch text-sm">🇺🇸 English</a></li>
                        <li><a href="./crm-management.html" data-lang="de" class="lang-switch text-sm active">🇩🇪 Deutsch</a></li>
                        <li><a href="../fr/crm-management.html" data-lang="fr" class="lang-switch text-sm">🇫🇷 Français</a></li>
                    </ul>""",
        de_nav,
        flags=re.DOTALL
    )

    footer_match = re.search(r'(<!-- Footer -->.*)', de_index, re.DOTALL)
    de_footer = footer_match.group(1) if footer_match else ""

    # 4. Extract and Translate Main Content
    main_match = re.search(r'(<!-- Hero Section -->.*?)<!-- Footer -->', en_content, re.DOTALL)
    main_content = main_match.group(1) if main_match else ""

    content_translations = [
        ("Certified Experts", "Zertifizierte Experten"),
        ("Your CRM is a <br>", "Ihr CRM ist bir <br>"),
        ("Goldmine or a", "Goldgrube oder ein"),
        ("Graveyard.", "Friedhof."),
        ("A messy CRM costs you revenue every single day. We clean your data, automate your workflows, and build dashboards that actually make sense.",
         "Ein unordentliches CRM kostet Sie jeden Tag Umsatz. Wir bereinigen Ihre Daten, automatisieren Ihre Workflows und erstellen Dashboards, die wirklich Sinn ergeben."),
        ("Audit My CRM", "CRM-Audit anfordern"),
        ("See What We Fix", "Was wir optimieren"),
        ("CRM Cleanup", "CRM-Bereinigung"),
        ("Integrations", "Integrationen"),
        ("Automations", "Automatisierungen"),
        ("From Chaos to Clarity", "Vom Chaos zur Klarheit"),
        ("We don't just \"fix\" your CRM. We transform it into your company's most valuable asset.",
         "Wir \"reparieren\" Ihr CRM nicht nur. Wir verwandeln es in das wertvollste Kapital Ihres Unternehmens."),
        ("Data Hygiene", "Datenhygiene"),
        ("We merge duplicates, standardize formatting, enrich missing fields, and validate emails. Garbage out, Gold in.",
         "Wir führen Duplikate zusammen, standardisieren Formate, vervollständigen fehlende Felder ve validieren E-Mails. Müll raus, Gold rein."),
        ("Workflow Automation", "Workflow-Automatisierung"),
        ("Automate lead assignment, follow-up reminders, deal movement, and contract generation. Stop doing busy work.",
         "Automatisieren Sie die Lead-Zuweisung, Follow-up-Erinnerungen, Deal-Bewegungen ve die Vertragserstellung. Hören Sie auf mit unnötiger Arbeit."),
        ("Executive Dashboards", "Executive-Dashboards"),
        ("Get clear visibility into revenue, pipeline health, and sales activity. Know exactly where your business stands in real-time.",
         "Erhalten Sie klare Sicht auf Umsatz, Pipeline-Status ve Vertriebsaktivitäten. Wissen Sie in Echtzeit genau, wo Ihr Unternehmen steht."),
        ("Platforms We Master", "Plattformen, die wir beherrschen"),
        ("Enterprise CRMs", "Enterprise-CRMs"),
        ("Cloud Specialists", "Cloud-Spezialisten"),
        ("Data Platforms", "Datenplattformen"),
        ("Automation Tools", "Automatisierungstools"),
        ("We work with your existing stack. No migration needed.", "Wir arbeiten mit Ihrem bestehenden Stack. Keine Migration erforderlich."),
        ("Frequently Asked Questions", "Häufig gestellte Fragen"),
        ("Get answers to common questions about our <strong>CRM management</strong> and optimization services.",
         "Erhalten Sie Antworten auf häufige Fragen zu unseren <strong>CRM-Management</strong>- ve Optimierungs-Services."),
        ("How long does a CRM audit take?", "Wie lange dauert ein CRM-Audit?"),
        ("A typical comprehensive audit takes <strong>3-5 business days</strong>. Our process covers:",
         "Ein typisches umfassendes Audit dauert <strong>3-5 Werktage</strong>. Unser Prozess umfasst:"),
        ("Data Structure Analysis:", "Datenstruktur-Analyse:"),
        ("Field usage, custom properties, and data integrity", "Feldnutzung, benutzerdefinierte Eigenschaften ve Datenintegrität"),
        ("Automation Review:", "Automatisierungs-Review:"),
        ("Workflow efficiency, triggers, and redundancy checks", "Workflow-Effizienz, Trigger ve Redundanzprüfungen"),
        ("User Adoption Audit:", "Nutzerakzeptanz-Audit:"),
        ("How your team actually uses the CRM vs. best practices", "Wie Ihr Team das CRM tatsächlich nutzt im Vergleich zu Best Practices"),
        ("Integration Health:", "Integrations-Zustand:"),
        ("Sync status, API connections, and data flow validation", "Synchronisationsstatus, API-Verbindungen ve Datenfluss-Validierung"),
        ("Reporting Assessment:", "Reporting-Bewertung:"),
        ("Dashboard accuracy and executive visibility gaps", "Dashboard-Genauigkeit ve Lücken in der Sichtbarkeit für Führungskräfte"),
        ("Can you fix messy data without deleting important records?", "Können Sie unordentliche Daten bereinigen, ohne wichtige Datensätze zu loeschen?"),
        ("Absolutely. We use <strong>advanced deduplication and merging strategies</strong> that preserve all historical activity and notes while cleaning up your database. Our data hygiene process includes:",
         "Absolut. Wir verwenden <strong>fortschrittliche Deduplizierungs- ve Zusammenführungsstrategien</strong>, die alle historischen Aktivitäten ve Notizen bewahren, während wir Ihre Datenbank bereinigen. Unser Datenhygiene-Prozess umfasst:"),
        ("Step", "Schritt"),
        ("Action", "Aktion"),
        ("Protection", "Schutz"),
        ("1. Backup", "1. Backup"),
        ("Full database export", "Vollständiger Datenbank-Export"),
        ("Complete rollback capability", "Vollständige Rollback-Moglichkeit"),
        ("2. Deduplication", "2. Deduplizierung"),
        ("Merge duplicate records", "Zusammenführen von Duplikaten"),
        ("All activities preserved", "Alle Aktivitäten bleiben erhalten"),
        ("3. Standardization", "3. Standardisierung"),
        ("Normalize formatting", "Formatierung normalisieren"),
        ("Original data archived", "Originaldaten archiviert"),
        ("4. Enrichment", "4. Anreicherung"),
        ("Fill missing fields", "Fehlende Felder ausfüllen"),
        ("Verified sources only", "Nur verifizierte Quellen"),
        ("Do you build custom automations?", "Erstellen Sie benutzerdefinierte Automatisierungen?"),
        ("Yes, we build <strong>custom workflows</strong> tailored to your specific sales process:",
         "Ja, wir erstellen <strong>maßgeschneiderte Workflows</strong>, die auf Ihren spezifischen Vertriebsprozess zugeschnitten sind:"),
        ("Lead Routing:", "Lead-Routing:"),
        ("Automatic assignment based on territory, deal size, or product line", "Automatische Zuweisung basierend auf Region, Deal-Größe oder Produktlinie"),
        ("Deal Stage Alerts:", "Deal-Stage-Alerts:"),
        ("Real-time notifications when deals stall or progress", "Echtzeit-Benachrichtigungen, wenn Deals stagnieren oder voranschreiten"),
        ("Renewal Reminders:", "Verlängerungs-Erinnerungen:"),
        ("Automated sequences for contract renewals and upsells", "Automatisierte Sequenzen für Vertragsverlängerungen ve Upsells"),
        ("Cross-Object Updates:", "Objektübergreifende Aktualisierungen:"),
        ("Keep related records in sync across your entire CRM", "Verknüpfte Datensätze über Ihr gesamtes CRM hinweg synchron halten"),
        ("Custom Reporting:", "Benutzerdefiniertes Reporting:"),
        ("Automated reports delivered to stakeholders on schedule", "Automatisierte Berichte, die termingerecht an Stakeholder geliefert werden"),
        ("Do you offer training for our team?", "Bieten Sie Schulungen für unser Team an?"),
        ("Yes, we provide <strong>comprehensive training and documentation</strong> to ensure your team maximizes CRM adoption:",
         "Ja, wir bieten <strong>umfassende Schulungen ve Dokumentationen</strong> an, um sicherzustellen, dass Ihr Team die CRM-Akzeptanz maximiert:"),
        ("Recorded Sessions:", "Aufgezeichnete Sitzungen:"),
        ("Video walkthroughs of every workflow and dashboard", "Video-Walkthroughs für jeden Workflow ve jedes Dashboard"),
        ("Written Documentation:", "Schriftliche Dokumentation:"),
        ("Step-by-step guide customized to your CRM setup", "Schritt-für-Schritt-Anleitung, angepasst an dein CRM-Setup"),
        ("Live Q&A:", "Live Q&A:"),
        ("Interactive sessions for your sales and ops teams", "Interaktive Sitzungen für Ihre Vertriebs- ve Operations-Teams"),
        ("Ongoing Support:", "Laufender Support:"),
        ("Post-launch assistance to address questions as they arise", "Unterstützung nach dem Launch, um aufkommende Fragen zu klären"),
        ("Why Trust Go Expandia?", "Warum Go Expandia vertrauen?"),
        ("Data Security", "Datensicherheit"),
        ("Strict protocols to keep your customer data safe.", "Strenge Protokolle zur Sicherheit Ihrer Kundendaten."),
        ("Zero Downtime", "Keine Ausfallzeiten"),
        ("We work in sandboxes to ensure business continuity.", "Wir arbeiten in Sandboxes, um die Geschäftskontinuität zu gewährleisten."),
        ("Sales Focused", "Vertriebsfokussiert"),
        ("We build for salespeople, not just for admins.", "Wir bauen für Vertriebsmitarbeiter, nicht nur für Administratoren."),
        ("Stop Working for Your CRM.", "Hören Sie auf, für Ihr CRM zu arbeiten."),
        ("Make your CRM work for you.", "Lassen Sie Ihr CRM für sich arbeiten."),
        ("Book a Free CRM Audit", "Kostenloses CRM-Audit buchen")
    ]

    for en, de in content_translations:
        main_content = main_content.replace(en, de)

    # 5. Assemble
    final_html = f'''<!DOCTYPE html>
<html lang="de" data-theme="bumblebee">
{head_content}
<body class="font-sans">
    {de_nav}
    {main_content}
    {de_footer}
'''

    # Ensure relative paths for German directory
    final_html = final_html.replace('href="contact.html"', 'href="./contact.html"')
    # Fix paths that might have been copied from English
    final_html = final_html.replace('src="./go-expandia-logo.png"', 'src="../go-expandia-logo.png"')

    with open('/Users/busraocak/expandia/de/crm-management.html', 'w', encoding='utf-8') as f:
        f.write(final_html)

if __name__ == "__main__":
    main()
