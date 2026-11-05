"""Tropical Island = Isla de Cabras (Toa Baja, PR) from REAL public-domain data (t56), same pipeline as El Morro.
The small island at the west mouth of San Juan Bay, ~1.3 km west of El Morro: beach, palms, sea on all sides.
  * Imagery: NOAA NGS Emergency Response Imagery, Hurricane Maria, flight 2017-09-24 (layer 20170924b-rgb),
    ~25 cm GSD, XYZ tiles https://stormscdn.ngs.noaa.gov/20170924b-rgb/{z}/{x}/{y} (z19 used). NOAA: public domain / CC0-1.0.
  * Elevation: USGS 3DEP 1 m lidar DEM, project PR_PRVI_E_2018, tile USGS_1m_x80y205_PR_PRVI_E_2018.tif (EPSG:26919,
    NAVD88/PRVD02 metres), https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/PR_PRVI_E_2018/TIFF/ . USGS: public domain.
Frame: a 2208 x 1488 px map at 0.25 m/px (552 x 372 m), centred UTM19N (803757 E, 2044655 N), map +x pointing 142.8 deg
CCW from east (city -> fort tip), so the fort sits on the right and the esplanade lawn on the left (not mirrored).
Step 1 (needs rasterio/pyproj; run with /tmp/morro/venv/bin/python):  python morro_real.py fetch
   -> CACHE/photo_raw.png (resampled photo), CACHE/dem_map.npy (DEM resampled onto the map pixel grid / 2)
Step 2: compose_maps.py --only morro  (imports paint/heightfield/walls from here; numpy + PIL only)."""
import math, os, sys, json
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
CACHE = os.environ.get('TROP_CACHE', '/tmp/trop/real')
FRAME = dict(cE=802440.0, cN=2044640.0, ang=90.0, mpp=0.25, W=2208, H=1488)
DEM_URL = '/vsicurl/https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/PR_PRVI_E_2018/TIFF/USGS_1m_x80y205_PR_PRVI_E_2018.tif'
LAYER, Z = '20170924b-rgb', 19
SEA = 0.35  # water plane (m); lidar is hydro-flattened at ~0 along the shore


def frame_utm(W, H, step=1.0):
    f = FRAME; a = math.radians(f['ang']); dx, dy = math.cos(a), math.sin(a)
    u = (np.arange(0, W, step) + step / 2 - W / 2) * f['mpp']; v = (np.arange(0, H, step) + step / 2 - H / 2) * f['mpp']
    U, V = np.meshgrid(u, v)
    return f['cE'] + U * dx + V * dy, f['cN'] + U * dy - V * dx


def bilinear(a, x, y):
    H, W = a.shape[:2]; x = np.clip(x, 0, W - 1.001); y = np.clip(y, 0, H - 1.001)
    i = x.astype(int); j = y.astype(int); u = x - i; v = y - j
    if a.ndim == 3: u = u[..., None]; v = v[..., None]
    return (a[j, i] * (1 - u) + a[j, i + 1] * u) * (1 - v) + (a[j + 1, i] * (1 - u) + a[j + 1, i + 1] * u) * v


def fetch(scale=1):
    import subprocess, rasterio
    from rasterio.windows import from_bounds
    from pyproj import Transformer
    os.makedirs(CACHE + '/tiles', exist_ok=True)
    W, H = FRAME['W'] * scale, FRAME['H'] * scale
    f0 = dict(FRAME); FRAME['mpp'] = f0['mpp'] / scale
    E, N = frame_utm(W, H); Z = 19 + (scale > 1)
    lon, lat = Transformer.from_crs('EPSG:26919', 'EPSG:4326', always_xy=True).transform(E, N)
    n = 256 * 2 ** Z; gx = (lon + 180) / 360 * n; gy = (1 - np.arcsinh(np.tan(np.radians(lat))) / math.pi) / 2 * n
    tx0, ty0, tx1, ty1 = int(gx.min() // 256), int(gy.min() // 256), int(gx.max() // 256), int(gy.max() // 256)
    mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256, 3), np.float32); miss = 0
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            f = f'{CACHE}/tiles/{LAYER}_{Z}_{tx}_{ty}.img'
            if not os.path.exists(f): subprocess.run(['curl', '-sL', '--max-time', '30', '-o', f, f'https://stormscdn.ngs.noaa.gov/{LAYER}/{Z}/{tx}/{ty}'])
            try: mos[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = np.asarray(Image.open(f).convert('RGB'))
            except Exception: miss += 1
    print('tiles', (tx1 - tx0 + 1) * (ty1 - ty0 + 1), 'missing', miss)
    img = bilinear(mos, gx - tx0 * 256 - 0.5, gy - ty0 * 256 - 0.5)
    Image.fromarray(img.clip(0, 255).astype(np.uint8)).save(f'{CACHE}/photo_raw{"2" if scale > 1 else ""}.png')
    FRAME.update(f0)
    if scale > 1: return
    with rasterio.open(DEM_URL) as d:
        w = from_bounds(E.min() - 6, N.min() - 6, E.max() + 6, N.max() + 6, d.transform).round_offsets().round_lengths()
        a = d.read(1, window=w).astype(np.float32); t = d.window_transform(w); nod = d.nodata
    valid = a > -100; a[~valid] = np.nan
    E2, N2 = frame_utm(W, H, 2.0)  # half-res grid (0.5 m), plenty for 1 m lidar
    col = (E2 - t.c) / t.a - 0.5; row = (N2 - t.f) / t.e - 0.5
    v = bilinear(np.nan_to_num(a, nan=-4.0), col, row).astype(np.float32)
    m = bilinear(valid.astype(np.float32), col, row)
    v = np.where(m > 0.5, v, -4.0).astype(np.float32)   # off the lidar footprint = open sea (~4 m deep)
    np.save(f'{CACHE}/dem_map.npy', v); print('dem', v.shape, float(v.min()), float(v.max()))


def dem():
    return np.load(f'{CACHE}/dem_map.npy')  # (H/2, W/2) metres


def grade(img):
    """Readable game background: lift contrast/saturation a touch, warm the haze, deepen the sea slightly."""
    a = np.asarray(img).astype(np.float32) / 255
    a = np.clip((a - 0.5) * 1.12 + 0.5 + 0.01, 0, 1) ** 0.95
    lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    a = np.clip(lum[..., None] + (a - lum[..., None]) * 1.18, 0, 1)
    a *= np.array([1.03, 1.0, 0.95], np.float32)
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))


