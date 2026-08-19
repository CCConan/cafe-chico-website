# site-images

This is the **live image library** for the Café Chico website. Every file in this tree is something the site actually references from a page or stylesheet. Edit, swap, and recompress here without touching the source archive under `../photos/`.

## Why a separate tree

The rest of `assets/photos/` is a **source archive** with mixed purpose:

- `social/instagram/` — 30+ raw downloads from the café's Instagram, hash filenames
- `social/instagram/curated/` — Studio Nestir-curated picks for the site
- `candidates/` — pre-curation photo candidates
- `raw/menu-items/` — original menu item photos (currently being migrated; see Stage 2 below)
- `catering/`, `party-room/`, `ice-cream-bike/` — page-specific historical assets
- `logo/` — original raw logo plus its processed derivatives
- `maps/`, `press/`, `photo from Faruk/` — Faruk's deliveries and the Google Maps screenshots

Replacing a file inside those folders risks losing the source. The site-images tree fixes that: every file here is a **copy** of a source, with a clear provenance line in `INDEX.json`. If we ever want to revert, we delete the copy and re-copy from `../photos/`.

## Folder layout

```
site-images/
├── INDEX.json                  ← machine-readable manifest, always keep in sync
├── README.md                   ← this file
├── logo/                       ← used by every page (nav, footer, favicon)
│   ├── chico-logo-light.png    1426×1538 RGBA, transparent (content-cropped). Default for light-mode nav.
│   ├── chico-logo-dark.png     Same artwork, recoloured to espresso brown.
│   ├── chico-stack-light.png   540×368 — compact variant
│   ├── chico-stack-dark.png
│   ├── chico-text-light.png    1500×1024 — wordmark only (no cup)
│   ├── chico-text-dark.png
│   ├── chico-favicon.png       512×350
│   ├── chico-favicon-32.png    64×44  (browser favicon, 1.45:1 — old stack aspect)
│   ├── chico-favicon-64.png    64×69  (Retina favicon, 0.927:1 — new logo aspect)
│   ├── chico-favicon-192.png   192×207 (Android Chrome)
│   ├── chico-favicon-512.png   512×552 (App icon)
│   └── chico-favicon-3000.png  3000×3234 (master 1x, kept for future re-export)
│
├── ice-cream-bike/             ← used only by ice-cream-bike.html
│   ├── hero/                   ← only 2 real trike shots today; rotation script at bottom of the page cycles them
│   │   ├── 01-at-event.jpg
│   │   └── 02-launch.jpg
│   │
│   ├── flavours/               ← one AI scoop per always-on flavour, 1:1 with .bike-flavours__list
│   │   ├── 01-vanilla.jpg
│   │   ├── 02-mango.jpg
│   │   ├── 03-strawberry.jpg
│   │   ├── 04-chocolate.jpg
│   │   └── 05-bubblegum.jpg
│   │
│   └── extras/                 ← add-on photography
│       └── 01-branded-cups.jpg
│
├── story/                      ← used by index.html #story segment 4
│   └── 04-cafe-in-moody-weather.jpg
│
├── press/                      ← used by index.html #neighbours section
│   └── group-theboltonnews-6people.jpg
│
└── menu/                       ← used by menu.html (31 dish images)
    ├── breakfast-platter.jpg   full English / desi / veggie / stacker
    ├── bagels-muffins.jpg      bap / muffin / egg-cheese muffin
    ├── american-special.jpg    pancakes-bacon plate / eggs-benedict / omelette / stir-fry
    ├── pancakes.jpg            pancakes (sole perfect match)
    ├── sourdough-toast.jpg     sourdough / toasties / halloumi salad / vegan breakfast
    ├── subs-burgers.jpg        signature-subs / spuds (4 dishes share)
    ├── yogurt-parfait.jpg      french-toast / kids-meal
    ├── drinks-branded-cups.jpg 8 drinks share (teas, coffees, juices)
    └── hot-chocolate.jpg       hot chocolate (sole perfect match)

food/                          ← (currently uncatalogued) shots that were mislabelled
    ├── 01-atlas-coffee-and-book.jpg       was DLE-wuTIdBf_1.jpg, NOT a trike
    ├── 02-smoked-salmon-toast.jpg        was C9kOL3SoAnC_1.jpg, NOT a trike
    └── 03-full-english-breakfast.jpg     was C_xc8sWINNf_1.jpg, NOT a trike
```

### Logo aspect change (Aug 2026)

