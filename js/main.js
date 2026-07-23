// ============ ANIMATED BACKGROUND ============
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, dots = [], orbs = [], symbols = [], orbits = [], t = 0;
let shootingStars = [];

function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
resize();
addEventListener('resize', resize);

// small drifting dots (twinkle)
for (let i = 0; i < 45; i++) {
  dots.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.4 + 0.4,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    a: Math.random() * 0.4 + 0.1,
    tw: Math.random() * Math.PI * 2,
    tws: Math.random() * 0.02 + 0.008
  });
}

// big soft glowing orbs
for (let i = 0; i < 4; i++) {
  orbs.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 120 + 90,
    ox: Math.random() * 1000,
    oy: Math.random() * 1000,
    gold: Math.random() > 0.5
  });
}

// ---- floating dev symbols flying in space ----
const glyphs = [
  '<>', '</>', '<div>', '</div>', '<span>', '<h1>', '<p>', '<a>', '/>',
  '{ }', '( )', '[ ]', '=>', '===', '!==', '&&', '||', '=>',
  ';', '#', '::', '...', 'const', 'let', 'function', 'return',
  'import', 'export', 'async', 'await', 'null', 'true', 'false',
  '<React>', '<App/>', '{ ... }', '404', '200', '{}', '() =>'
];
for (let i = 0; i < 14; i++) {
  symbols.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    txt: glyphs[Math.floor(Math.random() * glyphs.length)],
    size: Math.random() * 9 + 11,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    rot: Math.random() * Math.PI * 2,
    rs: (Math.random() - 0.5) * 0.006,
    a: Math.random() * 0.08 + 0.09,
    gold: Math.random() > 0.4
  });
}

// ---- orbit systems (planets around a sun, dev style) ----
for (let i = 0; i < 3; i++) {
  orbits.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    driftX: (Math.random() - 0.5) * 0.1,
    driftY: (Math.random() - 0.5) * 0.1,
    rings: [
      { r: 30 + Math.random() * 15, speed: 0.006 + Math.random() * 0.004, angle: Math.random() * Math.PI * 2, dot: 2 },
      { r: 55 + Math.random() * 20, speed: 0.003 + Math.random() * 0.003, angle: Math.random() * Math.PI * 2, dot: 2.6 }
    ]
  });
}

function newStar() {
  return {
    x: Math.random() * W,
    y: -10,
    vx: (Math.random() - 0.5) * 2 - 1,
    vy: Math.random() * 2 + 2,
    life: 1
  };
}

function draw() {
  t += 0.005;
  ctx.clearRect(0, 0, W, H);

  // soft floating orbs
  for (const o of orbs) {
    const x = o.x + Math.sin(t + o.ox) * 40;
    const y = o.y + Math.cos(t * 0.8 + o.oy) * 40;
    const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
    const col = o.gold ? '201,168,76' : '91,184,240';
    g.addColorStop(0, `rgba(${col},0.05)`);
    g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, o.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // orbit systems — small "planets" circling a center
  for (const os of orbits) {
    os.x += os.driftX; os.y += os.driftY;
    if (os.x < -80) os.x = W + 80; if (os.x > W + 80) os.x = -80;
    if (os.y < -80) os.y = H + 80; if (os.y > H + 80) os.y = -80;

    // center "sun"
    ctx.beginPath();
    ctx.arc(os.x, os.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(229,199,107,0.35)';
    ctx.fill();

    for (const ring of os.rings) {
      ring.angle += ring.speed;
      // orbit path (very faint)
      ctx.beginPath();
      ctx.arc(os.x, os.y, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201,168,76,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // orbiting dot
      const px = os.x + Math.cos(ring.angle) * ring.r;
      const py = os.y + Math.sin(ring.angle) * ring.r;
      ctx.beginPath();
      ctx.arc(px, py, ring.dot, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,168,76,0.3)';
      ctx.fill();
    }
  }

  // flying dev symbols
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const s of symbols) {
    s.x += s.vx; s.y += s.vy; s.rot += s.rs;
    if (s.x < -60) s.x = W + 60; if (s.x > W + 60) s.x = -60;
    if (s.y < -60) s.y = H + 60; if (s.y > H + 60) s.y = -60;
    const col = s.gold ? '201,168,76' : '154,154,170';
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.font = `${s.size}px monospace`;
    ctx.fillStyle = `rgba(${col},${s.a})`;
    ctx.fillText(s.txt, 0, 0);
    ctx.restore();
  }

  // twinkling drifting dots
  for (const p of dots) {
    p.x += p.vx; p.y += p.vy;
    p.tw += p.tws;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    const twinkle = p.a * (0.5 + 0.5 * Math.sin(p.tw));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${twinkle})`;
    ctx.fill();
  }

  // occasional shooting star
  if (Math.random() < 0.004) shootingStars.push(newStar());
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.x += s.vx; s.y += s.vy; s.life -= 0.02;
    ctx.strokeStyle = `rgba(229,199,107,${Math.max(s.life, 0) * 0.7})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6);
    ctx.stroke();
    if (s.life <= 0) shootingStars.splice(i, 1);
  }

  requestAnimationFrame(draw);
}
draw();

