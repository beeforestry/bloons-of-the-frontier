"""Re-route the enemy lanes of El Morro / Isla de Cabras along real OSM footways and roads (config.LANES) and update
everything that depends on them, in place:
  * src/data/maps.generated.json   lanes / waypoints, coarse buildable grid (old lane strip freed, new strip cleared,
                                   OSM building footprints unbuildable), fine land bits (Cabras), 3D flora on the new lanes
  * public/assets/maps/<map>.jpg   2D map: the old painted road strip is healed back to the NOAA aerial (same z20 photo the
                                   map was built from, grade transferred from the surrounding pixels) and the new lanes are
                                   painted with the same road texture / strength compose_maps.py uses
  * public/assets/maps/<map>/ground.jpg  same for the first-person ground texture (half resolution)
Needs: data/osm/raw/<map>.json (fetch_osm.py) and data/osm/cache/<map>_photo.png (fetch_aerial.py).
  python3 tools/osm/apply_lanes.py [morro] [tropical] [--no-paint]
Rerunnable: the previous lanes are read back from maps.generated.json, so a second run with unchanged config is a no-op
for the data and only re-heals / re-paints the same strip. The pre-OSM lanes are kept in data/osm/derived/baseline_lanes.json."""
import base64, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd
sys.path.insert(0, os.path.dirname(__file__))
from osm_lib import ROOT, Net, simplify, chaikin, resample, length, poly_dist, seg_dist
from config import LANES, LANE_KINDS

MAPS_JSON = os.path.join(ROOT, 'src', 'data', 'maps.generated.json')
CACHE = os.path.join(ROOT, 'data', 'osm', 'cache')
DERIVED = os.path.join(ROOT, 'data', 'osm', 'derived')
TEX = os.path.join(ROOT, 'art_src', 'tex')
# compose_maps.py paint settings for these maps (road texture, road alpha, rng seed)
PAINT = {'morro': dict(road='stone', ra=0.42, seed=53), 'tropical': dict(road='dryground', ra=0.34, seed=71)}
CLEAR_PX = 98.3   # coarse grid lane clearance at 4416 px (compose_maps: pw/2 + CELL*0.42 at 2208 px, x2)


def build_lane(net, spec):
    P = []
    for kind, x, y in spec:
        if kind == 'pt': P.append((float(x), float(y))); continue
        if not P: P.append(net.pts[net.nearest((x, y))]); continue
        seg, _ = net.route(P[-1], (x, y)); P += seg[1:] if math.dist(P[-1], seg[0]) < 1e-6 else seg
    P = simplify(P, 2.5); P = chaikin(P, 2); P = resample(P, 52.0)
    return [[round(x, 1), round(y, 1)] for x, y in P]


