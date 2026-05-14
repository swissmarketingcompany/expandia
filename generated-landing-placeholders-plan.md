# Generated Landing Pages Placeholder Audit & Fix Plan

## Findings

Audit command: `node scripts/audit-generated-placeholders.js`

- Scanned **8,173** generated landing pages (`*-*.html` in repo root).
- Found unresolved template placeholders on **7,678** pages.
- Highest-impact unresolved tokens:
  - `{{BASE_PATH}}` (15,779 occurrences / 7,585 pages)
  - `{{COUNTRY_NAME}}` (14,172 occurrences / 7,086 pages)
  - `{{LATEST_BLOG_POSTS}}` (535 pages)
  - `{{FOOTER}}` (535 pages)
  - `{{NAVIGATION}}` and `{{UNIQUE_SEO_CONTENT}}` (443 pages each)

## Concrete examples

- `ai-content-infrastructure-budapest.html` currently ships unresolved CTA links and localization text:
  - `href="{{BASE_PATH}}contact.html"`
  - `... increasingly complex in {{COUNTRY_NAME}}`
- `aalborg.html` contains unresolved shared includes:
  - `{{LATEST_BLOG_POSTS}}`
  - `{{FOOTER}}`

## Likely root-cause areas in generator

`build-pages.js` already performs token replacement in multiple branches, but replacement appears inconsistent across generation paths (some branches replace tokens, others leave template tokens intact).

High-risk tokens are all part of the same replacement family (`BASE_PATH`, `COUNTRY_NAME`, navigation/footer inserts), suggesting one or more service/city loops are bypassing a common final normalization pass.

## Fix plan

1. **Centralize token replacement in one shared helper**
   - Create one function that applies all generic replacements (`{{BASE_PATH}}`, `{{COUNTRY_NAME}}`, `{{NAVIGATION}}`, `{{FOOTER}}`, `{{LATEST_BLOG_POSTS}}`, related page-link tokens).
   - Call it from every page-generation branch before write.

2. **Enforce post-render validation before file writes**
   - Before `fs.writeFileSync`, scan output with `/\{\{[^{}]+\}\}/g`.
   - Fail generation for unresolved tokens except an explicit allowlist (if needed for intentional runtime tokens).

3. **Regenerate and verify**
   - Run `node build-pages.js`.
   - Run `npm run audit:placeholders` and require zero unresolved tokens for generated landing pages.

4. **Prevent regressions in CI**
   - Add `npm run audit:placeholders` to CI checks (or pre-merge workflow).
   - Keep failing exit code when unresolved placeholders are detected.

## Success criteria

- `npm run audit:placeholders` exits 0.
- No generated landing page contains unresolved `{{...}}` tokens unless explicitly allowlisted and documented.
- Spot-check service-city pages (e.g., `ai-content-infrastructure-*`, `managed-it-services-*`) show valid final links and localized text.
