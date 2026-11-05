"""Procedural map compositor (Phase 3, big maps).
Paints each map from generated painterly textures + cut-out decoration sprites along
exact lane polylines, so lane data / buildable grid are exact (no tracing).
  python art_src/tools/compose_maps.py
Writes public/assets/maps/<id>.jpg and src/data/maps.generated.json."""
import json, math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ART = os.path.join(ROOT, 'art_src')
CELL, COLS, ROWS = 48, 46, 31
W, H = CELL * COLS, CELL * ROWS  # 2208 x 1488
HQ_R = 96  # HQ footprint half size
PAD = 48   # pad half size (2x2 cells)

def tex(name, scale=768):
    t = Image.open(f'{ART}/tex/{name}.jpg').convert('RGB').resize((scale, scale), Image.LANCZOS)
    # mirror tiling -> seamless
    m = Image.new('RGB', (scale * 2, scale * 2))
    m.paste(t, (0, 0)); m.paste(t.transpose(Image.FLIP_LEFT_RIGHT), (scale, 0))
    m.paste(t.transpose(Image.FLIP_TOP_BOTTOM), (0, scale)); m.paste(t.rotate(180), (scale, scale))
    out = Image.new('RGB', (W, H))
    for y in range(0, H, scale * 2):
        for x in range(0, W, scale * 2): out.paste(m, (x, y))
    return out

