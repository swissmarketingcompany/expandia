# Go Expandia — Agent Instructions

## 🚨 CRITICAL: Template Build System

This is a **static site with a template build system**. All root HTML files are auto-generated.

**NEVER edit root `.html` files directly. ALWAYS edit `templates/` or `includes/` instead.**

See `.agents/workflows/editing-pages.md` for full instructions, or use `/editing-pages`.

### Quick Reference
- Homepage → edit `templates/index.html`
- Any page → edit `templates/<pagename>.html`  
- Navigation → edit `includes/header.html`
- After edits → run `node build-pages.js`
- Then commit ALL files (template + generated)
