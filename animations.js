/**
 * FERRO & NAVALHA — ANIMATIONS
 * Intersection Observer para reveal suave de elementos.
 * Respeita prefers-reduced-motion.
 */
(function () {
  'use strict';

  // Respeita preferência de acessibilidade
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  // ── Reveal Observer ──────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Stagger delay baseado no índice dentro do pai
          const siblings = Array.from(el.parentElement.querySelectorAll('[data-reveal]'));
          const idx = siblings.indexOf(el);
          const baseDelay = parseFloat(el.dataset.delay || 0);
          el.style.transitionDelay = (baseDelay + idx * 0.07) + 's';
          el.classList.add('revealed');
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function initReveal() {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ── Hero headline stagger ────────────────────────────────────
  function initHeroAnimation() {
    const lines = document.querySelectorAll('.hero-headline .line');
    const sub = document.querySelector('.hero-sub');
    const ctas = document.querySelector('.hero-ctas');
    const stats = document.querySelector('.hero-stats');
    const eyebrow = document.querySelector('.hero-eyebrow');

    const items = [eyebrow, ...lines, sub, ctas, stats].filter(Boolean);

    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)`;
      el.style.transitionDelay = (0.1 + i * 0.12) + 's';
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        items.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }

  // ── Services cards hover glow ────────────────────────────────
  function initCardEffects() {
    const cards = document.querySelectorAll('.servico-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  // ── Gallery hover stagger ────────────────────────────────────
  function initGallery() {
    const grid = document.querySelector('.galeria-grid');
    const items = document.querySelectorAll('.galeria-item');
    if (!grid || !items.length) return;

    items.forEach((item, i) => {
      item.addEventListener('mouseenter', function () {
        items.forEach((other, j) => {
          const dist = Math.abs(j - i);
          other.style.transitionDelay = (dist * 0.03) + 's';
        });
      });
    });
  }

  // ── Active nav on scroll ─────────────────────────────────────
  function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach(s => observer.observe(s));
  }

  // ── Counter animation ────────────────────────────────────────
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const stats = document.querySelectorAll('.stat strong');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const num = parseFloat(text.replace(/[^0-9.]/g, ''));
          if (!isNaN(num) && num > 0) {
            const sup = el.querySelector('sup');
            const supText = sup ? sup.textContent : '';
            el.textContent = '0';
            if (sup) el.appendChild(sup);
            animateCounter(el.firstChild || el, num, 1800);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.8 });

    stats.forEach(el => observer.observe(el));
  }

  // ── Init all ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initHeroAnimation();
    initCardEffects();
    initGallery();
    initNavHighlight();
    initCounters();
  });

})();
