"""t77 2D sprite vs 3D render comparison sheet. python3 sheet.py out.png title renderdir unit_marine_0,...  (sprite = v3/<unit>_<tier>.webp)"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, title, rdir, names = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(',')
cols = int(sys.argv[5]) if len(sys.argv) > 5 else 3
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
T = 300; rows = (len(names) + cols - 1) // cols
FP = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
F = ImageFont.truetype(FP, 15) if os.path.exists(FP) else None
W = cols * (2 * T + 20) + 20; H = rows * (T + 30) + 50
c = Image.new('RGBA', (W, H), (28, 30, 34, 255)); d = ImageDraw.Draw(c); d.text((20, 12), title, fill=(240, 200, 90), font=F)
def fit(p):
    im = Image.open(p).convert('RGBA'); bb = im.getbbox(); im = im.crop(bb) if bb else im
    s = min((T - 10) / im.width, (T - 10) / im.height); return im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
for i, n in enumerate(names):
    x = 20 + (i % cols) * (2 * T + 20); y = 45 + (i // cols) * (T + 30)
    d.rectangle([x, y, x + 2 * T, y + T], fill=(70, 74, 80, 255))
    spr = n[5:] if n.startswith('unit_') else n
    for j, p in enumerate((os.path.join(REPO, 'public/assets/v3', spr + '.webp'), os.path.join(rdir, n + '.png'))):
        im = fit(p); c.alpha_composite(im, (x + j * T + (T - im.width) // 2, y + (T - im.height) // 2))
    d.text((x + 4, y + T + 4), f'{spr}: 2D sprite | 3D GLB', fill=(220, 220, 220), font=F)
c.convert('RGB').save(out)
