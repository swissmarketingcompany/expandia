# 🚨 DEVELOPMENT WARNING - READ BEFORE EDITING

## ⚠️ CRITICAL: Template-Based Build System

This project uses a **template-based build system**. **DO NOT EDIT** the following files directly:

### ❌ **Never Edit These Files Directly:**
- `index.html` (root)
- `tr/index.html` 
- `de/index.html`
- All other `.html` files in root and language directories

**Why?** These files are **automatically generated** and will be **overwritten** during the build process.

### ✅ **Always Edit These Template Files Instead:**
- `templates/index.html` (English)
- `templates/tr/index.html` (Turkish) 
- `templates/de/index.html` (German)
- All files in `templates/` directory

## 🔄 **Development Workflow**

### 1. **Making Content Changes:**
```bash
# Edit templates, not generated files
nano templates/index.html          # For English
nano templates/tr/index.html       # For Turkish  
nano templates/de/index.html       # For German
```

### 2. **Building Pages:**
```bash
npm run build                       # Full build (CSS + JS + Pages)
npm run build:pages                 # Pages only
npm run build:css                   # CSS only
```

### 3. **Development Server:**
```bash
npm start                           # Starts server on port 6161
```

### 4. **Deployment:**
```bash
npm run build                       # Build everything
git add .                          # Stage changes
git commit -m "Description"        # Commit
git push heroku master             # Deploy to Heroku
```

## 📁 **File Structure**

```
expandia_web/
├── templates/              # ✅ EDIT THESE
│   ├── index.html          # English homepage template
│   ├── tr/index.html       # Turkish homepage template  
│   ├── de/index.html       # German homepage template
│   └── *.html              # Other page templates
├── index.html              # ❌ AUTO-GENERATED - DON'T EDIT
├── tr/index.html           # ❌ AUTO-GENERATED - DON'T EDIT
├── de/index.html           # ❌ AUTO-GENERATED - DON'T EDIT
├── build-pages.js          # Build script
└── package.json            # Build commands
```

## 🚨 **Emergency Recovery**

If you accidentally edit generated files:

1. **Don't panic** - your template files are safe
2. **Run build** to regenerate: `npm run build`
3. **Check git status** to see what changed
4. **Commit only template changes** if needed

## 🎯 **Key Commands**

| Task | Command |
|------|---------|
| Start development | `npm start` |
| Build everything | `npm run build` |
| Build pages only | `npm run build:pages` |
| Build CSS only | `npm run build:css` |

## 💡 **Pro Tips**

- Always work in `templates/` directory
- Use `npm run build:pages` for quick template testing
- The build system automatically handles SEO, meta tags, and multilingual content
- Never edit the root HTML files directly

---
**Remember: Templates → Build → Generated Files → Deploy**