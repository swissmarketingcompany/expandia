import re

def main():
    # Read the about.html file
    with open('/Users/busraocak/expandia/about.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Read a German template to get the German navbar and footer
    with open('/Users/busraocak/expandia/de/video-content-engine.html', 'r', encoding='utf-8') as f:
        de_template = f.read()

    # Find parts: head, main content, etc.
    main_start = content.find('<!-- Hero Section -->')
    main_end = content.find('<!-- Footer -->')
    main_content = content[main_start:main_end]

    head_start = content.find('<head>')
    head_end = content.find('<body')
    head_content = content[head_start:head_end]

    nav_start = de_template.find('<nav class="navbar')
    nav_end = de_template.find('<!-- Video Content Engine Hero -->')
    if nav_end == -1:
        nav_end = de_template.find('<!-- Hero Section -->')
    if nav_end == -1:
        nav_end = de_template.find('<section')

    de_nav = de_template[nav_start:nav_end]
    # Update lang switcher on de_nav for about.html
    de_nav = de_nav.replace('../video-content-engine.html', '../about.html')
    de_nav = de_nav.replace('./video-content-engine.html', './about.html')
    de_nav = de_nav.replace('../fr/video-content-engine.html', '../fr/about.html')

    footer_start = de_template.find('<!-- Footer -->')
    de_footer = de_template[footer_start:]

    # Head translations
    de_head = head_content
    de_head = de_head.replace('lang="en"', 'lang="de"')
    de_head = de_head.replace('<title>About Us | Go Expandia</title>', '<title>Über uns | Go Expandia</title>')
    de_head = re.sub(r'<meta name="description"[\s\S]*?>', '<meta name="description"\n        content="Erfahren Sie mehr über Go Expandia, Ihren strategischen Partner für schlüsselfertige IT, Vertriebswachstum und KI-Infrastruktur. Wir helfen Unternehmen, weltweit mit verwalteten Lösungen zu skalieren.">', de_head)
    de_head = re.sub(r'<meta name="keywords"[\s\S]*?>', '<meta name="keywords"\n        content="Über Go Expandia, Schlüsselfertige IT, Wachstumsinfrastruktur, Verwalteter Vertrieb, KI-Inhalte, Unternehmensskalierung, Globale Expansion">', de_head)
    
    de_head = de_head.replace('href="https://www.goexpandia.com/about.html"', 'href="https://www.goexpandia.com/de/about.html"')
    de_head = de_head.replace('property="og:title" content="About Us | Go Expandia"', 'property="og:title" content="Über uns | Go Expandia"')
    de_head = de_head.replace('property="twitter:title" content="About Us | Go Expandia"', 'property="twitter:title" content="Über uns | Go Expandia"')
    
    og_desc = 'Wir bauen schnelle Wachstumsinfrastruktur, verwaltete Vertriebssysteme und IT-Lösungen. Erfahren Sie mehr über unsere Mission, Ihnen bei der Skalierung zu helfen.'
    de_head = re.sub(r'<meta property="og:description"[\s\S]*?>', f'<meta property="og:description"\n        content="{og_desc}">', de_head)
    de_head = re.sub(r'<meta name="twitter:description"[\s\S]*?>', f'<meta name="twitter:description"\n        content="{og_desc}">', de_head)
    
    de_head = de_head.replace('href="./dist/css/output.css"', 'href="../dist/css/output.css"')
    de_head = de_head.replace('href="./favicon', 'href="../favicon')

    # Main content translations
    # 1. Hero Section
    main_content = main_content.replace('Our Mission', 'Unsere Mission')
    main_content = main_content.replace('Empowering Growth.', 'Wachstum stärken.')
    main_content = main_content.replace('Building Infrastructure.', 'Infrastruktur aufbauen.')
    main_content = main_content.replace(
        'At Go Expandia, we believe that <strong class="text-primary">scalability</strong> shouldn\'t be\n                        a bottleneck. We provide the plug-and-play <strong class="text-secondary">Growth\n                            Infrastructure</strong> you need to expand into new markets, automate sales, and secure your\n                        operations.',
        'Bei Go Expandia glauben wir, dass <strong class="text-primary">Skalierbarkeit</strong> kein Engpass sein sollte. Wir bieten die schlüsselfertige <strong class="text-secondary">Wachstumsinfrastruktur</strong>, die Sie benötigen, um in neue Märkte zu expandieren, den Vertrieb zu automatisieren und Ihre Abläufe zu sichern.'
    )
    main_content = main_content.replace('Partner With Us', 'Mit uns zusammenarbeiten')

    # 2. Key Values Section
    main_content = main_content.replace('Our Core Values', 'Unsere Grundwerte')
    main_content = main_content.replace('The principles that drive every project and partnership we undertake.', 'Die Prinzipien, die jedes Projekt und jede Partnerschaft antreiben, die wir eingehen.')
    
    main_content = main_content.replace('Speed', 'Geschwindigkeit')
    main_content = main_content.replace(
        'We value rapid deployment. Time to market is critical, and our infrastructure is designed to be\n                        live in 48 hours.',
        'Wir legen Wert auf eine schnelle Bereitstellung. Die Zeit bis zur Markteinführung ist entscheidend, und unsere Infrastruktur ist so konzipiert, dass sie in 48 Stunden live ist.'
    )
    
    main_content = main_content.replace('Reliability', 'Zuverlässigkeit')
    main_content = main_content.replace(
        'Your growth depends on stable systems. We rigorously test and maintain every piece of\n                        infrastructure we build.',
        'Ihr Wachstum hängt von stabilen Systemen ab. Wir testen und warten rigorously jedes Teil der Infrastruktur, die wir aufbauen.'
    )
    
    main_content = main_content.replace('Transparency', 'Transparenz')
    main_content = main_content.replace(
        'No hidden fees, no vague promises. We provide clear deliverables and measurable results from day\n                        one.',
        'Keine versteckten Gebühren, keine unklaren Versprechen. Wir liefern von Tag eins an klare Ergebnisse und messbare Resultate.'
    )
    
    main_content = main_content.replace('Partnership', 'Partnerschaft')
    main_content = main_content.replace(
        'We aren\'t just a service provider; we are your growth partners, invested in your long-term\n                        success.',
        'Wir sind nicht nur ein Dienstleister; wir sind Ihre Wachstumspartner, die in Ihren langfristigen Erfolg investieren.'
    )

    # 3. Why Us / Story Section
    main_content = main_content.replace('Who We Are', 'Wer wir sind')
    main_content = main_content.replace('The Infrastructure Behind Your <span\n                            class="text-primary">Success Story</span>', 'Die Infrastruktur hinter Ihrer <span\n                            class="text-primary">Erfolgsgeschichte</span>')
    main_content = main_content.replace(
        'Go Expandia was founded on a simple premise: great companies often stall not because they lack\n                        vision, but because they lack the <strong>infrastructure</strong> to execute that vision at\n                        scale.',
        'Go Expandia wurde auf einer einfachen Prämisse gegründet: Großartige Unternehmen geraten oft ins Stocken, nicht weil ihnen die Vision fehlt, sondern weil ihnen die <strong>Infrastruktur</strong> fehlt, um diese Vision skalierbar umzusetzen.'
    )
    main_content = main_content.replace(
        'Whether it\'s setting up compliant global entities, automating lead generation, or securing\n                        enterprise-grade IT systems, the complexity of growth can be overwhelming. We exist to remove\n                        that complexity. We build the rails so you can drive the train.',
        'Ob es um die Einrichtung konformer globaler Einheiten, die Automatisierung der Lead-Generierung oder die Sicherung branchenführender IT-Systeme geht, die Komplexität des Wachstums kann überwältigend sein. Wir existieren, um diese Komplexität zu beseitigen. Wir bauen die Schienen, damit Sie den Zug fahren können.'
    )
    
    main_content = main_content.replace('Vision Forward', 'Vision nach vorne')
    main_content = main_content.replace('Projects Delivered', 'Durchgeführte Projekte')
    main_content = main_content.replace('Support', 'Unterstützung')

    # 4. Final CTA Section
    main_content = main_content.replace('Ready to build with us?', 'Bereit, mit uns zu bauen?')
    main_content = main_content.replace(
        'Join hundreds of companies that trust Go Expandia for their growth infrastructure.',
        'Schließen Sie sich Hunderten von Unternehmen an, die Go Expandia für ihre Wachstumsinfrastruktur vertrauen.'
    )
    
    main_content = main_content.replace('Get in Touch', 'Kontakt aufnehmen')
    main_content = main_content.replace('Explore Solutions', 'Lösungen entdecken')
    main_content = main_content.replace('contact.html', 'contact.html') # ensure it stays

    # Reconstruct document
    de_head = '<!DOCTYPE html>\n<html lang="de" data-theme="bumblebee">\n\n<head>' + de_head.split('<head>')[1]

    final_output = de_head + '<body class="font-sans">\n' + de_nav + '\n' + main_content + '\n' + de_footer

    with open('/Users/busraocak/expandia/de/about.html', 'w', encoding='utf-8') as f:
        f.write(final_output)

    print("Generation complete")

if __name__ == '__main__':
    main()
