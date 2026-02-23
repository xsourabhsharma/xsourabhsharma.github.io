/* ===========================================
   SOURABH SHARMA — xsourabhsharma.com
   v9.0 — PREMIUM TECH CURSOR EDITION
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {

    const isDesktop = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

    /* ═══════════════════════════════════════════
       PREMIUM TECH CURSOR ENGINE
       - Smooth LERP following
       - Mix-blend-mode difference (inverts on content)
       - Magnetic pull on interactive elements
       - Contextual text labels (View, Click, etc.)
       - Velocity-based skew/squeeze
       - Click shrink
       - Viewport enter/leave
       ═══════════════════════════════════════════ */
    const cursorRing = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');
    const cursorText = document.getElementById('cursorText');

    if (isDesktop && cursorRing && cursorDot) {
        // Mouse position (instant)
        let mx = -80, my = -80;
        // Ring position (lerped)
        let rx = -80, ry = -80;
        // Previous ring position (for velocity)
        let prx = -80, pry = -80;

        const LERP_RING = 0.12;  // Smooth follow speed
        const LERP_DOT = 1;     // Dot follows instantly

        // Track mouse position
        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
        });

        // Animation loop
        function cursorLoop() {
            // Lerp the ring
            rx += (mx - rx) * LERP_RING;
            ry += (my - ry) * LERP_RING;

            // Velocity for skew effect
            const vx = mx - prx;
            const vy = my - pry;
            const speed = Math.sqrt(vx * vx + vy * vy);
            const angle = Math.atan2(vy, vx) * (180 / Math.PI);
            const squeeze = Math.min(speed * 0.15, 0.4);

            // Apply ring transform with velocity-based squeeze
            const scaleX = 1 + squeeze;
            const scaleY = 1 - squeeze * 0.5;
            cursorRing.style.left = rx + 'px';
            cursorRing.style.top = ry + 'px';

            if (speed > 2) {
                cursorRing.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
            } else {
                cursorRing.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1, 1)';
            }

            // Dot follows mouse instantly
            cursorDot.style.left = mx + 'px';
            cursorDot.style.top = my + 'px';

            prx = rx;
            pry = ry;

            requestAnimationFrame(cursorLoop);
        }
        cursorLoop();

        // ── Cursor states for different elements ──
        const cursorTargets = [
            { selector: 'a[href^="http"], a[target="_blank"]', className: 'hovering-link', text: 'View' },
            { selector: 'a[href^="#"]', className: 'hovering', text: '' },
            { selector: 'a[href^="mailto"]', className: 'hovering-link', text: 'Email' },
            { selector: '.btn', className: 'hovering', text: 'Click' },
            { selector: '.social', className: 'hovering-link', text: 'Visit' },
            { selector: '.skill', className: 'hovering', text: '' },
            { selector: '.interest', className: 'hovering', text: '' },
            { selector: '.project-card', className: 'hovering', text: '' },
            { selector: '.fact', className: 'hovering', text: '' },
            { selector: '.hero__frame', className: 'hovering', text: '' },
            { selector: 'button', className: 'hovering', text: '' },
        ];

        cursorTargets.forEach(({ selector, className, text }) => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorRing.classList.add(className);
                    cursorDot.classList.add('hovering');
                    if (text) {
                        cursorText.textContent = text;
                        cursorRing.classList.add('has-text');
                    }
                });
                el.addEventListener('mouseleave', () => {
                    cursorRing.classList.remove(className);
                    cursorDot.classList.remove('hovering');
                    cursorText.textContent = '';
                    cursorRing.classList.remove('has-text');
                });
            });
        });

        // ── Click shrink effect ──
        document.addEventListener('mousedown', () => {
            cursorRing.classList.add('clicking');
        });
        document.addEventListener('mouseup', () => {
            cursorRing.classList.remove('clicking');
        });

        // ── Viewport enter/leave ──
        document.addEventListener('mouseleave', () => {
            cursorRing.classList.add('hidden');
            cursorDot.classList.add('hidden');
        });
        document.addEventListener('mouseenter', () => {
            cursorRing.classList.remove('hidden');
            cursorDot.classList.remove('hidden');
        });

        // ── MAGNETIC PULL on buttons ──
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const bx = rect.left + rect.width / 2;
                const by = rect.top + rect.height / 2;
                const dx = e.clientX - bx;
                const dy = e.clientY - by;
                btn.style.transition = 'none';
                btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform .5s cubic-bezier(.25,1,.5,1)';
                btn.style.transform = 'translate(0, 0)';
            });
        });

    } else {
        // Fallback: hide cursor elements and restore default cursor
        if (cursorRing) cursorRing.style.display = 'none';
        if (cursorDot) cursorDot.style.display = 'none';
        document.body.style.cursor = 'auto';
        document.querySelectorAll('a, button').forEach(el => {
            el.style.cursor = 'pointer';
        });
    }

    /* ═══ HEADER SCROLL ═══ */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    /* ═══ MOBILE MENU ═══ */
    const toggle = document.getElementById('headerToggle');
    const nav = document.getElementById('headerNav');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.header__link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ═══ SMOOTH SCROLL ═══ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const el = document.querySelector(a.getAttribute('href'));
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ═══ SCROLL REVEAL ═══ */
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    /* ═══ ACTIVE NAV ═══ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    }, { passive: true });

    /* ═══ SCROLL INDICATOR HIDE ═══ */
    const scrollEl = document.getElementById('heroScroll');
    if (scrollEl) {
        window.addEventListener('scroll', () => {
            scrollEl.style.opacity = window.scrollY > 80 ? '0' : '1';
        }, { passive: true });
    }

    /* ═══ 3D TILT ═══ */
    if (isDesktop) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)';
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotX = (y - .5) * -10;
                const rotY = (x - .5) * 10;
                card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
                card.style.transition = 'none';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
                card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    /* ═══ PARALLAX SECTIONS ═══ */
    if (isDesktop) {
        const parallaxEls = document.querySelectorAll('.hero__frame-accent, .section__num');
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            parallaxEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const speed = el.classList.contains('hero__frame-accent') ? 0.04 : 0.02;
                    el.style.transform = `translateY(${sy * speed}px)`;
                }
            });
        }, { passive: true });
    }

});
