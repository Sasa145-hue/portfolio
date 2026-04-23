'use strict';

/* ══════════════════════════════════════════════════════════════
   GSAP — enregistrement plugins + easings éditoriaux
══════════════════════════════════════════════════════════════ */
if (window.gsap) {
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.CustomEase)    gsap.registerPlugin(CustomEase);
  if (window.CustomEase) {
    CustomEase.create('editorial', '0.16, 1, 0.3, 1');
    CustomEase.create('snap',      '0.87, 0, 0.13, 1');
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0);
  }
}


/* ══════════════════════════════════════════════════════════════
   LOADER — éditorial avec split lettres GSAP
══════════════════════════════════════════════════════════════ */
(function () {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loader-bar');
  const pct    = document.getElementById('loader-pct');
  document.body.classList.add('is-loading');

  /* Split le nom lettre par lettre */
  const nameEl = document.querySelector('.loader-name');
  if (nameEl && window.gsap) {
    const letters = [...nameEl.textContent];
    nameEl.innerHTML = letters.map(l =>
      `<span style="display:inline-block;overflow:hidden"><span class="loader-letter-inner" style="display:inline-block">${l === ' ' ? '&nbsp;' : l}</span></span>`
    ).join('');
    gsap.from('.loader-letter-inner', {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.04,
      ease: 'editorial',
      delay: 0.1
    });
  }

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
    if (window.gsap) {
      gsap.to('.loader-inner', {
        yPercent: -110,
        duration: 0.85,
        ease: 'snap',
        onComplete: () => {
          loader.classList.add('is-done');
          document.body.classList.remove('is-loading');
          initAll();
        }
      });
    } else {
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
      initAll();
    }
  }
  setTimeout(tick, 100);
})();


