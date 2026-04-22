'use strict';

/* ══════════════════════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════════════════════ */
(function () {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loader-bar');
  const pct    = document.getElementById('loader-pct');
  document.body.classList.add('is-loading');

  let p = 0;
  function tick() {
    p += p < 70 ? Math.random() * 13 + 4 : p < 92 ? Math.random() * 3.5 + 1 : Math.random() * 1 + .3;
    p  = Math.min(p, 100);
    bar.style.width = p + '%';
    pct.textContent = Math.round(p) + '%';
    if (p < 100) setTimeout(tick, 55 + Math.random() * 60);
    else setTimeout(done, 320);
  }

  function done() {
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    initAll();
  }
  setTimeout(tick, 100);
})();


/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
function initAll() {
  setYear();
  initCursor();
  initHeroLines();
  initTagRotation();
  initParallax();
  initPhotoTilt();
  initParticles();
  initLetterSplit();
  initReveal();
  initSectionWipe();
  initAproposOrb();
  initScrollCircle();
  initModeToggle();
  initToolModal();
  initContactForm();
  initDownloadCV();
  if (window.__initGlobes) window.__initGlobes();
}


/* ══════════════════════════════════════════════════════════════
   ANNÉE FOOTER
══════════════════════════════════════════════════════════════ */
function setYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}


/* ══════════════════════════════════════════════════════════════
   CURSEUR CARTOON — ring avec lag, dot plus rapide
══════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  /* Masquer sur tactile */
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    return;
  }

  const ring = cursor.querySelector('.cursor-ring');
  const dot  = cursor.querySelector('.cursor-dot');

  let mx = -200, my = -200;
  let rx = -200, ry = -200; /* position ring (lag) */
  let dx = -200, dy = -200; /* position dot (rapide) */

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    /* Dot suit rapidement, ring lag en arrière = effet cartoon */
    dx += (mx - dx) * 0.28;
    dy += (my - dy) * 0.28;
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;

    /* Dot : position exacte de la souris */
    dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    /* Ring : position retardée */
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;

    requestAnimationFrame(loop);
  })();

  /* Hover sur interactifs */
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a,button,input,textarea,[role=button]'))
      document.body.classList.add('cur-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a,button,input,textarea,[role=button]'))
      document.body.classList.remove('cur-hover');
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cur-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cur-click'));
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}


/* ══════════════════════════════════════════════════════════════
   PHOTO — TILT 3D + GLARE + FLOAT
══════════════════════════════════════════════════════════════ */
function initPhotoTilt() {
  const ring  = document.getElementById('photo-ring');
  const tilt  = document.getElementById('photo-tilt');
  const glare = document.getElementById('photo-glare');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!ring || !tilt || window.matchMedia('(pointer: coarse)').matches) return;
  /* En reduced motion, juste garder le float sans tilt ni glare */

  /* Float JS (remplace animation CSS floatY) */
  let floatT = 0;
  let tiltX = 0, tiltY = 0;
  let targetTX = 0, targetTY = 0;
  let isHovered = false;

  (function floatLoop() {
    floatT += 0.012;
    const floatY = Math.sin(floatT) * 14;

    /* Interpolation douce vers la cible tilt */
    tiltX += (targetTX - tiltX) * 0.08;
    tiltY += (targetTY - tiltY) * 0.08;

    ring.style.transform = `translateY(${floatY}px) perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    /* Ombre dynamique simulant la lumière */
    const sx = -tiltY * 1.8;
    const sy =  tiltX * 1.8;
    ring.style.boxShadow = `${sx}px ${sy}px 40px var(--accent-glow), 0 0 0 10px var(--accent-soft), 0 0 70px var(--accent-glow)`;

    requestAnimationFrame(floatLoop);
  })();

  if (!reduced) {
    ring.addEventListener('mousemove', e => {
      const rect = ring.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      targetTY =  x * 13;
      targetTX = -y * 13;
      if (glare) {
        const gx = ((x + 1) / 2 * 100).toFixed(1);
        const gy = ((y + 1) / 2 * 100).toFixed(1);
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22) 0%, transparent 60%)`;
      }
    });
    ring.addEventListener('mouseleave', () => {
      targetTX = 0; targetTY = 0;
      if (glare) glare.style.background = '';
    });
  }
}


