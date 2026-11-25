"""t124: extra buildable land beside Isla de Cabras' amphibious lane (lane 2, unchanged by t123).
The t123 OSM lanes no longer run alongside lane 2's landfall, so the towers that used to cover both are gone. The park lawn
between the landfall and the HQ is real open grass, but the t56 fine land mask (built from 48 px blocks) left it out. This
marks the open parts of it as land in the fine mask (grid.land, 12 px cells) so towers can stand there:
  * within REACH px of lane 2's last LAST px (the landfall and the run up to the HQ gate)
  * ground at least 0.9 m above the map's sea level (USGS lidar heightfield) - no beach or wet sand
  * at least 1.5 m from any OSM building (src/data/osm.generated.json) and clear of palm / tree trunks (3 m) and
    bushes / rocks (1.5 m) in the map's deco list, so first person shows no tower inside a tree or a kiosk
Lanes themselves stay unbuildable at runtime (Game.spotOk checks the lane band).
  python3 tools/osm/cabras_land.py        # idempotent; report in data/osm/derived/cabras_land.json"""
import base64, json, math, os, sys
import numpy as np
from shapely.geometry import Polygon, Point, LineString
sys.path.insert(0, os.path.dirname(__file__))
from osm_lib import ROOT

MAPS = os.path.join(ROOT, 'src', 'data', 'maps.generated.json')
OSM = os.path.join(ROOT, 'src', 'data', 'osm.generated.json')
REACH, LAST = 240, 900


def main():
    maps = json.load(open(MAPS)); m = next(x for x in maps if x['id'] == 'tropical')
    g, t = m['grid'], m['terrain']; res = g['landRes']; W, H = m['width'], m['height']
    fc, fr = math.ceil(W / res), math.ceil(H / res)
    raw = np.unpackbits(np.frombuffer(base64.b64decode(g['land']), np.uint8), bitorder='little')
    bits = raw[:fc * fr].reshape(fr, fc).copy()
    hts = t['off'] + np.frombuffer(base64.b64decode(t['data']), np.uint8).astype(np.float32).reshape(t['rows'], t['cols']) * t['scale']
    def gh(x, y):
        fx = min(t['cols'] - 1.001, max(0, x / W * (t['cols'] - 1))); fy = min(t['rows'] - 1.001, max(0, y / H * (t['rows'] - 1)))
        i, j = int(fx), int(fy); u, v = fx - i, fy - j
        return (hts[j, i] * (1 - u) + hts[j, i + 1] * u) * (1 - v) + (hts[j + 1, i] * (1 - u) + hts[j + 1, i + 1] * u) * v
    L = m['lanes'][2]; acc, tail = 0.0, [L[-1]]
    for a, b in zip(L[::-1], L[-2::-1]):
        acc += math.dist(a, b); tail.append(b)
        if acc >= LAST: break
    zone = LineString(tail).buffer(REACH)
    mpp = m['mpp']
    blds = [Polygon(b['poly']).buffer(1.5 / mpp) for b in json.load(open(OSM))['maps']['tropical']['buildings']]
    trunks = [(x, y, (3.0 if k in ('mr_palm', 'mr_palmb', 'mr_tree') else 1.5) / mpp) for k, x, y, s in m['deco'] if k != 'mr_grass']
    x0, y0, x1, y1 = zone.bounds; added = []
    for yy in range(max(0, int(y0 // res)), min(fr, int(y1 // res) + 1)):
        for xx in range(max(0, int(x0 // res)), min(fc, int(x1 // res) + 1)):
            if bits[yy, xx]: continue
            cx, cy = (xx + .5) * res, (yy + .5) * res
            if not zone.contains(Point(cx, cy)) or gh(cx, cy) < t['water'] + 0.9: continue
            if any(p.contains(Point(cx, cy)) for p in blds): continue
            if any((cx - x) ** 2 + (cy - y) ** 2 < r * r for x, y, r in trunks): continue
            bits[yy, xx] = 1; added.append((xx, yy))
    raw[:fc * fr] = bits.ravel()
    g['land'] = base64.b64encode(np.packbits(raw, bitorder='little').tobytes()).decode()
    json.dump(maps, open(MAPS, 'w'), separators=(',', ':'))
    rep = dict(cells_added=len(added), m2_added=round(len(added) * (res * mpp) ** 2), reach_px=REACH, last_px=LAST)
    json.dump(rep, open(os.path.join(ROOT, 'data', 'osm', 'derived', 'cabras_land.json'), 'w'), indent=1); print(rep)


if __name__ == '__main__':
    main()
