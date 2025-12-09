// =================
// ROI CALCULATOR
// =================

// ROI Calculator Variables
let selectedCompanySize = null;
let selectedChallenges = [];
let staffHours = 100;
let hourlyCost = 75;

// Update display functions
function updateStaffHours(value) {
    staffHours = value;
    document.getElementById('staff-hours-display').textContent = value;
    calculateROI();
}

function updateHourlyCost(value) {
    hourlyCost = value;
    document.getElementById('hourly-cost-display').textContent = value;
    calculateROI();
}

// Company size selection
document.addEventListener('DOMContentLoaded', function() {
    // ROI Calculator functionality
    if (document.getElementById('calculate-roi')) {
        initializeROICalculator();
    }
    
    // Cost Estimator functionality
    if (document.getElementById('project-type')) {
        initializeCostEstimator();
    }
    
    // AI Readiness Assessment functionality
    if (document.getElementById('start-assessment')) {
        initializeAIAssessment();
    }
    
    // Contact form functionality
    if (document.querySelector('form')) {
        initializeContactForm();
    }
});

function initializeROICalculator() {
    if (!document.getElementById('calculate-roi')) return;
    
    // Company size buttons
    document.querySelectorAll('.company-size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.company-size-btn').forEach(b => b.classList.remove('border-primary', 'bg-primary/10'));
            this.classList.add('border-primary', 'bg-primary/10');
            selectedCompanySize = parseInt(this.dataset.employees);
            calculateROI();
        });
    });
    
    // Challenge checkboxes
    document.querySelectorAll('.challenge-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const challenge = this.dataset.challenge;
            const savings = parseInt(this.dataset.savings);
            
            if (this.checked) {
                selectedChallenges.push({ challenge, savings });
            } else {
                selectedChallenges = selectedChallenges.filter(c => c.challenge !== challenge);
            }
            calculateROI();
        });
    });
    
    // Range inputs
    document.getElementById('staff-hours')?.addEventListener('input', function() {
        staffHours = this.value;
        document.getElementById('staff-hours-display').textContent = this.value;
        calculateROI();
    });
    
    document.getElementById('hourly-cost')?.addEventListener('input', function() {
        hourlyCost = this.value;
        document.getElementById('hourly-cost-display').textContent = this.value;
        calculateROI();
    });
    
    // Calculate button
    document.getElementById('calculate-roi').addEventListener('click', function() {
        if (selectedCompanySize && selectedChallenges.length > 0) {
            showROIResults();
        } else {
            alert('Please select your company size and at least one challenge.');
        }
    });
}

