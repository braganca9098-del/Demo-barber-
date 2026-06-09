/**
 * FERRO & NAVALHA — MAIN JS
 * Header scroll, mobile nav, popup, smooth scroll, WhatsApp.
 */
(function () {
  'use strict';

  // ── Header scroll behaviour ──────────────────────────────────
  const header = document.getElementById('site-header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    // Hide on scroll down (> 200px in), show on scroll up
    if (y > 200) {
      if (y > lastScrollY + 8) {
        header.style.transform = 'translateY(-100%)';
      } else if (y < lastScrollY - 4) {
        header.style.transform = 'translateY(0)';
      }
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  header.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s, box-shadow 0.4s';

  // ── Mobile navigation ────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  function toggleNav(open) {
    const isOpen = open !== undefined ? open : !mainNav.classList.contains('open');
    mainNav.classList.toggle('open', isOpen);
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      toggleNav();
    });
  }

  // Close nav on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      toggleNav(false);
    });
  });

  // Close on overlay click (when nav open)
  document.addEventListener('click', function (e) {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      toggleNav(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      toggleNav(false);
      closePopup();
    }
  });

  // ── Smooth scroll for anchor links ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ── Popup ────────────────────────────────────────────────────
  const popup = document.getElementById('popup-overlay');
  const popupClose = document.getElementById('popup-close');
  const popupSubmit = document.getElementById('popup-submit');

  function openPopup() {
    if (!popup) return;
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
    const firstInput = popup.querySelector('input, select, button');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closePopup() {
    if (!popup) return;
    popup.hidden = true;
    document.body.style.overflow = '';
  }

  if (popupClose) popupClose.addEventListener('click', closePopup);

  if (popup) {
    popup.addEventListener('click', function (e) {
      if (e.target === popup) closePopup();
    });
  }

  if (popupSubmit) {
    popupSubmit.addEventListener('click', function () {
      const nome = document.getElementById('popup-nome');
      const tel = document.getElementById('popup-tel');
      const servico = document.getElementById('popup-servico');

      // Simple validation
      const fields = [nome, tel, servico];
      let valid = true;
      fields.forEach(f => {
        if (!f) return;
        if (!f.value.trim()) {
          f.style.borderColor = '#c0392b';
          valid = false;
        } else {
          f.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Success state
      popupSubmit.textContent = 'Agendamento enviado! ✓';
      popupSubmit.style.background = '#2d8a4e';
      popupSubmit.style.borderColor = '#2d8a4e';
      popupSubmit.disabled = true;

      setTimeout(function () {
        closePopup();
        // Reset
        fields.forEach(f => { if (f) f.value = ''; });
        popupSubmit.textContent = 'Confirmar Agendamento';
        popupSubmit.style.background = '';
        popupSubmit.style.borderColor = '';
        popupSubmit.disabled = false;
      }, 2000);
    });
  }

  // Show popup when "Agendar Agora" or header CTA is clicked
  document.querySelectorAll('a[href="#agendar"]').forEach(link => {
    link.addEventListener('click', function (e) {
      // Only open popup if it's the direct CTA buttons, not section scroll
      const isHeroCta = this.classList.contains('btn-gold') && this.closest('.hero-ctas');
      const isHeaderCta = this.classList.contains('header-cta');
      if (isHeroCta || isHeaderCta) {
        e.preventDefault();
        openPopup();
      }
    });
  });

  // ── WhatsApp float pulse on hover ────────────────────────────
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    let pulseTimeout;
    waFloat.addEventListener('mouseenter', function () {
      clearTimeout(pulseTimeout);
      waFloat.style.animation = 'none';
    });
  }

  // ── Tilt micro-interaction for barbeiro cards ─────────────────
  const barbCards = document.querySelectorAll('.barbeiro-card');
  const TILT_MAX = 8;

  function applyTilt(card, e) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateY(${dx * TILT_MAX}deg) rotateX(${-dy * TILT_MAX}deg) translateZ(4px)`;
  }

  barbCards.forEach(card => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    card.style.transition = 'transform 0.15s ease, border-color 0.3s';
    card.addEventListener('mousemove', e => applyTilt(card, e));
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s';
    });
  });

  // ── Lazy-load images (placeholder bg tone shifts) ────────────
  const placeholders = document.querySelectorAll('.sobre-img-placeholder, .barbeiro-photo, .galeria-item');
  const tones = ['#111', '#121212', '#0f0f0f', '#141414', '#0d0d0d'];

  if ('IntersectionObserver' in window) {
    const lazyObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const tone = tones[Math.floor(Math.random() * tones.length)];
          el.style.backgroundColor = tone;
          lazyObs.unobserve(el);
        }
      });
    }, { rootMargin: '200px' });

    placeholders.forEach(el => lazyObs.observe(el));
  }

  // ── Copyright console ────────────────────────────────────────
  console.log(
    '%cFerro & Navalha%c — Premium Barber Shop\nDesign: Syntra Digital · Production Ready',
    'color:#c9a84c;font-size:18px;font-weight:bold;font-family:serif',
    'color:#9a8f7e;font-size:12px'
  );

})();
