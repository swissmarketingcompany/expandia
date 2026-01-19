#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all HTML files in blog directory
const blogDir = path.join(__dirname, 'blog');
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

console.log(`🔍 Scanning ${blogFiles.length} blog posts for broken links...\n`);

const brokenLinks = [];
const linkPattern = /href=["']([^"']+)["']/g;

blogFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    let match;
    while ((match = linkPattern.exec(content)) !== null) {
        const link = match[1];

        // Skip external links, anchors, and special links
        if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:') ||
            link.startsWith('tel:') || link.startsWith('javascript:') || link === '../' ||
            link.includes('{{')) {
            continue;
        }

        // Check if it's a relative blog link
        if (link.endsWith('.html') && !link.startsWith('../')) {
            const targetFile = path.join(blogDir, link);
            if (!fs.existsSync(targetFile)) {
                brokenLinks.push({
                    sourceFile: file,
                    brokenLink: link,
                    linkText: match[0]
                });
            }
        }

        // Check if it's a link to parent directory
        if (link.startsWith('../') && link.endsWith('.html')) {
            const targetFile = path.join(__dirname, link.substring(3));
            if (!fs.existsSync(targetFile)) {
                brokenLinks.push({
                    sourceFile: file,
                    brokenLink: link,
                    linkText: match[0]
                });
            }
        }
    }
});

// Group by broken link
const grouped = {};
brokenLinks.forEach(item => {
    if (!grouped[item.brokenLink]) {
        grouped[item.brokenLink] = [];
    }
    grouped[item.brokenLink].push(item.sourceFile);
});

console.log(`\n📊 Found ${brokenLinks.length} broken links:\n`);

Object.keys(grouped).sort().forEach(link => {
    console.log(`❌ ${link}`);
    console.log(`   Found in ${grouped[link].length} file(s):`);
    grouped[link].forEach(file => {
        console.log(`   - ${file}`);
    });
    console.log('');
});

if (brokenLinks.length === 0) {
    console.log('✅ No broken links found!');
} else {
    console.log(`\n⚠️  Total: ${brokenLinks.length} broken links in ${Object.keys(grouped).length} unique targets`);
}
