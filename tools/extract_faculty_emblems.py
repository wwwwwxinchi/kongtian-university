"""Extract the 16 faculty pictograms and the central seal from the official 8K artwork.

The script only crops and derives transparency from the original pixels. It never
stretches, redraws, or AI-generates an emblem. Re-run it whenever the source
artwork is replaced with a newer official export.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import numpy as np
from scipy import ndimage


SOURCE = Path(r"D:\esorakodo\校徽 正式版\微信图片_20260425132343_624_2364.png")
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "faculty-emblems"
RAW_DIR = OUTPUT / "raw"
WEB_DIR = OUTPUT / "web"
CENTER_DIR = OUTPUT / "center"


@dataclass(frozen=True)
class Faculty:
    slug: str
    name: str
    preview_center: tuple[float, float]
    preview_crop: float


FACULTIES = (
    Faculty("bio", "生物学院", (485, 97), 120),
    Faculty("finance", "金融与经济学院", (616, 97), 140),
    Faculty("law", "律衡学院", (746, 187), 130),
    Faculty("education", "教育学院", (848, 312), 130),
    Faculty("literature", "文学院", (868, 470), 130),
    Faculty("history", "历史学院", (834, 625), 140),
    Faculty("physics", "物理学院", (756, 740), 130),
    Faculty("engineering", "工程学院", (630, 832), 130),
    Faculty("agriculture", "农学院", (479, 856), 122),
    Faculty("medicine", "医学院", (329, 839), 140),
    Faculty("field", "万有能场研究院", (201, 766), 150),
    Faculty("military", "军事学院", (120, 624), 140),
    Faculty("mystic", "玄学院", (92, 478), 120),
    Faculty("arts", "艺术学院", (123, 328), 140),
    Faculty("arcana", "阿尔卡纳学院", (214, 203), 130),
    Faculty("chemistry", "化学与材料学院", (334, 107), 130),
)


def transparent_white_lines(crop: Image.Image) -> Image.Image:
    """Keep the source's white line work and remove its blue background."""
    rgba = np.asarray(crop.convert("RGBA"), dtype=np.int16)
    rgb = rgba[..., :3]
    brightness = rgb.min(axis=2)
    neutral = 255 - (rgb.max(axis=2) - rgb.min(axis=2))
    alpha = np.clip((brightness - 126) * 2.25, 0, 255)
    alpha = alpha * np.clip(neutral - 70, 0, 185) / 185
    alpha = np.minimum(alpha, rgba[..., 3]).astype(np.uint8)
    output = np.full(rgba.shape, 255, dtype=np.uint8)
    output[..., 3] = alpha
    return Image.fromarray(output, "RGBA")


def remove_neighboring_ring_artifacts(icon: Image.Image) -> Image.Image:
    """Drop detached pieces of the university seal's neighboring circular rules."""
    alpha = np.asarray(icon.getchannel("A"), dtype=np.uint8)
    labels, count = ndimage.label(alpha > 18, structure=np.ones((3, 3), dtype=np.uint8))
    height, width = alpha.shape
    keep = np.zeros_like(alpha, dtype=bool)
    center_x, center_y = width / 2, height / 2
    edge = 1

    for label_id in range(1, count + 1):
        ys, xs = np.where(labels == label_id)
        if not len(xs):
            continue
        touches_edge = (
            xs.min() <= edge or ys.min() <= edge or
            xs.max() >= width - edge - 1 or ys.max() >= height - edge - 1
        )
        distance = math_hypot(float(xs.mean()) - center_x, float(ys.mean()) - center_y)
        central = distance <= min(width, height) * 0.36
        if not touches_edge and central:
            keep[labels == label_id] = True

    cleaned = np.asarray(icon).copy()
    cleaned[..., 3] = np.where(keep, alpha, 0)
    return Image.fromarray(cleaned, "RGBA")


def math_hypot(x: float, y: float) -> float:
    return float((x * x + y * y) ** 0.5)


