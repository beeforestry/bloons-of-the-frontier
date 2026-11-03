"""Tropical Island (t40): painted from the user's tropical assets in art_src/tropical/.
terrain_texture.png zones (water / sand / grass) + terrain_heightmap.png are stretched over the
map rect with the same crop, so the 2D map, the 3D ground and its heightfield line up exactly.
The grass zone is filled with map_tropical_island.jpg (seamless grass tile)."""
import base64, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = f'{ROOT}/art_src/tropical'
OUT = f'{ROOT}/public/assets/maps/tropical'
CROP = (50, 60, 458, 450)  # texture/heightmap px -> whole map rect
WATER_Y, MAXH, BASEH = 0.0, 5.5, 0.35  # metres

def cutout(fn):
    """White-background jpg -> trimmed RGBA (flood fill from the border, soft edge)."""
    im = Image.open(f'{SRC}/{fn}').convert('RGB'); a = np.asarray(im).astype(int)
    white = ((a.min(axis=2) > 222) & (a.max(axis=2) - a.min(axis=2) < 26)).astype(np.uint8) * 255
    m = Image.fromarray(white).copy()
    for xy in [(0, 0), (m.width - 1, 0), (0, m.height - 1), (m.width - 1, m.height - 1)]:
        if m.getpixel(xy) == 255: ImageDraw.floodfill(m, xy, 128)
    bg = Image.fromarray(((np.asarray(m) == 128) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    rgba = im.convert('RGBA'); rgba.putalpha(ImageChops.invert(bg))
    al = np.asarray(rgba)[..., 3]; ys, xs = np.where(al > 30)
    return rgba.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

def zones(W, H):
    t = np.asarray(Image.open(f'{SRC}/terrain_texture.png').convert('RGB').crop(CROP).resize((W, H), Image.BILINEAR)).astype(int)
    water = (t[..., 2] > t[..., 0] + 40) & (t[..., 2] > t[..., 1])
    grass = (t[..., 1] > t[..., 0] + 30) & ~water
    L = lambda b: Image.fromarray((b * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
    return L(water), L(grass)

def paint(M, W, H, tex, noise):
    """t50 warzone: scorched/burnt ground (Poly Haven burned_ground_01) with dry cracked-mud and wet
    mud patches, ashen sand, murky sea. Zones/heights unchanged so the route and grid stay identical."""
    water, grass = zones(W, H)
    burnt = ImageEnhance.Color(tex('burned', 620)).enhance(0.85)
    dry = ImageEnhance.Brightness(tex('dryground', 560)).enhance(0.78)
    mud = ImageEnhance.Brightness(tex('mud', 520)).enhance(0.9)
    hard = lambda n, lo, k: n.point(lambda v: max(0, min(255, (v - lo) * k)))
    gr = Image.composite(dry, burnt, hard(noise(M['seed'] + 31, 260, 60), 150, 5))
    gr = Image.composite(mud, gr, hard(noise(M['seed'] + 32, 200, 50), 155, 5))
    gr = Image.composite(ImageEnhance.Brightness(gr).enhance(1.1), ImageEnhance.Brightness(gr).enhance(0.8), noise(M['seed'] + 2, 400, 120))
    sand = ImageEnhance.Color(Image.blend(tex('sand', 512), Image.new('RGB', (W, H), (104, 98, 90)), 0.5)).enhance(0.6)
    sand = ImageEnhance.Brightness(sand).enhance(0.74)
    sea = tex('ocean', 700)
    sea = Image.blend(ImageEnhance.Color(sea).enhance(0.35), Image.new('RGB', (W, H), (34, 50, 54)), 0.55)
    deep = Image.fromarray(np.asarray(water.filter(ImageFilter.GaussianBlur(70)))).point(lambda v: max(0, (v - 128) * 2))
    sea = Image.composite(ImageEnhance.Brightness(sea).enhance(0.7), sea, deep)
    g = Image.composite(gr, sand, grass)
    rim = ImageChops.subtract(water.filter(ImageFilter.MaxFilter(21)), water)
    g = Image.composite(ImageEnhance.Brightness(sand).enhance(0.7), g, rim.point(lambda v: v * 0.6))
    g = Image.composite(sea, g, water)
    foam = ImageChops.subtract(water, water.filter(ImageFilter.MinFilter(9)))
    g = Image.composite(Image.new('RGB', (W, H), (170, 172, 160)), g, foam.point(lambda v: v * 0.5))
    land = ImageChops.invert(water)
    return g, water, land  # block = water, deco_ok = land

def _planks(g, x0, x1, y, w=70):
    d = ImageDraw.Draw(g)
    d.rectangle([x0, y - w / 2 - 4, x1, y + w / 2 + 4], fill=(34, 26, 20))
    for x in range(int(x0), int(x1), 18):
        if (x * 37) % 11 == 0: continue  # t50: shot-out planks
        c = (92 + (x * 7) % 30, 72 + (x * 5) % 20, 52)
        d.rectangle([x, y - w / 2, x + 15, y + w / 2], fill=c); d.line([(x + 15, y - w / 2), (x + 15, y + w / 2)], fill=(80, 54, 30), width=2)
    for x in range(int(x0) + 6, int(x1), 90):
        for s in (-1, 1): d.ellipse([x - 8, y + s * (w / 2 + 2) - 8, x + 8, y + s * (w / 2 + 2) + 8], fill=(92, 62, 36), outline=(50, 32, 18))

def post(M, g, lanes):
    """Start dock (west, lane entry) and end dock (east, behind the HQ, flag stamped later)."""
    sy = lanes[0][0][1]; _planks(g, -10, M['dockIn'], sy)
    hx, hy = M['hq']; _planks(g, hx + 60, M['width'] if 'width' in M else 2208, hy, 80)
    d = ImageDraw.Draw(g)  # mooring balloon at the start dock (where the bloons come ashore)
    bx, by = 70, sy - 70
    d.line([(bx, by + 36), (bx + 6, sy - 20)], fill=(60, 40, 20), width=3)
    d.ellipse([bx - 26, by - 34, bx + 26, by + 34], fill=(225, 50, 45), outline=(120, 20, 20), width=3)
    d.ellipse([bx - 14, by - 22, bx - 4, by - 8], fill=(255, 150, 140))
    return war_decals(M, g, lanes)

# ---------------------------------------------------------------- t50 warzone decals + sprites
V3 = f'{ROOT}/public/assets/v3'; MIL = f'{ROOT}/art_src/military/render'
def _lane_d(p, lanes):
    best = 1e9
    for l in lanes:
        for i in range(len(l) - 1):
            (ax, ay), (bx, by) = l[i], l[i + 1]; dx, dy = bx - ax, by - ay
            t = max(0, min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy + 1e-9)))
            best = min(best, math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy))
    return best

def _blob(r, seed, fill, soft=0.35):
    rng = np.random.default_rng(seed); n = 14; pts = []
    for i in range(n):
        a = i / n * math.tau; rr = r * (0.6 + 0.4 * rng.random()); pts.append((r * 1.3 + math.cos(a) * rr, r * 1.3 + math.sin(a) * rr * 0.8))
    m = Image.new('L', (int(r * 2.6), int(r * 2.6)), 0); ImageDraw.Draw(m).polygon(pts, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(max(1, r * soft * 0.3)))
    return m

def war_decals(M, g, lanes):
    """Craters, scorch marks and oil stains on land (off the lane), oil slicks at sea. Painted into the
    ground itself, so they also show on the 3D ground (ground.jpg is saved after this)."""
    W, H = g.size; rng = np.random.default_rng(M['seed'] + 50); pw = M['pathWidth']
    water, _ = zones(W, H); hx, hy = M['hq']
    crater = Image.open(f'{V3}/fx_crater.webp').convert('RGBA')
    ca = np.asarray(crater).astype(np.float32); lum = ca[..., :3].mean(axis=2, keepdims=True)
    ca[..., :3] = ca[..., :3] * 0.12 + lum * 0.55 * np.array([1.0, 0.9, 0.8]); crater = Image.fromarray(ca.clip(0, 255).astype(np.uint8))
    ok = lambda x, y, r, sea=False: (0 < x < W and 0 < y < H and (water.getpixel((int(x), int(y))) > 200) == sea
                                     and (sea or _lane_d((x, y), lanes) > pw / 2 + r + 8) and math.hypot(x - hx, y - hy) > 200 + r)
    def place(n, rmin, rmax, sea=False):
        out, tries = [], 0
        while len(out) < n and tries < 4000:
            tries += 1; x, y, r = rng.uniform(0, W), rng.uniform(0, H), rng.uniform(rmin, rmax)
            if ok(x, y, r, sea) and all(math.hypot(x - a, y - b) > r + c for a, b, c in out): out.append((x, y, r))
        return out
    # scorch: big soft dark burns
    for i, (x, y, r) in enumerate(place(34, 50, 130)):
        m = _blob(r, i, 255, 1.2).point(lambda v: int(v * 0.55))
        g.paste(Image.new('RGB', m.size, (14, 12, 10)), (int(x - m.width / 2), int(y - m.height / 2)), m)
    # craters (scorched rim + dark bowl)
    for i, (x, y, r) in enumerate(place(24, 34, 92)):
        c = crater.resize((int(r * 2.2), int(r * 1.6)), Image.LANCZOS)
        if i % 2: c = c.transpose(Image.FLIP_LEFT_RIGHT)
        rim = _blob(r * 1.25, 100 + i, 255, 1.0).point(lambda v: int(v * 0.5))
        g.paste(Image.new('RGB', rim.size, (22, 18, 14)), (int(x - rim.width / 2), int(y - rim.height / 2)), rim)
        rg = g.convert('RGBA'); rg.alpha_composite(c, (int(x - c.width / 2), int(y - c.height / 2))); g = rg.convert('RGB')
    # oil stains: glossy black with a faint oily sheen ring
    for i, (x, y, r) in enumerate(place(16, 16, 46)):
        m = _blob(r, 200 + i, 255, 0.5)
        ring = ImageChops.subtract(m.filter(ImageFilter.MaxFilter(5)), m).point(lambda v: int(v * 0.5))
        g.paste(Image.new('RGB', m.size, (88, 64, 104)), (int(x - m.width / 2), int(y - m.height / 2)), ring)
        g.paste(Image.new('RGB', m.size, (8, 8, 10)), (int(x - m.width / 2), int(y - m.height / 2)), m.point(lambda v: int(v * 0.85)))
    # oil slicks on the sea
    for i, (x, y, r) in enumerate(place(7, 60, 150, sea=True)):
        m = _blob(r, 300 + i, 255, 1.5).point(lambda v: int(v * 0.6))
        g.paste(Image.new('RGB', m.size, (16, 18, 20)), (int(x - m.width / 2), int(y - m.height / 2)), m)
    return g

def char(im, k=0.32, rust=0.0, seed=0):
    """Burnt look for an RGBA sprite: darken + desaturate toward charcoal, soot blotches, optional rust."""
    a = np.asarray(im.convert('RGBA')).astype(np.float32); rgb = a[..., :3]; lum = rgb.mean(axis=2, keepdims=True)
    out = rgb * k * 0.5 + lum * k * np.array([1.0, 0.93, 0.86])
    rng = np.random.default_rng(seed); h, w = lum.shape[:2]
    n = np.asarray(Image.fromarray((rng.random((h // 12 + 2, w // 12 + 2)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(np.float32)[..., None] / 255
    out = out * (0.55 + 0.6 * n)
    if rust: out = out * (1 - rust * (n > 0.62)) + rust * (n > 0.62) * np.array([120, 62, 30]) * (lum / 255 + 0.3)
    a[..., :3] = out.clip(0, 255); return Image.fromarray(a.astype(np.uint8))

def burnt_palm(im, seed):
    """Palm cut-out -> dead/burnt: green fronds turn brown-black and get torn (holes), trunk charred."""
    a = np.asarray(im.convert('RGBA')).astype(np.float32); r, gch, b = a[..., 0], a[..., 1], a[..., 2]
    import colorsys
    hsv = np.asarray(im.convert('RGB').convert('HSV')).astype(np.float32)
    frond = (hsv[..., 0] > 40) & (hsv[..., 0] < 130) & (hsv[..., 1] > 40)  # PIL hue 0..255: yellow-green..cyan
    lum = a[..., :3].mean(axis=2)
    a[..., :3] = np.where(frond[..., None], lum[..., None] * np.array([0.62, 0.48, 0.32]), a[..., :3] * 0.38)
    rng = np.random.default_rng(seed); h, w = lum.shape
    holes = np.asarray(Image.fromarray((rng.random((h // 9 + 2, w // 9 + 2)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)) > 150
    a[..., 3] = np.where(frond & holes, 0, a[..., 3]); return Image.fromarray(a.clip(0, 255).astype(np.uint8))

def barbed_wire(w=320, h=120):
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for x in (10, w // 2, w - 10): d.line([(x, h * 0.2), (x + 3, h - 6)], fill=(46, 34, 24, 255), width=6)
    for i in range(26):  # concertina coil loops
        cx = 14 + i * (w - 28) / 25
        d.ellipse([cx - 16, h * 0.18, cx + 16, h - 10], outline=(40, 40, 38, 255), width=3)
        d.arc([cx - 16, h * 0.18, cx + 16, h - 10], 200, 300, fill=(150, 146, 136, 255), width=1)
    for i in range(40):
        x = 8 + i * (w - 16) / 39; y = h * (0.3 + 0.4 * ((i * 7) % 5) / 5)
        d.line([(x - 3, y - 3), (x + 3, y + 3)], fill=(40, 40, 38, 255), width=1); d.line([(x - 3, y + 3), (x + 3, y - 3)], fill=(40, 40, 38, 255), width=1)
    return im

def war_sprites(DECO):
    trim = lambda im: im.crop(im.getbbox())
    DECO['bpalm'] = burnt_palm(DECO['palm'], 1); DECO['bpalm2'] = burnt_palm(DECO['palm2'], 2)
    DECO['wtank'] = trim(char(Image.open(f'{MIL}/tank_1.png'), 0.42, 0.35, 3))
    DECO['wtank2'] = trim(char(Image.open(f'{MIL}/tank_2.png'), 0.36, 0.45, 4).rotate(28, expand=True, resample=Image.BICUBIC))
    DECO['wheli'] = trim(char(Image.open(f'{MIL}/heli_1.png'), 0.38, 0.3, 5).rotate(-14, expand=True, resample=Image.BICUBIC))
    bunker = Image.open(f'{V3}/env_bunker.webp').convert('RGBA')
    DECO['bunker'] = trim(char(bunker, 0.62, 0.0, 6))
    DECO['sandbags'] = trim(Image.open(f'{MIL}/prop_sandbags.png').convert('RGBA'))
    DECO['wire'] = barbed_wire()
    DECO['deadtree2'] = char(DECO['deadtree'], 0.6, 0, 7)
    DECO['trock'] = char(DECO['trock'], 0.55, 0, 8)
    return dict(bpalm=190, bpalm2=200, wtank=200, wtank2=190, wheli=250, bunker=170, sandbags=120, wire=170, deadtree2=150)

def heightfield(M, W, H, lanes, pw, cols=97, rows=66):
    """Quantised heights (metres*40, uint8) on a cols x rows lattice spanning [0,W]x[0,H].
    Island = heightmap * land mask; water sinks below WATER_Y; the lane is flattened across its
    width to a smoothed along-path profile (and never under water: docks)."""
    hm = Image.open(f'{SRC}/terrain_heightmap.png').convert('L').crop(CROP).resize((cols, rows), Image.BILINEAR)
    water, _ = zones(W, H)
    wl = np.asarray(water.resize((cols, rows), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.0))).astype(np.float32) / 255
    h = BASEH + np.asarray(hm).astype(np.float32) / 255 * MAXH
    h = h * (1 - wl) + (-1.2) * wl
    xs = np.linspace(0, W, cols); ys = np.linspace(0, H, rows)
    def hat(x, y):
        fx = min(cols - 1.001, max(0, x / W * (cols - 1))); fy = min(rows - 1.001, max(0, y / H * (rows - 1)))
        i, j = int(fx), int(fy); u, v = fx - i, fy - j
        return (h[j, i] * (1 - u) + h[j, i + 1] * u) * (1 - v) + (h[j + 1, i] * (1 - u) + h[j + 1, i + 1] * u) * v
    out = h.copy()
    for lane in lanes:
        P = np.array(lane, np.float32)
        prof = np.array([max(BASEH, hat(x, y)) for x, y in P])
        k = 9; prof = np.convolve(np.pad(prof, k, mode='edge'), np.ones(2 * k + 1) / (2 * k + 1), mode='same')[k:-k]
        for j, y in enumerate(ys):
            for i, x in enumerate(xs):
                dd = np.hypot(P[:, 0] - x, P[:, 1] - y); n = int(dd.argmin()); d = dd[n]
                w = min(1, max(0, 1 - (d - pw / 2 - 10) / 70))
                if w > 0: out[j, i] = out[j, i] * (1 - w) + prof[n] * w
    q = np.clip(np.round((out + 1.6) * 40), 0, 255).astype(np.uint8)  # offset 1.6 m so water depth fits
    return dict(cols=cols, rows=rows, off=-1.6, scale=1 / 40, water=WATER_Y, data=base64.b64encode(q.tobytes()).decode())
