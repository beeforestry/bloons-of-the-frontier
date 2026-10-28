"""El Morro v2 painter (t33u/t34u): repainted from two aerial references (top-down + oblique)
in the game's painterly style. Not a copy: layout cues only (no logos/watermarks).
  * triangular Castillo San Felipe del Morro pointing east into the Atlantic
  * stepped, crenellated sandstone bastions with drop shadows (depth), ramps between levels
  * long central courtyard plaza + sunken reddish-earth courts, lighthouse on the upper level
  * golden-tan cliffs -> dark boulder seawall wrapping the headland, breakwater jetty off the tip
  * heavy surf on the Atlantic (north/east), calmer harbor bay (south)
  * green esplanade lawn (west) with dry moat + bridge, Old San Juan along the land edge:
    pastel houses, the walled cemetery with white tombs by the north shore, long yellow barracks
Returns (image, block_mask, deco_mask)."""
import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance

LAND = [(-40, 205), (240, 190), (520, 168), (820, 150), (1060, 175), (1260, 230), (1470, 300), (1690, 450), (1900, 640), (2045, 845),
        (2020, 950), (1870, 1090), (1660, 1240), (1420, 1350), (1140, 1410), (840, 1430), (520, 1420), (-40, 1430)]
# outer wall of the fort (the triangle) and its stepped interior levels
FORT = [(1150, 330), (1430, 312), (1650, 470), (1870, 680), (1985, 850), (1905, 950), (1700, 1075), (1480, 1195), (1235, 1288),
        (1130, 1150), (1170, 960), (1105, 830), (1170, 690), (1112, 500)]
UPPER = [(1185, 365), (1415, 350), (1530, 445), (1505, 640), (1520, 1060), (1440, 1150), (1250, 1240), (1170, 1140), (1205, 960),
         (1145, 830), (1205, 700), (1150, 510)]          # upper level (west bastions)
MID = [(1505, 470), (1640, 520), (1820, 700), (1720, 760), (1560, 760), (1540, 940), (1700, 1000), (1560, 1110), (1480, 1120), (1500, 640)]
COURT = [(1300, 470), (1405, 462), (1415, 1040), (1312, 1050)]  # long central plaza
SUNKEN = [[(1215, 395), (1330, 390), (1320, 445), (1220, 450)], [(1585, 560), (1680, 610), (1640, 660), (1560, 640)],
          [(1215, 1150), (1290, 1110), (1330, 1180), (1255, 1215)]]
# detached curved breakwater off the point (open water between it and the seawall), like the reference
JETTY = [(2120, 600), (2165, 710), (2190, 840), (2192, 970), (2170, 1090), (2128, 1200), (2070, 1290)]


def P(img_or_size, polys, fill=255, blur=0, width=None):
    m = Image.new('L', img_or_size, 0); d = ImageDraw.Draw(m)
    for p in polys:
        if width: d.line(list(p) + [p[0]], fill=fill, width=width, joint='curve')
        else: d.polygon(list(p), fill=fill)
    return m.filter(ImageFilter.GaussianBlur(blur)) if blur else m


def rough(m, noise, amt=0.5):
    a = np.asarray(m).astype(np.float32) / 255; n = np.asarray(noise).astype(np.float32) / 255
    return Image.fromarray((np.clip((a - 0.5 + (n - 0.5) * amt) * 3 + 0.5, 0, 1) * 255).astype(np.uint8))


def shade(img, f): return ImageEnhance.Brightness(img).enhance(f)
def solid(size, c): return Image.new('RGB', size, c)
def tint(img, c, k): return Image.blend(img, solid(img.size, c), k)


