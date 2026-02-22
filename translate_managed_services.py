import re
import os

def translate_content(content):
    translations = {
        'Managed Services | Sales Operations, IT & Outreach | Go Expandia': 'Managed Services | Vertriebs-Operations, IT & Outreach | Go Expandia',
        'Expert Managed Services for Sales Operations, IT Infrastructure, and Outreach Software. Scale your business with dedicated teams and technical expertise.': 'Experten-Managed-Services für Vertriebs-Operations, IT-Infrastruktur und Outreach-Software. Skalieren Sie Ihr Geschäft mit engagierten Teams und technischem Fachwissen.',
        'Managed Services, Sales Operations, IT Consulting, Outreach Software Management, B2B Lead Generation, RevOps, IT Support, Go Expandia': 'Managed Services, Vertriebs-Operations, IT-Beratung, Outreach-Software-Verwaltung, B2B-Lead-Generierung, RevOps, IT-Support, Go Expandia',
        'Managed Services': 'Managed Services',
        'Your Extended Team for Sales & IT': 'Ihr erweitertes Team für Vertrieb & IT',
        'From sales operations to IT infrastructure, our managed services give you expert teams without the overhead of full-time hires.': 'Von Vertriebsoperationen bis hin zur IT-Infrastruktur – unsere Managed Services bieten Ihnen Expertenteams ohne den Aufwand für Vollzeit-Einstellungen.',
        'Our Managed Services': 'Unsere Managed Services',
        'Professional teams managing your critical operations so you can focus on growth.': 'Professionelle Teams, die Ihre kritischen Abläufe verwalten, damit Sie sich auf das Wachstum konzentrieren können.',
        'Managed Sales Operations': 'Verwaltete Vertriebs-Operations',
        'Complete sales operations management including lead generation, appointment setting, CRM management, and sales enablement to drive consistent revenue growth and maximize your team\'s efficiency.': 'Vollständiges Vertriebs-Operations-Management, einschließlich Lead-Generierung, Terminvereinbarung, CRM-Management und Sales Enablement, um ein konsistentes Umsatzwachstum voranzutreiben und die Effizienz Ihres Teams zu maximieren.',
        'Dedicated sales development team': 'Engagiertes Vertriebsentwicklungsteam',
        'Full CRM and tech stack management': 'Vollständiges CRM- und Tech-Stack-Management',
        'Performance reporting and optimization': 'Leistungsberichterstattung und Optimierung',
        'Managed IT Services': 'Betreute IT-Dienste',
        '24/7 IT support, infrastructure management, cybersecurity, and cloud services for growing businesses, ensuring your operations run smoothly, securely, and without interruption.': 'IT-Support rund um die Uhr, Infrastrukturmanagement, Cybersicherheit und Cloud-Dienste für wachsende Unternehmen, um sicherzustellen, dass Ihre Abläufe reibungslos, sicher und ohne Unterbrechung ablaufen.',
        '24/7 helpdesk and technical support': '24/7 Helpdesk und technischer Support',
        'Proactive monitoring and maintenance': 'Proaktive Überwachung und Wartung',
        'Security and compliance management': 'Sicherheits- und Compliance-Management',
        'Outreach Software Management': 'Outreach-Software-Verwaltung',
        'Expert management of your sales tech stack — Lemlist, Instantly, Apollo, and more. We optimize deliverability, automation, and integrations.': 'Expertenmanagement Ihres Sales-Tech-Stacks – Lemlist, Instantly, Apollo und mehr. Wir optimieren Zustellbarkeit, Automatisierung und Integrationen.',
        'DNS, SPF, DKIM & DMARC configuration': 'DNS, SPF, DKIM & DMARC Konfiguration',
        'Email warmup & deliverability optimization': 'E-Mail-Aufwärmphase & Zustellbarkeitsoptimierung',
        'Campaign architecture & A/B testing': 'Kampagnenarchitektur & A/B-Tests',
        'Why Choose Managed Services?': 'Warum Managed Services wählen?',
        'Get enterprise-level capabilities without enterprise-level costs.': 'Erhalten Sie Funktionen auf Unternehmensebene ohne Kosten auf Unternehmensebene.',
        'Lower cost vs. full-time hires': 'Niedrigere Kosten im Vergleich zu Vollzeit-Einstellungen',
        'Continuous support and monitoring': 'Fortlaufender Support und Überwachung',
        'Average setup time': 'Durchschnittliche Einrichtungszeit',
        'Scalable as you grow': 'Skalierbar mit Ihrem Wachstum',
        'Ready to Outsource Your Operations?': 'Bereit, Ihr operatives Geschäft auszulagern?',
        'Let our expert teams handle your sales, IT, and operations so you can focus on strategy and growth.': 'Lassen Sie unsere Expertenteams Ihren Vertrieb, Ihre IT und Ihren Betrieb übernehmen, damit Sie sich auf Strategie und Wachstum konzentrieren können.',
        'Schedule a Consultation': 'Beratungsgespräch vereinbaren',
        'Get Started': 'Loslegen',
        'View Services': 'Dienste ansehen',
        'Learn More': 'Mehr erfahren',
        'Home': 'Startseite'
    }

    # Replace simple strings
    for en, de in translations.items():
        content = content.replace(f'>{en}<', f'>{de}<')
        content = content.replace(f'"{en}"', f'"{de}"')
        content = content.replace(f'content="{en}"', f'content="{de}"')

    # Specific replacements for meta tags that might have different spacing or context
    content = content.replace(
        '<meta property="og:description"\n        content="Expert Managed Services for Sales Operations, IT Infrastructure, and Outreach Software. Scale your business with dedicated teams and technical expertise.">',
        '<meta property="og:description"\n        content="Experten-Managed-Services für Vertriebs-Operations, IT-Infrastruktur und Outreach-Software. Skalieren Sie Ihr Geschäft mit engagierten Teams und technischem Fachwissen.">'
    )
    content = content.replace(
       '<meta name="twitter:description"\n        content="Expert Managed Services for Sales Operations, IT Infrastructure, and Outreach Software. Scale your business with dedicated teams and technical expertise.">',
       '<meta name="twitter:description"\n        content="Experten-Managed-Services für Vertriebs-Operations, IT-Infrastruktur und Outreach-Software. Skalieren Sie Ihr Geschäft mit engagierten Teams und technischem Fachwissen.">'
    )

    return content

