"""Builds src/data/maps.generated.json: traced paths + buildable cell masks
for each painted map. Re-run after replacing map art:
  python art_src/tools/build_maps.py"""
import json, math, os
import numpy as np
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL, OX, OY, COLS, ROWS = 48, 8, 8, 24, 16
MAPS = [
    # id, display name, NOTE: Drive file names are swapped; verified visually.
    dict(id='garden', name='Garden Path', src='map_stone_fortress.jpg', trace='/tmp/garden.json',
         pre=[[-40, 336]], post=[[1210, 363]], cut=None),
    dict(id='jungle', name='Jungle River', src='map_jungle_river.jpg', trace='/tmp/jungle.json',
         pre=[[551, -40]], post=[[586, 690], [588, 830]], cut=[588, 606], dirt_ok=True),
]
def seg_dist(p, a, b):
    ax, ay = a; bx, by = b; px, py = p
    dx, dy = bx - ax, by - ay; L = dx * dx + dy * dy or 1
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)
out = []
for M in MAPS:
    t = json.load(open(M['trace']))
    wp = t['waypoints']
    if M['cut']: wp = wp[:wp.index(M['cut']) + 1]
    wp = M['pre'] + wp + M['post']
    im = np.array(Image.open(os.path.join(ROOT, 'art_src/maps', M['src'])).convert('RGB')).astype(int)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    water = (b > 150) & (g > 140) & (r < 140) & (b - r > 60)
    lum = (r + g + b) / 3
    grass = (g > r + 10) & (g > b + 30) & (lum > 95)
    if M.get('dirt_ok'): grass = grass | ((r > 140) & (g > 95) & (b < 120) & (r > g))
    half = t['path_width'] / 2
    mask = []
    for row in range(ROWS):
        line = ''
        for col in range(COLS):
            x0, y0 = OX + col * CELL, OY + row * CELL
            cx, cy = x0 + CELL / 2, y0 + CELL / 2
            d = min(seg_dist((cx, cy), wp[i], wp[i + 1]) for i in range(len(wp) - 1))
            blk = slice(y0, y0 + CELL), slice(x0, x0 + CELL)
            ok = d > half + CELL * 0.42 and water[blk].mean() < 0.08 and grass[blk].mean() > 0.55
            line += '1' if ok else '0'
        mask.append(line)
    vis = Image.open(os.path.join(ROOT, 'art_src/maps', M['src'])).convert('RGBA')
    ov = Image.new('RGBA', vis.size); d = ImageDraw.Draw(ov)
    for row in range(ROWS):
        for col in range(COLS):
            x0, y0 = OX + col * CELL, OY + row * CELL
            d.rectangle([x0, y0, x0 + CELL - 1, y0 + CELL - 1], outline=(255, 255, 255, 90),
                        fill=(0, 255, 0, 70) if mask[row][col] == '1' else (255, 0, 0, 50))
    d.line([tuple(p) for p in wp], fill=(255, 0, 255, 255), width=4)
    Image.alpha_composite(vis, ov).convert('RGB').save(f'/tmp/mapcheck_{M["id"]}.jpg')
    Image.open(os.path.join(ROOT, 'art_src/maps', M['src'])).convert('RGB').save(
        os.path.join(ROOT, 'public/assets/maps', M['id'] + '.jpg'), quality=88)
    out.append(dict(id=M['id'], name=M['name'], image='assets/maps/' + M['id'] + '.jpg',
                    width=1168, height=784, pathWidth=t['path_width'], waypoints=wp,
                    grid=dict(cell=CELL, originX=OX, originY=OY, cols=COLS, rows=ROWS, buildable=mask)))
json.dump(out, open(os.path.join(ROOT, 'src/data/maps.generated.json'), 'w'), indent=1)
print('ok', [sum(l.count('1') for l in m['grid']['buildable']) for m in out])
