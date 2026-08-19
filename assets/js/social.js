// =====================================================================
//  Café Chico — Social Media section + PhotoSwipe lightbox
//  - Each thumbnail is an <a> linking to the IG post (so updates sync)
//  - Click opens PhotoSwipe v5 lightbox with smooth transitions
//  - Lightbox has its own "View on Instagram" button
//  - Lazy-loads images as they enter viewport (IntersectionObserver)
//  - Also binds the index.html 6-card "popular dishes" grid to a lightbox
//    so clicking a popular card opens the full image (was: nav to menu.html)
// =====================================================================

import PhotoSwipe from '../vendor/photoswipe/photoswipe.esm.js';

const IG_PROFILE = 'https://www.instagram.com/cafechico_uk/';
const GRID_SEL = '.social-media__grid';
const THUMB_SEL = '.sm-thumb';
const POPULAR_SEL = '.popular__card';

// -----------------------------------------------------------------
// 1) Build the dataSource array for PhotoSwipe from the DOM
// -----------------------------------------------------------------
function collectSlides() {
  const thumbs = document.querySelectorAll(THUMB_SEL);
  const slides = [];
  thumbs.forEach((el) => {
    // The <a> tag carries the IG post URL; the <img> has the alt text
    const fullSrc = el.getAttribute('data-pswp-src') || el.querySelector('img')?.src;
    const w = parseInt(el.getAttribute('data-pswp-width') || '0', 10);
    const h = parseInt(el.getAttribute('data-pswp-height') || '0', 10);
    const alt = el.querySelector('img')?.alt || '';
    const igUrl = el.getAttribute('href') || IG_PROFILE;

    if (!fullSrc) return;

    slides.push({
      src: fullSrc,
      width: w || 1080,
      height: h || 1080,
      alt: alt,
      // Custom field used by our "View on IG" custom button
      igUrl: igUrl,
    });
  });
  return slides;
}

// -----------------------------------------------------------------
// 2) Find the index of a clicked thumbnail within the slides array
// -----------------------------------------------------------------
function indexOfClickedThumb(clickedEl) {
  const thumbs = Array.from(document.querySelectorAll(THUMB_SEL));
  return thumbs.indexOf(clickedEl);
}

// -----------------------------------------------------------------
// 3) Initialise PhotoSwipe on a thumb click
// -----------------------------------------------------------------
function openLightboxAt(idx) {
  const slides = collectSlides();
  if (slides.length === 0) return;

  const options = {
    dataSource: slides,
    index: Math.max(0, Math.min(idx, slides.length - 1)),
    bgOpacity: 0.95,
    showHideAnimationType: 'zoom',
    spacing: 0.1,
    loop: true,
    // Allow pinch-to-zoom on mobile
    pinchToClose: false,
  };

  const lightbox = new PhotoSwipe(options);

  // Attach the "View on Instagram" overlay (fixed-position outside PhotoSwipe)
  // as soon as the lightbox starts opening so it can fade in with the transition.
  lightbox.on('beforeOpen', () => attachViewOnIgButton(lightbox));

  lightbox.init();
}

