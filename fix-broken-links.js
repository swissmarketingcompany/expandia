#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all HTML files in templates/blog directory
const templatesDir = path.join(__dirname, 'templates/blog');
const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.html'));

console.log(`🔧 Fixing broken links in ${templateFiles.length} blog templates...\n`);

let totalFixed = 0;

templateFiles.forEach(file => {
    const filePath = path.join(templatesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fixCount = 0;

    // Fix 1: Remove French/Turkish/German language links (./fr/blog/, ./tr/blog/, ./de/blog/)
    const langLinkPattern = /\.\/(fr|tr|de)\/blog\/[^"']+\.html/g;
    const langMatches = content.match(langLinkPattern);
    if (langMatches) {
        langMatches.forEach(match => {
            // Extract just the filename
            const filename = match.split('/').pop();
            // Replace with just the filename (relative link in same directory)
            content = content.replace(new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), filename);
            fixCount++;
            modified = true;
        });
    }

    // Fix 2: Remove ./fr/index.html and ./tr/index.html links
    content = content.replace(/\.\/(fr|tr|de)\/index\.html/g, '../index.html');
    if (content !== fs.readFileSync(filePath, 'utf8')) {
        modified = true;
        fixCount++;
    }

    // Fix 3: Replace broken blog post links with existing alternatives
    const replacements = {
        'sales-as-a-service-guide.html': 'outsourced-sales-management-europe-guide.html',
        'sales-executive-europe-guide.html': 'sales-agent-europe-guide.html',
        'psychological-triggers-sales.html': 'marketing-psychology-guide.html',
        'cross-channel-lead-generation-complete-guide.html': 'cross-channel-lead-generation-guide.html',
        'b2b-lead-generation-strategies-complete-guide.html': 'lead-generation-complete-guide-2025.html',
        'b2b-customer-acquisition-guide.html': 'lead-generation-complete-guide-2025.html',
        'ai-lead-scoring-for-b2b-saas.html': 'lead-scoring-saas-complete-guide.html'
    };

    Object.keys(replacements).forEach(broken => {
        if (content.includes(broken)) {
            content = content.replace(new RegExp(broken, 'g'), replacements[broken]);
            fixCount++;
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file}: Fixed ${fixCount} broken links`);
        totalFixed += fixCount;
    }
});

console.log(`\n🎉 Total: Fixed ${totalFixed} broken links across templates`);
console.log(`\n⚠️  Remember to run: node build-pages.js`);
