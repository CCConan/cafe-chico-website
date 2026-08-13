/* ============================================================
   Ice Cream Bike — 3D mouse-tilt effect
   ============================================================ */

(function() {
  'use strict';

  const card = document.querySelector('[data-tilt]');
  if (!card) return;

  const img = card.querySelector('img');
  if (!img) return;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Normalize to -1..1
    targetX = (x / rect.width - 0.5) * 2;
    targetY = (y / rect.height - 0.5) * 2;
    if (!rafId) loop();
  }

  function onLeave() {
    targetX = 0;
    targetY = 0;
  }

  function loop() {
    rafId = null;
    // Smooth interpolation
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    // Apply transform (max ~10deg)
    const rotY = currentX * 10;
    const rotX = -currentY * 8;
    img.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    // Continue if not settled
    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      rafId = requestAnimationFrame(loop);
    } else {
      img.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  }

  card.addEventListener('mousemove', onMove, { passive: true });
  card.addEventListener('mouseleave', onLeave, { passive: true });

  // Scroll-triggered reveal (using IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.bike-spec, .bike-how__list li, .bike-flavours__list li, .bike-feat').forEach(el => {
      observer.observe(el);
    });
  }

  // ── Parallax scroll for .bike-feat--parallax ──
  const parallaxItems = document.querySelectorAll('.bike-feat--parallax .bike-feat__parallax-wrap');
  if (parallaxItems.length) {
    function updateParallax() {
      parallaxItems.forEach(wrap => {
        const rect = wrap.closest('.bike-feat__frame').getBoundingClientRect();
        const viewH = window.innerHeight;
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const offset = (progress - 0.5) * 60; // max ±30px
        wrap.style.transform = `translateY(${offset}px)`;
      });
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }
})();
