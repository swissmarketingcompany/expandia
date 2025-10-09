# Cornerstone Content Template & Guidelines

**Based on:** `what-is-business-development-complete-guide.html`  
**Created:** January 2025  
**Purpose:** Template for creating comprehensive, SEO-optimized, conversion-focused blog posts

---

## 📋 Template Overview

This template creates **5,000+ word comprehensive guides** that:
- Rank #1 on Google for target keywords
- Convert readers into leads
- Engage both humans and LLMs (AI assistants)
- Provide genuine value while driving business goals

---

## 🎯 Core Principles

### 1. **Length & Depth**
- **Minimum:** 5,000 words
- **Target:** 5,000-7,000 words
- **Why:** Comprehensive coverage beats shallow content
- **Quality over quantity:** Every section must provide value

### 2. **Dual Optimization**
- **For Search Engines:** Technical SEO, keywords, schema markup
- **For Humans:** Readability, visuals, clear structure
- **For LLMs:** Question-answer format, clear sections, factual accuracy

### 3. **Conversion Focus**
- **Goal:** Convert readers into leads/customers
- **Method:** Strategic CTAs, assessment forms, value demonstration
- **Balance:** 80% education, 20% promotion

---

## 📐 Required Structure

### A. HTML Head Elements

```html
<!-- Essential Meta Tags -->
<title>Keyword-Rich Title | Expandia</title>
<meta name="description" content="Compelling 155-160 character description with main keyword">
<meta name="keywords" content="primary keyword, secondary keyword, related terms">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="author" content="Expandia">

<!-- Open Graph (Social Sharing) -->
<meta property="og:type" content="article">
<meta property="og:title" content="Title for social sharing">
<meta property="og:description" content="Description for social sharing">
<meta property="og:url" content="https://www.expandia.ch/blog/article-url.html">
<meta property="og:image" content="https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Twitter-optimized title">
<meta name="twitter:description" content="Twitter-optimized description">
<meta name="twitter:image" content="https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png">

<!-- Hreflang (International SEO) -->
<link rel="alternate" hreflang="en" href="https://www.expandia.ch/blog/article-url.html">
<link rel="alternate" hreflang="x-default" href="https://www.expandia.ch/blog/article-url.html">

<!-- Canonical URL -->
<link rel="canonical" href="https://www.expandia.ch/blog/article-url.html" />
```

### B. Schema Markup (JSON-LD)

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Article Title",
    "description": "Article description",
    "author": {
        "@type": "Organization",
        "name": "Expandia",
        "url": "https://www.expandia.ch",
        "sameAs": ["https://www.linkedin.com/company/expandia-ch/"]
    },
    "publisher": {
        "@type": "Organization",
        "name": "Expandia",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.expandia.ch/Expandia-main-logo-koyu-yesil.png"
        }
    },
    "datePublished": "2025-01-15",
    "dateModified": "2025-01-15",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.expandia.ch/blog/article-url.html"
    },
    "articleSection": "Topic Category",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "wordCount": 5000,
    "timeRequired": "PT25M"
}
</script>
```

### C. Article Structure

#### 1. **Header Section**
```html
<header class="text-center mb-12">
    <div class="badge badge-primary mb-4">📈 Complete Guide</div>
    <h1 class="text-4xl md:text-5xl font-bold mb-6 gradient-header">
        Main Title: What is [Topic]? The Complete Guide for 2025
    </h1>
    <p class="text-xl text-base-content/80 max-w-3xl mx-auto mb-8">
        Compelling subtitle that explains what readers will learn
    </p>
    <div class="flex flex-wrap justify-center gap-4 text-sm text-base-content/60">
        <span>📅 Published: Month Day, Year</span>
        <span>⏱️ 25 min read</span>
        <span>📊 5,000 words</span>
        <span>🎯 Expert Guide</span>
    </div>
</header>
```

#### 2. **Quick Navigation (TOC)**
```html
<div class="card bg-base-200 mb-12">
    <div class="card-body">
        <h2 class="card-title text-lg mb-4">📑 Quick Navigation</h2>
        <div class="grid md:grid-cols-2 gap-2 text-sm">
            <a href="#section1" class="link link-primary">→ Section 1</a>
            <a href="#section2" class="link link-primary">→ Section 2</a>
            <!-- Add all major sections -->
        </div>
    </div>