/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
function initAll() {
  setYear();
  initCursor();
  initHeroTitleEditorial();
  initTagRotation();
  initParallax();
  initPhotoTilt();
  initParticles();
  initLetterSplit();
  initReveal();
  initScrollRevealEditorial();
  initMagneticCards();
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
   CURSEUR ÉDITORIAL — GSAP quickTo
══════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    return;
  }

  if (!window.gsap) {
    /* Fallback sans GSAP */
    cursor.style.display = 'none';
    return;
  }

  const ring = cursor.querySelector('.cursor-ring');
  const dot  = cursor.querySelector('.cursor-dot');

  /* Centrage + position initiale hors écran */
  gsap.set([ring, dot], { xPercent: -50, yPercent: -50, x: -200, y: -200 });

  /* quickTo = version ultra-performante de gsap.to pour les updates fréquents */
  const moveDotX  = gsap.quickTo(dot,  'x', { duration: 0.10 });
  const moveDotY  = gsap.quickTo(dot,  'y', { duration: 0.10 });
  const moveRingX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power2.out' });
  const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power2.out' });

  window.addEventListener('mousemove', e => {
    moveDotX(e.clientX);  moveDotY(e.clientY);
    moveRingX(e.clientX); moveRingY(e.clientY);
  });

  /* Scale sur éléments interactifs */
  document.querySelectorAll('a, button, .tool-item, .tl').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(ring, { scale: 1.8, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot,  { opacity: 0.4, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(ring, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      gsap.to(dot,  { opacity: 1, duration: 0.2 });
    });
  });

  document.addEventListener('mouseleave', () => gsap.to([ring, dot], { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () => gsap.to([ring, dot], { opacity: 1, duration: 0.3 }));
  document.addEventListener('mousedown',  () => gsap.to(ring, { scale: 0.75, duration: 0.15 }));
  document.addEventListener('mouseup',    () => gsap.to(ring, { scale: 1,    duration: 0.3,  ease: 'elastic.out(1, 0.5)' }));
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
   HERO — RÉVÉLATION ÉDITORIALE (GSAP yPercent)
══════════════════════════════════════════════════════════════ */
function initHeroTitleEditorial() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroName = document.querySelector('.hero-name');

  if (!window.gsap || reduced) {
    /* Fallback : mécanisme CSS original */
    document.querySelectorAll('.hero-name .line').forEach(line => {
      const delay = parseInt(line.dataset.delay || '0', 10);
      setTimeout(() => line.classList.add('is-visible'), delay);
    });
    setTimeout(() => {
      document.querySelectorAll('.reveal-h').forEach(el => el.classList.add('is-visible'));
    }, 700);
    return;
  }

  /* Passer en mode GSAP — désactive le clip-path CSS */
  heroName.classList.add('gsap-driven');

  /* Envelopper chaque ligne dans un span pour overflow:hidden masqué */
  heroName.querySelectorAll('.line').forEach(line => {
    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.innerHTML = line.innerHTML;
    line.innerHTML  = '';
    line.appendChild(inner);
  });

  /* Animer les inner spans depuis le bas */
  const inners = heroName.querySelectorAll('.line-inner');
  gsap.from(inners, {
    yPercent: 108,
    duration: 1.2,
    stagger: 0.14,
    delay: 0.1,
    ease: 'editorial'
  });

  /* Subtitle : démasquage clip-path depuis la droite */
  const activeSub = document.querySelector('.hero-sub:not([style*="none"])');
  gsap.from('.hero-sub', {
    clipPath: 'inset(0 100% 0 0)',
    duration: 1.0,
    delay: 0.45,
    ease: 'snap'
  });

  /* Bio : mots un par un */
  const bio = document.querySelector('.hero-bio');
  if (bio) {
    bio.classList.add('is-visible'); /* évite double animation CSS */
    const words = bio.textContent.trim().split(/\s+/);
    bio.innerHTML = words.map(w =>
      `<span style="display:inline-block;overflow:hidden"><span class="word-inner" style="display:inline-block">${w}&nbsp;</span></span>`
    ).join('');
    gsap.from(bio.querySelectorAll('.word-inner'), {
      yPercent: 110,
      duration: 0.65,
      stagger: 0.025,
      delay: 0.65,
      ease: 'editorial'
    });
  }

  /* CTA reveal — pre-mark visible so GSAP animates 0→1 */
  const cta = document.querySelector('.hero-cta');
  if (cta) {
    cta.classList.add('is-visible');
    gsap.from(cta, {
      opacity: 0,
      y: 20,
      duration: 0.9,
      delay: 0.8,
      ease: 'editorial'
    });
  }
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
   SCROLL REVEAL ÉDITORIAL — GSAP ScrollTrigger
══════════════════════════════════════════════════════════════ */
function initScrollRevealEditorial() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Numéros de section : compteur animé 00 → XX */
  document.querySelectorAll('.s-num').forEach(el => {
    const target = parseInt(el.textContent, 10);
    if (isNaN(target)) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(obj.val)).padStart(2, '0');
      },
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* Dates timeline : glissement depuis la gauche */
  document.querySelectorAll('.tl-date').forEach(el => {
    gsap.from(el, {
      x: -18,
      opacity: 0,
      duration: 0.55,
      ease: 'editorial',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  /* Section head : col titles en clip-path depuis la gauche */
  document.querySelectorAll('.col-ttl').forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 0.9,
      ease: 'snap',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
}


/* ══════════════════════════════════════════════════════════════
   CARTES MAGNÉTIQUES — tilt 3D au survol
══════════════════════════════════════════════════════════════ */
function initMagneticCards() {
  if (!window.gsap) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.tl, .tool-cat, .passion-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) / rect.width;
      const y = (e.clientY - rect.top  - rect.height / 2) / rect.height;
      gsap.to(card, {
        rotationY: x * 7,
        rotationX: -y * 7,
        transformPerspective: 900,
        duration: 0.35,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.6)'
      });
    });
  });
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
   OUTILS — données + modal screenshot
