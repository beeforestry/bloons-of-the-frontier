"""t56: generic 2x gameplay-scale step (El Morro's morro_x2.py, generalised). Run after `compose_maps.py --only <id>`
and `<id>_real.py fetch2` (z20 photo). Doubles the world (coords x2, mpp /2) incl. terrain props and the fine land mask.
  python art_src/tools/map_x2.py tropical /tmp/trop/real"""
import json, sys, base64, numpy as np
from PIL import Image, ImageFilter
MID, CACHE = sys.argv[1], sys.argv[2]
J = 'src/data/maps.generated.json'; K = 2
d = json.load(open(J)); m = next(x for x in d if x['id'] == MID)
assert m['width'] == 2208, 'already scaled - recompose first'
P = lambda p: [round(p[0] * K, 1), round(p[1] * K, 1)]
m['waypoints'] = [P(p) for p in m['waypoints']]; m['lanes'] = [[P(p) for p in L] for L in m['lanes']]
m['hq'] = P(m['hq']); m['rally'] = P(m['rally']); m['pads'] = [P(p) for p in m['pads']]
if m.get('envs'): m['envs'] = [[e[0], *P(e[1:3])] for e in m['envs']]
if m.get('walls'): m['walls'] = [[w[0] * K, w[1] * K, round(w[2] * K, 1), w[3]] for w in m['walls']]
if m.get('terrain', {}).get('props'): m['terrain']['props'] = [[k, x * K, y * K, s * K] for k, x, y, s in m['terrain']['props']]
g = m['grid']; g['cols'] *= K; g['rows'] *= K
g['buildable'] = [''.join(ch * K for ch in row) for row in g['buildable'] for _ in range(K)]
if g.get('landRes'): g['landRes'] *= K  # same bits, each covers K x K more px
m['width'] *= K; m['height'] *= K; m['mpp'] = m['mpp'] / K
json.dump(d, open(J, 'w'), separators=(',', ':'))
W, H = m['width'], m['height']
raw2 = np.asarray(Image.open(f'{CACHE}/photo_raw2.png').convert('RGB'), np.float32)
up = lambda im: im.convert('RGB').resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
comp = np.asarray(up(Image.open(f'public/assets/maps/{MID}.jpg')), np.float32)
raw1 = np.asarray(up(Image.open(f'{CACHE}/photo_raw.png')), np.float32)
out = raw2 * np.clip((comp + 4) / (raw1 + 4), 0.3, 3)
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'public/assets/maps/{MID}.jpg', quality=74, optimize=True, progressive=True)
print(MID, 'x2', W, H, m['mpp'])
