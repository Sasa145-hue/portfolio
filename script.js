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
  initLetterSplit();
  initReveal();
  initScrollCircle();
  initModeToggle();
  initToolModal();
  initContactForm();
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

      document.querySelectorAll(outSels).forEach(el => { el.style.display = 'none'; });
      document.querySelectorAll(inSels).forEach(el  => { el.style.display = 'block'; });

      optPro.classList.toggle('is-active',   !goingPerso);
      optPerso.classList.toggle('is-active',  goingPerso);

      if (window.__resetTags) window.__resetTags();

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
    e.preventDefault();
    const name = form.querySelector('#f-name').value.trim();
    const mail = form.querySelector('#f-email').value.trim();
    const msg  = form.querySelector('#f-msg').value.trim();
    if (!name || !mail || !msg) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      form.querySelector('#f-email').focus(); return;
    }

    btn.classList.add('is-sent');
    btn.disabled        = true;
    btn.style.background = '#4ade80';
    btn.style.color      = '#fff';

    setTimeout(() => {
      btn.classList.remove('is-sent');
      btn.disabled         = false;
      btn.style.background = '';
      btn.style.color      = '';
      form.reset();
    }, 3500);
  });
}
