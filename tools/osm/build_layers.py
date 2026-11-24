"""Project the cached OSM data into each map's game-pixel frame.
  python3 tools/osm/build_layers.py
Writes
  src/data/osm.generated.json        runtime: first-person buildings / solids for the playable maps (config.BUILDINGS)
  data/osm/derived/<map>_layers.json  every in-frame layer (buildings, roads with widths, coast, breakwaters, green, walls)
                                      + terrain guidance (ground height under each building / along each lane) for tools & review
Data (c) OpenStreetMap contributors, ODbL 1.0. Heights come from the maps' USGS 3DEP lidar heightfield (public domain)."""
import base64, json, math, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from frames import FRAMES
from osm_lib import ROOT, load, proj, polygons, height_m, width_m, length
from config import BUILDINGS

OUT_RT = os.path.join(ROOT, 'src', 'data', 'osm.generated.json')
DERIVED = os.path.join(ROOT, 'data', 'osm', 'derived')
MAPS_JSON = os.path.join(ROOT, 'src', 'data', 'maps.generated.json')
ATTR = '© OpenStreetMap contributors (ODbL 1.0) · elevation: USGS 3DEP 1 m lidar (public domain)'


def heightfield(m):
    t = m['terrain']; h = np.frombuffer(base64.b64decode(t['data']), np.uint8).astype(np.float32) * t['scale'] + t['off']
    h = h.reshape(t['rows'], t['cols'])
    def at(x, y):
        fx = min(t['cols'] - 1.001, max(0, x / m['width'] * (t['cols'] - 1))); fy = min(t['rows'] - 1.001, max(0, y / m['height'] * (t['rows'] - 1)))
        i, j = int(fx), int(fy); u, v = fx - i, fy - j
        return float((h[j, i] * (1 - u) + h[j, i + 1] * u) * (1 - v) + (h[j + 1, i] * (1 - u) + h[j + 1, i + 1] * u) * v)
    return at


def r1(P): return [[round(x, 1), round(y, 1)] for x, y in P]


def in_frame(P, W, H, pad=0):
    return any(-pad <= x <= W + pad and -pad <= y <= H + pad for x, y in P)


def runtime_block(bid, name, P, base, cfg, mpp):
    """First-person block: outline, its minimum rotated rectangle (roof frame) and a solid core where the walls stand."""
    from shapely.geometry import Polygon
    po = Polygon(P).buffer(0)
    rect = list(po.minimum_rotated_rectangle.exterior.coords)[:4]
    core = None
    if cfg['kind'] == 'hall': core = po.buffer(-0.6 / mpp, join_style=2)          # walls under a 0.6 m roof overhang
    elif cfg['kind'] == 'magazine': core = Polygon(rect).buffer(-4.0 / mpp, join_style=2)  # vaulted magazine inside its enclosure wall
    b = dict(id=bid, name=name, poly=r1(P), rect=r1(rect), base=round(base, 2), **cfg)
    if core is not None and not core.is_empty: b['core'] = r1(list(core.exterior.coords)[:-1])
    return b


def build(mid, m):
    W, H = m['width'], m['height']; gh = heightfield(m); mpp = m['mpp']
    L = dict(buildings=[], roads=[], coast=[], breakwaters=[], green=[], walls=[], water=[])
    rt = []
    for el in load(mid):
        t = el.get('tags', {})
        if 'building' in t or 'building:part' in t:
            for outer, inners in polygons(el):
                P = proj(mid, outer)
                if not in_frame(P, W, H): continue
                xs, ys = zip(*P); base = min(gh(x, y) for x, y in P)
                b = dict(id=el['id'], name=t.get('name'), levels=t.get('building:levels'), h=height_m(t), base=round(base, 2),
                         historic=t.get('historic'), poly=r1(P), holes=[r1(proj(mid, i)) for i in inners])
                L['buildings'].append(b)
                cfg = BUILDINGS.get(mid, {}).get(el['id'])
                if cfg:
                    rt.append(runtime_block(el['id'], t.get('name'), P[:-1], base, cfg, mpp))
        elif el['type'] == 'way' and 'highway' in t:
            P = proj(mid, el['geometry'])
            if in_frame(P, W, H, 200):
                prof = [round(gh(x, y), 1) for x, y in P]
                L['roads'].append(dict(id=el['id'], highway=t['highway'], name=t.get('name'), width_m=width_m(t),
                                       surface=t.get('surface'), pts=r1(P), elev=prof))
        elif el['type'] == 'way' and t.get('natural') == 'coastline':
            P = proj(mid, el['geometry']);
            if in_frame(P, W, H, 400): L['coast'].append(dict(id=el['id'], pts=r1(P)))
        elif el['type'] == 'way' and t.get('man_made') in ('breakwater', 'groyne', 'pier'):
            P = proj(mid, el['geometry'])
            if in_frame(P, W, H, 200): L['breakwaters'].append(dict(id=el['id'], kind=t['man_made'], pts=r1(P)))
        elif t.get('historic') == 'citywalls' or t.get('barrier') in ('city_wall', 'retaining_wall', 'wall'):
            P = proj(mid, el.get('geometry') or [])
            if P and in_frame(P, W, H, 200): L['walls'].append(dict(id=el['id'], kind=t.get('barrier') or 'citywalls', name=t.get('name'), pts=r1(P)))
        elif t.get('landuse') in ('grass', 'meadow', 'cemetery', 'recreation_ground') or t.get('leisure') in ('park', 'garden') or t.get('natural') in ('scrub', 'wood', 'beach', 'sand', 'grassland', 'water'):
            for outer, _ in polygons(el):
                P = proj(mid, outer)
                if in_frame(P, W, H, 200):
                    (L['water'] if t.get('natural') == 'water' else L['green']).append(dict(id=el['id'], kind=t.get('landuse') or t.get('leisure') or t.get('natural'), name=t.get('name'), poly=r1(P)))
    # terrain guidance along the current lanes (ground metres every ~4 m)
    lanes = []
    for i, ln in enumerate(m['lanes']):
        e = [gh(x, y) for x, y in ln if 0 <= x <= W and 0 <= y <= H]
        climb = sum(max(0, b - a) for a, b in zip(e, e[1:]))
        lanes.append(dict(lane=i, length_px=round(length(ln)), length_m=round(length(ln) * mpp, 1), min_m=round(min(e), 1), max_m=round(max(e), 1), climb_m=round(climb, 1)))
    L['lanes'] = lanes
    os.makedirs(DERIVED, exist_ok=True)
    json.dump(dict(map=mid, frame=FRAMES[mid], attribution=ATTR, **L), open(os.path.join(DERIVED, f'{mid}_layers.json'), 'w'), separators=(',', ':'))
    print(mid, {k: len(v) for k, v in L.items()}, 'runtime buildings', len(rt))
    return rt


def main():
    maps = {m['id']: m for m in json.load(open(MAPS_JSON))}
    out = dict(attribution=ATTR, source='OpenStreetMap via Overpass API (see data/osm/raw/*.meta.json); built by tools/osm/build_layers.py',
               maps={mid: dict(buildings=build(mid, maps[mid])) for mid in FRAMES})
    json.dump(out, open(OUT_RT, 'w'), separators=(',', ':'))
    print('wrote', OUT_RT, os.path.getsize(OUT_RT) // 1024, 'KB')


if __name__ == '__main__':
    main()
