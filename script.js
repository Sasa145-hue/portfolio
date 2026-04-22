'use strict';

/* ══════════════════════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════════════════════ */
(function() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loader-bar');
  const pct    = document.getElementById('loader-percent');

  document.body.classList.add('is-loading');

  let progress = 0;

  function step() {
    const inc = progress < 70
      ? Math.random() * 14 + 5
      : progress < 92
        ? Math.random() * 4 + 1
        : Math.random() * 1.2 + 0.3;

    progress = Math.min(progress + inc, 100);
    bar.style.width  = progress + '%';
    pct.textContent  = Math.round(progress) + '%';

    if (progress < 100) {
      setTimeout(step, 55 + Math.random() * 65);
    } else {
      setTimeout(finishLoader, 320);
    }
  }

  function finishLoader() {
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    initAll();
  }

  setTimeout(step, 100);
})();


/* ══════════════════════════════════════════════════════════════
   INIT GLOBAL
══════════════════════════════════════════════════════════════ */
function initAll() {
  setYear();
  initCursor();
  initHeroLines();
  initTagRotation();
  initParallax();
  initReveal();
  initModeToggle();
  initContactForm();
}


/* ══════════════════════════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════════════════════════ */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ══════════════════════════════════════════════════════════════
   CURSEUR CARTOON CUSTOM
══════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  /* Sur mobile/tactile, on cache le curseur custom */
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => el.style.cursor = '');
    return;
  }

  const ring = cursor.querySelector('.cursor-ring');
  const dot  = cursor.querySelector('.cursor-dot');

  let mx = -100, my = -100; // position cible souris
  let rx = -100, ry = -100; // position réelle du ring (lag)
  let dx = -100, dy = -100; // position réelle du dot (plus rapide)

  /* Lag du ring : 0.1 = plus lent/cartoon, dot : 0.25 */
  const RING_EASE = 0.1;
  const DOT_EASE  = 0.3;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function loop() {
    rx += (mx - rx) * RING_EASE;
    ry += (my - ry) * RING_EASE;
    dx += (mx - dx) * DOT_EASE;
    dy += (my - dy) * DOT_EASE;

    cursor.style.transform = `translate(${dx}px, ${dy}px)`;
    ring.style.transform   = `translate(${rx - dx}px, ${ry - dy}px) translate(-50%, -50%)`;
    dot.style.transform    = `translate(-50%, -50%)`;

    requestAnimationFrame(loop);
  }
  loop();

  /* Hover sur interactifs */
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, textarea, [role="button"]')) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input, textarea, [role="button"]')) {
      document.body.classList.remove('cursor-hover');
    }
  });

  /* Click press */
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  /* Masquer quand la souris quitte la fenêtre */
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}


/* ══════════════════════════════════════════════════════════════
   HERO — LIGNES TITRE
══════════════════════════════════════════════════════════════ */
function initHeroLines() {
  document.querySelectorAll('.hero-name .line').forEach(line => {
    const delay = parseInt(line.dataset.delay || '0', 10);
    setTimeout(() => line.classList.add('is-visible'), delay);
  });
}


/* ══════════════════════════════════════════════════════════════
   HERO — ROTATION DE TAGS
══════════════════════════════════════════════════════════════ */
function initTagRotation() {
  function rotateSet(container) {
    const tags = container ? container.querySelectorAll('.tag') : [];
    if (tags.length < 2) return null;
    let current = 0;
    return setInterval(() => {
      tags[current].classList.remove('active');
      current = (current + 1) % tags.length;
      tags[current].classList.add('active');
    }, 2600);
  }

  let timerPro   = rotateSet(document.querySelector('.hero-tags-pro'));
  let timerPerso = rotateSet(document.querySelector('.hero-tags-perso'));

  /* Reset les timers quand le mode change */
  document.getElementById('mode-btn').addEventListener('click', () => {
    clearInterval(timerPro);
    clearInterval(timerPerso);

    /* Reset active states */
    document.querySelectorAll('.hero-tags .tag').forEach((t, i) => {
      t.classList.toggle('active', i === 0);
    });

    timerPro   = rotateSet(document.querySelector('.hero-tags-pro'));
    timerPerso = rotateSet(document.querySelector('.hero-tags-perso'));
  });
}


/* ══════════════════════════════════════════════════════════════
   HERO — PARALLAX SOURIS
══════════════════════════════════════════════════════════════ */
function initParallax() {
  const hero   = document.querySelector('.hero');
  if (!hero) return;

  /* Éléments avec data-depth */
  const parallaxEls = hero.querySelectorAll('[data-depth]');

  let cx = window.innerWidth  / 2;
  let cy = window.innerHeight / 2;

  /* Recalcule le centre si resize */
  window.addEventListener('resize', () => {
    cx = window.innerWidth  / 2;
    cy = window.innerHeight / 2;
  }, { passive: true });

  let ticking = false;

  hero.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const dx = (e.clientX - cx) / cx; // -1 → 1
      const dy = (e.clientY - cy) / cy; // -1 → 1

      parallaxEls.forEach(el => {
        const depth = parseFloat(el.dataset.depth);
        const tx = dx * depth * 40;
        const ty = dy * depth * 28;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });

      ticking = false;
    });
  });

  /* Retour doux au centre quand la souris quitte le hero */
  hero.addEventListener('mouseleave', () => {
    parallaxEls.forEach(el => {
      el.style.transition = 'transform 1.2s ease';
      el.style.transform  = 'translate(0, 0)';
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

  /* Stagger sur les grilles */
  [
    { sel: '.tl-item',       step: 80  },
    { sel: '.skill-cat',     step: 70  },
    { sel: '.passion-card',  step: 80  },
    { sel: '.projet-card',   step: 90  },
    { sel: '.contact-card',  step: 60  },
  ].forEach(({ sel, step }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = (i * step) + 'ms';
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}


/* ══════════════════════════════════════════════════════════════
   BOUTON MODE PRO / PERSO
══════════════════════════════════════════════════════════════ */
function initModeToggle() {
  const btn = document.getElementById('mode-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isPerso = document.body.classList.toggle('mode-perso');

    /* Re-trigger les reveals dans le nouveau contenu visible */
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          el.classList.add('is-visible');
        }
      });
    }, 50);
  });
}


/* ══════════════════════════════════════════════════════════════
   FORMULAIRE DE CONTACT
══════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn = form.querySelector('.btn-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.querySelector('#email').focus();
      return;
    }

    btn.classList.add('is-sent');
    btn.disabled = true;
    btn.style.background = '#4ade80';

    setTimeout(() => {
      btn.classList.remove('is-sent');
      btn.disabled         = false;
      btn.style.background = '';
      form.reset();
    }, 3500);

    /*
      Connecter ici votre service d'envoi :
      fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, message }) })
    */
  });
}
