// Contact and Newsletter Form Handlers (Resend-backed API)

document.addEventListener('DOMContentLoaded', () => {
    // 1. FAQ Functionality
    const faqItems = document.querySelectorAll('.collapse input[type="checkbox"]');
    faqItems.forEach(faqInput => {
        const collapseElement = faqInput.closest('.collapse');
        const titleElement = collapseElement?.querySelector('.collapse-title');
        
        if (titleElement) {
            // Make title clickable
            titleElement.style.cursor = 'pointer';
            titleElement.addEventListener('click', (e) => {
                e.preventDefault();
                // Toggle current item
                faqInput.checked = !faqInput.checked;
                
                // Close other FAQ items (Accordion behavior)
                faqItems.forEach(otherInput => {
                    if (otherInput !== faqInput) {
                        otherInput.checked = false;
                    }
                });
            });
        }
    });

    // 2. Contact Form Handler
    const contactForm = document.getElementById('expandia-contact-form');
    const statusEl = document.getElementById('contact-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (statusEl) statusEl.textContent = 'Sending...';
            
            const formData = new FormData(contactForm);
            const payload = Object.fromEntries(formData.entries());

            try {
                const resp = await fetch('https://expandia-contact-form.omaycompany.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json();

                // FIXED: Check resp.ok instead of data.success
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

    // 3. Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = btn ? btn.textContent : 'Subscribe';
            
            if (btn) btn.textContent = 'Subscribing...';
            
            const formData = new FormData(newsletterForm);
            
            // FIXED: We manually construct the payload. 
            // We add a generic "message" so your Worker (which requires a message) accepts it.
            const payload = {
                email: formData.get('email'),
                message: 'Newsletter Subscription Request' 
            };

            try {
                // FIXED: Point to the Cloudflare Worker, not the local /api/ path
                const resp = await fetch('https://expandia-contact-form.omaycompany.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json();

                // FIXED: Check resp.ok
                if (resp.ok) {
                    newsletterForm.reset();
                    if (btn) btn.textContent = 'Subscribed!';
                    
                    // Reset button text after 2 seconds
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
