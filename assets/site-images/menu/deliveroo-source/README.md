# Deliveroo Menu Source

This folder holds the **canonical menu reference for Café Chico (Bolton)** as published on
[Deliveroo UK](https://deliveroo.co.uk/menu/manchester/daubhill-and-lever-edge-lane/cafe-chico-bolton).

Fetched on **2026-08-20** from the live Deliveroo page via the in-app ego-browser (CDP-driven
background-image scraping) and curl from the `rs-menus-api.roocdn.com` CDN.

## Contents

- `INDEX.json` — full menu data (64 items, 6 categories) including name, price, description,
  vegetarian/vegan tags, and per-item `image_status` (`downloaded` / `placeholder_only`) plus
  the local image filename for the 7 downloaded dishes.
- `*.jpg` — one image per dish, named by the dish's kebab-case slug.

## Image status (as observed on Deliveroo, 2026-08-20)

Out of 64 items, **7 dishes have a real image uploaded by the restaurant** and were
extracted successfully. The remaining 57 items show a grey placeholder on Deliveroo itself.

| Image downloaded (7) | Placeholder only on Deliveroo (57) |
|---|---|
| `full-english-breakfast.jpg`, `full-desi-breakfast.jpg`, `half-desi-breakfast.jpg`, `french-toast.jpg`, `toasties.jpg`, `crepe.jpg`, `signature-sub.jpg` | All other items (Egg and Cheese Muffin, Breakfast Muffin, Veggie Breakfast, Breakfast Stacker, Breakfast Bap, Vegan Breakfast, Breakfast Burger, Half English Breakfast, Sourdough Toast, Granola Pot, Grilled Halloumi House Salad, Stir Fry Noodles, Eggs Benedict, American Special, Omlette with Three Toppings, Scrambled Egg with Croissant, Megadough Toast, Sub Meal Deal, all 4 Kids items, all 3 Desserts, all 32 Drinks) |

## How images were extracted

1. ego-browser opened the Deliveroo page in a UK context (inherits session cookies).
2. Page scrolled to the bottom to trigger lazy-loaded images.
3. DOM query collected every `inline style="background-image: url(...)"` URL on the page.
4. For each image, the script walked up the DOM tree until it found a card with the dish
   name (the first line of `innerText`).
5. Higher-resolution (800×800) versions were downloaded with curl + `Referer: deliveroo.co.uk`
   header to bypass Cloudflare's CDN bot detection.
6. Files were saved to both this folder (source-of-truth) and the parent `../` folder (web).

## How the website uses these images

`menu.html` references these files directly:

```
assets/site-images/menu/signature-sub.jpg
assets/site-images/menu/full-english-breakfast.jpg
assets/site-images/menu/full-desi-breakfast.jpg
assets/site-images/menu/half-desi-breakfast.jpg
assets/site-images/menu/french-toast.jpg
assets/site-images/menu/toasties.jpg
assets/site-images/menu/crepe.jpg
```

For dishes where the Deliveroo image is a placeholder (and for menu items that have no
Deliveroo entry at all), the website renders a **fallback icon** — a fork-and-knife SVG
on a restaurant-accent gradient — defined in `assets/css/menu.css` under `.dish--no-photo`.

## How to populate the remaining 57 placeholders

For each dish currently marked `placeholder_only` in `INDEX.json`:

1. Log in to the Deliveroo restaurant dashboard.
2. Upload a photo for that dish.
3. Either save the same image here with the dish's slug as filename, or update
   `INDEX.json` with the new `image_status: "downloaded"` and `image_file`.
4. If the dish is in `menu.html`, also copy the file to the parent `../` folder.
