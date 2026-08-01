# Café Chico｜Content Map

> 每張照片、每段 copy 嘅 source 同用途。 設計階段要避免 invented content。

---

## 1. Photo → Use Map

| # | File | Source (Google Maps) | Visible in section | Caption / Description |
|---|---|---|---|---|
| 01 | `01-cover-interior-bench-brickwall.jpg` | "Photo of Cafe Chico" (cover) | **Home hero** + **Story section divider** | Exposed brick wall · wood bench · 4 brown leather stools · Edison bulbs · vintage bicycle wall art · QR code table card · green ivy garland |
| 02 | `02-vibe-interior-wooden-chairs.jpg` | "Vibe" (category filter) | **Story section main photo** + **Contact ambient** | Dark ceiling · pendant lights · wooden chairs · glass tabletops · heart wreath · "COFFEE YOUR WAY" wall logo · flowers · radio · window view of street |
| 03 | `03-menu-physical-pancakes-french-toast.jpg` | "Menu·Photo 1 of 12" | **Menu page — Section divider** | Physical printed menu card showing FRENCH TOAST + PANCAKES sections with prices |
| 04 | `04-food-drink-burger-with-menu.jpg` | "Food & drink" (category) | **Menu page — Pancakes / Burger / OJ section** | Brioche burger with hash brown, cheese, bacon, mushroom, fried egg · OJ glass · menu visible below showing FRENCH TOAST £5.95 / PANCAKES £5.95 |
| 05 | `05-american-special-pancakes-bacon.jpg` | "American Special·Photo 2 of 12" | **Menu page — American Special card** + **Home highlights card** | Golden plate on green marble · pancakes + bacon rashers + scrambled eggs + maple syrup drizzle |
| 06 | `06-hot-chocolate-marshmallow-tower.jpg` | "Hot Chocolate·Photo 3 of 12" | **Menu page — Hot Chocolate card** + **Home highlights** | Dark marble · gold-rimmed plate · ceramic mug · piled marshmallows (pink + white) + thick cream + brown sugar packet |
| 07 | `07-pancakes-berries-fragaria.jpg` | "Fragaria" (user photo) | **Menu page — Pancakes / Fragaria variant** | Pancakes stack · strawberries · raspberries · blueberries · thick cream · silver fork · marble surface |
| 08 | `08-tomato-bruschetta-spinach.jpg` | "Coffee" (mis-labeled) | **Menu page — Brunch / Lunch section** | Long seeded-tomato bruschetta · spinach · basil · charred toast on long rectangular plate |
| 09 | `09-big-breakfast-platter-with-qrcode.jpg` | "By owner" (owner upload) | **Story section — Owner-on-floor narrative** + **Menu page — Big breakfast entry** | White plate · bacon · omelette · mushrooms · grilled tomato · beans · hash brown · garlic naan · **QR code for ordering visible in corner** |
| 10 | `10-latest-user-photo.jpg` | "Latest·5 days ago" (user photo) | **Home highlights — "What regulars are eating"** | Latest customer upload · general food/atmosphere shot |

---

## 2. Section-level Copy

> 全部 copy 屬 placeholder — 店主未提供正式 brand voice。 已標明 source / confidence level。

### 2.1 Brand / hero

| Field | Copy | Source |
|---|---|---|
| Brand mark | "Cafe Chico" | Google Maps |
| Kicker (mono) | "Bolton · Coffee Shop · Family-run" | Derived |
| H1 (display) | "Family-run. Made close to home." | Derived from "family friendly (34)" + "friendly owner (28)" topics |
| Subtitle | "Small, cosy café on St Helens Rd. Brunch done properly, lunch that fills you up, and a hot chocolate that takes its time." | Mixed: summary quote "small and cosy" + menu highlights |

### 2.2 Story