function calculateROI() {
    if (!selectedCompanySize || selectedChallenges.length === 0) return;
    
    // Calculate base savings from challenges
    const challengeSavings = selectedChallenges.reduce((total, challenge) => total + challenge.savings, 0);
    
    // Calculate staff cost savings
    const monthlyStaffCost = staffHours * hourlyCost;
    const annualStaffSavings = monthlyStaffCost * 12 * 0.6; // 60% efficiency gain
    
    // Company size multiplier
    const sizeMultiplier = selectedCompanySize <= 50 ? 1 : selectedCompanySize <= 500 ? 1.5 : selectedCompanySize <= 2000 ? 2 : 3;
    
    // Total annual savings
    const totalAnnualSavings = (challengeSavings + annualStaffSavings) * sizeMultiplier;
    
    // Estimated implementation cost
    const implementationCost = Math.min(totalAnnualSavings * 0.3, 150000);
    
    // ROI calculation
    const roi = ((totalAnnualSavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = Math.ceil((implementationCost / totalAnnualSavings) * 12);
    
    // Update display (even before showing results)
    if (document.getElementById('annual-savings')) {
        document.getElementById('annual-savings').textContent = '$' + totalAnnualSavings.toLocaleString();
        document.getElementById('roi-percentage').textContent = Math.round(roi) + '%';
        document.getElementById('payback-period').textContent = paybackMonths;
        document.getElementById('time-saved').textContent = Math.round(staffHours * 0.6);
    }
}

function showROIResults() {
    document.getElementById('results-panel').style.display = 'block';
    document.getElementById('default-panel').style.display = 'none';
    
    // Generate recommendations
    generateRecommendations();
    
    // Scroll to results
    document.getElementById('results-panel').scrollIntoView({ behavior: 'smooth' });
}

function generateRecommendations() {
    const recommendationsContainer = document.getElementById('solution-recommendations');
    if (!recommendationsContainer) return;
    
    let recommendations = '';
    
    selectedChallenges.forEach(challenge => {
        switch(challenge.challenge) {
            case 'customer-service':
                recommendations += `
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span class="text-2xl">🤖</span>
                        <div>
                            <div class="font-semibold">AI Customer Service Agent</div>
                            <div class="text-sm text-base-content/60">Automate 70% of customer inquiries</div>
                        </div>
                    </div>`;
                break;
            case 'manual-processes':
                recommendations += `
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span class="text-2xl">⚙️</span>
                        <div>
                            <div class="font-semibold">Process Automation Suite</div>
                            <div class="text-sm text-base-content/60">Eliminate repetitive tasks</div>
                        </div>
                    </div>`;
                break;
            case 'data-analysis':
                recommendations += `
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span class="text-2xl">📊</span>
                        <div>
                            <div class="font-semibold">Predictive Analytics Platform</div>
                            <div class="text-sm text-base-content/60">Real-time insights and forecasting</div>
                        </div>
                    </div>`;
                break;
            case 'lead-qualification':
                recommendations += `
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span class="text-2xl">🎯</span>
                        <div>
                            <div class="font-semibold">AI Lead Scoring System</div>
                            <div class="text-sm text-base-content/60">Prioritize high-value prospects</div>
                        </div>
                    </div>`;
                break;
            case 'content-creation':
                recommendations += `
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span class="text-2xl">✍️</span>
                        <div>
                            <div class="font-semibold">AI Content Generator</div>
                            <div class="text-sm text-base-content/60">Automated content creation</div>
                        </div>
                    </div>`;
                break;
            case 'inventory-management':
                recommendations += `
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span class="text-2xl">📦</span>
                        <div>
                            <div class="font-semibold">Smart Inventory System</div>
                            <div class="text-sm text-base-content/60">Optimize stock levels automatically</div>
                        </div>
                    </div>`;
                break;
        }
    });
    
    recommendationsContainer.innerHTML = recommendations;
}

// =================
// COST ESTIMATOR
// =================

function initializeCostEstimator() {
    if (!document.getElementById('project-type')) return;
    
    const inputs = ['project-type', 'company-size', 'complexity', 'data-volume', 'timeline', 'support-level'];
    const checkboxes = ['realtime', 'mobile', 'api', 'dashboard', 'security'];
    
    // Add event listeners to all inputs
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', calculateCost);
        }
    });
    
    checkboxes.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', calculateCost);
        }
    });
    
    // Data volume slider
    const dataVolumeSlider = document.getElementById('data-volume');
    if (dataVolumeSlider) {
        dataVolumeSlider.addEventListener('input', function() {
            document.getElementById('data-volume-display').textContent = this.value + ' GB';
            calculateCost();
        });
    }
    
    // Initial calculation
    calculateCost();
}

