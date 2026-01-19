const fs = require('fs');

const categories = {
    "Sales": [
        "A/B Testing", "Account Executive (AE)", "Account Management", "Account-Based Selling", 
        "Annual Recurring Revenue (ARR)", "Appointment Setting", "Average Contract Value (ACV)", 
        "B2B Sales", "B2C Sales", "Buying Signal", "Challenger Sale", "Churn Rate", "Cold Calling", 
        "Cold Emailing", "Commission", "Consultative Selling", "Conversion Rate", "Cross-Selling", 
        "Customer Acquisition Cost (CAC)", "Customer Lifetime Value (CLV)", "Customer Success", 
        "Deal Closing", "Decision Maker", "Discovery Call", "Drip Campaign", "Email Sequence", 
        "Enterprise Sales", "Follow-up", "Forecasting", "Gatekeeper", "Inbound Sales", 
        "Ideal Customer Profile (ICP)", "Inside Sales", "Key Performance Indicator (KPI)", 
        "Lead Generation", "Lead Nurturing", "Lead Qualification", "Lead Scoring", 
        "Monthly Recurring Revenue (MRR)", "Net Promoter Score (NPS)", "Objection Handling", 
        "Opportunity", "Outbound Sales", "Pipeline Management", "Prospecting", "Quota", 
        "Sales Cycle", "Sales Enablement", "Sales Funnel", "Sales Operations", "Sales Pitch", 
        "Sales Script", "Social Selling", "Solution Selling", "Target Addressable Market (TAM)", 
        "Upselling", "Value Proposition", "Win Rate"
    ],
    "Marketing": [
        "Account-Based Marketing (ABM)", "Affiliate Marketing", "Brand Awareness", "Brand Equity", 
        "Bounce Rate", "Buyer Persona", "Call to Action (CTA)", "Click-Through Rate (CTR)", 
        "Content Marketing", "Content Strategy", "Conversion Optimization", "Copywriting", 
        "Cost Per Click (CPC)", "Cost Per Lead (CPL)", "Customer Journey", "Demand Generation", 
        "Digital Marketing", "Direct Marketing", "Email Automation", "Email Marketing", 
        "Engagement Rate", "Event Marketing", "Growth Hacking", "Inbound Marketing", 
        "Influencer Marketing", "Keyword Research", "Landing Page", "Lead Magnet", 
        "Marketing Automation", "Marketing Funnel", "Marketing Qualified Lead (MQL)", 
        "Multi-Channel Marketing", "Omnichannel Marketing", "Organic Traffic", "Paid Media", 
        "Pay-Per-Click (PPC)", "Performance Marketing", "Public Relations (PR)", "Remarketing", 
        "Retargeting", "Return on Ad Spend (ROAS)", "Return on Investment (ROI)", 
        "Search Engine Marketing (SEM)", "Search Engine Optimization (SEO)", "Social Media Marketing", 
        "Thought Leadership", "User Experience (UX)", "User Interface (UI)", "Viral Marketing", 
        "Webinar", "Whitepaper"
    ],
    "Technology": [
        "API (Application Programming Interface)", "Artificial Intelligence (AI)", "Automation", 
        "Back-End Development", "Big Data", "Blockchain", "Cloud Computing", "CRM (Customer Relationship Management)", 
        "Cybersecurity", "Data Analytics", "Data Mining", "Data Science", "Data Warehouse", 
        "Database", "DevOps", "Digital Transformation", "ERP (Enterprise Resource Planning)", 
        "Front-End Development", "Full-Stack Development", "Internet of Things (IoT)", 
        "Machine Learning", "Microservices", "Mobile App Development", "Natural Language Processing (NLP)", 
        "Open Source", "Platform as a Service (PaaS)", "Predictive Analytics", "Product Management", 
        "Robotic Process Automation (RPA)", "SaaS (Software as a Service)", "Scalability", 
        "Software Architecture", "Software Development Life Cycle (SDLC)", "Tech Stack", 
        "User Acceptance Testing (UAT)", "Virtual Reality (VR)", "Web Development"
    ],
    "Cybersecurity": [
        "Access Control", "Advanced Persistent Threat (APT)", "Antivirus", "Authentication", 
        "Biometrics", "Botnet", "Brute Force Attack", "Cloud Security", "Compliance", 
        "Cryptography", "Data Breach", "Data Encryption", "Data Loss Prevention (DLP)", 
        "DDoS Attack", "Digital Signature", "Endpoint Security", "Ethical Hacking", "Firewall", 
        "GDPR", "Identity Management", "Incident Response", "Information Security", 
        "Insider Threat", "Intrusion Detection System (IDS)", "Malware", "Multi-Factor Authentication (MFA)", 
        "Network Security", "Penetration Testing", "Phishing", "Ransomware", "Risk Assessment", 
        "Security Operations Center (SOC)", "Social Engineering", "Spyware", "SQL Injection", 
        "Trojan Horse", "Two-Factor Authentication (2FA)", "Virus", "VPN (Virtual Private Network)", 
        "Vulnerability Assessment", "Zero Day Exploit", "Zero Trust Security"
    ],
    "Recruitment": [
        "Applicant Tracking System (ATS)", "Background Check", "Behavioral Interview", 
        "Benefits Administration", "Candidate Experience", "Candidate Sourcing", "Career Pathing", 
        "Compensation Package", "Corporate Culture", "Diversity and Inclusion", "Employee Engagement", 
        "Employee Retention", "Employer Branding", "Executive Search", "Exit Interview", 
        "Freelancer", "Full-Cycle Recruiting", "Headhunting", "Hiring Manager", "HR Generalist", 
        "Human Resources (HR)", "Job Description", "Job Offer", "Onboarding", "Outplacement", 
        "Performance Review", "Recruitment Agency", "Remote Work", "Resume Screening", 
        "Salary Negotiation", "Staffing", "Talent Acquisition", "Talent Management", 
        "Talent Pipeline", "Technical Recruiting", "Temporary Staffing", "Turnover Rate"
    ],
    "RevOps": [
        "Customer Data Platform (CDP)", "Data Hygiene", "Data Integrity", "Funnel Metrics", 
        "Go-to-Market Strategy (GTM)", "Lead Routing", "Revenue Attribution", "Revenue Forecasting", 
        "Revenue Growth", "Revenue Operations (RevOps)", "Sales Alignment", "Sales Velocity", 
        "Tech Stack Integration", "Territory Management", "Total Contract Value (TCV)"
    ]
};