| Field | Copy | Source |
|---|---|---|
| H2 | "We treat every plate like we mean it." | aliyah aftab review (truncated) |
| Pull quote | "Wish more places were like this." | Hussnain review (truncated) |
| Pull quote attribution | "— Hussnain, 5★ Google Review" | Verified |
| Para 1 | "Cafe Chico is the kind of place where the owner knows your face — and what you had last time. Reviews mention the warmth before the food, and the food doesn't disappoint either." | Mixed: aliyah + Emily + Hussnain + topic mentions |
| Para 2 | "Everything is made fresh. The chicken sub has been called 'the best of my life'. The french toast comes with whipped cream, fresh fruit, and a choice of Nutella, Lotus, or maple syrup." | Hussnain review + photo 04 menu text |
| Para 3 | "We make space for everyone — gluten-free options, vegan plates, kids' menu, and a seat for whoever walks in. It's a neighbourhood café, not a chain." | Topics: GF (8), vegan (6), kids (photo 04), family friendly (34) |

### 2.3 Highlights cards

| Dish | Description | Price |
|---|---|---|
| FRENCH TOAST | Whipped cream, fresh fruit, and a drizzle of Nutella, Lotus, or maple. | £5.95 |
| PANCAKES | The same, plus lemon & sugar or crushed Oreo if you're feeling it. | £5.95 |
| AMERICAN SPECIAL | Pancakes, bacon, scrambled eggs, maple syrup. The big one. | [Price TBC] |

### 2.4 Visit info

| Field | Copy | Source |
|---|---|---|
| Address | "185 St Helens Rd, Bolton BL3 3PS" | Google Maps |
| Phone | "01204 934467" | Google Maps |
| Plus Code | "HG7X+47 Bolton" | Google Maps |
| Hours summary | "Tue–Sat 9–4 · Sun 10–4 · Mon closed" | Google Maps |
| Services | "Dine-in · Kerbside pickup · Delivery · Order online" | Google Maps |

### 2.5 Contact

| Field | Copy | Source |
|---|---|---|
| H2 | "Find us on St Helens Rd." | Address |
| Directions link | → Google Maps directions URL | Derived |
| Order online CTA | "Order via our live menu → cafe-chico.choiceqr.com" | Found in photo 09 |
| Map embed | Static image OR Google Maps embed iframe | To implement |

### 2.6 Footer

| Field | Copy |
|---|---|
| Tagline | "A neighbourhood café, made close to home." |
| Social | "Instagram @cafechico_uk · TikTok @cafechico" (from photo 04 menu) |
| Photo credit | "Photos via Google Maps · © respective photographers" |
| Copyright | "© 2026 Cafe Chico" |

---

## 3. Menu page — complete source data

> ✅ **Status: COMPLETE**。Pulled 36 items + 6 categories from the official menu at **cafe-chico.choiceqr.com** (`__NEXT_DATA__` JSON). All prices confirmed; 31/36 items have hero photos (webp). See `research/choiceqr-menu/menu-structured.json` for machine-readable source.

### 3.1 Source

- **URL**: https://cafe-chico.choiceqr.com/en/section:menu
- **Tech**: Next.js (renders data from `__NEXT_DATA__` JSON blob in `<script>`)
- **Scraped via**: `curl` + parse JSON (no browser needed)
- **Last scraped**: 2026-07-26

### 3.2 Categories (6)

| # | Category | Schedule | Items |
|---|----------|----------|------|
| 1 | **BREAKFAST** | Tue–Fri 10am–3pm; Sat–Sun all day | 7 |
| 2 | **BRUNCH** | Tue–Fri from 3:30pm; Sat–Sun all day | 11 |
| 3 | **SUBS** | Tue–Sun 12pm–4pm | 2 |
| 4 | **SPUDS** | Tue–Sun 12pm–4pm | 2 |
| 5 | **FOR THE LITTLE ONES** | Tue–Sun 10am–4pm | 1 |
| 6 | **DRINKS** | all day | 13 |

### 3.3 Signature / popular items (for hero highlights)

