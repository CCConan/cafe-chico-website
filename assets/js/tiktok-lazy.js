/* =============================================================================
   Café Chico — TikTok embed lazy loader
   -----------------------------------------------------------------------------
   TikTok 嘅 embed.js 好重（會拖慢首屏）。呢個 script 只會喺影片區
   差不多滾到入畫面（400px 內）先至動態載入 embed.js，其餘時間完全唔會
   發出請求。

   用法：喺任何頁面加一句
       <script src="assets/js/tiktok-lazy.js" defer></script>
   然後 TikTok 官方 blockquote 照放：

       <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@cafechico/video/<ID>"
                   data-video-id="<ID>" data-theme="dark"
                   style="max-width:325px;min-width:325px;">
         <section><a target="_blank" rel="noopener"
            href="https://www.tiktok.com/@cafechico/video/<ID>">@cafechico on TikTok</a></section>
       </blockquote>
   ============================================================================= */
(function () {
  var EMBED_SRC = 'https://www.tiktok.com/embed.js';
  var loaded = false;

  function loadEmbed() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.src = EMBED_SRC;
    s.async = true;
    document.body.appendChild(s);
  }

  function init() {
    var blocks = document.querySelectorAll('.tiktok-embed');
    if (!blocks.length) return;

    // 冇 IntersectionObserver（極舊瀏覽器）→ 直接載入
    if (!('IntersectionObserver' in window)) {
      loadEmbed();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadEmbed();
          io.disconnect();
        }
      });
    }, { rootMargin: '400px 0px' });   // 仲差 400px 就開始載入，掃到時已經 ready

    blocks.forEach(function (b) { io.observe(b); });

    // 保險：如果用戶永遠唔滾到，但佢開咗 10 秒，都載入
    setTimeout(function () {
      if (!loaded && document.querySelector('.tiktok-embed')) loadEmbed();
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