══════════════════════════════════════════════════════════════ */
const toolsData = {
  'CMS & E-commerce': [
    { name: 'WordPress',   desc: 'Sites vitrines & blogs',      url: 'https://wordpress.org',    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 1.5c1.58 0 3.053.47 4.285 1.273L5.773 16.285A8.454 8.454 0 0 1 3.5 12c0-4.687 3.813-8.5 8.5-8.5zm0 17c-1.58 0-3.053-.47-4.285-1.273l10.512-11.512A8.454 8.454 0 0 1 20.5 12c0 4.687-3.813 8.5-8.5 8.5z"/></svg>' },
    { name: 'Shopify',     desc: 'E-commerce clé en main',      url: 'https://shopify.com',      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.337 23.979l7.453-1.631S19.737 7.209 19.7 6.978c-.038-.23-.23-.384-.46-.384-.191 0-3.64-.077-3.64-.077s-2.373-2.296-2.641-2.564v20.026h.002zM11.595 2.146S10.14.93 7.652.93c-3.45 0-5.116 2.182-5.116 4.364 0 2.373 1.514 3.527 3.527 4.594 1.589.843 2.182 1.475 2.182 2.565 0 1.322-.92 2.066-2.296 2.066-1.57 0-2.834-.843-2.834-.843l-.49 1.781s1.1.766 2.949.766c2.987 0 5.27-1.627 5.27-4.21 0-2.183-1.322-3.45-3.22-4.479-1.474-.802-2.297-1.437-2.297-2.527 0-1.015.766-1.97 2.373-1.97.88 0 1.895.27 2.335.5l.56-1.39z"/></svg>' },
    { name: 'Webflow',     desc: 'Design no-code avancé',       url: 'https://webflow.com',      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.82 8.764c-1.208 3.283-2.76 6.813-4.617 8.855v-5.77l-2.12 5.77C9.47 17.12 8.428 15.8 7.64 14.11L6.31 24 3 21.274l2.327-15.88c1.045-.037 2.08.006 2.08.006L9.63 12.31V5.4h2.91l.694 3.47c.63-.98 1.303-2.273 1.96-3.47H17.8l.02 3.364z"/></svg>' },
    { name: 'PrestaShop',  desc: 'E-commerce open-source',      url: 'https://prestashop.com',   icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/></svg>' },
  ],
  'Data & Analytics': [
    { name: 'Google Analytics 4',    desc: 'Suivi & analyse du trafic',           url: 'https://marketingplatform.google.com/about/analytics/', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.002 0C5.374 0 0 5.373 0 12s5.374 12 12.002 12C18.628 24 24 18.627 24 12S18.628 0 12.002 0zM3 15.786V8.214L8.143 12 3 15.786zm2.614 1.97l6.388-4.634v9.27L5.614 17.756zm7.388-4.634l6.388 4.634-6.388 4.636V13.12zM21 8.214v7.572L15.857 12 21 8.214zm-9-4.878l6.388 4.634-6.388 4.636V3.336zm-1 0v9.27L4.614 7.97 11 3.336z"/></svg>' },
    { name: 'Google Search Console', desc: 'SEO & performances Google',            url: 'https://search.google.com/search-console/about',       icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>' },
    { name: 'Power BI',              desc: 'Dashboards & reporting',               url: 'https://powerbi.microsoft.com/fr-fr/',                 icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h3v18H5zm4.5 4H13v14H9.5zM14 7h3.5v10H14zm5-4h.5v18H19z"/></svg>' },
    { name: 'Looker Studio',         desc: 'Dashboards Google interconnectés',     url: 'https://lookerstudio.google.com',                      icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
    { name: 'Gephi',                 desc: 'Visualisation de réseaux de données',  url: 'https://gephi.org',                                    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><line x1="6" y1="6.5" x2="9.5" y2="11" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="6.5" x2="14.5" y2="11" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="17.5" x2="9.5" y2="13" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="17.5" x2="14.5" y2="13" stroke="currentColor" stroke-width="1.5"/></svg>' },
  ],
  'Marketing & Publicité': [
    { name: 'Google Ads', desc: 'Search, Display & Shopping',   url: 'https://ads.google.com',                  icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.084 17.5l5-8.66L9.5 10.5l-4.958 8.59-2.458-1.59zM12 6.5l2.5 4.33-5 8.67H4.5L12 6.5zm1.584 11l5-8.66 2.332 1.41-5 8.66-2.332-1.41z"/></svg>' },
    { name: 'Meta Ads',   desc: 'Facebook & Instagram Ads',     url: 'https://www.facebook.com/business/ads',   icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
    { name: 'HubSpot',    desc: 'CRM & automation',             url: 'https://hubspot.com',                     icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.175 11.99a3.12 3.12 0 0 0-2.65-3.084V6.688a1.536 1.536 0 0 0 .89-1.386 1.538 1.538 0 0 0-3.075 0c0 .603.35 1.124.89 1.386v2.217a3.116 3.116 0 0 0-1.489.702L10.58 6.272a2.04 2.04 0 0 0-.06-2.966A2.04 2.04 0 0 0 7.65 6.272a2.04 2.04 0 0 0 2.04 0l5.986 3.222a3.123 3.123 0 0 0 .234 4.058l-1.813 1.813a1.968 1.968 0 0 0-.554-.083 1.994 1.994 0 1 0 1.995 1.994 1.97 1.97 0 0 0-.083-.554l1.813-1.813a3.124 3.124 0 0 0 4.908-2.92z"/></svg>' },
    { name: 'Mailchimp',  desc: 'Email marketing & automation', url: 'https://mailchimp.com',                   icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 2c-4.5 0-8 3-8 7 0 2.5 1.5 4.5 3.5 5.5-.5 1-1 2-1 3 0 2.5 2 4.5 5 4.5s5-2 5-4.5c0-1-.5-2-1-3 2-1 3.5-3 3.5-5.5 0-4-3.5-7-8-7zm0 2c3.5 0 6 2.5 6 5 0 2-1.5 3.5-3 4.5l-.5.5.5.5c.5 1 1 1.5 1 2.5 0 1.5-1.5 2.5-3.5 2.5s-3.5-1-3.5-2.5c0-1 .5-1.5 1-2.5l.5-.5-.5-.5c-1.5-1-3-2.5-3-4.5 0-2.5 2.5-5 6-5z"/></svg>' },
  ],
  'Production & Bureautique': [
    { name: 'Suite Microsoft 365', desc: 'Word, Excel, PowerPoint, Teams', url: 'https://www.microsoft.com/fr-fr/microsoft-365', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2L2 6v12l9.5 4 9.5-4V6L11.5 2zm0 2.3l7 2.9-7 2.9-7-2.9 7-2.9zM4 8.9l7 2.9v7.8L4 16.7V8.9zm9 10.7v-7.8l7-2.9v7.8l-7 2.9z"/></svg>' },
    { name: 'Figma',               desc: 'Design UI/UX collaboratif',     url: 'https://figma.com',                                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm0-20H4C1.792 4 0 5.792 0 8s1.792 4 4 4h4V4zm4 0v8h4c2.208 0 4-1.792 4-4s-1.792-4-4-4h-4zm4 10h-4v4c0 2.208 1.792 4 4 4s4-1.792 4-4-1.792-4-4-4z"/></svg>' },
    { name: 'Notion',               desc: 'Organisation & documentation',  url: 'https://notion.so',                                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z"/></svg>' },
    { name: 'Canva',                desc: 'Création graphique & visuels',  url: 'https://canva.com',                                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.908 7.453c.676 0 1.23.5 1.23 1.113 0 .62-.554 1.124-1.23 1.124-.682 0-1.232-.503-1.232-1.124 0-.614.55-1.113 1.232-1.113zM8.307 7.63c1.96 0 3.56 1.565 3.56 3.498 0 .613-.167 1.19-.453 1.686.29.1.555.25.78.45.37-.73.577-1.557.577-2.43 0-3.006-2.44-5.44-5.463-5.44-3.02 0-5.463 2.434-5.463 5.44 0 3.005 2.444 5.44 5.463 5.44.838 0 1.63-.19 2.337-.527-.2-.225-.35-.487-.45-.773-.563.254-1.19.4-1.888.4C6.15 15.374 4.4 13.64 4.4 11.5c0-2.14 1.75-3.87 3.906-3.87zm9.695 1.67c.547 0 .987.438.987.975 0 .54-.44.977-.987.977-.548 0-.99-.437-.99-.977 0-.537.442-.975.99-.975zm-3.24 1.553c.543 0 .99.44.99.977 0 .54-.447.977-.99.977-.547 0-.987-.437-.987-.977 0-.538.44-.977.987-.977zm-1.51 2.13c-.74 1.094-1.99 1.816-3.41 1.816-.47 0-.92-.08-1.34-.22.12.47.42.87.84 1.12.43.24.92.32 1.41.24.92-.15 1.7-.78 2.06-1.65l.44-1.31zm5.28 1.37c-.54 0-.99.44-.99.98s.45.977.99.977c.545 0 .988-.437.988-.977s-.443-.98-.988-.98z"/></svg>' },
  ],
};

function buildOutilsSection() {
  const container = document.getElementById('outils-columns');
  if (!container) return;
  Object.entries(toolsData).forEach(([category, tools]) => {
    const col = document.createElement('div');
    col.className = 'outil-category reveal';
    const title = document.createElement('h3');
    title.className = 'outil-category-title';
    title.textContent = category;
    col.appendChild(title);
    tools.forEach(tool => {
      const row = document.createElement('div');
      row.className = 'outil-row';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', `Explorer ${tool.name}`);
      row.innerHTML = `<div class="outil-icon">${tool.icon}</div><div class="outil-info"><span class="outil-name">${tool.name}</span><span class="outil-desc">${tool.desc}</span></div><span class="outil-arrow">→</span>`;
      row.addEventListener('click', () => window.openToolModal && window.openToolModal(tool));
      row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.openToolModal && window.openToolModal(tool); } });
      col.appendChild(row);
    });
    container.appendChild(col);
  });
}

function getScreenshotUrl(url) {
  return `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=720`;
}

function initModalStars() {
  const canvas = document.getElementById('tool-modal-stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    o: Math.random() * 0.6 + 0.1,
    speed: Math.random() * 0.3 + 0.05
  }));

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.o += s.speed * 0.02;
      if (s.o > 0.7) s.speed = -Math.abs(s.speed);
      if (s.o < 0.1) s.speed =  Math.abs(s.speed);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.o})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
}

function initToolModal() {
  initModalStars();
  buildOutilsSection();

  const modal      = document.getElementById('tool-modal');
  const backdrop   = document.getElementById('tool-modal-backdrop');
  const nameTop    = document.getElementById('tool-modal-name-top');
  const screenshot = document.getElementById('tool-screenshot');
  const loader     = document.getElementById('screenshot-loader');
  const fallback   = document.getElementById('screenshot-fallback');
  const sfName     = document.getElementById('sf-name');
  const sfDesc     = document.getElementById('sf-desc');
  const liveBtn    = document.getElementById('tool-live-btn');
  const closeBtn   = document.getElementById('tool-modal-close');
  if (!modal) return;

  window.openToolModal = function(tool) {
    if (typeof tool === 'string') {
      let found;
      for (const tools of Object.values(toolsData)) {
        found = tools.find(t => t.name === tool);
        if (found) break;
      }
      if (!found) return;
      tool = found;
    }

    screenshot.classList.add('is-loading');
    loader.classList.remove('is-hidden');
    fallback.style.display = 'none';
    nameTop.textContent = tool.name;
    sfName.textContent  = tool.name;
    sfDesc.textContent  = tool.desc || '';
    if (liveBtn) liveBtn.href = tool.url;

    const img = new Image();
    const timer = setTimeout(() => {
      loader.classList.add('is-hidden');
      fallback.style.display = 'flex';
    }, 8000);

    img.onload = () => {
      clearTimeout(timer);
      screenshot.src = img.src;
      screenshot.classList.remove('is-loading');
      loader.classList.add('is-hidden');
    };
    img.onerror = () => {
      clearTimeout(timer);
      loader.classList.add('is-hidden');
      fallback.style.display = 'flex';
    };
    img.src = getScreenshotUrl(tool.url);

    modal.classList.add('is-open');
    backdrop.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  function closeModal() {
    modal.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      screenshot.src = '';
      screenshot.classList.add('is-loading');
      loader.classList.remove('is-hidden');
      fallback.style.display = 'none';
    }, 600);
  }

  document.querySelectorAll('#logiciels .tool-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name || '';
      window.openToolModal && window.openToolModal(name || { name, desc: '', url: btn.dataset.url || '#' });
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
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


