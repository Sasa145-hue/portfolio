/* ══════════════════════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════════════════════ */
(function initLoader() {
  'use strict';

  const loader  = document.getElementById('loader');
  const bar     = document.getElementById('loader-bar');
  const pct     = document.getElementById('loader-percent');

  document.body.classList.add('is-loading');

  let progress = 0;

  function step() {
    const inc = progress < 70
      ? (Math.random() * 14 + 4)
      : progress < 90
        ? (Math.random() * 4 + 1)
        : (Math.random() * 1.5 + 0.5);

    progress = Math.min(progress + inc, 100);

    bar.style.width      = progress + '%';
    pct.textContent      = Math.round(progress) + '%';

    if (progress < 100) {
      setTimeout(step, 60 + Math.random() * 60);
    } else {
      setTimeout(finishLoader, 350);
    }
  }

  function finishLoader() {
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    initPage();
  }

  setTimeout(step, 120);
})();


/* ══════════════════════════════════════════════════════════════
   INIT PAGE — called after loader completes
══════════════════════════════════════════════════════════════ */
function initPage() {
  setYear();
  initNav();
  initBurger();
  initHeroTitle();
  initTagRotation();
  initReveal();
  initCounters();
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
   NAV — sticky behaviour on scroll
══════════════════════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ══════════════════════════════════════════════════════════════
   BURGER MENU
══════════════════════════════════════════════════════════════ */
function initBurger() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  function open() {
    burger.classList.add('is-open');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    burger.classList.remove('is-open');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('is-open') ? close() : open();
  });

  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.classList.contains('is-open')) close();
  });
}


/* ══════════════════════════════════════════════════════════════
   HERO TITLE — lines slide in
══════════════════════════════════════════════════════════════ */
function initHeroTitle() {
  const lines = document.querySelectorAll('.hero-title .line');

  lines.forEach(line => {
    const delay = parseInt(line.dataset.delay || '0', 10);
    setTimeout(() => line.classList.add('is-visible'), delay);
  });
}


/* ══════════════════════════════════════════════════════════════
   TAG ROTATION — hero specialties
══════════════════════════════════════════════════════════════ */
function initTagRotation() {
  const tags = document.querySelectorAll('.hero-tags .tag');
  if (tags.length < 2) return;

  let current = 0;

  setInterval(() => {
    tags[current].classList.remove('active');
    current = (current + 1) % tags.length;
    tags[current].classList.add('active');
  }, 2400);
}


/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
══════════════════════════════════════════════════════════════ */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  /* Stagger delay for grid children */
  const staggerMap = [
    { selector: '.exp-card',       base: 0, step: 90 },
    { selector: '.skill-category', base: 0, step: 70 },
    { selector: '.metric-item',    base: 0, step: 70 },
  ];

  staggerMap.forEach(({ selector, base, step }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = (base + i * step) + 'ms';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


/* ══════════════════════════════════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════════════════════════════════ */
function initCounters() {
  if (!('IntersectionObserver' in window)) return;

  const counters = document.querySelectorAll('.metric-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseFloat(el.dataset.target);
      const duration = 1600;
      const start    = performance.now();

      function ease(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function frame(now) {
        const elapsed = Math.min((now - start) / duration, 1);
        const value   = Math.round(ease(elapsed) * target);
        el.textContent = value;
        if (elapsed < 1) requestAnimationFrame(frame);
        else el.textContent = target;
      }

      requestAnimationFrame(frame);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}


/* ══════════════════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn      = form.querySelector('.btn-submit');
  const btnText  = btn.querySelector('.btn-text');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Basic client-side validation */
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.querySelector('#email').focus();
      return;
    }

    /* Visual feedback */
    btn.classList.add('is-sent');
    btn.disabled = true;
    btn.style.background = '#22c55e';

    /* Reset after delay */
    setTimeout(() => {
      btn.classList.remove('is-sent');
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 3500);

    /*
      ⚠️ Connectez ici votre backend / service email :
      Ex : fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, message }) })
      Ex : intégration Formspree → action="https://formspree.io/f/YOUR_ID"
    */
  });
}