function calculateCost() {
    const projectType = document.getElementById('project-type')?.value || 'chatbot';
    const companySize = document.getElementById('company-size')?.value || 'small';
    const complexity = parseInt(document.getElementById('complexity')?.value || 3);
    const dataVolume = parseInt(document.getElementById('data-volume')?.value || 100);
    const timeline = document.getElementById('timeline')?.value || 'standard';
    const supportLevel = document.getElementById('support-level')?.value || 'standard';
    
    // Base costs by project type
    const baseCosts = {
        'chatbot': 45000,
        'automation': 65000,
        'analytics': 85000,
        'vision': 95000,
        'nlp': 75000,
        'recommendation': 55000,
        'custom': 120000
    };
    
    // Company size multipliers
    const sizeMultipliers = {
        'startup': 0.7,
        'small': 1.0,
        'medium': 1.3,
        'large': 1.8,
        'enterprise': 2.5
    };
    
    // Timeline multipliers
    const timelineMultipliers = {
        'rush': 1.8,
        'fast': 1.3,
        'standard': 1.0,
        'extended': 0.8
    };
    
    let baseCost = baseCosts[projectType] || 75000;
    baseCost *= sizeMultipliers[companySize] || 1.0;
    baseCost *= (complexity / 3); // Complexity factor
    baseCost *= timelineMultipliers[timeline] || 1.0;
    
    // Data volume impact
    if (dataVolume > 500) baseCost *= 1.4;
    else if (dataVolume > 100) baseCost *= 1.2;
    
    // Feature additions
    let featureCost = 0;
    if (document.getElementById('realtime')?.checked) featureCost += 15000;
    if (document.getElementById('mobile')?.checked) featureCost += 25000;
    if (document.getElementById('api')?.checked) featureCost += 12000;
    if (document.getElementById('dashboard')?.checked) featureCost += 18000;
    if (document.getElementById('security')?.checked) featureCost += 20000;
    
    const totalCost = Math.round(baseCost + featureCost);
    const devCost = Math.round(totalCost * 0.6);
    const infraCost = Math.round(totalCost * 0.2);
    const trainingCost = Math.round(totalCost * 0.2);
    
    // Update display
    if (document.getElementById('total-cost')) {
        document.getElementById('total-cost').textContent = '$' + totalCost.toLocaleString();
        document.getElementById('cost-range').textContent = '$' + Math.round(totalCost * 0.8).toLocaleString() + ' - $' + Math.round(totalCost * 1.2).toLocaleString() + ' Range';
        document.getElementById('dev-cost').textContent = '$' + devCost.toLocaleString();
        document.getElementById('infra-cost').textContent = '$' + infraCost.toLocaleString();
        document.getElementById('training-cost').textContent = '$' + trainingCost.toLocaleString();
    }
}

// =================
// AI READINESS ASSESSMENT
// =================