def keep_central_disc(icon: Image.Image, radius_ratio: float = 0.43) -> Image.Image:
    """Keep the central pictogram while excluding nearby orbital rules."""
    rgba = np.asarray(icon).copy()
    height, width = rgba.shape[:2]
    yy, xx = np.ogrid[:height, :width]
    radius = min(width, height) * radius_ratio
    disc = (xx - width / 2) ** 2 + (yy - height / 2) ** 2 <= radius ** 2
    rgba[..., 3] = np.where(disc, rgba[..., 3], 0)
    return Image.fromarray(rgba, "RGBA")
def crop_square(image: Image.Image, cx: float, cy: float, size: int) -> Image.Image:
    half = size // 2
    return image.crop((round(cx - half), round(cy - half), round(cx + half), round(cy + half)))


def make_contact_sheet(items: list[tuple[Faculty, Image.Image]]) -> None:
    cell_w, cell_h = 360, 410
    sheet = Image.new("RGB", (cell_w * 4, cell_h * 4), "#eef4f8")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("msyh.ttc", 24)
    except OSError:
        font = ImageFont.load_default()

    for index, (faculty, icon) in enumerate(items):
        x = (index % 4) * cell_w
        y = (index // 4) * cell_h
        medallion = Image.new("RGBA", (270, 270), "#123b5a")
        scaled = ImageOps.contain(icon, (216, 216), Image.Resampling.LANCZOS)
        medallion.alpha_composite(scaled, ((270 - scaled.width) // 2, (270 - scaled.height) // 2))
        sheet.paste(medallion.convert("RGB"), (x + 45, y + 28))
        draw.text((x + 20, y + 324), f"{index + 1:02d}  {faculty.name}", fill="#123b5a", font=font)
    sheet.save(OUTPUT / "faculty-emblems-contact-sheet.png", optimize=True)


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Official emblem source not found: {SOURCE}")
    for directory in (RAW_DIR, WEB_DIR, CENTER_DIR):
        directory.mkdir(parents=True, exist_ok=True)

    with Image.open(SOURCE) as original:
        source = original.convert("RGBA")
        if source.width != source.height:
            raise SystemExit("The official emblem source must remain square.")

        side = source.width
        center = side / 2
        web_items: list[tuple[Faculty, Image.Image]] = []

        for index, faculty in enumerate(FACULTIES):
            cx = side * faculty.preview_center[0] / 960
            cy = side * faculty.preview_center[1] / 960
            crop_size = round(side * faculty.preview_crop / 960)
            raw = crop_square(source, cx, cy, crop_size)
            raw_path = RAW_DIR / f"{index + 1:02d}-{faculty.slug}.png"
            raw.save(raw_path, compress_level=6)

            transparent = transparent_white_lines(raw)
            if faculty.slug in {"education", "physics", "field"}:
                transparent = keep_central_disc(transparent, 0.45)
            else:
                transparent = remove_neighboring_ring_artifacts(transparent)
            web_path = WEB_DIR / f"{index + 1:02d}-{faculty.slug}.png"
            transparent.save(web_path, compress_level=6)
            web_items.append((faculty, transparent))

        # The crop follows the double-line boundary of the central seal and
        # excludes the complete outer faculty-icon ring.
        center_size = round(side * (636 / 960))
        central = crop_square(source, center, center, center_size)
        central.save(CENTER_DIR / "university-seal-center.png", compress_level=6)

        # A transparent circular presentation asset, still at native crop size.
        circular = central.copy()
        mask = Image.new("L", circular.size, 0)
        ImageDraw.Draw(mask).ellipse((0, 0, circular.width - 1, circular.height - 1), fill=255)
        alpha = np.asarray(circular.getchannel("A"), dtype=np.uint16)
        circle_alpha = np.asarray(mask, dtype=np.uint16)
        circular.putalpha(Image.fromarray((alpha * circle_alpha // 255).astype(np.uint8), "L"))
        circular.save(CENTER_DIR / "university-seal-center-circle.png", compress_level=6)

        make_contact_sheet(web_items)
if __name__ == "__main__":
    main()
