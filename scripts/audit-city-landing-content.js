#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();

const cities = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/cities-top250.json'), 'utf8'));
const services = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/services.json'), 'utf8'));

function getActiveLandingPageSet() {
  const pageSet = new Set();
  for (const city of cities) {
    const citySlug = city.slug.replace('b2b-lead-generation-', '');
    for (const service of services) {
      if (!service.slug_pattern) continue;
      pageSet.add(`${service.slug_pattern.replace('{{CITY_SLUG}}', citySlug)}.html`);
    }
  }
  return pageSet;
}

const PLACEHOLDER_RE = /\{\{[^{}]+\}\}/g;
const META_DESCRIPTION_RE = /<meta\s+name=["']description["']/gi;
const CANONICAL_RE = /<link\s+rel=["']canonical["']/gi;

function listLandingPages() {
  const activePages = getActiveLandingPageSet();
  return fs
    .readdirSync(ROOT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name)
    .filter((name) => activePages.has(name))
    .sort();
}

function extractStats(content) {
  const placeholders = content.match(PLACEHOLDER_RE) || [];
  const metaDescriptions = content.match(META_DESCRIPTION_RE) || [];
  const canonicals = content.match(CANONICAL_RE) || [];

  const hasKeyLandmark = content.includes('Key Landmark');
  const hasCityCenter = content.includes('City Center');
  const hasCentralBusinessDistrict = content.includes('Central Business District');
  const hasServiceMismatch = /What exactly is included in the Turnkey IT Infrastructure for|Our Turnkey IT Infrastructure service eliminates/i.test(content);
  const hasIconTextLeak = />(\s*)(users|file-text)(\s*)<\/div>/i.test(content);
  const hasFaqHeading = /Frequently Asked Questions|FAQ Section/i.test(content);

  const nearbyMatch = content.match(/Also Serving These Areas Near[\s\S]*?<div class="flex flex-wrap justify-center gap-4 text-sm text-base-content\/70">([\s\S]*?)<\/div>/i);
  let hasEmptyNearbyCities = false;
  if (nearbyMatch) {
    hasEmptyNearbyCities = !/<a\s+href=/i.test(nearbyMatch[1]);
  }

  return {
    placeholders,
    metaDescriptionCount: metaDescriptions.length,
    canonicalCount: canonicals.length,
    hasKeyLandmark,
    hasCityCenter,
    hasCentralBusinessDistrict,
    hasServiceMismatch,
    hasIconTextLeak,
    hasFaqHeading,
    hasEmptyNearbyCities,
  };
}

function runAudit() {
  const files = listLandingPages();

  const issues = {
    unresolvedPlaceholders: [],
    duplicateMetaDescription: [],
    duplicateCanonical: [],
    placeholderLandmarks: [],
    serviceMismatch: [],
    iconTextLeak: [],
    emptyNearbyCities: [],
    missingFaq: [],
  };

  for (const file of files) {
    const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
    const stats = extractStats(content);

    if (stats.placeholders.length > 0) {
      issues.unresolvedPlaceholders.push({ file, count: stats.placeholders.length });
    }
    if (stats.metaDescriptionCount > 1) {
      issues.duplicateMetaDescription.push({ file, count: stats.metaDescriptionCount });
    }
    if (stats.canonicalCount > 1) {
      issues.duplicateCanonical.push({ file, count: stats.canonicalCount });
    }
    if (stats.hasKeyLandmark || stats.hasCityCenter || stats.hasCentralBusinessDistrict) {
      issues.placeholderLandmarks.push(file);
    }
    if (stats.hasServiceMismatch && !file.startsWith('turnkey-it-infrastructure-')) {
      issues.serviceMismatch.push(file);
    }
    if (stats.hasIconTextLeak) {
      issues.iconTextLeak.push(file);
    }
    if (stats.hasEmptyNearbyCities) {
      issues.emptyNearbyCities.push(file);
    }
    if (!stats.hasFaqHeading) {
      issues.missingFaq.push(file);
    }
  }

  return { files, issues };
}

function printTop(label, arr, formatter = (item) => item, limit = 8) {
  console.log(`- ${label}: ${arr.length}`);
  if (!arr.length) return;
  for (const item of arr.slice(0, limit)) {
    console.log(`  • ${formatter(item)}`);
  }
}

function main() {
  const { files, issues } = runAudit();

  console.log('🔎 City landing content audit');
  console.log(`Scanned pages: ${files.length}\n`);

  printTop('Pages with unresolved placeholders', issues.unresolvedPlaceholders, (i) => `${i.file} (${i.count})`);
  printTop('Pages with duplicate meta description', issues.duplicateMetaDescription, (i) => `${i.file} (${i.count})`);
  printTop('Pages with duplicate canonical', issues.duplicateCanonical, (i) => `${i.file} (${i.count})`);
  printTop('Pages with generic landmark placeholders', issues.placeholderLandmarks);
  printTop('Pages containing service-copy mismatch marker ("Turnkey IT Infrastructure")', issues.serviceMismatch);
  printTop('Pages with icon text leakage (users/file-text)', issues.iconTextLeak);
  printTop('Pages with empty nearby-cities block', issues.emptyNearbyCities);
  printTop('Pages without FAQ heading', issues.missingFaq);

  const totalFindings = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
  if (totalFindings > 0) {
    console.log('\n❌ Audit found content-quality issues.');
    process.exitCode = 1;
  } else {
    console.log('\n✅ No issues found.');
  }
}

main();