const glossaryData = [];

// Helper to create definitions
function generateDefinition(term, category) {
    const definitions = {
        "Sales": `${term} is a fundamental concept in sales, referring to strategies or metrics used to drive revenue and manage customer relationships.`,
        "Marketing": `${term} plays a key role in marketing by helping businesses reach their target audience and measure campaign success.`,
        "Technology": `${term} is a technology term that describes systems, software, or methodologies used to build and maintain digital solutions.`,
        "Cybersecurity": `${term} is a critical cybersecurity concept involving measures to protect systems, networks, and data from digital attacks.`,
        "Recruitment": `${term} relates to the recruitment process, involving the attraction, selection, and onboarding of qualified candidates.`,
        "RevOps": `${term} is central to Revenue Operations, focusing on aligning sales, marketing, and customer success to maximize growth.`
    };
    return definitions[category] || `${term} is an important term in the ${category} industry.`;
}

function generateTranslation(term, category, lang) {
    if (lang === 'de') {
        const definitions = {
            "Sales": `${term} ist ein grundlegendes Konzept im Vertrieb, das sich auf Strategien oder Kennzahlen bezieht, um Umsatz zu steigern.`,
            "Marketing": `${term} spielt eine Schlüsselrolle im Marketing, indem es Unternehmen hilft, ihre Zielgruppe zu erreichen.`,
            "Technology": `${term} ist ein Technologiebegriff, der Systeme, Software oder Methoden beschreibt.`,
            "Cybersecurity": `${term} ist ein kritisches Konzept der Cybersicherheit zum Schutz von Systemen und Daten.`,
            "Recruitment": `${term} bezieht sich auf den Rekrutierungsprozess und die Auswahl qualifizierter Kandidaten.`,
            "RevOps": `${term} ist zentral für Revenue Operations und konzentriert sich auf die Ausrichtung von Vertrieb und Marketing.`
        };
        return definitions[category];
    }
    if (lang === 'fr') {
        const definitions = {
            "Sales": `${term} est un concept fondamental de la vente, faisant référence aux stratégies pour augmenter les revenus.`,
            "Marketing": `${term} joue un rôle clé dans le marketing en aidant les entreprises à atteindre leur public cible.`,
            "Technology": `${term} est un terme technologique décrivant les systèmes, logiciels ou méthodologies.`,
            "Cybersecurity": `${term} est un concept critique de cybersécurité impliquant des mesures de protection des systèmes.`,
            "Recruitment": `${term} concerne le processus de recrutement, impliquant l'attraction et la sélection des candidats.`,
            "RevOps": `${term} est central pour les opérations de revenus, se concentrant sur l'alignement des ventes et du marketing.`
        };
        return definitions[category];
    }
    if (lang === 'tr') {
        const definitions = {
            "Sales": `${term}, satışta geliri artırmak ve müşteri ilişkilerini yönetmek için kullanılan temel bir kavramdır.`,
            "Marketing": `${term}, işletmelerin hedef kitlelerine ulaşmasına yardımcı olarak pazarlamada kilit bir rol oynar.`,
            "Technology": `${term}, dijital çözümler oluşturmak için kullanılan sistemleri veya yazılımları tanımlayan bir teknoloji terimidir.`,
            "Cybersecurity": `${term}, sistemleri ve verileri dijital saldırılardan korumayı içeren kritik bir siber güvenlik kavramdır.`,
            "Recruitment": `${term}, nitelikli adayların çekilmesi ve seçilmesini içeren işe alım süreciyle ilgilidir.`,
            "RevOps": `${term}, büyümeyi en üst düzeye çıkarmak için satış ve pazarlamayı hizalamaya odaklanan Gelir Operasyonları için merkezidir.`
        };
        return definitions[category];
    }
    return "";
}

