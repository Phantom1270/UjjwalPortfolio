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

// ===== THREE.JS BACKGROUND =====
(function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !window.THREE) return;

    // SCENE & SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 60);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // MATERIALS
    // Procedural noise for desk imperfections
    const noiseCvs = document.createElement('canvas');
    noiseCvs.width = 512; noiseCvs.height = 512;
    const nCtx = noiseCvs.getContext('2d');
    nCtx.fillStyle = '#0a0a0a'; nCtx.fillRect(0,0,512,512);
    for(let i=0; i<30000; i++) {
        nCtx.fillStyle = Math.random() > 0.5 ? '#141414' : '#000000';
        nCtx.fillRect(Math.random()*512, Math.random()*512, 2, 2);
    }
    const noiseTex = new THREE.CanvasTexture(noiseCvs);
    noiseTex.wrapS = THREE.RepeatWrapping; noiseTex.wrapT = THREE.RepeatWrapping;
    noiseTex.repeat.set(6, 3);

    const matGlossyBlack = new THREE.MeshStandardMaterial({ 
        color: 0x050505, 
        roughness: 0.12, 
        metalness: 0.85,
        bumpMap: noiseTex,
        bumpScale: 0.003
    });
    const matCarbon = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.3 });
    const matAluminum = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.7 });
    
    // Smooth fade ground using a custom ShaderMaterial to make it perfectly fade away into darkness
    const matGround = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 1.0, metalness: 0.0 });
    
    const setupGroup = new THREE.Group();
    scene.add(setupGroup);

    // 1. GROUND PATCH
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const ground = new THREE.Mesh(groundGeo, matGround);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4; 
    ground.receiveShadow = true;
    setupGroup.add(ground);

    // 2. DESK
    const deskTopGeo = new THREE.BoxGeometry(24, 0.5, 12);
    const deskTop = new THREE.Mesh(deskTopGeo, matGlossyBlack);
    deskTop.position.y = 0;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    setupGroup.add(deskTop);

    // Carbon fiber legs
    const legGeo = new THREE.CylinderGeometry(0.3, 0.2, 4);
    const legOffsets = [[-11, 5], [11, 5], [-11, -5], [11, -5]];
    legOffsets.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, matCarbon);
        leg.position.set(pos[0], -2.25, pos[1]);
        leg.castShadow = true;
        setupGroup.add(leg);
    });

    // 3. CURVED MONITOR
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 0.25, -2);
    setupGroup.add(monitorGroup);

    // Stand
    const standBaseGeo = new THREE.BoxGeometry(4, 0.2, 3);
    const standBase = new THREE.Mesh(standBaseGeo, matAluminum);
    standBase.position.set(0, 0.1, 0);
    standBase.castShadow = true;
    monitorGroup.add(standBase);

    // Minimalist LED Ring for stand detailing
    const ringGeo = new THREE.TorusGeometry(1, 0.05, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, 0.2, 0);
    monitorGroup.add(ringMesh);

    const standNeckGeo = new THREE.CylinderGeometry(0.3, 0.4, 2);
    const standNeck = new THREE.Mesh(standNeckGeo, matAluminum);
    standNeck.position.set(0, 1.2, -0.5);
    standNeck.rotation.x = Math.PI / 16;
    standNeck.castShadow = true;
    monitorGroup.add(standNeck);

    // Curved Screen Setup
    const radius = 25;
    const curveWidth = Math.PI / 6; 
    const height = 5.5;

    const casingGeo = new THREE.CylinderGeometry(radius+0.2, radius+0.2, height+0.4, 64, 1, true, -curveWidth/2, curveWidth);
    const casing = new THREE.Mesh(casingGeo, matCarbon);
    casing.position.set(0, 2.5, -radius + 1);
    casing.castShadow = true;
    monitorGroup.add(casing);

    // Detailing: Minimalist Keyboard & Mouse
    const kbGeo = new THREE.BoxGeometry(6, 0.1, 2);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.1 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(-1, 0.3, 2); 
    keyboard.rotation.y = Math.PI/32;
    keyboard.castShadow = true;
    setupGroup.add(keyboard);

    const mouseGeo = new THREE.BoxGeometry(1.2, 0.15, 1.8);
    const mousePiece = new THREE.Mesh(mouseGeo, matGlossyBlack);
    mousePiece.position.set(4, 0.32, 2.5); 
    mousePiece.rotation.y = -Math.PI/16;
    mousePiece.castShadow = true;
    setupGroup.add(mousePiece);

    // Generate IDE Code Texture
    const cvs = document.createElement('canvas');
    cvs.width = 1024;
    cvs.height = 512;
    const ctx = cvs.getContext('2d');
    
    ctx.fillStyle = '#0a0a0e';
    ctx.fillRect(0, 0, 1024, 512);
    
    ctx.font = '24px monospace';
    ctx.fillStyle = '#00FFFF'; // Cyan
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 8;
    const codeLines = [
        "function bootSequence() {",
        "  system.initialize();",
        "  const modules = Object.keys(core);",
        "  modules.forEach(m => mount(m));",
        "  while(network.status !== 'CONNECTED') {",
        "    retryConnection();",
        "  }",
        "  console.log('Environment Online.');",
        "}",
        "",
        "bootSequence();"
    ];
    codeLines.forEach((line, i) => {
        ctx.fillText(line, 50, 60 + i * 36);
    });
    
    // Sidebar to look like VSCode
    ctx.fillStyle = '#11111a';
    ctx.shadowBlur = 0;
    ctx.fillRect(0, 0, 40, 512);
    ctx.fillStyle = '#333344';
    ctx.fillRect(15, 20, 10, 10);
    ctx.fillRect(15, 45, 10, 10);
    ctx.fillRect(15, 70, 10, 10);

    const codeTex = new THREE.CanvasTexture(cvs);
    codeTex.wrapS = THREE.RepeatWrapping;
    codeTex.repeat.set(-1, 1);
    codeTex.offset.set(1, 0);

    const screenGeo = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, -curveWidth/2, curveWidth);
    const screenMat = new THREE.MeshStandardMaterial({
        map: codeTex,
        emissiveMap: codeTex,
        emissive: 0xffffff,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        side: THREE.DoubleSide
    });

    // Dynamically inject the local preview screenshot!
    new THREE.TextureLoader().load('preview.png', (loadedTex) => {
        loadedTex.wrapS = THREE.RepeatWrapping;
        loadedTex.repeat.set(-1, 1);
        loadedTex.offset.set(1, 0);
        screenMat.map = loadedTex;
        screenMat.emissiveMap = loadedTex;
        screenMat.emissiveIntensity = 1.2; // Boost since site is dark
        screenMat.needsUpdate = true;
    });

    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.5, -radius + 1.1); 
    monitorGroup.add(screen);

    // 4. LIGHTING - THE HERO
    const lampArmGeo = new THREE.CylinderGeometry(0.1, 0.2, 23);
    const lampArm = new THREE.Mesh(lampArmGeo, matCarbon);
    lampArm.position.set(-4, 10, -2);
    lampArm.lookAt(0, 15, 4);
    lampArm.rotateX(Math.PI/2);
    lampArm.castShadow = true;
    setupGroup.add(lampArm);
    
    // point hood towards the keyboard area
    const targetObj = new THREE.Object3D();
    targetObj.position.set(0, 0, 0);
    setupGroup.add(targetObj);

    const hoodGeo = new THREE.CylinderGeometry(0.3, 1.2, 1.5, 32); 
    const hood = new THREE.Mesh(hoodGeo, matCarbon);
    hood.position.set(0, 15, 4);
    hood.lookAt(targetObj.position);
    hood.rotateX(-Math.PI/2);
    setupGroup.add(hood);

    const spotLight = new THREE.SpotLight(0xf4f8ff, 180, 100, Math.PI / 6.5, 0.9, 1.8);
    spotLight.position.set(0, 15, 4);
    spotLight.target = targetObj;
    
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    setupGroup.add(spotLight);

    // Volumetric Fake Cone
    const volGeo = new THREE.CylinderGeometry(0.2, 5, 16, 32, 1, true);
    const volMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.04, 
        blending: THREE.AdditiveBlending, 
        depthWrite: false,
        side: THREE.DoubleSide
    });
    const volCone = new THREE.Mesh(volGeo, volMat);
    volCone.position.set(0, 7.5, 2); // perfectly between 15,4 and 0,0
    volCone.lookAt(targetObj.position);
    volCone.rotateX(-Math.PI/2);
    setupGroup.add(volCone);

    // Screen Glow - Wide PointLights array faking an ultra-wide continuous specular reflection on the desk
    [-8, -4, 0, 4, 8].forEach(xOffset => {
        const screenGlow = new THREE.PointLight(0x00f0ff, 6, 25);
        screenGlow.position.set(xOffset, 3.5, 1.5); 
        setupGroup.add(screenGlow);
    });

    // Dim Ambient Light
    scene.add(new THREE.AmbientLight(0x111111, 0.5));

    // Interaction & Animation
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Subtle floating of the entire setup
        setupGroup.position.y = Math.sin(time) * 0.3;

        // Mouse Parallax - horizontal only
        const targetX = mouseX * 0.02;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (15 - camera.position.y) * 0.05; // Lock strictly to 15 height
        camera.lookAt(0, 3, 0);

        renderer.render(scene, camera);
    }
    
    animate();
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
