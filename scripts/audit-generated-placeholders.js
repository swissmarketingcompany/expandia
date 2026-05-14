#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const PLACEHOLDER_RE = /\{\{[^{}]+\}\}/g;

function isLandingPage(fileName) {
  return fileName.endsWith('.html') && fileName.includes('-');
}

function scan() {
  const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
  const landingPages = entries
    .filter((entry) => entry.isFile() && isLandingPage(entry.name))
    .map((entry) => entry.name)
    .sort();

  const tokenCounts = new Map();
  const filesByToken = new Map();
  const filesWithIssues = [];

  for (const file of landingPages) {
    const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
    const matches = content.match(PLACEHOLDER_RE) || [];
    if (matches.length === 0) continue;

    filesWithIssues.push(file);

    for (const token of matches) {
      tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
      if (!filesByToken.has(token)) filesByToken.set(token, new Set());
      filesByToken.get(token).add(file);
    }
  }

  return {
    landingPages,
    filesWithIssues,
    tokenCounts,
    filesByToken,
  };
}

function printReport(result) {
  console.log('🔎 Generated landing page placeholder audit\n');
  console.log(`Landing pages scanned: ${result.landingPages.length}`);
  console.log(`Pages with unresolved placeholders: ${result.filesWithIssues.length}`);

  const sortedTokens = [...result.tokenCounts.entries()].sort((a, b) => b[1] - a[1]);

  if (sortedTokens.length === 0) {
    console.log('\n✅ No unresolved placeholders found.');
    return;
  }

  console.log('\nTop unresolved placeholder tokens:');
  for (const [token, count] of sortedTokens.slice(0, 10)) {
    const impactedPages = result.filesByToken.get(token)?.size || 0;
    console.log(`- ${token}: ${count} occurrences across ${impactedPages} pages`);
  }

  console.log('\nExample impacted pages:');
  for (const file of result.filesWithIssues.slice(0, 15)) {
    console.log(`- ${file}`);
  }

  console.log('\nℹ️  Tip: run `node build-pages.js` after fixing replacement paths and then rerun this audit.');
}

const result = scan();
printReport(result);

if (result.filesWithIssues.length > 0) {
  process.exitCode = 1;
}
