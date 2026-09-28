/* =============================================================================
   Café Chico — /api/google-stats
   -----------------------------------------------------------------------------
   讀 Google 最新「評分」同「評論數」，畀 Social & Reviews 頁自動更新數字。

   需要兩個 Cloudflare Pages 環境變數（Settings → Environment variables）：
     GOOGLE_PLACES_API_KEY  — Google Cloud「Places API (New)」API key
     GOOGLE_PLACE_ID        — Café Chico 喺 Google Maps 嘅 Place ID

   冇設定嘅話會回 { ok:false, error:"not-configured" }，網站會沿用 HTML 上嘅
   靜態數字（即係唔會壞）。

   快取：向上游 Google 要求 6 小時快取（cf.cacheTtl），所以一個月大約只會
   真正打 Google 約 120 次（免費額度綽綽有餘）。
   ============================================================================= */

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=3600',
      ...extra,
    },
  });
}

export async function onRequestGet({ env }) {
  const key = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    return json({ ok: false, error: 'not-configured' });
  }

  const url = 'https://places.googleapis.com/v1/places/' + encodeURIComponent(placeId);
  let r;
  try {
    r = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,displayName',
      },
      // Cloudflare 快取上游回應 6 小時
      cf: { cacheTtl: 21600, cacheEverything: true },
    });
  } catch (e) {
    return json({ ok: false, error: 'fetch-failed', detail: String((e && e.message) || e) });
  }

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return json({ ok: false, error: 'google-' + r.status, detail: String(text).slice(0, 200) });
  }

  const d = await r.json().catch(() => null);
  if (!d || typeof d.rating !== 'number') {
    return json({ ok: false, error: 'unexpected-payload' });
  }

  return json({
    ok: true,
    rating: d.rating,
    count: d.userRatingCount,
    name: (d.displayName && d.displayName.text) || null,
    fetchedAt: new Date().toISOString(),
  });
}
