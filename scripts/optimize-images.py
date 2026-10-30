#!/usr/bin/env python3
"""
Generates web derivatives from the untouched originals in assets/originals/.

  python3 scripts/optimize-images.py

Outputs
  public/images/<name>-<width>.webp   responsive widths for every original that
                                      is not prefixed "unused-"
  src/app/opengraph-image.jpg         1200x630 social card
  src/app/icon.png, apple-icon.png    typographic favicon

Originals are never modified. EXIF orientation is applied before resizing and
no colour, contrast or retouching filters are used, so the tattoos keep their
original appearance. Re-run after adding or replacing a photo.

Requires: Pillow, fonttools, brotli  (pip install pillow fonttools brotli)
"""
from __future__ import annotations

import io
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "originals"
OUT = ROOT / "public" / "images"
APP = ROOT / "src" / "app"
FONT = APP / "fonts" / "archivo-variable.woff2"

# Keep in sync with IMAGE_WIDTHS in src/lib/image-loader.ts
WIDTHS = [480, 800, 1200]
QUALITY = 80

INK = (17, 17, 16)
IVORY = (241, 237, 228)
GRAY = (162, 159, 152)
OXBLOOD = (112, 45, 50)


def load(path: Path) -> Image.Image:
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)  # honour EXIF orientation
    return im.convert("RGB")


def derivatives() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for path in sorted(SRC.glob("*.jpg")):
        if path.stem.startswith("unused-"):
            continue
        im = load(path)
        for w in WIDTHS:
            # Never upscale: the largest derivative is capped at the original width.
            target = min(w, im.width)
            h = round(im.height * target / im.width)
            resized = im if target == im.width else im.resize((target, h), Image.LANCZOS)
            dest = OUT / f"{path.stem}-{w}.webp"
            resized.save(dest, "WEBP", quality=QUALITY, method=6)
        print(f"  {path.stem}: {im.width}x{im.height}")


def font(weight: int, width: int, size: int) -> ImageFont.FreeTypeFont:
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont

    tt = TTFont(str(FONT))
    inst = instantiateVariableFont(tt, {"wght": weight, "wdth": width})
    buf = io.BytesIO()
    inst.flavor = None
    inst.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, size)


def og_image() -> None:
    W, H = 1200, 630
    card = Image.new("RGB", (W, H), INK)
    photo = load(SRC / "phoenix-blossoms-thigh.jpg")
    ph = H
    pw = round(photo.width * ph / photo.height)
    card.paste(photo.resize((pw, ph), Image.LANCZOS), (W - pw, 0))

    d = ImageDraw.Draw(card)
    display = font(800, 62, 150)
    small = font(500, 100, 22)
    d.text((64, 60), "LAS VEGAS, NEVADA", font=small, fill=GRAY)
    d.text((60, 120), "YOUR STORY.", font=display, fill=IVORY)
    d.text((60, 270), "IN INK.", font=display, fill=IVORY)
    d.rectangle((64, 470, 64 + 48, 472), fill=OXBLOOD)
    d.text((64, 500), "INKBYCAZ", font=font(800, 62, 44), fill=IVORY)
    d.text((64, 556), "@ink.by.caz", font=small, fill=GRAY)
    card.save(APP / "opengraph-image.jpg", "JPEG", quality=86, optimize=True)
    print("  opengraph-image.jpg")


def icons() -> None:
    for name, size in (("icon.png", 512), ("apple-icon.png", 180)):
        im = Image.new("RGB", (size, size), INK)
        d = ImageDraw.Draw(im)
        f = font(800, 62, round(size * 0.78))
        text = "IC"
        box = d.textbbox((0, 0), text, font=f)
        tw, th = box[2] - box[0], box[3] - box[1]
        d.text(((size - tw) / 2 - box[0], (size - th) / 2 - box[1] - size * 0.02), text, font=f, fill=IVORY)
        bar = round(size * 0.06)
        d.rectangle((0, size - bar, size, size), fill=OXBLOOD)
        im.save(APP / name, "PNG", optimize=True)
        print(f"  {name}")


if __name__ == "__main__":
    print("Derivatives")
    derivatives()
    print("Social + icons")
    og_image()
    icons()
