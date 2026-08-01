# Café Chico｜Brand Spec

> 從 Google Maps 照片 + reviews metadata 推斷嘅品牌系統。
> 任何視覺 token 都係 placeholder — 店主未提供 official brand spec。

---

## 1. 視覺方向

**Editorial-Meets-Rustic**：印刷雜誌感 + warm café 觸感。
- **Reference vibes**: Monocle / Kinfolk / Frances café editorial / Nordic brunch photography。
- **不要做嘅**: Generic SaaS / Material Design / 餐廳 SaaS app 樣板。
- **要做嘅**: 像一本 coffee-table book — paper texture, generous whitespace, serif headlines 配 sans body, single decisive accent colour。

---

## 2. Colour Tokens（OKLch）

```css
:root {
  /* Surface */
  --bg:        oklch(97% 0.012 80);     /* Cream paper — warm off-white */
  --surface:   oklch(99% 0.008 80);     /* Card surface — slightly lifted */
  --bg-dark:   oklch(20% 0.025 50);     /* Deep brick — for hero overlays / footer */

  /* Text */
  --fg:        oklch(22% 0.025 50);     /* Espresso brown — main text */
  --muted:     oklch(48% 0.025 60);     /* Warm grey — secondary text */
  --border:    oklch(85% 0.020 80);     /* Hairline border — warm */

  /* Accent — ONE colour, used at most twice per surface */
  --accent:    oklch(48% 0.10 25);      /* Burnt sienna — vintage brick red */
  --accent-soft: oklch(85% 0.06 35);    /* Same hue, very desaturated — backgrounds */

  /* Semantic */
  --green:     oklch(42% 0.08 145);     /* Forest green — secondary accent / badge */
  --gold:      oklch(78% 0.08 75);      /* Antique gold — highlight text */
}
```

### 2.1 Accent 用法規則

| Where | Use | Why |
|---|---|---|
| Logo mark / Hero accent | `--accent` | 一眼記住 brand |
| Hover state on links | `--accent` underline | 第二個出現 |
| Anywhere else | **No** | Restraint — "一千個 no 比一個 yes" |
| Status / Open-closed | `--green` / `--accent` 改 muted | 信息而非 decoration |

---

## 3. Typography

### Display — Serif
```css
--font-display: "Iowan Old Style", "Charter", "Georgia", "Times New Roman", serif;
```
- 用喺 H1 / H2 / 餐牌名 / Hero display。
- tight letter-spacing：`-0.02em` for big sizes。
- weight 400-500（bold serif 容易顯得"快餐"）。

### Body — System Sans
```css
--font-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
```
- 用喺 paragraph / nav / button / form。
- body 16-18px / line-height 1.55-1.7。

### Mono — Metadata only
```css
--font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
```
- 用喺 hours / phone / price metadata / kicker labels。
- UPPERCASE + letter-spacing 0.12em。

### Type scale（clamp-based）

| Level | Size | Use |
|---|---|---|
| Display | `clamp(48px, 7vw, 96px)` | Hero H1 |
| H1 | `clamp(36px, 5vw, 64px)` | Page title |
| H2 | `clamp(28px, 3.5vw, 42px)` | Section heading |
| H3 | `clamp(20px, 2.5vw, 28px)` | Card title |
| Body | `clamp(16px, 1.2vw, 18px)` | Paragraph |
| Small | `14px` | Caption / metadata |

---

## 4. Spacing & Layout

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
  --space-8: 96px;
  --space-9: 128px;
}
```

### Layout rhythm
- Sections vertical spacing：`--space-8` (96px) desktop, `--space-6` (48px) mobile。
- Content max-width：`1180px` (Home, Story, Contact), `760px` (text-only sections)。
- Card grid gap：`--space-5` (32px) desktop, `--space-3` (16px) mobile。

### Grid
- 12-column on desktop (`grid-template-columns: repeat(12, 1fr)` with 24px gap)。
- 2-col mobile breakpoint at 720px。

---

## 5. Border & Radius

```css
--radius-sm: 2px;       /* Hairline, used sparingly */
--radius-md: 6px;       /* Card corners */
--radius-lg: 12px;      /* Buttons / Form fields */
--radius-pill: 999px;   /* Tags / Status badges */
--border-w: 1px;        /* Hairline default */
--border-w-thick: 2px;  /* Major dividers (e.g. section rules) */
```

> Cafe Chico 風格偏 rustic + editorial，唔好大量用 rounded corners。卡片用 `--radius-sm` 或 `--radius-md`。

---

## 6. Elevation / Shadow

```css
--shadow-1: 0 1px 2px rgba(60, 40, 20, 0.04);
--shadow-2: 0 4px 16px rgba(60, 40, 20, 0.08);
--shadow-3: 0 12px 32px rgba(60, 40, 20, 0.12);
```

> 偏 rustic 風格要 restrained shadows — 用 hairline border 而非 shadow 為主。
> Hover lift 用 `--shadow-2` 即可。

---

## 7. 手繪風格元素（核心 design hook）

> 用戶指定 "比較較強的手繪風格動畫"。 呼應 café interior 嘅 rustic + warm + personal 感覺。

### 7.1 SVG library（內聯 `<defs>` 喺 `<head>`，所有 page 共用）

| Element | 描述 | 用喺 |
|---|---|---|
| `wreath-heart` | 心形 wreath — 參考 café 內牆裝飾 | Story page hero divider |
| `coffee-cup-steam` | 咖啡杯 + 三條蒸氣 SVG path | Section dividers / Loading state |
| `spoon-fork-cross` | 餐具交叉（hand-drawn） | Menu page section headers |
| `squiggle-line` | 不規則手繪分隔線 | Above-the-fold section dividers |
| `brick-line-texture` | 細磚牆 line pattern | Subtle background (5% opacity) |
| `bicycle-silhouette` | 參考 cover photo 牆上掛單車 | Story page |
| `squiggle-arrow` | 手繪箭嘴 | CTAs / "scroll down" hints |

### 7.2 動畫語法

- **路徑繪製**：`stroke-dasharray` + `stroke-dashoffset`，用 `IntersectionObserver` trigger 一次。
- **漂浮元素**：`@keyframes` 緩慢上下 / 旋轉，`prefers-reduced-motion` 自動停。
- **Hover flourish**：單一 SVG 元素 hover 時微幅 scale + rotate（≤ 1.05x, ≤ 3deg）。
- **Easing**：全部用 `cubic-bezier(.2, .8, .2, 1)` — 同 Mac OS native 一致嘅軟出入。
- **Duration**：300ms (hover), 800ms (in-view reveal), 2400ms (ambient float loop)。

### 7.3 Reduce-motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
```

