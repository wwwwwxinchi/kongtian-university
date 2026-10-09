"""Import supplied front/back PNGs without altering artwork. Requires Pillow."""
import argparse
import base64
import io
import json
from pathlib import Path
import zipfile

from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--undergraduate', type=Path, required=True)
parser.add_argument('--graduate', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
target = root / 'campus-card/assets.js'
source = target.read_text(encoding='utf-8')
assets = json.loads(source.split('window.CAMPUS_ASSETS = ', 1)[1].strip().removesuffix(';'))
for path, front_key, back_key in (
    (args.undergraduate, 'cardUndergrad', 'cardBackUndergrad'),
    (args.graduate, 'cardGraduate', 'cardBackGraduate'),
):
    with zipfile.ZipFile(path) as archive:
        for entry, key in (('1.png', front_key), ('2.png', back_key)):
            data = archive.read(entry)
            image = Image.open(io.BytesIO(data))
            if image.format != 'PNG' or image.size != (2000, 1266):
                raise ValueError(f'{path.name}/{entry}: expected 2000x1266 PNG')
            image.load()
            # The two supplied backs have the same design (18 near-identical pixels
            # differ). Use the undergraduate ZIP's back as the shared original.
            if entry == '1.png' or path == args.undergraduate:
                destination = key if entry == '1.png' else 'cardBack'
                assets[destination] = {'src': 'data:image/png;base64,' + base64.b64encode(data).decode('ascii'),
                                       'x': 0, 'y': 0, 'w': image.width, 'h': image.height}
            if path == args.undergraduate:
                side = 'front' if entry == '1.png' else 'back'
                image.convert('RGB').resize((1016, 638), Image.Resampling.LANCZOS).save(
                    root / f'assets/campus-card-{side}.webp', quality=90, method=6)
assets.pop('cardBackUndergrad', None)
assets.pop('cardBackGraduate', None)
target.write_text('/* Provided artwork; template PNG bytes preserved from supplied ZIPs. */\n'
                  + 'window.CAMPUS_ASSETS = ' + json.dumps(assets, ensure_ascii=False, separators=(',', ':'))
                  + ';\n', encoding='utf-8')
print('Imported both fronts and the shared back; updated homepage display images.')