// ============ INTRO TIMELINE (the "video") ============
document.body.classList.add('locked');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const tl = gsap.timeline({
  defaults: { ease: 'power3.out' },
  onComplete: () => document.body.classList.remove('locked')
});

if (reduced) {
  gsap.set('#intro', { display: 'none' });
  gsap.set('#navbar, .hero-btns, .hero-visual, .scroll-hint', { opacity: 1, y: 0, scale: 1 });
  gsap.set('.reveal-line > span', { y: 0 });
  document.body.classList.remove('locked');
} else {
  tl
    .to('.intro-line', { width: 220, duration: 0.7 })
    .to('.intro-name .word span', { y: 0, duration: 0.9, stagger: 0.15 }, '-=0.2')
    .to('.intro-tag span', { y: 0, duration: 0.7 }, '-=0.4')
    .to({}, { duration: 0.8 })
    .to('.intro-content', { y: -60, opacity: 0, duration: 0.5, ease: 'power2.in' })
    .to('.intro-panel.top',    { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.1')
    .to('.intro-panel.bottom', { yPercent:  100, duration: 0.9, ease: 'power4.inOut' }, '<')
    .set('#intro', { display: 'none' })
    .to('#navbar', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
    .to('.reveal-line > span', { y: 0, duration: 0.9, stagger: 0.12 }, '-=0.5')
    .to('.hero-btns', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('.hero-visual', { opacity: 1, scale: 1, duration: 0.9 }, '-=0.8')
    .to('.scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.3');
}

// ============ NAVBAR ON SCROLL ============
addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 60);
});

// ============ PHOTO PARALLAX (mouse) ============
const visual = document.getElementById('heroVisual');
const wrap = document.querySelector('.photo-wrap');
if (visual && !reduced) {
  visual.addEventListener('mousemove', e => {
    const r = visual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    wrap.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  visual.addEventListener('mouseleave', () => wrap.style.transform = '');
}

// ============ SCROLL REVEAL (about section) ============
const observer = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ============ VIDEO PLAY ============
document.querySelectorAll('.proj-frame.video').forEach(frame => {
  const video = frame.querySelector('video');
  const btn = frame.querySelector('.video-play');
  btn.addEventListener('click', () => {
    frame.classList.add('playing');
    video.controls = true;
    video.play();
  });
  video.addEventListener('pause', () => { if (!video.seeking) frame.classList.remove('playing'); });
  video.addEventListener('ended', () => frame.classList.remove('playing'));
});

// ============ CAROUSEL ============
document.querySelectorAll('.proj-frame.carousel').forEach(car => {
  const track = car.querySelector('.car-track');
  const slides = track.querySelectorAll('img');
  const dotsWrap = car.querySelector('.car-dots');
  const delay = parseInt(car.dataset.autoplay) || 4000;
  let index = 0, timer;

  // build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'car-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { go(i); reset(); });
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.car-dot');

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }
  function reset() { clearInterval(timer); timer = setInterval(next, delay); }

  car.querySelector('.next').addEventListener('click', () => { next(); reset(); });
  car.querySelector('.prev').addEventListener('click', () => { prev(); reset(); });

  // pause on hover
  car.addEventListener('mouseenter', () => clearInterval(timer));
  car.addEventListener('mouseleave', reset);

  reset();
});

// ============ LIGHTBOX ============
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('.lb-img');
  const counter = lb.querySelector('.lb-counter');
  const btnPrev = lb.querySelector('.lb-nav.prev');
  const btnNext = lb.querySelector('.lb-nav.next');
  const btnClose = lb.querySelector('.lb-close');

  let group = [];   // list of img srcs in the current set
  let pos = 0;

  function open(imgs, index) {
    group = imgs;
    pos = index;
    render();
    lb.classList.add('open');
    document.body.classList.add('locked');
  }
  function render() {
    lbImg.src = group[pos];
    const multi = group.length > 1;
    btnPrev.style.display = multi ? 'block' : 'none';
    btnNext.style.display = multi ? 'block' : 'none';
    counter.style.display = multi ? 'block' : 'none';
    if (multi) counter.textContent = `${pos + 1} / ${group.length}`;
  }
  function close() {
    lb.classList.remove('open');
    document.body.classList.remove('locked');
  }
  function next() { pos = (pos + 1) % group.length; render(); }
  function prev() { pos = (pos - 1 + group.length) % group.length; render(); }

  // single images (not in a carousel)
  document.querySelectorAll('.proj-frame:not(.carousel):not(.video) > img').forEach(img => {
    img.addEventListener('click', () => open([img.src], 0));
  });

  // carousel images — group all slides together
  document.querySelectorAll('.proj-frame.carousel').forEach(car => {
    const imgs = [...car.querySelectorAll('.car-track img')];
    const srcs = imgs.map(i => i.src);
    imgs.forEach((img, i) => img.addEventListener('click', () => open(srcs, i)));
  });

  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  btnClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
})();

