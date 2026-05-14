#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all HTML files in blog directory
const blogDir = path.join(__dirname, 'blog');
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

console.log(`🔧 Fixing broken links in ${blogFiles.length} generated blog posts...\n`);

let totalFixed = 0;
let filesModified = 0;

blogFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fixCount = 0;

    // Fix 1: Remove French/Turkish/German language links (./fr/blog/, ./tr/blog/, ./de/blog/)
    // Replace with just the filename (relative link in same directory)
    const langLinkPattern = /href=["']\.\/(fr|tr|de)\/blog\/([^"']+\.html)["']/g;
    content = content.replace(langLinkPattern, (match, lang, filename) => {
        fixCount++;
        return `href="${filename}"`;
    });

    // Fix 2: Remove ./fr/index.html, ./tr/index.html, ./de/index.html links
    const langIndexPattern = /href=["']\.\/(fr|tr|de)\/index\.html["']/g;
    content = content.replace(langIndexPattern, (match) => {
        fixCount++;
        return `href="../index.html"`;
    });

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
        const pattern = new RegExp(`href=["']${broken}["']`, 'g');
        if (pattern.test(content)) {
            content = content.replace(pattern, `href="${replacements[broken]}"`);
            fixCount++;
        }
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        filesModified++;
        if (fixCount > 5) {
            console.log(`✅ ${file}: Fixed ${fixCount} broken links`);
        }
        totalFixed += fixCount;
    }
});

console.log(`\n🎉 Total: Fixed ${totalFixed} broken links in ${filesModified} files`);
