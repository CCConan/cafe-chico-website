# Café Chico｜Site Architecture

> 4 個 HTML files + 1 index launcher。
> 用戶指定：1 個主版面（Home + Story + Contact）+ Menu 開新 page。

---

## 1. File Map

```
Cafe Chico website/
├── index.html              ← Single-page home (Home + Story + Contact stacked)
├── menu.html               ← Dedicated menu page (3D food effect + heavy RAM)
├── assets/
│   ├── css/
│   │   ├── shared.css      ← Tokens + nav + footer + SVG library
│   │   ├── index.css       ← Single-page styles
│   │   └── menu.css        ← Menu page styles + 3D viewer
│   ├── js/
│   │   ├── shared.js       ← Nav scroll-spy + tab switching + observer
│   │   ├── index.js        ← Sticky tabs + smooth scroll
│   │   └── menu.js         ← 3D food viewer (Three.js or CSS 3D)
│   └── photos/candidates/  ← Curated photos (10 files, see content-map.md)
├── planning/               ← This folder
├── research/               ← Google Maps screenshots
└── logs/                   ← Build logs
```

---

## 2. Page-by-page structure

### 2.1 `index.html`（Single Page — Home + Story + Contact）

> 用戶指定：「頂部 4 個 tab 是常駐在頂部的，點擊第一第二和第四的時候會自動在主頁來回滑動到對應的地方，但第三的餐牌點擊的時候就會開啟一個新的頁面」。

**Layout**: full-page stack with sticky tab nav

```
┌─────────────────────────────────────────────────┐
│  STICKY NAV: [Home] [Story] [Menu*] [Contact]  │ ← Menu → opens menu.html
├─────────────────────────────────────────────────┤
│                                                  │
│  #hero          — Home anchor                    │
│  ┌──────────┐                                    │
│  │  PHOTO   │  "Family-run. Made close to home." │
│  │  HERO    │   — 1 sentence + 1 photo + CTA     │
│  └──────────┘                                    │
│                                                  │
│  #highlights  — 3-col cards (signature dishes)   │
│  ┌──┐ ┌──┐ ┌──┐                                 │
│  │  │ │  │ │  │                                 │
│  └──┘ └──┘ └──┘                                 │
│                                                  │
│  #visit-info  — Hours + Phone + Address + Map    │
│                                                  │
│  ─────────────────                              │
│                                                  │
│  #story        — Story anchor                    │
│  ┌──────────┐                                    │
│  │  PHOTO   │  "We treat every plate like        │
│  │  STORY   │   we mean it."                     │
│  └──────────┘                                    │
│  (full story narrative — 3-4 paragraphs)        │
│                                                  │
│  #values      — 3-col cards (warmth / family /   │
│                  honest food)                    │
│                                                  │
│  ─────────────────                              │
│                                                  │
│  #contact      — Contact anchor                  │
│  ┌──────────┐ ┌──────────┐                      │
│  │  HOURS   │ │ ADDRESS  │                      │
│  │  PHONE   │ │  + MAP   │                      │
│  └──────────┘ └──────────┘                      │
│                                                  │
│  #footer      — Copyright + social               │
└─────────────────────────────────────────────────┘
```

**Section anchors**:
- `#hero` (Home)
- `#story` (Story)
- `#contact` (Contact)
- `menu.html` (Menu — separate page)

---

### 2.2 `menu.html`（Dedicated Menu Page）

> 用戶指定：「菜單點擊的時候就會開啟一個新的頁面，因為這裏會做其他的效果及佔用更多的記憶體來顯示圖片」+「我考慮加入在網頁顯示食物3D圖片的效果」。

**Layout**: 4-tab restaurant menu with 3D food viewer

```
┌─────────────────────────────────────────────────┐
│  STICKY NAV: [Home] [Story] [Menu*] [Contact]  │
├─────────────────────────────────────────────────┤
│                                                  │
│  HERO:  "The Menu"                               │
│  ──────────────                                  │
│                                                  │
│  TABS within menu: [All] [Pancakes] [Toast]    │
│                    [Brunch] [Drinks]             │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  3D FOOD VIEWER (Three.js)                  │ │
│  │  Currently selected dish — drag to rotate   │ │
│  │  Hot chocolate / pancakes / burger / etc.  │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  MENU GRID (2-col on desktop, 1-col mobile):    │
│  ┌─────────────┐  ┌─────────────┐                │
│  │ FRENCH TOAST│  │ PANCAKES    │                │
│  │ £5.95       │  │ £5.95       │                │
│  │ whipped     │  │ whipped     │                │
│  │ cream,      │  │ cream,      │                │
│  │ fresh fruit,│  │ fresh fruit,│                │
│  │ choice of:  │  │ choice of:  │                │
│  │ Nutella     │  │ Nutella     │                │
│  │ Lotus       │  │ Lotus       │                │
│  │ Maple       │  │ Lemon+Sugr  │                │
│  │             │  │ Maple       │                │
│  │             │  │ Oreo        │                │
│  └─────────────┘  └─────────────┘                │
│                                                  │
│  (more dishes...)                                │
│                                                  │
│  NOTE: Menu prices from photo 04 — partial data │
│  Full menu: cafe-chico.choiceqr.com              │
│                                                  │
│  #footer                                          │
└─────────────────────────────────────────────────┘
```