def noise(seed, s=180, blur=60):
    rng = np.random.default_rng(seed)
    n = Image.fromarray((rng.random((H // s + 3, W // s + 3)) * 255).astype(np.uint8)).resize((W + 3 * s, H + 3 * s), Image.BICUBIC)
    return n.crop((s, s, s + W, s + H)).filter(ImageFilter.GaussianBlur(blur))

def catmull(pts, step=26):
    out = []
    P = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        L = math.dist(p1, p2); n = max(2, int(L / step))
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append([round(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3), 1) for j in (0, 1)])
    out.append(list(pts[-1]))
    return out

def seg_dist(p, a, b):
    ax, ay = a; bx, by = b; px, py = p
    dx, dy = bx - ax, by - ay; L = dx * dx + dy * dy or 1
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)
def poly_dist(p, wp): return min(seg_dist(p, wp[i], wp[i + 1]) for i in range(len(wp) - 1))

def line_mask(polys, width, rough_seed=None):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for wp in polys:
        d.line([tuple(p) for p in wp], fill=255, width=int(width), joint='curve')
        for p in (wp[0], wp[-1]):
            d.ellipse([p[0] - width / 2, p[1] - width / 2, p[0] + width / 2, p[1] + width / 2], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(width * 0.16))
    if rough_seed is not None:  # organic edge
        n = np.asarray(noise(rough_seed, 40, 8)).astype(np.float32) / 255
        a = np.asarray(m).astype(np.float32) / 255
        a = np.clip((a - 0.5 + (n - 0.5) * 0.55) * 3.2 + 0.5, 0, 1)
        m = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
    return m

DECO = {}
def deco_sheet(name, keys):
    im = Image.open(f'{ART}/cut/{name}.png').convert('RGBA'); w, h = im.size
    for r in range(2):
        for c in range(4):
            cell = im.crop((c * w // 4, r * h // 2, (c + 1) * w // 4, (r + 1) * h // 2))
            a = np.asarray(cell)[..., 3]; ys, xs = np.where(a > 20)
            DECO[keys[r][c]] = cell.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
deco_sheet('deco_garden', [['oak', 'pine', 'hedge', 'rose'], ['boulders', 'mossrock', 'fence', 'stump']])
deco_sheet('deco_jungle', [['palm', 'rtree', 'fern', 'monstera'], ['vinerock', 'log', 'bamboo', 'redflower']])
deco_sheet('deco_fortress', [['wtower', 'wall', 'brokenwall', 'rubble'], ['banner', 'cart', 'barrels', 'deadtree']])
deco_sheet('deco_morro', [['garita', 'lighthouse', 'rampart', 'cannon'], ['palm2', 'searocks', 'prflag', 'cannonballs']])
SIZE = dict(garita=150, lighthouse=330, rampart=250, cannon=110, palm2=200, searocks=140, prflag=150, cannonballs=96,
            oak=200, pine=150, hedge=110, rose=100, boulders=120, mossrock=86, fence=120, stump=96,
            palm=190, rtree=210, fern=120, monstera=120, vinerock=116, log=130, bamboo=120, redflower=100,
            wtower=180, wall=220, brokenwall=160, rubble=110, banner=120, cart=130, barrels=116, deadtree=150)
import sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tropical
# t40 user assets (file names are swapped: asset_palm_tree.jpg is a rock pile, asset_rock_cluster.jpg a flowering bush)
DECO['trock'] = tropical.cutout('asset_palm_tree.jpg'); DECO['tbush'] = tropical.cutout('asset_rock_cluster.jpg')
SIZE.update(trock=130, tbush=110)
SIZE.update(tropical.war_sprites(DECO))  # t50 warzone (burnt palms, wrecks, bunkers, wire, sandbags)

def poly_mask(polys, seed, blur=14, rough=0.55):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for P in polys: d.polygon([tuple(p) for p in P], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(blur))
    n = np.asarray(noise(seed, 40, 8)).astype(np.float32) / 255
    a = np.asarray(m).astype(np.float32) / 255
    a = np.clip((a - 0.5 + (n - 0.5) * rough) * 3.2 + 0.5, 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))

def stamp(img, key, x, y, scale=1.0, flip=False):
    s = DECO[key]; k = SIZE[key] * scale / max(s.size)
    s = s.resize((max(1, int(s.width * k)), max(1, int(s.height * k))), Image.LANCZOS)
    if flip: s = s.transpose(Image.FLIP_LEFT_RIGHT)
    # contact shadow
    sh = Image.new('L', img.size, 0); d = ImageDraw.Draw(sh)
    rw, rh = s.width * 0.42, s.height * 0.13
    d.ellipse([x - rw + 10, y - rh + 4, x + rw + 10, y + rh + 4], fill=120)
    sh = sh.filter(ImageFilter.GaussianBlur(10))
    img.paste(Image.new('RGB', img.size, (10, 18, 8)), (0, 0), sh)
    rgba = img.convert('RGBA'); rgba.alpha_composite(s, (int(x - s.width / 2), int(y - s.height * 0.92)))
    return rgba.convert('RGB'), max(s.width, s.height) * 0.36

def compose(M):
    rnd = random.Random(M['seed'])
    lanes = [catmull(l) for l in M['lanes']]
    pw = M['pathWidth']
    hq = M['hq']; pads = M['pads']
    # ---- ground
    g = tex(M['ground'])
    if M.get('ground2'):
        g2 = tex(M['ground2'], 640)
        g = Image.composite(g2, g, noise(M['seed'] + 1, 260, 70).point(lambda v: max(0, min(255, (v - 120) * 4))))
    if M.get('tint'): g = Image.blend(g, Image.new('RGB', g.size, M['tint']), 0.12)
    lo = noise(M['seed'] + 2, 400, 120)  # large-scale value variation
    g = Image.composite(ImageEnhance.Brightness(g).enhance(1.12), ImageEnhance.Brightness(g).enhance(0.84), lo)
    block = deco_ok = None
    if M.get('painter'):  # hand-built map painter (El Morro v2)
        g, block, deco_ok = M['painter'](M, W, H, tex, noise)
    water_polys = [catmull(w) for w in M.get('water', [])]
    if water_polys:
        wm = line_mask(water_polys, M['waterWidth'], M['seed'] + 3)
        bank = line_mask(water_polys, M['waterWidth'] + 44, M['seed'] + 4)
        g = Image.composite(ImageEnhance.Brightness(tex('dirt', 512)).enhance(0.62), g, bank)
        g = Image.composite(tex('water', 640), g, wm)
    ocean = None
    if M.get('ocean'):  # coastline: deep sea, foam line, sand beach
        ocean = poly_mask(M['ocean'], M['seed'] + 8, 18)
        beach = poly_mask(M['ocean'], M['seed'] + 9, 60, 0.35).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(16))
        g = Image.composite(ImageEnhance.Brightness(tex('sand', 512)).enhance(0.98), g, beach)
        sea = tex('ocean', 700)
        deep = noise(M['seed'] + 10, 300, 90)
        sea = Image.composite(ImageEnhance.Brightness(sea).enhance(0.78), sea, deep)
        g = Image.composite(sea, g, ocean)
        foam = ImageChops.subtract(poly_mask(M['ocean'], M['seed'] + 8, 30), ocean.filter(ImageFilter.MaxFilter(9)))
        g = Image.composite(Image.new('RGB', g.size, (236, 246, 244)), g, foam.point(lambda v: min(255, v * 2.4)))
    for i, P in enumerate(M.get('masonry', [])):  # fortress floor + wall tops
        mm = poly_mask([P], M['seed'] + 20 + i, 6, 0.2)
        rim = ImageChops.subtract(mm.filter(ImageFilter.MaxFilter(25)), mm)
        g = Image.composite(ImageEnhance.Brightness(tex('sandstone', 520)).enhance(0.62), g, rim)
        g = Image.composite(tex('sandstone', 520), g, mm)
    # ---- base plaza
    pm = Image.new('L', (W, H), 0) if M.get('noPlaza') else Image.new('L', (W, H), 0); d = ImageDraw.Draw(pm)
    d.ellipse([hq[0] - 300, hq[1] - 290, hq[0] + 300, hq[1] + 290], fill=255)
    pm = pm.filter(ImageFilter.GaussianBlur(40)) if not M.get('noPlaza') else pm
    if not M.get('noPlaza'): g = Image.composite(ImageEnhance.Brightness(tex(M.get('plaza', 'stone'), 420)).enhance(0.95), g, pm)
    # ---- lanes: dark rut edge, then road
    road = tex(M['road'], 512)
    ra = M.get('roadAlpha', 1.0)  # t53: <1 lets the real aerial photo show through the painted road
    edge = line_mask(lanes, pw + 22, M['seed'] + 5)
    g = Image.composite(ImageEnhance.Brightness(g).enhance(0.62), g, edge.point(lambda v: v * 0.7 * ra))
    rm = line_mask(lanes, pw, M['seed'] + 6).point(lambda v: v * ra)
    if water_polys:  # fords: road slightly transparent over water
        rm = ImageChops.multiply(rm, ImageChops.invert(wm.point(lambda v: v * 0.25)))
    g = Image.composite(road, g, rm)
    # centre wear line
    wear = line_mask(lanes, pw * 0.35, M['seed'] + 7).point(lambda v: v * 0.25)
    g = Image.composite(ImageEnhance.Brightness(g).enhance(1.15), g, wear)
    if M.get('post'): g = M['post'](M, g, lanes)
    if M.get('terrain'):  # 3D ground for Possess: the painted map without the stamped props (they become billboards)
        gdir = f"{ROOT}/public/assets/maps/{M['id']}" if M.get('groundFull') else tropical.OUT
        os.makedirs(gdir, exist_ok=True)
        (g if M.get('groundFull') else g.resize((W // 2, H // 2), Image.LANCZOS)).save(f'{gdir}/ground.jpg', quality=M.get('groundQ', 82), optimize=True)
        for k in {'prflag'}:  # t50: only the flag stays a billboard; plants/wrecks are 3D models
            s_ = DECO[k].copy(); s_.thumbnail((256, 256), Image.LANCZOS); s_.save(f'{tropical.OUT}/{k}.png', optimize=True)
    # ---- decorations
    blocked = []  # (x, y, r)
    def clear(x, y, r):
        if not (r * 0.5 < x < W - r * 0.5 and r * 0.6 < y < H): return False
        if min(poly_dist((x, y), l) for l in lanes) < pw / 2 + r + 18: return False
        if water_polys and min(poly_dist((x, y), w) for w in water_polys) < M['waterWidth'] / 2 + r: return False
        if ocean is not None and ocean.getpixel((int(min(W - 1, x)), int(min(H - 1, y)))) > 20: return False
        if math.hypot(x - hq[0], y - hq[1]) < 330 + r: return False
        if deco_ok is not None and deco_ok.getpixel((int(min(W - 1, max(0, x))), int(min(H - 1, max(0, y))))) < 128: return False
        for bx, by, br in blocked:
            if math.hypot(x - bx, y - by) < (r + br) * 0.85: return False
        return True
    if M.get('roadEdge') is False: pass
    ps = M.get('propScale', 1.0)  # t56: real-scale maps (Isla de Cabras) shrink props to true size
    for (key, x, y, sc) in M.get('fixed', []):
        if M.get('noStamp'): r = SIZE[key] * sc * ps * 0.36
        else: g, r = stamp(g, key, x, y, sc)
        blocked.append((x, y, r))
    items = []
    for key, n in M.get('must', []):  # t50: guaranteed counts (wrecks, bunkers...), same clearance rules
        got = t2 = 0
        while got < n and t2 < 4000:
            t2 += 1; sc = rnd.uniform(0.9, 1.1) * ps; r = SIZE[key] * sc * 0.36; x, y = rnd.uniform(0, W), rnd.uniform(0, H)
            if clear(x, y, r): items.append((key, x, y, sc)); blocked.append((x, y, r)); got += 1
    tries = 0
    while len(items) < M['decoCount'] and tries < 6000:
        tries += 1
        key = rnd.choice(M['deco'])
        sc = rnd.uniform(0.8, 1.15) * ps; r = SIZE[key] * sc * 0.36
        # bias to borders (forest frame)
        if rnd.random() < 0.55:
            side = rnd.randrange(4)
            x = rnd.uniform(0, W) if side < 2 else (rnd.uniform(20, 170) if side == 2 else rnd.uniform(W - 170, W - 20))
            y = rnd.uniform(0, H) if side >= 2 else (rnd.uniform(50, 180) if side == 0 else rnd.uniform(H - 140, H - 10))
        else:
            x, y = rnd.uniform(0, W), rnd.uniform(0, H)
        if clear(x, y, r): items.append((key, x, y, sc)); blocked.append((x, y, r))
    for key, x, y, sc in sorted(items, key=lambda t: t[2]):
        if not M.get('noStamp'): g, _ = stamp(g, key, x, y, sc, rnd.random() < 0.5)
    props = [[k, round(x), round(y), round(SIZE[k] * sc)] for (k, x, y, sc) in list(M.get('fixed', [])) + items]
    # vignette
    v = Image.new('L', (W, H), 0); d = ImageDraw.Draw(v); d.rectangle([60, 60, W - 60, H - 60], fill=255)
    v = v.filter(ImageFilter.GaussianBlur(90))
    g = Image.composite(g, ImageEnhance.Brightness(g).enhance(0.7), v)
    os.makedirs(f'{ROOT}/public/assets/maps', exist_ok=True)
    g.save(f'{ROOT}/public/assets/maps/{M["id"]}.jpg', quality=80, optimize=True, progressive=True)
    # ---- grid
    rows = []
    for row in range(ROWS):
        line = ''
        for col in range(COLS):
            cx, cy = (col + 0.5) * CELL, (row + 0.5) * CELL
            ok = min(poly_dist((cx, cy), l) for l in lanes) > pw / 2 + CELL * 0.42
            if ok and water_polys: ok = min(poly_dist((cx, cy), w) for w in water_polys) > M['waterWidth'] / 2 + CELL * 0.35
            if ok and ocean is not None and ocean.getpixel((int(cx), int(cy))) > 60: ok = False
            if ok and block is not None and block.getpixel((int(cx), int(cy))) > 60: ok = False
            if ok and abs(cx - hq[0]) < HQ_R + 30 and abs(cy - hq[1]) < HQ_R + 30: ok = False
            if ok:
                for px, py in pads:
                    if abs(cx - px) < PAD + 20 and abs(cy - py) < PAD + 20: ok = False; break
            if ok:
                for bx, by, br in blocked:
                    if math.hypot(cx - bx, cy - (by - br * 0.6)) < br * 0.95 + 10: ok = False; break
            line += '1' if ok else '0'
        rows.append(line)
    land = None
    if M.get('fineLand'):  # t56 free placement: land bits at fineLand px (no lane clearance; checked per spot in game)
        import base64
        R = M['fineLand']; fc, fr = math.ceil(W / R), math.ceil(H / R); bits = np.zeros(fc * fr, np.uint8)
        for row in range(fr):
            for col in range(fc):
                cx, cy = (col + 0.5) * R, (row + 0.5) * R; ok = True
                if ocean is not None and ocean.getpixel((int(min(W - 1, cx)), int(min(H - 1, cy)))) > 60: ok = False
                if ok and block is not None and block.getpixel((int(min(W - 1, cx)), int(min(H - 1, cy)))) > 60: ok = False
                if ok and abs(cx - hq[0]) < HQ_R + 20 and abs(cy - hq[1]) < HQ_R + 20: ok = False
                if ok and any(abs(cx - px) < PAD + 12 and abs(cy - py) < PAD + 12 for px, py in pads): ok = False
                bits[row * fc + col] = ok
        land = dict(land=base64.b64encode(np.packbits(bits, bitorder='little').tobytes()).decode(), landRes=R)
    # debug overlay
    dbg = g.copy().convert('RGBA'); ov = Image.new('RGBA', dbg.size); d = ImageDraw.Draw(ov)
    for r, line in enumerate(rows):
        for c, ch in enumerate(line):
            if ch == '1': d.rectangle([c * CELL + 2, r * CELL + 2, c * CELL + CELL - 3, r * CELL + CELL - 3], outline=(255, 255, 255, 110))
    for l in lanes: d.line([tuple(p) for p in l], fill=(255, 0, 0, 200), width=3)
    d.rectangle([hq[0] - HQ_R, hq[1] - HQ_R, hq[0] + HQ_R, hq[1] + HQ_R], outline=(0, 160, 255, 255), width=4)
    for px, py in pads: d.rectangle([px - PAD, py - PAD, px + PAD, py + PAD], outline=(255, 220, 0, 255), width=4)
    dbg.alpha_composite(ov); dbg.convert('RGB').resize((W // 2, H // 2)).save(f'/tmp/chk/map_{M["id"]}.jpg', quality=80)
    return dict(id=M['id'], name=M['name'], image=f'assets/maps/{M["id"]}.jpg', width=W, height=H, pathWidth=pw,
                waypoints=lanes[0], lanes=lanes, hq=hq, pads=pads, rally=M['rally'],
                grid=dict(cell=CELL, originX=0, originY=0, cols=COLS, rows=ROWS, buildable=rows, **(land or {})),
                **({'envs': M['envs']} if M.get('envs') else {}), **({'deco': props} if not M.get('terrain') else {}), **({'flavor': M['flavor']} if M.get('flavor') else {}),
                **({'terrain': dict(M['terrain'](M, W, H, lanes, pw), ground=f"assets/maps/{M['id'] if M.get('groundFull') else 'tropical'}/ground.jpg", props=props)} if M.get('terrain') else {}),
                **({'mpp': M['mpp']} if M.get('mpp') else {}), **({'walls': M['walls'](W, H)} if M.get('walls') else {}))

HQ_G = [1980, 744]
import sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import morro_v2, morro_real, tropical_real
MORRO_HQ = [1300, 830]
MORRO_PADS = [[1120, 594], [1096, 1002], [1300, 640], [1300, 1030], [1520, 900], [1670, 880]]  # t53: flat terraces inside the real fort
def ring(hq):  # 6 pads around HQ (left side kept open for lane entry)
    x, y = hq
    return [[x - 140, y - 210], [x + 50, y - 230], [x + 165, y - 90], [x + 165, y + 100], [x + 50, y + 235], [x - 140, y + 215]]
MAPS = [
    dict(id='garden', name='Garden Path', seed=11, ground='grass', road='dirt', pathWidth=58, decoCount=70,
         deco=['oak', 'oak', 'pine', 'hedge', 'rose', 'boulders', 'mossrock', 'stump', 'stump'],
         hq=HQ_G, pads=ring(HQ_G), rally=[1660, 744],
         lanes=[
             [[-80, 300], [260, 300], [420, 480], [380, 700], [560, 820], [800, 700], [860, 420], [1040, 260], [1300, 300], [1380, 560], [1560, 700], [1840, 744]],
             [[-80, 1220], [240, 1210], [420, 1020], [700, 1080], [900, 1300], [1200, 1300], [1300, 1060], [1480, 900], [1600, 790], [1840, 744]],
         ]),
    dict(id='jungle', name='Jungle River', seed=23, ground='jungle', road='dirt', tint=(30, 60, 20), pathWidth=58, decoCount=80,
         deco=['palm', 'palm', 'rtree', 'fern', 'monstera', 'vinerock', 'log', 'bamboo', 'redflower'],
         hq=HQ_G, pads=ring(HQ_G), rally=[1660, 744],
         water=[[[700, -80], [760, 300], [620, 620], [760, 900], [700, 1200], [820, 1580]]], waterWidth=130,
         lanes=[
             [[300, -80], [320, 220], [560, 360], [900, 240], [1180, 340], [1260, 560], [1540, 640], [1840, 744]],
             [[-80, 760], [240, 720], [420, 560], [600, 760], [900, 760], [1100, 900], [1400, 820], [1840, 744]],
             [[260, 1570], [300, 1260], [560, 1120], [900, 1260], [1220, 1260], [1440, 1080], [1580, 860], [1840, 744]],
         ]),
    dict(id='fortress', name='Stone Fortress', seed=37, ground='grass', ground2='dirt', tint=(120, 110, 60), road='stone', pathWidth=60, decoCount=55,
         deco=['rubble', 'brokenwall', 'banner', 'cart', 'barrels', 'deadtree', 'deadtree', 'boulders', 'pine'],
         hq=HQ_G, pads=ring(HQ_G), rally=[1640, 744],
         fixed=[['wtower', 1760, 470, 1.0], ['wtower', 1760, 1120, 1.0], ['wall', 2080, 360, 0.9], ['wall', 2080, 1250, 0.9]],
         lanes=[  # branching road: shared trunk, splits around the keep ruins, rejoins at the gate
             [[-80, 740], [300, 740], [520, 600], [700, 360], [980, 260], [1240, 380], [1340, 620], [1560, 720], [1840, 744]],
             [[-80, 740], [300, 740], [520, 900], [700, 1140], [980, 1240], [1240, 1110], [1340, 860], [1560, 770], [1840, 744]],
         ]),
    # Castillo San Felipe del Morro v2 (t33u/t34u, repainted from aerial references): the
    # triangular fort points east into the Atlantic; harbor bay to the south; esplanade lawn
    # west; Old San Juan along the land edge. Lanes: diagonal lawn footpath through the west
    # gate (two city roads that merge at the bridge), and a sea landing from the harbor bay up
    # the south glacis and ramp. The breakwater jetty off the point is scenery.
    # t53: El Morro rebuilt from REAL public-domain data (see morro_real.py): NOAA NGS 2017 aerial photo as the
    # background, USGS 3DEP 1 m lidar as the first-person terrain, 0.25 m/px true scale. Lanes re-traced on the photo:
    # (0) the esplanade footpath to the roundel, over the moat bridge and through the gate; (1) a landing on the
    # north-shore rocks, up the brushy slope and along the glacis to the bridge; (2) in from Calle Norzagaray
    # (city edge) diagonally across the lawn to the roundel. HQ in the fort's courtyard.
    dict(id='morro', name='El Morro, San Juan', seed=53, ground='grass', road='stone', pathWidth=58, decoCount=0, noPlaza=True,
         painter=morro_real.paint, terrain=morro_real.heightfield, walls=morro_real.walls, mpp=morro_real.FRAME['mpp'],
         groundFull=True, groundQ=80, roadAlpha=0.42, deco=['palm2'],
         hq=MORRO_HQ, pads=MORRO_PADS, rally=[1150, 800],
         fixed=[],
         envs=[['garita', 1005, 515], ['garita', 1012, 1062], ['garita', 1790, 925], ['garita', 1500, 585]],
         flavor='morro',
         lanes=[
             [[-80, 735], [200, 733], [500, 748], [800, 765], [940, 775], [1060, 795], [1175, 800]],
             [[1000, 1570], [985, 1420], [925, 1300], [865, 1180], [840, 1050], [868, 905], [940, 790], [1060, 795], [1175, 800]],
             [[-80, 112], [150, 116], [330, 150], [500, 320], [700, 520], [870, 700], [940, 778], [1060, 795], [1175, 800]],
         ]),
    # t56: Tropical Island rebuilt from REAL public-domain data like El Morro: Isla de Cabras (Toa Baja), the islet at the
    # west mouth of San Juan Bay, NOAA NGS Hurricane Maria photo (2017-09-24) + USGS 3DEP 1 m lidar. Post-storm debris
    # and the old lazaretto ruins suit the warzone. Lanes: (0) west beach landing along the shore road; (1) north beach
    # landing past the jetty; (2) amphibious landing across the breakwater lagoon. HQ on the lawn by the park building.
    dict(id='tropical', name='Tropical Island', seed=71, ground='grass', road='dryground', pathWidth=58, decoCount=46, noPlaza=True,
         painter=tropical_real.paint, terrain=tropical_real.heightfield, walls=tropical_real.walls, mpp=tropical_real.FRAME['mpp'],
         groundFull=True, groundQ=80, roadAlpha=0.38, noStamp=True, propScale=0.35, fineLand=6,
         deco=['bpalm', 'bpalm', 'bpalm', 'bpalm2', 'deadtree2', 'trock', 'rubble', 'wire', 'sandbags'],
         must=[('wtank', 2), ('wtank2', 1), ('wheli', 1), ('bunker', 2), ('sandbags', 3), ('wire', 3)],
         hq=[1300, 760], pads=[[1250, 560], [1380, 575], [1490, 860], [1360, 960], [1210, 975], [1570, 860]], rally=[1150, 760],
         fixed=[['prflag', 1420, 700, 0.8]],
         lanes=[[[-80, 560], [200, 565], [500, 545], [760, 520], [900, 560], [1020, 640], [1120, 720], [1185, 760]],
                [[1640, -80], [1630, 250], [1580, 420], [1360, 445], [1130, 515], [1060, 630], [1120, 720], [1185, 760]],
                [[980, 1570], [990, 1320], [985, 1160], [1010, 990], [1080, 860], [1185, 770]]]),
]
os.makedirs('/tmp/chk', exist_ok=True)
# `--only morro` re-composes just that map and merges it into the existing JSON
only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
J = f'{ROOT}/src/data/maps.generated.json'
prev = {m['id']: m for m in json.load(open(J))} if only else {}
out = [compose(M) if not only or M['id'] in only else prev[M['id']] for M in MAPS]
json.dump(out, open(J, 'w'))
for m in out:
    print(m['id'], 'buildable', sum(r.count('1') for r in m['grid']['buildable']), 'kb', os.path.getsize(f'{ROOT}/public/{m["image"]}') // 1024)
