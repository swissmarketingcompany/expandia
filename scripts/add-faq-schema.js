#!/usr/bin/env node

/**
 * Add FAQPage Schema to All HTML Pages
 * This script adds FAQ structured data to all HTML pages in the site
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Generic FAQ schema that can be added to any page
const generateFAQSchema = (pageTitle, pageType = 'general') => {
    const faqs = {
        general: [
            {
                question: "How quickly can we start working together?",
                answer: "We can typically begin within 1-2 weeks after our initial consultation. We'll set up everything needed and start delivering results quickly."
            },
            {
                question: "What makes Expandia different from other agencies?",
                answer: "We combine deep European market expertise with data-driven strategies and multilingual capabilities. Our team has 8+ years of experience helping businesses scale internationally."
            },
            {
                question: "Do you work with companies of all sizes?",
                answer: "Yes, we work with startups, SMEs, and enterprise companies. Our solutions are scalable and tailored to your specific business needs and growth stage."
            },
            {
                question: "What is your pricing model?",
                answer: "We offer flexible pricing based on your specific needs and goals. Contact us for a free consultation and custom quote tailored to your business objectives."
            },
            {
                question: "How do you measure success?",
                answer: "We focus on measurable KPIs including lead generation, conversion rates, ROI, and revenue impact. You'll receive detailed analytics and regular performance reports."
            }
        ],
        service: [
            {
                question: "How does this service work?",
                answer: "Our service follows a proven methodology: discovery and strategy, implementation and setup, execution and optimization, and ongoing support with regular reporting."
            },
            {
                question: "What results can we expect?",
                answer: "Most clients see measurable improvements within 2-4 weeks. Results vary by service but typically include increased leads, better conversion rates, and improved ROI."
            },
            {
                question: "Do you provide ongoing support?",
                answer: "Yes, we provide continuous optimization, performance monitoring, and strategic support to ensure long-term success and growth."
            },
            {
                question: "Can this integrate with our existing tools?",
                answer: "Absolutely. We integrate seamlessly with popular platforms like HubSpot, Salesforce, Pipedrive, and other CRM and marketing tools."
            },
            {
                question: "What industries do you serve?",
                answer: "We serve B2B companies across technology, manufacturing, professional services, healthcare, finance, and many other industries."
            }
        ]
    };

    const selectedFAQs = faqs[pageType] || faqs.general;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": selectedFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
};

// Process a single HTML file
const processHTMLFile = async (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Skip if already has FAQPage schema
        if (content.includes('"@type": "FAQPage"') || content.includes('"@type":"FAQPage"')) {
            console.log(`✓ Skipped (already has schema): ${filePath}`);
            return { skipped: true, reason: 'has_schema' };
        }

        // Skip template fragments (files that don't have proper structure)
        if (!content.includes('</section>') && !content.includes('</div>')) {
            console.log(`✓ Skipped (fragment): ${filePath}`);
            return { skipped: true, reason: 'fragment' };
        }

        // Determine page type
        const pageType = filePath.includes('service') ||
            filePath.includes('lead-generation') ||
            filePath.includes('marketing') ? 'service' : 'general';

        // Generate FAQ schema
        const faqSchema = generateFAQSchema(path.basename(filePath), pageType);

        // Try to add before closing </body> tag, or before last </section>, or at the end
        let modified = false;

        if (content.includes('</body>')) {
            content = content.replace('</body>', `${faqSchema}\n</body>`);
            modified = true;
        } else if (content.match(/<\/section>\s*$/)) {
            // Add before the last closing section tag
            const lastSectionIndex = content.lastIndexOf('</section>');
            content = content.substring(0, lastSectionIndex) +
                faqSchema + '\n' +
                content.substring(lastSectionIndex);
            modified = true;
        } else {
            // Add at the end of the file
            content = content + '\n' + faqSchema;
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Added schema: ${filePath}`);
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
    console.log('🚀 Starting FAQPage Schema Addition...\n');

    const baseDir = '/Users/oguzhanocak/Downloads/expandia_web_2026/expandia';

    // Find all HTML files (excluding node_modules, dist, backup)
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

    // Process files in batches to avoid memory issues
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
    console.log(`✅ Schema added:       ${stats.success}`);
    console.log(`⏭️  Skipped:            ${stats.skipped}`);
    console.log(`❌ Errors:             ${stats.errors}`);
    console.log('\nSkip reasons:');
    Object.entries(stats.reasons).forEach(([reason, count]) => {
        console.log(`  - ${reason}: ${count}`);
    });
    console.log('='.repeat(60));
    console.log('\n🎉 Done! Your pages now have FAQPage schema for Google Search Console.');
};

main().catch(console.error);
