import os

# Read navigation and footer
with open('includes/header.html', 'r', encoding='utf-8') as f:
    header_content = f.read()
with open('includes/footer.html', 'r', encoding='utf-8') as f:
    footer_content = f.read()

# Remove the i18n data tags and pre-replace some common nav placeholders
import re
header_content = re.sub(r'\s*data-i18n="[^"]*"', '', header_content)
footer_content = re.sub(r'\s*data-i18n="[^"]*"', '', footer_content)

# Aggressively remove all script tags from includes to avoid duplication
header_content = re.sub(r'<script[\s\S]*?<\/script>', '', header_content)
footer_content = re.sub(r'<script[\s\S]*?<\/script>', '', footer_content)

# Pre-replace some nav placeholders
header_content = header_content.replace('{{VISION_MISSION_PAGE}}', 'vision-mission.html')
header_content = header_content.replace('{{ETHICAL_PRINCIPLES_PAGE}}', 'ethical-principles.html')

template_content = f"""<!DOCTYPE html>
<html lang="en" data-theme="bumblebee">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{{{PAGE_TITLE}}}}</title>
    <meta name="description" content="{{{{PAGE_DESCRIPTION}}}}">
    <meta name="keywords" content="business growth services {{{{CITY_NAME}}}}, {{{{CITY_NAME}}}} business solutions, {{{{COUNTRY_NAME}}}}, B2B sales, IT infrastructure, AI content">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Go Expandia">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{{{CANONICAL_URL}}}}">
    
    <!-- Hreflang Links -->
    <link rel="alternate" hreflang="en" href="https://www.goexpandia.com/{{{{PAGE_URL_EN}}}}">
    <link rel="alternate" hreflang="de" href="https://www.goexpandia.com/{{{{PAGE_URL_DE}}}}">
    <link rel="alternate" hreflang="fr" href="https://www.goexpandia.com/{{{{PAGE_URL_FR}}}}">
    <link rel="alternate" hreflang="x-default" href="https://www.goexpandia.com/{{{{PAGE_URL_EN}}}}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{{{{PAGE_TITLE}}}}">
    <meta property="og:description" content="{{{{PAGE_DESCRIPTION}}}}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{{{CANONICAL_URL}}}}">
    <meta property="og:image" content="https://www.goexpandia.com/go-expandia-logo.png">
    <meta property="og:site_name" content="Go Expandia">
    
    <link href="{{{{BASE_PATH}}}}dist/css/output.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="{{{{BASE_PATH}}}}favicon.ico">
    <link rel="icon" type="image/png" href="{{{{BASE_PATH}}}}favicon.png">
    <link rel="apple-touch-icon" href="{{{{BASE_PATH}}}}favicon.png">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XY2B6K4R6Q"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());
      gtag('config', 'G-XY2B6K4R6Q');
    </script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        .lucide {{ cursor: pointer; }}
        .service-section {{ scroll-margin-top: 120px; }}
        
        /* Spacing improvements */
        .section-spacing {{ margin-bottom: 8rem; }}
        @media (min-width: 1024px) {{
            .section-spacing {{ margin-bottom: 12rem; }}
        }}
        
        /* Animated Icon Wrapper */
        .icon-wrapper {{
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}
        .icon-wrapper:hover {{
            transform: scale(1.1) rotate(5deg);
        }}
        
        /* Floating animation for hero elements */
        @keyframes float {{
            0%, 100% {{ transform: translateY(0); }}
            50% {{ transform: translateY(-15px); }}
        }}
        .animate-float {{
            animation: float 4s ease-in-out infinite;
        }}
        
        /* Hover pulse for buttons */
        @keyframes pulse-subtle {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.85; }}
        }}
        .btn-pulse:hover {{
            animation: pulse-subtle 2s infinite;
        }}

        /* Heading underline decoration */
        .heading-decorated {{
            position: relative;
            display: inline-block;
        }}
        .heading-decorated::after {{
            content: '';
            position: absolute;
            left: 0;
            bottom: -8px;
            width: 60px;
            height: 4px;
            background: hsl(var(--p));
            border-radius: 2px;
        }}
    </style>
</head>
<body class="font-sans text-base-content antialiased">
    <!-- Navigation (Injected) -->
    {header_content}
    
    <!-- Hero Section -->
    <header class="relative overflow-hidden bg-gradient-to-br from-buzz-warm/40 via-base-100 to-base-200 py-24 lg:py-40">
        <div class="container mx-auto px-4 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div class="max-w-2xl">
                    <nav class="flex mb-8" aria-label="Breadcrumb">
                        <ol class="flex items-center space-x-2 text-sm text-base-content/60">
                            <li><a href="{{{{BASE_PATH}}}}index.html" class="hover:text-primary transition-colors">Home</a></li>
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            <li><a href="{{{{BASE_PATH}}}}city-locations.html" class="hover:text-primary transition-colors">Locations</a></li>
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            <li class="font-semibold text-primary" aria-current="page">{{{{CITY_NAME}}}}</li>
                        </ol>
                    </nav>
                    <h1 class="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                        Premium <br><span class="text-primary">Growth</span> Systems <br>in {{{{CITY_NAME}}}}
                    </h1>
                    <p class="text-xl md:text-2xl text-base-content/70 mb-12 leading-relaxed">
                        Dominate your market in {{{{COUNTRY_NAME}}}}. We build the high-performance IT infrastructure, AI content engines, and sales systems that turn {{{{CITY_NAME}}}} businesses into industry leaders.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-6">
                        <a href="{{{{BASE_PATH}}}}contact.html" class="btn btn-primary btn-lg px-8 h-16 text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-105 btn-pulse">
                            Get Started
                        </a>
                        <a href="#solutions" class="btn btn-ghost btn-lg px-8 h-16 text-lg border-base-300 hover:bg-base-200">
                            Explore Solutions
                        </a>
                    </div>
                </div>
                
                <div class="relative hidden lg:block animate-float">
                    <div class="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/50 bg-white rotate-2 bg-base-100">
                        <img src="{{{{HERO_IMAGE}}}}" alt="Business growth in {{{{CITY_NAME}}}}" class="w-full h-full object-cover aspect-video shadow-inner" onerror="this.src='{{{{BASE_PATH}}}}assets/local/default-city.jpg'">
                    </div>
                    <!-- Decorative badges -->
                    <div class="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-base-200 rotate-[-8deg] flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <i data-lucide="award" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-base-content opacity-50">Authorized in</p>
                            <p class="text-sm font-extrabold leading-none">{{{{CITY_NAME}}}}</p>
                        </div>
                    </div>
                    <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-base-200 rotate-[5deg] flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <i data-lucide="trending-up" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-base-content opacity-50">Regional Focus</p>
                            <p class="text-sm font-extrabold leading-none">{{{{REGION_NAME}}}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Background Decor -->
        <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
    </header>

    <main id="solutions" class="py-24 lg:py-40 bg-base-100">
        <div class="container mx-auto px-4">
            <!-- Strategic Overview -->
            <section class="section-spacing max-w-5xl mx-auto">
                <div class="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-bold tracking-widest uppercase mb-6 tracking-widest">Growth Vision</div>
                <h2 class="text-4xl md:text-6xl font-bold mb-12 leading-[1.1]">
                    Integrating the Future of Business into the <span class="heading-decorated"> {{{{CITY_NAME}}}} Heart</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start prose prose-xl max-w-none text-base-content/80">
                    <p class="leading-relaxed">
                        {{{{CITY_NAME}}}} is more than just a coordinate on a map; it's a dynamic marketplace where innovation meets tradition. To thrive here, businesses need more than just tools—they need integrated growth ecosystems. At Go Expandia, we bridge the gap between technical complexity and real-world results.
                    </p>
                    <p class="leading-relaxed">
                        Our presence in {{{{CITY_NAME}}}} ensures that local firms from {{{{COUNTRY_NAME}}}} can access the same world-class infrastructure used by global tech giants. We localized our AI engines and sales protocols specifically for the {{{{REGION_NAME}}}} demographic, ensuring every campaign resonates perfectly with your target audience.
                    </p>
                </div>
            </section>

            <!-- Pillar I: Turnkey IT Infrastructure -->
            <section class="section-spacing border-t border-base-200 pt-24" id="it-infrastructure">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 lg:mb-32">
                    <div class="max-w-2xl">
                        <div class="flex items-center gap-4 mb-6">
                            <span class="text-7xl font-black text-primary/10">I.</span>
                            <h2 class="text-4xl md:text-6xl font-extrabold tracking-tight">Turnkey IT Infrastructure</h2>
                        </div>
                        <p class="text-xl text-base-content/60 leading-relaxed">
                            The foundation of every growth story in {{{{CITY_NAME}}}} starts with a secure, scalable digital backbone.
                        </p>
                    </div>
                    <div class="icon-wrapper w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group">
                        <i data-lucide="server" class="w-12 h-12"></i>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                    <div class="space-y-20 lg:space-y-32">
                        <!-- Service 1 -->
                        <div class="group">
                             <div class="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-content transition-all duration-500 shadow-md">
                                <i data-lucide="shield-check" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-6 tracking-tight">Managed IT & Cyber Services</h3>
                            <p class="text-lg text-base-content/70 leading-relaxed mb-8">
                                24/7 reliability for your {{{{CITY_NAME}}}} operations. We provide proactive monitoring, hardware management, and ironclad security that meets all {{{{COUNTRY_NAME}}}} compliance standards.
                            </p>
                            <a href="{{{{BASE_PATH}}}}managed-it-services.html" class="inline-flex items-center gap-3 font-bold text-primary group-hover:translate-x-2 transition-transform">
                                Explore Managed IT <i data-lucide="move-right" class="w-5 h-5"></i>
                            </a>
                        </div>
                        <!-- Service 2 -->
                        <div class="group">
                            <div class="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-content transition-all duration-500 shadow-md">
                                <i data-lucide="mail-search" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-6 tracking-tight">Email Deliverability Checkup</h3>
                            <p class="text-lg text-base-content/70 leading-relaxed mb-8">
                                Stop going to spam. We audit your technical sending infrastructure in {{{{CITY_NAME}}}} to ensure your messages land in the inbox of your {{{{REGION_NAME}}}} prospects.
                            </p>
                            <a href="{{{{BASE_PATH}}}}email-deliverability-checkup.html" class="inline-flex items-center gap-3 font-bold text-primary group-hover:translate-x-2 transition-transform">
                                Audit Your Inbox <i data-lucide="move-right" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                    <div class="space-y-20 lg:space-y-32">
                        <!-- Service 3 -->
                        <div class="group">
                            <div class="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-content transition-all duration-500 shadow-md">
                                <i data-lucide="cloud" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-6 tracking-tight">Secure Workplace Setup</h3>
                            <p class="text-lg text-base-content/70 leading-relaxed mb-8">
                                Complete Microsoft 365 or Google Workspace migrations tailored for teams in {{{{CITY_NAME}}}}. Seamless collaboration for localized or remote teams.
                            </p>
                            <a href="{{{{BASE_PATH}}}}secure-email-workplace-setup.html" class="inline-flex items-center gap-3 font-bold text-primary group-hover:translate-x-2 transition-transform">
                                Provision Workplace <i data-lucide="move-right" class="w-5 h-5"></i>
                            </a>
                        </div>
                        <!-- Service 4 -->
                        <div class="group">
                            <div class="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-content transition-all duration-500 shadow-md">
                                <i data-lucide="globe" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-6 tracking-tight">Website Care Services</h3>
                            <p class="text-lg text-base-content/70 leading-relaxed mb-8">
                                Your digital storefront in {{{{CITY_NAME}}}} never closes. Daily backups, security updates, and performance optimization for {{{{COUNTRY_NAME}}}}-based companies.
                            </p>
                            <a href="{{{{BASE_PATH}}}}website-care-services.html" class="inline-flex items-center gap-3 font-bold text-primary group-hover:translate-x-2 transition-transform">
                                See Care Plans <i data-lucide="move-right" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Pillar II: Turnkey Growth Infrastructure -->
            <section class="section-spacing border-t border-base-200 pt-24" id="growth-infrastructure">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 lg:mb-32">
                    <div class="max-w-2xl">
                        <div class="flex items-center gap-4 mb-6">
                            <span class="text-7xl font-black text-secondary/10">II.</span>
                            <h2 class="text-4xl md:text-6xl font-extrabold tracking-tight">Turnkey Growth Infrastructure</h2>
                        </div>
                        <p class="text-xl text-base-content/60 leading-relaxed">
                            Data-driven sales acceleration systems optimized for the {{{{REGION_NAME}}}} market landscape.
                        </p>
                    </div>
                    <div class="icon-wrapper w-24 h-24 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <i data-lucide="trending-up" class="w-12 h-12"></i>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                    <div class="space-y-20 lg:space-y-32">
                        <!-- Service 5 -->
                        <div class="group">
                             <div class="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-secondary-content transition-all duration-500 shadow-md">
                                <i data-lucide="cpu" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-6 tracking-tight">Cold Email Infrastructure</h3>
                            <p class="text-lg text-base-content/70 leading-relaxed mb-8">
                                High-volume, high-deliverability outreach. We build systems in {{{{CITY_NAME}}}} that bypass spam filters and hit the active inboxes of your buyer personas.
                            </p>
                            <a href="{{{{BASE_PATH}}}}cold-email-infrastructure.html" class="inline-flex items-center gap-3 font-bold text-secondary group-hover:translate-x-2 transition-transform">
                                Build Your Engine <i data-lucide="move-right" class="w-5 h-5"></i>
                            </a>
                        </div>
                        <!-- Service 6 -->
                        <div class="group">
                            <div class="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-secondary-content transition-all duration-500 shadow-md">
                                <i data-lucide="database" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-6 tracking-tight">RevOps & CRM Infrastructure</h3>
                            <p class="text-lg text-base-content/70 leading-relaxed mb-8">
                                Aligning your marketing and sales data. We implement enterprise-grade CRMs tailored for the {{{{CITY_NAME}}}} sales cycle and {{{{COUNTRY_NAME}}}} market behavior.
                            </p>
                            <a href="{{{{BASE_PATH}}}}revops-infrastructure.html" class="inline-flex items-center gap-3 font-bold text-secondary group-hover:translate-x-2 transition-transform">
                                Optimize RevOps <i data-lucide="move-right" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                    <div class="space-y-20 lg:space-y-32">
                        <!-- Service 7 -->
                        <div class="group">
                            <div class="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-secondary-content transition-all duration-500 shadow-md">
                                <i data-lucide="list-checks" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-6 tracking-tight">Verified Lead List Generation</h3>
                            <p class="text-lg text-base-content/70 leading-relaxed mb-8">
                                Manually verified leads with < 3% bounce rate. Targeted data for {{{{CITY_NAME}}}} business owners looking to scale quickly in {{{{COUNTRY_NAME}}}}.
                            </p>
                            <a href="{{{{BASE_PATH}}}}verified-lead-list.html" class="inline-flex items-center gap-3 font-bold text-secondary group-hover:translate-x-2 transition-transform">
                                Get Lead Lists <i data-lucide="move-right" class="w-5 h-5"></i>
                            </a>
                        </div>
                        <!-- Service 8 -->
                        <div class="group p-10 rounded-[2rem] bg-secondary/5 border border-secondary/10">
                            <h3 class="text-3xl font-bold mb-4 tracking-tight leading-tight">Full Scale Growth Transformation</h3>
                            <p class="text-lg text-base-content/70 mb-8 italic">
                                For most {{{{CITY_NAME}}}} businesses, we recommend the complete Turnkey Growth Infrastructure package.
                            </p>
                            <a href="{{{{BASE_PATH}}}}turnkey-growth-infrastructure.html" class="btn btn-secondary btn-md rounded-2xl px-10 btn-pulse">
                                View Full Package
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- PILLAR III-VI Condensed for Visual richness -->
             <section class="section-spacing grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                <!-- AI CONTENT -->
                <div class="p-12 lg:p-20 rounded-[3rem] bg-neutral/5 border border-neutral/10 relative overflow-hidden group">
                    <div class="relative z-10">
                        <div class="flex items-center gap-4 mb-10">
                            <span class="text-5xl font-black text-neutral/20">III.</span>
                            <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">AI Content</h2>
                        </div>
                        <p class="text-xl text-base-content/60 leading-relaxed mb-12">
                            Transforming your {{{{CITY_NAME}}}} brand into a content powerhouse with automated AI text, image, and video workflows.
                        </p>
                        <div class="space-y-6">
                            <a href="{{{{BASE_PATH}}}}written-content-engine.html" class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white transition-all shadow-sm">
                                <i data-lucide="file-text" class="w-6 h-6 text-neutral"></i>
                                <span class="font-bold">Written Content Engine</span>
                            </a>
                            <a href="{{{{BASE_PATH}}}}video-content-engine.html" class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white transition-all shadow-sm">
                                <i data-lucide="video" class="w-6 h-6 text-neutral"></i>
                                <span class="font-bold">Video Content Engine</span>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- LEAD GEN -->
                <div class="p-12 lg:p-20 rounded-[3rem] bg-primary/5 border border-primary/10 relative overflow-hidden group">
                    <div class="relative z-10">
                        <div class="flex items-center gap-4 mb-10">
                            <span class="text-5xl font-black text-primary/20">IV.</span>
                            <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">Lead Gen</h2>
                        </div>
                        <p class="text-xl text-base-content/60 leading-relaxed mb-12">
                            The human-led, tech-enabled sales team for your {{{{CITY_NAME}}}} headquarters. Qualified meetings on your calendar.
                        </p>
                        <div class="space-y-6">
                            <a href="{{{{BASE_PATH}}}}b2b-lead-generation-agency.html" class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white transition-all shadow-sm">
                                <i data-lucide="users" class="w-6 h-6 text-primary"></i>
                                <span class="font-bold">Premium Lead Generation</span>
                            </a>
                            <a href="{{{{BASE_PATH}}}}crm-management.html" class="flex items-center gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white transition-all shadow-sm">
                                <i data-lucide="settings" class="w-6 h-6 text-primary"></i>
                                <span class="font-bold">Managed CRM Operations</span>
                            </a>
                        </div>
                    </div>
                </div>
             </section>

            <!-- Huge CTA Section -->
            <section class="section-spacing bg-neutral text-neutral-content p-12 lg:p-28 rounded-[4rem] text-center shadow-3xl shadow-neutral/20 overflow-hidden relative">
                <div class="relative z-10 max-w-4xl mx-auto">
                    <h2 class="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-none italic">Choose Your <span class="text-primary">Growth Path</span> in {{{{CITY_NAME}}}}</h2>
                    <p class="text-xl md:text-2xl mb-16 opacity-90 leading-relaxed">
                        Whether you are a startup building a foundation or an enterprise accelerating your pipleline, we have the turnkey infrastructure ready to deploy in 48 hours.
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch">
                        <a href="{{{{BASE_PATH}}}}contact.html" class="btn btn-primary h-24 text-2xl font-black shadow-xl shadow-primary/40 hover:scale-105 transition-all w-full flex flex-col justify-center items-center">
                            <span>Book Discovery Call</span>
                            <span class="text-xs font-normal opacity-70 tracking-widest mt-1 uppercase">Recommended for Enterprises</span>
                        </a>
                        <a href="{{{{BASE_PATH}}}}market-foundation-program.html" class="btn btn-secondary h-24 text-2xl font-black shadow-xl shadow-secondary/40 hover:scale-105 transition-all w-full flex flex-col justify-center items-center">
                            <span>Get Free IT Audit</span>
                            <span class="text-xs font-normal opacity-70 tracking-widest mt-1 uppercase">Recommended for Startups</span>
                        </a>
                    </div>
                </div>
                <!-- Background Decoration -->
                <div class="absolute -top-1/2 -right-1/4 w-[120%] h-[200%] bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-[120px]"></div>
            </section>

            <!-- Deep Dive into {{{{CITY_NAME}}}} Market -->
            <section class="section-spacing max-w-4xl mx-auto prose prose-xl text-base-content/80 text-center">
                 <h2 class="text-4xl md:text-5xl font-black mb-12 text-base-content tracking-tight uppercase italic underline decoration-primary decoration-8 underline-offset-8">Localization Matters</h2>
                 <p class="text-2xl leading-relaxed font-medium">
                    Supporting the business community of {{{{CITY_NAME}}}} is at the core of our European strategy.
                 </p>
                 <p>
                    From the manufacturing belts in the outskirts of {{{{CITY_NAME}}}} to the digital agencies based in {{{{LANDMARK}}}}, our tools are built to scale. We have mapped the local B2B landscape of {{{{COUNTRY_NAME}}}}, ensuring that every lead we generate and every piece of content we produce is legally compliant and culturally relevant.
                 </p>
                 <p>
                    Our {{{{REGION_NAME}}}} data center presence ensures that your {{{{CITY_NAME}}}}-based workforce experiences zero latency and maximum security. We are more than a vendor; we are your local growth partners.
                 </p>
            </section>

            <!-- Static FAQ for {{{{CITY_NAME}}}} -->
            <section class="section-spacing border-t border-base-200 pt-32 max-w-6xl mx-auto" id="faq">
                <div class="text-center mb-24">
                    <h2 class="text-4xl md:text-6xl font-black mb-6">Common Questions</h2>
                    <p class="text-xl text-base-content/60 italic">Honest answers for {{{{CITY_NAME}}}} stakeholders</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                    <div class="space-y-4">
                        <h4 class="text-2xl font-bold text-primary flex items-center gap-3 italic">
                             <i data-lucide="help-circle" class="w-6 h-6"></i> How fast is deployment?
                        </h4>
                        <p class="text-lg leading-relaxed text-base-content/70">
                            Our turnkey infrastructure products are typically live within **48 hours** for {{{{CITY_NAME}}}} clients. Once the setup is complete, you can start your outreach campaigns immediately.
                        </p>
                    </div>
                    <div class="space-y-4">
                        <h4 class="text-2xl font-bold text-primary flex items-center gap-3 italic">
                             <i data-lucide="help-circle" class="w-6 h-6"></i> is this GDPR compliant?
                        </h4>
                        <p class="text-lg leading-relaxed text-base-content/70">
                            Yes. Every system we build for {{{{CITY_NAME}}}} businesses is fully compliant with the latest {{{{COUNTRY_NAME}}}} and EU regulations regarding data protection and email marketing.
                        </p>
                    </div>
                    <div class="space-y-4">
                        <h4 class="text-2xl font-bold text-primary flex items-center gap-3 italic">
                             <i data-lucide="help-circle" class="w-6 h-6"></i> Can we customize the AI voice?
                        </h4>
                        <p class="text-lg leading-relaxed text-base-content/70">
                            Absolutely. Our content engines are trained on your existing brand assets. We ensure your {{{{CITY_NAME}}}} brand maintains its unique identity across all automated channels.
                        </p>
                    </div>
                    <div class="space-y-4">
                        <h4 class="text-2xl font-bold text-primary flex items-center gap-3 italic">
                             <i data-lucide="help-circle" class="w-6 h-6"></i> Do you support local languages?
                        </h4>
                        <p class="text-lg leading-relaxed text-base-content/70">
                            We provide full support for English, German, and French, with deep localization for the {{{{COUNTRY_NAME}}}} market language nuances.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer Injected -->
    {footer_content}
    
    <script>
        lucide.createIcons();
        
        // Navigation Scripts
        function toggleMobileMenu() {{
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
            if (!menu.classList.contains('hidden')) {{
                document.body.style.overflow = 'hidden';
            }} else {{
                document.body.style.overflow = '';
            }}
        }}

        function toggleDropdown(menuId) {{
            const allMenus = ['services-menu', 'products-menu', 'company-menu'];
            allMenus.forEach(id => {{
                const menu = document.getElementById(id);
                if (menu && id !== menuId) {{
                    menu.classList.add('hidden');
                }}
            }});
            const menu = document.getElementById(menuId);
            if (menu) {{
                menu.classList.toggle('hidden');
            }}
        }}

        document.addEventListener('click', function (e) {{
            const servicesDropdown = document.getElementById('services-dropdown');
            const productsDropdown = document.getElementById('products-dropdown');
            const companyDropdown = document.getElementById('company-dropdown');

            if (servicesDropdown && !servicesDropdown.contains(e.target)) {{
                document.getElementById('services-menu')?.classList.add('hidden');
            }}
            if (productsDropdown && !productsDropdown.contains(e.target)) {{
                document.getElementById('products-menu')?.classList.add('hidden');
            }}
            if (companyDropdown && !companyDropdown.contains(e.target)) {{
                document.getElementById('company-menu')?.classList.add('hidden');
            }}
        }});
    </script>
    <script src="{{{{BASE_PATH}}}}dist/js/contact.js"></script>
</body>
</html>"""

# Save the template
with open('templates/city-landing.html', 'w', encoding='utf-8') as f:
    f.write(template_content)

print(f"✅ Polished template saved with injected nav/footer and visual improvements.")