The main `chico-logo-{light,dark}.png` files used to be 1500×1024 (1.47:1) — but the visible content was only a 1398×1510 island inside that canvas, with ~33% transparent padding. The brand mark looked tiny wherever the CSS constrained the image to a fixed height or width.

Fix: re-upscaled to 3000×2048, then **cropped to the true content bbox** so the saved file is now 1426×1538 (0.927:1). HTML `width=`/`height=` attributes updated across all pages; footer logos updated from 120×82 to 120×130. The visible logo now fills its bounding box correctly on the nav, hero, story dividers, social-media watermark, and footer.

The old `chico-stack-*` and `chico-text-*` variants haven't been through the same crop pass yet — they're still on the 1.47:1 aspect. If they ever appear in the page, do the same crop → re-export before referencing.

## Conventions

- **Numbered prefix** inside buckets (`01-`, `02-`, ...) — the prefix matches the order in the page that uses the file. Reorder the prefix, the order on the page does not change until you reorder the HTML/JS.
- **No hash filenames** in this tree. If you need to bring in a new IG shot, name it (e.g. `06-trike-evening.jpg`).
- **Always update `INDEX.json`** when you add, swap, or delete a file. The manifest is the source of truth for which file is which and where it came from.
- **Page references point here, not to `../photos/`.** If you find a page still pointing at `../photos/social/instagram/curated/...` or `../photos/catering/...`, it is a leftover from before the refactor and should be migrated.

## Page → folder mapping (current)

| Page | Logo | Hero | Other |
|---|---|---|---|
| `index.html` | `logo/*` | n/a | uses `../photos/candidates/`, `../social/instagram/curated/`, `../raw/menu-items/`, `../instagram/`, `../press/` for social grid; uses `story/04-cafe-in-moody-weather.jpg` for story segment 4; uses `press/group-theboltonnews-6people.jpg` for the new `#neighbours` section — **partial migration, see Stage 2** |
| `menu.html` | `logo/*` | n/a | data-driven from `__menuData__` JSON, images now at `menu/*` (9 real photos covering 31 dishes) — **migrated ✓ (Aug 2026 quick fix)** |
| `ice-cream-bike.html` | `logo/*` | `ice-cream-bike/hero/*` (only 2 today) | `ice-cream-bike/flavours/*`, `ice-cream-bike/extras/*` — **migrated ✓** |
| `catering.html` | `logo/*` | n/a | uses `../photos/catering/`, `../social/instagram/curated/` — **not yet migrated, see Stage 2** |
| `party-room.html` | `logo/*` | n/a | uses `../photos/party-room/`, `../social/instagram/` — **not yet migrated, see Stage 2** |

## Stage 2 — migration backlog (not yet done)

When another agent (or a future session) gets to the rest, the work is:

1. **`home/`** — bucket index.html's 42 image references:
   - `cover/` (1 cover interior)
   - `interior/` (4 candidates interior shots)
   - `food/` (5 candidates food shots)
   - `social-tiles/` (~10 curated social tiles)
   - `press/` (1 press portrait)
2. **`menu/`** — restructure `__menuData__` in menu.html so image paths are relative to a new `menu/` bucket, and the 3D viewer + 6 menu grids pick up the new paths. Currently the JSON hardcodes `../raw/menu-items/*.webp` which is a dead path — this is the source of the visible "image broken" bug on the live page.
3. **`catering/`** — 6 AI platters + 1 hero + 3 social-proof → bucket.
4. **`party-room/`** — 4 AI panels + 1 hero + 4 social-proof → bucket.
5. **`shared/`** — any image used across two or more pages goes here (e.g. the trike shots reused on index.html and ice-cream-bike.html). After the home migration, at least 3 of the 5 ice-cream-bike hero shots will be referenced from `shared/trike/` instead of `ice-cream-bike/hero/`.
6. After Stage 2 is done, **`../photos/` becomes read-only source archive**. Add a `.gitattributes` or a top-level `assets/photos/README.md` enforcing it.

## Working with this tree

To replace a file:

```bash
# Edit the file however you like. site-images is a regular folder.
# If you replace a logo, also update the .nav/footer width="..." height="..." in every page
# so layout shift doesn't trigger CLS warnings.
```

To add a new image:

1. Drop the file into the right bucket with the next available `NN-` prefix.
2. Add an entry to `INDEX.json` with the source path.
3. Reference it from the page using a relative path: `assets/site-images/ice-cream-bike/hero/06-name.jpg`.

To bulk-recompress a bucket (e.g. before launch):

```bash
# All files here are JPEGs/PNGs, no raw originals to lose.
# Use sips, ImageMagick, or similar; just don't overwrite the source under ../photos/.
```
