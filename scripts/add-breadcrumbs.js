#!/usr/bin/env node

/**
 * Add Breadcrumbs to All HTML Pages
 * Adds both visual breadcrumbs and BreadcrumbList schema
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Pages to exclude (main menu pages)
const EXCLUDED_PAGES = [
    'index.html',
    'about.html',
    'contact.html',
    'vision-mission.html',
    'our-ethical-principles.html',
    'city-locations.html',
    'service-areas.html'
];

// Generate breadcrumb schema based on file path
const generateBreadcrumbSchema = (filePath, baseUrl = 'https://www.goexpandia.com') => {
    const relativePath = filePath.replace(/^.*?expandia\//, '');
    const parts = relativePath.split('/').filter(p => p && p !== 'expandia');

    const breadcrumbs = [
        { name: 'Home', url: `${baseUrl}/` }
    ];

    let currentPath = baseUrl;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Skip the filename if it's the last part
        if (i === parts.length - 1 && part.endsWith('.html')) {
            // Get page title from filename
            const pageName = part
                .replace('.html', '')
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            breadcrumbs.push({ name: pageName, url: null }); // Last item has no URL
        } else if (part === 'blog') {
            currentPath += '/blog';
            breadcrumbs.push({ name: 'Blog', url: `${currentPath}/index.html` });
        } else if (part === 'glossary') {
            currentPath += '/glossary';
            breadcrumbs.push({ name: 'Glossary', url: `${currentPath}/index.html` });
        } else if (part.match(/^(de|fr|tr)$/)) {
            // Language folder
            currentPath = `${baseUrl}/${part}`;
            const langNames = { de: 'Deutsch', fr: 'Français', tr: 'Türkçe' };
            breadcrumbs.push({ name: langNames[part] || part.toUpperCase(), url: `${currentPath}/index.html` });
        } else if (!part.endsWith('.html')) {
            currentPath += `/${part}`;
        }
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => {
            const item = {
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name
            };
            if (crumb.url) {
                item.item = crumb.url;
            }
            return item;
        })
    };

    return {
        schema: `<!-- Breadcrumb Schema -->\n<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`,
        breadcrumbs
    };
};

// Generate visual breadcrumb HTML
const generateBreadcrumbHTML = (breadcrumbs) => {
    const items = breadcrumbs.map((crumb, index) => {
        if (index === breadcrumbs.length - 1) {
            // Last item (current page) - no link
            return `<li class="text-base-content/60">${crumb.name}</li>`;
        } else {
            // Clickable breadcrumb
            const url = crumb.url.replace('https://www.goexpandia.com', '..');
            return `<li><a href="${url}" class="link link-hover">${crumb.name}</a></li>`;
        }
    }).join('\n                ');

    return `<!-- Breadcrumbs -->
<div class="bg-base-200 py-3">
    <div class="container mx-auto container-padding">
        <div class="breadcrumbs text-sm">
            <ul>
                ${items}
            </ul>
        </div>
    </div>
</div>`;
};

// Process a single HTML file
const processHTMLFile = async (filePath) => {
    try {
        const filename = path.basename(filePath);

        // Skip excluded pages
        if (EXCLUDED_PAGES.includes(filename)) {
            console.log(`⏭️  Skipped (main menu page): ${filePath}`);
            return { skipped: true, reason: 'main_menu_page' };
        }

        let content = fs.readFileSync(filePath, 'utf8');

        // Skip if already has breadcrumb schema
        if (content.includes('"@type": "BreadcrumbList"') || content.includes('"@type":"BreadcrumbList"')) {
            console.log(`✓ Skipped (already has breadcrumbs): ${filePath}`);
            return { skipped: true, reason: 'has_breadcrumbs' };
        }

        // Skip template fragments
        if (!content.includes('</head>') && !content.includes('</nav>')) {
            console.log(`✓ Skipped (fragment): ${filePath}`);
            return { skipped: true, reason: 'fragment' };
        }

        // Generate breadcrumbs
        const { schema, breadcrumbs } = generateBreadcrumbSchema(filePath);
        const breadcrumbHTML = generateBreadcrumbHTML(breadcrumbs);

        let modified = false;

        // Add schema in <head> section (before </head>)
        if (content.includes('</head>')) {
            content = content.replace('</head>', `    ${schema}\n</head>`);
            modified = true;
        }

        // Add visual breadcrumbs after </nav> or at the start of <body>
        if (content.includes('</nav>')) {
            content = content.replace('</nav>', `</nav>\n\n${breadcrumbHTML}`);
            modified = true;
        } else if (content.includes('<body')) {
            // Find the end of the body tag
            const bodyMatch = content.match(/<body[^>]*>/);
            if (bodyMatch) {
                const bodyTag = bodyMatch[0];
                content = content.replace(bodyTag, `${bodyTag}\n\n${breadcrumbHTML}`);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Added breadcrumbs: ${filePath}`);
            return { success: true };
        }

        return { skipped: true, reason: 'no_suitable_location' };

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return { error: true, message: error.message };
    }
};

// Main execution
const main = async () => {
    console.log('🍞 Starting Breadcrumb Addition...\n');

    const baseDir = '/Users/oguzhanocak/Downloads/expandia_web_2026/expandia';

    // Find all HTML files
    const pattern = `${baseDir}/**/*.html`;
    const ignore = ['**/node_modules/**', '**/dist/**', '**/backup/**', '**/.git/**'];

    console.log('📁 Searching for HTML files...');
    const files = await glob(pattern, { ignore });

    console.log(`📊 Found ${files.length} HTML files\n`);
    console.log('⚙️  Processing files...\n');

    const stats = {
        total: files.length,
        success: 0,
        skipped: 0,
        errors: 0,
        reasons: {}
    };

    // Process files in batches
    const batchSize = 100;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(processHTMLFile));

        results.forEach(result => {
            if (result.success) {
                stats.success++;
            } else if (result.skipped) {
                stats.skipped++;
                stats.reasons[result.reason] = (stats.reasons[result.reason] || 0) + 1;
            } else if (result.error) {
                stats.errors++;
            }
        });

        // Progress update
        const processed = Math.min(i + batchSize, files.length);
        console.log(`📈 Progress: ${processed}/${files.length} files processed`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ COMPLETION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files found:     ${stats.total}`);
    console.log(`✅ Breadcrumbs added:  ${stats.success}`);
    console.log(`⏭️  Skipped:            ${stats.skipped}`);
    console.log(`❌ Errors:             ${stats.errors}`);
    console.log('\nSkip reasons:');
    Object.entries(stats.reasons).forEach(([reason, count]) => {
        console.log(`  - ${reason}: ${count}`);
    });
    console.log('='.repeat(60));
    console.log('\n🎉 Done! Your pages now have breadcrumbs for better navigation and SEO.');
};

main().catch(console.error);
