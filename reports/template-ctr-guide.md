# CTR Template Standards (Blog + Service)

Use these conventions when creating or updating pages so SERP snippets stay consistent and clicky across EN/DE/TR.

## Blog Pages
- Title: `{{BLOG_TITLE}} | Expandia` (≤60 chars, include year/angle). Example: `Lead Scoring for B2B SaaS: 7-Point Model (2025) | Expandia`.
- Meta description: 140–155 chars; promise outcome + audience + proof.
- Canonical: always `https://www.expandia.ch/blog/{slug}.html`.
- OG/Twitter: match title/description; use hero or branded image.
- Schema: BlogPosting JSON-LD with `headline`, `description`, `datePublished`, `dateModified`, `articleSection`, `keywords`, `timeRequired` (ISO, e.g., `PT10M`), `wordCount`, publisher logo.
- FAQ: 3–4 Q/As reflecting dominant SERP questions. Inject via `{{FAQ_SCHEMA}}` placeholder (valid FAQPage JSON-LD).
- Intro: First 150 words should restate the query, audience, and outcome; include primary keyword once.
- H1: Exact match to title without branding suffix.

## Service Pages (base-template.html)
- Title: `{Core Offer + Region} | Expandia` (≤60 chars).
- Meta description: value prop + credibility (numbers, regions, social proof) + CTA.
- Canonical: `https://www.expandia.ch/{slug}.html` (or locale path).
- OG/Twitter: mirror title/description; use branded image.
- Optional Schema: LocalBusiness/Service JSON-LD plus FAQ for top objections (pricing, timeline, deliverables, region coverage).
- Above-the-fold: clear value prop, primary CTA, and trust proof within first viewport.
- Internal links: link to `solutions`, `case-studies`, `contact`, and 2–3 relevant blog posts with intent-matching anchor text.

## Localization
- Hreflang pairs for EN/DE/TR pages; x-default on EN.
- Use native phrasing; avoid literal translations. Adjust titles/meta to local search intent (e.g., “Agentur” vs “Agency”).

## Deployment Order
1) Apply template fields to top 20 high-impression pages (titles/meta/FAQ schema).
2) Roll to remaining blog posts and priority service pages.
3) Validate with Rich Results Test and spot-check SERP snippets after crawl.

