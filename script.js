// ============================================================
// ACUERE CONSULTANCY — Precision Ledger interaction layer v3
// ============================================================
const WEB3FORMS_KEY = '4eac0b96-234d-4d37-b7b9-409875953516';

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;

    // ---------- Navbar ----------
    const navbar = document.getElementById('navbar');
    const onScroll = () => navbar && navbar.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle && navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });

    // ---------- Hero entrance ----------
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero-load');
    const fig = document.getElementById('heroFig');
    if (fig) requestAnimationFrame(() => fig.classList.add('fig-go'));

    // ---------- Custom cursor (desktop) ----------
    if (!isTouch && !reduceMotion && window.innerWidth > 900) {
        const dot = document.createElement('div');
        dot.className = 'cur-dot';
        document.body.appendChild(dot);
        let x = -100, y = -100, cx = -100, cy = -100;
        window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
        (function loop() {
            cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
            dot.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
            requestAnimationFrame(loop);
        })();
        document.querySelectorAll('a, button, .wf-slider, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => dot.classList.add('cur-grow'));
            el.addEventListener('mouseleave', () => dot.classList.remove('cur-grow'));
        });
    }

    // ---------- Marquee: duplicate for seamless loop ----------
    const mt = document.getElementById('marqueeTrack');
    if (mt) mt.innerHTML += mt.innerHTML;

    // ---------- Scroll reveal with stagger ----------
    const revealSel = '.framework-card, .methodology-card, .why-item, .testimonial-card, ' +
        '.path-card, .service-card, .strip-card, .stat-box, .usecase-tag, .section-header, ' +
        '.overview-content, .additional-methods, .wf-panel, .blog-card, .duo-card, ' +
        '.info-card, .capability-item, .value-card, .team-card, .partner-mini, .contact-form-wrapper, .contact-info';
    let lastParent = null, idx = 0;
    document.querySelectorAll(revealSel).forEach(el => {
        el.classList.add('rv');
        if (el.parentElement !== lastParent) { lastParent = el.parentElement; idx = 0; }
        el.style.setProperty('--rv-delay', `${Math.min(idx * 0.08, 0.4)}s`);
        idx++;
    });
    const rvObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('rv-in'); rvObs.unobserve(e.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

    // ---------- Animated counters ----------
    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const m = el.textContent.trim().match(/^(\d+)(\+?)$/);
            if (m) {
                const end = parseInt(m[1], 10), suffix = m[2];
                if (reduceMotion || end === 0) { el.textContent = end + suffix; }
                else {
                    const t0 = performance.now(), dur = 1500;
                    (function step(t) {
                        const p = Math.min((t - t0) / dur, 1);
                        const eased = 1 - Math.pow(1 - p, 3);
                        el.textContent = Math.round(end * eased) + (p === 1 ? suffix : '');
                        if (p < 1) requestAnimationFrame(step);
                    })(performance.now());
                }
            }
            counterObs.unobserve(el);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('.cred-number, .stat-number').forEach(el => counterObs.observe(el));

    // ---------- Magnetic buttons (desktop) ----------
    if (!isTouch && !reduceMotion) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const dx = (e.clientX - r.left - r.width / 2) * 0.18;
                const dy = (e.clientY - r.top - r.height / 2) * 0.3;
                btn.style.transform = `translate(${dx}px, ${dy}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    // ---------- Waterfall simulator ----------
    const wf = document.getElementById('wfSlider');
    if (wf) {
        const classes = [
            { id: 'wfA', pref: 40, own: 0.25, seniority: 1 },
            { id: 'wfS', pref: 12, own: 0.15, seniority: 2 },
            { id: 'wfE', pref: 0,  own: 0.60, seniority: 3 }
        ];
        const fmt = v => '\u20B9' + v.toFixed(2) + ' Cr';

        function allocate(ev) {
            let converted = classes.map(c => c.pref === 0);
            for (let iter = 0; iter < 4; iter++) {
                const prefPool = classes.reduce((s, c, i) => s + (converted[i] ? 0 : c.pref), 0);
                const convOwn = classes.reduce((s, c, i) => s + (converted[i] ? c.own : 0), 0);
                let changed = false;
                classes.forEach((c, i) => {
                    if (c.pref === 0) return;
                    const poolIfConv = prefPool - (converted[i] ? 0 : c.pref);
                    const ownIfConv = convOwn + (converted[i] ? 0 : c.own);
                    const resIfConv = Math.max(ev - poolIfConv, 0);
                    const valConv = ownIfConv > 0 ? resIfConv * (c.own / ownIfConv) : 0;
                    const shouldConvert = valConv > c.pref;
                    if (shouldConvert !== converted[i]) { converted[i] = shouldConvert; changed = true; }
                });
                if (!changed) break;
            }
            let remaining = ev;
            const payout = new Array(classes.length).fill(0);
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
                const row = document.getElementById(c.id);
                row.querySelector('.wf-bar').style.width = (payout[i] / maxPay * 100) + '%';
                row.querySelector('.wf-bar').classList.toggle('converted', converted[i] && c.pref > 0);
                row.querySelector('.wf-amount span').textContent = fmt(payout[i]);
                const st = row.querySelector('.wf-status');
                if (c.pref > 0) st.textContent = converted[i] ? 'Converts to equity' : 'Takes 1x preference';
            });
        }
        wf.addEventListener('input', render);
        render();
    }

    // ---------- Contact form (Web3Forms) ----------
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
                const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
                const result = await response.json();
                if (result.success) {
                    showFormMessage(form, 'success', `Thank you ${formData.get('name')}! Your inquiry has been received. We will get back to you within 24 hours.`);
                    form.reset();
                } else { throw new Error(result.message || 'Submission failed'); }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage(form, 'error', 'There was an issue submitting the form. Please email us directly at rahul@acuereconsultancy.com or call +91 98339 31354.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

function showFormMessage(form, type, message) {
    const existing = form.parentElement.querySelector('.form-message');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.className = `form-message form-message-${type}`;
    div.textContent = message;
    form.parentElement.insertBefore(div, form.nextSibling);
    setTimeout(() => div.remove(), 8000);
}
