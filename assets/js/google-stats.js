/* =============================================================================
   Café Chico — Google 評分／評論數自動同步（前端）
   -----------------------------------------------------------------------------
   喺任何頁面加：  <script src="assets/js/google-stats.js" defer></script>
   然後喺顯示數字嘅元素加 data-g 屬性：

     data-g="rating"        → 文字 + ★      例：4.9★
     data-g="rating-text"   → 純數字        例：4.9
     data-g="rating-plain"  → 「4.9 / 5」
     data-g="count"         → 評論數（千分位）例：312

   數字由 /api/google-stats（Cloudflare Pages Function）提供，佢會向 Google
   Places API 拎最新值並快取 6 小時；API 未設定時會保留 HTML 上嘅靜態數字，
   所以頁面永遠唔會壞。
   ============================================================================= */
(function () {
  if (!window.fetch) return;

  function fmtCount(n) {
    var num = Number(n);
    if (!isFinite(num)) return null;
    return num.toLocaleString('en-GB');
  }

  function apply(data) {
    if (!data || !data.ok) return false;
    var rating = data.rating ? String(data.rating) : null;
    var count = data.count ? fmtCount(data.count) : null;
    var changed = false;

    if (rating) {
      document.querySelectorAll('[data-g="rating"]').forEach(function (el) {
        el.innerHTML = rating + '<em>★</em>'; changed = true;
      });
      document.querySelectorAll('[data-g="rating-text"]').forEach(function (el) {
        el.textContent = rating; changed = true;
      });
      document.querySelectorAll('[data-g="rating-plain"]').forEach(function (el) {
        el.textContent = rating + ' / 5'; changed = true;
      });
    }
    if (count) {
      document.querySelectorAll('[data-g="count"]').forEach(function (el) {
        el.textContent = count; changed = true;
      });
    }
    return changed;
  }

  function load() {
    fetch('/api/google-stats', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!apply(d)) return;                       // 未設定 API key → 保留靜態數字
        // 頁面開住期間每 30 分鐘再對一次（例如收銀台開住個 menu 頁）
        setInterval(function () {
          fetch('/api/google-stats', { cache: 'no-store' })
            .then(function (r) { return r.json(); })
            .then(apply)
            .catch(function () {});
        }, 1800000);
      })
      .catch(function () { /* 靜靜咁失敗，保留靜態數字 */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
