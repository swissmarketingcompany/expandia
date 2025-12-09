const fs = require('fs');
const path = require('path');

// Simple utility to remove the auto-generated warning banner
// from backup/blog/*.html files.

const BACKUP_BLOG_DIR = path.join(__dirname, '..', 'backup', 'blog');

const BANNER_MARKER = '🚨 AUTO-GENERATED BLOG POST - DO NOT EDIT DIRECTLY!';

function stripBannerFromFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');

    // Only touch files that actually contain the marker near the top
    const markerIndex = original.indexOf(BANNER_MARKER);
    if (markerIndex === -1) {
        return false;
    }

    // Find the start of the opening comment (assume it's the very first comment block)
    const commentStart = original.indexOf('<!--');
    const commentEnd = original.indexOf('-->', commentStart);

    if (commentStart === -1 || commentEnd === -1 || commentEnd < markerIndex) {
        // Unexpected structure, don't risk corrupting the file
        console.warn(`⚠️  Skipping ${filePath} - banner structure not as expected`);
        return false;
    }

    const afterComment = original.slice(commentEnd + 3); // after "-->"

    // Trim a single leading newline if present to keep DOCTYPE on the first line
    const cleaned = afterComment.replace(/^\s*\n?/, '');

    fs.writeFileSync(filePath, cleaned, 'utf8');
    return true;
}

function main() {
    if (!fs.existsSync(BACKUP_BLOG_DIR)) {
        console.error(`❌ backup/blog directory not found at ${BACKUP_BLOG_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(BACKUP_BLOG_DIR)
        .filter((f) => f.endsWith('.html'))
        .sort();

    let changedCount = 0;

    for (const file of files) {
        const fullPath = path.join(BACKUP_BLOG_DIR, file);
        const changed = stripBannerFromFile(fullPath);
        if (changed) {
            changedCount += 1;
            console.log(`✅ Stripped banner from ${file}`);
        }
    }

    console.log(`\nDone. Updated ${changedCount} file(s) in backup/blog.`);
}

if (require.main === module) {
    main();
}