def masks(W, H):
    h = dem(); hm = Image.fromarray(h)
    sea = (h < 0.9).astype(np.uint8) * 255
    gy, gx = np.gradient(h, 0.5)          # 0.5 m spacing
    slope = np.hypot(gx, gy)
    steep = (slope > 0.7).astype(np.uint8) * 255
    up = lambda m: Image.fromarray(m).resize((W, H), Image.NEAREST)
    return up(sea), up(steep), h, slope


# hand-traced (on the photo) areas where nothing may be built: the walled cemetery, the city blocks, the lighthouse
NO_BUILD = []  # set after tracing


def paint(M, W, H, tex, noise):
    g = grade(Image.open(f'{CACHE}/photo_raw.png').convert('RGB'))
    sea, steep, _, _ = masks(W, H)
    from PIL import ImageChops
    block = Image.new('L', (W, H), 0); d = ImageDraw.Draw(block)
    for p in NO_BUILD: d.polygon(p, fill=255)
    block = ImageChops.lighter(block, sea.filter(ImageFilter.MaxFilter(25)))
    block = ImageChops.lighter(block, steep.filter(ImageFilter.MaxFilter(9)))
    # FP props (3D burnt palms, wrecks, bunkers) may go on open land only; nothing is stamped on the photo
    deco = ImageChops.invert(block.filter(ImageFilter.MaxFilter(15)))
    return g, block, deco


def heightfield(M, W, H, lanes, pw, cols=185, rows=125):
    h = dem()
    hh, ww = h.shape
    xs = np.linspace(0, ww - 1, cols); ys = np.linspace(0, hh - 1, rows)
    X, Y = np.meshgrid(xs, ys)
    # light 3x3 pre-blur so the 3 m lattice does not alias the 0.5 m samples
    hp = np.pad(h, 2, mode='edge'); hb = sum(hp[j:j + h.shape[0], i:i + h.shape[1]] for j in range(5) for i in range(5)) / 25
    out = bilinear(hb, X, Y)
    off, sc = -4.0, 0.2
    q = np.clip(np.round((out - off) / sc), 0, 255).astype(np.uint8)
    print('tropical terrain', cols, 'x', rows, 'range', float(out.min()), float(out.max()))
    import base64
    return dict(cols=cols, rows=rows, off=off, scale=sc, water=SEA, data=base64.b64encode(q.tobytes()).decode())


def walls(W, H, region=None, step=32):
    """LOS blockers [x, y, r, h] along the fort's wall faces: cells where the 1 m lidar shows a sharp drop.
    The smoothed 3 m terrain lattice already blocks the big terraces; these add the parapets/wall edges."""
    _, _, h, slope = masks(W, H)
    out = []
    s2 = step // 2  # dem is half-res
    for y in range(0, h.shape[0] - s2, s2):
        for x in range(0, h.shape[1] - s2, s2):
            win = slope[y:y + s2, x:x + s2]; hw = h[y:y + s2, x:x + s2]
            if win.max() > 2.2 and hw.max() > 6 and (region is None or region(x * 2 + step / 2, y * 2 + step / 2)):
                out.append([x * 2 + step // 2, y * 2 + step // 2, step * 0.6, 2.0])
    return out


if __name__ == '__main__' and sys.argv[1:] == ['fetch']: fetch()
if __name__ == '__main__' and sys.argv[1:] == ['fetch2']: fetch(2)  # t55: 0.125 m/px (z20) for the 2x-size map
