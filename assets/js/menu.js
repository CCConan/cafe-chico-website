/* ==========================================================================
   Café Chico — menu page JS
   Category nav (scroll-to + active highlight)
   The 5-dish 3D ring carousel lives in assets/js/album.js and is shared
   between menu.html and (formerly) platters.html.
   ========================================================================== */

(function () {
  'use strict';

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