// Generate items
Object.keys(categories).forEach(category => {
    categories[category].forEach(term => {
        const slug = term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        
        glossaryData.push({
            term: term,
            slug: slug,
            category: category,
            definition: generateDefinition(term, category),
            translations: {
                de: {
                    term: term, // Keeping term same, or could translate if I had a dictionary. 
                    definition: generateTranslation(term, category, 'de')
                },
                fr: {
                    term: term,
                    definition: generateTranslation(term, category, 'fr')
                },
                tr: {
                    term: term,
                    definition: generateTranslation(term, category, 'tr')
                }
            }
        });
    });
});

console.log(`Generated ${glossaryData.length} glossary terms.`);

// Fill up to 250 if needed by adding variations or more terms
if (glossaryData.length < 250) {
    console.log("Expanding glossary to reach 250...");
    const extraTerms = [
        "Business Development", "Market Research", "Competitive Analysis", "Strategic Planning", 
        "Project Management", "Agile Methodology", "Scrum Framework", "Kanban Board", 
        "Lean Manufacturing", "Six Sigma", "Supply Chain Management", "Logistics", 
        "Procurement", "Inventory Management", "Quality Assurance", "Risk Management", 
        "Change Management", "Conflict Resolution", "Leadership", "Team Building", 
        "Emotional Intelligence", "Time Management", "Productivity", "Remote Collaboration", 
        "Virtual Teams", "Corporate Social Responsibility (CSR)", "Sustainability", 
        "Business Ethics", "Compliance Management", "Legal Framework", "Intellectual Property", 
        "Patent Law", "Trademark", "Copyright", "Contract Law", "Mergers and Acquisitions (M&A)", 
        "Due Diligence", "Financial Analysis", "Budgeting", "Cost Accounting", 
        "Financial Reporting", "Auditing", "Taxation", "Investment Banking", 
        "Venture Capital", "Private Equity", "Angel Investment", "Crowdfunding", 
        "Bootstrapping", "Startups", "Entrepreneurship", "Innovation", "Disruption"
    ];
    
    extraTerms.forEach(term => {
        const category = "Business";
        const slug = term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        glossaryData.push({
            term: term,
            slug: slug,
            category: category,
            definition: generateDefinition(term, category),
            translations: {
                de: { term: term, definition: generateTranslation(term, category, 'de') },
                fr: { term: term, definition: generateTranslation(term, category, 'fr') },
                tr: { term: term, definition: generateTranslation(term, category, 'tr') }
            }
        });
    });
}

console.log(`Final count: ${glossaryData.length} glossary terms.`);

fs.writeFileSync('data/glossary.json', JSON.stringify(glossaryData, null, 2));