# ------------------------------------------------------------------ painting (mirrors compose_maps.py at any resolution)
def noise(seed, W, H, s, blur):
    rng = np.random.default_rng(seed)
    n = Image.fromarray((rng.random((int(H // s) + 3, int(W // s) + 3)) * 255).astype(np.uint8)).resize((int(W + 3 * s), int(H + 3 * s)), Image.BICUBIC)
    return np.asarray(n.crop((int(s), int(s), int(s) + W, int(s) + H)).filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255


def line_mask(polys, width, W, H, k, rough_seed=None):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for wp in polys:
        pts = [(x * k, y * k) for x, y in wp]
        d.line(pts, fill=255, width=max(1, int(width)), joint='curve')
        for p in (pts[0], pts[-1]): d.ellipse([p[0] - width / 2, p[1] - width / 2, p[0] + width / 2, p[1] + width / 2], fill=255)
    a = np.asarray(m.filter(ImageFilter.GaussianBlur(width * 0.16)), np.float32) / 255
    if rough_seed is not None:
        n = noise(rough_seed, W, H, 40 * k * 2, 8 * k * 2)
        a = np.clip((a - 0.5 + (n - 0.5) * 0.55) * 3.2 + 0.5, 0, 1)
        a = nd.gaussian_filter(a, 2 * k * 2 / 2)
    return a


def tex(name, scale, W, H):
    t = Image.open(f'{TEX}/{name}.jpg').convert('RGB').resize((scale, scale), Image.LANCZOS)
    m = Image.new('RGB', (scale * 2, scale * 2))
    m.paste(t, (0, 0)); m.paste(t.transpose(Image.FLIP_LEFT_RIGHT), (scale, 0)); m.paste(t.transpose(Image.FLIP_TOP_BOTTOM), (0, scale)); m.paste(t.rotate(180), (scale, scale))
    out = Image.new('RGB', (W, H))
    for y in range(0, H, scale * 2):
        for x in range(0, W, scale * 2): out.paste(m, (x, y))
    return np.asarray(out, np.float32)


def blur(a, sig):
    """Gaussian blur; large sigmas run on a block-averaged copy (same result to within a pixel, ~100x faster)."""
    f = int(sig // 12)
    if f < 2: return nd.gaussian_filter(a, sig)
    H, W = a.shape; h, w = -(-H // f), -(-W // f)
    pad = np.pad(a, ((0, h * f - H), (0, w * f - W)), mode='edge')
    small = nd.gaussian_filter(pad.reshape(h, f, w, f).mean((1, 3)), sig / f)
    return nd.zoom(small, f, order=1)[:H, :W]


def repaint(path, mid, old_changed, new_changed, unchanged, pw, k, quality):
    """k = image px per map px (1 for the 2D map, 0.5 for ground.jpg)."""
    img = np.asarray(Image.open(path).convert('RGB'), np.float32); H, W = img.shape[:2]
    raw = Image.open(f'{CACHE}/{mid}_photo.png').convert('RGB')
    if raw.size != (W, H): raw = raw.resize((W, H), Image.LANCZOS)
    raw = np.asarray(raw, np.float32)
    P = PAINT[mid]
    # 1) heal: inside the old painted strip, the aerial times the local grade (map / aerial) measured just outside it
    band = line_mask(old_changed, 215 * k, W, H, k) > 0.02
    band = nd.binary_dilation(band, iterations=max(1, int(6 * k)))
    w = (~band).astype(np.float32)
    G = (img + 4) / (raw + 4)
    # normalized convolution, coarse-to-fine: wide gaps (where several old lanes met) fall back to the wider estimate
    Gf = None
    for sig in (400 * k, 160 * k, 55 * k):
        den = blur(w, sig)
        est = np.stack([blur(G[..., c] * w, sig) for c in range(3)], -1) / np.maximum(den, 1e-6)[..., None]
        if Gf is None: Gf = est
        else:
            t = np.clip(den / 0.25, 0, 1)[..., None]; Gf = est * t + Gf * (1 - t)
    Gf = np.clip(Gf, 0.4, 2.5)
    soft = nd.gaussian_filter(band.astype(np.float32), 3 * k)[..., None]
    healed = img * (1 - soft) + np.clip(raw * Gf - 4 * (Gf - 1), 0, 255) * soft
    # 2) paint the new lanes like compose_maps.py (dark rut edge, road texture at roadAlpha, centre wear), plus unchanged
    #    lanes only where the heal touched them, then transfer it as a smooth ratio like the x2 gameplay-scale step did
    ra = P['ra']; s2 = 2 * k  # compose painted at 2208 px = half the 4416 map
    def masks(polys, clip=None):
        e = line_mask(polys, (pw + 22) * s2, W, H, k, P['seed'] + 5); r = line_mask(polys, pw * s2, W, H, k, P['seed'] + 6)
        wr = line_mask(polys, pw * 0.35 * s2, W, H, k, P['seed'] + 7)
        if clip is not None: e, r, wr = e * clip, r * clip, wr * clip
        return e, r, wr
    e, r, wr = masks(new_changed)
    if unchanged:
        e2, r2, w2 = masks(unchanged, band.astype(np.float32)); e, r, wr = np.maximum(e, e2), np.maximum(r, r2), np.maximum(wr, w2)
    road = tex(P['road'], int(512 * s2), W, H)
    g = healed.copy()
    a = (e * 0.7 * ra)[..., None]; g = g * 0.62 * a + g * (1 - a)
    a = (r * ra)[..., None]; g = road * a + g * (1 - a)
    a = (wr * 0.25)[..., None]; g = g * 1.15 * a + g * (1 - a)
    if k >= 1:  # 2D map: ratio transfer keeps the z20 photo detail under the tint (as map_x2.py / morro_x2.py)
        bl = lambda x: np.stack([nd.gaussian_filter(x[..., c], 3) for c in range(3)], -1)
        out = healed * np.clip((bl(g) + 4) / (bl(healed) + 4), 0.3, 3)
    else:
        out = g
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(path, quality=quality, optimize=True, progressive=True)
    print('  painted', os.path.relpath(path, ROOT), f'{os.path.getsize(path) // 1024} KB', 'healed px', int(band.sum()))


# ------------------------------------------------------------------ grid / land / flora
def pip(x, y, poly):
    c = False; n = len(poly)
    for i in range(n):
        (ax, ay), (bx, by) = poly[i], poly[(i + 1) % n]
        if (ay > y) != (by > y) and x < (bx - ax) * (y - ay) / (by - ay + 1e-12) + ax: c = not c
    return c


def poly_edge_dist(x, y, poly):
    n = len(poly); return min(seg_dist((x, y), poly[i], poly[(i + 1) % n]) for i in range(n))


def update_grid(m, old_changed, new_lanes, blds):
    g = m['grid']; C = g['cell']; rows = [list(r) for r in g['buildable']]
    R, Cn = len(rows), len(rows[0])
    near = lambda x, y, L: any(poly_dist((x, y), l) <= CLEAR_PX for l in L)
    hq, pads = m['hq'], m['pads']
    stat = dict(cleared=0, freed=0, building=0)
    old_band = [[near((c + .5) * C, (r + .5) * C, old_changed) for c in range(Cn)] for r in range(R)]
    new_band = [[near((c + .5) * C, (r + .5) * C, new_lanes) for c in range(Cn)] for r in range(R)]
    def side_ok(c, r, dx, dy):
        for s in range(1, 7):
            cc, rr = int(round(c + dx * s)), int(round(r + dy * s))
            if not (0 <= cc < Cn and 0 <= rr < R): return False
            if not old_band[rr][cc]: return rows[rr][cc] == '1'
        return False
    freed = []
    for r in range(R):
        for c in range(Cn):
            x, y = (c + .5) * C, (r + .5) * C
            if new_band[r][c]:
                if rows[r][c] == '1': rows[r][c] = '0'; stat['cleared'] += 1
                continue
            if old_band[r][c] and rows[r][c] == '0':
                if abs(x - hq[0]) < 126 + 60 and abs(y - hq[1]) < 126 + 60: continue
                if any(abs(x - px) < 68 + 40 and abs(y - py) < 68 + 40 for px, py in pads): continue
                # direction across the old lane at this cell
                best = None
                for l in old_changed:
                    for a, b in zip(l, l[1:]):
                        d = seg_dist((x, y), a, b)
                        if best is None or d < best[0]: best = (d, a, b)
                _, a, b = best; L = math.dist(a, b) or 1; nx, ny = -(b[1] - a[1]) / L, (b[0] - a[0]) / L
                if side_ok(c, r, nx, ny) and side_ok(c, r, -nx, -ny): freed.append((r, c))
    for r, c in freed: rows[r][c] = '1'; stat['freed'] += 1
    for b in blds:
        P = b['poly']
        for r in range(R):
            for c in range(Cn):
                x, y = (c + .5) * C, (r + .5) * C
                if rows[r][c] == '1' and (pip(x, y, P) or poly_edge_dist(x, y, P) < 8): rows[r][c] = '0'; stat['building'] += 1
    g['buildable'] = [''.join(r) for r in rows]
    # fine land bits (free placement on Cabras): only buildings change it (lanes are checked per spot in game)
    if g.get('land') and g.get('landRes'):
        res = g['landRes']; fc = math.ceil(m['width'] / res)
        bits = np.unpackbits(np.frombuffer(base64.b64decode(g['land']), np.uint8), bitorder='little')
        n = 0
        for b in blds:
            P = b['poly']; xs, ys = zip(*P)
            for yy in range(int(min(ys) // res) - 1, int(max(ys) // res) + 2):
                for xx in range(int(min(xs) // res) - 1, int(max(xs) // res) + 2):
                    cx, cy = (xx + .5) * res, (yy + .5) * res; kk = yy * fc + xx
                    if 0 <= kk < len(bits) and bits[kk] and (pip(cx, cy, P) or poly_edge_dist(cx, cy, P) < 6): bits[kk] = 0; n += 1
        g['land'] = base64.b64encode(np.packbits(bits, bitorder='little').tobytes()).decode(); stat['land_bits'] = n
    return stat


def clear_flora(m, new_changed, blds, pw):
    """Drop 3D flora / painted deco spots that would stand on a new lane or inside a raised OSM building."""
    lim = pw / 2 + 1.0 / m['mpp']
    def bad(x, y):
        if any(poly_dist((x, y), l) < lim for l in new_changed): return True
        return any(pip(x, y, b['poly']) or poly_edge_dist(x, y, b['poly']) < 0.6 / m['mpp'] for b in blds)
    n = 0
    for key in ('deco',):
        if m.get(key):
            keep = [d for d in m[key] if not bad(d[1], d[2])]; n += len(m[key]) - len(keep); m[key] = keep
    t = m.get('terrain')
    if t and t.get('props'):
        keep = [d for d in t['props'] if not bad(d[1], d[2])]; n += len(t['props']) - len(keep); t['props'] = keep
    moved = []
    for p in m.get('parked', []):
        if any(poly_dist((p[1], p[2]), l) < pw / 2 + 3.0 / m['mpp'] for l in new_changed): moved.append(p[:3])
    return n, moved


def main():
    want = [a for a in sys.argv[1:] if not a.startswith('--')] or list(LANES)
    data = json.load(open(MAPS_JSON)); maps = {m['id']: m for m in data}
    rt = json.load(open(os.path.join(ROOT, 'src', 'data', 'osm.generated.json')))['maps']
    os.makedirs(DERIVED, exist_ok=True)
    bp = os.path.join(DERIVED, 'baseline_lanes.json')
    base = json.load(open(bp)) if os.path.exists(bp) else {}
    report = {}
    for mid in want:
        m = maps[mid]; base.setdefault(mid, m['lanes'])
        net = Net(mid, LANE_KINDS)
        old = m['lanes']; new = []
        for i, spec in enumerate(LANES[mid]):
            new.append(old[i] if spec is None else build_lane(net, spec))
        changed = [i for i, spec in enumerate(LANES[mid]) if spec is not None and new[i] != old[i]]
        old_c = [old[i] for i in changed]; new_c = [new[i] for i in changed]; unch = [new[i] for i in range(len(new)) if i not in changed]
        blds = [b for b in rt.get(mid, {}).get('buildings', [])]
        stat = update_grid(m, old_c, new, blds) if (changed or blds) else {}
        nflora, moved = clear_flora(m, new_c, blds, m['pathWidth'])
        m['lanes'] = new; m['waypoints'] = new[0]
        m['osm'] = dict(attribution='© OpenStreetMap contributors (ODbL 1.0)', lanes=[spec is not None for spec in LANES[mid]])
        report[mid] = dict(changed=changed, lengths_before=[round(length(l)) for l in base[mid]], lengths_after=[round(length(l)) for l in new],
                           grid=stat, flora_removed=nflora, parked_near_new_lanes=moved,
                           buildable_cells=sum(r.count('1') for r in m['grid']['buildable']))
        print(mid, json.dumps(report[mid]))
        if changed and '--no-paint' not in sys.argv:
            repaint(os.path.join(ROOT, 'public', m['image']), mid, old_c, new_c, unch, m['pathWidth'], 1.0, 74)
            repaint(os.path.join(ROOT, 'public', m['terrain']['ground']), mid, old_c, new_c, unch, m['pathWidth'], 0.5, 80)
    json.dump(base, open(bp, 'w'), separators=(',', ':'))
    json.dump(data, open(MAPS_JSON, 'w'), separators=(',', ':'))
    # keep the report of the run that actually changed something (a rerun with unchanged config is a no-op)
    rp = os.path.join(DERIVED, 'apply_report.json'); old = json.load(open(rp)) if os.path.exists(rp) else {}
    for m, r in report.items():
        if r.get('changed') or m not in old: old[m] = r
    json.dump(old, open(rp, 'w'), indent=1)


if __name__ == '__main__':
    main()
