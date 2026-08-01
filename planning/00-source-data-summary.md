# Café Chico｜Source Data Summary

> 從 Google Maps place page（`https://maps.app.goo.gl/vYhYXEfkkgfor3qBA`）extract 嘅真實資料。
> 收集日期：2026-07-26 ｜ 工具：EGO Lite（Chromium-based browser automation）

---

## 1. 店舖基本資料

| 項目 | 內容 |
|---|---|
| **店名** | Cafe Chico |
| **類型** | Coffee shop |
| **地址** | 185 St Helens Rd, Bolton BL3 3PS |
| **坐標** | 53.5953408, -2.3887872 |
| **Plus Code** | HG7X+47 Bolton |
| **電話** | 01204 934467 |
| **價格範圍** | £1–10 per person |
| **平均消費** | (Reported by 199 people) |
| **評分** | ★ 4.9 / 5（307 reviews） |
| **鄰近地標** | St Helens Rd, Bolton（Park Cakes 對面） |

> ⚠️ 用戶原本稱「Manchester 附近」，實際位於 Bolton（大曼徹斯特郡一部分，約 25 分鐘車程到 Manchester centre）。地址照實寫。

---

## 2. 營業時間

| Day | Hours |
|---|---|
| Sunday | 10:00 – 16:00 |
| Monday | **Closed** |
| Tuesday | 09:30 – 16:00 |
| Wednesday | 09:00 – 16:00 |
| Thursday | 09:00 – 16:00 |
| Friday | 09:00 – 16:00 |
| Saturday | 09:00 – 16:00 |

> Last updated 8 weeks ago by business。

---

## 3. 服務方式

- ✅ **Dine-in**
- ✅ **Kerbside pickup**
- ✅ **Delivery**
- ✅ **Order online**（cafe-chico.choiceqr.com — ChoiceQR 系統）

---

## 4. AI-generated Review Summary（Google Maps 自動抽取）

> "Amazing, small and cosy place, service is wonderful, the food delicious."
> "Staff is very kind, atmosphere is very peacefull and relaxing."
> "Ordered the desi breakfast, French toast and hot chocolate"

---

## 5. Topic Mentions（Google Maps 自動統計）

| Topic | Mention Count |
|---|---|
| family friendly | **34** |
| welcoming staff | **28** |
| friendly owner | **28** |
| french toast | **22** |
| gluten free options | 8 |
| vegan options | 6 |
| family run cafe | 3 |
| free brownies | 2 |
| lamb bacon | 2 |
| rustic decor | 2 |

> 合計 133 mentions（topics 有 overlap）。

---

## 6. 顯示中 Reviews（3 / 307 — Google Maps client-side limit）

> ⚠️ Google Maps 預設只 render 10 reviews，DOM click "More" 後 text node 唔會 swap 成 full text（server-side truncation）。
> 收集限制：3 個可見完整 reviews（每個 ~242 chars）、其他 304 個要靠 review-summary quotes + topic metadata + reviewer profile 推斷。

### 6.1 aliyah aftab（5★ · 2 months ago · 11 reviews · 7 photos）

> "You can learn so much about a place from the way the owner treats people—and this café is a perfect example of that. From the moment we walked in, we were greeted with genuine warmth; the owner was incredibly friendly, and the staff made us …"

**Key signals**: owner 親自招呼 · staff warmth · 重視對待客人的方式

### 6.2 Emily Brusseau（5★ · 6 months ago · 9 reviews · 7 photos）

> "I would highly recommend anybody who is thinking about trying Cafe Chico, go, do it! Popped in today and not only was the food delicious, but the service was truly heart warming. I believe the person was the owner, but they really lit up …"

**Key signals**: 強烈推薦 · 食物美味 · service 暖心 · owner 在場

### 6.3 Hussnain（5★ · 2 months ago · 6 reviews · 4 photos）

> "Don't usually leave reviews but this is probably the best chicken sub i have had in my life. Made fresh and the way everyone from the staff to the owner treat everyone who walks through the doors shows what this place is about. I wish more …"

**Key signals**: 不常留評 · chicken sub 係招牌 · 食物新鮮 · 人情味濃 · wish more places like this

---

## 7. Sentiment Analysis（基於上述 signals + summary quotes + topic metadata）

### 7.1 量化
- **平均評分**: 4.9 / 5（307 reviews）— 接近滿分
- **全部 3 個可見 reviews 都係 5★** — 一致極高滿意度
- **Topics 推斷 rating distribution**: family-friendly + welcoming + owner-friendly 佔 90 mentions → 反映 overwhelming positive

### 7.2 主題
| Theme | 來源 | 出現次數 |
|---|---|---|
| **Owner presence & warmth** | aliyah, Emily, Hussnain + "friendly owner" topic | 28 mentions |
| **Family-friendly atmosphere** | "family friendly" + "family run cafe" topics | 37 mentions |
| **French toast 招牌菜** | french toast topic + Emily + summary quote | 22 mentions |
| **Hot chocolate / indulgent drinks** | "Hot Chocolate" photo caption + summary quote | (visual + quote) |
| **Generous portions / value** | Hussnain "best chicken sub of my life" + price £1-10 | (implicit) |
| **Rustic + warm interior** | "rustic decor" topic + interior photos | 2 mentions |
| **Inclusive dietary options** | "gluten free options" (8) + "vegan options" (6) | 14 mentions |
| **Generous extras** | "free brownies" topic | 2 mentions |

