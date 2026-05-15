document.addEventListener('DOMContentLoaded', () => {
    const DESTINATION_EMAIL = 'hello@goexpandia.com';

    // --- 1. FAQ Functionality (Keep existing) ---
    const faqItems = document.querySelectorAll('.collapse input[type="checkbox"]');
    faqItems.forEach(faqInput => {
        const collapseElement = faqInput.closest('.collapse');
        const titleElement = collapseElement?.querySelector('.collapse-title');
        
        if (titleElement) {
            titleElement.style.cursor = 'pointer';
            titleElement.addEventListener('click', (e) => {
                e.preventDefault();
                faqInput.checked = !faqInput.checked;
                faqItems.forEach(otherInput => {
                    if (otherInput !== faqInput) {
                        otherInput.checked = false;
                    }
                });
            });
        }
    });

    // --- 2. Contact Form Handler ---
    const contactForm = document.getElementById('expandia-contact-form');
    const statusEl = document.getElementById('contact-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);

            // A. HONEYPOT CHECK (Anti-Spam)
            // If the hidden 'website' field is filled, it's a bot. Fake success.
            if (formData.get('website')) { 
                contactForm.reset();
                if (statusEl) statusEl.textContent = 'Thanks! We will get back within 24 hours.';
                return;
            }

            // B. MATH CAPTCHA CHECK
            // HTML says "30+31=". The answer must be 61.
            const mathAnswer = formData.get('math');
            if (mathAnswer !== '61') {
                if (statusEl) statusEl.textContent = 'Please solve the math question correctly (30+31).';
                return;
            }
            
            if (statusEl) statusEl.textContent = 'Sending...';

            // C. FORMAT DATA FOR WORKER
            // We combine Name, Company, and Service into the "message" 
            // so your current Worker logic receives all the info.
            const fullMessage = `
                Name: ${formData.get('name')}
                Company: ${formData.get('company')}
                Service Interest: ${formData.get('service')}
                ------------------------
                Message:
                ${formData.get('message')}
            `;

            const payload = {
                email: formData.get('email'),
                message: fullMessage,
                to: DESTINATION_EMAIL
            };

            try {
                const resp = await fetch('https://expandia-contact-form.omaycompany.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json();

                if (resp.ok) {
                    if (statusEl) statusEl.textContent = 'Thanks! We will get back within 24 hours.';
                    contactForm.reset();
                } else {
                    if (statusEl) statusEl.textContent = data.message || 'Submission failed. Please try again.';
                }
            } catch (err) {
                console.error(err);
                if (statusEl) statusEl.textContent = 'Server error. Please try again later.';
            }
        });
    }

    // --- 3. Blog Lead Capture Forms ---
    const countdownEls = document.querySelectorAll('[data-countdown]');

    countdownEls.forEach((countdownEl) => {
        const minutes = Number(countdownEl.dataset.countdownMinutes || 8);
        const durationMs = Math.max(minutes, 1) * 60 * 1000;
        const expiresAt = Date.now() + durationMs;

        const renderCountdown = () => {
            const remainingMs = Math.max(0, expiresAt - Date.now());
            const totalSeconds = Math.ceil(remainingMs / 1000);
            const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const secs = String(totalSeconds % 60).padStart(2, '0');
            countdownEl.textContent = `${mins}:${secs}`;

            if (remainingMs <= 0) {
                window.clearInterval(timer);
            }
        };

        const timer = window.setInterval(renderCountdown, 1000);
        renderCountdown();
    });

    const leadCaptureForms = document.querySelectorAll('form[data-lead-capture]');

    leadCaptureForms.forEach((leadForm) => {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(leadForm);
            const statusEl = leadForm.querySelector('[data-lead-status]');
            const btn = leadForm.querySelector('button[type="submit"]');
            const originalText = btn ? btn.textContent : 'Submit';
            const leadSource = leadForm.dataset.leadCapture || 'blog lead capture';
            const isChecklistRequest = leadSource.includes('checklist');
            const offerName = isChecklistRequest ? 'AI Automation Agency Checklist' : 'AI Automation Checkup';
            const successMessage = isChecklistRequest
                ? 'Thanks. We will send your checklist shortly.'
                : 'Thanks. We will send your checkup shortly.';
            const requestLine = isChecklistRequest
                ? 'Request: Visitor asked for the AI automation agency checklist and practical first-pass review path.'
                : 'Request: Visitor asked for a quick first-pass review of what their team should automate first.';

            if (formData.get('website')) {
                leadForm.reset();
                if (statusEl) statusEl.textContent = successMessage;
                return;
            }

            if (statusEl) statusEl.textContent = 'Sending...';
            if (btn) {
                btn.textContent = 'Sending...';
                btn.disabled = true;
            }

            const payload = {
                email: formData.get('email'),
                message: [
                    `Free ${offerName} Request`,
                    `Source: ${leadSource}`,
                    `Page: ${window.location.href}`,
                    requestLine
                ].join('\n'),
                to: DESTINATION_EMAIL
            };

            try {
                const resp = await fetch('https://expandia-contact-form.omaycompany.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json().catch(() => ({}));

                if (resp.ok) {
                    leadForm.reset();
                    if (statusEl) statusEl.textContent = successMessage;
                    if (btn) btn.textContent = 'Sent';
                } else {
                    if (statusEl) statusEl.textContent = data.message || 'Submission failed. Please try again.';
                    if (btn) btn.textContent = originalText;
                }
            } catch (err) {
                console.error(err);
                if (statusEl) statusEl.textContent = 'Server error. Please try again later.';
                if (btn) btn.textContent = originalText;
            } finally {
                if (btn) {
                    window.setTimeout(() => {
                        btn.disabled = false;
                        if (btn.textContent === 'Sent') {
                            btn.textContent = originalText;
                        }
                    }, 2000);
                }
            }
        });
    });

    // --- 4. Newsletter Form Handler ---
    const newsletterForms = document.querySelectorAll('form#newsletter-form');
    
    newsletterForms.forEach((newsletterForm) => {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(newsletterForm);
            const btn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = btn ? btn.textContent : 'Subscribe';

            // A. HONEYPOT CHECK
            if (formData.get('website')) {
                newsletterForm.reset();
                if (btn) btn.textContent = 'Subscribed!';
                setTimeout(() => { if (btn) btn.textContent = originalText; }, 2000);
                return;
            }

            // B. MATH CHECK
            const mathAnswer = formData.get('math');
            if (mathAnswer !== '61') {
                alert('Please solve the math question correctly (30+31).');
                return;
            }
            
            if (btn) btn.textContent = 'Subscribing...';
            
            // C. PAYLOAD
            const payload = {
                email: formData.get('email'),
                message: 'Newsletter Subscription Request', // Static message for newsletter
                to: DESTINATION_EMAIL
            };

            try {
                const resp = await fetch('https://expandia-contact-form.omaycompany.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (resp.ok) {
                    newsletterForm.reset();
                    if (btn) btn.textContent = 'Subscribed!';
                    setTimeout(() => { 
                        if (btn) btn.textContent = originalText; 
                    }, 2000);
                } else {
                    if (btn) btn.textContent = 'Try Again';
                    setTimeout(() => { 
                        if (btn) btn.textContent = originalText; 
                    }, 2000);
                }
            } catch (err) {
                console.error(err);
                if (btn) btn.textContent = 'Error';
                setTimeout(() => { 
                    if (btn) btn.textContent = originalText; 
                }, 2000);
            }
        });
    });
});