**3D Food Viewer notes**:
- Each dish has a hero photo (from candidates/) wrapped in a draggable rotation viewer。
- Lightweight: use CSS `transform: rotate3d(...)` with JS drag-handler + inertia, **no Three.js dependency** (keep RAM low)。
- Or: use Three.js + GLB models — but café food 唔會有現成 GLB models，所以 fallback 用 CSS 3D parallax。
- **Decision**: 2-3 dishes with simple drag-to-rotate parallax + smooth transition; rest as static hero photos。

---

## 3. Sticky Tab Nav Behaviour

### 3.1 HTML structure
```html
<nav class="site-nav" data-sticky>
  <a href="index.html" class="brand">Cafe Chico</a>
  <ul class="nav-tabs">
    <li><a href="#hero" data-tab="home" class="active">Home</a></li>
    <li><a href="#story" data-tab="story">Story</a></li>
    <li><a href="menu.html" data-tab="menu">Menu</a></li>
    <li><a href="#contact" data-tab="contact">Contact</a></li>
  </ul>
</nav>
```

### 3.2 Active state logic

**On `index.html`**:
- `IntersectionObserver` watches each section anchor (`#hero`, `#story`, `#contact`).
- Section in viewport (≥ 40% visible) → highlight corresponding tab.
- Smooth-scroll on click (skip if user has prefers-reduced-motion)。

**On `menu.html`**:
- "Menu" tab has `class="active"` static。
- Click "Home" / "Story" / "Contact" → navigate back to `index.html#anchor`。

### 3.3 Visual style
- Sticky nav height：72px desktop, 60px mobile。
- Background: `oklch(97% 0.012 80 / 0.92)` + `backdrop-filter: blur(12px)` when scrolled。
- Active tab: serif display font, 2px solid `--accent` underline 100%。
- Inactive: mono uppercase 11px letter-spaced。

---

## 4. Section breakdown（`index.html`）

### 4.1 Hero (`#hero`)
- **Goal**: Strong first impression + clear "what we are" in 5 seconds。
- **Content**:
  - Hero photo: `01-cover-interior-brickwall.jpg` (full-bleed, scrim overlay)。
  - H1: "Family-run. Made close to home." or "A neighbourhood table, since 2024."（待店主確認年份）
  - Subtitle: "Small, cosy café in Bolton — breakfast done properly, lunch that fills you up, and a hot chocolate that takes its time."
  - Primary CTA: "View the menu" → menu.html
  - Secondary CTA: "Get directions" → maps link
  - Kicker (mono, uppercase): "Bolton · Est. 2024"
- **Hand-drawn flourish**: Subtle squiggle underline beneath H1。

### 4.2 Highlights (`#highlights`)
- **Goal**: 3 dishes that anchor the food-first positioning。
- **Content**:
  - 3 cards (1-col mobile, 3-col desktop)。
  - Card 1: FRENCH TOAST (photo 03)
  - Card 2: PANCAKES (photo 07)
  - Card 3: AMERICAN SPECIAL (photo 05)
  - Each card: square photo + dish name (serif) + 1-line description + price (£5.95 for first two, "see menu" for third)。
- **Hand-drawn flourish**: Squiggle divider above section title。

### 4.3 Visit info (inline, between Home and Story)
- **Goal**: Practical info upfront (地址 / 營業時間 / 電話) — customers decide to visit fast。
- **Content**:
  - Address with map link
  - Hours (Sun-Sat table)
  - Phone
  - "Dine-in · Kerbside pickup · Delivery · Order online"

