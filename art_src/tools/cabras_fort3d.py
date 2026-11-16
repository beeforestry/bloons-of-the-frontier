"""t99: Isla de Cabras (map 'tropical') first-person realism pass — the El Morro t80/t93 method applied to the island.
Same public data the 2D map already uses (tropical_real.py fetch / fetch2):
  * Elevation: USGS 3DEP 1 m lidar DEM PR_PRVI_E_2018 (public domain) -> CACHE/dem_map.npy (0.5 m grid on the 552 x 372 m frame;
    sample (j, i) centre = game px ((i + .5) * 4, (j + .5) * 4) on the 4416 x 2976 map, 0.125 m/px).
  * Imagery: NOAA NGS Hurricane Maria 2017-09-24 orthophoto (CC0 / US PD) -> CACHE/photo_raw2.png (0.125 m/px), used to classify
    sand / riprap rock / asphalt / brick promenade floors and to place the palms, sea-grape trees, bushes, grass and shore rocks
    that are actually in the photo.
  * El Canuelo (Fortin San Juan de la Cruz): the lidar is bare-earth (the fort is filtered out), so the fort is carved into the fine
    heights from the HABS PR-52 measured drawings (US public domain): 80 ft (24.4 m) square, battered walls, cordon at el. 17'4"
    (5.3 m), parapet top 22'1" (6.7 m) above mean low water, embrasures (5 on the north face, 2 east, 2 west, 3 south), one garita
    at the NE corner, entrance on the east face with a stair up to the gun deck. Footprint/orientation traced on the NOAA photo.
Outputs
  public/assets/maps/tropical/cabras3d.dat  gzip(uint16 heights (cm above -5 m) | uint8 class (0 ground, 1 masonry, 2 parapet)
                                            | uint8 floor (0 photo, 1 earth, 2 deck, 3 sand, 4 rock, 5 asphalt, 6 stone, 7 brick))
                                            row-major over the window below, 0.5 m spacing (src/fps/cabras3d.ts).
  src/data/maps.generated.json              tropical.deco = flora/rock spots [key, x, y, height*10]; tropical.parked = vehicles.
Run: /tmp/trop/venv/bin/python art_src/tools/cabras_fort3d.py   (numpy, scipy, PIL)"""
import json, math, os, gzip
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

CACHE = os.environ.get('TROP_CACHE', '/tmp/trop/real')
PX = 4
SEA = 0.35
# El Canuelo in game px: centre + the fort's own axes (a = HABS north face normal, b = HABS east face normal), half side (m)
FC = (356.0, 1386.0); HS = 12.2
UA = (1 / math.sqrt(2), 1 / math.sqrt(2)); UB = (-1 / math.sqrt(2), 1 / math.sqrt(2))
GROUND_FORT, CORDON, PARAPET, DECK, SILL = 1.25, 5.3, 6.7, 5.6, 6.05
EMB = {'a+': [-8.0, -4.6, -1.2, 2.2, 5.6], 'b+': [1.6, 5.6], 'b-': [4.0, 8.0], 'a-': [-6.0, -1.0, 4.0]}
DOOR_A, DOOR_W, PASS_H = -4.0, 1.5, 1.6
STAIR_L = 10.0


def fort_local(X, Y):
    dx, dy = (X - FC[0]) * 0.125, (Y - FC[1]) * 0.125
    return dx * UA[0] + dy * UA[1], dx * UB[0] + dy * UB[1]