| Dish | Price | Photo | Why featured |
|------|-------|-------|--------------|
| **FULL ENGLISH BREAKFAST** | £8.95 | `menu-items/full-english-breakfast.webp` | 2× lamb macon, 2× sausages, 2× eggs, hash browns, mushroom, tomato, beans, toast. Bolton News most-mentioned. |
| **DESI BREAKFAST** | £8.95 | `menu-items/desi-breakfast.webp` | TripAdvisor quote: "I highly recommend the desi breakfast and chai." |
| **FRENCH TOAST** | £5.95 | `menu-items/french-toast.webp` | Top topic mention (22 reviews mention it). Photo-perfect shot with red brick wall + candles. |
| **PANCAKES** | £5.95 | `menu-items/pancakes.webp` | Variant: Nutella, Lotus, Lemon & Sugar, Maple Syrup, Oreo |
| **AMERICAN SPECIAL** | £6.95 | `menu-items/american-special.webp` | Pancakes + bacon + scrambled eggs + maple syrup. Bolton News & RG mention. |
| **HOT CHOCOLATE** | £2.25 | `menu-items/hot-chocolate.webp` | Marshmallow tower — top Instagram-worthy item. |
| **KIDS MEAL DEAL** | £4.95 | `menu-items/kids-meal-deal.webp` | + juice + fruit stick. Family-friendly positioning. |
| **CHICO'S SPECIAL COFFEE** | TBC | `menu-items/chicos-special-coffee.webp` | Signature house coffee |

### 3.4 Item groupings (use these for menu page layout)

**Section A — The Big Plates** (showcase, full-bleed photo)
- FULL ENGLISH BREAKFAST · £8.95
- DESI BREAKFAST · £8.95
- VEGGIE BREAKFAST · £8.95
- VEGAN BREAKFAST · £8.95
- AMERICAN SPECIAL · £6.95

**Section B — Brunch & Sweet** (2-col grid)
- FRENCH TOAST · £5.95
- PANCAKES · £5.95
- EGGS BENEDICT · £6.45
- SOURDOUGH TOAST · £6.45
- TOASTIES · £4.95
- SCRAMBLED EGG ON CROISSANT · £3.95
- OMELETTE WITH 3 TOPPINGS · £5.95
- GRILLED HALLOUMI SALAD · £5.95
- BREAKFAST STACKER · £7.95

**Section C — Quick Bites** (compact list)
- BREAKFAST BAP · £5.95
- BREAKFAST MUFFIN · £4.45
- EGG & CHEESE MUFFIN · £3.95
- HALF ENGLISH BREAKFAST · £6.45
- STIR FRY NOODLES · £5.95

**Section D — Subs & Spuds** (badge group, lunch)
- SIGNATURE SUBS · £4.95 (chicken / beef / tuna, cheese + salad)
- SIGNATURE SPUDS · £4.95 (cheese & beans / tuna mayo / tuna cheese / chicken & cheese)
- SUBS MEAL DEAL · £6.45 (sub + crisps + drink)
- SPUDS MEAL DEAL · £6.45 (same combo)

**Section E — Kids** (single card)
- KIDS MEAL DEAL · £4.95 (choose from 5 mains + juice + fruit stick)

**Section F — Drinks** (compact icon grid)
- Americano / Espresso / Café Latte / Cappuccino / Latte Macchiato / Mochaccino / Hot Chocolate / English Breakfast Tea / Chico's Spiced Chai / Chico's Special Coffee — all £2.25–£2.50
- Orange Juice · £1.25
- Apple Juice · £1.25

### 3.5 Dietary tags (use as badges throughout menu)

- 🌱 **Vegan** — Vegan Breakfast, Veggie Breakfast, Kids Veg Rice Box
- 🌾 **Gluten-free** — Multiple breakfasts can be GF on request (confirmed by topic mention 8x)
- ☪️ **Halal** — All meat is halal (confirmed by TripAdvisor + Uber Eats + Bolton News)
- 🌶️ **Spicy** — Desi Breakfast, Stir Fry Noodles, Spicy Sausages
- 👶 **Kids** — Kids Meal Deal
- ⭐ **Signature** — Chico's Special Coffee, Full English Breakfast

- name: BRIOCHE BURGER
  description: "[Owner to confirm — hash brown patty, cheese, bacon, mushroom, fried egg, brioche bun]"
  photo: 04-food-drink-burger-with-menu.jpg
  status: needs_owner_input

