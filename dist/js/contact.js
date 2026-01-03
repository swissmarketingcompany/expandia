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
            if (formData.get('website')) {
                contactForm.reset();
                if (statusEl) statusEl.textContent = 'Thanks! We will get back within 24 hours.';
                return;
            }

            // B. MATH CAPTCHA CHECK
            const mathAnswer = formData.get('math');
            if (mathAnswer !== '61') {
                if (statusEl) statusEl.textContent = 'Please solve the math question correctly (30+31).';
                return;
            }

            if (statusEl) statusEl.textContent = 'Sending...';

            // C. PAYLOAD - Send all required fields
            const payload = {
                name: formData.get('name'),
                company: formData.get('company'),
                email: formData.get('email'),
                service: formData.get('service') || '',
                message: formData.get('message') || '',
                math: formData.get('math')
            };

            try {
                const resp = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json();

                if (resp.ok) {
                    if (statusEl) statusEl.textContent = 'Thanks! We will get back within 24 hours.';
                    contactForm.reset();
                } else {
                    if (statusEl) statusEl.textContent = data.error || 'Submission failed. Please try again.';
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

            // C. PAYLOAD for newsletter
            const payload = {
                email: formData.get('email'),
                math: formData.get('math')
            };

            try {
                const resp = await fetch('/api/subscribe', {
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
