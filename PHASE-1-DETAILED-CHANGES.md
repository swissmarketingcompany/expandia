# Phase 1: Detailed Terminology Changes Breakdown

**Document Purpose**: Complete inventory of all files and changes needed to standardize "business development" → "lead generation" terminology across English content.

**Total Files Affected**: 39 files
**Total Changes**: 211+ instances
**Categories**: Blog articles, Service pages, Build configuration, Server templates, Documentation

---

## CHANGE PRIORITY MATRIX

### CRITICAL (Do First - Impacts Most Pages)
- [ ] **Rename: fractional-bizdev-team.html** → **part-time-lead-generation-team.html**
- [ ] **templates/fractional-bizdev-team.html** → **templates/part-time-lead-generation-team.html** - Update template
- [ ] **build-pages.js** - Controls meta tag generation for all service pages

### HIGH (Core Blog & Navigation)
- [ ] **blog/what-is-business-development-complete-guide.html** - Completely rewrite (150+ instances)
- [ ] **templates/blog/what-is-business-development-complete-guide.html** - Rewrite template
- [ ] **index.html, solutions.html** - Update navigation to "Part-Time Lead Generation Team"

### MEDIUM (Service Pages)
- [ ] **export-marketing-consulting.html** - 3 instances
- [ ] **overseas-sales-consulting.html** - 3 instances
- [ ] **international-market-entry.html** - 2 instances
- [ ] **europe-market-entry.html** - 2 instances
- [ ] **distributor-finding.html** - 2 instances
- [ ] **blog/what-is-lead-generation-complete-guide.html** - 5+ instances

### LOW (Supporting Files)
- [ ] **vision-mission.html** - 1 instance
- [ ] **gemini-service.js** - 2 instances
- [ ] **blog/digital-agency-marketing-guide.html** - 3 instances
- [ ] **Multiple blog files** - Navigation consistency (2 files)

---

## DECISION POINT: Terminology Standardization

### APPROVED: "Part-Time Lead Generation Team"
- File name: `part-time-lead-generation-team.html` (rename from `fractional-bizdev-team.html`)
- Menu text: `👥 Part-Time Lead Generation Team`
- Service description: "Part-time lead generation team for 40 hours/month"
- **Alignment**: Matches Turkish content which uses "Part-Time Lead Generation Ekibi" (clearer than "Fractional")
- **URL Change**: Yes - migrate directly (no 301 redirects needed per user preference)

---

## FILE-BY-FILE CHANGE DETAILS

### 1. CRITICAL PRIORITY FILES

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/build-pages.js`
**Change Type**: Build configuration metadata
**Changes**: 15+ instances
**Impact**: HIGH - Controls meta tags for all generated service pages

| Line | Current Text | New Text | Section | Change Type |
|------|---|---|---|---|
| 692 | `keywords: 'sales development agency, B2B sales outsourcing, sales team management, business development Europe'` | `keywords: 'sales development agency, B2B sales outsourcing, sales team management, lead generation Europe'` | sales-development-agency page keywords | Replace "business development" with "lead generation" |
| 701 | Description: contains "business development" | Update to "lead generation" | export-marketing-consulting description | Replace terminology |
| 702 | Keywords: contains "business development" | Update to "lead generation" | export-marketing-consulting keywords | Replace terminology |
| 706 | Description: contains "business development" | Update to "lead generation" | overseas-sales-consulting description | Replace terminology |
| 707 | Keywords: contains "business development" | Update to "lead generation" | overseas-sales-consulting keywords | Replace terminology |
| 712 | Keywords: contains "business development" | Update to "lead generation" | international-market-entry keywords | Replace terminology |
| 716 | Description: "...business development experts..." | "...lead generation experts..." | distributor-finding description | Replace terminology |
| 717 | Keywords: contains "business development" | Update to "lead generation" | distributor-finding keywords | Replace terminology |
| 722 | Keywords: "distributor finding, international business development..." | `'distributor finding, international lead generation, export consulting, partner identification, overseas distribution'` | distributor-finding keywords | Replace terminology |
| 727 | Keywords: contains "business development consulting" | Update to "lead generation consulting" | europe-market-entry keywords | Replace terminology |
| 731 | Description: "...international business development..." | "...international lead generation..." | usa-pr-service description | Replace terminology |
| 732 | Keywords: contains "international business development" | Update to "international lead generation" | usa-pr-service keywords | Replace terminology |
| 736 | Description: "...international business development..." | "...international lead generation..." | corporate-digital-gifting description | Replace terminology |
| 737 | Keywords: contains "international business development" | Update to "international lead generation" | corporate-digital-gifting keywords | Replace terminology |
| 742 | Keywords: contains "business development consulting" | Update to "lead generation consulting" | international-market-entry keywords | Replace terminology |

**Implementation Notes**:
- This file is critical because it generates meta tags for multiple service pages
- After updating this file, you'll need to rebuild pages using `build-pages.js`
- Changes affect SEO metadata across 8+ service pages

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/templates/fractional-bizdev-team.html`
**Rename to**: `/Users/oguzhanocak/Downloads/expandia_web/templates/part-time-lead-generation-team.html`
**Change Type**: HTML template (generates the main service page)
**Changes**: Page title, description, keywords, and all URL references
**Impact**: CRITICAL - This is the source template for the main part-time service page

