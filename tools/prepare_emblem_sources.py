"""Create small, lossless-proportion previews of the supplied 8K emblem sources."""

from pathlib import Path

from PIL import Image, ImageOps, ImageDraw


SOURCE_DIR = Path(r"D:\esorakodo\校徽 正式版")
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "assets" / "faculty-emblems" / "source-previews"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(SOURCE_DIR.glob("*.png"))
    if not files:
        raise SystemExit(f"No PNG sources found in {SOURCE_DIR}")

    thumbs: list[tuple[str, Image.Image]] = []
    for index, source in enumerate(files, start=1):
        with Image.open(source) as image:
            image = image.convert("RGBA")
            preview = ImageOps.contain(image, (960, 960), Image.Resampling.LANCZOS)
            out = OUTPUT_DIR / f"source-{index:02d}.png"
            preview.save(out, optimize=True)
            thumbs.append((source.name, preview.copy()))

    cell = 520
    sheet = Image.new("RGB", (cell * 2, cell * 2), "#eef3f7")
    draw = ImageDraw.Draw(sheet)
    for idx, (name, preview) in enumerate(thumbs):
        preview.thumbnail((460, 460), Image.Resampling.LANCZOS)
        x = (idx % 2) * cell + (cell - preview.width) // 2
        y = (idx // 2) * cell + 28
        bg = Image.new("RGBA", preview.size, "white")
        bg.alpha_composite(preview)
        sheet.paste(bg.convert("RGB"), (x, y))
        draw.text(((idx % 2) * cell + 18, (idx // 2) * cell + 6), f"{idx + 1:02d}  {name}", fill="#123b5a")
    sheet.save(OUTPUT_DIR / "contact-sheet.png", compress_level=6)


if __name__ == "__main__":
    main()
