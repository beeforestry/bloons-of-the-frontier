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
    water, grass = zones(W, H)
    tile = Image.open(f'{SRC}/map_tropical_island.jpg').convert('RGB')
    tile = tile.resize((tile.width * 3 // 4, tile.height * 3 // 4), Image.LANCZOS)
    gr = Image.new('RGB', (W, H))
    for y in range(0, H, tile.height):
        for x in range(0, W, tile.width): gr.paste(tile, (x, y))
    gr = ImageEnhance.Color(gr).enhance(0.8)
    gr = Image.composite(ImageEnhance.Brightness(gr).enhance(1.06), ImageEnhance.Brightness(gr).enhance(0.86), noise(M['seed'] + 2, 400, 120))
    sand = ImageEnhance.Brightness(tex('sand', 512)).enhance(1.02)
    sea = tex('ocean', 700)
    deep = Image.fromarray(np.asarray(water.filter(ImageFilter.GaussianBlur(70)))).point(lambda v: max(0, (v - 128) * 2))
    sea = Image.composite(ImageEnhance.Brightness(sea).enhance(0.72), Image.blend(sea, Image.new('RGB', (W, H), (60, 190, 200)), 0.3), deep)
    g = Image.composite(gr, sand, grass)
    # wet sand rim + foam
    rim = ImageChops.subtract(water.filter(ImageFilter.MaxFilter(21)), water)
    g = Image.composite(ImageEnhance.Brightness(sand).enhance(0.8), g, rim.point(lambda v: v * 0.6))
    g = Image.composite(sea, g, water)
    foam = ImageChops.subtract(water, water.filter(ImageFilter.MinFilter(9)))
    g = Image.composite(Image.new('RGB', (W, H), (236, 248, 246)), g, foam.point(lambda v: v * 0.7))
    land = ImageChops.invert(water)
    return g, water, land  # block = water, deco_ok = land

def _planks(g, x0, x1, y, w=70):
    d = ImageDraw.Draw(g)
    d.rectangle([x0, y - w / 2 - 4, x1, y + w / 2 + 4], fill=(70, 46, 26))
    for x in range(int(x0), int(x1), 18):
        c = (150 + (x * 7) % 30, 104 + (x * 5) % 20, 60)
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
    return g

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