def main():
    with open('managed-services.html', 'r', encoding='utf-8') as f:
        en_content = f.read()

    with open('de/index.html', 'r', encoding='utf-8') as f:
        de_index = f.read()

    # Extract German header
    header_match = re.search(r'(<nav.*?</nav>)', de_index, re.DOTALL)
    de_header = header_match.group(1) if header_match else ""

    # Extract German footer
    footer_match = re.search(r'(<footer.*?>.*?</footer>)', de_index, re.DOTALL)
    de_footer = footer_match.group(1) if footer_match else ""

    # Translate the main content area (between nav and footer)
    body_match = re.search(r'</nav>(.*?)<footer', en_content, re.DOTALL)
    if body_match:
        en_body = body_match.group(1)
        de_body = translate_content(en_body)
    else:
        de_body = ""

    # Translate the head section for meta tags
    head_match = re.search(r'(<head>.*?</head>)', en_content, re.DOTALL)
    if head_match:
        en_head = head_match.group(1)
        de_head = translate_content(en_head)
        # Fix paths in head
        de_head = de_head.replace('href="./', 'href="../')
        de_head = de_head.replace('src="./', 'src="../')
        # Update canonical
        de_head = de_head.replace('https://www.goexpandia.com/managed-services.html', 'https://www.goexpandia.com/de/managed-services.html')
    else:
        de_head = ""

    # Prepare De Header and Footer (fix paths if needed, but they should be correct from de/index.html)
    # Actually, de/index.html uses relative paths like "./index.html" but we are in "de/" folder.
    # So "de/index.html" paths are relative to "de/".
    # Wait, let's check de/index.html paths for logo and css.
    # line 111: <img src="../go-expandia-logo.png" ...> (Correct)
    # line 43: <link href="../dist/css/output.css" ...> (Correct)
    
    # Update language switcher in de_header
    de_header = de_header.replace('<li><a href="../index.html" data-lang="en"', '<li><a href="../managed-services.html" data-lang="en"')
    de_header = de_header.replace('<li><a href="./index.html" data-lang="de"', '<li><a href="./managed-services.html" data-lang="de"')
    de_header = de_header.replace('<li><a href="../fr/index.html" data-lang="fr"', '<li><a href="../fr/managed-services.html" data-lang="fr"')

    # Fix body asset paths
    de_body = de_body.replace('src="./', 'src="../')
    de_body = de_body.replace('href="./', 'href="../')
    # Special cases for links to other pages which should stay in de/
    de_body = de_body.replace('href="../contact.html"', 'href="./contact.html"')
    de_body = de_body.replace('href="../sales-development-agency.html"', 'href="./sales-development-agency.html"')
    de_body = de_body.replace('href="../managed-it-services.html"', 'href="./managed-it-services.html"')
    de_body = de_body.replace('href="../outreach-software-management.html"', 'href="./outreach-software-management.html"')

    # Construct final content
    final_content = f"""<!DOCTYPE html>
<html lang="de" data-theme="bumblebee">

{de_head}

<body class="font-sans">
{de_header}

{de_body}

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

    with open('de/managed-services.html', 'w', encoding='utf-8') as f:
        f.write(final_content)

if __name__ == '__main__':
    main()