| Line | Current Text | New Text | Section | Notes |
|------|---|---|---|---|
| 6 | `<title>Fractional Lead Generation Team \| Expandia \| Expandia - Sales Growth Partner</title>` | `<title>Part-Time Lead Generation Team \| Expandia \| Expandia - Sales Growth Partner</title>` | Page title | Replace "Fractional" with "Part-Time" |
| 7 | `<meta name="description" content="Dedicated team member for 5-50 headcount companies. 40 hours/month, low cost, high performance.">` | ✓ Keep as is (good description) | Meta description | No change needed |
| 8 | `<meta name="keywords" content="fractional lead generation, fractional Lead Generation, outsourced sales, B2B team">` | `<meta name="keywords" content="part-time lead generation, part-time Lead Generation, outsourced sales, B2B team">` | Meta keywords | Replace "fractional" with "part-time" |
| 13 | `<link rel="canonical" href="https://www.expandia.ch/fractional-bizdev-team.html">` | `<link rel="canonical" href="https://www.expandia.ch/part-time-lead-generation-team.html">` | Canonical URL | Update to new URL |
| 16 | `<link rel="alternate" hreflang="en" href="https://www.expandia.ch/fractional-bizdev-team.html">` | `<link rel="alternate" hreflang="en" href="https://www.expandia.ch/part-time-lead-generation-team.html">` | Hreflang links | Update to new URL |
| 22 | `<meta property="og:title" content="Fractional Lead Generation Team \| Expandia \| Expandia">` | `<meta property="og:title" content="Part-Time Lead Generation Team \| Expandia \| Expandia">` | Open Graph title | Replace "Fractional" with "Part-Time" |
| 25 | `<meta property="og:url" content="https://www.expandia.ch/fractional-bizdev-team.html">` | `<meta property="og:url" content="https://www.expandia.ch/part-time-lead-generation-team.html">` | Open Graph URL | Update to new URL |
| 31 | `<meta name="twitter:title" content="Fractional Lead Generation Team \| Expandia \| Expandia">` | `<meta name="twitter:title" content="Part-Time Lead Generation Team \| Expandia \| Expandia">` | Twitter title | Replace "Fractional" with "Part-Time" |

**Implementation Notes**:
- Rename the file from `fractional-bizdev-team.html` to `part-time-lead-generation-team.html`
- Update all URL references in canonical, hreflang, og:url tags
- Replace "Fractional" with "Part-Time" in all titles and keywords
- No redirects needed per user preference

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/fractional-bizdev-team.html`
**Status**: Will be replaced by new file
**Action**: Delete this file after creating `part-time-lead-generation-team.html`
**Impact**: CRITICAL - Main service page is being renamed

**Process**:
1. File will be auto-generated from updated template
2. Old file: `/fractional-bizdev-team.html` (delete after verification)
3. New file: `/part-time-lead-generation-team.html` (generated from updated template)
4. No 301 redirects needed per user preference (direct migration)

**All URL References Will Be Updated To**:
- Canonical: `https://www.expandia.ch/part-time-lead-generation-team.html`
- Hreflang: `https://www.expandia.ch/part-time-lead-generation-team.html`
- OG URL: `https://www.expandia.ch/part-time-lead-generation-team.html`
- Page Title: `Part-Time Lead Generation Team | Expandia`

