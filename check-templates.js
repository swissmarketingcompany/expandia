#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 CHECKING FOR TEMPLATE ISSUES...\n');

// Files that should only be edited as templates
const generatedFiles = [
    'index.html',
    'tr/index.html', 
    'de/index.html',
    'about.html',
    'tr/about.html',
    'de/about.html',
    'solutions.html',
    'tr/solutions.html', 
    'de/solutions.html',
    'contact.html',
    'tr/contact.html',
    'de/contact.html',
    'case-studies.html',
    'tr/case-studies.html',
    'de/case-studies.html'
];

let issuesFound = false;

// Check if generated files are newer than their templates
for (const file of generatedFiles) {
    if (!fs.existsSync(file)) continue;
    
    // Determine template path
    let templatePath;
    if (file.startsWith('tr/')) {
        templatePath = `templates/${file}`;
    } else if (file.startsWith('de/')) {
        templatePath = `templates/${file}`;  
    } else {
        templatePath = `templates/${file}`;
    }
    
    if (!fs.existsSync(templatePath)) {
        console.log(`⚠️  Template missing: ${templatePath}`);
        issuesFound = true;
        continue;
    }
    
    const generatedStats = fs.statSync(file);
    const templateStats = fs.statSync(templatePath);
    
    if (generatedStats.mtime > templateStats.mtime) {
        const timeDiff = (generatedStats.mtime - templateStats.mtime) / (1000 * 60);
        console.log(`🚨 POTENTIAL ISSUE: ${file} is newer than ${templatePath} by ${Math.round(timeDiff)} minutes`);
        console.log(`   This might mean the generated file was edited directly!`);
        console.log(`   Template last modified: ${templateStats.mtime.toLocaleString()}`);
        console.log(`   Generated file last modified: ${generatedStats.mtime.toLocaleString()}\n`);
        issuesFound = true;
    }
}

if (!issuesFound) {
    console.log('✅ All templates are up to date!');
    console.log('✅ No direct edits to generated files detected.');
} else {
    console.log('💡 SOLUTION: If you made changes to generated files:');
    console.log('   1. Copy your changes to the appropriate template files');
    console.log('   2. Run: npm run build:pages');
    console.log('   3. Commit template changes, not generated file changes');
}

console.log('\n📖 See README-DEVELOPMENT.md for full development guidelines');