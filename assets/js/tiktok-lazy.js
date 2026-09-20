/* =============================================================================
   Café Chico — TikTok click-to-load
   -----------------------------------------------------------------------------
   未撳之前只係一張封面圖（零第三方請求、冇 TikTok cookie banner）。
   撳一下先建立 player v1 iframe（autoplay=1 & loop=1）→ 播完會自己循環。
   用法：頁面加 <script src="assets/js/tiktok-lazy.js" defer></script>
   ============================================================================= */
(function () {
  function loadOne(box) {
    var src = box.getAttribute('data-tt-src');
    if (!src) return;
    var f = document.createElement('iframe');
    f.src = src;
    f.title = 'TikTok — @cafechico';
    f.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    box.innerHTML = '';
    box.appendChild(f);
  }

  function init() {
    document.querySelectorAll('.tt-loop[data-tt-src]').forEach(function (box) {
      var btn = box.querySelector('.tt-loop__play');
      if (!btn) return;
      btn.addEventListener('click', function () { loadOne(box); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