### 4.4 Story (`#story`)
- **Goal**: Establish "family-run" emotion + owner-on-floor narrative。
- **Content**:
  - Photo: `02-vibe-interior.jpg` (large, with vignette scrim)
  - H2: "We treat every plate like we mean it."
  - Body paragraphs (3-4):
    - Family-run ethos (from reviews: aliyah's "the way the owner treats people")
    - Food made fresh, generous portions (Hussnain's chicken sub)
    - Inclusive — vegan + gluten free + family-friendly
    - The neighbourhood table — "find us at the corner of St Helens Rd"
  - Pull quote: 「Wish more places were like this」 — Hussnain (5★ Google)
- **Hand-drawn flourish**: Heart wreath SVG centered between sections。

### 4.5 Values (3-col)
- **Goal**: 3 intangible selling points。
- **Cards**:
  - 1. "Made close to home" — owner + staff
  - 2. "Honest, generous portions" — Hussnain's chicken sub
  - 3. "A seat for everyone" — vegan / GF / family
- Each: small icon (SVG line art) + title + 2-line description。

### 4.6 Contact (`#contact`)
- **Goal**: All info to plan a visit。
- **Content**:
  - Hours table (full week)
  - Phone link
  - Address + embedded Google Maps (iframe 或靜態地圖 link)
  - Service options (4 chips)
  - "Order online" CTA → cafe-chico.choiceqr.com
- **Hand-drawn flourish**: Spoon-fork-cross SVG at section header。

### 4.7 Footer
- Brand mark + tagline
- Address · Phone · Hours summary
- Social: Instagram (cafechico_uk), TikTok (cafechico)
- "Updated 2026" copyright
- Photo credit note (Google Maps user-submitted)

---

## 5. Section breakdown（`menu.html`）

### 5.1 Hero
- H1: "The Menu"
- Subtitle: "Brunch and lunch, made close to home. £1-10 per person."

### 5.2 Inner menu tabs
- [All] [Pancakes] [French Toast] [Brunch] [Drinks] [Sides]
- JS-driven: click tab → scroll to category anchor。

### 5.3 3D Food Viewer
- Sticky position (right side desktop, top mobile).
- Currently selected dish: photo with drag-to-rotate parallax effect.
- Subtle ambient float animation (10s loop, ±2° rotation, 6px vertical drift)。
- "Drag to rotate · Scroll for more" hint (mono uppercase 10px)。

### 5.4 Menu categories（2-col grid on desktop）

Based on Google Maps menu highlights + photo 04 提取嘅資料：

| Category | Items (placeholder — need owner confirmation) |
|---|---|
| French Toast | Whipped cream, fresh fruit, choice of Nutella / Lotus / Maple — **£5.95** |
| Pancakes | Whipped cream, fresh fruit, choice of Nutella / Lotus / Lemon+Sugar / Maple / Oreo — **£5.95** |
| American Special | (Placeholder — owner to confirm ingredients + price) |
| Hot Chocolate | (Photo 06 — marshmallow tower; price TBD) |
| Brunch | Big breakfast platter (photo 09) — TBD |
| Lunch | Tomato bruschetta (photo 08), Brioche burger (photo 04), Chicken sub (Hussnain's review) — TBD |
| Kids | (Menu mentions "For the KIDS' M..." in photo 04 — TBD) |
| Drinks | Coffee, Hot Chocolate, Fresh juice (OJ in photo 04) — TBD |

> ⚠️ Many prices 未確認。設計用 placeholder copy "[Price TBC — owner to confirm]" 而非 invented prices。

### 5.5 Footer note
- "Full live menu + order online: cafe-chico.choiceqr.com"
- Photo credit: "Photos from Google Maps · © respective photographers"

---

## 6. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| `≥ 1180px` | Desktop — 12-col grid, sticky right-column menu viewer, multi-col cards |
| `720-1180px` | Tablet — single-col cards, simplified viewer |
| `< 720px` | Mobile — full-width, menu tabs scroll horizontally, viewer above grid |
| `≤ 400px` | Small mobile — condensed spacing, 16px text |

---

## 7. Performance budget

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total JS (gzipped) | < 50KB |
| Total CSS (gzipped) | < 20KB |
| Initial photos loaded | Hero only (1 image, ~800KB) |
| Below-fold photos | `loading="lazy"` |
| 3D viewer library | Optional — fallback to CSS 3D parallax if RAM low |

---

## 8. Browser support

- Modern evergreen: Chrome 110+, Safari 16+, Firefox 110+, Edge 110+。
- iOS Safari 16+ (handles CSS `clamp()`, `aspect-ratio`, `backdrop-filter`)。
- No IE11 / legacy support needed。

---

**Status**: ✅ Frozen — ready for Phase 3 HTML build.

**Generated by Nana (Hermes Agent) on 2026-07-26 02:10 BST**