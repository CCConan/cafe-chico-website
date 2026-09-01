/* ==========================================================================
   Café Chico — shared JS
   Sticky nav + scroll-spy + smooth scroll + reveal animations + mobile menu
   ========================================================================== */

(function () {
  'use strict';

  /* ----- Sticky nav scroll state ----- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- Mobile nav toggle ----- */
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
    // Close on link click
    nav.querySelectorAll('.nav-tabs a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  /* ----- Smooth scroll for in-page anchors ----- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    link.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });
      // Update URL hash without jumping
      history.pushState(null, '', href);
    });
  });

  /* ----- Scroll-spy: highlight tab matching current section ----- */
  // Match any tab whose href contains a #, including cross-page links like index.html#story
  const tabs = document.querySelectorAll('.nav-tabs a[href*="#"]');
  if (tabs.length && 'IntersectionObserver' in window) {
    const sections = Array.from(tabs).map(t => {
      const href = t.getAttribute('href') || '';
      const m = href.match(/#([^?#]+)/);
      if (!m) return null;
      return { tab: t, hash: m[1], target: document.querySelector('#' + m[1]) };
    }).filter(x => x && x.target);

    const setActive = (id) => {
      sections.forEach(s => {
        s.tab.classList.toggle('active', s.hash === id);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      // Pick the entry with the largest intersection ratio
      let best = null;
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!best || e.intersectionRatio > best.intersectionRatio) {
            best = e;
          }
        }
      });
      if (best) {
        const id = best.target.id;
        // If the section that just entered the viewport doesn't have a
        // nav tab (e.g. #neighbours — there is no Neighbours tab), keep
        // the current active tab instead of clearing every tab. Without
        // this guard the user sees Social → (gap) → Contact as they
        // scroll through the Story / Neighbours / Reviews block.
        const isMapped = sections.some(s => s.hash === id);
        if (id && isMapped) setActive(id);
      }
    }, {
      threshold: [0.15, 0.4, 0.65],
      rootMargin: '-80px 0px -40% 0px',
    });

    sections.forEach(s => observer.observe(s.target));
  }

  /* ----- Reveal-on-scroll ----- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    revealEls.forEach(el => ro.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ----- Today row highlight in hours tables ----- */
  document.querySelectorAll('.hours-table').forEach(table => {
    const today = new Date().getDay(); // 0 = Sun
    const map = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(r => {
      if (r.dataset.day && r.dataset.day === map[today]) {
        r.classList.add('today');
      }
    });
  });
})();