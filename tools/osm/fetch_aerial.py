"""Fetch the un-painted NOAA aerial for a map frame (same source as the shipped map art), used only to heal the old painted
lane strip when lanes move. NOAA NGS Emergency Response Imagery, Hurricane Maria 2017-09-24, layer 20170924b-rgb (public domain).
  python3 tools/osm/fetch_aerial.py morro|tropical
Output (git-ignored cache): data/osm/cache/<map>_photo.png at the game resolution (4416 x 2976, 0.125 m/px)."""
import io, math, os, sys, urllib.request
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from frames import FRAMES, to_utm, tr

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CACHE = os.path.join(ROOT, 'data', 'osm', 'cache')
LAYER, Z = '20170924b-rgb', 20


def bilinear(a, x, y):
    H, W = a.shape[:2]; x = np.clip(x, 0, W - 1.001); y = np.clip(y, 0, H - 1.001)
    i = x.astype(int); j = y.astype(int); u = (x - i)[..., None]; v = (y - j)[..., None]
    return (a[j, i] * (1 - u) + a[j, i + 1] * u) * (1 - v) + (a[j + 1, i] * (1 - u) + a[j + 1, i + 1] * u) * v


def fetch(mid):
    f = FRAMES[mid]; W, H = f['W'], f['H']
    os.makedirs(f'{CACHE}/tiles', exist_ok=True)
    xs, ys = np.meshgrid(np.arange(W) + 0.5, np.arange(H) + 0.5)
    a = math.radians(f['ang']); dx, dy = math.cos(a), math.sin(a)
    U = (xs - W / 2) * f['mpp']; V = (ys - H / 2) * f['mpp']
    E = f['cE'] + U * dx + V * dy; N = f['cN'] + U * dy - V * dx
    lon, lat = tr(26919, 4326).transform(E, N)
    n = 256 * 2 ** Z; gx = (lon + 180) / 360 * n; gy = (1 - np.arcsinh(np.tan(np.radians(lat))) / math.pi) / 2 * n
    tx0, ty0, tx1, ty1 = int(gx.min() // 256), int(gy.min() // 256), int(gx.max() // 256), int(gy.max() // 256)
    mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256, 3), np.float32); miss = 0
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            p = f'{CACHE}/tiles/{LAYER}_{Z}_{tx}_{ty}.img'
            if not os.path.exists(p):
                try:
                    b = urllib.request.urlopen(urllib.request.Request(f'https://stormscdn.ngs.noaa.gov/{LAYER}/{Z}/{tx}/{ty}', headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read()
                    open(p, 'wb').write(b)
                except Exception as e: print('tile fail', tx, ty, e); miss += 1; continue
            try: mos[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = np.asarray(Image.open(p).convert('RGB'))
            except Exception: miss += 1
    print(mid, 'tiles', (tx1 - tx0 + 1) * (ty1 - ty0 + 1), 'missing', miss)
    img = bilinear(mos, gx - tx0 * 256 - 0.5, gy - ty0 * 256 - 0.5)
    Image.fromarray(img.clip(0, 255).astype(np.uint8)).save(f'{CACHE}/{mid}_photo.png')


if __name__ == '__main__':
    for m in (sys.argv[1:] or list(FRAMES)): fetch(m)