/* ══════════════════════════════════════════════════════════════
   HERO — PARTICULES FLOTTANTES
══════════════════════════════════════════════════════════════ */
function initParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const container = document.createElement('div');
  container.className = 'hero-particles';
  hero.insertBefore(container, hero.firstChild);

  const count = 7;
  const particles = [];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      opacity:${Math.random() * 0.45 + 0.1};
    `;
    container.appendChild(p);
    particles.push({
      el: p,
      x: parseFloat(p.style.left),
      y: parseFloat(p.style.top),
      vx: (Math.random() - 0.5) * 0.018,
      vy: (Math.random() - 0.5) * 0.012,
    });
  }

  (function drift() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -2)  p.x = 102;
      if (p.x > 102) p.x = -2;
      if (p.y < -2)  p.y = 102;
      if (p.y > 102) p.y = -2;
      p.el.style.left = p.x + '%';
      p.el.style.top  = p.y + '%';
    });
    requestAnimationFrame(drift);
  })();
}


/* ══════════════════════════════════════════════════════════════
   WIPE DIAGONAL — sections section-alt
══════════════════════════════════════════════════════════════ */
function initSectionWipe() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.section-alt').forEach(el => el.classList.add('diag-visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('diag-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section-alt').forEach(el => obs.observe(el));
}


/* ══════════════════════════════════════════════════════════════
   À PROPOS — expansion orbe
══════════════════════════════════════════════════════════════ */
function initAproposOrb() {
  const section = document.getElementById('apropos');
  if (!section) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        section.classList.add('is-expanded');
        obs.unobserve(section);
      }
    });
  }, { threshold: 0.15 });

  obs.observe(section);
}


/* ══════════════════════════════════════════════════════════════
   HERO — ANIMATION DES LIGNES (clip-path wipe)
══════════════════════════════════════════════════════════════ */
function initHeroLines() {
  document.querySelectorAll('.hero-name .line').forEach(line => {
    const delay = parseInt(line.dataset.delay || '0', 10);
    setTimeout(() => line.classList.add('is-visible'), delay);
  });

  /* Reveal bio + CTA */
  setTimeout(() => {
    document.querySelectorAll('.reveal-h').forEach(el => el.classList.add('is-visible'));
  }, 700);
}


/* ══════════════════════════════════════════════════════════════
   HERO — ROTATION DES TAGS
══════════════════════════════════════════════════════════════ */
function initTagRotation() {
  function rotate(containerSelector) {
    const tags = document.querySelectorAll(containerSelector + ' .tag');
    if (tags.length < 2) return null;
    let i = 0;
    return setInterval(() => {
      tags[i].classList.remove('active');
      i = (i + 1) % tags.length;
      tags[i].classList.add('active');
    }, 2500);
  }

  let t1 = rotate('.tags-pro');
  let t2 = rotate('.tags-perso');

  /* Reset au switch de mode */
  window.__resetTags = () => {
    clearInterval(t1); clearInterval(t2);
    document.querySelectorAll('.hero-tags .tag').forEach((t, i) => {
      t.classList.toggle('active', i === 0);
    });
    t1 = rotate('.tags-pro');
    t2 = rotate('.tags-perso');
  };
}


/* ══════════════════════════════════════════════════════════════
   HERO — PARALLAX SOURIS
══════════════════════════════════════════════════════════════ */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const els = hero.querySelectorAll('[data-depth]');
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;

  window.addEventListener('resize', () => {
    cx = window.innerWidth / 2;
    cy = window.innerHeight / 2;
  }, { passive: true });

  let ticking = false;
  hero.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      els.forEach(el => {
        const d  = parseFloat(el.dataset.depth);
        el.style.transform = `translate(${dx * d * 90}px, ${dy * d * 65}px)`;
      });
      ticking = false;
    });
  });

  hero.addEventListener('mouseleave', () => {
    els.forEach(el => {
      el.style.transition = 'transform 1.2s ease';
      el.style.transform  = 'translate(0,0)';
      setTimeout(() => { el.style.transition = ''; }, 1200);
    });
  });
}


/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  /* Stagger */
  [
    { s: '.tl',          step: 90  },
    { s: '.tool-cat',    step: 80  },
    { s: '.passion-card',step: 80  },
    { s: '.cc',          step: 60  },
  ].forEach(({ s, step }) => {
    document.querySelectorAll(s).forEach((el, i) => {
      el.style.transitionDelay = (i * step) + 'ms';
    });
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal:not(.split-applied)').forEach(el => obs.observe(el));
}


/* ══════════════════════════════════════════════════════════════
   CERCLE DE SCROLL DYNAMIQUE
══════════════════════════════════════════════════════════════ */
function initScrollCircle() {
  const fill = document.getElementById('scroll-ring-fill');
  if (!fill) return;
  const circ = 100.53; /* 2π × 16 */

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    fill.style.strokeDashoffset = circ * (1 - pct);
  }, { passive: true });
}


/* ══════════════════════════════════════════════════════════════
   ANIMATION LETTRE PAR LETTRE — titres de section
══════════════════════════════════════════════════════════════ */
function initLetterSplit() {
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      entry.target.querySelectorAll('.char').forEach((c, i) => {
        setTimeout(() => c.classList.add('is-visible'), i * 38);
      });
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.s-title').forEach(el => {
    const text = el.textContent;
    el.innerHTML = [...text].map(ch => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch === ' ' ? ' ' : ch;
      return s.outerHTML;
    }).join('');
    el.classList.add('split-applied');
    /* Reset les styles hérités de .reveal */
    el.style.opacity  = '1';
    el.style.transform = 'none';
    obs.observe(el);
  });
}


/* ══════════════════════════════════════════════════════════════
   MODE TOGGLE — PRO / PASSION avec rideau de couleur
══════════════════════════════════════════════════════════════ */
function initModeToggle() {
  const btn     = document.getElementById('mode-btn');
  const optPro  = document.getElementById('opt-pro');
  const optPerso = document.getElementById('opt-perso');
  const curtain = document.getElementById('curtain');
  if (!btn) return;

  optPro.classList.add('is-active');

  let busy = false;

  btn.addEventListener('click', () => {
    if (busy) return;
    busy = true;

    const goingPerso = !document.body.classList.contains('mode-perso');
    const outSels = goingPerso ? '.pro-section'   : '.perso-section';
    const inSels  = goingPerso ? '.perso-section' : '.pro-section';

    /* 1. Rideau entre de gauche */
    curtain.style.transition = 'transform .38s cubic-bezier(0.77,0,0.175,1)';
    curtain.style.transformOrigin = 'left center';
    curtain.style.transform = 'scaleX(1)';

    setTimeout(() => {
      /* 2. Tout switcher derrière le rideau */
      document.body.classList.toggle('mode-perso');

      document.querySelectorAll(outSels).forEach(el => {
        if (el.classList.contains('globe-section')) { el.style.display = ''; }
        else { el.style.display = 'none'; }
      });
      document.querySelectorAll(inSels).forEach(el  => {
        if (el.classList.contains('globe-section')) { el.style.display = ''; }
        else { el.style.display = 'block'; }
        /* Re-déclencher le wipe diagonal si pas encore visible */
        if (el.classList.contains('section-alt') && !el.classList.contains('diag-visible')) {
          requestAnimationFrame(() => el.classList.add('diag-visible'));
        }
        /* Re-déclencher l'orbe à propos */
        if (el.id === 'apropos' && !el.classList.contains('is-expanded')) {
          setTimeout(() => el.classList.add('is-expanded'), 150);
        }
      });

      optPro.classList.toggle('is-active',   !goingPerso);
      optPerso.classList.toggle('is-active',  goingPerso);

      if (window.__resetTags) window.__resetTags();
      ['globe-pro', 'globe-perso'].forEach(id => {
        var gc = document.getElementById(id);
        if (gc) gc.dispatchEvent(new CustomEvent('glob:reset'));
      });

      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92)
          el.classList.add('is-visible');
      });

      /* 3. Rideau sort par la droite */
      curtain.style.transformOrigin = 'right center';
      curtain.style.transform = 'scaleX(0)';

      setTimeout(() => { busy = false; }, 400);
    }, 400);
  });
}


/* ══════════════════════════════════════════════════════════════
   MODAL OUTIL
══════════════════════════════════════════════════════════════ */
function initToolModal() {
  const modal      = document.getElementById('tool-modal');
  const modalBg    = document.getElementById('modal-bg');
  const modalClose = document.getElementById('modal-close');
  const modalLogo  = document.getElementById('modal-logo');
  const modalName  = document.getElementById('modal-name');
  const modalShort = document.getElementById('modal-short');
  const modalLong  = document.getElementById('modal-long');
  const modalUrl   = document.getElementById('modal-url');
  if (!modal) return;

  function openModal(btn) {
    const logo = btn.dataset.logo || '';
    const url  = btn.dataset.url  || '';
    modalLogo.src           = logo;
    modalLogo.style.display = logo ? '' : 'none';
    modalName.textContent   = btn.dataset.name  || '';
    modalShort.innerHTML    = btn.dataset.short || '';
    modalLong.innerHTML     = btn.dataset.long  || '';
    if (url) { modalUrl.href = url; modalUrl.hidden = false; }
    else      { modalUrl.hidden = true; }
    modal.hidden              = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.tool-item').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn));
  });

  modalClose.addEventListener('click', closeModal);
  modalBg.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}


/* ══════════════════════════════════════════════════════════════
   FORMULAIRE CONTACT
══════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const btn = form.querySelector('.btn-send');

  form.addEventListener('submit', e => {
    const name = form.querySelector('#f-name').value.trim();
    const mail = form.querySelector('#f-email').value.trim();
    const msg  = form.querySelector('#f-msg').value.trim();

    if (!name || !mail || !msg) { e.preventDefault(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      e.preventDefault();
      form.querySelector('#f-email').focus();
      return;
    }

    // Validation OK — feedback visuel, laisser Formspree soumettre
    btn.disabled = true;
    btn.style.background = '#8B5CF6';
    const txt = btn.querySelector('.bs-text');
    if (txt) txt.textContent = 'Envoi en cours...';
  });

  // Retour après envoi (?sent=true dans l'URL)
  if (window.location.search.includes('sent=true')) {
    const lead = document.querySelector('.contact-lead');
    if (lead) {
      lead.textContent = 'Message envoyé ! Je te réponds dès que possible.';
      lead.style.color = '#F59E0B';
    }
  }
}


/* ══════════════════════════════════════════════════════════════
   CV PDF — jsPDF
══════════════════════════════════════════════════════════════ */
function initDownloadCV() {
  const btn = document.getElementById('btn-download-cv');
  if (!btn) return;
  btn.addEventListener('click', generateCV);
}

function generateCV() {
  if (!window.jspdf) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const noir   = [10, 10, 10];
  const violet = [139, 92, 246];
  const jaune  = [245, 158, 11];
  const blanc  = [240, 237, 232];
  const gris   = [136, 136, 136];

  // Fond noir
  doc.setFillColor(...noir);
  doc.rect(0, 0, 210, 297, 'F');

  // Bande violet en haut
  doc.setFillColor(...violet);
  doc.rect(0, 0, 210, 2, 'F');

  // Nom
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(...blanc);
  doc.text('SALIF LACAN', 20, 28);

  // Titre
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...violet);
  doc.text('Marketing Digital · Data & IA · CRM', 20, 37);

  // Ligne séparatrice
  doc.setDrawColor(...violet);
  doc.setLineWidth(0.4);
  doc.line(20, 42, 190, 42);

  // Infos contact
  doc.setFontSize(8.5);
  doc.setTextColor(...gris);
  doc.text('saliflacan00@gmail.com', 20, 49);
  doc.text('07 88 68 64 21  ·  06 40 56 13 37', 85, 49);
  doc.text('Bordeaux, 33000  ·  Véhiculé · Permis B', 148, 49);

  // ── Formation ──
  let y = 60;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...jaune);
  doc.text('FORMATION', 20, y);
  doc.setDrawColor(...jaune);
  doc.setLineWidth(0.3);
  doc.line(20, y + 2, 80, y + 2);

  y += 10;
  const formations = [
    { badge: 'Bachelor', titre: 'Marketing Digital, Data & IA',             ecole: 'INSEEC — Bordeaux', date: '2024 — 2025' },
    { badge: 'BTS',      titre: 'Négociation Digitalisation Relation Client', ecole: 'Bordeaux',          date: '2022 — 2024' },
    { badge: 'Bac',      titre: 'Baccalauréat Général — SES & LLCE',         ecole: 'Bordeaux',          date: '2021 — 2022' },
  ];
  formations.forEach(f => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...violet);
    doc.text(f.badge, 20, y);
    doc.setTextColor(...blanc);
    doc.text(f.titre, 40, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gris);
    doc.text(f.ecole + '  ·  ' + f.date, 40, y + 5);
    y += 13;
  });

  // ── Expériences ──
  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...jaune);
  doc.text('EXPÉRIENCES', 20, y);
  doc.setDrawColor(...jaune);
  doc.line(20, y + 2, 80, y + 2);

  y += 10;
  const exps = [
    {
      role: 'NDRC — Négociation Digitalisation Relation Client',
      company: 'Atelier CUB — Mérignac',
      date: '2022 — 2024  ·  Alternance',
      missions: [
        'Gestion relation client et communication multicanal',
        'Développement stratégies de vente et prospection digitale',
        'Digitalisation des processus commerciaux internes',
      ],
    },
    {
      role: 'Marketing Digital & Création Web',
      company: 'Evasion Gym — Eysines',
      date: '2022 — 2025  ·  Stage & Bénévolat',
      missions: [
        'Création et gestion du site vitrine (CMS)',
        'Stratégie digitale, réseaux sociaux, analyse performances',
      ],
    },
    {
      role: 'Stage Télécom',
      company: "Ericsson — Côte d'Ivoire",
      date: '2017  ·  Stage',
      missions: [
        'Découverte infrastructures télécommunications',
        'Participation aux opérations techniques réseau',
      ],
    },
  ];
  exps.forEach(exp => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...blanc);
    doc.text(exp.role, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...violet);
    doc.text(exp.company, 20, y + 5);
    doc.setTextColor(...gris);
    doc.text(exp.date, 20, y + 10);
    y += 15;
    exp.missions.forEach(m => {
      doc.setTextColor(...gris);
      doc.text('—  ' + m, 25, y);
      y += 5;
    });
    y += 5;
  });

  // ── Compétences ──
  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...jaune);
  doc.text('COMPÉTENCES', 20, y);
  doc.setDrawColor(...jaune);
  doc.line(20, y + 2, 80, y + 2);

  y += 10;
  const skills = [
    { cat: 'Data & Analyse',    items: 'Google Analytics · Power BI · Excel · Reporting · Analyse données' },
    { cat: 'Marketing Digital', items: 'Meta Ads · SEO · Email Marketing · Community Management · Stratégie digitale' },
    { cat: 'Outils',            items: 'Microsoft 365 · Figma · Notion · CMS/WordPress · Google Workspace · Canva' },
    { cat: 'CRM & Vente',       items: 'CRM · Relation client · Vente multicanal · Prospection digitale' },
    { cat: 'Langues',           items: 'Français natif · Anglais professionnel' },
  ];
  skills.forEach(s => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...violet);
    doc.text(s.cat + ' :', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...blanc);
    doc.text(s.items, 55, y);
    y += 7;
  });

  // Footer
  doc.setDrawColor(...violet);
  doc.setLineWidth(0.3);
  doc.line(20, 285, 190, 285);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...gris);
  doc.text('Salif Lacan  ·  Marketing Digital & Data  ·  Bordeaux 2025', 105, 291, { align: 'center' });

  // Bande jaune en bas
  doc.setFillColor(...jaune);
  doc.rect(0, 295, 210, 2, 'F');

  doc.save('CV_Salif_Lacan.pdf');
}
