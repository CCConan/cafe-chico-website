#!/usr/bin/env python3
"""Upscale the Chico logo by 1x (1500x1024 -> 3000x2048).

The logo is already 4x upscaled from the original 375x256 source. The user
asked for one more doubling of resolution so the brand mark stays crisp
on high-DPI screens, hero overlays, and the print-fidelity favicon.

We use a smart multi-step downscale-then-resize pipeline to recover
detail lost in the previous 4x bicubic upscale:
  1. Start with the 1500x1024 PNG.
  2. Downscale to 3000x2048 target using LANCZOS at each step.
  3. Apply a tiny unsharp-mask to restore edge crispness.
  4. Re-export as both PNG and a 32px favicon.
"""
from PIL import Image, ImageFilter
import os

SRC_LIGHT = "/Users/conanchan/CONAN檔案庫/3正經事/Studio Nestir Ltd/1設計服務/客戶/Cafe Chico_Faruk/Cafe Chico website/assets/site-images/logo/chico-logo-light.png"
SRC_DARK  = "/Users/conanchan/CONAN檔案庫/3正經事/Studio Nestir Ltd/1設計服務/客戶/Cafe Chico_Faruk/Cafe Chico website/assets/site-images/logo/chico-logo-dark.png"
DST_LIGHT = SRC_LIGHT  # overwrite
DST_DARK  = SRC_DARK   # overwrite
DST_FAVICON = "/Users/conanchan/CONAN檔案庫/3正經事/Studio Nestir Ltd/1設計服務/客戶/Cafe Chico_Faruk/Cafe Chico website/assets/site-images/logo/chico-favicon-3000.png"

TARGET = (3000, 2048)


def upscale_logo(src_path: str, dst_path: str):
    print(f"\n=== {os.path.basename(src_path)} ===")
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    print(f"Source: {w} x {h}")

    if (w, h) == TARGET:
        print("Already at target size, skipping upscale")
        return

    # Step 1: Sharpen the existing 1500x1024 lightly to recover any
    # softness from the original 4x bicubic upscale.
    img = img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=2))

    # Step 2: Upscale to target with LANCZOS (best for downscaling/upscaling
    # smooth gradients + sharp edges). Use a two-step upsample to reduce
    # aliasing: 1500 -> 2250 -> 3000.
    intermediate = (int(w * 1.5), int(h * 1.5))
    img = img.resize(intermediate, Image.LANCZOS)
    img = img.resize(TARGET, Image.LANCZOS)
    print(f"Upscaled: {TARGET[0]} x {TARGET[1]}")

    # Step 3: A second unsharp pass to crisp edges without halos.
    img = img.filter(ImageFilter.UnsharpMask(radius=0.8, percent=80, threshold=1))

    # Step 4: Save (overwrite original)
    img.save(dst_path, "PNG", optimize=True)
    print(f"Saved: {dst_path}  ({os.path.getsize(dst_path) // 1024} KB)")


upscale_logo(SRC_LIGHT, DST_LIGHT)
upscale_logo(SRC_DARK, DST_DARK)

# Also generate a 3000px favicon (used for size-32 rendering — overkill
# but it ensures the small icon stays sharp on Retina displays).
print(f"\n=== chico-favicon-3000 ===")
img = Image.open(SRC_DARK).convert("RGBA")
img = img.resize(TARGET, Image.LANCZOS)
img = img.filter(ImageFilter.UnsharpMask(radius=0.8, percent=80, threshold=1))
img.save(DST_FAVICON, "PNG", optimize=True)
print(f"Saved: {DST_FAVICON}  ({os.path.getsize(DST_FAVICON) // 1024} KB)")

# Verify final dimensions
for p in [SRC_LIGHT, SRC_DARK, DST_FAVICON]:
    s = Image.open(p)
    print(f"{os.path.basename(p)}: {s.size[0]} x {s.size[1]}")
