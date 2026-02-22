
import os
import re

def translate_content(content):
    # Mapping of exact phrases to their German equivalents
    # Using more robust matching that handles common HTML formatting variations
    
    replacements = [
        # Impact Card
        ("Strategic Introductions", "Strategische Vorstellungen"),
        ("Key Accounts Won", "Gewonnene Schlüsselkunden"),
        ("Proven Asset", "Bewährtes Asset"),
        ("Local Sales Channel", "Lokaler Vertriebskanal"),
        ("Expected Value (Annual)", "Erwarteter Wert (Jährlich)"),
        
        # Perfect For
        ("Perfect For", "Perfekt für"),
        ("Foreign Market Entrants", "Ausländische Markteinsteiger"),
        ("Companies needing to look \"local\" in a new country without opening a physical entity.", "Unternehmen, die in einem neuen Land „lokal“ wirken müssen, ohne eine physische Einheit zu eröffnen."),
        ("New Vertical Launches", "Einführung neuer Verticals"),
        ("Established companies testing a new industry without distracting their core sales team.", "Etablierte Unternehmen, die eine neue Branche testen, ohne ihr Kernvertriebsteam abzulenken."),
        ("Professional Services", "Professionelle Dienstleistungen"),
        ("Firms where \"trust\" and \"presence\" matter more than volume.", "Unternehmen, bei denen „Vertrauen“ und „Präsenz“ wichtiger sind als Volumen."),
        
        # Timeline
        ("Implementation Timeline", "Zeitplan der Implementierung"),
        ("Blueprint & Build (Week 1)", "Blueprint & Erstellung (Woche 1)"),
        ("We define the territory and build the \"Digital Office\" (Domains, Inboxes, LinkedIn profiles).", "Wir definieren das Gebiet und bauen das „digitale Büro“ auf (Domains, Postfächer, LinkedIn-Profile)."),
        ("Localization (Week 2)", "Lokalisierung (Woche 2)"),
        ("We adapt your materials. We don't say \"We are launching\"; we say \"We are expanding operations to [Region].\"", "Wir passen Ihre Materialien an. Wir sagen nicht „Wir starten“; wir sagen „Wir erweitern den Betrieb auf [Region].“"),
        ("Soft Launch (Week 3-4)", "Soft Launch (Woche 3-4)"),
        ("We begin \"Founder-Led\" outreach to gauge market temperature and secure early feedback meetings.", "Wir beginnen mit dem „Founder-Led“-Outreach, um die Markttemperatur zu prüfen und erste Feedback-Gespräche zu sichern."),
        ("Operations (Ongoing)", "Betrieb (Laufend)"),
        ("We run the territory. You just show up to the meetings we book. We handle the rest.", "Wir führen das Gebiet. Sie erscheinen einfach zu den von uns gebuchten Terminen. Wir kümmern uns um den Rest."),
        
        # Phases
        ("Digital Real Estate & Infrastructure", "Digitale Immobilien & Infrastruktur"),
        ("Creating the \"Virtual HQ\" so you look like a verified local entity.", "Erstellung des „virtuellen Hauptquartiers“, damit Sie wie ein verifizierter lokaler Rechtsträger wirken."),
        ("Local Domain Procurement", "Lokale Domain-Beschaffung"),
        ("Region-specific domains (.ch, .de, .co.uk) to bypass filters & build trust.", "Regionspezifische Domains (.ch, .de, .co.uk), um Filter zu umgehen und Vertrauen aufzubauen."),
        ("Workspace Structure", "Workspace-Struktur"),
        ("10 Google Workspaces (partners@, accounts@) for department verification.", "10 Google Workspaces (partners@, accounts@) zur Abteilungsverifizierung."),
        ("Local Presence", "Lokale Präsenz"),
        ("Local phone number provisioning and \"Virtual Office\" footprint.", "Bereitstellung lokaler Telefonnummern und „Virtual Office“-Präsenz."),
        ("Technical Compliance", "Technische Compliance"),
        ("Full DNS/DKIM/DMARC authentication for enterprise deliverability.", "Vollständige DNS/DKIM/DMARC-Authentifizierung für Enterprise-Zustellbarkeit."),
        
        ("Localization & Positioning", "Lokalisierung & Positionierung"),
        ("Translating your value proposition into the local commercial dialect.", "Übersetzung Ihres Wertversprechens in den lokalen kommerziellen Dialekt."),
        ("Competitor Mapping", "Wettbewerbsanalyse"),
        ("Analyzing incumbents to identify the specific market gap for your brand.", "Analyse etablierter Unternehmen, um die spezifische Marktlücke für Ihre Marke zu identifizieren."),
        ("Cultural Adaptation", "Kulturelle Anpassung"),
        ("Rewriting messaging for local business etiquette (localization, not translation).", "Umschreiben von Nachrichten für die lokale Geschäftsetikette (Lokalisierung, nicht Übersetzung)."),
        ("Persona Development", "Persona-Entwicklung"),
        ("Creating profiles for \"Regional Managers\" to appear as senior consultants.", "Erstellung von Profilen für „Regional Manager“, um als Senior-Berater aufzutreten."),
        ("Asset Localization", "Asset-Lokalisierung"),
        ("Adapting sales collateral and signatures for the target region.", "Anpassung von Vertriebsunterlagen und Signaturen für die Zielregion."),
        
        ("Territory Development", "Gebietsentwicklung"),
        ("Executing the go-to-market strategy. The Outreach.", "Ausführung der Go-to-Market-Strategie. Der Outreach."),
        ("Ecosystem Outreach", "Ökosystem-Outreach"),
        ("Campaigns targeting partners and multipliers, not just end-clients.", "Kampagnen, die auf Partner und Multiplikatoren abzielen, nicht nur auf Endkunden."),
        ("Email scripts + LinkedIn actions as a unified \"Business Development\" effort.", "E-Mail-Skripte + LinkedIn-Aktionen als gemeinsamer Aufwand für die „Geschäftsentwicklung“."),
        ("Handling all back-and-forth scheduling to book firm calendar slots.", "Abwicklung der gesamten Terminplanung, um feste Kalenderplätze zu buchen."),
        ("Weekly reports on market sentiment and product-market fit data.", "Wöchentliche Berichte über die Marktstimmung und Daten zum Product-Market-Fit."),
        
        # Hero & CTA
        ("Your Virtual Regional Office", "Ihr virtuelles Regionalbüro"),
        ("Market Foundation Program", "Markt-Grundlagen-Programm"),
        ("Establish a Credible Local Footprint from Day 1", "Bauen Sie vom ersten Tag an eine glaubwürdige lokale Präsenz auf"),
        ("Launch Your Region", "Starten Sie Ihre Region"),
        ("How It Works", "Wie es funktioniert"),
        ("Ready to Build Your Virtual HQ?", "Bereit, Ihr virtuelles Hauptquartier aufzubauen?"),
        ("Stop being a \"stranger\" in your target market. Let's establish your credible local footprint today.", "Hören Sie auf, ein „Fremder“ in Ihrem Zielmarkt zu sein. Lassen Sie uns noch heute Ihre glaubwürdige lokale Präsenz aufbauen."),
        ("Start Market Entry", "Markteintritt starten"),
        ("Explore All Programs", "Alle Programme erkunden"),
        ("Who This Is For", "Für wen das ist"),
        ("READ BEFORE PROCEEDING:", "VOR DEM FORTFAHREN LESEN:"),
        
        ("A comprehensive, 3-phase system designed to make you look like a native player from Day 1.", "Ein umfassendes 3-Phasen-System, das darauf ausgelegt ist, Sie vom ersten Tag an wie einen einheimischen Akteur wirken zu lassen."),
        ("What's Included", "Was ist enthalten"),
        ("Core Pillars", "Kernpfeiler")
    ]

    for en, de in replacements:
        # Simple string replacement first
        content = content.replace(en, de)
        
        # Also try replacing with potential whitespace/newline differences
        # Escaping and replacing spaces with \s+ pattern
        pattern = re.escape(en).replace(r'\ ', r'\s+')
        content = re.sub(pattern, de, content, flags=re.MULTILINE)

    # Hero paragraph specific fix (it's long and likely has newlines)
    hero_p_en = "We don't just send emails; we operate your local business development unit. We build the digital infrastructure and execute the territory development required to launch your brand in a new market."
    hero_p_de = "Wir versenden nicht nur E-Mails; wir betreiben Ihre lokale Geschäftsentwicklungseinheit. Wir bauen die digitale Infrastruktur auf und führen die Gebietsentwicklung durch, die für die Einführung Ihrer Marke in einem neuen Markt erforderlich ist."
    content = re.sub(re.escape(hero_p_en).replace(r'\ ', r'\s+'), hero_p_de, content, flags=re.DOTALL)

    return content

