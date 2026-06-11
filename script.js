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

// ========================================
// MODERN LAYER — motion & interaction
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Hero entrance ---
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero-load');

    // --- Constellation canvas (homepage hero) ---
    const canvas = document.getElementById('heroCanvas');
    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext('2d');
        let w, h, pts = [], raf;
        const N = 46, LINK = 150;
        function size() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }
        function init() {
            size();
            pts = Array.from({ length: N }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
                r: Math.random() * 1.6 + 0.7
            }));
        }
        function tick() {
            ctx.clearRect(0, 0, w, h);
            for (const p of pts) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
            }
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d = Math.hypot(dx, dy);
                    if (d < LINK) {
                        ctx.strokeStyle = `rgba(212, 184, 124, ${0.16 * (1 - d / LINK)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
                    }
                }
            }
            for (const p of pts) {
                ctx.fillStyle = 'rgba(232, 205, 150, 0.55)';
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            }
            raf = requestAnimationFrame(tick);
        }
        init(); tick();
        window.addEventListener('resize', () => { cancelAnimationFrame(raf); init(); tick(); });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(raf); else tick();
        });
    }

    // --- Scroll reveal with stagger (auto-applied) ---
    const revealTargets = document.querySelectorAll(
        '.framework-card, .methodology-card, .why-item, .testimonial-card, .path-card, ' +
        '.service-card, .strip-card, .stat-box, .usecase-tag, .partner-mini, .section-header, ' +
        '.overview-content, .additional-methods, .wf-panel, .blog-card, .leadership-row'
    );
    let lastParent = null, idx = 0;
    revealTargets.forEach(el => {
        el.classList.add('rv');
        if (el.parentElement !== lastParent) { lastParent = el.parentElement; idx = 0; }
        el.style.setProperty('--rv-delay', `${Math.min(idx * 0.07, 0.42)}s`);
        idx++;
    });
    const rvObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('rv-in'); rvObs.unobserve(e.target); }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

    // --- Animated counters ---
    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const m = el.textContent.trim().match(/^(\d+)(\+?)$/);
            if (m) {
                const end = parseInt(m[1], 10), suffix = m[2];
                if (reduceMotion) { el.textContent = end + suffix; }
                else {
                    const t0 = performance.now(), dur = 1400;
                    (function step(t) {
                        const p = Math.min((t - t0) / dur, 1);
                        const eased = 1 - Math.pow(1 - p, 3);
                        el.textContent = Math.round(end * eased) + (p === 1 ? suffix : '');
                        if (p < 1) requestAnimationFrame(step);
                    })(t0);
                }
            }
            counterObs.unobserve(el);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('.cred-number, .stat-number').forEach(el => counterObs.observe(el));

    // --- Liquidation preference waterfall simulator ---
    const wf = document.getElementById('wfSlider');
    if (wf) {
        // Illustrative cap table: amounts in ₹ Crore
        const classes = [
            { id: 'wfA',  name: 'Series A CCPS', pref: 40, own: 0.25, seniority: 1 },
            { id: 'wfS',  name: 'Seed CCPS',     pref: 12, own: 0.15, seniority: 2 },
            { id: 'wfE',  name: 'Founders & ESOP (Equity)', pref: 0, own: 0.60, seniority: 3 }
        ];
        const fmt = v => '\u20B9' + v.toFixed(2) + ' Cr';

        function allocate(ev) {
            // 1x non-participating prefs: each CCPS class takes max(preference, as-converted) — solved iteratively
            let converted = classes.map(c => c.pref === 0);
            for (let iter = 0; iter < 4; iter++) {
                const prefPool = classes.reduce((s, c, i) => s + (converted[i] ? 0 : c.pref), 0);
                const convOwn = classes.reduce((s, c, i) => s + (converted[i] ? c.own : 0), 0);
                const residual = Math.max(ev - prefPool, 0);
                let changed = false;
                classes.forEach((c, i) => {
                    if (c.pref === 0) return;
                    // value if this class converts: share of residual computed with it included
                    const poolIfConv = prefPool - (converted[i] ? 0 : c.pref);
                    const ownIfConv = convOwn + (converted[i] ? 0 : c.own);
                    const resIfConv = Math.max(ev - poolIfConv, 0);
                    const valConv = ownIfConv > 0 ? resIfConv * (c.own / ownIfConv) : 0;
                    const shouldConvert = valConv > c.pref;
                    if (shouldConvert !== converted[i]) { converted[i] = shouldConvert; changed = true; }
                });
                if (!changed) break;
            }
            // Final distribution by seniority
            let remaining = ev;
            const payout = new Array(classes.length).fill(0);
            // senior prefs first
            [...classes.keys()].sort((a, b) => classes[a].seniority - classes[b].seniority).forEach(i => {
                if (!converted[i] && classes[i].pref > 0) {
                    payout[i] = Math.min(classes[i].pref, remaining);
                    remaining -= payout[i];
                }
            });
            const convOwnTotal = classes.reduce((s, c, i) => s + (converted[i] ? c.own : 0), 0);
            classes.forEach((c, i) => {
                if (converted[i] && convOwnTotal > 0) payout[i] = remaining * (c.own / convOwnTotal);
            });
            return { payout, converted };
        }

        function render() {
            const ev = parseFloat(wf.value);
            document.getElementById('wfEV').textContent = fmt(ev);
            wf.style.setProperty('--fill', ((ev - wf.min) / (wf.max - wf.min) * 100) + '%');
            const { payout, converted } = allocate(ev);
            const maxPay = Math.max(...payout, 1);
            classes.forEach((c, i) => {
                const bar = document.querySelector('#' + c.id + ' .wf-bar');
                const amt = document.querySelector('#' + c.id + ' .wf-amount span');
                const st = document.querySelector('#' + c.id + ' .wf-status');
                bar.style.width = (payout[i] / maxPay * 100) + '%';
                bar.classList.toggle('converted', converted[i] && c.pref > 0);
                amt.textContent = fmt(payout[i]);
                if (c.pref > 0) st.textContent = converted[i] ? 'Converts to equity' : 'Takes 1x preference';
            });
        }
        wf.addEventListener('input', render);
        render();
    }
});
