import re
import os

def main():
    # Load the English image-content-engine.html
    with open('/Users/busraocak/expandia/image-content-engine.html', 'r', encoding='utf-8') as f:
        en_content = f.read()
        
    # Load the German written-content-engine.html to get header and footer
    with open('/Users/busraocak/expandia/de/written-content-engine.html', 'r', encoding='utf-8') as f:
        de_template = f.read()

    # Extract German navbar
    nav_start = de_template.find('<nav class="navbar')
    nav_end = de_template.find('<!-- Written Content Engine Hero -->')
    de_nav = de_template[nav_start:nav_end]
    
    # Fix language switcher in de_nav for image content engine
    de_nav = de_nav.replace('../written-content-engine.html', '../image-content-engine.html')
    de_nav = de_nav.replace('./written-content-engine.html', './image-content-engine.html')
    de_nav = de_nav.replace('../fr/written-content-engine.html', '../fr/image-content-engine.html')

    # Extract German footer
    footer_start = de_template.find('<!-- Footer -->')
    de_footer = de_template[footer_start:]

    # Construct Head for de/image-content-engine.html based on en head
    head_start = en_content.find('<head>')
    head_end = en_content.find('<body')
    en_head = en_content[head_start:head_end]
    
    de_head = en_head
    de_head = de_head.replace('lang="en"', 'lang="de"')
    de_head = de_head.replace(
        '<title>Image Content Engine | AI Graphics, Social Posts & Ad Creatives | Go Expandia</title>',
        '<title>Engine für Bildinhalte | KI-Grafiken, Social Posts & Werbeanzeigen | Go Expandia</title>'
    )
    de_head = re.sub(r'<meta name="description"\s*content=".*?">', '<meta name="description"\n        content="Generieren Sie 365 Tage an KI-gestalteten Grafiken, Social-Media-Posts und Werbeanzeigen in 48 Stunden. Automatisch geplante und markengerechte Visuals für Ihr Unternehmen.">', de_head, flags=re.DOTALL)
    de_head = re.sub(r'<meta name="keywords"\s*content=".*?">', '<meta name="keywords"\n        content="KI-Grafikdesign, automatisierte Social-Media-Posts, Werbemittel, Engine für Bildinhalte, Go Expandia, Bulk-Content-Erstellung, Instagram-Posts Automatisierung">', de_head, flags=re.DOTALL)
    
    de_head = de_head.replace('href="https://www.goexpandia.com/image-content-engine.html"', 'href="https://www.goexpandia.com/de/image-content-engine.html"')
    de_head = de_head.replace('property="og:title" content="Image Content Engine | AI Graphics, Social Posts & Ad Creatives | Go Expandia"', 'property="og:title" content="Engine für Bildinhalte | KI-Grafiken, Social Posts & Werbeanzeigen | Go Expandia"')
    de_head = de_head.replace('property="twitter:title" content="Image Content Engine | AI Graphics, Social Posts & Ad Creatives | Go Expandia"', 'property="twitter:title" content="Engine für Bildinhalte | KI-Grafiken, Social Posts & Werbeanzeigen | Go Expandia"')
    de_head = re.sub(r'<meta property="og:description"\s*content=".*?">', '<meta property="og:description"\n        content="Generieren Sie 365 Tage an KI-gestalteten Grafiken, Social-Media-Posts und Werbeanzeigen in 48 Stunden. Automatisch geplante und markengerechte Visuals.">', de_head, flags=re.DOTALL)
    de_head = re.sub(r'<meta name="twitter:description"\s*content=".*?">', '<meta name="twitter:description"\n        content="Generieren Sie 365 Tage an KI-gestalteten Grafiken, Social-Media-Posts und Werbeanzeigen in 48 Stunden. Automatisch geplante und markengerechte Visuals.">', de_head, flags=re.DOTALL)
    
    # CSS/Favicon path adjustments since this is in /de/
    de_head = de_head.replace('href="./dist/css/output.css"', 'href="../dist/css/output.css"')
    de_head = de_head.replace('href="./favicon', 'href="../favicon')
    
    # Schema.org translation
    de_head = de_head.replace('"name": "Image Content Engine"', '"name": "Engine für Bildinhalte"')
    de_head = de_head.replace('"description": "AI-powered graphic design delivering 365 days of social media visuals in 48 hours with automated scheduling."', '"description": "KI-gesteuertes Grafikdesign, das an 365 Tagen in 48 Stunden Visuals für Social Media liefert, inkl. automatisiert geplanter Veröffentlichung."')

    # Main content translation
    main_start = en_content.find('<!-- Image Content Engine Hero -->')
    main_end = en_content.find('<!-- Footer -->')
    main_content = en_content[main_start:main_end]

    # Translate Hero
    main_content = main_content.replace('AI-Powered • 48-Hour Delivery', 'KI-gesteuert • 48 Stunden Lieferung')
    main_content = main_content.replace('365 Days of Visuals<br>', '365 Tage an Grafiken<br>')
    main_content = main_content.replace('<span class="text-accent">Delivered in 48 Hours</span>', '<span class="text-accent">Geliefert in 48 Stunden</span>')
    main_content = main_content.replace(
        'Get a full year of AI-generated graphics, social media posts, and ad creatives—scheduled and\n                        ready\n                        to publish automatically. Never run out of visuals again.',
        'Erhalten Sie ein ganzes Jahr an KI-generierten Grafiken, Social-Media-Beiträgen und Werbemitteln – geplant und bereit zur automatischen Veröffentlichung. Ihnen gehen nie wieder die visuellen Inhalte aus.'
    )
    main_content = main_content.replace('What You Get:', 'Was Sie erhalten:')
    main_content = main_content.replace('<strong class="text-base-content">365 AI-designed images</strong> (social posts,\n                                    infographics, ads)', '<strong class="text-base-content">365 KI-gestaltete Bilder</strong> (Social Posts, Infografiken, Ads)')
    main_content = main_content.replace('<strong class="text-base-content">Pre-scheduled posting</strong> to Instagram,\n                                    LinkedIn, or Twitter', '<strong class="text-base-content">Vorgeplante Veröffentlichung</strong> auf Instagram, LinkedIn oder Twitter')
    main_content = main_content.replace('<strong class="text-base-content">Delivered in 48 hours</strong>—your brand stays\n                                    visible all year', '<strong class="text-base-content">Geliefert in 48 Stunden</strong> – Ihre Marke bleibt das ganze Jahr über sichtbar')
    main_content = main_content.replace('View Packages', 'Pakete ansehen')
    main_content = main_content.replace('How It Works', 'Wie es funktioniert')
    main_content = main_content.replace('AI Design Automation', 'KI-Design-Automatisierung')

    # Calendar Translate
    main_content = main_content.replace('Your Year-Long Visual Calendar', 'Ihr ganzjähriger visueller Kalender')
    main_content = main_content.replace('Every graphic is pre-scheduled. Your brand\n                    stays\n                    consistent.', 'Jede Grafik ist vorgeplant. Ihre Marke bleibt konsistent.')
    main_content = main_content.replace('Jan 15', '15. Jan')
    main_content = main_content.replace('9:00 AM', '09:00 Uhr')
    main_content = main_content.replace('Product Feature Carousel (5 slides)', 'Produkt-Feature-Karussell (5 Folien)')
    main_content = main_content.replace('Instagram • LinkedIn • Auto-Published', 'Instagram • LinkedIn • Auto-Veröffentlicht')
    main_content = main_content.replace('✓ Scheduled', '✓ Geplant')

    main_content = main_content.replace('Jan 16', '16. Jan')
    main_content = main_content.replace('Customer Success Story Infographic', 'Kunden-Erfolgsgeschichte (Infografik)')
    main_content = main_content.replace('LinkedIn • Twitter • Auto-Published', 'LinkedIn • Twitter • Auto-Veröffentlicht')

    main_content = main_content.replace('Jan 17', '17. Jan')
    main_content = main_content.replace('Industry Stats Visual (Data Viz)', 'Branchenstatistiken (Datenvisualisierung)')
    main_content = main_content.replace('LinkedIn • Instagram • Auto-Published', 'LinkedIn • Instagram • Auto-Veröffentlicht')

    main_content = main_content.replace('+ 362 more graphics scheduled through Dec 31, 2026', '+ 362 weitere Grafiken geplant bis 31. Dez 2026')

    # How it works Translate
    main_content = main_content.replace('Fully Automated Visual Pipeline', 'Vollautomatisierte visuelle Pipeline')
    main_content = main_content.replace('Our AI design team generates, schedules, and\n                    delivers a full year of graphics in one go.', 'Unser KI-Designteam erstellt, plant und liefert ein ganzes Jahr an Grafiken auf einmal.')
    main_content = main_content.replace('Share Your Brand Kit', 'Teilen Sie Ihr Marken-Kit')
    main_content = main_content.replace('Upload your logo, colors, and style preferences. We train the AI on\n                        your\n                        brand.', 'Laden Sie Ihr Logo, Ihre Farben und Stilpräferenzen hoch. Wir trainieren die KI auf Ihre Marke.')
    main_content = main_content.replace('AI Designs 365 Graphics', 'KI entwirft 365 Grafiken')
    main_content = main_content.replace('Our system creates a year\'s worth of on-brand visuals in 48 hours.', 'Unser System erstellt markenspezifische Grafiken für ein ganzes Jahr in 48 Stunden.')
    main_content = main_content.replace('Auto-Scheduled Publishing', 'Automatisiert geplante Veröffentlichung')
    main_content = main_content.replace('Graphics are pre-loaded to your social accounts and post\n                        automatically,\n                        daily.', 'Die Grafiken werden auf Ihre Social-Media-Konten geladen und täglich automatisch veröffentlicht.')

    # Packages Translate
    main_content = main_content.replace('Choose Your Package', 'Wählen Sie Ihr Paket')
    main_content = main_content.replace('Visual Packages', 'Grafik-Pakete')
    main_content = main_content.replace('Select the volume that matches your social\n                    media\n                    goals. One-time payment — visuals delivered in 48 hours.', 'Wählen Sie das Volumen, das zu Ihren Social-Media-Zielen passt. Einmalige Zahlung — Grafiken geliefert in 48 Stunden.')

    main_content = main_content.replace('STARTER', 'STARTER')
    main_content = main_content.replace('90 Graphics', '90 Grafiken')
    main_content = main_content.replace('Quarterly Visuals', 'Vierteljährliche Grafiken')
    main_content = main_content.replace('one-time', 'einmalig')
    
    main_content = main_content.replace('90 AI-Designed Graphics', '90 KI-gestaltete Grafiken')
    main_content = main_content.replace('Brand-Matched Design', 'Markenspezifisches Design')
    
    main_content = main_content.replace('180 Graphics', '180 Grafiken')
    main_content = main_content.replace('Semi-Annual Visuals', 'Halbjährliche Grafiken')
    main_content = main_content.replace('180 AI-Designed Graphics', '180 KI-gestaltete Grafiken')
    main_content = main_content.replace('Priority Support', 'Bevorzugter Support')
    main_content = main_content.replace('POPULAR', 'BELIEBT')
    main_content = main_content.replace('GROWTH', 'WACHSTUM')

    main_content = main_content.replace('365 Graphics', '365 Grafiken')
    main_content = main_content.replace('Full Year Visuals', 'Ganzjährige Grafiken')
    main_content = main_content.replace('PRO', 'PRO')
    main_content = main_content.replace('365 AI-Designed Graphics', '365 KI-gestaltete Grafiken')
    main_content = main_content.replace('Custom Templates', 'Benutzerdefinierte Vorlagen')

    main_content = main_content.replace('ENTERPRISE', 'ENTERPRISE')
    main_content = main_content.replace('730 Graphics', '730 Grafiken')
    main_content = main_content.replace('2-Year Visuals', '2-Jahres-Grafiken')
    main_content = main_content.replace('730 AI-Designed Graphics', '730 KI-gestaltete Grafiken')
    main_content = main_content.replace('Dedicated Designer', 'Dedizierter Designer')
    main_content = main_content.replace('Unlimited Revisions', 'Unbegrenzte Revisionen')

    main_content = main_content.replace('Get Started', 'Loslegen')

    # FAQ Translate
    main_content = main_content.replace('Frequently Asked Questions', 'Häufig gestellte Fragen')
    
    main_content = main_content.replace('How does the AI match my brand style?', 'Wie passt sich die KI an meinen Markenstil an?')
    main_content = main_content.replace('You upload your brand kit (logo, color palette, fonts, and 3-5 example designs). Our AI analyzes\n                        these and generates graphics that match your visual identity.', 'Sie laden Ihr Marken-Kit (Logo, Farbpalette, Schriftarten und 3-5 Beispieldesigns) hoch. Unsere KI analysiert diese und generiert Grafiken, die zu Ihrer visuellen Identität passen.')

    main_content = main_content.replace('Can I request changes to the designs?', 'Kann ich Änderungen an den Designs anfordern?')
    main_content = main_content.replace('Yes! All graphics are delivered in editable formats (Canva, Figma, or PSD). You can tweak\n                        colors, text, or layouts anytime. Pro and Enterprise plans include revision support.', 'Ja! Alle Grafiken werden in bearbeitbaren Formaten (Canva, Figma oder PSD) geliefert. Sie können Farben, Texte oder Layouts jederzeit anpassen. Pro- und Enterprise-Pläne beinhalten Revisionsunterstützung.')

    main_content = main_content.replace('What social platforms do you support?', 'Welche sozialen Plattformen unterstützen Sie?')
    main_content = main_content.replace('We support Instagram, LinkedIn, Twitter/X, Facebook, and Pinterest. Graphics are optimized for\n                        each platform\'s dimensions and best practices.', 'Wir unterstützen Instagram, LinkedIn, Twitter/X, Facebook und Pinterest. Grafiken sind für die Dimensionen und Best Practices jeder Plattform optimiert.')

    main_content = main_content.replace('Do I own the graphics?', 'Gehören mir die Grafiken?')
    main_content = main_content.replace('Yes. You have full commercial rights to all graphics. Use them forever, repurpose them, or even\n                        resell them if you want.', 'Ja. Sie haben die vollen kommerziellen Rechte an allen Grafiken. Nutzen Sie diese für immer, verwenden Sie sie neu oder verkaufen Sie sie sogar weiter, wenn Sie möchten.')

    main_content = main_content.replace('What if I need more graphics mid-year?', 'Was ist, wenn ich mitten im Jahr mehr Grafiken benötige?')
    main_content = main_content.replace('You can purchase add-on packs (30, 60, or 90 graphics) at any time. We\'ll match your existing\n                        style and schedule them into your calendar.', 'Sie können jederzeit Zusatzpakete (30, 60 oder 90 Grafiken) erwerben. Wir passen diese an Ihren bestehenden Stil an und planen sie in Ihren Kalender ein.')

    # Global regex replaces for the remaining items if they didn't match perfectly
    main_content = main_content.replace('contact.html', 'contact.html') # Ensure links stay the same, they share same folder depth

    # Fix document structure
    de_head = '<!DOCTYPE html>\n<html lang="de" data-theme="bumblebee">\n\n<head>' + de_head.split('<head>')[1]
    
    final_output = de_head + '<body>\n' + de_nav + '\n' + main_content + '\n' + de_footer

    with open('/Users/busraocak/expandia/de/image-content-engine.html', 'w', encoding='utf-8') as f:
        f.write(final_output)
    
    print("Generation complete")

if __name__ == '__main__':
    main()