const assessmentQuestions = [
    // Data Quality (5 questions)
    {
        category: 'data',
        question: 'How would you rate the quality and organization of your business data?',
        options: [
            { text: 'Excellent - Well-organized, clean, and easily accessible', score: 5 },
            { text: 'Good - Mostly organized with some inconsistencies', score: 4 },
            { text: 'Fair - Some organization but requires significant cleanup', score: 3 },
            { text: 'Poor - Scattered across multiple systems with quality issues', score: 2 },
            { text: 'Very Poor - Minimal data organization or quality control', score: 1 }
        ]
    },
    {
        category: 'data',
        question: 'How much historical data do you have available for analysis?',
        options: [
            { text: '3+ years of comprehensive data', score: 5 },
            { text: '2-3 years of good quality data', score: 4 },
            { text: '1-2 years of usable data', score: 3 },
            { text: '6-12 months of limited data', score: 2 },
            { text: 'Less than 6 months or very limited data', score: 1 }
        ]
    },
    {
        category: 'data',
        question: 'How easily can you access and integrate data from different systems?',
        options: [
            { text: 'Very Easy - APIs and integration tools in place', score: 5 },
            { text: 'Easy - Some integration capabilities exist', score: 4 },
            { text: 'Moderate - Requires some technical work', score: 3 },
            { text: 'Difficult - Significant integration challenges', score: 2 },
            { text: 'Very Difficult - Data silos with no integration', score: 1 }
        ]
    },
    {
        category: 'data',
        question: 'Do you have data governance and privacy policies in place?',
        options: [
            { text: 'Comprehensive policies with regular audits', score: 5 },
            { text: 'Good policies with occasional reviews', score: 4 },
            { text: 'Basic policies that need updating', score: 3 },
            { text: 'Minimal policies in place', score: 2 },
            { text: 'No formal data governance policies', score: 1 }
        ]
    },
    {
        category: 'data',
        question: 'How confident are you in your data accuracy and completeness?',
        options: [
            { text: 'Very Confident - Regular validation and high accuracy', score: 5 },
            { text: 'Confident - Generally accurate with minor gaps', score: 4 },
            { text: 'Somewhat Confident - Some accuracy issues', score: 3 },
            { text: 'Not Very Confident - Significant accuracy concerns', score: 2 },
            { text: 'Not Confident - Major data quality issues', score: 1 }
        ]
    },
    
    // Technology Infrastructure (5 questions)
    {
        category: 'technology',
        question: 'How would you describe your current technology infrastructure?',
        options: [
            { text: 'Modern cloud-based systems with scalability', score: 5 },
            { text: 'Mix of cloud and on-premise with good capabilities', score: 4 },
            { text: 'Adequate systems but limited scalability', score: 3 },
            { text: 'Older systems with some limitations', score: 2 },
            { text: 'Legacy systems with significant constraints', score: 1 }
        ]
    },
    {
        category: 'technology',
        question: 'What is your experience with API integrations and automation?',
        options: [
            { text: 'Extensive - Regular API usage and automation', score: 5 },
            { text: 'Good - Some API integrations in place', score: 4 },
            { text: 'Basic - Limited automation experience', score: 3 },
            { text: 'Minimal - Very few integrations', score: 2 },
            { text: 'None - No API or automation experience', score: 1 }
        ]
    },
    {
        category: 'technology',
        question: 'How is your data storage and processing capability?',
        options: [
            { text: 'Excellent - Scalable cloud storage and processing', score: 5 },
            { text: 'Good - Adequate storage with some processing power', score: 4 },
            { text: 'Fair - Basic storage but limited processing', score: 3 },
            { text: 'Limited - Storage constraints and slow processing', score: 2 },
            { text: 'Poor - Significant storage and processing limitations', score: 1 }
        ]
    },
    {
        category: 'technology',
        question: 'Do you have cybersecurity measures appropriate for AI implementation?',
        options: [
            { text: 'Comprehensive security with AI-ready protocols', score: 5 },
            { text: 'Good security that can be adapted for AI', score: 4 },
            { text: 'Basic security requiring some upgrades', score: 3 },
            { text: 'Limited security needing significant improvement', score: 2 },
            { text: 'Minimal security measures in place', score: 1 }
        ]
    },
    {
        category: 'technology',
        question: 'How comfortable is your team with adopting new technologies?',
        options: [
            { text: 'Very Comfortable - Early adopters and tech-savvy', score: 5 },
            { text: 'Comfortable - Generally open to new technology', score: 4 },
            { text: 'Somewhat Comfortable - Mixed comfort levels', score: 3 },
            { text: 'Uncomfortable - Prefer familiar systems', score: 2 },
            { text: 'Very Uncomfortable - Resistant to change', score: 1 }
        ]
    },
    
    // Team Skills (5 questions)
    {
        category: 'team',
        question: 'Does your team have experience with data analysis and interpretation?',
        options: [
            { text: 'Extensive - Data scientists and analysts on staff', score: 5 },
            { text: 'Good - Some team members skilled in data analysis', score: 4 },
            { text: 'Basic - Limited but growing data analysis skills', score: 3 },
            { text: 'Minimal - Very little data analysis experience', score: 2 },
            { text: 'None - No data analysis capabilities', score: 1 }
        ]
    },
    {
        category: 'team',
        question: 'How would you rate your team\'s technical literacy overall?',
        options: [
            { text: 'Very High - Strong technical skills across the team', score: 5 },
            { text: 'High - Good technical foundation', score: 4 },
            { text: 'Moderate - Average technical skills', score: 3 },
            { text: 'Low - Limited technical capabilities', score: 2 },
            { text: 'Very Low - Minimal technical skills', score: 1 }
        ]
    },
    {
        category: 'team',
        question: 'Do you have dedicated IT or technical support staff?',
        options: [
            { text: 'Yes - Full IT team with specialized skills', score: 5 },
            { text: 'Yes - Small IT team or technical staff', score: 4 },
            { text: 'Partial - Some technical support available', score: 3 },
            { text: 'Limited - Minimal technical support', score: 2 },
            { text: 'No - No dedicated technical staff', score: 1 }
        ]
    },
    {
        category: 'team',
        question: 'How willing is your team to learn new AI-related skills?',
        options: [
            { text: 'Very Willing - Enthusiastic about AI learning', score: 5 },
            { text: 'Willing - Open to AI training and development', score: 4 },
            { text: 'Somewhat Willing - Mixed interest in AI skills', score: 3 },
            { text: 'Reluctant - Prefer current skill sets', score: 2 },
            { text: 'Unwilling - Resistant to learning new AI skills', score: 1 }
        ]
    },
    {
        category: 'team',
        question: 'Do you have project management experience for technology initiatives?',
        options: [
            { text: 'Extensive - Certified PMs with tech project experience', score: 5 },
            { text: 'Good - Some PM experience with technology', score: 4 },
            { text: 'Basic - Limited PM experience', score: 3 },
            { text: 'Minimal - Very little PM experience', score: 2 },
            { text: 'None - No formal project management', score: 1 }
        ]
    },
    
    // Organizational Culture (5 questions)
    {
        category: 'culture',
        question: 'How does your organization typically approach innovation and change?',
        options: [
            { text: 'Innovation Leader - First to adopt new technologies', score: 5 },
            { text: 'Early Adopter - Quick to embrace beneficial changes', score: 4 },
            { text: 'Moderate - Cautious but open to proven innovations', score: 3 },
            { text: 'Conservative - Slow to adopt new approaches', score: 2 },
            { text: 'Traditional - Prefer established methods', score: 1 }
        ]
    },
    {
        category: 'culture',
        question: 'How supportive is leadership of AI and automation initiatives?',
        options: [
            { text: 'Very Supportive - AI is a strategic priority', score: 5 },
            { text: 'Supportive - Leadership sees AI value', score: 4 },
            { text: 'Somewhat Supportive - Mixed leadership views', score: 3 },
            { text: 'Unsure - Leadership needs convincing', score: 2 },
            { text: 'Unsupportive - Leadership resistant to AI', score: 1 }
        ]
    },
    {
        category: 'culture',
        question: 'How do employees typically react to process changes and automation?',
        options: [
            { text: 'Enthusiastic - Welcome efficiency improvements', score: 5 },
            { text: 'Positive - Generally supportive of changes', score: 4 },
            { text: 'Mixed - Some support, some resistance', score: 3 },
            { text: 'Concerned - Worried about job impacts', score: 2 },
            { text: 'Resistant - Strong opposition to automation', score: 1 }
        ]
    },
    {
        category: 'culture',
        question: 'How well does your organization handle risk and experimentation?',
        options: [
            { text: 'Excellent - Encourages calculated risks and pilots', score: 5 },
            { text: 'Good - Supports well-planned experiments', score: 4 },
            { text: 'Fair - Limited tolerance for experimentation', score: 3 },
            { text: 'Poor - Very risk-averse culture', score: 2 },
            { text: 'Very Poor - No tolerance for failure or risk', score: 1 }
        ]
    },
    {
        category: 'culture',
        question: 'How collaborative are different departments in your organization?',
        options: [
            { text: 'Very Collaborative - Strong cross-department teamwork', score: 5 },
            { text: 'Collaborative - Good inter-department relationships', score: 4 },
            { text: 'Somewhat Collaborative - Mixed department cooperation', score: 3 },
            { text: 'Siloed - Limited cross-department interaction', score: 2 },
            { text: 'Very Siloed - Departments work in isolation', score: 1 }
        ]
    },
    
    // Budget and Resources (5 questions)
    {
        category: 'budget',
        question: 'What is your organization\'s budget range for AI initiatives?',
        options: [
            { text: '$500K+ - Substantial AI investment budget', score: 5 },
            { text: '$250K-$500K - Good AI investment capacity', score: 4 },
            { text: '$100K-$250K - Moderate AI budget available', score: 3 },
            { text: '$50K-$100K - Limited AI budget', score: 2 },
            { text: 'Under $50K - Very constrained budget', score: 1 }
        ]
    },
    {
        category: 'budget',
        question: 'How does your organization typically fund technology projects?',
        options: [
            { text: 'Dedicated innovation budget with quick approval', score: 5 },
            { text: 'Regular IT budget with reasonable approval process', score: 4 },
            { text: 'Mixed funding requiring business case approval', score: 3 },
            { text: 'Limited funding requiring extensive justification', score: 2 },
            { text: 'No dedicated tech funding - must prove immediate ROI', score: 1 }
        ]
    },
    {
        category: 'budget',
        question: 'How comfortable is your organization with ongoing AI operational costs?',
        options: [
            { text: 'Very Comfortable - Budgeted for ongoing AI operations', score: 5 },
            { text: 'Comfortable - Understand and accept ongoing costs', score: 4 },
            { text: 'Somewhat Comfortable - Need to plan for operational costs', score: 3 },
            { text: 'Uncomfortable - Prefer one-time investments', score: 2 },
            { text: 'Very Uncomfortable - Cannot handle ongoing costs', score: 1 }
        ]
    },
    {
        category: 'budget',
        question: 'What is your expected timeline for seeing ROI from AI investments?',
        options: [
            { text: '2-3 years - Long-term strategic investment', score: 5 },
            { text: '12-24 months - Medium-term ROI expectations', score: 4 },
            { text: '6-12 months - Reasonable short-term ROI', score: 3 },
            { text: '3-6 months - Quick ROI required', score: 2 },
            { text: 'Under 3 months - Immediate ROI demanded', score: 1 }
        ]
    },
    {
        category: 'budget',
        question: 'How much can you allocate for AI training and change management?',
        options: [
            { text: '20%+ of project budget - Comprehensive training plan', score: 5 },
            { text: '15-20% of budget - Good training allocation', score: 4 },
            { text: '10-15% of budget - Basic training covered', score: 3 },
            { text: '5-10% of budget - Minimal training budget', score: 2 },
            { text: 'Under 5% - No dedicated training budget', score: 1 }
        ]
    }
];

