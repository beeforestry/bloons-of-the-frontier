"""Map frames shared by the OSM tools. Each playable map is a rotated rectangle in UTM zone 19N (EPSG:26919),
identical to the frames in art_src/tools/morro_real.py / tropical_real.py (aerial + lidar pipeline), after the x2
gameplay-scale step: 4416 x 2976 game px at 0.125 m/px (552 m x 372 m). Map +x points `ang` degrees CCW from east."""
import math

FRAMES = {
    # Castillo San Felipe del Morro + esplanade (city -> fort tip runs along +x)
    'morro': dict(cE=803757.0, cN=2044655.0, ang=142.8, mpp=0.125, W=4416, H=2976),
    # Isla de Cabras (Toa Baja) incl. Fortin San Juan de la Cruz (El Canuelo); +x = north
    'tropical': dict(cE=802455.0, cN=2044410.0, ang=90.0, mpp=0.125, W=4416, H=2976),
}
# Extra margin (game px) fetched around each frame so features crossing the edge are complete, plus El Morro's
# first-person Old San Juan backdrop window (same as art_src/tools/oldsj_backdrop.py).
FETCH_WINDOWS = {
    'morro': (-9500, -2500, 4416 + 1200, 8000),
    'tropical': (-1600, -1600, 4416 + 1600, 2976 + 1600),
}


def to_utm(mid, x, y):
    f = FRAMES[mid]; a = math.radians(f['ang']); dx, dy = math.cos(a), math.sin(a)
    U = (x - f['W'] / 2) * f['mpp']; V = (y - f['H'] / 2) * f['mpp']
    return f['cE'] + U * dx + V * dy, f['cN'] + U * dy - V * dx


def to_px(mid, E, N):
    f = FRAMES[mid]; a = math.radians(f['ang']); dx, dy = math.cos(a), math.sin(a)
    e, n = E - f['cE'], N - f['cN']
    U = e * dx + n * dy; V = e * dy - n * dx
    return U / f['mpp'] + f['W'] / 2, V / f['mpp'] + f['H'] / 2


_T = {}
def tr(src, dst):
    import pyproj
    k = (src, dst)
    if k not in _T: _T[k] = pyproj.Transformer.from_crs(src, dst, always_xy=True)
    return _T[k]


def lonlat_to_px(mid, lon, lat):
    E, N = tr(4326, 26919).transform(lon, lat); return to_px(mid, E, N)


def window_bbox(mid):
    """(south, west, north, east) WGS84 of the fetch window."""
    x0, y0, x1, y1 = FETCH_WINDOWS[mid]
    t = tr(26919, 4326)
    cs = [t.transform(*to_utm(mid, x, y)) for x in (x0, x1) for y in (y0, y1)]
    return (min(c[1] for c in cs), min(c[0] for c in cs), max(c[1] for c in cs), max(c[0] for c in cs))
