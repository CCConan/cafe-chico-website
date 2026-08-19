/* ==========================================================================
   Café Chico — 3D Brand Mark
   Drag-to-rotate the CHICO logo. Same concept as the menu page viewer,
   but tuned for a logo (logos stay readable at 90° rotation because of
   their horizontal layout).
   ========================================================================== */
(function () {
  'use strict';

  const stage = document.getElementById('brand-3d-stage');
  const plate = document.getElementById('brand-3d-plate');
  if (!stage || !plate) return;

  const state = {
    rotX: -6,
    rotY: 14,
    dragging: false,
    lastX: 0,
    lastY: 0,
    velX: 0,
    velY: 0,
    autoRotate: true,
  };

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const apply = () => {
    plate.style.transform = `rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`;
  };

  const onDown = (e) => {
    state.dragging = true;
    state.autoRotate = false;
    const p = e.touches ? e.touches[0] : e;
    state.lastX = p.clientX;
    state.lastY = p.clientY;
  };
  const onMove = (e) => {
    if (!state.dragging) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - state.lastX;
    const dy = p.clientY - state.lastY;
    state.lastX = p.clientX;
    state.lastY = p.clientY;
    state.velY = dx * 0.4;
    state.velX = dy * 0.4;
    state.rotY += dx * 0.4;
    state.rotX = clamp(state.rotX + dy * 0.4, -35, 35);
    apply();
  };
  const onUp = () => { state.dragging = false; };

  stage.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  stage.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);

  let resumeTimer = null;
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
          if (!resumeTimer) {
            resumeTimer = setTimeout(() => {
              state.autoRotate = true;
              resumeTimer = null;
            }, 2500);
          }
        }
      }
      apply();
    }
    requestAnimationFrame(tick);
  };
  apply();
  requestAnimationFrame(tick);
})();
