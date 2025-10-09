/*
  SEO Injector for Blog Posts (TR/DE)

  - Adds canonical link, Open Graph, and Twitter Card meta tags if missing
  - Adds BlogPosting JSON-LD with datePublished/dateModified = 2025-08-09 if missing (skips blog index pages)
  - If JSON-LD exists, normalizes dates to 2025-08-09

  Usage: node scripts/seo-inject.js

  Safe to run multiple times; it won't duplicate tags.
*/

const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const TARGET_DATE = "2025-08-09";
const BLOG_DIRS = [
  path.join(ROOT_DIR, "blog"),
  path.join(ROOT_DIR, "tr", "blog"),
  path.join(ROOT_DIR, "de", "blog")
];

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function findHtmlFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join(dirPath, f));
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractDescription(html) {
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  return match ? match[1].trim() : "";
}

function hasCanonical(html) {
  return /<link\s+rel=["']canonical["']/i.test(html);
}

function hasOgTitle(html) {
  return /property=["']og:title["']/i.test(html);
}

function hasHreflangLinks(html) {
  return /<link\s+rel=["']alternate["']\s+hreflang=/i.test(html);
}

function buildHreflangBlock() {
  return [
    '  <link rel="alternate" hreflang="en" href="https://www.expandia.ch/blog/">',
    '  <link rel="alternate" hreflang="tr" href="https://www.expandia.ch/tr/blog/">',
    '  <link rel="alternate" hreflang="de" href="https://www.expandia.ch/de/blog/">',
    '  <link rel="alternate" hreflang="x-default" href="https://www.expandia.ch/blog/">'
  ].join('\n');
}

function hasBlogPostingJsonLd(html) {
  return /"@type"\s*:\s*"BlogPosting"/i.test(html);
}

function ensureDatesInJsonLd(html, fileMtime) {
  let updated = html;
  // Only attempt if BlogPosting exists
  if (!hasBlogPostingJsonLd(html)) return { html, changed: false };
  const before = updated;
  const isoMtime = fileMtime ? new Date(fileMtime).toISOString().slice(0, 10) : TARGET_DATE;
  // Keep existing datePublished if present; only backfill when empty
  // Always update dateModified to mtime for freshness
  updated = updated.replace(/"dateModified"\s*:\s*"[^"]*"/g, `"dateModified": "${isoMtime}"`);
  return { html: updated, changed: updated !== before };
}

function injectBeforeHeadClose(html, block) {
  const idx = html.toLowerCase().lastIndexOf("</head>");
  if (idx === -1) return html; // give up if malformed
  return html.slice(0, idx) + block + "\n" + html.slice(idx);
}

function buildCanonicalTag(canonicalUrl) {
  return `  <link rel="canonical" href="${canonicalUrl}" />`;
}

function buildOgTwitterBlock({ type, title, description, url }) {
  return [
    `  <meta property="og:type" content="${type}"/>`,
    `  <meta property="og:title" content="${title}"/>`,
    `  <meta property="og:description" content="${description}"/>`,
    `  <meta property="og:url" content="${url}"/>`,
    `  <meta property="og:site_name" content="Expandia"/>`,
    `  <meta property="og:image" content="https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png"/>`,
    `  <meta name="twitter:card" content="summary_large_image"/>`,
    `  <meta name="twitter:title" content="${title}"/>`,
    `  <meta name="twitter:description" content="${description}"/>`,
    `  <meta name="twitter:image" content="https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png"/>`,
  ].join("\n");
}

function buildBlogPostingJsonLd({ title, description, url, fileMtime }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: { "@type": "Organization", name: "Expandia" },
    publisher: {
      "@type": "Organization",
      name: "Expandia",
      logo: { "@type": "ImageObject", url: "https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: TARGET_DATE,
    dateModified: fileMtime ? new Date(fileMtime).toISOString().slice(0, 10) : TARGET_DATE,
  };
  return (
    "  <script type=\"application/ld+json\">" +
    JSON.stringify(json, null, 2).replace(/^/gm, "  ") +
    "\n  </script>"
  );
}

function processFile(absPath) {
  const rel = toPosix(path.relative(ROOT_DIR, absPath));
  let html = fs.readFileSync(absPath, "utf8");
  const isIndex = path.basename(absPath) === "index.html";
  const fileMtime = fs.statSync(absPath).mtimeMs;

  const canonicalUrl = `https://www.expandia.ch/${rel}`;
  let title = extractTitle(html);
  if (!title) title = path.basename(absPath, ".html").replace(/-/g, " ");
  let description = extractDescription(html);
  if (!description) description = `${title} - Expandia`;

  let changed = false;

  // Sanitize broken OG/Twitter titles that may contain stray markup
  const escapeAttribute = (s) => String(s).replace(/"/g, '&quot;');
  function sanitizeMetaTitles(inputHtml) {
    let updated = inputHtml;
    const safeTitle = escapeAttribute(title);
    const ogRegex = /<meta[^>]*property=["']og:title["'][^>]*>/gi;
    const twRegex = /<meta[^>]*name=["']twitter:title["'][^>]*>/gi;
    const replaceContent = (tag) => {
      // Normalize any stray markup inside content
      if (/content=/.test(tag)) {
        return tag.replace(/content=["'][^"']*["']/i, `content="${safeTitle}"`);
      }
      // If content missing, append one
      return tag.replace(/>$/, ` content="${safeTitle}">`);
    };
    const newHtml = updated
      .replace(ogRegex, (t) => replaceContent(t))
      .replace(twRegex, (t) => replaceContent(t));
    return { html: newHtml, changed: newHtml !== inputHtml };
  }

  const { html: htmlAfterSanitize, changed: sanitizeChanged } = sanitizeMetaTitles(html);
  if (sanitizeChanged) {
    html = htmlAfterSanitize;
    changed = true;
  }

  if (!hasCanonical(html)) {
    const block = "\n" + buildCanonicalTag(canonicalUrl);
    html = injectBeforeHeadClose(html, block);
    changed = true;
  }

  if (!hasOgTitle(html)) {
    const type = isIndex ? "website" : "article";
    const block = "\n" + buildOgTwitterBlock({ type, title, description, url: canonicalUrl });
    html = injectBeforeHeadClose(html, block);
    changed = true;
  }

  if (!isIndex) {
    if (!hasBlogPostingJsonLd(html)) {
      const block = "\n" + buildBlogPostingJsonLd({ title, description, url: canonicalUrl, fileMtime });
      html = injectBeforeHeadClose(html, block);
      changed = true;
    } else {
      // Deduplicate BlogPosting JSON-LD blocks and normalize dates
      const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      let blogJsonBlocks = [];
      let match;
      while ((match = scriptRegex.exec(html)) !== null) {
        try {
          const json = JSON.parse(match[1]);
          // Handle both single object and array of objects
          const objects = Array.isArray(json) ? json : [json];
          const hasBlog = objects.some((obj) => obj && obj["@type"] === "BlogPosting");
          if (hasBlog) {
            blogJsonBlocks.push({ start: match.index, end: scriptRegex.lastIndex, json });
          }
        } catch (e) {
          // ignore parse errors
        }
      }

      if (blogJsonBlocks.length > 1) {
        // Keep the last block, remove earlier ones
        const keep = blogJsonBlocks[blogJsonBlocks.length - 1];
        let rebuilt = "";
        let cursor = 0;
        for (let i = 0; i < blogJsonBlocks.length - 1; i++) {
          const blk = blogJsonBlocks[i];
          rebuilt += html.slice(cursor, blk.start);
          cursor = blk.end;
          changed = true;
        }
        rebuilt += html.slice(cursor);
        html = rebuilt;
      }

      const { html: updated, changed: datesChanged } = ensureDatesInJsonLd(html, fileMtime);
      if (datesChanged) {
        html = updated;
        changed = true;
      }
    }
  }
  // Add hreflang alternates on blog index pages only
  if (isIndex && !hasHreflangLinks(html)) {
    html = injectBeforeHeadClose(html, "\n" + buildHreflangBlock());
    changed = true;
  }

  // Ensure robots meta exists for blog pages
  if (!/name=["']robots["']/i.test(html)) {
    html = injectBeforeHeadClose(html, "\n  <meta name=\"robots\" content=\"index, follow\">" );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(absPath, html, "utf8");
    return { relPath: rel, changed: true };
  }
  return { relPath: rel, changed: false };
}

function main() {
  const targets = BLOG_DIRS.flatMap(findHtmlFiles);
  const results = targets.map(processFile);
  const changed = results.filter((r) => r.changed).map((r) => r.relPath);
  if (changed.length) {
    console.log("Updated files:\n" + changed.join("\n"));
  } else {
    console.log("No changes needed.");
  }
}

main();