---

### 2. HIGH PRIORITY FILES

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/blog/what-is-business-development-complete-guide.html`
**Change Type**: Blog article content - COMPLETE REWRITE
**Changes**: 150+ instances - rewrite entire article
**Impact**: CRITICAL - Core blog article (rewritten to focus on lead generation)

**Approved Approach**: Completely rewrite the guide
- **New Focus**: "What is Lead Generation? A Complete Guide"
- **Article Goal**: Position lead generation as the primary growth strategy
- **Comparison**: Include business development as related concept
- **CTA**: Direct readers to Part-Time Lead Generation Team service
- **Length**: Can be same length or adjusted as needed

**Major Changes**:

| Section | Current Focus | New Focus | Action |
|---------|---|---|---|
| Page Title (Line 6) | "What is Business Development? Complete Guide" | "What is Lead Generation? A Complete Guide" | Rewrite title |
| Meta Description (Line 7) | Explains business development | Explains lead generation | Rewrite description |
| Meta Keywords (Line 8) | "business development, business development strategy, B2B business development..." | "lead generation, lead generation strategies, B2B lead generation, sales funnel..." | Update keywords |
| H1 Heading | "What is Business Development?" | "What is Lead Generation?" | Update heading |
| Body Content | 150+ instances about business development | Rewrite to focus on lead generation | Rewrite ~70% of content |
| Navigation Menu (Line 101) | `../fractional-bizdev-team.html` | `../part-time-lead-generation-team.html` with "Part-Time Lead Generation Team" label | Update link |
| Service CTA | Reference to business development services | Reference to Part-Time Lead Generation Team | Update CTA |
| Comparison Section | If present, BD vs. other strategies | Lead Generation vs. other strategies + brief mention of BD | Restructure |

**Navigation Link Updates**:
- Line 101: Update href from `../fractional-bizdev-team.html` to `../part-time-lead-generation-team.html`
- Line 101: Update text from `Fractional BizDev Team` to `Part-Time Lead Generation Team`
- Lines 167+: Any other links to `fractional-bizdev-team.html` → `part-time-lead-generation-team.html`

**Estimated Scope**: Major rewrite (2-3 hours content work + revisions)

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/templates/blog/what-is-business-development-complete-guide.html`
**Change Type**: Blog template
**Changes**: 150+ instances
**Impact**: HIGH - Template version used in build system

**Note**: Mirror changes to `/blog/what-is-business-development-complete-guide.html`

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/index.html`
**Change Type**: Generated HTML (homepage)
**Changes**: Navigation menu, service cards
**Impact**: HIGH - Homepage seen by all visitors

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 99 | `<li><a href="./fractional-bizdev-team.html" class="text-sm pl-8">👥 Fractional Lead Generation Team</a></li>` | ✓ Keep as is (already correct label) | Mobile menu dropdown | No change needed |
| 110 | Navigation link to `fractional-bizdev-team.html` | Update to `fractional-lead-generation-team.html` | Mobile menu | Update URL |
| 176 | Navigation link to `fractional-bizdev-team.html` (desktop) | Update to `fractional-lead-generation-team.html` | Desktop menu | Update URL |

**Additional Navigation Review**: Check all menu items pointing to `fractional-bizdev-team.html` and update URLs

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/solutions.html`
**Change Type**: Service overview page
**Changes**: Navigation + page structure
**Impact**: HIGH - Service menu page

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 99 | `<li><a href="./fractional-bizdev-team.html" class="text-sm pl-8">👥 Fractional Lead Generation Team</a></li>` | ✓ Keep label as is | Mobile menu | No change needed |
| 110 | Navigation link `href="./fractional-bizdev-team.html"` | `href="./fractional-lead-generation-team.html"` | Mobile menu | Update URL |
| 176 | Navigation link `href="./fractional-bizdev-team.html"` (desktop) | `href="./fractional-lead-generation-team.html"` | Desktop menu | Update URL |

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/server.js`
**Change Type**: Server configuration + proposal generation
**Changes**: 5 instances in system prompts and templates
**Impact**: HIGH - Affects proposal generation

| Line | Current Text | New Text | Section | Notes |
|------|---|---|---|---|
| 681 | `"You are a proposal designer for Expandia, a business development and sales as a service company."` | `"You are a proposal designer for Expandia, a lead generation and sales as a service company."` | Gemini API system prompt | Change core description |
| 700 | `"Business Development as a Service"` | `"Lead Generation as a Service"` | Proposal template section | Change service name |
| 782 | `"Business Development & Sales as a Service"` | `"Lead Generation & Sales as a Service"` | Email template | Change service name |
| 854 | `"Business Development Manager"` | `"Lead Generation Manager"` | Role description | Change role title |
| 881 | `"Business Development & Sales as a Service"` | `"Lead Generation & Sales as a Service"` | Closing template | Change service name |

**Implementation Notes**: These are internal server descriptions that affect how AI-generated proposals describe your company.

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/gemini-service.js`
**Change Type**: AI service configuration
**Changes**: 2 instances in system prompt
**Impact**: MEDIUM - Affects AI proposal generation

