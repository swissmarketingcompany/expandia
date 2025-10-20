# Master Template System - Visual Guide

## 🎨 What You'll See

### Master Template Manager Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│  🧠 System Prompt  ✨ Generate Offers  🚪 Logout                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  LEFT PANEL                          │  RIGHT PANEL                  │
│  ┌─────────────────────────┐        │  ┌─────────────────────────┐ │
│  │ 🎨 Master HTML Template │        │  │ 👁️ Live Preview        │ │
│  │                         │        │  │                         │ │
│  │ [Editable Textarea]     │        │  │ [Live HTML Preview]     │ │
│  │                         │        │  │                         │ │
│  │ [Can edit header,       │        │  │ Updates as you edit     │ │
│  │  footer, colors,        │        │  │                         │ │
│  │  placeholders]          │        │  │ 🔄 Refresh Preview     │ │
│  │                         │        │  │ 💾 Save Template       │ │
│  │                         │        │  │ 🔄 Reset Default       │ │
│  │ 💾 Save | 🔄 Reset     │        │  │                         │ │
│  └─────────────────────────┘        │  └─────────────────────────┘ │
│                                                                       │
│  PLACEHOLDER GUIDE                                                   │
│  ├─ [CLIENT_NAME] - Company name                                   │
│  ├─ [OFFER_TITLE] - Proposal title                                │
│  ├─ [EXECUTIVE_SUMMARY] - Problem → Solution → Value             │
│  ├─ [SERVICES_PACKAGES] - Service cards with pricing             │
│  ├─ [TIMELINE] - Implementation phases                           │
│  ├─ [VALUE_METRICS] - Expected results & ROI                    │
│  └─ [TERMS_CONDITIONS] - Payment terms & SLAs                   │
└─────────────────────────────────────────────────────────────────────┘
```

## 📄 Proposal Structure (Master Template)

```
┌──────────────────────────────────────────────┐
│ HEADER (Static)                              │
│ ┌────────────────────────────────────────┐  │
│ │ [e]xpandia Logo  |  CLIENT NAME        │  │
│ │ Business Dev & Sales as a Service      │  │
│ │ Prepared: October 20, 2025             │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│ TITLE SECTION (Auto-filled)                 │
│ ┌────────────────────────────────────────┐  │
│ │ [OFFER_TITLE]                          │  │
│ │ A tailored growth strategy for [CLIENT]│  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│ EXECUTIVE SUMMARY (AI Fills)                │
│ ┌────────────────────────────────────────┐  │
│ │ [EXECUTIVE_SUMMARY]                    │  │
│ │ ← AI generates Problem→Solution→Value →│  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│ OUR SERVICES & PACKAGES (AI Fills)          │
│ ┌────────────────────────────────────────┐  │
│ │ [SERVICES_PACKAGES]                    │  │
│ │ ← AI generates service cards →         │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│ TIMELINE & PHASES (AI Fills)                │
│ ┌────────────────────────────────────────┐  │
│ │ [TIMELINE]                             │  │
│ │ ← AI generates phases →                │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│ EXPECTED RESULTS & METRICS (AI Fills)       │
│ ┌────────────────────────────────────────┐  │
│ │ [VALUE_METRICS]                        │  │
│ │ ← AI generates ROI & success metrics →│  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│ TERMS & CONDITIONS (AI Fills)               │
│ ┌────────────────────────────────────────┐  │
│ │ [TERMS_CONDITIONS]                     │  │
│ │ ← AI generates payment terms →         │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│ CTA SECTION (Static)                        │
│ ┌────────────────────────────────────────┐  │
│ │ Ready to Get Started?                  │  │
│ │ hello@expandia.ch | +41 77 810 72 64  │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│ FOOTER (Static)                              │
│ © 2025 Expandia.ch — Remova Inc, Delaware   │
│ Business Development & Sales as a Service    │
│ Confidential & for authorized use only      │
└──────────────────────────────────────────────┘
```

## 🎯 Three Dashboards

### Dashboard 1: Master Template Manager
```
http://127.0.0.1:6161/admin/master-template

Purpose: Define the structure and branding
Edit:    HTML, header, footer, colors, placeholders
Preview: Live HTML rendering
Scope:   Affects ALL future proposals
```

### Dashboard 2: System Prompt Manager
```
http://127.0.0.1:6161/admin/system-prompt

Purpose: Tell AI how to think and write
Edit:    Philosophy, services, tone, style guidelines
Preview: Text-based preview
Scope:   Affects AI content generation
```

### Dashboard 3: Proposal Generator
```
http://127.0.0.1:6161/admin/generate-offer

