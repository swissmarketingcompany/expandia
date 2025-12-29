
/**
 * Simple Template Engine for Expandia
 */

function validateTemplateVariables(content, fileName) {
    const requiredVars = ['{{BASE_PATH}}', '{{LOGO_PATH}}', '{{NAVIGATION}}', '{{MAIN_CONTENT}}', '{{FOOTER}}', '{{PAGE_TITLE}}', '{{PAGE_DESCRIPTION}}', '{{PAGE_KEYWORDS}}'];
    const missingVars = [];

    for (const varName of requiredVars) {
        if (content.includes(varName)) {
            missingVars.push(varName);
        }
    }

    if (missingVars.length > 0) {
        console.warn(`⚠️  WARNING: ${fileName} contains unreplaced template variables: ${missingVars.join(', ')}`);
    }

    return missingVars.length === 0;
}

function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Expandia",
        "url": "https://www.expandia.ch",
        "logo": "https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png",
        "email": "hello@expandia.ch",
        "sameAs": [
            "https://www.linkedin.com/company/expandia-ch/"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+000-000-0000",
            "contactType": "sales",
            "areaServed": ["EU", "UK", "US", "MEA", "APAC"],
            "availableLanguage": ["en", "de", "tr"]
        }
    };
}

function generateBreadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
}

function createHTMLTemplate(lang = 'en', headContent = '', scriptContent = '') {
    const assetPath = '{{BASE_PATH}}';

    return `<!DOCTYPE html>
<html lang="${lang}" data-theme="bumblebee">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PAGE_TITLE}}</title>
    <meta name="description" content="{{PAGE_DESCRIPTION}}">
    <meta name="keywords" content="{{PAGE_KEYWORDS}}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Expandia">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{CANONICAL_URL}}">
    
    <!-- Hreflang Links -->
    <link rel="alternate" hreflang="en" href="https://www.expandia.ch/{{PAGE_URL_EN}}">
    <link rel="alternate" hreflang="tr" href="https://www.expandia.ch/{{PAGE_URL_TR}}">
    <link rel="alternate" hreflang="de" href="https://www.expandia.ch/{{PAGE_URL_DE}}">
    <link rel="alternate" hreflang="fr" href="https://www.expandia.ch/{{PAGE_URL_FR}}">
    <link rel="alternate" hreflang="x-default" href="https://www.expandia.ch/{{PAGE_URL_EN}}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{{PAGE_TITLE}}">
    <meta property="og:description" content="{{PAGE_DESCRIPTION}}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{CANONICAL_URL}}">
    <meta property="og:image" content="https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png">
    <meta property="og:site_name" content="Expandia">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{PAGE_TITLE}}">
    <meta name="twitter:description" content="{{PAGE_DESCRIPTION}}">
    <meta name="twitter:image" content="https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png">
    
    <link href="${assetPath}dist/css/output.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="${assetPath}favicon.ico">
    <link rel="icon" type="image/png" href="${assetPath}favicon.png">
    <link rel="apple-touch-icon" href="${assetPath}favicon.png">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XY2B6K4R6Q"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-XY2B6K4R6Q');
    </script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Vivus for SVG Animation -->
    <script src="https://cdn.jsdelivr.net/npm/vivus@latest/dist/vivus.min.js"></script>
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    {{SCHEMA_MARKUP}}
    </script>
    
    <style>
        .lucide { cursor: pointer; }
    </style>

    ${headContent}
</head>
<body class="font-sans">
    {{NAVIGATION}}
    
    {{MAIN_CONTENT}}
    
    {{FOOTER}}
    
    <script src="${assetPath}dist/js/index.js"></script>
    
    <!--Start of Tawk.to Script-->
    <script type="text/javascript">
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/6911e3f950ba1a195e0a2c28/1j9mu527m';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
    </script>
    <!--End of Tawk.to Script-->
    
    <!-- Lucide Icons & Vivus Init -->
    <script>
      lucide.createIcons();
      
      // Initialize Vivus on hover for all Lucide icons
      document.addEventListener('DOMContentLoaded', function() {
          setTimeout(function() {
              const icons = document.querySelectorAll('.lucide');
              icons.forEach(icon => {
                  // Only animate if it's an SVG
                  if(icon.tagName.toLowerCase() === 'svg') {
                      // Trigger animation on hover
                      icon.parentElement.addEventListener('mouseenter', () => {
                          new Vivus(icon, {
                              duration: 50,
                              type: 'oneByOne',
                              start: 'autostart',
                              animTimingFunction: Vivus.EASE
                          });
                      });
                      
                      // Also trigger on load for hero icons
                      if (icon.closest('.buzz-card')) {
                           new Vivus(icon, {
                              duration: 100,
                              type: 'oneByOne',
                              start: 'autostart'
                          });
                      }
                  }
              });
          }, 100);
      });
    </script>

    ${scriptContent}
</body>
</html>`;
}

module.exports = {
    validateTemplateVariables,
    generateOrganizationSchema,
    generateBreadcrumbSchema,
    createHTMLTemplate
};
