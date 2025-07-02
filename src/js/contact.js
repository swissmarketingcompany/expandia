// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessages = document.getElementById('form-messages');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="loading loading-spinner loading-sm mr-2"></span>
                Sending...
            `;
            
            // Clear previous messages
            formMessages.innerHTML = '';
            
            try {
                // Get form data
                const formData = new FormData(contactForm);
                const data = {
                    name: formData.get('name'),
                    company: formData.get('company'),
                    email: formData.get('email'),
                    service: formData.get('service'),
                    message: formData.get('message')
                };
                
                // Send to backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    formMessages.innerHTML = `
                        <div class="alert alert-success mt-4">
                            <span class="text-2xl">✅</span>
                            <div>
                                <h4 class="font-bold">Thank you for your submission!</h4>
                                <p class="text-sm">${result.message}</p>
                            </div>
                        </div>
                    `;
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Track conversion (optional - for analytics)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'contact',
                            'event_label': 'contact_form'
                        });
                    }
                    
                } else {
                    // Show error message
                    formMessages.innerHTML = `
                        <div class="alert alert-error mt-4">
                            <span class="text-2xl">❌</span>
                            <div>
                                <h4 class="font-bold">Submission Failed</h4>
                                <p class="text-sm">${result.error || 'Please try again or contact us directly.'}</p>
                            </div>
                        </div>
                    `;
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show network error message
                formMessages.innerHTML = `
                    <div class="alert alert-error mt-4">
                        <span class="text-2xl">❌</span>
                        <div>
                            <h4 class="font-bold">Network Error</h4>
                            <p class="text-sm">Please check your connection and try again, or contact us directly at hello@expandia.ch</p>
                        </div>
                    </div>
                `;
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Get My Free Sales Consultation';
                
                // Auto-hide messages after 10 seconds
                setTimeout(() => {
                    if (formMessages.innerHTML.includes('alert-success')) {
                        formMessages.innerHTML = '';
                    }
                }, 10000);
            }
        });
        
        // Real-time validation feedback
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.classList.add('input-error');
                } else {
                    this.classList.remove('input-error');
                }
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('input-error') && this.value.trim() !== '') {
                    this.classList.remove('input-error');
                }
            });
        });
        
        // Email validation
        const emailField = contactForm.querySelector('input[name="email"]');
        if (emailField) {
            emailField.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    this.classList.add('input-error');
                } else if (this.value) {
                    this.classList.remove('input-error');
                }
            });
        }
    }
}); 