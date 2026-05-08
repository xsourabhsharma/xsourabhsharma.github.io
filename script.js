document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion;

    const cursorRing = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');
    const cursorText = document.getElementById('cursorText');

    if (isDesktop && cursorRing && cursorDot) {
        let mx = -80;
        let my = -80;
        let rx = -80;
        let ry = -80;
        let prx = -80;
        let pry = -80;

        document.addEventListener('mousemove', event => {
            mx = event.clientX;
            my = event.clientY;
        });

        const cursorLoop = () => {
            rx += (mx - rx) * 0.14;
            ry += (my - ry) * 0.14;

            const vx = mx - prx;
            const vy = my - pry;
            const speed = Math.sqrt(vx * vx + vy * vy);
            const angle = Math.atan2(vy, vx) * (180 / Math.PI);
            const squeeze = Math.min(speed * 0.12, 0.34);

            cursorRing.style.left = `${rx}px`;
            cursorRing.style.top = `${ry}px`;
            cursorRing.style.transform = speed > 2
                ? `translate(-50%, -50%) rotate(${angle}deg) scale(${1 + squeeze}, ${1 - squeeze * 0.45})`
                : 'translate(-50%, -50%) rotate(0deg) scale(1, 1)';

            cursorDot.style.left = `${mx}px`;
            cursorDot.style.top = `${my}px`;

            prx = rx;
            pry = ry;
            requestAnimationFrame(cursorLoop);
        };
        cursorLoop();

        const cursorTargets = [
            { selector: 'a[href^="http"], a[target="_blank"]', className: 'hovering-link', text: 'View' },
            { selector: 'a[href^="mailto"]', className: 'hovering-link', text: 'Email' },
            { selector: 'a[href^="#"]', className: 'hovering', text: '' },
            { selector: '.btn', className: 'hovering', text: 'Go' },
            { selector: '.social', className: 'hovering-link', text: 'Visit' },
            { selector: '.tilt-card, .fact', className: 'hovering', text: '' },
            { selector: 'button, input, textarea, video', className: 'hovering', text: '' },
        ];

        cursorTargets.forEach(({ selector, className, text }) => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => {
                    cursorRing.classList.add(className);
                    cursorDot.classList.add('hovering');
                    if (text) {
                        cursorText.textContent = text;
                        cursorRing.classList.add('has-text');
                    }
                });
                element.addEventListener('mouseleave', () => {
                    cursorRing.classList.remove(className);
                    cursorDot.classList.remove('hovering');
                    cursorText.textContent = '';
                    cursorRing.classList.remove('has-text');
                });
            });
        });

        document.addEventListener('mousedown', () => cursorRing.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursorRing.classList.remove('clicking'));
        document.addEventListener('mouseleave', () => {
            cursorRing.classList.add('hidden');
            cursorDot.classList.add('hidden');
        });
        document.addEventListener('mouseenter', () => {
            cursorRing.classList.remove('hidden');
            cursorDot.classList.remove('hidden');
        });

        document.querySelectorAll('.magnetic').forEach(element => {
            element.addEventListener('mousemove', event => {
                const rect = element.getBoundingClientRect();
                const dx = event.clientX - (rect.left + rect.width / 2);
                const dy = event.clientY - (rect.top + rect.height / 2);
                element.style.transition = 'none';
                element.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
            });
            element.addEventListener('mouseleave', () => {
                element.style.transition = 'transform .45s cubic-bezier(.25, 1, .5, 1)';
                element.style.transform = 'translate(0, 0)';
            });
        });
    } else {
        if (cursorRing) cursorRing.style.display = 'none';
        if (cursorDot) cursorDot.style.display = 'none';
        document.body.style.cursor = 'auto';
        document.querySelectorAll('a, button, input, textarea').forEach(element => {
            element.style.cursor = element.matches('input, textarea') ? 'text' : 'pointer';
        });
    }

    const header = document.getElementById('header');
    const toggle = document.getElementById('headerToggle');
    const nav = document.getElementById('headerNav');

    const closeMenu = () => {
        if (!toggle || !nav) return;
        toggle.classList.remove('active');
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('nav-open');
    };

    const openMenu = () => {
        if (!toggle || !nav) return;
        toggle.classList.add('active');
        nav.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close menu');
        document.body.classList.add('nav-open');
    };

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.contains('active') ? closeMenu() : openMenu();
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeMenu();
        });

        document.addEventListener('click', event => {
            if (!nav.classList.contains('active')) return;
            if (nav.contains(event.target) || toggle.contains(event.target)) return;
            closeMenu();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const targetId = anchor.getAttribute('href');
            const target = targetId && document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            closeMenu();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start',
            });
        });
    });

    document.querySelectorAll('.hero .reveal').forEach(element => element.classList.add('visible'));

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal:not(.visible)').forEach(element => observer.observe(element));
    } else {
        document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');

    const updateActiveSection = () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                current = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });

    const scrollEl = document.getElementById('heroScroll');
    if (scrollEl) {
        window.addEventListener('scroll', () => {
            scrollEl.style.opacity = window.scrollY > 90 ? '0' : '1';
        }, { passive: true });
    }

    if (isDesktop) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', event => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotX = (y - 0.5) * -7;
                const rotY = (x - 0.5) * 7;
                card.style.transition = 'none';
                card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform .45s cubic-bezier(.34, 1.56, .64, 1)';
                card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = String(formData.get('name') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const subject = String(formData.get('subject') || 'Portfolio message').trim() || 'Portfolio message';
            const message = String(formData.get('message') || '').trim();

            const body = [
                `Name: ${name}`,
                `Email: ${email}`,
                '',
                message,
            ].join('\n');

            window.location.href = `mailto:sourabhsharmacrypto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            const note = document.getElementById('formNote');
            if (note) {
                note.textContent = 'Opening your email app with the message filled in.';
            }
        });
    }
});
