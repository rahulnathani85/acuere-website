// ========================================
// ACUERE CONSULTANCY - Website Script
// ========================================

// Web3Forms Access Key (replace with your key from https://web3forms.com)
const WEB3FORMS_KEY = '4eac0b96-234d-4d37-b7b9-409875953516';

document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Scroll-based fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => observer.observe(el));

    // Contact form handler with Web3Forms
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            formData.append('access_key', WEB3FORMS_KEY);
            formData.append('subject', 'New Inquiry - Acuere Consultancy Website');
            formData.append('from_name', 'Acuere Website');

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showFormMessage(form, 'success', `Thank you ${formData.get('name')}! Your inquiry has been received. We will get back to you within 24 hours.`);
                    form.reset();
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage(form, 'error', 'There was an issue submitting the form. Please email us directly at rahul@acuereconsultancy.com or call +91 98339 31354.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage !== 'index.html') {
            if (href === 'index.html') link.classList.remove('active');
        }
    });
});

// Show form success/error message
function showFormMessage(form, type, message) {
    const existing = form.parentElement.querySelector('.form-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `form-message form-message-${type}`;
    div.textContent = message;
    form.parentElement.insertBefore(div, form.nextSibling);

    setTimeout(() => div.remove(), 8000);
}
