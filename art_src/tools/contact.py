import os, json, sys
from PIL import Image, ImageDraw
D = 'public/assets/v3'; M = json.load(open('src/render/art.manifest.json'))
keys = sorted(M); cols = 10; cw = 150
rows = (len(keys) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, rows * (cw + 16)), (96, 120, 80))
dr = ImageDraw.Draw(sheet)
for i, k in enumerate(keys):
    im = Image.open(f'{D}/{k}.webp').convert('RGBA'); im.thumbnail((cw - 8, cw - 8))
    x, y = (i % cols) * cw, (i // cols) * (cw + 16)
    sheet.paste(im, (x + (cw - im.width) // 2, y + (cw - im.height) // 2), im)
    dr.text((x + 3, y + cw), k, fill=(255, 255, 255))
sheet.save(sys.argv[1] if len(sys.argv) > 1 else '/tmp/contact.png')
