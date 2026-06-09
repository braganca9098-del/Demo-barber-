/**
 * FERRO & NAVALHA — BACKGROUND SYSTEM
 * Multicamada canvas: símbolos de barbearia em micro-opacidade
 * com deriva parallax suave. Jamais compete com o conteúdo.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ── Barber symbols ──────────────────────────────────────────
  const SYMBOLS = [
    // scissors path
    function (ctx, size) {
      ctx.save();
      ctx.scale(size / 40, size / 40);
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(8, 28);
      ctx.moveTo(20, 0);
      ctx.lineTo(32, 28);
      ctx.moveTo(5, 22);
      ctx.arc(10, 22, 5, 0, Math.PI * 2);
      ctx.moveTo(35, 22);
      ctx.arc(30, 22, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
    // razor blade
    function (ctx, size) {
      ctx.save();
      ctx.scale(size / 40, size / 40);
      ctx.beginPath();
      ctx.rect(5, 12, 30, 16);
      ctx.moveTo(10, 12);
      ctx.lineTo(5, 5);
      ctx.lineTo(35, 5);
      ctx.lineTo(30, 12);
      ctx.stroke();
      ctx.restore();
    },
    // comb
    function (ctx, size) {
      ctx.save();
      ctx.scale(size / 40, size / 40);
      ctx.beginPath();
      ctx.rect(4, 14, 32, 10);
      for (let i = 0; i < 8; i++) {
        const x = 7 + i * 4;
        ctx.moveTo(x, 14);
        ctx.lineTo(x, 6);
      }
      ctx.stroke();
      ctx.restore();
    },
    // moustache
    function (ctx, size) {
      ctx.save();
      ctx.scale(size / 40, size / 40);
      ctx.beginPath();
      ctx.moveTo(4, 20);
      ctx.bezierCurveTo(4, 10, 16, 10, 20, 18);
      ctx.bezierCurveTo(24, 10, 36, 10, 36, 20);
      ctx.bezierCurveTo(36, 28, 26, 28, 24, 22);
      ctx.bezierCurveTo(22, 20, 18, 20, 16, 22);
      ctx.bezierCurveTo(14, 28, 4, 28, 4, 20);
      ctx.stroke();
      ctx.restore();
    },
    // barber pole cross
    function (ctx, size) {
      ctx.save();
      ctx.scale(size / 40, size / 40);
      ctx.beginPath();
      ctx.moveTo(20, 2);
      ctx.lineTo(20, 38);
      ctx.moveTo(2, 20);
      ctx.lineTo(38, 20);
      // diagonal accents
      ctx.moveTo(7, 7);
      ctx.lineTo(33, 33);
      ctx.moveTo(33, 7);
      ctx.lineTo(7, 33);
      ctx.stroke();
      ctx.restore();
    },
    // crown
    function (ctx, size) {
      ctx.save();
      ctx.scale(size / 40, size / 40);
      ctx.beginPath();
      ctx.moveTo(4, 28);
      ctx.lineTo(8, 12);
      ctx.lineTo(14, 20);
      ctx.lineTo(20, 8);
      ctx.lineTo(26, 20);
      ctx.lineTo(32, 12);
      ctx.lineTo(36, 28);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    },
    // skull simple
    function (ctx, size) {
      ctx.save();
      ctx.scale(size / 40, size / 40);
      ctx.beginPath();
      ctx.arc(20, 18, 12, 0, Math.PI * 2);
      ctx.moveTo(14, 30);
      ctx.lineTo(14, 36);
      ctx.lineTo(26, 36);
      ctx.lineTo(26, 30);
      ctx.moveTo(16, 17);
      ctx.arc(16, 17, 3, 0, Math.PI * 2);
      ctx.moveTo(27, 17);
      ctx.arc(24, 17, 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
    // diamond
    function (ctx, size) {
      ctx.save();
      ctx.scale(size / 40, size / 40);
      ctx.beginPath();
      ctx.moveTo(20, 2);
      ctx.lineTo(38, 20);
      ctx.lineTo(20, 38);
      ctx.lineTo(2, 20);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    },
  ];

  // ── Particle system ─────────────────────────────────────────
  const LAYERS = [
    { count: 18, minSize: 24, maxSize: 56, opacity: 0.025, speed: 0.15 },
    { count: 22, minSize: 40, maxSize: 80, opacity: 0.055, speed: 0.22 },
    { count: 14, minSize: 70, maxSize: 130, opacity: 0.11, speed: 0.32 },
  ];

  let particles = [];
  let W = 0, H = 0;
  let scrollY = 0;
  let time = 0;
  let animId;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b)); }

  function createParticle(layer, index) {
    return {
      x: rand(0, W || window.innerWidth),
      y: rand(0, H || window.innerHeight),
      size: rand(layer.minSize, layer.maxSize),
      opacity: rand(layer.opacity * 0.6, layer.opacity),
      symbolIdx: randInt(0, SYMBOLS.length),
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.0003, 0.0003),
      driftX: rand(-layer.speed, layer.speed),
      driftY: rand(-layer.speed * 0.5, layer.speed * 0.5),
      layer: index,
      parallaxFactor: 0.02 + index * 0.015,
    };
  }

  function initParticles() {
    particles = [];
    LAYERS.forEach((layer, i) => {
      for (let n = 0; n < layer.count; n++) {
        particles.push(createParticle(layer, i));
      }
    });
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    initParticles();
  }

  function drawSymbol(p) {
    ctx.save();
    ctx.translate(p.x, p.y - scrollY * p.parallaxFactor);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 1;
    SYMBOLS[p.symbolIdx](ctx, p.size);
    ctx.restore();
  }

  function update(dt) {
    time += dt;
    particles.forEach(p => {
      p.x += p.driftX;
      p.y += p.driftY;
      p.rotation += p.rotSpeed;

      // wrap around canvas bounds with padding
      const pad = p.size * 1.5;
      if (p.x < -pad) p.x = W + pad;
      if (p.x > W + pad) p.x = -pad;
      if (p.y < -pad) p.y = H + pad;
      if (p.y > H + pad) p.y = -pad;
    });
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    // sort by layer so deeper layers render first
    particles.forEach(p => drawSymbol(p));
  }

  let lastTime = 0;
  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    update(dt);
    render();
    animId = requestAnimationFrame(tick);
  }

  // ── Scroll parallax ─────────────────────────────────────────
  let scrollTarget = 0;
  let scrollCurrent = 0;
  window.addEventListener('scroll', function () {
    scrollTarget = window.scrollY;
  }, { passive: true });

  function smoothScroll() {
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.06;
    scrollY = scrollCurrent;
    requestAnimationFrame(smoothScroll);
  }

  // ── Pause when tab is hidden ─────────────────────────────────
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      lastTime = performance.now();
      animId = requestAnimationFrame(tick);
    }
  });

  // ── Init ─────────────────────────────────────────────────────
  window.addEventListener('resize', resize, { passive: true });
  resize();
  smoothScroll();
  lastTime = performance.now();
  animId = requestAnimationFrame(tick);

})();
