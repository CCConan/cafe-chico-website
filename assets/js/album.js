/* ==========================================================================
   Café Chico — Featured Dishes 3D Ring (Album)
   Auto-rotates a ring of dish images. The frontmost image is the clearest;
   the others are progressively blurred. Drag to rotate. Text on the right
   updates with the current dish info.
   ========================================================================== */
(function () {
  'use strict';

  const ring   = document.getElementById('album-ring');
  if (!ring) return;
  const items  = Array.from(ring.querySelectorAll('.album__item'));
  const n      = items.length;
  if (n < 2) return;

  const kicker = document.getElementById('album-kicker');
  const title  = document.getElementById('album-title');
  const desc   = document.getElementById('album-desc');
  const price  = document.getElementById('album-price');
  const dotsEl = document.getElementById('album-dots');
  const dots   = dotsEl ? Array.from(dotsEl.querySelectorAll('.album__dot')) : [];

  const angleStep = 360 / n;
  const radius    = 266;       // 3D ring radius (px) — 380 × 0.7 (rotation diameter −30% per user)
  const maxBlur   = 7;         // px at the back
  const minBlur   = 0;         // px at the front
  // Per-slot speed: dwell 10× longer, peak 1/3 of previous (now 2× faster again per user)
  // phase ∈ [0, 1] = (curRot mod angleStep) / angleStep  (0 = at image front, 0.5 = mid)
  // speedMult = 0.03 + 8.37 * sin(phase * π)  →  range [0.03, 8.4]
  const rotSpeedBase   = 0.12;  // deg/frame at slowest (when at image front)
  const rotSpeedMaxMul = 8.4;   // peak multiplier (mid-transition, 2× faster than previous 4.2)
  const rotSpeedMinMul = 0.03;  // floor multiplier (2× faster than previous 0.015 → dwell 2× shorter)
  const dragSens  = -0.35;     // deg per px dragged (NEGATIVE: drag right -> rotate ring right)
  const resumeMs  = 2400;      // ms of stillness before auto-rotate resumes

  let curRot    = 0;          // current rotation of the ring
  let autoRot   = true;
  let dragging  = false;
  let dragStart = 0;
  let rotStart  = 0;
  let lastVel   = 0;
  let lastInputTime = 0;
  let activeIdx = 0;          // index currently at the front

  function applyTransforms() {
    items.forEach((item, i) => {
      // Each item is placed at its angle around the ring
      // then the whole ring is rotated by curRot
      const baseAngle = i * angleStep;
      const itemAngle = (baseAngle + curRot) % 360;
      // Wrap to -180..180
      let norm = itemAngle;
      if (norm > 180) norm -= 360;
      if (norm < -180) norm += 360;

      // Z (cos), X (sin) positions on the ring
      const z = Math.cos(norm * Math.PI / 180);   // 1 at front, -1 at back
      const x = Math.sin(norm * Math.PI / 180);   // 0 at front, ±1 at sides

      // Distance from front (0 at front, 1 at back)
      const distFromFront = (1 - z) / 2;

      // Blur: 0 at front, max at back; more blur on the sides too
      const blur = minBlur + distFromFront * maxBlur + Math.abs(x) * 1.5;
      const saturate = 1 - distFromFront * 0.35;
      const opacity  = 1 - distFromFront * 0.45;

      item.style.transform = `rotateY(${-norm}deg) translateZ(${radius * z}px) translateX(${x * 40}px)`;
      item.style.filter    = `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)})`;
      item.style.opacity    = opacity.toFixed(2);

      // Active = closest to front (within ±angleStep/2)
      const isActive = Math.abs(norm) < angleStep / 2;
      item.classList.toggle('is-active', isActive);
      if (isActive) activeIdx = i;
    });
  }

  function updateInfo(idx) {
    const it = items[idx];
    if (!it) return;
    const data = it.dataset;
    if (kicker && data.cat)  kicker.textContent = data.cat;
    if (title  && data.name) title.textContent  = data.name;
    if (desc   && data.desc) desc.textContent   = data.desc;
    if (price  && data.price) price.textContent = '£' + Number(data.price).toFixed(2);
    if (dots.length) {
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }
  }

  // Animation loop: auto-rotate unless user is dragging
  let lastT = performance.now();
  function tick(now) {
    const dt = (now - lastT) / 16.67; // normalized to 60fps frames
    lastT = now;
    if (!dragging) {
      const nowMs = performance.now();
      const idle = nowMs - lastInputTime;
      if (autoRot) {
        // Dynamic speed: slow at each image, 3× faster mid-transition
        const phase = ((curRot % angleStep) + angleStep) % angleStep / angleStep;
        const speedMult = rotSpeedMinMul + (rotSpeedMaxMul - rotSpeedMinMul) * Math.sin(phase * Math.PI);
        curRot = (curRot + rotSpeedBase * speedMult * dt) % 360;
      } else {
        // Inertia decay
        lastVel *= 0.94;
        if (Math.abs(lastVel) > 0.01) {
          curRot = (curRot + lastVel * dt) % 360;
        } else if (idle > resumeMs) {
          // Snap to nearest slot for the new active dish, then resume auto-rotate
          const target = -activeIdx * angleStep;
          let diff = target - curRot;
          // Normalize to shortest path
          while (diff > 180) diff -= 360;
          while (diff < -180) diff += 360;
          // Small smooth ease toward the target, then resume
          curRot = (curRot + diff * 0.06) % 360;
          if (Math.abs(diff) < 0.5) autoRot = true;
        }
      }
    }
    applyTransforms();
    updateInfo(activeIdx);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---- Pointer / drag interaction ----
  function onDown(x) {
    dragging = true;
    autoRot = false;
    dragStart = x;
    rotStart = curRot;
    lastVel = 0;
    lastInputTime = performance.now();
    ring.classList.add('is-dragging');
  }
  function onMove(x) {
    if (!dragging) return;
    const dx = x - dragStart;
    const next = (rotStart + dx * dragSens) % 360;
    lastVel = (next - curRot) * 0.4; // approximate velocity
    curRot = next;
    lastInputTime = performance.now();
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    ring.classList.remove('is-dragging');
    lastInputTime = performance.now();
    // After resumeMs of stillness, auto-rotate kicks back in (handled in tick)
  }
  ring.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(e.clientX); });
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);
  ring.addEventListener('touchstart', (e) => { onDown(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',  (e) => { if (dragging) onMove(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   onUp);

  // ---- Dots: click to jump to that dish ----
  if (dots.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        autoRot = false;
        // Calculate the rotation that makes item i appear at the front
        const target = -i * angleStep;
        let diff = target - curRot;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        lastVel = diff * 0.4;
        curRot = target;
        lastInputTime = performance.now();
      });
    });
  }

  // ---- Hover: does NOT pause — auto-rotation continues regardless of mouse position ----
  // (User feedback: '鼠標離開後會立即移動' = resume on leave, not pause on enter)
  ring.addEventListener('mouseleave', () => {
    if (!dragging) {
      autoRot = true;
      lastInputTime = 0;
    }
  });

  // ---- Initial paint ----
  applyTransforms();
  updateInfo(0);
})();