Purpose: Create individual proposals
Input:   Client name, title, brief description
Process: AI fills master template with content
Output:  Complete, ready-to-share proposal
```

## 🔄 Generation Flow

```
YOU (Admin)                  SYSTEM                      AI (Gemini)
    │                           │                             │
    ├─ Write brief ─────────────>│                             │
    │                           │                             │
    │                      Load Master Template               │
    │                      Load System Prompt                 │
    │                           │                             │
    │                      For each placeholder:              │
    │                           ├──────────────> Generate content
    │                           │         ┌─────<
    │                      Replace placeholder
    │                      [delay to avoid rate limiting]
    │                           │                             │
    │              Complete HTML ├─────────────────────────────┤
    │<──── Proposal ready ────────┤
    │
    ├─ Review proposal
    │
    ├─ (Optional) Refine ───────>│  Load current HTML
    │                           │  ├──────────────> Generate refinement
    │                           │         ┌─────<
    │                           │  Replace with refined version
    │<──── Updated ───────────────┤
    │
    └─ Save with password
       Get unique link
       Ready to share with client!
```

## 💾 Data Flow

```
Browser
  │
  ├─ Admin Authentication
  │  ├─ POST /api/admin/verify
  │  └─ Store in sessionStorage
  │
  ├─ Load Master Template
  │  └─ GET /api/admin/master-template
  │
  ├─ Load System Prompt
  │  └─ GET /api/admin/system-prompt
  │
  ├─ Generate Proposal
  │  ├─ User writes brief in form
  │  ├─ POST /api/admin/generate-offer
  │  │   ├─ Fetch Master Template from storage
  │  │   ├─ Fetch System Prompt from storage
  │  │   │
  │  │   └─ For each placeholder:
  │  │       └─ Call Gemini API
  │  │           ├─ System Prompt (controls tone/behavior)
  │  │           ├─ Placeholder guide (what to generate)
  │  │           └─ User brief (what to include)
  │  │
  │  └─ Replace all placeholders in master template
  │     └─ Return complete HTML
  │
  ├─ Save Proposal
  │  ├─ POST /api/admin/create-offer
  │  └─ Save as JSON in /offers folder
  │
  └─ Client views proposal
     └─ GET /proposals/[unique-id]
        ├─ Authentication (password)
        └─ Display saved HTML
```

## 🎨 Color Scheme

```
Primary Colors:
┌──────────────┐
│ #e0a82e      │  Gold accent (buttons, highlights)
└──────────────┘
┌──────────────┐
│ #18182f      │  Dark navy (header, footer, backgrounds)
└──────────────┘

Usage in Template:
- Header background: #18182f
- Section titles: #18182f (dark) with border-bottom #e0a82e
- CTA button: gradient from #e0a82e to #f5b855
- Accents: #e0a82e throughout
- Text: #1f2937 (dark gray)
- Backgrounds: #f8fafc (light gray)
```

## 📱 Responsive Design

```
Desktop (1024px+)
┌─────────────────────────────────┐
│  Master Template   │   Preview   │
│  [Edit Panel]      │  [Live]     │
│  1/2 width         │  1/2 width  │
└─────────────────────────────────┘

Mobile (< 1024px)
┌──────────────────────────────────┐
│  Master Template                 │
│  [Edit Panel - Full Width]       │
├──────────────────────────────────┤
│  Preview                         │
│  [Live Preview - Full Width]     │
└──────────────────────────────────┘
```

## 🚀 Proposal Generation Speed

```
Step 1: Load Master Template       [Fast - <100ms]
Step 2: Replace Client Name        [Fast - <10ms]
Step 3: Replace Offer Title        [Fast - <10ms]

Step 4: Generate [EXECUTIVE_SUMMARY]  [Slow - 8-12s] ⏳
Step 5: Replace in template            [Fast - <10ms]
Step 6: Delay to avoid rate limit      [Pause - 500ms]

Step 7: Generate [SERVICES_PACKAGES]   [Slow - 8-12s] ⏳
Step 8: Replace in template            [Fast - <10ms]
Step 9: Delay                          [Pause - 500ms]

... (repeat for TIMELINE, VALUE_METRICS, TERMS_CONDITIONS)

Total Time: ~60-80 seconds for complete proposal ⏱️

Why the delays? To avoid overwhelming Gemini API's rate limits.
```

## 🔐 Admin Authentication

```
User visits /admin/master-template
        │
        ├─ Password required?
        │
        ├─ NO → Redirect to auth screen
        │
        └─ YES → Store in sessionStorage
           
           Persist across:
           - Master Template Manager
           - System Prompt Manager
           - Proposal Generator
           
           Clear on:
           - Click Logout button
           - Browser close (sessionStorage)
```

## 📊 Files Modified/Created

```
NEW FILES:
├── admin/master-template.html
└── MASTER-TEMPLATE-*.md files

MODIFIED FILES:
├── server.js
│   ├── Added: masterTemplateStorage variable
│   ├── Added: GET /api/admin/master-template
│   ├── Added: POST /api/admin/master-template
│   ├── Updated: POST /api/admin/generate-offer
│   └── Added: getDefaultMasterTemplate()
│
└── gemini-service.js
    ├── Added: generateTemplateContent()
    └── Added: generateProposalFromTemplate()
```

---

**Visual Summary:** Master Template = Container | System Prompt = Intelligence | Placeholders = AI Fill Points