def carve_fort(h, cls, fl):
    Hs, Ws = h.shape
    J, I = np.mgrid[0:Hs, 0:Ws]; X, Y = (I + .5) * PX, (J + .5) * PX
    a, b = fort_local(X, Y); r = np.maximum(np.abs(a), np.abs(b))
    ring = (r > HS + 3) & (r < HS + 7)
    g0 = max(GROUND_FORT, float(np.median(h[ring])))
    # field-stone apron round the foot (HABS: 'apron faced with field stone laid in a random pattern')
    apron = (r > HS + 0.55) & (r < HS + 2.4)
    rng = np.random.default_rng(99)
    h[apron] = np.maximum(h[apron], g0 - 0.25 + rng.random(apron.sum()) * 0.35); fl[apron] = 4; cls[apron] = 1   # cls 1 -> the wall face down to the apron gets the stucco shader
    bat = (r > HS) & (r <= HS + 0.55)                      # batter below the cordon (~1:8)
    h[bat] = CORDON - 0.5; cls[bat] = 1; fl[bat] = 0   # one 0.5 m sample row -> reads as the battered foot
    inn = r <= HS
    h[inn] = DECK; cls[inn] = 1; fl[inn] = 2
    par = inn & (r > HS - 2.0)
    h[par] = PARAPET; cls[par] = 2; fl[par] = 0
    # embrasures: flared notches through the parapet, sill 0.45 m above the gun deck
    emb = np.zeros_like(par)
    for face, ss in EMB.items():
        on = (a > HS - 2.05) if face == 'a+' else (a < -HS + 2.05) if face == 'a-' else (b > HS - 2.05) if face == 'b+' else (b < -HS + 2.05)
        s = b if face[0] == 'a' else a; depth = (r - (HS - 2.0)) / 2.0
        for s0 in ss: emb |= on & par & (np.abs(s - s0) < 0.55 + 0.45 * depth)
    h[emb] = SILL
    # garita corner (a+, b+): a short stepped walk from the deck up to the sentry-box floor (parapet level)
    gw = (np.abs(a - b) < 0.75) & (a > HS - 4.2) & (a < HS - 1.1)
    h[gw] = np.maximum(DECK, np.minimum(PARAPET - 0.1, DECK + np.floor((a[gw] - (HS - 4.2)) / 0.5) * 0.2)); cls[gw] = 1; fl[gw] = 6
    # entrance on the east face + the stair up to the gun deck (HABS photos 6 and 8)
    door = (np.abs(a - DOOR_A) < DOOR_W / 2)
    pas = door & (b > HS - 2.4) & (b <= HS + 2.4)          # passage + paved threshold across the apron
    h[pas] = g0 + 0.35; cls[pas] = 1; fl[pas] = 6
    st = door & (b <= HS - 2.4) & (b > HS - 2.4 - STAIR_L)
    t = np.clip((HS - 2.4 - b[st]) / STAIR_L, 0, 1)
    h[st] = g0 + 0.35 + np.floor(t * 20) / 20 * (DECK - g0 - 0.35); cls[st] = 1; fl[st] = 6
    print('fort: ground %.2f, deck %.1f, parapet %.1f, embrasure cells %d, stair cells %d' % (g0, DECK, PARAPET, int(emb.sum()), int(st.sum())))
    return g0