# Read source files
with open("/Users/busraocak/expandia/market-foundation-program.html", "r", encoding="utf-8") as f:
    en_page = f.read()

with open("/Users/busraocak/expandia/de/index.html", "r", encoding="utf-8") as f:
    de_index = f.read()

# Extract German Header & Footer
# Note: Using de/index.html which is already correct
german_header = re.search(r'<nav.*?</nav>', de_index, re.DOTALL).group(0)
german_footer = re.search(r'<footer.*?</footer>', de_index, re.DOTALL).group(0)

# Extract Content
content_match = re.search(r'</nav>(.*?)<footer', en_page, re.DOTALL)
english_content = content_match.group(1)
german_content = translate_content(english_content)

# Adjust relative paths
german_content = german_content.replace('href="contact.html"', 'href="./contact.html"')
german_content = german_content.replace('href="index.html"', 'href="./index.html"')
german_content = german_content.replace('href="growth-programs.html"', 'href="./growth-programs.html"')
german_content = german_content.replace('href="solutions.html"', 'href="./solutions.html"')

# Construct Meta
german_meta = """
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markt-Grundlagen-Programm | Go Expandia</title>
    <meta name="description" content="Perfekt für Unternehmen, die in neue Märkte eintreten. Bauen Sie Positionierung, Messaging und erste qualifizierte Termine auf.">
    <meta name="keywords" content="Markteintritt, B2B-Vertriebsprogramm, Lead-Generierung, Marktentwicklung">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Go Expandia">
    <link rel="canonical" href="https://www.goexpandia.com/de/market-foundation-program.html">
    <link rel="alternate" hreflang="en" href="https://www.goexpandia.com/market-foundation-program.html">
    <link rel="alternate" hreflang="tr" href="https://www.goexpandia.com/">
    <link rel="alternate" hreflang="de" href="https://www.goexpandia.com/de/market-foundation-program.html">
    <link rel="alternate" hreflang="fr" href="https://www.goexpandia.com/fr/market-foundation-program.html">
    <link rel="alternate" hreflang="x-default" href="https://www.goexpandia.com/market-foundation-program.html">
    <meta property="og:title" content="Markt-Grundlagen-Programm | Go Expandia">
    <meta property="og:description" content="Perfekt für Unternehmen, die in neue Märkte eintreten. Bauen Sie Positionierung, Messaging und erste qualifizierte Termine auf.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.goexpandia.com/de/market-foundation-program.html">
    <meta property="og:image" content="https://www.goexpandia.com/go-expandia-logo.png">
    <meta property="og:site_name" content="Go Expandia">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Markt-Grundlagen-Programm | Go Expandia">
    <meta name="twitter:description" content="Perfekt für Unternehmen, die in neue Märkte eintreten. Bauen Sie Positionierung, Messaging und erste qualifizierte Termine auf.">
    <meta name="twitter:image" content="https://www.goexpandia.com/go-expandia-logo.png">
"""