// ============ CONTACT FORM (Formspree) ============
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const note = document.getElementById('formNote');
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    note.textContent = '';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        note.style.color = 'var(--gold)';
        note.textContent = 'Message sent! I\'ll get back to you soon.';
        contactForm.reset();
      } else {
        note.style.color = '#e57373';
        note.textContent = 'Something went wrong. Please try again.';
      }
    } catch (err) {
      note.style.color = '#e57373';
      note.textContent = 'Network error. Please try again.';
    } finally {
      btn.textContent = original;
    }
  });
}


// ============ CURSOR ACCENT (native cursor kept) ============
(function () {
  if (!matchMedia('(pointer: fine)').matches) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });
  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .icon-tile, .car-dot, .proj-frame img, .car-track img').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

// ============ LANGUAGE TOGGLE (EN / FR) ============
(function () {
  const translations = {
    nav_home: ["Home", "Accueil"],
    nav_about: ["About", "À propos"],
    nav_exp: ["Experience", "Expérience"],
    nav_proj: ["Projects", "Projets"],
    nav_skills: ["Skills", "Compétences"],
    nav_contact: ["Contact", "Contact"],

    hero_tag: ["— Full Stack Developer", "— Développeur Full Stack"],
    hero_desc: ["I build modern web applications with React, Node.js and Laravel — mixing code with graphic design to create experiences that stand out. Based in Casablanca, Morocco.", "Je conçois des applications web modernes avec React, Node.js et Laravel — en mêlant le code au design graphique pour créer des expériences qui se démarquent. Basé à Casablanca, Maroc."],
    hero_btn1: ["View my work", "Voir mes projets"],
    hero_btn2: ["Contact me", "Me contacter"],
    hero_cv: ["Download CV", "Télécharger CV"],

    about_title: ["About <em>Me</em>", "À <em>propos</em>"],
    about_intro: ["Bac+2 student in Software Development at InfoDesign, Casablanca — passionate about Full Stack development and modern web applications.", "Étudiant Bac+2 en Développement Informatique à InfoDesign, Casablanca — passionné par le développement Full Stack et les applications web modernes."],
    about_body: ["I'm looking for an internship to put my skills into practice while making use of my graphic design knowledge — from web and desktop apps to motion design with After Effects.", "Je recherche un stage pour mettre en pratique mes compétences tout en valorisant mes connaissances en design graphique — des applications web et desktop au motion design avec After Effects."],
    about_city: ["City", "Ville"],
    about_email: ["Email", "Email"],
    about_phone: ["Phone", "Téléphone"],
    about_school: ["School", "École"],
    about_langs: ["Languages", "Langues"],
    about_langs_val: ["Arabic · French · English", "Arabe · Français · Anglais"],

    exp_title: ["My <em>Experience</em>", "Mon <em>Expérience</em>"],
    exp_dur: ["2 Months", "2 Mois"],
    exp_role: ["Web Developer Intern", "Stagiaire Développeur Web"],
    exp_desc: ["Internship in web development at WEBEX AG. Designed and built an e-commerce website — integrated the interfaces with HTML, CSS and JavaScript, developed the back-end with PHP and Laravel, and handled the database management.", 
      "Stage en développement web chez WEBEX AG. Conception et développement d'un site e-commerce — intégration des interfaces avec HTML, CSS et JavaScript, développement back-end avec PHP et Laravel, et gestion de la base de données."],

    proj_title: ["My <em>Projects</em>", "Mes <em>Projets</em>"],

    b_cat: ["Full-Stack · Brand Identity", "Full-Stack · Identité Visuelle"],
    b_sub: ["Modern E-Commerce Marketplace", "Marketplace E-Commerce Moderne"],
    b_desc: ["A complete relooking of the Biougnach brand — I redesigned the full visual identity and built the entire marketplace from scratch. It features an AI shopping assistant (Biou) that answers over live inventory in six languages, separate dashboards for clients, vendors and admins, social login through Google, Facebook and Apple, and a full checkout with Stripe, PayPal and cash-on-delivery — plus flash sales, wishlists and multi-currency support.", "Un relooking complet de la marque Biougnach — j'ai repensé toute l'identité visuelle et construit l'intégralité de la marketplace. Elle intègre un assistant d'achat IA (Biou) qui répond sur l'inventaire en direct en six langues, des tableaux de bord séparés pour clients, vendeurs et administrateurs, une connexion sociale via Google, Facebook et Apple, et un paiement complet avec Stripe, PayPal et paiement à la livraison — avec ventes flash, listes de souhaits et support multi-devises."],

    bv_cat: ["Motion Design · Video", "Motion Design · Vidéo"],
    bv_sub: ["Promotional Motion Design", "Motion Design Promotionnel"],
    bv_desc: ["A 15-scene animated commercial showcasing flagship products — smartwatches, audio gear, consoles and appliances — with smooth transitions, spatial typography, sound design and branded intro and outro sequences.", "Une publicité animée de 15 scènes présentant les produits phares — montres connectées, matériel audio, consoles et électroménager — avec des transitions fluides, une typographie spatiale, du sound design et des séquences d'intro et outro de marque."],

    c_cat: ["Full-Stack Web App", "Application Web Full-Stack"],
    c_sub: ["Medical Appointment & Healthcare Platform", "Plateforme de Rendez-vous Médicaux"],
    c_desc: ["A healthcare booking platform with role-based workflows for patients and admins. Full doctor management with photos, bios and star ratings, an interactive scheduling engine with real-time status tracking, and a production Docker deployment with a managed database and automated HTTPS.", "Une plateforme de réservation médicale avec des workflows par rôle pour patients et administrateurs. Gestion complète des médecins avec photos, biographies et notes, un moteur de planification interactif avec suivi de statut en temps réel, et un déploiement Docker en production avec base de données managée et HTTPS automatisé."],

    d_cat: ["Desktop Software · POS", "Logiciel Desktop · POS"],
    d_sub: ["Restaurant Management & POS System", "Système de Gestion de Restaurant & POS"],
    d_desc: ["A desktop POS built on an MVC architecture with a live floor plan showing table status, fast order taking with automatic stock deduction, and an invoice generator handling tax, multiple payment types and printable receipts. Includes sales analytics, low-stock alerts and email password recovery.", "Un POS desktop bâti sur une architecture MVC avec un plan de salle en direct affichant l'état des tables, une prise de commande rapide avec déduction automatique du stock, et un générateur de factures gérant la TVA, plusieurs modes de paiement et des reçus imprimables. Inclut des statistiques de ventes, des alertes de stock faible et la récupération de mot de passe par email."],

    cr_cat: ["Web Development · E-Commerce", "Développement Web · E-Commerce"],
    cr_sub: ["Security & Tech E-Commerce Website", "Site E-Commerce Sécurité & Tech"],
    cr_desc: ["My very first web project — a dark-themed tech store with gold accents, interactive galleries and modal dialogs. Custom JavaScript drives the cart with localStorage and quantity controls, while a PHP backend handles sessions, cart persistence and message logging.", "Mon tout premier projet web — une boutique tech au thème sombre avec accents dorés, galeries interactives et fenêtres modales. Du JavaScript personnalisé gère le panier avec localStorage et le contrôle des quantités, tandis qu'un backend PHP gère les sessions, la persistance du panier et l'enregistrement des messages."],

    crv_cat: ["Motion Graphics · Commercial", "Motion Graphics · Publicité"],
    crv_sub: ["Video Animation", "Animation Vidéo"],
    crv_desc: ["An animated promo built to match the Cyber Royal branding, featuring futuristic motion elements, product spotlights and full sound engineering.", "Une publicité animée conçue pour correspondre à l'identité de Cyber Royal, avec des éléments de motion futuristes, des mises en avant produits et une ingénierie sonore complète."],

    g_cat: ["Desktop Application", "Application Desktop"],
    g_sub: ["Restaurant & Reservation App", "Application de Restaurant & Réservation"],
    g_desc: ["My first Python desktop app — a categorized ordering system with dish details, ratings and live totals, a table reservation flow with a calendar picker and party-size controls, and a multi-step checkout that validates card details. User accounts and auth persist in a local SQLite database.", "Ma première application desktop en Python — un système de commande par catégories avec détails des plats, notes et totaux en direct, un flux de réservation de table avec sélecteur de calendrier et contrôle du nombre de convives, et un paiement multi-étapes validant les détails de carte. Les comptes et l'authentification sont stockés dans une base SQLite locale."],

    link_live: ["Live Site →", "Site en ligne →"],
    link_github: ["GitHub →", "GitHub →"],
    link_demo: ["Live Demo →", "Démo en ligne →"],
    link_github2: ["GitHub →", "GitHub →"],
    link_github3: ["GitHub →", "GitHub →"],
    link_github4: ["GitHub →", "GitHub →"],
    link_github5: ["GitHub →", "GitHub →"],

    skills_title: ["My <em>Skills</em>", "Mes <em>Compétences</em>"],
    skill_front: ["Frontend", "Frontend"],
    skill_front_txt: ["Building responsive, animated interfaces.", "Création d'interfaces responsives et animées."],
    skill_back: ["Backend", "Backend"],
    skill_back_txt: ["APIs, databases and server-side logic.", "APIs, bases de données et logique serveur."],
    skill_design: ["Design, Motion & 3D", "Design, Motion & 3D"],
    skill_design_txt: ["Visual identity, motion design and 3D renders.", "Identité visuelle, motion design et rendus 3D."],
    tools_label: ["Tools & Software", "Outils & Logiciels"],

    contact_title: ["Get In <em>Touch</em>", "Me <em>Contacter</em>"],
    contact_big: ["Let's build<br>something together.", "Créons<br>quelque chose ensemble."],
    contact_sub: ["Open to internship opportunities and freelance work. Feel free to reach out.", "Ouvert aux stages et au travail freelance. N'hésitez pas à me contacter."],
    cl_email: ["Email", "Email"],
    cl_phone: ["Phone", "Téléphone"],
    cl_loc: ["Location", "Localisation"],
    cl_loc_val: ["Casablanca, Morocco", "Casablanca, Maroc"],
    form_name: ["Your Name", "Votre Nom"],
    form_email: ["Your Email", "Votre Email"],
    form_msg: ["Your Message", "Votre Message"],
    form_send: ["Send Message", "Envoyer le Message"],
    footer_role: ["Full Stack Developer · Casablanca", "Développeur Full Stack · Casablanca"]
  };

  const toggle = document.getElementById('langToggle');
  if (!toggle) return;
  const opts = toggle.querySelectorAll('.lang-opt');

  function setLang(lang) {
    const i = lang === 'fr' ? 1 : 0;
    document.querySelectorAll('[data-key]').forEach(el => {
      const t = translations[el.dataset.key];
      if (t && t[i] !== undefined) el.innerHTML = t[i];
    });
    document.documentElement.lang = lang;
    opts.forEach(o => o.classList.toggle('active', o.dataset.lang === lang));
  }

  opts.forEach(opt => {
    opt.addEventListener('click', () => setLang(opt.dataset.lang));
  });
})();

// ============ DYNAMIC WATER RIPPLE POSITION ============
document.querySelectorAll('.water').forEach(el => {
  el.addEventListener('mouseenter', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Position the ripple pseudo-element at mouse point
    el.style.setProperty('--ripple-x', `${x}px`);
    el.style.setProperty('--ripple-y', `${y}px`);
  });
});

// ============ HAMBURGER / MOBILE MENU ============
(function () {
  const burger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  function toggle() {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.classList.toggle('locked');
  }
  function close() {
    burger.classList.remove('open');
    menu.classList.remove('open');
    document.body.classList.remove('locked');
  }

  burger.addEventListener('click', toggle);
  // close when a menu link is tapped
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();