def build():
    h = np.load(f'{CACHE}/dem_map.npy').astype(np.float32)          # (744, 1104)
    Hs, Ws = h.shape
    photo = np.asarray(Image.open(f'{CACHE}/photo_raw2.png').convert('RGB')).astype(np.float32)
    ph = photo.reshape(Hs, 4, Ws, 4, 3).mean((1, 3))
    r, g, b = ph[..., 0], ph[..., 1], ph[..., 2]; lum = ph.mean(-1)
    mx, mn = ph.max(-1), ph.min(-1); sat = (mx - mn) / (mx + 1)
    sd = np.sqrt(np.maximum(nd.uniform_filter(lum ** 2, 5) - nd.uniform_filter(lum, 5) ** 2, 0))
    land = h > 0.55
    land = nd.binary_opening(land, iterations=1)
    # sea floor: shelve down from the shore (the lidar is hydro-flattened), so the clear shallows read through the water
    dist = nd.distance_transform_edt(~land) * 0.5
    water = ~land
    h = np.where(water, np.maximum(-4.0, np.minimum(h, 0.15 - dist * 0.16)), h)
    cls = np.zeros(h.shape, np.uint8); fl = np.zeros(h.shape, np.uint8)
    green = (g > r * 1.03) & (g > b * 1.06)
    sand = land & (lum > 125) & (r > b * 1.12) & ~green & (sat < 0.42)
    grey = land & (sat < 0.16) & ~green & (lum > 55) & (lum < 175)
    shore = nd.binary_dilation(water, iterations=8)
    rock = grey & ((sd > 9) | shore) & (h < 2.4)
    asph = grey & ~rock & (sd < 7)
    brick = land & (r > g * 1.12) & (r > b * 1.3) & (lum > 60) & (lum < 170) & ~sand
    for m in (sand, rock, asph, brick): m[:] = nd.binary_opening(m, iterations=1)
    fl[sand] = 3; fl[asph] = 5; fl[brick] = 7; fl[rock] = 4
    fl = nd.median_filter(fl, 3)
    # rubble breakwaters: the lidar has them as low mounds; give them a rough rock-pile top
    bw = rock & (nd.distance_transform_edt(~water) * 0.5 < 14)
    rng = np.random.default_rng(7)
    h = np.where(bw, h + (rng.random(h.shape).astype(np.float32) - 0.5) * 0.35, h)
    g0 = carve_fort(h, cls, fl)
    # window = land + shallows + 12 m (deep sea outside is the flat sea floor plane)
    ys, xs = np.nonzero(h > -3.2)
    j0, j1 = max(0, ys.min() - 24), min(Hs, ys.max() + 25); i0, i1 = max(0, xs.min() - 24), min(Ws, xs.max() + 25)
    hc, cc, fc = h[j0:j1, i0:i1], cls[j0:j1, i0:i1], fl[j0:j1, i0:i1]
    q = np.clip(np.round((hc + 5) * 100), 0, 65535).astype('<u2')
    os.makedirs('public/assets/maps/tropical', exist_ok=True)
    with gzip.open('public/assets/maps/tropical/cabras3d.dat', 'wb', 9) as f: f.write(q.tobytes()); f.write(cc.tobytes()); f.write(fc.tobytes())
    meta = dict(x0=i0 * PX + PX / 2, y0=j0 * PX + PX / 2, step=PX, cols=int(i1 - i0), rows=int(j1 - j0), off=-5)
    print('cabras3d', meta, 'kB', os.path.getsize('public/assets/maps/tropical/cabras3d.dat') // 1024,
          {k: int((fc == v).sum()) for k, v in dict(sand=3, rock=4, asph=5, stone=6, brick=7, deck=2).items()})
    pal = np.array([[0, 0, 0], [150, 80, 50], [220, 220, 210], [240, 220, 150], [120, 120, 120], [40, 40, 45], [200, 190, 170], [180, 70, 50]], np.uint8)
    dbg = np.where((fc > 0)[..., None], pal[fc], np.clip(ph[j0:j1, i0:i1] * 0.6, 0, 255)).astype(np.uint8); dbg[cc == 2] = [255, 60, 60]
    os.makedirs('/tmp/t99', exist_ok=True); Image.fromarray(dbg).save('/tmp/t99/cabras_fl.png')
    return meta, h, lum, green, sd, land, fl, water


