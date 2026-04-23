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
    { name: 'WordPress',  desc: 'Sites vitrines & blogs',         url: 'https://wordpress.org',   screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fwordpress.org?w=1280&h=720' },
    { name: 'Drupal',     desc: 'Sites institutionnels complexes', url: 'https://drupal.org',      screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fdrupal.org?w=1280&h=720' },
    { name: 'Wix',        desc: 'Création drag-and-drop',         url: 'https://wix.com',         screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fwix.com?w=1280&h=720' },
    { name: 'PrestaShop', desc: 'E-commerce open-source',         url: 'https://prestashop.com',  screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fprestashop.com?w=1280&h=720' },
  ],
  'Data & Analytics': [
    { name: 'Google Analytics 4',    desc: 'Suivi & analyse du trafic',          url: 'https://marketingplatform.google.com/about/analytics/', screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fmarketingplatform.google.com%2Fabout%2Fanalytics%2F?w=1280&h=720' },
    { name: 'Google Search Console', desc: 'SEO & performances Google',           url: 'https://search.google.com/search-console/about',        screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fsearch.google.com%2Fsearch-console%2Fabout?w=1280&h=720' },
    { name: 'Power BI',              desc: 'Dashboards & reporting',              url: 'https://powerbi.microsoft.com/fr-fr/',                  screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fpowerbi.microsoft.com%2Ffr-fr%2F?w=1280&h=720' },
    { name: 'Looker Studio',         desc: 'Dashboards Google interconnectés',    url: 'https://lookerstudio.google.com',                       screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Flookerstudio.google.com?w=1280&h=720' },
    { name: 'Gephi',                 desc: 'Visualisation de réseaux de données', url: 'https://gephi.org',                                     screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fgephi.org?w=1280&h=720' },
  ],
  'Marketing & Publicité': [
    { name: 'Google Ads', desc: 'Search, Display & Shopping',   url: 'https://ads.google.com',               screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fads.google.com?w=1280&h=720' },
    { name: 'Meta Ads',   desc: 'Facebook & Instagram Ads',     url: 'https://www.facebook.com/business/ads', screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fwww.facebook.com%2Fbusiness%2Fads?w=1280&h=720' },
    { name: 'HubSpot',    desc: 'CRM & automation',             url: 'https://hubspot.com',                  screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fhubspot.com?w=1280&h=720' },
    { name: 'Mailchimp',  desc: 'Email marketing & automation', url: 'https://mailchimp.com',                screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fmailchimp.com?w=1280&h=720' },
  ],
  'Outils & Bureautique': [
    { name: 'Figma',            desc: 'Design UI/UX collaboratif',      url: 'https://figma.com',                             screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Ffigma.com?w=1280&h=720' },
    { name: 'Notion',           desc: 'Organisation & documentation',   url: 'https://notion.so',                             screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fnotion.so?w=1280&h=720' },
    { name: 'Canva',            desc: 'Création graphique & visuels',   url: 'https://canva.com',                             screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fcanva.com?w=1280&h=720' },
    { name: 'Microsoft 365',    desc: 'Word, Excel, PowerPoint, Teams', url: 'https://www.microsoft.com/fr-fr/microsoft-365', screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fwww.microsoft.com%2Ffr-fr%2Fmicrosoft-365?w=1280&h=720' },
    { name: 'Google Workspace', desc: 'Gmail, Drive, Docs, Sheets',     url: 'https://workspace.google.com',                 screenshot: 'https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fworkspace.google.com?w=1280&h=720' },
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
    img.src = tool.screenshot || getScreenshotUrl(tool.url);

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
      const url  = btn.dataset.url || '#';
      const name = btn.querySelector('.tool-name')?.textContent || btn.dataset.name || '';
      const desc = btn.querySelector('.tool-desc')?.textContent || btn.dataset.short || '';
      window.openToolModal && window.openToolModal({ name, desc, url, screenshot: getScreenshotUrl(url) });
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
  doc.text('07 88 68 64 21', 85, 49);
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


