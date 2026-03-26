---
description: How to edit HTML pages on the Go Expandia website — ALWAYS edit templates, NEVER edit root HTML files directly
---

# ⚠️ CRITICAL: Template-Based Build System

This project uses a **template build system**. All root-level HTML files (e.g., `index.html`, `about.html`, `solutions.html`, city pages, etc.) are **auto-generated** by `build-pages.js` from source templates.

**If you edit a root HTML file directly, your changes WILL BE OVERWRITTEN on the next build.**

## Rules

1. **NEVER edit root-level `.html` files directly** (e.g., `/index.html`, `/about.html`, `/solutions.html`, city pages like `/london.html`)
2. **ALWAYS edit the corresponding file in `templates/`** (e.g., `templates/index.html`, `templates/about.html`, `templates/solutions.html`)
3. **ALWAYS edit shared components in `includes/`** (e.g., `includes/header.html`, `includes/footer.html`, `includes/header-de.html`)
4. **ALWAYS edit data files in `data/`** for content that comes from JSON (e.g., `data/services.json`, `data/cities-top250.json`)
5. After editing templates, **run the build** to regenerate all output files:

// turbo
```bash
node build-pages.js
```

6. Then **commit ALL changed files** (the template + all regenerated output files)

## File Structure

| What you want to edit | Edit this file | NOT this file |
|---|---|---|
| Homepage content | `templates/index.html` | `index.html` |
| About page | `templates/about.html` | `about.html` |
| Solutions page | `templates/solutions.html` | `solutions.html` |
| Contact page | `templates/contact.html` | `contact.html` |
| Navigation/header | `includes/header.html` | — |
| Footer | `includes/footer.html` | — |
| German header | `includes/header-de.html` | — |
| French header | `includes/header-fr.html` | — |
| Blog posts section | `includes/latest-blog-posts.html` | — |
| City landing pages | `templates/city-landing.html` | `london.html`, `berlin.html`, etc. |
| Service pages | `templates/solution-page.html` | individual service `.html` files |
| Service data/content | `data/services.json`, `data/service-content.json` | — |
| City data | `data/cities-top250.json` | — |
| Blog template | `templates/blog-post-template.html` | — |
| Glossary template | `templates/glossary-term.html` | — |
| German pages | `templates/de/` | `de/*.html` |
| French pages | `templates/fr/` | `fr/*.html` |

## Build Command

// turbo
```bash
node build-pages.js
```

This regenerates **all** output HTML files from templates. Expect 800+ files to change on commit.

## Common Mistakes to Avoid

- ❌ Editing `index.html` in the root — it gets overwritten
- ❌ Editing any city page like `london.html` — they're all generated
- ❌ Forgetting to run `node build-pages.js` after template changes
- ❌ Committing only the template without the regenerated files
- ✅ Edit `templates/index.html` → run build → commit everything