def flora(h, lum, green, sd, land, fl, water, lanes, pw):
    rng = np.random.default_rng(99)
    Hs, Ws = h.shape
    J, I = np.mgrid[0:Hs, 0:Ws]; X, Y = (I + .5) * PX, (J + .5) * PX
    a, b = fort_local(X, Y); fortzone = np.maximum(np.abs(a), np.abs(b)) < HS + 2.6
    # lanes (game px polylines): keep the 2D road clear of trunks
    lm = Image.new('L', (Ws, Hs), 0); d = ImageDraw.Draw(lm)
    for L in lanes: d.line([(x / PX, y / PX) for x, y in L], fill=255, width=int(pw / PX) + 2)
    lane = np.asarray(lm) > 0
    out = []
    def put(key, x, y, hm): out.append([key, int(x), int(y), int(round(hm * 10))])
    canopy = land & green & (lum < 100) & (sd > 5) & ~fortzone & (fl != 5)
    canopy = nd.binary_opening(canopy, iterations=1)
    lab, n = nd.label(canopy); areas = nd.sum(canopy, lab, range(1, n + 1)) * 0.25
    cents = nd.center_of_mass(canopy, lab, range(1, n + 1))
    for k, (A, (cy, cx)) in enumerate(zip(areas, cents)):
        x, y = (cx + .5) * PX, (cy + .5) * PX
        if lane[int(cy), int(cx)]: continue
        if A < 3: put('mr_bush', x, y, 0.9 + rng.random() * 0.8)
        elif A < 28: put('mr_palm' if rng.random() < 0.72 else 'mr_palmb', x, y, 7.5 + rng.random() * 4.5)  # coconut palms (crown blobs)
        else:  # big canopy = sea grape / Indian almond thickets: trees + bushes on a jittered 3.5 m grid inside the blob
            jj, ii = np.nonzero(lab == k + 1)
            for t in range(max(1, int(A / 12))):
                q = rng.integers(len(jj)); xx, yy = (ii[q] + .5) * PX, (jj[q] + .5) * PX
                if lane[jj[q], ii[q]]: continue
                put('mr_tree' if rng.random() < 0.55 else 'mr_bush', xx, yy, (4.0 + rng.random() * 3) if rng.random() < 0.55 else 1.3 + rng.random())
    # grass tufts where the lawn meets sand / paths / the fort apron; dune grass on the beach crest
    lawn = land & green & (lum > 70) & ~fortzone
    edge = lawn & nd.binary_dilation(~lawn, iterations=3) & ~nd.binary_dilation(~lawn, iterations=1) & ~lane
    jj, ii = np.nonzero(edge); pick = rng.choice(len(jj), size=min(1100, len(jj)), replace=False)
    for k in pick: put('mr_grass', (ii[k] + .5) * PX, (jj[k] + .5) * PX, 0.35 + rng.random() * 0.35)
    dune = (fl == 3) & nd.binary_dilation(lawn, iterations=4) & ~lane
    jj, ii = np.nonzero(dune); pick = rng.choice(len(jj), size=min(500, len(jj)), replace=False)
    for k in pick: put('mr_grass', (ii[k] + .5) * PX, (jj[k] + .5) * PX, 0.4 + rng.random() * 0.4)
    # shore riprap + the two rubble breakwaters + the fort's apron: rocks every ~1.5 m
    rocky = (fl == 4) & ~lane
    J, I = np.mgrid[0:Hs, 0:Ws]; fa, fb = fort_local((I + .5) * PX, (J + .5) * PX)
    rocky &= ~((np.abs(fa - DOOR_A) < 2.2) & (fb > HS - 1) & (fb < HS + 6))     # keep the entrance approach clear
    rocky &= np.maximum(np.abs(fa), np.abs(fb)) > HS + 2.6                       # the paved apron itself stays clear
    for j in range(0, Hs, 2):
        for i in range(0, Ws, 2):
            jj2 = min(Hs - 1, j + rng.integers(0, 2)); ii2 = min(Ws - 1, i + rng.integers(0, 2))
            if not rocky[jj2, ii2] or rng.random() < 0.4: continue
            put('mr_rock', (ii2 + .5) * PX, (jj2 + .5) * PX, 0.3 + rng.random() * 0.55)
    from collections import Counter
    print('flora', len(out), dict(Counter(o[0] for o in out)))
    return out


def parked_spots(land, fl, lanes, pw):
    """Raider Buggies / Bulwark Scorpions parked on the park's asphalt lots, clear of the lanes and the fort."""
    want = [('warthog', 880, 1110, 0.1), ('scorpion', 1160, 1120, -0.05), ('warthog', 1700, 1150, 0.4), ('scorpion', 640, 1330, 1.2), ('warthog', 2560, 1300, -0.3)]
    out = []
    def lane_d(x, y): return min(min(math.hypot(x - px, y - py) for px, py in L) for L in lanes)
    for k, x, y, a in want:
        best = None
        for dy in range(-120, 121, 8):
            for dx in range(-120, 121, 8):
                xx, yy = x + dx, y + dy; j, i = int(yy / PX), int(xx / PX)
                if not (0 <= j < land.shape[0] and 0 <= i < land.shape[1]) or not land[max(0, j - 6):j + 7, max(0, i - 6):i + 7].all(): continue
                fa, fb = fort_local(xx, yy)
                if max(abs(fa), abs(fb)) < HS + 6 or lane_d(xx, yy) < pw / 2 + 50: continue
                s = math.hypot(dx, dy) - (30 if fl[j, i] == 5 else 0)
                if best is None or s < best[0]: best = (s, xx, yy)
        if best: out.append([k, best[1], best[2], a])
    print('parked', out)
    return out


if __name__ == '__main__':
    J = 'src/data/maps.generated.json'; d = json.load(open(J)); m = next(x for x in d if x['id'] == 'tropical')
    assert m['width'] == 4416, 'run map_x2.py first'
    meta, h, lum, green, sd, land, fl, water = build()
    lanes = m['lanes']; pw = m['pathWidth']
    m['deco'] = flora(h, lum, green, sd, land, fl, water, lanes, pw)
    m['parked'] = parked_spots(land, fl, lanes, pw)
    json.dump(d, open(J, 'w'), separators=(',', ':'))
    json.dump(meta, open('/tmp/t99/cabras3d_meta.json', 'w'))
