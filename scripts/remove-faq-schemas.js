/**
 * Script to remove duplicate FAQPage schema from all HTML template files
 * This fixes the Google Search Console "Duplicate field 'FAQPage'" error
 */

const fs = require('fs');
const path = require('path');

const templatesDir = './templates';

function removeFAQPageSchema(content) {
    // Match the generic FAQPage schema block that appears in many templates
    // This regex matches the <script type="application/ld+json"> block containing FAQPage
    const faqSchemaPattern = /<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"FAQPage"[\s\S]*?\}\s*<\/script>/g;

    // Remove all FAQPage schema blocks
    return content.replace(faqSchemaPattern, '');
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        if (content.includes('"@type": "FAQPage"') || content.includes('"@type":"FAQPage"')) {
            const newContent = removeFAQPageSchema(content);

            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`✅ Cleaned: ${filePath}`);
                return true;
            }
        }
        return false;
    } catch (err) {
        console.error(`❌ Error processing ${filePath}: ${err.message}`);
        return false;
    }
}

function walkDir(dir) {
    let cleanedCount = 0;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            cleanedCount += walkDir(filePath);
        } else if (file.endsWith('.html')) {
            if (processFile(filePath)) {
                cleanedCount++;
            }
        }
    }

    return cleanedCount;
}

console.log('🧹 Removing duplicate FAQPage schemas from templates...\n');
const cleaned = walkDir(templatesDir);
console.log(`\n✅ Cleaned ${cleaned} files.`);