| Line | Current Text | New Text | Section | Notes |
|------|---|---|---|---|
| 30 | `"You are a proposal designer for Expandia, a business development and sales as a service company."` | `"You are a proposal designer for Expandia, a lead generation and sales as a service company."` | System prompt | Change core description |
| 49 | `"Business Development as a Service"` | `"Lead Generation as a Service"` | Service name | Change service name |

---

### 3. MEDIUM PRIORITY FILES

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/export-marketing-consulting.html`
**Change Type**: Service page
**Changes**: 3 instances (title, description, keywords) + navigation
**Impact**: MEDIUM - Service page SEO

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 6 | `<title>Export Marketing Consulting \| International Business Development \| Expandia</title>` | `<title>Export Marketing Consulting \| International Lead Generation \| Expandia</title>` | Page title | Replace terminology |
| 7 | `<meta name="description" content="Professional export marketing consulting for international business development...">` | `<meta name="description" content="Professional export marketing consulting for international lead generation...">` | Meta description | Replace terminology |
| 8 | `<meta name="keywords" content="export marketing consulting, international business development, export strategy, global expansion, international sales, market development">` | `<meta name="keywords" content="export marketing consulting, international lead generation, export strategy, global expansion, international sales, market development">` | Meta keywords | Replace terminology |
| 110, 187 | `./fractional-bizdev-team.html` | `./part-time-lead-generation-team.html` | Navigation menu | Update URL |
| Navigation | "Fractional BizDev Team" label (if present) | "Part-Time Lead Generation Team" | Menu text | Update label |

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/overseas-sales-consulting.html`
**Change Type**: Service page
**Changes**: 3 instances + navigation
**Impact**: MEDIUM - Service page SEO

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 6 | `<title>Overseas Sales Consulting \| International Business Development \| Expandia</title>` | `<title>Overseas Sales Consulting \| International Lead Generation \| Expandia</title>` | Page title | Replace terminology |
| 7 | `<meta name="description" content="Expert overseas sales consulting for international business development...">` | `<meta name="description" content="Expert overseas sales consulting for international lead generation...">` | Meta description | Replace terminology |
| 8 | `<meta name="keywords" content="overseas sales consulting, international business development, global sales strategy...">` | `<meta name="keywords" content="overseas sales consulting, international lead generation, global sales strategy...">` | Meta keywords | Replace terminology |
| Navigation | Link to `fractional-bizdev-team.html` | Link to `fractional-lead-generation-team.html` | Menu section | Update URL |

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/international-market-entry.html`
**Change Type**: Service page
**Changes**: 2 instances + navigation
**Impact**: MEDIUM - Service page SEO

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 6 | `<title>International Market Entry \| Business Development Consulting \| Expandia</title>` | `<title>International Market Entry \| Lead Generation Consulting \| Expandia</title>` | Page title | Replace terminology |
| 8 | Keywords: "international market entry, business development consulting..." | "international market entry, lead generation consulting..." | Meta keywords | Replace terminology |
| Navigation | Link to `fractional-bizdev-team.html` | Link to `fractional-lead-generation-team.html` | Menu section | Update URL |

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/europe-market-entry.html`
**Change Type**: Service page
**Changes**: 2 instances + navigation
**Impact**: MEDIUM - Service page SEO

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 6 | `<title>Europe Market Entry \| Business Development Consulting \| Expandia</title>` | `<title>Europe Market Entry \| Lead Generation Consulting \| Expandia</title>` | Page title | Replace terminology |
| 8 | Keywords: "Europe market entry, business development consulting..." | "Europe market entry, lead generation consulting..." | Meta keywords | Replace terminology |
| Navigation | Link to `fractional-bizdev-team.html` | Link to `fractional-lead-generation-team.html` | Menu section | Update URL |

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/distributor-finding.html`
**Change Type**: Service page
**Changes**: 2 instances + navigation
**Impact**: MEDIUM - Service page SEO

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 8 | Keywords: "distributor finding, international business development..." | "distributor finding, international lead generation..." | Meta keywords | Replace terminology |
| Navigation | Link to `fractional-bizdev-team.html` | Link to `fractional-lead-generation-team.html` | Menu section | Update URL |

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/blog/what-is-lead-generation-complete-guide.html`
**Change Type**: Blog article
**Changes**: 5+ instances
**Impact**: MEDIUM - Blog content

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 101 | `<li><a href="../fractional-bizdev-team.html" class="text-sm pl-8">👥 Fractional BizDev Team</a></li>` | `<li><a href="../fractional-lead-generation-team.html" class="text-sm pl-8">👥 Fractional Lead Generation Team</a></li>` | Navigation | Update link + label |
| 167 | Navigation link to `fractional-bizdev-team.html` | Update to `fractional-lead-generation-team.html` | Menu | Update URL |
| 561 | `<p class="text-sm">Many companies assign business development tasks to sales reps...` | Keep as is (contextual reference) | Body text | No change (contextual) |