let currentQuestion = 0;
let assessmentAnswers = [];

function initializeAIAssessment() {
    if (!document.getElementById('start-assessment')) return;
    
    const startBtn = document.getElementById('start-assessment');
    if (startBtn) {
        startBtn.addEventListener('click', startAssessment);
    }
}

function startAssessment() {
    document.getElementById('assessment-section').style.display = 'block';
    document.getElementById('start-assessment').closest('section').style.display = 'none';
    currentQuestion = 0;
    assessmentAnswers = [];
    showQuestion();
}

function showQuestion() {
    const question = assessmentQuestions[currentQuestion];
    const questionContainer = document.getElementById('question-content');
    
    let optionsHTML = '';
    question.options.forEach((option, index) => {
        optionsHTML += `
            <label class="flex items-start gap-3 p-4 border-2 border-base-300 rounded-lg hover:border-primary transition-colors cursor-pointer assessment-option">
                <input type="radio" name="question-${currentQuestion}" value="${option.score}" class="radio radio-primary mt-1">
                <span class="flex-1">${option.text}</span>
            </label>
        `;
    });
    
    questionContainer.innerHTML = `
        <h3 class="text-2xl font-bold mb-6">${question.question}</h3>
        <div class="space-y-3">
            ${optionsHTML}
        </div>
    `;
    
    // Update progress
    document.getElementById('progress-text').textContent = `Question ${currentQuestion + 1} of ${assessmentQuestions.length}`;
    document.getElementById('progress-percentage').textContent = `${Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}% Complete`;
    document.getElementById('progress-bar').value = currentQuestion + 1;
    
    // Add event listeners to radio buttons
    document.querySelectorAll(`input[name="question-${currentQuestion}"]`).forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('next-btn').disabled = false;
            
            // Visual feedback
            document.querySelectorAll('.assessment-option').forEach(opt => {
                opt.classList.remove('border-primary', 'bg-primary/10');
            });
            this.closest('.assessment-option').classList.add('border-primary', 'bg-primary/10');
        });
    });
    
    // Update navigation buttons
    document.getElementById('prev-btn').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-btn').disabled = true;
    
    if (currentQuestion === assessmentQuestions.length - 1) {
        document.getElementById('next-btn').textContent = 'Get My Results →';
    }
    
    // Navigation handlers
    document.getElementById('next-btn').onclick = nextQuestion;
    document.getElementById('prev-btn').onclick = prevQuestion;
}

