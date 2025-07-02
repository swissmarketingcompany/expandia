# 🚀 Global Header Build System

## Overview
This project now uses a **global header system** that ensures consistency across all pages and makes maintenance super easy.

## How It Works

### 📁 File Structure
```
includes/
├── header.html          # Global header template
└── footer.html          # Global footer template

templates/
├── index.html           # Page content only (no header/footer)
├── solutions.html       # Page content only
├── about.html          # Page content only  
├── contact.html        # Page content only
└── case-studies.html   # Page content only

build-pages.js          # Build script that combines everything
```

### 🔄 Build Process

1. **Templates**: Each page has a template file in `templates/` containing only the main content
2. **Global Header**: `includes/header.html` contains the navigation with dynamic active states
3. **Build Script**: `build-pages.js` combines templates with header/footer
4. **Final Output**: Complete HTML files are generated in the root directory

### 🛠 Commands

```bash
# Build CSS, JS, and Pages
npm run build

# Build only pages (after header/template changes)  
npm run build:pages

# Start development server
npm run dev
# or
PORT=6161 node server.js
```

### ✨ Benefits

1. **💰 Cost Effective**: One header file, not 6+ duplicates
2. **🔧 Easy Maintenance**: Change header once, affects all pages  
3. **⚡ Zero Drift**: Impossible for pages to become inconsistent
4. **🎯 Active States**: Automatic highlighting of current page
5. **📱 Mobile + Desktop**: Consistent across all screen sizes

### 🎨 Active States

The system automatically applies active styles:

- **Solutions Page**: Solutions menu highlighted + Solutions item highlighted
- **About Page**: Company menu highlighted + About item highlighted  
- **Contact Page**: Company menu highlighted + Contact item highlighted
- **Case Studies**: Solutions menu highlighted + Case Studies item highlighted

### 🔄 Making Changes

#### To Header (Navigation):
1. Edit `includes/header.html`
2. Run `npm run build:pages`
3. All pages updated automatically!

#### To Page Content:
1. Edit the template file in `templates/`
2. Run `npm run build:pages`  
3. Final HTML generated with global header

#### To Footer:
1. Edit `includes/footer.html`
2. Run `npm run build:pages`
3. All pages updated automatically!

### 🎯 Perfect Alignment

The header now uses `container-padding` class to ensure the "Get Started" button and language selector align perfectly with the content sections below.

---

**Result**: One header to rule them all! 🎉 