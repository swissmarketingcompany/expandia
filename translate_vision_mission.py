import re

def main():
    # Read the vision-mission.html file
    with open('/Users/busraocak/expandia/vision-mission.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Read a German template to get the German navbar and footer
    with open('/Users/busraocak/expandia/de/about.html', 'r', encoding='utf-8') as f:
        de_template = f.read()

    # Find parts: head, main content, etc.
    main_start = content.find('<!-- Hero Section -->')
    main_end = content.find('<!-- Footer -->')
    main_content = content[main_start:main_end]

    head_start = content.find('<head>')
    head_end = content.find('<body')
    head_content = content[head_start:head_end]

    nav_start = de_template.find('<nav class="navbar')
    nav_end = de_template.find('<!-- Hero Section -->')
    if nav_end == -1:
        nav_end = de_template.find('<section')

    de_nav = de_template[nav_start:nav_end]
    # Update lang switcher on de_nav for about.html -> vision-mission.html
    de_nav = de_nav.replace('../about.html', '../vision-mission.html')
    de_nav = de_nav.replace('./about.html', './vision-mission.html')
    de_nav = de_nav.replace('../fr/about.html', '../fr/vision-mission.html')

    footer_start = de_template.find('<!-- Footer -->')
    de_footer = de_template[footer_start:]

    # Head translations
    de_head = head_content
    de_head = de_head.replace('lang="en"', 'lang="de"')
    de_head = de_head.replace('<title>Vision & Mission | Go Expandia</title>', '<title>Vision & Mission | Go Expandia</title>')
    de_head = re.sub(r'<meta name="description"[\s\S]*?>', '<meta name="description" content="Go Expandia\'s Vision und Mission. Die Zukunft der B2B-Vertriebsentwicklung gestalten.">', de_head)
    de_head = re.sub(r'<meta name="keywords"[\s\S]*?>', '<meta name="keywords" content="Go Expandia Vision, Go Expandia Mission, Werte der B2B-Vertriebsagentur">', de_head)
    
    de_head = de_head.replace('href="https://www.goexpandia.com/vision-mission.html"', 'href="https://www.goexpandia.com/de/vision-mission.html"')
    de_head = de_head.replace('property="og:title" content="Vision & Mission | Go Expandia"', 'property="og:title" content="Vision & Mission | Go Expandia"')
    de_head = de_head.replace('property="twitter:title" content="Vision & Mission | Go Expandia"', 'property="twitter:title" content="Vision & Mission | Go Expandia"')
    
    og_desc = 'Go Expandia\\\'s Vision und Mission. Die Zukunft der B2B-Vertriebsentwicklung gestalten.'
    de_head = re.sub(r'<meta property="og:description"[\s\S]*?>', f'<meta property="og:description"\n        content="{og_desc}">', de_head)
    de_head = re.sub(r'<meta name="twitter:description"[\s\S]*?>', f'<meta name="twitter:description"\n        content="{og_desc}">', de_head)
    
    de_head = de_head.replace('href="./dist/css/output.css"', 'href="../dist/css/output.css"')
    de_head = de_head.replace('href="./favicon', 'href="../favicon')

    # Re-link hreflang inside German file (assuming we update the canonical/hreflang properly)
    de_head = de_head.replace('<link rel="alternate" hreflang="en" href="https://www.goexpandia.com/vision-mission.html">', '<link rel="alternate" hreflang="en" href="https://www.goexpandia.com/vision-mission.html">')

    # Main content translations
    # 1. Hero Section
    main_content = main_content.replace('Our Purpose', 'Unser Zweck')
    main_content = main_content.replace('Vision & Mission', 'Vision & Mission')
    main_content = main_content.replace('Shaping the future of B2B sales development by combining human expertise with data-driven\n                    strategies.', 'Die Zukunft der B2B-Vertriebsentwicklung gestalten, indem wir menschliche Expertise mit datengesteuerten Strategien kombinieren.')
    main_content = main_content.replace('Our Vision', 'Unsere Vision')
    main_content = main_content.replace('Our Mission <span class="group-hover:translate-y-1 transition-transform duration-300">↓</span>', 'Unsere Mission <span class="group-hover:translate-y-1 transition-transform duration-300">↓</span>')

    # 2. Vision Section
    main_content = main_content.replace('Leading the <span class="text-secondary">Global Expansion</span>', 'Führend in der <span class="text-secondary">Globalen Expansion</span>')
    main_content = main_content.replace(
        'To be the leading partner for B2B companies seeking sustainable growth in international markets.\n                        We envision a world where businesses of all sizes can confidently expand their reach,\n                        build meaningful relationships, and achieve predictable revenue growth through strategic\n                        sales development.',
        'Der führende Partner für B2B-Unternehmen zu sein, die nachhaltiges Wachstum auf internationalen Märkten anstreben. Wir stellen uns eine Welt vor, in der Unternehmen jeder Größe ihre Reichweite selbstbewusst erweitern, sinnvolle Beziehungen aufbauen und vorhersehbares Umsatzwachstum durch strategische Vertriebsentwicklung erzielen können.'
    )
    main_content = main_content.replace(
        'We strive to transform the way companies approach business development by combining\n                        human expertise with data-driven strategies, making high-performance sales accessible\n                        and effective for every organization.',
        'Wir bemühen uns, die Art und Weise zu transformieren, wie Unternehmen die Geschäftsentwicklung angehen, indem wir menschliche Expertise mit datengesteuerten Strategien kombinieren und so leistungsstarken Vertrieb für jede Organisation zugänglich und effektiv machen.'
    )

    # 3. Mission Section
    main_content = main_content.replace('Driving Your Success', 'Ihren Erfolg vorantreiben')
    main_content = main_content.replace(
        'To empower businesses of all sizes to achieve their full revenue potential through expert-led\n                    sales services and intelligent automation. We believe that by providing a combination of\n                    strategic guidance, operational excellence, and cutting-edge tools, we can level the playing\n                    field and make high-performance sales accessible to everyone.',
        'Unternehmen jeder Größe in die Lage zu versetzen, ihr volles Umsatzpotenzial durch expertengeführte Vertriebsdienstleistungen und intelligente Automatisierung auszuschöpfen. Wir glauben, dass wir durch die Bereitstellung einer Kombination aus strategischer Führung, operativer Exzellenz und hochmodernen Tools das Spielfeld ebnen und leistungsstarken Vertrieb für alle zugänglich machen können.'
    )
    main_content = main_content.replace('Results-Driven', 'Ergebnisorientiert')
    main_content = main_content.replace('We measure success by the revenue impact we create for your business.', 'Wir messen den Erfolg am Umsatzeinfluss, den wir für Ihr Unternehmen schaffen.')
    main_content = main_content.replace('Partnership Focus', 'Fokus auf Partnerschaft')
    main_content = main_content.replace('Your growth is our primary success metric. We succeed when you succeed.', 'Ihr Wachstum ist unsere primäre Erfolgsmetrik. Wir sind erfolgreich, wenn Sie es sind.')
    main_content = main_content.replace('Innovation First', 'Innovation zuerst')
    main_content = main_content.replace('We continuously adopt the latest methodologies to keep you ahead.', 'Wir wenden kontinuierlich die neuesten Methoden an, um Sie an der Spitze zu halten.')

    # 4. Our Approach Section
    main_content = main_content.replace('Methodology', 'Methodik')
    main_content = main_content.replace('Our <span class="gradient-header">Approach</span>', 'Unser <span class="gradient-header">Ansatz</span>')
    main_content = main_content.replace(
        'At Go Expandia, we believe that sustainable business growth comes from a perfect balance\n                    of strategy, execution, and continuous optimization.',
        'Bei Go Expandia glauben wir, dass nachhaltiges Unternehmenswachstum aus einer perfekten Balance von Strategie, Ausführung und kontinuierlicher Optimierung resultiert.'
    )
    main_content = main_content.replace('Strategic Planning', 'Strategische Planung')
    main_content = main_content.replace(
        'We start by understanding your business, target market, and growth objectives.\n                            Our team develops a customized strategy that aligns with your goals and leverages\n                            proven methodologies for maximum impact.',
        'Wir beginnen damit, Ihr Unternehmen, Ihren Zielmarkt und Ihre Wachstumsziele zu verstehen. Unser Team entwickelt eine maßgeschneiderte Strategie, die mit Ihren Zielen übereinstimmt und bewährte Methoden für maximale Wirkung nutzt.'
    )
    main_content = main_content.replace('Expert Execution', 'Experten-Ausführung')
    main_content = main_content.replace(
        'Our experienced sales professionals become an extension of your team,\n                            implementing campaigns, engaging prospects, and nurturing relationships that\n                            drive revenue growth.',
        'Unsere erfahrenen Vertriebsprofis werden zu einer Erweiterung Ihres Teams, implementieren Kampagnen, binden Interessenten ein und pflegen Beziehungen, die das Umsatzwachstum vorantreiben.'
    )
    main_content = main_content.replace('Continuous Optimization', 'Kontinuierliche Optimierung')
    main_content = main_content.replace(
        'We measure everything, analyze results, and continuously refine our approach\n                            to ensure you\'re getting the best possible ROI from your sales development investment.',
        'Wir messen alles, analysieren Ergebnisse und verfeinern kontinuierlich unseren Ansatz, um sicherzustellen, dass Sie den bestmöglichen ROI aus Ihrer Investition in die Vertriebsentwicklung erhalten.'
    )

    # 5. Final CTA Section
    main_content = main_content.replace('Join Us on the Journey', 'Begleiten Sie uns auf der Reise')
    main_content = main_content.replace(
        'Let\'s work together to unlock your company\'s full revenue potential.\n                Get in touch for a free consultation and discover how we can accelerate your growth.',
        'Lassen Sie uns zusammenarbeiten, um das volle Umsatzpotenzial Ihres Unternehmens auszuschöpfen. Kontaktieren Sie uns für eine kostenlose Beratung und entdecken Sie, wie wir Ihr Wachstum beschleunigen können.'
    )
    main_content = main_content.replace('Get Free Consultation', 'Kostenlose Beratung anfordern')
    main_content = main_content.replace('Explore Our Solutions', 'Unsere Lösungen entdecken')

    # Reconstruct document
    de_head = '<!DOCTYPE html>\n<html lang="de" data-theme="bumblebee">\n\n<head>' + de_head.split('<head>')[1]

    final_output = de_head + '<body class="font-sans">\n' + de_nav + '\n' + main_content + '\n' + de_footer

    with open('/Users/busraocak/expandia/de/vision-mission.html', 'w', encoding='utf-8') as f:
        f.write(final_output)

    print("Generation complete")

if __name__ == '__main__':
    main()