function nextQuestion() {
    const selectedAnswer = document.querySelector(`input[name="question-${currentQuestion}"]:checked`);
    if (!selectedAnswer) return;
    
    // Store answer
    assessmentAnswers[currentQuestion] = {
        category: assessmentQuestions[currentQuestion].category,
        score: parseInt(selectedAnswer.value)
    };
    
    if (currentQuestion < assessmentQuestions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
        
        // Restore previous answer
        if (assessmentAnswers[currentQuestion]) {
            const previousAnswer = assessmentAnswers[currentQuestion].score;
            const radio = document.querySelector(`input[name="question-${currentQuestion}"][value="${previousAnswer}"]`);
            if (radio) {
                radio.checked = true;
                radio.closest('.assessment-option').classList.add('border-primary', 'bg-primary/10');
                document.getElementById('next-btn').disabled = false;
            }
        }
    }
}

function showResults() {
    document.getElementById('assessment-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';
    
    // Calculate scores by category
    const categoryScores = {
        data: 0,
        technology: 0,
        team: 0,
        culture: 0,
        budget: 0
    };
    
    const categoryCounts = {
        data: 0,
        technology: 0,
        team: 0,
        culture: 0,
        budget: 0
    };
    
    assessmentAnswers.forEach(answer => {
        categoryScores[answer.category] += answer.score;
        categoryCounts[answer.category]++;
    });
    
    // Calculate percentages
    const categoryPercentages = {};
    Object.keys(categoryScores).forEach(category => {
        categoryPercentages[category] = Math.round((categoryScores[category] / (categoryCounts[category] * 5)) * 100);
    });
    
    // Calculate overall score
    const overallScore = Math.round(Object.values(categoryPercentages).reduce((a, b) => a + b, 0) / 5);
    
    // Update display
    document.getElementById('overall-score').textContent = overallScore + '%';
    document.getElementById('data-score').textContent = categoryPercentages.data + '%';
    document.getElementById('tech-score').textContent = categoryPercentages.technology + '%';
    document.getElementById('team-score').textContent = categoryPercentages.team + '%';
    document.getElementById('culture-score').textContent = categoryPercentages.culture + '%';
    document.getElementById('budget-score').textContent = categoryPercentages.budget + '%';
    
    // Set readiness level and emoji
    let readinessLevel, emoji;
    if (overallScore >= 80) {
        readinessLevel = 'High Readiness';
        emoji = '🚀';
    } else if (overallScore >= 60) {
        readinessLevel = 'Medium Readiness';
        emoji = '⚡';
    } else if (overallScore >= 40) {
        readinessLevel = 'Developing Readiness';
        emoji = '🌱';
    } else {
        readinessLevel = 'Early Stage';
        emoji = '🎯';
    }
    
    document.getElementById('readiness-level').textContent = readinessLevel;
    document.getElementById('readiness-emoji').textContent = emoji;
    
    // Generate recommendations
    generateAssessmentRecommendations(categoryPercentages, overallScore);
    
    // Scroll to results
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

function generateAssessmentRecommendations(scores, overallScore) {
    const recommendationsContainer = document.getElementById('recommendations-list');
    const roadmapContainer = document.getElementById('roadmap-timeline');
    
    let recommendations = '';
    let roadmap = '';
    
    // Generate recommendations based on lowest scores
    const sortedCategories = Object.entries(scores).sort((a, b) => a[1] - b[1]);
    
    sortedCategories.slice(0, 3).forEach(([category, score]) => {
        if (score < 70) {
            switch(category) {
                case 'data':
                    recommendations += `
                        <div class="alert alert-warning">
                            <span class="text-2xl">📊</span>
                            <div>
                                <h4 class="font-bold">Improve Data Foundation</h4>
                                <p class="text-sm">Focus on data organization, quality, and governance before AI implementation.</p>
                            </div>
                        </div>`;
                    break;
                case 'technology':
                    recommendations += `
                        <div class="alert alert-info">
                            <span class="text-2xl">💻</span>
                            <div>
                                <h4 class="font-bold">Upgrade Technology Infrastructure</h4>
                                <p class="text-sm">Modernize systems and improve integration capabilities for AI readiness.</p>
                            </div>
                        </div>`;
                    break;
                case 'team':
                    recommendations += `
                        <div class="alert alert-success">
                            <span class="text-2xl">👥</span>
                            <div>
                                <h4 class="font-bold">Invest in Team Training</h4>
                                <p class="text-sm">Develop AI literacy and technical skills across your organization.</p>
                            </div>
                        </div>`;
                    break;
                case 'culture':
                    recommendations += `
                        <div class="alert alert-warning">
                            <span class="text-2xl">🏢</span>
                            <div>
                                <h4 class="font-bold">Build AI-Ready Culture</h4>
                                <p class="text-sm">Foster innovation mindset and address change management concerns.</p>
                            </div>
                        </div>`;
                    break;
                case 'budget':
                    recommendations += `
                        <div class="alert alert-error">
                            <span class="text-2xl">💰</span>
                            <div>
                                <h4 class="font-bold">Secure AI Investment Budget</h4>
                                <p class="text-sm">Develop business case and secure funding for AI initiatives.</p>
                            </div>
                        </div>`;
                    break;
            }
        }
    });
    
    // Generate roadmap based on overall score
    if (overallScore >= 80) {
        roadmap = `
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-marker bg-primary"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 1-2: AI Strategy & Planning</h4>
                        <p class="text-sm text-base-content/70">Define AI objectives and select initial use cases</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker bg-secondary"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 3-4: Pilot Implementation</h4>
                        <p class="text-sm text-base-content/70">Launch first AI solution with limited scope</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker bg-accent"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 5-6: Scale & Optimize</h4>
                        <p class="text-sm text-base-content/70">Expand successful pilots and implement additional solutions</p>
                    </div>
                </div>
            </div>`;
    } else if (overallScore >= 60) {
        roadmap = `
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-marker bg-warning"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 1-3: Foundation Building</h4>
                        <p class="text-sm text-base-content/70">Address infrastructure and team readiness gaps</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker bg-primary"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 4-6: AI Strategy Development</h4>
                        <p class="text-sm text-base-content/70">Create comprehensive AI roadmap and select use cases</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker bg-secondary"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 7-9: Pilot Launch</h4>
                        <p class="text-sm text-base-content/70">Implement first AI solution with careful monitoring</p>
                    </div>
                </div>
            </div>`;
    } else {
        roadmap = `
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-marker bg-error"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 1-6: Readiness Building</h4>
                        <p class="text-sm text-base-content/70">Focus on data, technology, and organizational readiness</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker bg-warning"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 7-9: AI Education & Planning</h4>
                        <p class="text-sm text-base-content/70">Team training and AI strategy development</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker bg-primary"></div>
                    <div class="timeline-content">
                        <h4 class="font-bold">Month 10-12: First AI Initiative</h4>
                        <p class="text-sm text-base-content/70">Launch simple, low-risk AI pilot project</p>
                    </div>
                </div>
            </div>`;
    }
    
    recommendationsContainer.innerHTML = recommendations;
    roadmapContainer.innerHTML = roadmap;
    
    // Add consultation button handler
    document.getElementById('get-consultation').addEventListener('click', function() {
        window.location.href = 'contact.html';
    });
}

// =================
// CONTACT FORM
// =================

function initializeContactForm() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation and success message
            const formData = new FormData(form);
            let isValid = true;
            
            // Check required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('input-error');
                } else {
                    field.classList.remove('input-error');
                }
            });
            
            if (isValid) {
                // Show success message
                const successAlert = document.createElement('div');
                successAlert.className = 'alert alert-success mt-4';
                successAlert.innerHTML = `
                    <span class="text-2xl">✅</span>
                    <div>
                        <h4 class="font-bold">Thank you for your submission!</h4>
                        <p class="text-sm">We'll get back to you within 24 hours with your personalized AI consultation.</p>
                    </div>
                `;
                
                form.appendChild(successAlert);
                form.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successAlert.remove();
                }, 5000);
            } else {
                // Show error message
                const errorAlert = document.createElement('div');
                errorAlert.className = 'alert alert-error mt-4';
                errorAlert.innerHTML = `
                    <span class="text-2xl">❌</span>
                    <div>
                        <h4 class="font-bold">Please fill in all required fields</h4>
                        <p class="text-sm">Make sure to complete all required information before submitting.</p>
                    </div>
                `;
                
                form.appendChild(errorAlert);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorAlert.remove();
                }, 5000);
            }
        });
    });
}

// =================
// GENERAL UI ENHANCEMENTS
// =================

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation classes when elements come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe all service cards and animated elements
    document.querySelectorAll('.service-card, .buzz-card, .animate-slide-up').forEach(card => {
        observer.observe(card);
    });
});

// Global functions for HTML inline handlers
window.updateStaffHours = function(value) {
    document.getElementById('staff-hours-display').textContent = value;
};

window.updateHourlyCost = function(value) {
    document.getElementById('hourly-cost-display').textContent = value;
}; 