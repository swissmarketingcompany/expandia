document.addEventListener('DOMContentLoaded', () => {

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
                message: fullMessage
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

    // --- 3. Newsletter Form Handler ---
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
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
                message: 'Newsletter Subscription Request' // Static message for newsletter
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
    }
});
