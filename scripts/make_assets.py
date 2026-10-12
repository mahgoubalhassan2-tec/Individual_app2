#!/usr/bin/env python3
"""Create the portfolio icons and project artwork."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1] / "assets"


def first_existing(*paths: str) -> str:
    for path in paths:
        if Path(path).exists():
            return path
    raise FileNotFoundError("None of the expected fonts were found.")


SERIF = first_existing(
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
    r"C:\Windows\Fonts\georgiab.ttf",
)
SANS = first_existing(
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    r"C:\Windows\Fonts\segoeuib.ttf",
)
SANS_REG = first_existing(
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
)

INK = (20, 12, 18, 255)
PAPER = (20, 12, 18, 255)
TERRACOTTA = (255, 107, 87, 255)
CREAM = (248, 243, 246, 255)
OLIVE = (212, 184, 200, 255)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def centered(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, box, fill) -> None:
    left, top, right, bottom = box
    bbox = draw.textbbox((0, 0), text, font=face)
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    x = left + (right - left - width) / 2 - bbox[0]
    y = top + (bottom - top - height) / 2 - bbox[1]
    draw.text((x, y), text, font=face, fill=fill)


def icon(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), INK)
    draw = ImageDraw.Draw(image)
    margin = int(size * 0.12)
    draw.rounded_rectangle(
        (margin, margin, size - margin, size - margin),
        radius=int(size * 0.08),
        outline=TERRACOTTA,
        width=max(4, size // 48),
    )
    centered(draw, "MAAA", font(SERIF, int(size * 0.16)), (0, int(size * 0.28), size, int(size * 0.62)), CREAM)
    centered(draw, "PORTFOLIO", font(SANS, int(size * 0.045)), (0, int(size * 0.62), size, int(size * 0.74)), TERRACOTTA)
    return image


def foreground(size: int = 1024) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    centered(draw, "MAAA", font(SERIF, 180), (180, 340, 844, 620), CREAM)
    centered(draw, "PORTFOLIO", font(SANS, 42), (180, 600, 844, 700), TERRACOTTA)
    return image


def monochrome(size: int = 1024) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    centered(draw, "MAAA", font(SERIF, 180), (180, 380, 844, 680), (255, 255, 255, 255))
    return image


def avatar() -> Image.Image:
    size = 900
    image = Image.new("RGBA", (size, size), INK)
    draw = ImageDraw.Draw(image)
    centered(draw, "MAAA", font(SERIF, 148), (48, 250, size - 48, 520), CREAM)
    centered(draw, "CLOUD", font(SANS, 36), (48, 500, size - 48, 640), TERRACOTTA)
    return image


def monogram_piece() -> Image.Image:
    image = Image.new("RGBA", (1200, 860), INK)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 1200, 18), fill=TERRACOTTA)
    draw.rectangle((48, 70, 1152, 790), outline=TERRACOTTA, width=3)
    centered(draw, "MAAA", font(SERIF, 210), (80, 180, 1120, 520), CREAM)
    centered(draw, "MAHGOUB ADIL AHMED ALHASSN", font(SANS, 28), (80, 540, 1120, 620), TERRACOTTA)
    centered(draw, "Automation, Python, and cloud engineering", font(SANS_REG, 26), (80, 640, 1120, 720), OLIVE)
    return image


def poster_piece() -> Image.Image:
    image = Image.new("RGBA", (1200, 860), INK)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 46, 860), fill=TERRACOTTA)
    draw.text((90, 80), "CLOUD", font=font(SANS, 28), fill=TERRACOTTA)
    draw.text((90, 180), "Studio", font=font(SERIF, 120), fill=CREAM)
    draw.text((90, 320), "Poster", font=font(SERIF, 120), fill=CREAM)
    draw.rectangle((90, 500, 360, 512), fill=TERRACOTTA)
    body = "A type study that stays readable\nas a poster and as a square crop."
    draw.multiline_text((90, 560), body, font=font(SANS_REG, 32), fill=CREAM, spacing=10)
    draw.text((90, 760), "MAAA  ·  2026", font=font(SANS, 24), fill=TERRACOTTA)
    return image


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    icon(1024).save(ROOT / "icon.png")
    icon(48).save(ROOT / "favicon.png")
    icon(512).save(ROOT / "splash-icon.png")
    foreground().save(ROOT / "android-icon-foreground.png")
    Image.new("RGBA", (1024, 1024), INK).save(ROOT / "android-icon-background.png")
    monochrome().save(ROOT / "android-icon-monochrome.png")
    avatar().save(ROOT / "avatar.png")
    monogram_piece().save(ROOT / "project-monogram.png")
    poster_piece().save(ROOT / "project-poster.png")
    print("assets written")


if __name__ == "__main__":
    main()
