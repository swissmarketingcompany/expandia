// Contact and Newsletter Form Handlers (Resend-backed API)

document.addEventListener('DOMContentLoaded', () => {
    // FAQ Functionality
    const faqItems = document.querySelectorAll('.collapse input[type="checkbox"]');
    faqItems.forEach(faqInput => {
        const collapseElement = faqInput.closest('.collapse');
        const titleElement = collapseElement?.querySelector('.collapse-title');
        
        if (titleElement) {
            // Make title clickable
            titleElement.style.cursor = 'pointer';
            titleElement.addEventListener('click', (e) => {
                e.preventDefault();
                faqInput.checked = !faqInput.checked;
                
                // Close other FAQ items (accordion behavior)
                faqItems.forEach(otherInput => {
                    if (otherInput !== faqInput) {
                        otherInput.checked = false;
                    }
                });
            });
        }
    });
    const contactForm = document.getElementById('expandia-contact-form');
    const statusEl = document.getElementById('contact-status');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (statusEl) statusEl.textContent = 'Sending...';
            const formData = new FormData(contactForm);
            const payload = Object.fromEntries(formData.entries());
            try {
                const resp = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await resp.json();
                if (data.success) {
                    if (statusEl) statusEl.textContent = 'Thanks! We will get back within 24 hours.';
                    contactForm.reset();
                } else {
                    if (statusEl) statusEl.textContent = data.error || 'Submission failed. Please try again.';
                }
            } catch (err) {
                if (statusEl) statusEl.textContent = 'Server error. Please try again later.';
            }
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button[type="submit"]');
            const original = btn ? btn.textContent : '';
            if (btn) btn.textContent = 'Subscribing...';
            const formData = new FormData(newsletterForm);
            const payload = Object.fromEntries(formData.entries());
            try {
                const resp = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await resp.json();
                if (btn) btn.textContent = original || 'Subscribe';
                if (data.success) {
                    newsletterForm.reset();
                    btn && (btn.textContent = 'Subscribed');
                    setTimeout(() => { if (btn) btn.textContent = original || 'Subscribe'; }, 2000);
                } else {
                    btn && (btn.textContent = 'Try Again');
                    setTimeout(() => { if (btn) btn.textContent = original || 'Subscribe'; }, 2000);
                }
            } catch (err) {
                if (btn) btn.textContent = 'Error';
                setTimeout(() => { if (btn) btn.textContent = original || 'Subscribe'; }, 2000);
            }
        });
    }
});