---

### 4. LOW PRIORITY FILES

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/vision-mission.html`
**Change Type**: Core page
**Changes**: 1 instance + navigation links
**Impact**: LOW - Core page with 1 instance

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 357 | `"We strive to transform the way companies approach business development by combining..."` | `"We strive to transform the way companies approach lead generation by combining..."` | Mission statement | Replace terminology |
| Navigation | Link to `fractional-bizdev-team.html` (appears at lines ~110, 187) | Link to `fractional-lead-generation-team.html` | Menu | Update URL |

---

#### FILE: `/Users/oguzhanocak/Downloads/expandia_web/blog/digital-agency-marketing-guide.html`
**Change Type**: Blog article
**Changes**: 3 instances
**Impact**: LOW - Supporting blog content

| Line | Current Text | New Text | Section | Type |
|------|---|---|---|---|
| 352 | "business development" reference | "lead generation" | Body text | Replace terminology |
| 356 | "business development" reference | "lead generation" | Body text | Replace terminology |
| 660 | "business development" reference | "lead generation" | Body text | Replace terminology |

---

### 5. NAVIGATION LINKS CONSISTENCY

**Files with Navigation Menus Pointing to `fractional-bizdev-team.html`:**

These 18+ pages have the same navigation menu component and need link updates:

1. `/Users/oguzhanocak/Downloads/expandia_web/index.html` - Lines 99, 110, 187 (and more)
2. `/Users/oguzhanocak/Downloads/expandia_web/solutions.html` - Lines 99, 110, 187 (and more)
3. `/Users/oguzhanocak/Downloads/expandia_web/onboarding.html` - Lines 110, 187
4. `/Users/oguzhanocak/Downloads/expandia_web/b2b-lead-generation-agency.html` - Lines 110, 187
5. `/Users/oguzhanocak/Downloads/expandia_web/cold-email-agency.html` - Lines 110, 187
6. `/Users/oguzhanocak/Downloads/expandia_web/about.html` - Lines 110, 187, 525
7. `/Users/oguzhanocak/Downloads/expandia_web/lead-generation-service.html` - Lines 110, 187
8. `/Users/oguzhanocak/Downloads/expandia_web/case-studies.html` - Lines 110, 187
9. `/Users/oguzhanocak/Downloads/expandia_web/our-ethical-principles.html` - Lines 110, 187
10. `/Users/oguzhanocak/Downloads/expandia_web/appointment-setting-service.html` - Lines 110, 187
11. `/Users/oguzhanocak/Downloads/expandia_web/market-accelerator-program.html` - Lines 110, 187
12. `/Users/oguzhanocak/Downloads/expandia_web/market-foundation-program.html` - Lines 110, 187
13. `/Users/oguzhanocak/Downloads/expandia_web/contact.html` - Lines 110, 187
14. `/Users/oguzhanocak/Downloads/expandia_web/outbound-marketing-agency.html` - Lines 110, 187
15. `/Users/oguzhanocak/Downloads/expandia_web/prospect-finding-service.html` - Lines 110, 187
16. `/Users/oguzhanocak/Downloads/expandia_web/sales-development-agency.html` - Lines 110, 187
17. `/Users/oguzhanocak/Downloads/expandia_web/outsourced-sales-team-service.html` - Lines 110, 187

**Also Have Navigation Menu (with "Fractional BizDev Team" in display text):**
- `/Users/oguzhanocak/Downloads/expandia_web/export-marketing-consulting.html`
- `/Users/oguzhanocak/Downloads/expandia_web/corporate-digital-gifting.html`
- `/Users/oguzhanocak/Downloads/expandia_web/usa-pr-service.html`
- `/Users/oguzhanocak/Downloads/expandia_web/email-marketing-management.html`
- `/Users/oguzhanocak/Downloads/expandia_web/email-automation.html`
- `/Users/oguzhanocak/Downloads/expandia_web/europe-market-entry.html`
- `/Users/oguzhanocak/Downloads/expandia_web/international-market-entry.html`

**Navigation Update Pattern** (applies to all above):
```html
Old: <li><a href="./fractional-bizdev-team.html" class="text-sm pl-8">👥 Fractional BizDev Team</a></li>
New: <li><a href="./part-time-lead-generation-team.html" class="text-sm pl-8">👥 Part-Time Lead Generation Team</a></li>
```

**Implementation Strategy**:
- If these pages are generated from a template, update the template once
- If they're individual files, search & replace across all 18+ files
- **Use a global find & replace**:
  - Old: `./fractional-bizdev-team.html`
  - New: `./part-time-lead-generation-team.html`
  - Also replace: `Fractional BizDev Team` → `Part-Time Lead Generation Team` in link labels

---

## IMPLEMENTATION APPROACH (APPROVED)

### Step 1: Rename Template Files
1. Rename `/templates/fractional-bizdev-team.html` → `/templates/part-time-lead-generation-team.html`
2. Update all URLs and titles within the template:
   - Page title: "Fractional Lead Generation Team" → "Part-Time Lead Generation Team"
   - Canonical, hreflang, og:url: Update to `part-time-lead-generation-team.html`
   - Keywords: "fractional lead generation" → "part-time lead generation"

### Step 2: Update Build Configuration
1. Edit `build-pages.js`:
   - Update 15 instances of "business development" to "lead generation" in metadata
   - Ensure the renamed template is referenced correctly
   - Run build to regenerate pages

### Step 3: Bulk Update Blog Templates & Navigation
1. Update `/templates/blog/what-is-business-development-complete-guide.html`:
   - **Completely rewrite** to focus on lead generation
   - Update page title to "What is Lead Generation?"
   - Rewrite body content (~70%)
   - Update navigation links to `../part-time-lead-generation-team.html`
   - Update CTA to point to Part-Time Lead Generation Team

### Step 4: Update Service Page Meta Tags
1. Edit 5 service pages:
   - export-marketing-consulting.html - Update title/description/keywords
   - overseas-sales-consulting.html - Update title/description/keywords
   - international-market-entry.html - Update title/keywords
   - europe-market-entry.html - Update title/keywords
   - distributor-finding.html - Update keywords

### Step 5: Bulk Global Search & Replace (Navigation Links)
1. Search & replace across ALL HTML files:
   - Search: `./fractional-bizdev-team.html`
   - Replace: `./part-time-lead-generation-team.html`
2. Search & replace navigation labels:
   - Search: `Fractional BizDev Team`
   - Replace: `Part-Time Lead Generation Team`

### Step 6: Update Core Pages
1. Edit vision-mission.html - Replace "business development" with "lead generation" (line 357)
2. Verify index.html and solutions.html have correct navigation links

### Step 7: Update Blog Articles
1. Edit blog/what-is-business-development-complete-guide.html - Apply same rewrite as template
2. Edit blog/what-is-lead-generation-complete-guide.html - Update navigation links
3. Edit blog/digital-agency-marketing-guide.html - Replace 3 instances of "business development"

### Step 8: Post-Implementation Tasks (Per User Preferences)
1. **NO 301 redirects** (direct migration per user preference)
2. **NO server.js changes** (keep proposal system as-is per user preference)
3. Delete old `/fractional-bizdev-team.html` file after verification
4. Test all navigation links
5. Verify build-pages.js generates files correctly with new template name

---

## SUMMARY TABLE

| File | Category | Changes | Priority | Status |
|------|----------|---------|----------|---|
| templates/fractional-bizdev-team.html | Template | Rename file + update titles/URLs/keywords | CRITICAL | Rename to `part-time-lead-generation-team.html` |
| build-pages.js | Config | 15 instances | CRITICAL | Update BD→LG in metadata |
| fractional-bizdev-team.html | Main page | Delete after new file created | CRITICAL | Auto-generated from new template |
| blog/what-is-business-development-guide.html | Blog | **Complete rewrite** | HIGH | Rewrite to focus on lead generation |
| templates/blog/what-is-business-development-guide.html | Blog Template | **Complete rewrite** | HIGH | Rewrite to focus on lead generation |
| index.html | Core page | Navigation links | HIGH | Replace URL + labels (bulk) |
| solutions.html | Core page | Navigation links | HIGH | Replace URL + labels (bulk) |
| export-marketing-consulting.html | Service page | 3 meta + nav | MEDIUM | Title/description/keywords/links |
| overseas-sales-consulting.html | Service page | 3 meta + nav | MEDIUM | Title/description/keywords/links |
| international-market-entry.html | Service page | 2 meta + nav | MEDIUM | Title/keywords/links |
| europe-market-entry.html | Service page | 2 meta + nav | MEDIUM | Title/keywords/links |
| distributor-finding.html | Service page | 2 meta + nav | MEDIUM | Keywords/links |
| blog/what-is-lead-generation-guide.html | Blog | Navigation links | MEDIUM | Update URL references |
| vision-mission.html | Core page | 1 text + nav | LOW | Replace BD→LG + links |
| digital-agency-marketing-guide.html | Blog | 3 instances | LOW | Replace BD→LG |
| **18+ other service pages** | Nav links | Navigation links | BULK | Global search & replace |
| ~~server.js~~ | ~~Config~~ | ~~NO CHANGES~~ | N/A | Skipped (user preference) |
| ~~gemini-service.js~~ | ~~Config~~ | ~~NO CHANGES~~ | N/A | Skipped (user preference) |

---

## APPROVAL CHECKLIST - APPROVED ✓

All decisions have been approved by the user:

- [x] **Terminology Decision**: "Part-Time Lead Generation Team" naming (instead of "Fractional")
- [x] **File Rename Decision**: Rename `fractional-bizdev-team.html` to `part-time-lead-generation-team.html`
- [x] **Blog Strategy Decision**: Completely rewrite "What is Business Development" article to focus on lead generation
- [x] **Service Page Strategy**: Update all service page titles to use "lead generation" instead of "business development"
- [x] **Redirect Planning**: NO 301 redirects needed (direct migration)
- [x] **Server Config**: NO changes to server.js or gemini-service.js

---

## NEXT STEPS - READY FOR IMPLEMENTATION

All decisions approved. Ready to begin Phase 1 implementation:

**Implementation will proceed in this order:**

1. **Step 1**: Rename and update `/templates/fractional-bizdev-team.html` → `/templates/part-time-lead-generation-team.html`
2. **Step 2**: Update `build-pages.js` with "lead generation" terminology
3. **Step 3**: Completely rewrite blog "What is Business Development" article and template
4. **Step 4**: Update 5 service pages (export, overseas, international, Europe, distributor)
5. **Step 5**: Bulk search & replace navigation links across all 18+ pages
6. **Step 6**: Update core pages (vision-mission, index, solutions)
7. **Step 7**: Update supporting blog articles
8. **Step 8**: Final verification and testing

**Ready to start? Confirm and I will begin implementation now.**
