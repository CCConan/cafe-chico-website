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

  /* ----- 導覽列／分類列實際高度 → CSS 變數（26 Sep 2026）-----
     Menu 頁嘅 sticky 分類列（.cat-nav）原本寫死 top: 73px，但導覽列實際
     係 87px，窄螢幕換行時仲會超過 100px；結果分類列頂部被導覽列壓住。
     呢度即時量度真實高度寫入 --nav-h / --cat-nav-h，CSS 用 var() 跟住走，
     任何螢幕闊度都唔會再重疊。 */
  const catNav = document.querySelector('.cat-nav');
  const setNavHeights = () => {
    const root = document.documentElement.style;
    if (nav) root.setProperty('--nav-h', Math.round(nav.getBoundingClientRect().height) + 'px');
    if (catNav) root.setProperty('--cat-nav-h', Math.round(catNav.getBoundingClientRect().height) + 'px');
  };
  setNavHeights();
  window.addEventListener('resize', setNavHeights, { passive: true });
  window.addEventListener('orientationchange', setNavHeights, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setNavHeights);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(setNavHeights);
    if (nav) ro.observe(nav);
    if (catNav) ro.observe(catNav);
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

  /* ----- 導覽列下拉選單（Event，26 Sep 2026）-----
     桌面：滑鼠移上去由 CSS :hover 處理（唔需要 JS）。
     呢度負責：撳／鍵盤 Enter·Space 開關、Esc 關閉、撳出面或撳走焦點關閉，
     以及同步 aria-expanded。手機版同樣用呢個 toggle 做手風琴。 */
  const navMenuItems = document.querySelectorAll('.nav-item--has-menu');
  const closeAllNavMenus = (except) => {
    navMenuItems.forEach(item => {
      if (item === except) return;
      item.classList.remove('is-open');
      const btn = item.querySelector('.nav-item__toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };
  navMenuItems.forEach(item => {
    const btn = item.querySelector('.nav-item__toggle');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !item.classList.contains('is-open');
      closeAllNavMenus(item);
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });
    // 撳選單入面嘅連結之後收起
    item.querySelectorAll('.nav-submenu a').forEach(a => {
      a.addEventListener('click', () => closeAllNavMenus());
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item--has-menu')) closeAllNavMenus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllNavMenus();
  });

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

  /* ----- Scroll-spy（重寫 28 Sep 2026）＋ 滑動底線 -----
     舊版用 IntersectionObserver 按「佔比最大」決定邊個 tab 亮起，遇到好高嘅
     區塊（例如 #story）會跳過，出現「Home 直接跳去 Contact」。
     新版改成按「最後一個已經過咗頂線嘅區塊」判斷，簡單而且唔會漏。 */
  const navTabsEl = document.querySelector('.nav-tabs');
  const spySections = Array.from(document.querySelectorAll('.nav-tabs a[href*="#"]'))
    .map(t => {
      const m = (t.getAttribute('href') || '').match(/#([^?#]+)/);
      const target = m ? document.getElementById(m[1]) : null;
      return target ? { tab: t, hash: m[1], target } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.target.offsetTop - b.target.offsetTop);   // 依文件位置排序（唔可以跟 nav 次序）

  /* 滑動底線：把共用底線移到目前 active tab 嘅位置（CSS 有 transition 做動畫） */
  const moveIndicator = () => {
    if (!navTabsEl) return;
    const active = navTabsEl.querySelector('a.active, .nav-item__toggle.active');
    if (!active) { navTabsEl.classList.remove('has-indicator'); return; }
    const ul = navTabsEl.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    navTabsEl.style.setProperty('--nav-ind-x', (a.left - ul.left) + 'px');
    navTabsEl.style.setProperty('--nav-ind-w', a.width + 'px');
    navTabsEl.classList.add('has-indicator');
  };
  moveIndicator();
  window.addEventListener('resize', moveIndicator, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);

  if (spySections.length) {
    let currentHash = null;
    const updateSpy = () => {
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 87;
      const line = window.scrollY + navH + 32;      // 頂欄底部再加少少緩衝
      let best = spySections[0];
      for (const s of spySections) {
        if (s.target.offsetTop <= line) best = s;   // 最後一個已滾過頂線嘅區塊
      }
      // 捲到最底時，強制亮起最後一個（#contact）
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        best = spySections[spySections.length - 1];
      }
      if (best && best.hash !== currentHash) {
        currentHash = best.hash;
        spySections.forEach(s => s.tab.classList.toggle('active', s === best));
        moveIndicator();
      }
    };
    window.addEventListener('scroll', updateSpy, { passive: true });
    window.addEventListener('resize', updateSpy, { passive: true });
    updateSpy();
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