const fs = require('fs');
const path = require('path');

const solutionFiles = [
    'solution-bidsmart-ai.html', 'solution-casematch-ai.html', 'solution-claimcheck-ai.html',
    'solution-codetutor-ai.html', 'solution-eduassess-ai.html', 'solution-edumini-ai.html',
    'solution-feedbacklens-ai.html', 'solution-findoc-ai.html', 'solution-ipguard-ai.html',
    'solution-learnstyle-ai.html', 'solution-legaldoc-ai.html', 'solution-logiforecast-ai.html',
    'solution-manualmaker-ai.html', 'solution-medcode-ai.html', 'solution-millogi-ai.html',
    'solution-osint-ai.html', 'solution-proposal-ai.html', 'solution-talentmatch-ai.html',
    'solution-techdoc-ai.html', 'solution-toneguard-ai.html'
];

const newPricingSection = `
    <!-- Contact for Pricing Section -->
    <section id="pricing" class="py-20 bg-base-200">
        <div class="container mx-auto px-4">
            <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-4xl font-bold mb-4">Custom Pricing and Solutions</h2>
                <p class="text-xl text-base-content/70 mb-8">
                    We provide flexible, scalable solutions tailored to your unique needs. Contact us to discuss your project, and we'll create a plan that's right for you.
                </p>
                <a href="contact.html" class="btn btn-primary btn-lg">Contact Us for a Quote</a>
            </div>
        </div>
    </section>
`;

solutionFiles.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${fileName}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace hero button
    content = content.replace(
        /<a href="#pricing".*?>View Pricing<\/a>/,
        '<a href="contact.html" class="btn btn-outline btn-lg">Contact for Pricing</a>'
    );

    // Replace pricing section
    const pricingSectionRegex = /<!-- Pricing Section -->[\s\S]*?<!-- FAQ Section -->/;
    if (pricingSectionRegex.test(content)) {
        content = content.replace(pricingSectionRegex, newPricingSection + '\n\n    <!-- FAQ Section -->');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${fileName}`);
});

console.log('Finished updating all solution pages.');
