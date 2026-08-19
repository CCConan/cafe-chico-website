#!/usr/bin/env python3
"""Process group photo from Bolton News screenshot.

Source: 739 x 1600 (portrait iPhone screenshot of theboltonnews.co.uk)

Layout (verified by direct read):
  y=  0..  70 : iOS status bar (dark)
  y= 70.. 200 : browser nav (Foodhub, social, X)
  y=200.. 640 : empty dark padding
  y=640.. 900 : article photo (6 people)  <- KEEP
  y=900..1170 : thumbnail + caption + "1/9" + "Hide caption"
  y=1170..1560: empty + Safari URL bar
  y=1560..1600: iOS home indicator

White ">" arrow is at approximately original (625,690)-(700,770) -
right edge of the photo, on the brick wall, ABOVE-RIGHT of the rightmost
woman. After our (0,640,739,900) crop this maps to cropped (625,50)-(700,130).
"""
from PIL import Image, ImageFilter, ImageDraw
import statistics
import os

SRC = "source-group-739x1600.jpg"
DST = "group-theboltonnews-6people.jpg"

img = Image.open(SRC).convert("RGB")
w, h = img.size
print(f"Source: {w} x {h}")

# Step 1: Crop the article photo (6 people) only.
TOP = 640
BOT = 900
img = img.crop((0, TOP, 739, BOT))
w2, h2 = img.size
print(f"After chrome crop: {w2} x {h2}")

# Step 2: Hardcode the white ">" arrow location (verified visually).
# The ">" arrow is a SMALL ">" chevron, ~25 px wide, ~50 px tall,
# located at approximately original (635, 700)-(665, 755) on the
# brick wall above the rightmost woman's head.
# After the (0, 640, 739, 900) crop this is cropped (635, 60)-(665, 115).
ax0, ay0, ax1, ay1 = 615, 40, 705, 130
print(f"Arrow bbox (cropped, hardcoded): ({ax0},{ay0})-({ax1},{ay1})")

# Step 3: Sample brick wall colour from a small pure-wall area
# IMMEDIATELY to the LEFT of the arrow (so the texture matches).
sample = []
for sy in range(ay0 - 2, ay1 + 2, 1):
    for sx in range(570, 625, 1):
        if 0 <= sx < w2 and 0 <= sy < h2:
            sample.append(img.getpixel((sx, sy)))
avg = tuple(int(statistics.mean(c[i] for c in sample)) for i in range(3))
print(f"Sampled wall colour: {avg}")

# Step 4: Paint the arrow region with the sampled wall colour.
# Use NO blur — the fill colour is already very close to the surrounding
# wall, and a blur tends to over-paint neighbours (e.g. the woman's hair).
draw = ImageDraw.Draw(img)
draw.rectangle([ax0, ay0, ax1, ay1], fill=avg)
print("Arrow removed (sharp fill, no blur).")

# Step 4: Upscale to 720P (long side 1280px).
TARGET_LONG = 1280
ratio = w2 / h2
if w2 >= h2:
    new_w = TARGET_LONG
    new_h = int(TARGET_LONG / ratio)
else:
    new_h = TARGET_LONG
    new_w = int(TARGET_LONG * ratio)
img = img.resize((new_w, new_h), Image.LANCZOS)
print(f"Upscaled: {new_w} x {new_h}")

img.save(DST, "JPEG", quality=92, optimize=True)
print(f"Saved: {DST}  ({os.path.getsize(DST) // 1024} KB)")