// -----------------------------------------------------------------
// 4) Custom "View on Instagram" button — fixed overlay outside PhotoSwipe
//    (PhotoSwipe's addCustomControl wraps elements in a toolbar div, so
//     absolute positioning inside doesn't reach the page. We instead
//     attach a fixed-position element to <body> and toggle it via the
//     lightbox open/close events, updating the href on slide change.)
// -----------------------------------------------------------------
function attachViewOnIgButton(lightbox) {
  // Build a fresh button for this lightbox instance
  const btn = document.createElement('a');
  btn.className = 'pswp-ig-link pswp-ig-link--enter';
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.setAttribute('aria-label', 'View this post on Instagram');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
    <span>View on Instagram</span>
  `;
  document.body.appendChild(btn);

  // Trigger CSS enter animation on next frame so the element renders first
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      btn.classList.remove('pswp-ig-link--enter');
    });
  });

  // Update the link target as the user moves between slides
  const updateHref = () => {
    const data = lightbox.currSlide?.data;
    btn.href = data?.igUrl || IG_PROFILE;
  };
  updateHref();

  lightbox.on('change', updateHref);
  lightbox.on('close', () => {
    btn.classList.add('pswp-ig-link--leave');
  });
  lightbox.on('destroy', () => {
    btn.remove();
  });
}

// -----------------------------------------------------------------
// 5) Lazy-load thumbnails via IntersectionObserver
// -----------------------------------------------------------------
function setupLazyLoad() {
  if (!('IntersectionObserver' in window)) return;

  const thumbs = document.querySelectorAll(THUMB_SEL);
  if (thumbs.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const img = el.querySelector('img');
        if (!img) return;

        el.classList.add('is-loading');

        // If the img is already loaded (browser cached), fire load immediately
        if (img.complete && img.naturalWidth > 0) {
          el.classList.remove('is-loading');
          el.classList.add('is-loaded');
        } else {
          img.addEventListener(
            'load',
            () => {
              el.classList.remove('is-loading');
              el.classList.add('is-loaded');
            },
            { once: true }
          );
          img.addEventListener(
            'error',
            () => {
              el.classList.remove('is-loading');
              el.classList.add('is-loaded');
            },
            { once: true }
          );
        }

        observer.unobserve(el);
      });
    },
    { rootMargin: '200px 0px', threshold: 0.01 }
  );

  thumbs.forEach((el) => observer.observe(el));
}

// -----------------------------------------------------------------
// 6) Wire up click handlers
// -----------------------------------------------------------------
function setupClickHandlers() {
  const grid = document.querySelector(GRID_SEL);
  if (grid) {
    // Delegate clicks: open the lightbox at the clicked index
    grid.addEventListener('click', (e) => {
      const link = e.target.closest(THUMB_SEL);
      if (!link) {
        return;
      }
      e.preventDefault();  // prevent the IG link from opening in a new tab
      const idx = indexOfClickedThumb(link);
      openLightboxAt(idx);
    });
  }

  // Popular dishes grid (6 cards on index.html) → open lightbox with the
  // large image, plus a "View on the menu →" button that links to the
  // relevant menu.html#cat-* anchor.
  const popularGrid = document.querySelector('.popular__grid');
  if (popularGrid) {
    popularGrid.addEventListener('click', (e) => {
      const card = e.target.closest(POPULAR_SEL);
      if (!card) return;
      e.preventDefault();
      const cards = Array.from(popularGrid.querySelectorAll(POPULAR_SEL));
      const idx = cards.indexOf(card);
      openPopularLightbox(cards, idx);
    });
  }
}

// -----------------------------------------------------------------
// 6b) Popular grid lightbox — same PhotoSwipe, different slide shape
//     (dish metadata for the custom "View on menu" button)
// -----------------------------------------------------------------
function openPopularLightbox(cards, idx) {
  if (!cards.length) return;

  const slides = cards.map((el) => ({
    src: el.getAttribute('data-pswp-src') || el.querySelector('img')?.src,
    width: parseInt(el.getAttribute('data-pswp-width') || '1600', 10),
    height: parseInt(el.getAttribute('data-pswp-height') || '1600', 10),
    alt: el.querySelector('img')?.alt || '',
    dishName: el.getAttribute('data-dish-name') || '',
    dishPrice: el.getAttribute('data-dish-price') || '',
    dishHref: el.getAttribute('data-dish-href') || 'menu.html',
  }));

  const lightbox = new PhotoSwipe({
    dataSource: slides,
    index: Math.max(0, Math.min(idx, slides.length - 1)),
    bgOpacity: 0.95,
    showHideAnimationType: 'zoom',
    spacing: 0.1,
    loop: true,
    pinchToClose: false,
  });

  lightbox.on('beforeOpen', () => attachPopularButton(lightbox));
  lightbox.init();
}

function attachPopularButton(lightbox) {
  const btn = document.createElement('a');
  btn.className = 'pswp-ig-link pswp-ig-link--enter pswp-popular-link';
  btn.setAttribute('aria-label', 'View this dish on the menu');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 6 h16 M4 12 h16 M4 18 h10"/>
    </svg>
    <span class="pswp-popular-link__label">View on the menu →</span>
  `;
  document.body.appendChild(btn);

  const update = () => {
    const data = lightbox.currSlide?.data;
    if (!data) return;
    btn.href = data.dishHref;
    const label = btn.querySelector('.pswp-popular-link__label');
    if (label) {
      label.textContent = data.dishName
        ? `${data.dishName} · ${data.dishPrice} · View on the menu →`
        : 'View on the menu →';
    }
  };
  update();

  lightbox.on('change', update);
  lightbox.on('close', () => btn.classList.add('pswp-ig-link--leave'));
  lightbox.on('destroy', () => btn.remove());

  requestAnimationFrame(() => requestAnimationFrame(() => {
    btn.classList.remove('pswp-ig-link--enter');
  }));
}

// -----------------------------------------------------------------
// 7) Update the follower count from the IG profile (best-effort)
// -----------------------------------------------------------------
async function tryUpdateFollowerCount() {
  // IG no longer exposes follower counts without auth + Graph API.
  // We hard-code the last seen count (2,014 at last IG check) and
  // label it honestly so we don't claim live data.
  const el = document.querySelector('[data-ig-followers]');
  if (!el) return;
  // Format the number with comma separator; preserve any suffix like " · Bolton"
  const n = parseInt(el.getAttribute('data-ig-followers'), 10);
  if (isNaN(n)) return;
  const suffix = el.dataset.suffix || '';
  el.textContent = n.toLocaleString('en-GB') + ' followers' + suffix;
}

// -----------------------------------------------------------------
// 8) Init
// -----------------------------------------------------------------
function init() {
  setupClickHandlers();
  setupLazyLoad();
  tryUpdateFollowerCount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