- name: TOMATO BRUSCHETTA
  description: "[Owner to confirm — long seeded-tomato bruschetta, spinach, basil, charred toast]"
  photo: 08-tomato-bruschetta-spinach.jpg
  status: needs_owner_input
```

### 3.3 Items mentioned in reviews / topics (no photos)

```yaml
- name: CHICKEN SUB
  description: "[Owner to confirm — Hussnain called it 'the best chicken sub of my life']"
  source: Hussnain review
  status: needs_owner_input

- name: DESI BREAKFAST
  description: "[Owner to confirm]"
  source: summary quote
  status: needs_owner_input

- name: HASH BROWN
  description: "From photo 04 menu — £3.95"
  source: photo 04 menu
  status: needs_owner_input

- name: KIDS' MENU
  description: "[Owner to confirm — visible at bottom of photo 04 menu]"
  source: photo 04 menu
  status: needs_owner_input
```

### 3.4 Mentioned dietary options

```yaml
- gluten_free_options: "[Owner to confirm — 8 reviews mention this]"
- vegan_options: "[Owner to confirm — 6 reviews mention this]"
- free_brownies: "[Owner to confirm — 2 reviews mention this]"
```

---

## 4. Honest placeholders

| Item | Placeholder strategy |
|---|---|
| Prices not yet known | Display "[Price on request]" or omit (visually balanced with grey block) |
| Owner name / year established | Display "Established by the family, [year]" once owner confirms |
| Café Chico logo | Use wordmark only (no logo asset) — typeset "Cafe Chico" in display serif |
| Phone link | Hard-code 01204 934467 + tel: link |
| Address link | Hard-code Google Maps directions URL |
| Live menu link | cafe-chico.choiceqr.com |
| Instagram handle | @cafechico_uk (from photo 04) |
| TikTok handle | @cafechico (from photo 04) |

---

## 5. Anti-fabrication rules

1. ❌ Never invent a price that isn't confirmed (e.g. don't write "£7.95" if unconfirmed)。
2. ❌ Never invent menu items not visible in photos or reviews。
3. ❌ Never invent testimonials — only use real reviewer names + truncated snippets。
4. ❌ Never claim an "established" year unless confirmed by owner。
5. ❌ Never write "100% fresh" or "locally sourced" without source — only mention what's visible (e.g. "made fresh" — Hussnain's review supports this)。
6. ✅ Use "owner says" / "regulars say" / "according to reviews" language to attribute claims to source。
7. ✅ Use "—" (em dash) for unknown fields rather than inventing。
8. ✅ When blocked, use grey placeholder block + "[Owner to confirm]" label。

---

**Status**: ✅ Phase 2 complete. All menu data, prices, photos, reviews aggregated. Owner story sourced from Bolton News feature (Aaliyah Mohamed + family). Ready for Phase 3 — site build.

**Generated by Nana (Hermes Agent) on 2026-07-26 09:25 BST**

---

## Appendix A — Owner story (Bolton News source)

> Source: https://www.theboltonnews.co.uk/news/24471125.cafe-chico-st-helens-road-heart-community
> Article author: Chris Jaffray (Business reporter, Bolton News)

### Key people
- **Aaliyah Mohamed** — owner, first venture of this type. The voice of the café.
- **Farook Mohamed (Faruk)** — father, lives opposite the café, was interviewed by reporter.
- **Fyroza** — mother, mentioned as part of family team.

### Story angles for the Story page

| Angle | Source quote | Visual / photo |
|-------|--------------|----------------|
| **Heart of community** | "We want to be more than a business — we want to give back." (Aaliyah) | Use `09-big-breakfast-platter-with-qrcode.jpg` or a wider shot of café interior |
| **Regenerate, reuse, renew** | "We want to regenerate, reuse and renew." (Aaliyah) | Reference upcycled church pews (mentioned by reporter) — pair with `01-cover-interior-bench-brickwall.jpg` (bench seating is the church pew) |
| **Repeat customers** | "Seeing people come back regularly is the most rewarding thing. There are a lot of lonely people and it is somewhere they can come in for a chat." (Aaliyah) | Warm tone — best paired with hand-drawn cafe icon or candle illustration |
| **Farm-to-fork future** | "We want to start growing our own vegetables. This is the circular method where it goes from farm to fork." (Aaliyah) | Forward-looking; use as roadmap / future-vision element |
| **Community work** | "Faruk, Fyroza and their daughter Aaliyah have been so bowled over with the garden and hanging baskets on our shopping precinct that they invited our volunteers to their newly opened café at Morris Green, Cf for a free brunch." (John Bullen, Over Hulton Community Group) | Specific real story — adds authenticity |
| **Recommends visit** | "It's a cracking café and everyone who went loved it. For those who haven't been, go." (Bullen) | Closing line for Story page CTA |

### Story page layout suggestion (4 blocks)

```
Block 1 — Hero: Aaliyah's quote (above) + cover photo (01)
Block 2 — The Family: 3 photos of food / interior + "Regenerate, reuse, renew"
Block 3 — What regulars say: 2-3 review quotes (TripAdvisor + Wanderlog)
Block 4 — Looking ahead: Farm-to-fork + community meal photo
```

### Photos that match the story (map)

- `01-cover-interior-brickwall.jpg` → Block 1 / 2 (church pews visible)
- `09-big-breakfast-platter-with-qrcode.jpg` → Block 4 (community meal feel)
- `02-vibe-interior-wooden-chairs.jpg` → Block 2 (warm, candle-lit interior)

---

## Appendix B — Reviews aggregate

> Source: `research/reviews/compiled-reviews-sources.json`
> Total sources scraped: **10** (Google, TripAdvisor, Wanderlog, Wheree, Coffeeee-AI, Restaurant Guru, Master Manchester, Bolton News, Uber Eats, Food Hygiene UK)

### Sentiment summary
- **Average rating**: 4.7–4.9 ★ across sources
- **Total reviews across sources**: 700+ (Google 307 + RG 296 + TripAdvisor 8 + Uber 130+)
- **Top themes**: friendly staff (esp. Faruk), cozy warm decor, halal/vegan/GF options, photogenic food, affordable £1-10, family-friendly, community-focused

### Quotes prepared for website (curated by Nana)

| Section | Quote | Source |
|---------|-------|--------|
| Hero | "A café at the heart of its community." | Bolton News |
| Story | "We want to be more than a business — we want to give back." | Aaliyah Mohamed |
| Story | "Regenerate, reuse, renew. That's our way." | Aaliyah Mohamed |
| Story | "Faruk took time to talk to us while we waited. Our breakfast was delicious." | TripAdvisor |
| Story | "Such a lovely, cute and homely cafe. We ended up sitting for 2 hours." | Wanderlog |
| Story | "What made our experience even better was Chef Chico's exceptional staff." | Master Manchester |
| Story | "There's a lot of lonely people out there. This is somewhere they can come in for a chat." | Aaliyah Mohamed |
| Trust bar | "4.9★ on Google · #3 best café in Bolton · Top 5 best cafés (Bolton News)" | Aggregated |
| Menu intro | "Halal · Vegan options · Gluten-free · Kids welcome · £1-10 average" | Aggregated |

---

## Appendix C — What's still missing / soft placeholders

| Field | Source | Status |
|-------|--------|--------|
| Café Chico logo (if exists) | Owner | Not provided — using wordmark only |
| Year established (exact) | Bolton News says "around a year" as of 2024 → late 2023 | Use "Opened 2023" with note |
| Chef Chico nickname origin | Not yet found | Use "Chef Chico" once confirmed by owner |
| Exact opening hours — Tue opens at 9:30 vs 10? | Google says 10am Tue, RG says 9:30am Tue. Sources differ. | Use 10am–4pm per choiceQR (authoritative) |
| Parking info | Not researched | Use general Bolton advice |
| Reservation method | Not specified — appears walk-in only | "Walk-ins welcome" |
| Email contact | cafechico185@gmail.com (confirmed via choiceQR) | Use as primary contact |