head = """
    <link href="../dist/css/output.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="icon" type="image/png" href="../favicon.png">
    <link rel="apple-touch-icon" href="../favicon.png">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XY2B6K4R6Q"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());
      gtag('config', 'G-XY2B6K4R6Q');
    </script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/vivus@latest/dist/vivus.min.js"></script>
"""

# Schema translation
schema_match = re.search(r'<script type="application/ld\+json">(.*?)</script>', en_page, re.DOTALL)
german_schema = translate_content(schema_match.group(1)) if schema_match else "[]"

html_template = """<!DOCTYPE html>
<html lang="de" data-theme="bumblebee">
<head>
{meta}
{head}
    <script type="application/ld+json">
{schema}
    </script>
    <style> .lucide {{ cursor: pointer; }} </style>
</head>
<body class="font-sans">
{header}
{content}
{footer}
  <script src="../dist/js/contact.js"></script>
  <script src="../dist/js/index.js"></script>
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
  <script>
    lucide.createIcons();
    document.addEventListener('DOMContentLoaded', function () {{
      setTimeout(function () {{
        const icons = document.querySelectorAll('.lucide');
        icons.forEach(icon => {{
          if (icon.tagName.toLowerCase() === 'svg') {{
            icon.parentElement.addEventListener('mouseenter', () => {{
              new Vivus(icon, {{ duration: 50, type: 'oneByOne', start: 'autostart', animTimingFunction: Vivus.EASE }});
            }});
            if (icon.closest('.buzz-card')) {{
              new Vivus(icon, {{ duration: 100, type: 'oneByOne', start: 'autostart' }});
            }}
          }}
        }});
      }}, 100);
    }});
  </script>
</body>
</html>
"""

final_html = html_template.format(
    meta=german_meta, head=head, schema=german_schema, 
    header=german_header, content=german_content, footer=german_footer
)

# Language icon fix in header
final_html = final_html.replace('🇺🇸\n                    <svg class="w-3 h-3"', '🇩🇪\n                    <svg class="w-3 h-3"')

# Link fixes in header
header_links = [
    ('../index.html" data-lang="en"', '../market-foundation-program.html" data-lang="en"'),
    ('./index.html" data-lang="de"', './market-foundation-program.html" data-lang="de"'),
    ('../fr/index.html" data-lang="fr"', '../fr/market-foundation-program.html" data-lang="fr"')
]
for old, new in header_links:
    final_html = final_html.replace(old, new)

with open("/Users/busraocak/expandia/de/market-foundation-program.html", "w", encoding="utf-8") as f:
    f.write(final_html)

print("German Market Foundation Program page created.")