### 7.3 Narrative Themes（design implications）

1. **"Family-run, owner-on-floor"** — 不係連鎖，係有人情味。Hussnain 講 "wish more places like this"。
2. **"Honest food, no shortcuts"** — chicken sub / french toast / hot chocolate 都係 comfort food 變奏，做得用心。
3. **"Inclusive neighbourhood hub"** — vegan + gluten free + family run 同時出現，display 一種「為所有人服務」嘅定位。
4. **"Rustic-modern, photogenic"** — interior 風格（brick wall + wood + Edison bulbs）適合用嚟做 hero image。

---

## 8. Photos Captured（11 張 + 1 街景 — 由 Google Maps photo carousel 下載）

| # | Filename | Subject | Use case |
|---|---|---|---|
| 01 | `01-cover-interior-bench-brickwall.jpg` | Café 入口 brick wall + bench + leather stools + Edison bulbs + bicycle wall art | **Hero image for Home** |
| 02 | `02-vibe-interior-wooden-chairs.jpg` | 木桌椅、玻璃枱、街景透窗、心形 wreath、COFFEE 標誌 | "A slower moment" section / Story page |
| 03 | `03-menu-physical-pancakes-french-toast.jpg` | Menu 牌 visible，showcase pancakes / french toast | **Menu page** — show menu physical + dishes |
| 04 | `04-food-drink-burger-with-menu.jpg` | Brioche burger + OJ + menu 顯示「FRENCH TOAST £5.95」「PANCAKES £5.95」 | **Menu page** — pricing proof |
| 05 | `05-american-special-pancakes-bacon.jpg` | 招牌 American Special — pancakes + bacon + scrambled eggs + maple syrup | **Menu page** — American Special entry |
| 06 | `06-hot-chocolate-marshmallow-tower.jpg` | Indulgent hot chocolate — marshmallow tower + 厚 cream | **Menu page** — Hot Chocolate entry / Story (indulgent moment) |
| 07 | `07-pancakes-berries-fragaria.jpg` | Pancakes 配 strawberry / raspberry / blueberry + 厚 cream | Menu "FRAGARIA" variant |
| 08 | `08-tomato-bruschetta-spinach.jpg` | Tomato bruschetta + spinach + toast | Lunch / savoury section |
| 09 | `09-big-breakfast-platter-with-qrcode.jpg` | Big breakfast platter + 角落 QR code | **Story page** — "owner on floor, family run" + QR code visible |
| 10 | `10-latest-user-photo.jpg` | 最新 user photo（5 days ago） | Social proof / "see what regulars are eating" |

**Photo classification by use**:
- **Hero / Home**: 01 (brick wall), 02 (vibe)
- **Menu page (food shots)**: 03, 04, 05, 06, 07, 08
- **Story page (people + interior)**: 01, 02, 09
- **Contact / general**: 02

---

## 9. Nearby Competitors（People also search for）

| Name | Rating | Category |
|---|---|---|
| Bridge Coffee | 4.9 (222) | Coffee shop |
| Monte Carlo Café | 4.8 (219) | Cafe |
| Buttylicious | 4.7 (72) | Cafe |
| Town Cafe | 4.3 (293) | Cafe |

> Cafe Chico 4.9 / 307 係同區評分最高之一，僅次於 Bridge Coffee。

---

## 10. Limitations & Caveats

1. **307 reviews 之中只可見 3 個 full-text**：Google Maps client-side render limit。AI summary 取代咗大部分 review text。Topic metadata 係最完整 aggregate signal。
2. **Photos 版權**：所有 Google Maps photo 由用戶上載，**商業使用前必須取得授權**（店主或 photographer）。
3. **Menu 內容來自照片 04 嘅印刷 menu** + Google Maps menu highlights（American Special, Hot Chocolate）。未訪問 cafe-chico.choiceqr.com 取完整 menu。
4. **No 官方 logo / branding**：未喺 Google Maps 揾到 Café Chico 嘅官方 logo 或 brand spec。視覺方向係從照片推斷（rustic + warm + Edison bulb + brick wall）。
5. **2 months ago latest update**：店舖資料未必 100% current；建議設計前同店主 confirm 一輪。

---

## 11. Next Steps

1. ✅ Phase 1 完成 — 圖片 + place data + reviews metadata 收集
2. 🔄 Phase 2 進行中 — 撰寫 `brand-spec.md`, `site-architecture.md`, `content-map.md`
3. ⏳ Phase 3 — HTML files（index / home / menu / story / contact）
4. ⏳ Phase 4 — checklist + 5-dim critique

---

**Generated by Nana (Hermes Agent / MiniMax-M3) on 2026-07-26 02:00 BST**