</div>
```

#### 3. **Introduction with Stats**
- **Alert box** highlighting why the topic matters
- **Lead paragraph** (text-xl) that hooks readers
- **2-3 paragraphs** establishing context
- **Statistics dashboard** with 4 key metrics

#### 4. **Visual Elements Throughout**
- **Hero image** after introduction (Unsplash/Pexels)
- **Section images** before major sections (5-7 total)
- **Diagrams/illustrations** using SVG or simple HTML/CSS
- **Charts/visualizations** for data presentation
- **Process flows** for step-by-step content

#### 5. **Main Content Sections** (7-10 sections)
- Clear H2 headings with emoji icons
- 500-800 words per section
- Mix of paragraphs, lists, tables, cards
- Real examples and case studies
- Actionable insights

#### 6. **Interactive Elements**
- **Self-assessment** with checkboxes
- **Collapsible sections** for detailed information
- **Comparison tables** (features, options, etc.)
- **Timeline visualizations** for processes

#### 7. **Conversion Points** (3 locations)

**Mid-Article CTA (after ~40% of content):**
```html
<div class="card bg-primary shadow-xl my-12">
    <div class="card-body text-center text-white">
        <h3 class="text-2xl font-bold mb-4 text-white">🚀 Relevant Service Headline</h3>
        <p class="text-lg mb-6">Value proposition paragraph</p>
        <div class="flex flex-wrap gap-4 justify-center">
            <a href="../service-page.html" class="btn btn-accent btn-lg">Primary CTA</a>
            <a href="../contact.html" class="btn btn-outline btn-lg text-white hover:bg-white hover:text-primary border-white">Secondary CTA</a>
        </div>
    </div>
</div>
```

**Assessment Form (after ~70% of content):**
```html
<div class="card bg-base-200 my-12 border-2 border-primary">
    <div class="card-body">
        <h3 class="text-2xl font-bold mb-4">📊 Free [Topic] Assessment</h3>
        <p class="mb-6">Compelling description of what they'll get</p>
        <form class="space-y-4" action="/api/contact" method="POST">
            <!-- Name, Email, Company, Dropdown, Math Verification -->
            <button type="submit" class="btn btn-primary btn-lg w-full">Get Free Assessment</button>
        </form>
    </div>
</div>
```

**Final CTA (before conclusion):**
```html
<div class="card bg-primary shadow-xl my-12">
    <div class="card-body text-center text-white">
        <h2 class="text-3xl font-bold mb-4 text-white">Ready to [Desired Outcome]?</h2>
        <p class="text-lg mb-6">Summary of services and benefits</p>
        <div class="grid md:grid-cols-3 gap-4 mb-8 text-left">
            <!-- 3 service highlights -->
        </div>
        <div class="flex flex-wrap gap-4 justify-center">
            <a href="../contact.html" class="btn btn-accent btn-lg">Primary Action</a>
            <a href="../solutions.html" class="btn btn-outline btn-lg">Secondary Action</a>
        </div>
    </div>
</div>
```

#### 8. **FAQ Section** (8-10 questions)
```html
<h2 id="faq">❓ Frequently Asked Questions</h2>
<div class="space-y-4 my-8">
    <details class="collapse collapse-arrow bg-base-200">
        <summary class="collapse-title text-lg font-medium cursor-pointer">
            Question text?
        </summary>
        <div class="collapse-content">
            <p class="pt-4">Comprehensive answer with specific details and examples.</p>
        </div>
    </details>
    <!-- Repeat for each FAQ -->
</div>
```

#### 9. **Related Resources**
```html
<div class="card bg-base-200 my-12">
    <div class="card-body">
        <h2 class="card-title text-2xl mb-4">📚 Related Resources & Reading</h2>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
                <h3 class="font-bold mb-2">📖 Recommended Books</h3>
                <ul><!-- External book links --></ul>
            </div>
            <div>
                <h3 class="font-bold mb-2">🔗 Our Service Pages</h3>
                <ul><!-- Internal service links --></ul>
            </div>
        </div>
    </div>
</div>
```

#### 10. **Conclusion**
- Recap key points
- Next steps box with 4 action items
- Final CTA
- Social sharing links
- Author/date information

#### 11. **Related Articles** (at the very end)
```html
<div class="grid md:grid-cols-3 gap-6">
    <!-- 3 related article cards with images, titles, descriptions -->
