/* ==========================================================================
   Café Chico — menu page JS
   Category nav + 3D drag-to-rotate viewer + featured dish rotation
   ========================================================================== */

(function () {
  'use strict';

  /* ----- Featured 3D viewer (drag-to-rotate + autoplay rotation) ----- */
  const dish = document.querySelector('.viewer__dish');
  const stage = document.querySelector('.viewer__plate');
  if (dish && stage) {
    const state = {
      rotX: -8,
      rotY: 12,
      dragging: false,
      lastX: 0,
      lastY: 0,
      velX: 0,
      velY: 0,
      autoRotate: true,
    };

    const apply = () => {
      dish.style.transform = `rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`;
    };
    apply();

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const onDown = (e) => {
      state.dragging = true;
      state.autoRotate = false;
      const point = e.touches ? e.touches[0] : e;
      state.lastX = point.clientX;
      state.lastY = point.clientY;
    };
    const onMove = (e) => {
      if (!state.dragging) return;
      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - state.lastX;
      const dy = point.clientY - state.lastY;
      state.lastX = point.clientX;
      state.lastY = point.clientY;
      state.velY = dx * 0.4;
      state.velX = dy * 0.4;
      state.rotY += dx * 0.4;
      state.rotX = clamp(state.rotX + dy * 0.4, -35, 35);
      apply();
    };
    const onUp = () => {
      state.dragging = false;
    };

    dish.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    dish.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    // Inertia loop
    const tick = () => {
      if (!state.dragging) {
        if (state.autoRotate) {
          state.rotY += 0.18;
        } else {
          state.velX *= 0.94;
          state.velY *= 0.94;
          state.rotY += state.velY;
          state.rotX = clamp(state.rotX + state.velX, -35, 35);
          if (Math.abs(state.velX) < 0.01 && Math.abs(state.velY) < 0.01) {
            // Resume gentle auto-rotation after 2.5s of stillness
            if (!state._resumeTimer) {
              state._resumeTimer = setTimeout(() => {
                state.autoRotate = true;
                state._resumeTimer = null;
              }, 2500);
            }
          }
        }
        apply();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Click to pause/resume auto-rotate
    dish.addEventListener('click', () => {
      state.autoRotate = !state.autoRotate;
    });
  }

  /* ----- Featured dish rotation (prev/next) ----- */
  const prev = document.querySelector('.viewer__btn[data-dir="prev"]');
  const next = document.querySelector('.viewer__btn[data-dir="next"]');
  if (prev && next) {
    const items = window.__menuData__;
    if (!items || !items.length) return;

    const imgEl    = document.querySelector('.viewer__dish img');
    const titleEl  = document.querySelector('.viewer__info h2');
    const catEl    = document.querySelector('.viewer__info .cat');
    const descEl   = document.querySelector('.viewer__info .desc');
    const priceEl  = document.querySelector('.viewer__info .price');

    // Pick dishes with images only for featured rotation
    const featured = items.filter(it => it.image);
    if (!featured.length) return;

    let idx = 0;
    const updateBtns = () => {
      prev.toggleAttribute('disabled', idx <= 0);
      next.toggleAttribute('disabled', idx >= featured.length - 1);
    };

    const paint = () => {
      const it = featured[idx];
      if (!it) return;
      if (imgEl) {
        imgEl.src = it.image;
        imgEl.alt = it.name;
      }
      if (titleEl) titleEl.textContent = it.name;
      if (catEl) catEl.textContent = it.cat_name;
      if (descEl) descEl.textContent = it.desc || '';
      if (priceEl) {
        if (it.price) {
          priceEl.textContent = '£' + Number(it.price).toFixed(2);
          priceEl.classList.remove('dish__price--placeholder');
        } else {
          priceEl.textContent = 'Price unavailable';
          priceEl.classList.add('dish__price--placeholder');
        }
      }
      updateBtns();
    };

    prev.addEventListener('click', () => {
      if (idx > 0) { idx--; paint(); }
    });
    next.addEventListener('click', () => {
      if (idx < featured.length - 1) { idx++; paint(); }
    });

    paint();
  }

  /* ----- Category nav: scroll to + highlight ----- */
  const catBtns = document.querySelectorAll('.cat-nav__btn');
  if (catBtns.length) {
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sel = btn.dataset.target;
        const target = sel && document.querySelector(sel);
        if (target) {
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

    // Highlight on scroll
    if ('IntersectionObserver' in window) {
      const sections = document.querySelectorAll('.menu-section');
      const ob = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = '#' + e.target.id;
            catBtns.forEach(b => {
              b.classList.toggle('active', b.dataset.target === id);
            });
          }
        });
      }, { rootMargin: '-130px 0px -50% 0px', threshold: 0 });
      sections.forEach(s => ob.observe(s));
    }
  }
})();