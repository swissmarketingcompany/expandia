import re
import os

def translate_content(content):
    # Mapping of English phrases to German for cold calling page
    translations = {
        'Cold Calling Services | B2B Appointment Setting & Telesales | Go Expandia': 'Kaltakquise-Dienste | B2B Terminvereinbarung & Telesales | Go Expandia',
        'Professional cold calling services to reach decision-makers. We provide expert SDRs, custom scripts, and objection handling to book qualified meetings for your sales team.': 'Professionelle Kaltakquise-Dienste, um Entscheidungsträger zu erreichen. Wir bieten erfahrene SDRs, maßgeschneiderte Skripte und Einwandbehandlung, um qualifizierte Termine für Ihr Vertriebsteam zu buchen.',
        'cold calling services, b2b telemarketing, appointment setting, telesales agency, outbound sales calls, SDR outsourcing, lead generation calling, cold calling europe, cold calling usa': 'Kaltakquise-Dienste, B2B Telemarketing, Terminvereinbarung, Telesales-Agentur, Outbound-Sales-Calls, SDR-Outsourcing, Lead-Generierung Telefonate, Kaltakquise Europa, Kaltakquise USA',
        'Direct Conversations.': 'Direkte Gespräche.',
        'Qualified Meetings.': 'Qualifizierte Termine.',
        'Professional Cold Calling Services': 'Professionelle Kaltakquise-Dienste',
        'Stop relying on passive channels. Our expert SDRs reach decision-makers directly to book': 'Verlassen Sie sich nicht mehr auf passive Kanäle. Unsere erfahrenen SDRs erreichen Entscheidungsträger direkt, um',
        'high-quality appointments': 'hochwertige Termine',
        'tailored to your B2B sales goals.': 'individuell auf Ihre B2B-Vertriebsziele zugeschnitten.',
        'Start Booking Meetings': 'Termine buchen',
        'How It Works': 'Wie es funktioniert',
        'Speakers Available': 'Muttersprachler verfügbar',
        'Custom': 'Individuell',
        'Scripts & Strategy': 'Skripte & Strategie',
        'Full Integration': 'Vollständige Integration',
        'Meeting Booked': 'Termin gebucht',
        '1 hour ago': 'vor 1 Stunde',
        '32 min ago': 'vor 32 Min.',
        '12 min ago': 'vor 12 Min.',
        'Just now': 'Gerade eben',
        'VP of Engineering': 'VP of Engineering',
        'Head of Sales': 'Vertriebsleiter',
        'CTO': 'CTO',
        'Decision Maker': 'Entscheidungsträger',
        'Qualified': 'Qualifiziert',
        'Why Smart Companies Still Cold Call': 'Warum kluge Unternehmen immer noch Kaltakquise betreiben',
        'In a world of digital noise, a direct phone call is a powerful differentiator. It cuts through the clutter and gets immediate attention.': 'In einer Welt voll digitalem Rauschen ist ein direkter Telefonanruf ein starkes Unterscheidungsmerkmal. Er durchbricht die Masse und erregt sofortige Aufmerksamkeit.',
        'Immediate Feedback': 'Sofortiges Feedback',
        'Stop guessing if they opened your email. Get instant "yes," "no," or "not now" answers and objection clarity.': 'Hören Sie auf zu raten, ob Ihre E-Mail geöffnet wurde. Erhalten Sie sofortige Antworten wie „Ja“, „Nein“ oder „Nicht jetzt“ und Klarheit über Einwände.',
        'Human Connection': 'Menschliche Bindung',
        'Build rapport instantly. Tone, empathy, and active listening build trust faster than any text-based channel.': 'Bauen Sie sofort eine Beziehung auf. Tonfall, Empathie und aktives Zuhören schaffen schneller Vertrauen als jeder textbasierte Kanal.',
        'High Scalability': 'Hohe Skalierbarkeit',
        'Quickly ramp up your outbound efforts without the overhead of hiring and training internal SDR teams.': 'Steigern Sie schnell Ihre Outbound-Bemühungen ohne den Aufwand für die Einstellung und Schulung interner SDR-Teams.',
        'Our 4-Step Appointment Setting Process': 'Unser 4-Schritte-Terminvereinbarungsprozess',
        'We don\'t just dial numbers; we execute a strategic sequence designed to turn strangers into interested prospects.': 'Wir wählen nicht einfach nur Nummern; wir führen eine strategische Sequenz aus, um Fremde in interessierte Interessenten zu verwandeln.',
        'Strategy & ICP Definition': 'Strategie & ICP-Definition',
        'We align on your Ideal Customer Profile, value proposition, and specific campaign goals.': 'Wir stimmen uns auf Ihr ideales Kundenprofil, Ihr Wertversprechen und Ihre spezifischen Kampagnenziele ab.',
        'Scripting & Training': 'Skripterstellung & Training',
        'Our team develops custom objection-handling frameworks and undergoes intensive training on your product.': 'Unser Team entwickelt maßgeschneiderte Einwandbehandlungs-Frameworks und durchläuft intensive Schulungen zu Ihrem Produkt.',
        'Outreach & Execution': 'Ansprache & Ausführung',
        'Multi-touch calling campaigns begin, integrated with your CRM for full transparency.': 'Multi-Touch-Anruf-Kampagnen beginnen, integriert in Ihr CRM für volle Transparenz.',
        'Qualified Hand-off': 'Qualifizierte Übergabe',
        'Confirmed meetings are placed directly on your sales team\'s calendar with full call notes.': 'Bestätigte Termine werden mit vollständigen Gesprächsnotizen direkt in den Kalender Ihres Vertriebsteams eingetragen.',
        'Inside Our SDR Team': 'Einblick in unser SDR-Team',
        'Expert Communicators': 'Kommunikationsexperten',
        'Our SDRs are business-literate professionals who understand complex B2B sales cycles.': 'Unsere SDRs sind business-versierte Profis, die komplexe B2B-Vertriebszyklen verstehen.',
        'Global Reach': 'Globale Reichweite',
        'Our team supports campaigns in': 'Unser Team unterstützt Kampagnen in',
        'and more, ensuring cultural and linguistic alignment.': 'und mehr, um kulturelle und sprachliche Abstimmung zu gewährleisten.',
        'Transparent Reporting': 'Transparente Berichterstattung',
        'Access real-time dashboards showing call volume, connection rates, and booked meetings.': 'Greifen Sie auf Echtzeit-Dashboards zu, die Anrufvolumen, Verbindungsraten und gebuchte Termine anzeigen.',
        'Häufig gestellte Fragen': 'Häufig gestellte Fragen',
        'Get answers to common questions about our cold calling and appointment setting services.': 'Erhalten Sie Antworten auf häufige Fragen zu unseren Kaltakquise- und Terminvereinbarungs-Diensten.',
        'Is cold calling still effective for B2B sales?': 'Ist Kaltakquise für den B2B-Vertrieb noch effektiv?',
        'Yes, absolutely. Modern cold calling is highly effective when done correctly. It\'s not about random dialing; it\'s about targeted outreach to decision-makers with a relevant value proposition. It remains one of the fastest ways to get direct feedback and book meetings with high-value prospects.': 'Ja, absolut. Moderne Kaltakquise ist hochwirksam, wenn sie richtig durchgeführt wird. Es geht nicht um wahlloses Wählen; es geht um gezielte Ansprache von Entscheidungsträgern mit einem relevanten Wertversprechen. Es bleibt einer der schnellsten Wege, um direktes Feedback zu erhalten und Termine mit hochwertigen Interessenten zu buchen.',
        'Do you provide the lead lists for cold calling?': 'Stellen Sie die Lead-Listen für die Kaltakquise zur Verfügung?',
        'Yes, we can build custom, verified lead lists based on your Ideal Customer Profile (ICP). We use premium data sources to ensure high accuracy of phone numbers and direct dials. Alternatively, we can also work with lists you provide if they meet our quality standards.': 'Ja, wir können maßgeschneiderte, verifizierte Lead-Listen basierend auf Ihrem idealen Kundenprofil (ICP) erstellen. Wir nutzen Premium-Datenquellen, um eine hohe Genauigkeit von Telefonnummern und Direktwahlen zu gewährleisten. Alternativ können wir auch mit Listen arbeiten, die Sie uns zur Verfügung stellen, sofern diese unseren Qualitätsstandards entsprechen.',
        'What languages do your SDRs speak?': 'Welche Sprachen sprechen Ihre SDRs?',
        'Our team includes native and fluent speakers for key markets, including English (US/UK), German (DACH region), French, and Turkish. We also have specialized capabilities for Central and Eastern Europe (CEE) and the Gulf countries. We support worldwide campaigns without limitations, ensuring professional communication across all major global markets.': 'Unser Team besteht aus Muttersprachlern und fließend sprechenden SDRs für Schlüsselmärkte, darunter Englisch (USA/UK), Deutsch (DACH-Region), Französisch und Türkisch. Wir verfügen außerdem über spezialisierte Kapazitäten für Mittel- und Osteuropa (CEE) und die Golfstaaten. Wir unterstützen weltweite Kampagnen ohne Einschränkungen und gewährleisten eine professionelle Kommunikation in allen wichtigen globalen Märkten.',
        'How do you handle objections during calls?': 'Wie gehen Sie mit Einwänden bei Telefonaten um?',
        'Our SDRs are trained in advanced objection handling. We don\'t just read scripts; we have real business conversations. We work with you to identify common objections in your industry and develop strategic responses to pivot the conversation back to value and booking a meeting.': 'Unsere SDRs sind in fortgeschrittener Einwandbehandlung geschult. Wir lesen nicht einfach nur Skripte vor; wir führen echte Geschäftsgespräche. Wir arbeiten mit Ihnen zusammen, um häufige Einwände in Ihrer Branche zu identifizieren und strategische Antworten zu entwickeln, um das Gespräch wieder auf den Wert und die Buchung eines Termins zu lenken.',
        'Stop guessing and start talking to your future customers.': 'Hören Sie auf zu raten und fangen Sie an, mit Ihren zukünftigen Kunden zu sprechen.',
        'Book Your Discovery Call': 'Beratungsgespräch buchen',
        'B2B Cold Calling Services': 'B2B Kaltakquise-Dienste',
        'Professional B2B cold calling and appointment setting services to reach decision-makers and generate qualified leads.': 'Professionelle B2B Kaltakquise- und Terminvereinbarungs-Dienste, um Entscheidungsträger zu erreichen und qualifizierte Leads zu generieren.',
        'Appointment Setting': 'Terminvereinbarung',
        'Lead Qualification': 'Lead-Qualifizierung',
        'Outbound Sales Services': 'Outbound-Vertriebsdienste',
        'English (US/UK)': 'Englisch (USA/UK)',
        'German (DACH)': 'Deutsch (DACH)',
        'French': 'Französisch',
        'Turkish': 'Türkisch',
        'Spanish': 'Spanisch',
        'Italian': 'Italienisch'
    }

    translated_content = content
    for en, de in translations.items():
        translated_content = translated_content.replace(en, de)
    
    return translated_content