---

## 8. Photographic Treatment

### 8.1 Display sizes
- Hero：full-bleed，aspect 16:9 或 21:9。
- Card：4:5 or 3:4 portrait。
- Inline：1:1 square thumbnails (96-128px)。

### 8.2 Loading
- 所有 photo 用 `<img loading="lazy" decoding="async">`。
- 預先 blur placeholder (`filter: blur(8px)` + `transform: scale(1.05)`) → fade in 800ms。
- 永遠保留 aspect-ratio，避免 CLS。

### 8.3 Hover
- Slow scale `transform: scale(1.04)` over 1.2s `cubic-bezier(.2, .8, .2, 1)`。
- 加 subtle `box-shadow` lift。

---

## 9. Iconography

- **No emoji icons**（user-preference + SOUL anti-slop）。
- 用 thin-stroke SVG icons (Lucide / Feather style)，1.5px stroke。
- Icon size：20-24px inline，32-48px as decorative。
- 顏色：`--muted` default，`--accent` active state。

---

## 10. Motion Vocabulary

| Trigger | Effect |
|---|---|
| Page load | Hero photo fade-in + headline stagger-up（80ms delay each line） |
| Scroll into view | Section reveal: title + body fade-up 16px, 600ms ease-out |
| Hover (button) | Background swap `--accent` 200ms |
| Hover (photo) | Slow scale + lift |
| Click feedback | Active scale 0.97, 100ms |
| Form focus | Border colour swap + subtle 4px accent shadow ring |

---

## 11. Accessibility baseline

- Color contrast: `--fg` on `--bg` 達 WCAG AA（≥ 4.5:1）。
- `--muted` only used for non-essential metadata; never for body text.
- Focus rings: 2px solid `--accent`, 4px offset。
- All interactive elements ≥ 44px tap target on touch。
- `prefers-reduced-motion` honoured。
- ARIA labels on icon-only buttons。

---

## 12. Tokens — Drop into `:root`

```css
:root {
  /* === Color === */
  --bg:        oklch(97% 0.012 80);
  --surface:   oklch(99% 0.008 80);
  --bg-dark:   oklch(20% 0.025 50);
  --fg:        oklch(22% 0.025 50);
  --muted:     oklch(48% 0.025 60);
  --border:    oklch(85% 0.020 80);
  --accent:    oklch(48% 0.10 25);
  --accent-soft: oklch(85% 0.06 35);
  --green:     oklch(42% 0.08 145);
  --gold:      oklch(78% 0.08 75);

  /* === Typography === */
  --font-display: "Iowan Old Style", "Charter", "Georgia", "Times New Roman", serif;
  --font-body:    -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* === Spacing === */
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px;
  --space-5: 32px; --space-6: 48px; --space-7: 64px; --space-8: 96px; --space-9: 128px;

  /* === Radius === */
  --radius-sm: 2px; --radius-md: 6px; --radius-lg: 12px; --radius-pill: 999px;

  /* === Border === */
  --border-w: 1px; --border-w-thick: 2px;

  /* === Shadow === */
  --shadow-1: 0 1px 2px rgba(60, 40, 20, 0.04);
  --shadow-2: 0 4px 16px rgba(60, 40, 20, 0.08);
  --shadow-3: 0 12px 32px rgba(60, 40, 20, 0.12);

  /* === Easing === */
  --ease-soft: cubic-bezier(.2, .8, .2, 1);
}
```

---

## 13. Anti-patterns to AVOID

- ❌ Aggressive purple / orange gradient backgrounds
- ❌ Generic warm beige "AI canvas" page wash
- ❌ Inter / Roboto / Arial as display face
- ❌ Emoji icons（✨ 🚀 🎯）
- ❌ Rounded card + coloured left border accent
- ❌ Hand-drawn SVG humans / faces
- ❌ "Feature One / Feature Two" placeholder copy
- ❌ Gradient on every background
- ❌ Floating "demo controls" / platform toggles in product UI
- ❌ Filler stat slop ("99.9% uptime", "10× faster") with no source

---

**Status**: ✅ Frozen — ready for Phase 3 HTML build.

**Generated by Nana (Hermes Agent) on 2026-07-26 02:05 BST**