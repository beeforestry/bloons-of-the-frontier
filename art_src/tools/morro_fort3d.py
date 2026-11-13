"""t80: El Morro first-person accuracy pass — fort walls + flora placement from the SAME public data the map already uses.
  * Elevation: USGS 3DEP 1 m lidar DEM (public domain), resampled by morro_real.py fetch -> CACHE/dem_map.npy (0.5 m grid on the
    552 x 372 m map frame; sample (j, i) centre = game px ((i + .5) * 4, (j + .5) * 4) on the 4416 x 2976 map, 0.125 m/px).
  * Imagery: NOAA NGS Hurricane Maria 2017 (CC0 / US PD) = public/assets/maps/morro/ground.jpg (0.25 m/px), used to tell masonry
    (tan / ochre / terracotta) from lawn and sea, and to place the scrub thickets / long grass that are actually in the photo.
Outputs
  public/assets/maps/morro/fort3d.dat  gzip(uint16 heights (cm above -5 m) + uint8 class (0 ground, 1 masonry, 2 masonry wall-top / parapet)
                                       for the fort window (FORT below), row-major, 0.5 m spacing) — the 3D view extrudes real
                                       vertical wall faces, parapets and embrasures from it (src/fps/morro3d.ts).
  src/data/maps.generated.json         morro.deco = flora spots [key, x, y, height*10] (keys mr_*; see flora.ts decoTo3D).
Masonry is sharpened (shock filter) so the 1 m lidar's smeared wall faces become ~0.5 m vertical faces, and gun embrasures are cut
into parapet ridges every ~5.5 m (HABS PR-48 sheets: parapets ~2 m thick, embrasure ~1.1 m wide, sill ~0.8 m above the gun deck).
Run: /tmp/morro/venv/bin/python art_src/tools/morro_fort3d.py   (numpy, scipy, PIL)"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

CACHE = os.environ.get('MORRO_CACHE', '/tmp/morro/real')
PX = 4                    # game px per DEM sample (0.5 m)
FORT = dict(x0=1680, y0=640, x1=3840, y1=2640)   # game px window (fort + moat + counterscarp + the point)
# masonry polygons (game px, traced on morro.jpg): castle + counterscarp/moat walls + the seaward batteries and seawall path
MASONRY = [
    [(1790, 860), (2120, 800), (2330, 760), (2520, 930), (2900, 1130), (3300, 1380), (3620, 1600), (3720, 1760), (3700, 1900), (3420, 2120),
     (3000, 2260), (2760, 2400), (2560, 2560), (2300, 2560), (2160, 2380), (1980, 2300), (1820, 2120), (1770, 1700), (1760, 1300)],
]
NO_MASONRY_GREEN = True
PLAZA = [(2477, 1305), (2520, 1300), (2560, 1420), (2655, 1560), (2560, 1915), (2477, 1905)]
# hand-traced vegetation zones (game px) from the photo: the scrub thicket on the bay-side slope south of the fort, the bush
# patch east of the south bastion, and the unmowed long-grass bank above the north seawall. The esplanade itself is open lawn.
SCRUB = [[(1760, 2280), (2240, 2300), (2360, 2400), (2480, 2460), (2400, 2660), (2200, 2760), (1940, 2820), (1600, 2840), (1300, 2880),
          (1120, 2940), (1160, 2780), (1660, 2500)],
         [(2500, 2150), (2760, 2100), (2780, 2300), (2560, 2400)]]
LONGGRASS = [[(1150, 40), (1500, 30), (1900, 150), (2150, 400), (2230, 700), (2080, 780), (1950, 600), (1750, 300), (1500, 150), (1200, 120)]]


def poly_mask(polys, W, H, scale):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for p in polys: d.polygon([(x / scale, y / scale) for x, y in p], fill=255)
    return np.asarray(m) > 0


def build():
    h = np.load(f'{CACHE}/dem_map.npy').astype(np.float32)          # (744, 1104) 0.5 m
    Hs, Ws = h.shape
    photo = np.asarray(Image.open('public/assets/maps/morro/ground.jpg').convert('RGB')).astype(np.float32)
    ph = photo.reshape(Hs, 2, Ws, 2, 3).mean((1, 3))                 # photo on the DEM grid
    r, g, b = ph[..., 0], ph[..., 1], ph[..., 2]; lum = ph.mean(-1)
    green = (g > r * 1.03) & (g > b * 1.08)
    i0, j0, i1, j1 = FORT['x0'] // PX, FORT['y0'] // PX, FORT['x1'] // PX, FORT['y1'] // PX
    hc = h[j0:j1, i0:i1].copy(); rows, cols = hc.shape
    M = poly_mask(MASONRY, Ws, Hs, PX)[j0:j1, i0:i1]
    gr = green[j0:j1, i0:i1]
    mas = M & ~nd.binary_opening(gr, iterations=2) & (hc > 1.2)
    mas = nd.binary_closing(mas, iterations=2) & M
    # shock-filter sharpening of wall faces (only where masonry and the 3x3 range is a real step)
    for _ in range(3):
        mn = nd.minimum_filter(hc, 3); mx = nd.maximum_filter(hc, 3)
        step = (mx - mn) > 1.2
        snap = np.where(hc - mn < mx - hc, mn, mx)
        hc = np.where(mas & step, snap, hc)
    med = nd.median_filter(hc, 3); hc = np.where(mas, med, hc)
    # parapets: thin raised ridges on masonry (top-hat of the deck surface)
    opening = nd.grey_opening(hc, size=(11, 11))
    ridge = mas & ((hc - opening) > 0.55) & ((hc - opening) < 3.2) & (hc > 7.0)
    sm = nd.gaussian_filter(hc, 3); gy, gx = np.gradient(sm)
    n = np.hypot(gx, gy) + 1e-6; tx, ty = -gy / n, gx / n
    J, I = np.mgrid[0:rows, 0:cols].astype(np.float32) * 0.5
    s = I * tx + J * ty
    notch = ridge & ((s / 5.5) % 1.0 < 0.2)
    hc = np.where(notch, np.maximum(opening + 0.8, hc - 1.0), hc)
    cls = np.zeros_like(hc, np.uint8); cls[mas] = 1; cls[ridge] = 2
    q = np.clip(np.round((hc + 5) * 100), 0, 65535).astype('<u2')
    import gzip  # gzip'd so GitHub Pages ships ~0.2 MB (decoded in the browser with DecompressionStream)
    with gzip.open('public/assets/maps/morro/fort3d.dat', 'wb', 9) as f: f.write(q.tobytes()); f.write(cls.tobytes())
    meta = dict(x0=i0 * PX + PX / 2, y0=j0 * PX + PX / 2, step=PX, cols=cols, rows=rows, off=-5)
    print('fort3d', meta, 'masonry %.2f' % mas.mean(), 'parapet cells', int(ridge.sum()), 'embrasure cells', int(notch.sum()))
    # debug render
    sh = np.clip(0.55 + (np.gradient(hc, 0.5)[1] * -0.4 + np.gradient(hc, 0.5)[0] * -0.4) / 3, 0, 1)
    dbg = np.stack([sh] * 3, -1) * 255; dbg[cls == 2] = [255, 80, 80]; dbg[notch] = [40, 40, 255]
    Image.fromarray(dbg.astype(np.uint8)).save('/tmp/t80/fort3d_dbg.png')
    return meta, h, lum, green, ph


def flora(h, lum, green, ph):
    """Flora spots [key, x, y, h*10] where the photo actually shows vegetation (no decorative ring)."""
    rng = np.random.default_rng(80)
    Hs, Ws = h.shape
    scrub = poly_mask(SCRUB, Ws, Hs, PX); grass = poly_mask(LONGGRASS, Ws, Hs, PX)
    sd = np.sqrt(np.maximum(nd.uniform_filter(lum ** 2, 5) - nd.uniform_filter(lum, 5) ** 2, 0))
    r, g, b = ph[..., 0], ph[..., 1], ph[..., 2]
    vegish = (lum < 120) & (g >= b * 1.02) & (h > 1.2)          # dark olive / brown-green canopy, not sea / pale path
    out = []
    def put(key, x, y, hm): out.append([key, int(x), int(y), int(round(hm * 10))])
    # thicket: jittered 3.2 m grid, bushes everywhere it's dark + textured, small trees on the darkest canopy blobs
    for j in range(0, Hs, 6):
        for i in range(0, Ws, 6):
            jj = min(Hs - 1, j + rng.integers(0, 6)); ii = min(Ws - 1, i + rng.integers(0, 6))
            if not scrub[jj, ii] or not vegish[jj, ii]: continue
            x, y = (ii + .5) * PX, (jj + .5) * PX
            if lum[jj, ii] < 70 and sd[jj, ii] > 6 and rng.random() < 0.35: put('mr_tree', x, y, 4.5 + rng.random() * 2.5)
            elif rng.random() < 0.7: put('mr_bush', x, y, 1.2 + rng.random() * 1.2)
            else: put('mr_fern', x, y, 0.8 + rng.random() * 0.5)
    # long-grass bank above the north seawall (grass clumps + a few low shrubs)
    for j in range(0, Hs, 5):
        for i in range(0, Ws, 5):
            jj = min(Hs - 1, j + rng.integers(0, 5)); ii = min(Ws - 1, i + rng.integers(0, 5))
            if not grass[jj, ii] or h[jj, ii] < 1.5: continue
            x, y = (ii + .5) * PX, (jj + .5) * PX
            if green[jj, ii] or lum[jj, ii] > 90: put('mr_grass', x, y, 0.5 + rng.random() * 0.4)
            if rng.random() < 0.06 and lum[jj, ii] < 100: put('mr_bush', x, y, 0.9 + rng.random() * 0.7)
    # short tufts along the lawn edges (foot of walls / path edges), where mowers miss: lawn pixels next to non-lawn
    lawn = green & (h > 1.0) & (lum > 60)
    edge = lawn & nd.binary_dilation(~lawn, iterations=3) & ~nd.binary_dilation(~lawn, iterations=1)
    jj, ii = np.nonzero(edge)
    pick = rng.choice(len(jj), size=min(900, len(jj)), replace=False)
    for k in pick: put('mr_grass', (ii[k] + .5) * PX, (jj[k] + .5) * PX, 0.35 + rng.random() * 0.3)
    print('flora', len(out), {k: sum(1 for o in out if o[0] == k) for k in ('mr_tree', 'mr_bush', 'mr_fern', 'mr_grass')})
    return out


if __name__ == '__main__':
    meta, h, lum, green, ph = build()
    deco = flora(h, lum, green, ph)
    J = 'src/data/maps.generated.json'; d = json.load(open(J)); m = next(x for x in d if x['id'] == 'morro')
    m['deco'] = deco
    # parked world vehicles on the grounds (t77 Raider Buggy / Bulwark Scorpion GLBs), on the lawns beside the road to the gate
    m['parked'] = [['warthog', 1640, 1400, 0.1], ['scorpion', 1600, 1730, 0.35], ['warthog', 1150, 1250, -0.5], ['scorpion', 1000, 1950, 0.0], ['warthog', 2060, 1660, 1.4]]
    json.dump(d, open(J, 'w'), separators=(',', ':'))
    json.dump(meta, open('/tmp/t80/fort3d_meta.json', 'w'))