def main():
    # 1. Read sources
    with open('/Users/busraocak/expandia/cold-calling-services.html', 'r', encoding='utf-8') as f:
        en_content = f.read()
    
    with open('/Users/busraocak/expandia/de/index.html', 'r', encoding='utf-8') as f:
        de_index = f.read()

    # 2. Extract Header from de/index.html
    header_match = re.search(r'(<nav.*?</nav>)', de_index, re.DOTALL)
    de_header = header_match.group(1) if header_match else ""
    
    # Update language switcher in header for this specific page
    de_header = de_header.replace(
        '<li><a href="../index.html" data-lang="en" class="lang-switch text-sm">🇺🇸 English</a>',
        '<li><a href="../cold-calling-services.html" data-lang="en" class="lang-switch text-sm">🇺🇸 English</a>'
    )
    de_header = de_header.replace(
        '<li><a href="./index.html" data-lang="de" class="lang-switch text-sm active">🇩🇪 Deutsch</a>',
        '<li><a href="./cold-calling-services.html" data-lang="de" class="lang-switch text-sm active">🇩🇪 Deutsch</a>'
    )
    de_header = de_header.replace(
        '<li><a href="../fr/index.html" data-lang="fr" class="lang-switch text-sm">🇫🇷 Français</a>',
        '<li><a href="../fr/cold-calling-services.html" data-lang="fr" class="lang-switch text-sm">🇫🇷 Français</a>'
    )

    # 3. Extract Footer from de/index.html (to keep it consistent)
    footer_match = re.search(r'(<footer.*?</footer>)', de_index, re.DOTALL)
    de_footer = footer_match.group(1) if footer_match else ""

    # 4. Extract Main Content from English page
    # Extract everything between </nav> and <footer>
    main_content_match = re.search(r'</nav>(.*?)<footer', en_content, re.DOTALL)
    main_content = main_content_match.group(1) if main_content_match else ""

    # 5. Translate Main Content
    translated_main = translate_content(main_content)
    
    # Fix asset paths in main content
    translated_main = translated_main.replace('./dist/', '../dist/')
    translated_main = translated_main.replace('./go-expandia-logo.png', '../go-expandia-logo.png')
    translated_main = translated_main.replace('href="./index.html"', 'href="./index.html"') # stays same if in same dir
    translated_main = translated_main.replace('href="./contact.html"', 'href="./contact.html"')

    # 6. Extract and Translate Head from English
    head_match = re.search(r'(<head>.*?</head>)', en_content, re.DOTALL)
    head_content = head_match.group(1) if head_match else ""
    translated_head = translate_content(head_content)
    
    # Update paths in head
    translated_head = translated_head.replace('./dist/', '../dist/')
    translated_head = translated_head.replace('./favicon', '../favicon')
    
    # Update Canonical and Hreflang in head
    translated_head = re.sub(r'<link rel="canonical" href=".*?">', '<link rel="canonical" href="https://www.goexpandia.com/de/cold-calling-services.html">', translated_head)
    
    # Update og:url
    translated_head = re.sub(r'<meta property="og:url" content=".*?">', '<meta property="og:url" content="https://www.goexpandia.com/de/cold-calling-services.html">', translated_head)

    # 7. Assemble Page
    final_html = f"""<!DOCTYPE html>
<html lang="de" data-theme="bumblebee">
{translated_head}
<body class="font-sans">
{de_header}
{translated_main}
{de_footer}
    <script src="../dist/js/contact.js"></script>
    <script src="../dist/js/index.js"></script>
    <!--Start of Tawk.to Script-->
    <script type="text/javascript">
        var Tawk_API = Tawk_API || {{}}, Tawk_LoadStart = new Date();
        (function () {{
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/6911e3f950ba1a195e0a2c28/1j9mu527m';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        }})();
    </script>
    <!--End of Tawk.to Script-->

    <!-- Lucide Icons & Vivus Init -->
    <script>
        lucide.createIcons();

        // Initialize Vivus on hover for all Lucide icons
        document.addEventListener('DOMContentLoaded', function () {{
            setTimeout(function () {{
                const icons = document.querySelectorAll('.lucide');
                icons.forEach(icon => {{
                    if (icon.tagName.toLowerCase() === 'svg') {{
                        icon.parentElement.addEventListener('mouseenter', () => {{
                            new Vivus(icon, {{
                                duration: 50,
                                type: 'oneByOne',
                                start: 'autostart',
                                animTimingFunction: Vivus.EASE
                            }});
                        }});

                        if (icon.closest('.buzz-card')) {{
                            new Vivus(icon, {{
                                duration: 100,
                                type: 'oneByOne',
                                start: 'autostart'
                            }});
                        }}
                    }}
                }});
            }}, 100);
        }});
    </script>
</body>
</html>"""

    # 8. Write file
    with open('/Users/busraocak/expandia/de/cold-calling-services.html', 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    print("Successfully generated de/cold-calling-services.html")

if __name__ == "__main__":
    main()
