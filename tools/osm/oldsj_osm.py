"""Rebuild the El Morro first-person Old San Juan backdrop's building mask from OpenStreetMap footprints.
The backdrop (src/fps/oldsj.ts, art_src/tools/oldsj_backdrop.py) is a 3 m grid around the map: bare-earth ground from the
USGS 3DEP lidar + one extruded column per built cell. t101b classified "built" from the aerial's bright roofs, which blurred
streets shut and raised the cemetery's white tombs. This keeps the lidar ground bytes untouched and replaces the built mask
with the real OSM footprints (ways + multipolygon relations); heights from OSM `height` / `building:levels` (3.7 m storeys)
where tagged, else the old aerial estimate for that cell, else 2-3 storeys (stable per building).
  python3 tools/osm/oldsj_osm.py
In/out: public/assets/maps/morro/oldsj.dat (gzip: uint8 ground (h+2)*4, then uint8 height*4 above ground per cell).
Data: (c) OpenStreetMap contributors, ODbL 1.0."""
import gzip, json, os, sys, zlib
import numpy as np
import shapely
from shapely.geometry import Polygon
sys.path.insert(0, os.path.dirname(__file__))
from osm_lib import ROOT, load, proj, polygons, height_m
from config import BACKDROP_SKIP_TAGS

DAT = os.path.join(ROOT, 'public', 'assets', 'maps', 'morro', 'oldsj.dat')
BASE = os.path.join(ROOT, 'data', 'osm', 'derived', 'oldsj_aerial_mask.bin')  # the pre-OSM (aerial-classified) mask, kept for reruns
X0, Y0, STEP, COLS, ROWS = -9500, -2500, 24, 438, 438   # mirrors src/fps/oldsj.ts OLDSJ


def skip(t):
    if t.get('defensive_works') or t.get('building:part'): return True
    return any(t.get(k) in v for k, v in BACKDROP_SKIP_TAGS.items())


def main():
    raw = open(DAT, 'rb').read(); d = gzip.decompress(raw) if raw[:2] == b'\x1f\x8b' else raw
    n = COLS * ROWS; q = np.frombuffer(d[:n], np.uint8).copy(); qa_now = np.frombuffer(d[n:2 * n], np.uint8).copy()
    if not os.path.exists(BASE): os.makedirs(os.path.dirname(BASE), exist_ok=True); open(BASE, 'wb').write(zlib.compress(qa_now.tobytes(), 9))
    old = np.frombuffer(zlib.decompress(open(BASE, 'rb').read()), np.uint8).reshape(ROWS, COLS)
    xs = X0 + np.arange(COLS) * STEP; ys = Y0 + np.arange(ROWS) * STEP
    GX, GY = np.meshgrid(xs, ys)
    qa = np.zeros((ROWS, COLS), np.uint8); nb = tagged = 0; skipped = 0
    for el in load('morro'):
        t = el.get('tags', {})
        if 'building' not in t: continue
        if skip(t): skipped += 1; continue
        for outer, inners in polygons(el):
            P = proj('morro', outer)
            try: po = Polygon(P, [proj('morro', i) for i in inners]).buffer(0)
            except Exception: continue
            if po.is_empty: continue
            x0, y0, x1, y1 = po.bounds
            i0, i1 = max(0, int((x0 - X0) // STEP) - 1), min(COLS, int((x1 - X0) // STEP) + 2)
            j0, j1 = max(0, int((y0 - Y0) // STEP) - 1), min(ROWS, int((y1 - Y0) // STEP) + 2)
            if i0 >= i1 or j0 >= j1: continue
            sub = shapely.contains_xy(po, GX[j0:j1, i0:i1], GY[j0:j1, i0:i1])
            if not sub.any():  # small footprint between cell centres: give it its nearest cell
                c = po.representative_point(); ii, jj = int(round((c.x - X0) / STEP)), int(round((c.y - Y0) / STEP))
                if 0 <= ii < COLS and 0 <= jj < ROWS: j0, i0 = jj, ii; sub = np.ones((1, 1), bool)
                else: continue
            h = height_m(t)
            if h is not None: tagged += 1; hq = np.full(sub.shape, round(h * 4))
            else:
                o = old[j0:j0 + sub.shape[0], i0:i0 + sub.shape[1]]
                fb = round((7.4 if (el['id'] * 2654435761) % 3 else 11.1) * 4)
                hq = np.where(o > 0, o, fb)
            blk = qa[j0:j0 + sub.shape[0], i0:i0 + sub.shape[1]]
            blk[sub] = np.maximum(blk[sub], np.clip(hq[sub], 8, 255)).astype(np.uint8); nb += 1
    out = gzip.compress(q.tobytes() + qa.tobytes(), 9, mtime=0)
    open(DAT, 'wb').write(out)
    both = ((old > 0) & (qa > 0)).sum()
    rep = dict(osm_buildings=nb, with_osm_height=tagged, skipped_fortifications_ruins=skipped, cells_before=int((old > 0).sum()), cells_after=int((qa > 0).sum()),
               cells_in_both=int(both), aerial_only_cells_dropped=int(((old > 0) & (qa == 0)).sum()), osm_only_cells_added=int(((old == 0) & (qa > 0)).sum()),
               kb=len(out) // 1024)
    json.dump(rep, open(os.path.join(ROOT, 'data', 'osm', 'derived', 'oldsj_report.json'), 'w'), indent=1)
    print(json.dumps(rep))


if __name__ == '__main__':
    main()
