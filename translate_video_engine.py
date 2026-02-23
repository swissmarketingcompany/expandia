import re
import os

def main():
    # Load the English video-content-engine.html
    with open('/Users/busraocak/expandia/video-content-engine.html', 'r', encoding='utf-8') as f:
        en_content = f.read()
        
    # Load the German written-content-engine.html to get header and footer as a template base
    with open('/Users/busraocak/expandia/de/written-content-engine.html', 'r', encoding='utf-8') as f:
        de_template = f.read()

    # Extract German navbar
    nav_start = de_template.find('<nav class="navbar')
    nav_end = de_template.find('<!-- Written Content Engine Hero -->')
    de_nav = de_template[nav_start:nav_end]
    
    # Fix language switcher in de_nav for video content engine
    de_nav = de_nav.replace('../written-content-engine.html', '../video-content-engine.html')
    de_nav = de_nav.replace('./written-content-engine.html', './video-content-engine.html')
    de_nav = de_nav.replace('../fr/written-content-engine.html', '../fr/video-content-engine.html')

    # Extract German footer
    footer_start = de_template.find('<!-- Footer -->')
    de_footer = de_template[footer_start:]

    # Construct Head for de/video-content-engine.html based on en head
    head_start = en_content.find('<head>')
    head_end = en_content.find('<body')
    en_head = en_content[head_start:head_end]
    
    de_head = en_head
    de_head = de_head.replace('lang="en"', 'lang="de"')
    de_head = de_head.replace(
        '<title>Video Content Engine | AI Avatars & Video Automation | Go Expandia</title>',
        '<title>Engine für Videoinhalte | KI-Avatare & Video-Automatisierung | Go Expandia</title>'
    )
    de_head = re.sub(r'<meta name="description"\s*content=".*?">', '<meta name="description"\n        content="Generieren Sie 365 Tage an KI-Videoinhalten in 48 Stunden. KI-Avatare, Erklärvideos und Produktvideos automatisiert für YouTube, TikTok und LinkedIn.">', de_head, flags=re.DOTALL)
    de_head = re.sub(r'<meta name="keywords"\s*content=".*?">', '<meta name="keywords"\n        content="KI-Video, KI-Avatare, Video-Automatisierung, Engine für Videoinhalte, Videomarketing, YouTube Automatisierung, TikTok Wachstum, Produktvideos, Go Expandia">', de_head, flags=re.DOTALL)
    
    de_head = de_head.replace('href="https://www.goexpandia.com/video-content-engine.html"', 'href="https://www.goexpandia.com/de/video-content-engine.html"')
    de_head = de_head.replace('property="og:title" content="Video Content Engine | AI Avatars & Video Automation | Go Expandia"', 'property="og:title" content="Engine für Videoinhalte | KI-Avatare & Video-Automatisierung | Go Expandia"')
    de_head = de_head.replace('property="twitter:title" content="Video Content Engine | AI Avatars & Video Automation | Go Expandia"', 'property="twitter:title" content="Engine für Videoinhalte | KI-Avatare & Video-Automatisierung | Go Expandia"')
    de_head = re.sub(r'<meta property="og:description"\s*content=".*?">', '<meta property="og:description"\n        content="Generieren Sie 365 Tage an KI-Videoinhalten in 48 Stunden. KI-Avatare, Erklärvideos und Produktvideos automatisiert.">', de_head, flags=re.DOTALL)
    de_head = re.sub(r'<meta name="twitter:description"\s*content=".*?">', '<meta name="twitter:description"\n        content="Generieren Sie 365 Tage an KI-Videoinhalten in 48 Stunden. KI-Avatare, Erklärvideos und Produktvideos automatisiert.">', de_head, flags=re.DOTALL)
    
    # CSS/Favicon path adjustments since this is in /de/
    de_head = de_head.replace('href="./dist/css/output.css"', 'href="../dist/css/output.css"')
    de_head = de_head.replace('href="./favicon', 'href="../favicon')
    
    # Schema.org translation
    de_head = de_head.replace('"name": "Video Content Engine"', '"name": "Engine für Videoinhalte"')
    de_head = de_head.replace('"description": "AI-powered video production delivering 365 days of video content in 48 hours with automated scheduling."', '"description": "KI-gestützte Videoproduktion, die Videocontent für 365 Tage in 48 Stunden liefert, inklusive automatisierter Veröffentlichung."')

    # Main content translation
    main_start = en_content.find('<!-- Video Content Engine Hero -->')
    main_end = en_content.find('<!-- Footer -->')
    main_content = en_content[main_start:main_end]

    # Translate Hero
    main_content = main_content.replace('AI-Powered • 48-Hour Delivery', 'KI-gesteuert • 48-Stunden-Lieferung')
    main_content = main_content.replace('365 Days of Video<br>', '365 Tage an Videos<br>')
    main_content = main_content.replace('<span class="text-error">Delivered in 48 Hours</span>', '<span class="text-error">Geliefert in 48 Stunden</span>')
    main_content = main_content.replace(
        'Get a full year of AI-generated video content—explainers, shorts, and demos—scheduled and ready\n                        to\n                        publish automatically. No filming. No editing. Just results.',
        'Erhalten Sie ein ganzes Jahr an KI-generiertem Videocontent – Erklärvideos, Shorts und Demos – fertig geplant zur automatischen Veröffentlichung. Kein Filmen. Kein Bearbeiten. Einfach Ergebnisse.'
    )
    main_content = main_content.replace('What You Get:', 'Was Sie erhalten:')
    main_content = main_content.replace('<strong class="text-base-content">365 AI-generated videos</strong> (30-90 seconds,\n                                    optimized for each platform)', '<strong class="text-base-content">365 KI-generierte Videos</strong> (30-90 Sekunden, optimiert für jede Plattform)')
    main_content = main_content.replace('<strong class="text-base-content">Pre-scheduled posting</strong> to YouTube,\n                                    TikTok,\n                                    LinkedIn, or Instagram', '<strong class="text-base-content">Vorgeplante Veröffentlichung</strong> auf YouTube, TikTok, LinkedIn oder Instagram')
    main_content = main_content.replace('<strong class="text-base-content">Delivered in 48 hours</strong>—your video\n                                    pipeline\n                                    runs on autopilot', '<strong class="text-base-content">Geliefert in 48 Stunden</strong> – Ihre Video-Pipeline läuft auf Autopilot')
    main_content = main_content.replace('View Packages', 'Pakete ansehen')
    main_content = main_content.replace('How It Works', 'Wie es funktioniert')

    # Calendar Translate
    main_content = main_content.replace('Your Year-Long Video Calendar', 'Ihr ganzjähriger Video-Kalender')
    main_content = main_content.replace('Every video is pre-scheduled. Your channels\n                    stay\n                    active.', 'Jedes Video ist vorgeplant. Ihre Kanäle bleiben aktiv.')
    main_content = main_content.replace('Jan 15', '15. Jan')
    main_content = main_content.replace('9:00 AM', '09:00 Uhr')
    main_content = main_content.replace('Product Demo: AI Features Walkthrough (60s)', 'Produkt-Demo: KI-Funktionen Übersicht (60s)')
    main_content = main_content.replace('YouTube • LinkedIn • Auto-Published', 'YouTube • LinkedIn • Auto-Veröffentlicht')
    main_content = main_content.replace('✓ Scheduled', '✓ Geplant')

    main_content = main_content.replace('Jan 16', '16. Jan')
    main_content = main_content.replace('Customer Testimonial Short (30s)', 'Kunden-Testimonial Short (30s)')
    main_content = main_content.replace('TikTok • Instagram Reels • Auto-Published', 'TikTok • Instagram Reels • Auto-Veröffentlicht')

    main_content = main_content.replace('Jan 17', '17. Jan')
    main_content = main_content.replace('Industry Tip: 3 Ways to Automate Sales (45s)', 'Branchen-Tipp: 3 Wege zur Vertriebsautomatisierung (45s)')
    main_content = main_content.replace('LinkedIn • YouTube Shorts • Auto-Published', 'LinkedIn • YouTube Shorts • Auto-Veröffentlicht')

    main_content = main_content.replace('+ 362 more videos scheduled through Dec 31, 2026', '+ 362 weitere Videos geplant bis 31. Dez 2026')

    # How it works Translate
    main_content = main_content.replace('Fully Automated Video Pipeline', 'Vollautomatisierte Video-Pipeline')
    main_content = main_content.replace('Our AI video team generates, schedules, and\n                    delivers a full year of content in one go.', 'Unser KI-Videoteam erstellt, plant und liefert ein ganzes Jahr an Inhalten auf einmal.')
    
    main_content = main_content.replace('Define Your Video Topics', 'Definieren Sie Ihre Videothemen')
    main_content = main_content.replace('Tell us your product, key messages, and target platforms. We\n                        configure\n                        the AI.', 'Nennen Sie uns Ihr Produkt, Kernbotschaften und Zielplattformen. Wir konfigurieren die KI.')
    main_content = main_content.replace('AI Produces 365 Videos', 'KI produziert 365 Videos')
    main_content = main_content.replace('Our system creates a year\'s worth of AI avatar videos and motion\n                        graphics in 48 hours.', 'Unser System erstellt KI-Avatar-Videos und Motion Graphics für ein ganzes Jahr in 48 Stunden.')
    main_content = main_content.replace('Auto-Scheduled Publishing', 'Automatisiert geplante Veröffentlichung')
    main_content = main_content.replace('Videos are pre-loaded to your channels and publish automatically,\n                        daily.', 'Die Videos werden auf Ihre Kanäle geladen und täglich automatisch veröffentlicht.')

    # Packages Translate
    main_content = main_content.replace('Choose Your Package', 'Wählen Sie Ihr Paket')
    main_content = main_content.replace('Video Packages', 'Video-Pakete')
    main_content = main_content.replace('Select the volume that matches your video\n                    marketing goals. One-time payment — videos delivered in 48 hours.', 'Wählen Sie das Volumen, das zu Ihren Video-Marketing-Zielen passt. Einmalige Zahlung — Videos geliefert in 48 Stunden.')

    main_content = main_content.replace('STARTER', 'STARTER')
    main_content = main_content.replace('90 Videos', '90 Videos')
    main_content = main_content.replace('Quarterly Videos', 'Vierteljährliche Videos')
    main_content = main_content.replace('one-time', 'einmalig')
    
    main_content = main_content.replace('90 AI-Generated Videos', '90 KI-generierte Videos')
    main_content = main_content.replace('AI Avatar + Motion Graphics', 'KI-Avatar + Motion Graphics')
    
    main_content = main_content.replace('180 Videos', '180 Videos')
    main_content = main_content.replace('Semi-Annual Videos', 'Halbjährliche Videos')
    main_content = main_content.replace('180 AI-Generated Videos', '180 KI-generierte Videos')
    main_content = main_content.replace('Priority Support', 'Bevorzugter Support')
    main_content = main_content.replace('POPULAR', 'BELIEBT')
    main_content = main_content.replace('GROWTH', 'WACHSTUM')

    main_content = main_content.replace('365 Videos', '365 Videos')
    main_content = main_content.replace('Full Year Videos', 'Ganzjährige Videos')
    main_content = main_content.replace('PRO', 'PRO')
    main_content = main_content.replace('365 AI-Generated Videos', '365 KI-generierte Videos')
    main_content = main_content.replace('Custom Avatar Voice', 'Individuelle Avatar-Stimme')

    main_content = main_content.replace('ENTERPRISE', 'ENTERPRISE')
    main_content = main_content.replace('730 Videos', '730 Videos')
    main_content = main_content.replace('2-Year Videos', '2-Jahres-Videos')
    main_content = main_content.replace('730 AI-Generated Videos', '730 KI-generierte Videos')
    main_content = main_content.replace('Dedicated Video Producer', 'Dedizierter Videoproduzent')
    main_content = main_content.replace('Unlimited Revisions', 'Unbegrenzte Revisionen')
    main_content = main_content.replace('48-Hour Delivery', '48-Stunden-Lieferung')

    main_content = main_content.replace('Get Started', 'Loslegen')

    # FAQ Translate
    main_content = main_content.replace('Frequently Asked Questions', 'Häufig gestellte Fragen')
    
    main_content = main_content.replace('What is an AI avatar video?', 'Was ist ein KI-Avatar-Video?')
    main_content = main_content.replace('An AI avatar is a digital presenter that speaks your script. It looks and sounds like a real\n                        person, but it\'s generated entirely by AI. No filming, no actors, no studio needed.', 'Ein KI-Avatar ist ein digitaler Präsentator, der Ihr Skript spricht. Er sieht aus und klingt wie eine echte Person, wird aber vollständig von einer KI generiert. Kein Filmen, keine Schauspieler, kein Studio erforderlich.')

    main_content = main_content.replace('Can I use my own voice or face?', 'Kann ich meine eigene Stimme oder mein eigenes Gesicht verwenden?')
    main_content = main_content.replace('Yes! Pro and Enterprise plans include custom avatar creation. We can clone your voice and create\n                        a digital twin of you (with your permission, of course).', 'Ja! Pro- und Enterprise-Pläne beinhalten die Erstellung benutzerdefinierter Avatare. Wir können Ihre Stimme klonen und einen digitalen Zwilling von Ihnen erstellen (natürlich mit Ihrer Erlaubnis).')

    main_content = main_content.replace('What video platforms do you support?', 'Welche Videoplattformen unterstützen Sie?')
    main_content = main_content.replace('We support YouTube, TikTok, Instagram Reels, LinkedIn, and Facebook. Videos are optimized for\n                        each platform\'s format (vertical, square, or horizontal).', 'Wir unterstützen YouTube, TikTok, Instagram Reels, LinkedIn und Facebook. Videos werden für das Format jeder Plattform optimiert (vertikal, quadratisch oder horizontal).')

    main_content = main_content.replace('Can I edit the videos after delivery?', 'Kann ich die Videos nach der Lieferung bearbeiten?')
    main_content = main_content.replace('Yes. All videos are delivered in MP4 format with editable project files (if requested). You can\n                        tweak text, music, or visuals anytime.', 'Ja. Alle Videos werden im MP4-Format mit bearbeitbaren Projektdateien (auf Anfrage) geliefert. Sie können Text, Musik oder visuelle Elemente jederzeit anpassen.')

    main_content = main_content.replace('Do I own the videos?', 'Gehören mir die Videos?')
    main_content = main_content.replace('Yes. You have full commercial rights to all videos. Use them forever, repurpose them, or even\n                        resell them if you want.', 'Ja. Sie haben die vollen kommerziellen Rechte an allen Videos. Nutzen Sie diese für immer, verwenden Sie sie neu oder verkaufen Sie sie sogar weiter, wenn Sie möchten.')

    main_content = main_content.replace('contact.html', 'contact.html')

    # Fix document structure
    de_head = '<!DOCTYPE html>\n<html lang="de" data-theme="bumblebee">\n\n<head>' + de_head.split('<head>')[1]
    
    final_output = de_head + '<body>\n' + de_nav + '\n' + main_content + '\n' + de_footer

    with open('/Users/busraocak/expandia/de/video-content-engine.html', 'w', encoding='utf-8') as f:
        f.write(final_output)
    
    print("Generation complete")

if __name__ == '__main__':
    main()