</div>
```

---

## 🎨 Visual Design Standards

### Color Scheme (Bumblebee DaisyUI)
- **Primary:** Main brand green
- **Accent:** Highlight color for CTAs
- **Base-100:** White/light background
- **Base-200:** Light gray backgrounds
- **Base-300:** Borders and dividers

### Typography
- **H1:** 4xl-5xl, bold, gradient-header class
- **H2:** 2xl-3xl, bold, emoji icon prefix
- **H3:** xl-2xl, semi-bold
- **Body:** Base size (16px), line-height 1.6
- **Lead paragraph:** text-xl

### Spacing
- **Main container:** py-16 (64px top/bottom)
- **Between sections:** my-8 to my-12
- **Cards/boxes:** p-6 to p-8
- **Footer spacer:** py-12 before footer

### Images
- **Source:** Unsplash, Pexels (royalty-free)
- **Size:** w=1200&h=400&fit=crop
- **Format:** class="w-full h-64 object-cover block"
- **Container:** class="rounded-lg overflow-hidden shadow-lg mb-8"
- **Loading:** loading="lazy" for performance
- **Alt text:** Descriptive, keyword-rich

### Cards & Boxes
- **Info alerts:** alert alert-info
- **Warning alerts:** alert alert-warning
- **Success examples:** card bg-success/10 border border-success/30
- **Standard cards:** card bg-base-200

---

## 🔍 SEO Checklist

### On-Page SEO
- ✅ Target keyword in title (front-loaded)
- ✅ Target keyword in meta description
- ✅ Target keyword in H1
- ✅ Target keyword in first 100 words
- ✅ Target keyword in at least 3 H2s
- ✅ Related keywords throughout (natural density)
- ✅ Internal links to 5+ service pages
- ✅ External links to 3+ authority sources
- ✅ Alt text on all images
- ✅ Canonical URL set
- ✅ Schema markup (BlogPosting)

### Technical SEO
- ✅ Mobile responsive
- ✅ Fast loading (lazy load images)
- ✅ Clean HTML structure
- ✅ Proper heading hierarchy (H1→H2→H3)
- ✅ Semantic HTML5 elements
- ✅ No broken links
- ✅ HTTPS (secure)

### Content SEO
- ✅ Answers user intent completely
- ✅ Covers topic comprehensively
- ✅ Unique, original content
- ✅ Updated date shown
- ✅ Author attribution
- ✅ E-E-A-T signals (Experience, Expertise, Authority, Trust)

### Engagement SEO
- ✅ Table of contents for easy navigation
- ✅ Short paragraphs (2-3 sentences)
- ✅ Bullet points and lists
- ✅ Visual breaks (images, diagrams)
- ✅ Interactive elements
- ✅ Clear CTAs

---

## 📊 Content Requirements

### Word Count Distribution
- **Introduction:** 300-500 words
- **Each main section:** 500-800 words
- **FAQ section:** 800-1,200 words (8-10 Q&As)
- **Conclusion:** 300-500 words
- **Total:** 5,000-7,000 words

### Link Requirements
- **Internal links:** 8-12 (service pages, related content)
- **External links:** 3-5 (authority sources, studies, books)
- **CTA links:** 6-8 (buttons and text links to contact/services)

### Visual Requirements
- **Hero image:** 1 (after intro)
- **Section images:** 5-6 (before major sections)
- **Diagrams/charts:** 2-3 (custom HTML/CSS or simple graphics)
- **Icons:** Throughout (emojis or SVG)

### Interactive Requirements
- **Self-assessment:** 1 (checkbox quiz)
- **Collapsible details:** 7-10 (functions, FAQs)
- **Forms:** 1-2 (lead capture)
- **Navigation:** 1 (table of contents)

---

## 🎯 Conversion Optimization

### Placement Strategy
1. **Early hook** (within first 3 paragraphs): What they'll learn + why it matters
2. **Trust building** (stats, examples, case studies)
3. **Value delivery** (comprehensive education)
4. **First CTA** (~40% through): Soft offer, relevant to content
5. **Continued value** (more education)
6. **Assessment form** (~70% through): Lead capture with value exchange
7. **Final CTA** (~90% through): Strong offer with multiple options
8. **Social proof** (related resources, authority links)

### CTA Best Practices
- **Contrast:** Primary CTAs use accent color (stands out)
- **Clarity:** Specific action words ("Get Free Assessment" not "Submit")
- **Urgency:** When appropriate ("Book Free Consultation")
- **Value:** Always explain what they get
- **Options:** Provide multiple paths (primary + secondary buttons)

### Form Best Practices
- **Minimal fields:** Name, Email, Company, One dropdown
- **Verification:** Simple math question (spam prevention)
- **Honeypot:** Hidden website field
- **Clear value:** Explain what they'll receive
- **Privacy:** Reassure data protection

---

## 📝 Writing Guidelines

### Tone & Voice
- **Professional** but conversational
- **Authoritative** but not condescending
- **Helpful** educator, not pushy salesperson
- **Direct** and clear, avoid jargon
- **Example-driven:** Show, don't just tell

### Paragraph Structure
- **Length:** 2-4 sentences max
- **One idea:** per paragraph
- **Lead sentence:** Make it count
- **White space:** Liberal use for readability

### Sentence Structure
- **Variety:** Mix short and long sentences
- **Active voice:** Preferred over passive
- **Power words:** Use sparingly for emphasis
- **Numbers:** Spell out one through nine, use numerals for 10+

### Lists & Bullets
- **Parallel structure:** Start each item the same way
- **Punctuation:** Consistent (all periods or none)
- **Length:** 5-7 items ideal, max 10
- **Formatting:** Strong tags for emphasis

---

## 🔄 Quality Assurance Checklist

Before publishing, verify:

### Content Quality
- [ ] No spelling or grammar errors
- [ ] All claims fact-checked and accurate
- [ ] Examples are real and relevant
- [ ] Statistics are current and sourced
- [ ] No duplicate content from other pages

### Technical Quality
- [ ] All links work (internal and external)
- [ ] All images load properly
- [ ] Forms submit correctly
- [ ] Mobile responsive (test on phone)
- [ ] Fast page load (< 3 seconds)

### SEO Quality
- [ ] Meta tags complete and optimized
- [ ] Schema markup validates
- [ ] Images have alt text
- [ ] Heading hierarchy logical (no skipped levels)
- [ ] Internal linking strategic

### Conversion Quality
- [ ] CTAs prominent and compelling
- [ ] Value proposition clear
- [ ] Multiple conversion paths
- [ ] Forms easy to complete
- [ ] Contact information accessible

### User Experience
- [ ] Easy to scan (headings, bullets, white space)
- [ ] Visual hierarchy clear
- [ ] Navigation intuitive
- [ ] No broken layouts
- [ ] Accessible (contrast, font size)

---

## 📈 Post-Publication

### Promotion
1. Share on LinkedIn (company + personal)
2. Email to newsletter list
3. Add to relevant service pages
4. Internal link from related blog posts
5. Submit to Google Search Console

### Monitoring
- Track rankings for target keywords
- Monitor traffic in Google Analytics
- Check conversion rates on forms
- Review time on page and bounce rate
- Collect user feedback

### Updates
- Review quarterly for accuracy
- Update statistics annually
- Refresh examples as needed
- Add new sections when relevant
- Update "last modified" date

---

## 🎓 Learning From This Template

**Study these aspects of the Business Development guide:**
1. How it structures complex information
2. How it balances education with conversion
3. How it uses visuals to break up text
4. How it creates engagement with interactive elements
5. How it answers questions comprehensively
6. How it positions services naturally
7. How it optimizes for both SEO and readability

**This template works because it:**
- Solves a real problem comprehensively
- Demonstrates expertise credibly
- Builds trust before asking for anything
- Makes conversion easy and valuable
- Creates a reference people bookmark and share

---

## 📁 File Locations

- **Template:** `/templates/blog/what-is-business-development-complete-guide.html`
- **Live page:** `/blog/what-is-business-development-complete-guide.html`
- **This documentation:** `/CORNERSTONE-CONTENT-TEMPLATE.md`

---

## 🚀 Next Steps

When creating new cornerstone content:

1. **Choose topic:** High-value keyword with business impact
2. **Research:** What competitors have, what's missing
3. **Outline:** 8-10 main sections, each addressing a key question
4. **Write:** Follow this template structure exactly
5. **Enhance:** Add custom visuals, real examples, unique insights
6. **Optimize:** Check all SEO elements against this doc
7. **Test:** Review on mobile and desktop
8. **Publish:** Add to blog index as featured
9. **Promote:** Multi-channel distribution
10. **Monitor:** Track performance and iterate

---

**Remember:** The goal is not just to rank #1, but to provide so much value that readers:
1. Trust your expertise
2. Bookmark the page
3. Share it with colleagues
4. Contact you for services

**Quality > Quantity. But in this case, we need both.** 🎯