def crenellate(d, poly, col_dark, col_top, w=16, tooth=22):
    """Sawtooth gun-embrasure parapet along a polygon (outer face)."""
    n = len(poly)
    cx = sum(p[0] for p in poly) / n; cy = sum(p[1] for p in poly) / n
    d.line(list(poly) + [poly[0]], fill=col_dark, width=w, joint='curve')
    d.line(list(poly) + [poly[0]], fill=col_top, width=max(2, w // 3), joint='curve')
    for i in range(n):
        (ax, ay), (bx, by) = poly[i], poly[(i + 1) % n]
        L = math.dist((ax, ay), (bx, by)); k = int(L // tooth)
        ux, uy = (bx - ax) / (L or 1), (by - ay) / (L or 1)
        nx, ny = -uy, ux
        if (ax + nx * 10 - cx) ** 2 + (ay + ny * 10 - cy) ** 2 < (ax - cx) ** 2 + (ay - cy) ** 2: nx, ny = -nx, -ny
        for j in range(1, k):
            t = j * tooth
            px, py = ax + ux * t, ay + uy * t
            # embrasure: notch (dark) + merlon (lit)
            q = [(px - ux * 5 + nx * 2, py - uy * 5 + ny * 2), (px + ux * 5 + nx * 2, py + uy * 5 + ny * 2),
                 (px + ux * 2 + nx * 11, py + uy * 2 + ny * 11), (px - ux * 2 + nx * 11, py - uy * 2 + ny * 11)]
            d.polygon(q, fill=col_top if j % 2 else col_dark)


def paint(M, W, H, tex, noise):
    rnd = random.Random(M['seed'] + 99)
    size = (W, H)
    grass = tint(tex('grass'), (40, 110, 30), 0.18)
    lawn_stripes = Image.new('L', size, 0); d = ImageDraw.Draw(lawn_stripes)
    for k in range(-30, 60):  # mowed stripes, diagonal like the esplanade
        x0 = k * 70; d.polygon([(x0, 0), (x0 + 35, 0), (x0 + 35 - H * 0.55, H), (x0 - H * 0.55, H)], fill=60)
    lawn_stripes = lawn_stripes.filter(ImageFilter.GaussianBlur(6))
    g = Image.composite(shade(grass, 1.1), grass, lawn_stripes)
    lo = noise(M['seed'] + 2, 400, 120)
    g = Image.composite(shade(g, 1.08), shade(g, 0.9), lo)
    # ---------------- water: Atlantic (deep, whitecaps) vs harbor bay (calmer, greener)
    sea = tex('ocean', 700)
    atl = tint(shade(sea, 0.62), (8, 50, 90), 0.35)
    atl = Image.composite(shade(atl, 1.25), atl, noise(M['seed'] + 10, 260, 70))
    bay = tint(shade(sea, 0.86), (30, 120, 120), 0.25)
    split = Image.new('L', size, 0); d = ImageDraw.Draw(split)
    d.polygon([(1985, 870), (2400, 1100), (2400, 1600), (-50, 1600), (-50, 1380)], fill=255)
    water = Image.composite(bay, atl, split.filter(ImageFilter.GaussianBlur(120)))
    caps = noise(M['seed'] + 11, 9, 1).resize((W // 3, H)).resize(size).point(lambda v: 255 if v > 214 else 0).filter(ImageFilter.GaussianBlur(1.5))
    caps = ImageChops.multiply(caps, ImageChops.invert(split.filter(ImageFilter.GaussianBlur(160))))
    water = Image.composite(solid(size, (220, 236, 240)), water, caps.point(lambda v: v * 0.55))
    nz = noise(M['seed'] + 8, 40, 8)
    land = rough(P(size, [LAND], blur=8), nz, 0.35)
    fort_m = P(size, [FORT])
    coast_fort = P(size, [[(1000, -50), (2300, -50), (2300, 1600), (1000, 1600)]])  # seawall + cliffs only along the headland
    # boulder seawall (outside land) + golden cliffs (inside land edge)
    sw_band = ImageChops.subtract(land.filter(ImageFilter.MaxFilter(57)), land)
    sw_band = ImageChops.multiply(sw_band, coast_fort.filter(ImageFilter.GaussianBlur(80)))
    jet = Image.new('L', size, 0); ImageDraw.Draw(jet).line(JETTY, fill=255, width=46, joint='curve')  # open arc, not a closed loop
    for (jx, jy) in (JETTY[0], JETTY[-1]): ImageDraw.Draw(jet).ellipse([jx - 23, jy - 23, jx + 23, jy + 23], fill=255)
    jet_m = jet.filter(ImageFilter.GaussianBlur(3))
    rocks = ImageChops.lighter(sw_band, jet_m)
    cliff = ImageChops.subtract(land, land.filter(ImageFilter.MinFilter(45)))
    cliff = ImageChops.multiply(cliff, coast_fort.filter(ImageFilter.GaussianBlur(80)))
    cliff = ImageChops.subtract(cliff, fort_m.filter(ImageFilter.MaxFilter(9)))
    g = Image.composite(g, water, land)
    # surf: white foam hugging the outside of the rocks, heavier on the Atlantic + the jetty tip
    rr = rocks.point(lambda v: 255 if v > 80 else 0)
    surf = ImageChops.subtract(rr.filter(ImageFilter.MaxFilter(41)), rr.filter(ImageFilter.MaxFilter(5)))
    surf = rough(surf.filter(ImageFilter.GaussianBlur(6)), noise(M['seed'] + 12, 24, 4), 1.2)
    surf = ImageChops.multiply(surf, ImageChops.invert(land.filter(ImageFilter.MaxFilter(15))))
    heavy = P(size, [[(1700, -50), (2300, -50), (2300, 1500), (1980, 1500), (2030, 1000)]], blur=90)
    surf = ImageChops.multiply(surf, heavy.point(lambda v: 90 + v * 0.65))
    wide = ImageChops.subtract(rr.filter(ImageFilter.MaxFilter(91)), rr).filter(ImageFilter.GaussianBlur(14))
    wide = ImageChops.multiply(ImageChops.multiply(wide, heavy), ImageChops.invert(land))
    g = Image.composite(solid(size, (160, 215, 220)), g, wide.point(lambda v: v * 0.5))
    g = Image.composite(solid(size, (244, 250, 250)), g, surf)
    # rocks: dark boulders with lit tops
    rock_t = tint(shade(tex('stone', 260), 0.48), (30, 32, 36), 0.3)
    bl = Image.new('L', size, 0); dd = ImageDraw.Draw(bl)
    for _ in range(9000):
        x, y = rnd.uniform(950, W), rnd.uniform(0, H)
        if rr.getpixel((int(min(W - 1, x)), int(min(H - 1, y)))) > 0:
            r = rnd.uniform(5, 12); dd.ellipse([x - r, y - r * 0.8, x + r, y + r * 0.8], fill=rnd.randint(120, 255))
    bl = bl.filter(ImageFilter.GaussianBlur(1.5))
    g = Image.composite(rock_t, g, rocks.point(lambda v: min(255, v * 2)))
    g = Image.composite(shade(rock_t, 1.9), g, ImageChops.multiply(bl, rr).point(lambda v: v * 0.55))
    # golden cliffs with vertical striation + shadow toward the sea (light from NW)
    ct = tint(tex('sandstone', 400), (205, 160, 85), 0.35)
    stri = noise(M['seed'] + 13, 14, 1).resize((W // 6, H)).resize(size).point(lambda v: v)
    ct = Image.composite(shade(ct, 1.2), shade(ct, 0.75), stri)
    g = Image.composite(ct, g, cliff)
    sea_shadow = ImageChops.subtract(ImageChops.offset(land, 16, 22), land).filter(ImageFilter.GaussianBlur(10))
    g = Image.composite(shade(g, 0.55), g, sea_shadow.point(lambda v: v * 0.7))
    # slopes: green grass between walls and cliffs inside the headland already = lawn texture
    # ---------------- dry moat + glacis on the west, Old San Juan on the land edge
    moat = P(size, [[(1040, 300), (1110, 300), (1080, 520), (1140, 690), (1070, 830), (1140, 960), (1095, 1160), (1170, 1320), (1100, 1330), (1020, 1160), (1060, 960), (995, 830), (1060, 690), (1005, 520)]], blur=10)
    g = Image.composite(shade(tint(g, (60, 70, 20), 0.2), 0.62), g, moat)
    # ---------------- fortress: drop shadow, outer floor, levels, courts, parapets
    sh = ImageChops.offset(fort_m, 22, 30).filter(ImageFilter.GaussianBlur(14))
    g = Image.composite(shade(g, 0.42), g, sh.point(lambda v: v * 0.8))
    floor = tint(tex('sandstone', 520), (190, 150, 95), 0.15)
    g = Image.composite(shade(floor, 0.9), g, fort_m)
    for poly, f in ((MID, 1.0), (UPPER, 1.08)):
        m = P(size, [poly])
        s2 = ImageChops.subtract(ImageChops.offset(m, 12, 17), m).filter(ImageFilter.GaussianBlur(6))
        g = Image.composite(shade(g, 0.5), g, ImageChops.multiply(s2, fort_m).point(lambda v: v * 0.85))
        g = Image.composite(shade(floor, f), g, m)
    earth = tint(tex('dirt', 420), (140, 70, 45), 0.35)
    for poly in [COURT] + SUNKEN:
        m = P(size, [poly])
        inner = ImageChops.subtract(m, m.filter(ImageFilter.MinFilter(17)))
        g = Image.composite(shade(earth, 0.95), g, m)
        g = Image.composite(shade(g, 0.55), g, ImageChops.offset(inner, 0, 0).point(lambda v: v * 0.6))  # sunken lip shadow
    # gun-casemate vaults on the courtyard sides (rows of little arches)
    d = ImageDraw.Draw(g)
    for y in range(490, 1030, 26):
        for x in (1290, 1415):
            d.rectangle([x - 8, y, x + 8, y + 16], fill=(98, 72, 46)); d.rectangle([x - 6, y + 2, x + 6, y + 8], fill=(60, 42, 30))
    # parapets
    crenellate(d, FORT, (112, 86, 56), (226, 196, 140), 20, 24)
    crenellate(d, UPPER, (122, 94, 60), (232, 204, 150), 14, 22)
    crenellate(d, MID, (122, 94, 60), (232, 204, 150), 12, 22)
    for poly in [COURT] + SUNKEN: d.line(list(poly) + [poly[0]], fill=(214, 186, 132), width=6)
    # ---------------- Old San Juan along the land edge (x < 250)
    city = P(size, [[(-40, 200), (230, 190), (262, 1430), (-40, 1430)]])
    paved = tint(tex('stone', 300), (150, 140, 125), 0.4)
    g = Image.composite(paved, g, rough(city.filter(ImageFilter.GaussianBlur(8)), nz, 0.4))
    d = ImageDraw.Draw(g)
    pastel = [(236, 120, 120), (120, 190, 220), (245, 210, 110), (150, 210, 150), (230, 150, 200), (250, 170, 110), (180, 160, 230), (240, 240, 230)]
    def house(x, y, w, h, c):
        dk = tuple(int(v * 0.6) for v in c); lt = tuple(min(255, int(v * 1.15)) for v in c)
        d.rectangle([x + 7, y + 9, x + w + 7, y + h + 9], fill=(38, 36, 34))  # drop shadow (depth)
        d.rectangle([x, y, x + w, y + h], fill=c, outline=dk, width=3)
        if rnd.random() < 0.35:  # red clay tile roof (hip roof, lit from NW)
            cx, cy = x + w / 2, y + h / 2
            d.polygon([(x + 2, y + 2), (x + w - 2, y + 2), (cx + w * 0.18, cy), (cx - w * 0.18, cy)], fill=(196, 92, 60))
            d.polygon([(x + 2, y + 2), (cx - w * 0.18, cy), (x + 2, y + h - 2)], fill=(214, 112, 74))
            d.polygon([(x + w - 2, y + 2), (x + w - 2, y + h - 2), (cx + w * 0.18, cy)], fill=(150, 64, 44))
            d.polygon([(x + 2, y + h - 2), (x + w - 2, y + h - 2), (cx + w * 0.18, cy), (cx - w * 0.18, cy)], fill=(168, 74, 50))
            d.line([(cx - w * 0.18, cy), (cx + w * 0.18, cy)], fill=(232, 150, 110), width=2)
        else:  # flat azotea roof: parapet + water tank / stairwell
            d.rectangle([x + 5, y + 5, x + w - 5, y + h - 5], outline=lt, width=3)
            d.line([(x + 5, y + h - 6), (x + w - 5, y + h - 6)], fill=dk, width=2)
            if rnd.random() < 0.6:
                tx, ty = x + rnd.uniform(0.2, 0.55) * w, y + rnd.uniform(0.2, 0.5) * h
                d.ellipse([tx + 3, ty + 4, tx + 17, ty + 18], fill=(60, 58, 55)); d.ellipse([tx, ty, tx + 14, ty + 14], fill=(226, 226, 222), outline=(150, 150, 150))
        for k in range(3):  # wrought-iron balconies on the street face (south)
            bx = x + 6 + k * (w - 12) / 3
            d.rectangle([bx + 2, y + h - 3, bx + (w - 12) / 3 - 3, y + h + 2], fill=(52, 46, 44))
    streets = M['streets']
    # cemetery: walled, white tombs, by the north shore (inside the city band, top)
    d.rectangle([20, 230, 330, 400], fill=(196, 190, 170), outline=(120, 110, 95), width=8)
    for yy in range(250, 392, 18):
        for xx in range(36, 318, 16):
            if rnd.random() < 0.85: d.rectangle([xx, yy, xx + 9, yy + 11], fill=(250, 250, 246), outline=(150, 150, 150))
    d.ellipse([150, 290, 200, 340], fill=(240, 236, 220), outline=(140, 130, 110), width=3)  # chapel dome
    # long yellow barracks (Cuartel de Ballajá) with inner courtyard
    bx0, by0, bx1, by1 = 30, 840, 210, 1110
    d.rectangle([bx0 + 8, by0 + 10, bx1 + 8, by1 + 10], fill=(40, 40, 40))
    d.rectangle([bx0, by0, bx1, by1], fill=(240, 196, 80), outline=(160, 120, 40), width=4)
    d.rectangle([bx0 + 40, by0 + 40, bx1 - 40, by1 - 40], fill=(205, 180, 140), outline=(170, 130, 50), width=4)
    for yy in range(by0 + 12, by1 - 10, 22): d.rectangle([bx0 + 8, yy, bx0 + 20, yy + 10], fill=(200, 150, 50))
    taken = [(20, 230, 330, 400), (bx0, by0, bx1, by1)]
    for yy in range(408, 1430, 74):
        for xx in range(-6, 236, 72):
            w, h = rnd.randint(54, 66), rnd.randint(50, 62)
            if any(a - 10 < xx + w and xx < c + 10 and b - 10 < yy + h and yy < e + 10 for a, b, c, e in taken): continue
            if any(abs((yy + h / 2) - sy) < 70 for sy in streets): continue
            if xx + w > 226 + (yy - 200) * 0.026: continue
            house(xx, yy, w, h, rnd.choice(pastel))
    # small plaza trees between houses
    # ---------------- bridge over the moat into the fort (west gate)
    gx, gy = M['gate']
    d.rectangle([gx - 85, gy - 40, gx + 20, gy + 40], fill=(150, 120, 80), outline=(90, 70, 50), width=5)
    for k in range(gx - 80, gx + 20, 12): d.line([(k, gy - 36), (k, gy + 36)], fill=(130, 100, 66), width=2)
    # ---------------- masks
    water_m = ImageChops.invert(land)
    wall = P(size, [FORT], width=34)
    wall = ImageChops.lighter(wall, P(size, [UPPER], width=10)); wall = ImageChops.lighter(wall, P(size, [MID], width=10))
    block = ImageChops.lighter(water_m, rocks)
    cliff_blk = ImageChops.multiply(ImageChops.subtract(land, land.filter(ImageFilter.MinFilter(23))), coast_fort.filter(ImageFilter.GaussianBlur(80)))
    block = ImageChops.lighter(block, cliff_blk.point(lambda v: 255 if v > 60 else 0))
    block = ImageChops.lighter(block, wall)
    block = ImageChops.lighter(block, city.filter(ImageFilter.MaxFilter(9)))
    block = ImageChops.lighter(block, moat.point(lambda v: 255 if v > 90 else 0))
    for poly in SUNKEN: block = ImageChops.lighter(block, P(size, [poly]).filter(ImageFilter.MaxFilter(9)))
    deco = ImageChops.invert(ImageChops.lighter(block.filter(ImageFilter.MaxFilter(41)), fort_m.filter(ImageFilter.MaxFilter(61))))
    edge = Image.new('L', size, 0); de = ImageDraw.Draw(edge)  # palms only frame the lawn (keep the esplanade open to build on)
    de.rectangle([0, 0, W, 300], fill=255); de.rectangle([0, 1320, W, H], fill=255); de.rectangle([0, 0, 330, H], fill=255)
    deco = ImageChops.multiply(deco, edge)
    return g, block, deco


def _cross(a, b, c, d):
    (x1, y1), (x2, y2), (x3, y3), (x4, y4) = a, b, c, d
    den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if abs(den) < 1e-9: return None
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den; u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den
    return (t, (x1 + t * (x2 - x1), y1 + t * (y2 - y1))) if 0 <= t <= 1 and 0 <= u <= 1 else None


def post(M, g, lanes):
    """Ramps: stone steps + side kerbs where a lane climbs through a wall / level edge."""
    d = ImageDraw.Draw(g); hw = M['pathWidth'] / 2
    for poly in (FORT, UPPER, MID):
        edges = [(poly[i], poly[(i + 1) % len(poly)]) for i in range(len(poly))]
        for wp in lanes:
            for i in range(len(wp) - 1):
                a, b = wp[i], wp[i + 1]
                for c, e in edges:
                    hit = _cross(a, b, c, e)
                    if not hit: continue
                    _, (x, y) = hit; L = math.dist(a, b) or 1; ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L; nx, ny = -uy, ux
                    for k in range(-3, 4):  # steps across the lane
                        cx, cy = x + ux * k * 9, y + uy * k * 9
                        col = (88, 76, 62) if k % 2 else (214, 196, 160)
                        d.line([(cx - nx * hw, cy - ny * hw), (cx + nx * hw, cy + ny * hw)], fill=col, width=3)
                    for sgn in (-1, 1):  # kerbs
                        d.line([(x - ux * 34 + sgn * nx * (hw + 4), y - uy * 34 + sgn * ny * (hw + 4)), (x + ux * 34 + sgn * nx * (hw + 4), y + uy * 34 + sgn * ny * (hw + 4))], fill=(120, 92, 60), width=7)
    return g
