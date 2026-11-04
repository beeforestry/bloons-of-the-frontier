"""t55: El Morro at gameplay scale. Run after `compose_maps.py --only morro` (+ `morro_real.py fetch2`).
The composed 2208x1488 map is 0.25 m/px; game sprites (towers/units/bloons ~40-90 px) were ~10-20 m wide on it.
This doubles the world to 4416x2976 at 0.125 m/px (z20 photo), scaling every coordinate x2, so the same sprites
are half the size relative to the fort while gameplay px (ranges/speeds/tap targets) stay identical."""
import json, numpy as np
from PIL import Image, ImageFilter
J = 'src/data/maps.generated.json'; K = 2
d = json.load(open(J)); m = next(x for x in d if x['id'] == 'morro')
assert m['width'] == 2208, 'already scaled - recompose morro first'
P = lambda p: [round(p[0] * K, 1), round(p[1] * K, 1)]
m['waypoints'] = [P(p) for p in m['waypoints']]; m['lanes'] = [[P(p) for p in L] for L in m['lanes']]
m['hq'] = P(m['hq']); m['rally'] = P(m['rally']); m['pads'] = [P(p) for p in m['pads']]
m['envs'] = [[e[0], *P(e[1:3])] for e in m['envs']]
m['walls'] = [[w[0] * K, w[1] * K, round(w[2] * K, 1), w[3]] for w in m['walls']]
g = m['grid']; g['cols'] *= K; g['rows'] *= K
g['buildable'] = [''.join(ch * K for ch in row) for row in g['buildable'] for _ in range(K)]
m['width'] *= K; m['height'] *= K; m['mpp'] = m['mpp'] / K
json.dump(d, open(J, 'w'), separators=(',', ':'))
# image: z20 photo with the composed map's grade/road paint transferred as a low-frequency ratio
W, H = m['width'], m['height']
raw2 = np.asarray(Image.open('/tmp/morro/real/photo_raw2.png').convert('RGB'), np.float32)
up = lambda im: im.convert('RGB').resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
comp = np.asarray(up(Image.open('public/assets/maps/morro.jpg')), np.float32)
raw1 = np.asarray(up(Image.open('/tmp/morro/real/photo_raw.png')), np.float32)
out = raw2 * np.clip((comp + 4) / (raw1 + 4), 0.3, 3)
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save('public/assets/maps/morro.jpg', quality=74, optimize=True, progressive=True)
print('morro x2', W, H, m['mpp'])
