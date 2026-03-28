// ===== LOADER =====
const loaderName = document.getElementById('loader-name');
const words = ['Ujjwal', 'Shukla'];
let charIndex = 0;
words.forEach((w, wi) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'loader-word';
    w.split('').forEach(ch => {
        const span = document.createElement('span');
        span.className = 'loader-char';
        span.textContent = ch;
        span.style.animationDelay = (charIndex * 0.06) + 's';
        if (wi === 0) span.style.color = '#00f0ff';
        wordSpan.appendChild(span);
        charIndex++;
    });
    loaderName.appendChild(wordSpan);
});
setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
}, 2800);

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
}
animCursor();

// ===== PROGRESS =====
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    progress.style.width = (pct * 100) + '%';
});

// ===== NAV =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    function openMobileMenu() {
        navLinks.classList.add('active');
        hamburger.classList.add('is-active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeMobileMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Toggle menu
    hamburger.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Swipe to dismiss
    let touchStartX = 0;
    let touchEndX = 0;

    navLinks.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    navLinks.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX - touchStartX > 50) {
            closeMobileMenu(); // Swipe right
        }
    }, { passive: true });
}

// ===== HERO CANVAS =====
(function () {
    const c = document.getElementById('hero-canvas');
    const ctx = c.getContext('2d');
    let W, H, particles = [];
    function resize() {
        W = c.width = c.offsetWidth;
        H = c.height = c.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.3,
            a: Math.random(),
            col: Math.random() > 0.5 ? '#00f0ff' : '#7b2fff'
        });
    }
    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.col;
            ctx.globalAlpha = p.a * 0.8;
            ctx.fill();
        });
        // Lines between close particles
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#00f0ff';
                    ctx.globalAlpha = (1 - d / 100) * 0.15;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    draw();
})();

// ===== QUOTE CANVAS =====
(function () {
    const c = document.getElementById('quote-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let W, H, t = 0;
    function resize() { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; }
    resize(); window.addEventListener('resize', resize);
    function draw() {
        ctx.clearRect(0, 0, W, H);
        t += 0.005;
        const grad = ctx.createRadialGradient(
            W / 2 + Math.sin(t) * 100, H / 2 + Math.cos(t * 0.7) * 60, 0,
            W / 2, H / 2, Math.max(W, H) * 0.7
        );
        grad.addColorStop(0, 'rgba(123,47,255,0.15)');
        grad.addColorStop(0.5, 'rgba(0,240,255,0.05)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        requestAnimationFrame(draw);
    }
    draw();
})();

// ===== TYPEWRITER =====
const titles = ['AI/ML Engineer', 'Full Stack Developer', 'Data Analyst', 'Builder of Things'];
let ti = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
    const cur = titles[ti];
    if (!deleting) {
        tw.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
        tw.textContent = cur.slice(0, --ci);
        if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
    }
    setTimeout(type, deleting ? 50 : 90);
}
setTimeout(type, 2800);

// ===== QUOTE WORDS =====
const quoteStr = "I don't just study technology — I deploy it.";
const qt = document.getElementById('quote-text');
if (qt) {
    quoteStr.split(' ').forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        const isAccent = w.includes('deploy');
        span.innerHTML = (isAccent ? `<span class="accent">${w}</span>` : w) + ' ';
        span.style.transitionDelay = (i * 0.08) + 's';
        qt.appendChild(span);
    });
}

// ===== SCROLL REVEALS =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            // Animate quote words
            if (e.target.id === 'quote' || e.target.closest('#quote')) {
                document.querySelectorAll('#quote-text .word').forEach(w => w.classList.add('visible'));
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Observe quote section specifically
const quoteSection = document.getElementById('quote');
if (quoteSection) {
    const qObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('#quote-text .word').forEach(w => w.classList.add('visible'));
        }
    }, { threshold: 0.3 });
    qObs.observe(quoteSection);
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
    const targetStr = el.getAttribute('data-target');
    const target = parseFloat(targetStr);
    const isFloat = targetStr.includes('.');
    let count = 0;
    const step = target / 40;
    const interval = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = isFloat ? count.toFixed(1) : Math.floor(count);
        if (count >= target) clearInterval(interval);
    }, 30);
}
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('[data-target]').forEach(animateCounter);
            counterObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
const aboutStats = document.querySelector('.about-stats');
if (aboutStats) counterObs.observe(aboutStats);

// ===== CONTACT FORM — opens mailto with prefilled content =====
function handleSubmit() {
    const n = document.getElementById('fname').value.trim();
    const e = document.getElementById('femail').value.trim();
    const m = document.getElementById('fmessage').value.trim();
    if (!n || !e || !m) {
        ['fname', 'femail', 'fmessage'].forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.trim()) {
                el.style.borderColor = '#ff6b6b';
                el.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.15)';
                setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 2000);
            }
        });
        return;
    }
    const subject = encodeURIComponent(`Portfolio Contact from ${n}`);
    const body = encodeURIComponent(`Hi Ujjwal,\n\nMy name is ${n} (${e}).\n\n${m}\n\nBest,\n${n}`);
    window.location.href = `mailto:shuklaujjwal.work@gmail.com?subject=${subject}&body=${body}`;
    const btn = document.querySelector('.btn-submit');
    btn.textContent = '✓ Opening Email...';
    setTimeout(() => { btn.textContent = 'Send Message →'; }, 3000);
}

// ===== MAGNETIC EFFECT =====
document.querySelectorAll('.btn-primary, .btn-secondary, .project-link, .social-link').forEach(el => {
    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
    });
});
