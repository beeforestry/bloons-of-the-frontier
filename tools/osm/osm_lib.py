"""Shared helpers for the OSM layout tools: load the cached Overpass JSON, assemble polygons (closed ways and
multipolygon relations), project into a map's game-pixel frame, and route along the footway/road network.
Data (c) OpenStreetMap contributors, ODbL 1.0."""
import heapq, json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from frames import FRAMES, lonlat_to_px

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
RAW = os.path.join(ROOT, 'data', 'osm', 'raw')

# default carriageway widths (m) when OSM has no width / lanes tag
HW_WIDTH = {'motorway': 12, 'trunk': 10, 'primary': 9, 'secondary': 8, 'tertiary': 7, 'unclassified': 6, 'residential': 6,
            'living_street': 5, 'service': 5, 'pedestrian': 6, 'track': 3.5, 'footway': 2.5, 'path': 2, 'cycleway': 2.5,
            'steps': 2, 'corridor': 2}


def load(mid):
    return json.load(open(os.path.join(RAW, f'{mid}.json')))['elements']


def proj(mid, geom):
    return [lonlat_to_px(mid, p['lon'], p['lat']) for p in geom if p]


def _key(p): return (round(p['lat'], 7), round(p['lon'], 7))


def rings_from_members(members, role):
    """Join a relation's member way geometries (role outer/inner) into closed rings of lat/lon dicts."""
    segs = [list(m['geometry']) for m in members if m.get('type') == 'way' and m.get('role', '') == role and m.get('geometry')]
    rings = []
    while segs:
        cur = segs.pop(0)
        changed = True
        while _key(cur[0]) != _key(cur[-1]) and changed:
            changed = False
            for i, s in enumerate(segs):
                if _key(s[0]) == _key(cur[-1]): cur += s[1:]
                elif _key(s[-1]) == _key(cur[-1]): cur += s[::-1][1:]
                elif _key(s[-1]) == _key(cur[0]): cur = s[:-1] + cur
                elif _key(s[0]) == _key(cur[0]): cur = s[::-1][:-1] + cur
                else: continue
                segs.pop(i); changed = True; break
        if len(cur) >= 4: rings.append(cur)
    return rings


def polygons(el):
    """[(outer_ring, [inner_rings])] in lat/lon for a closed way or multipolygon relation (else [])."""
    if el['type'] == 'way':
        g = el.get('geometry') or []
        return [(g, [])] if len(g) >= 4 and _key(g[0]) == _key(g[-1]) else []
    if el['type'] == 'relation' and el.get('tags', {}).get('type') in ('multipolygon', 'building'):
        outers = rings_from_members(el.get('members', []), 'outer'); inners = rings_from_members(el.get('members', []), 'inner')
        if not outers: return []
        try:
            from shapely.geometry import Polygon, Point
            res = []
            for o in outers:
                po = Polygon([(p['lon'], p['lat']) for p in o])
                res.append((o, [i for i in inners if po.contains(Point(i[0]['lon'], i[0]['lat']))]))
            return res
        except Exception:
            return [(o, []) for o in outers]
    return []


def height_m(tags, storey=3.7):
    """Building height in metres from OSM tags (height, building:levels, roof levels) or None."""
    h = tags.get('height') or tags.get('building:height')
    if h:
        try: return float(str(h).replace('m', '').strip())
        except ValueError: pass
    lv = tags.get('building:levels')
    if lv:
        try: return float(lv) * storey + float(tags.get('roof:levels', 0) or 0) * storey * 0.5 + 0.6
        except ValueError: pass
    return None


def width_m(tags):
    w = tags.get('width') or tags.get('est_width')
    if w:
        try: return float(str(w).replace('m', '').strip())
        except ValueError: pass
    if tags.get('lanes'):
        try: return 3.2 * float(tags['lanes'])
        except ValueError: pass
    return HW_WIDTH.get(tags.get('highway'), 4)


# ------------------------------------------------------------------ routing on the highway network
class Net:
    """Undirected graph of highway ways in game px, densified to <= `step` px so anchors snap close to any point."""
    def __init__(self, mid, kinds=None, step=12.0, skip_ways=(), skip_service=('parking_aisle', 'driveway', 'drive-through')):
        self.pts = []; self.adj = []; self.idx = {}; self.way_of = {}
        for el in load(mid):
            t = el.get('tags', {})
            if el['type'] != 'way' or 'highway' not in t or el['id'] in skip_ways: continue
            if kinds and t['highway'] not in kinds: continue
            if t.get('service') in skip_service or t.get('access') in ('private', 'no'): continue
            P = proj(mid, el['geometry']); keys = [_key(p) for p in el['geometry']]
            prev = None
            for k, (x, y) in zip(keys, P):
                cur = self._node(('osm',) + k, x, y)
                if prev is not None:
                    (ax, ay), (bx, by) = self.pts[prev], (x, y)
                    n = max(1, int(math.hypot(bx - ax, by - ay) / step)); last = prev
                    for i in range(1, n):
                        mid_ = self._node(('w', el['id'], prev, i), ax + (bx - ax) * i / n, ay + (by - ay) * i / n)
                        self._edge(last, mid_, el['id']); last = mid_
                    self._edge(last, cur, el['id'])
                prev = cur

    def _node(self, k, x, y):
        if k in self.idx: return self.idx[k]
        self.idx[k] = len(self.pts); self.pts.append((x, y)); self.adj.append([]); return self.idx[k]

    def _edge(self, a, b, wid):
        d = math.dist(self.pts[a], self.pts[b]); self.adj[a].append((b, d)); self.adj[b].append((a, d)); self.way_of[(a, b)] = self.way_of[(b, a)] = wid

    def nearest(self, p):
        return min(range(len(self.pts)), key=lambda i: (self.pts[i][0] - p[0]) ** 2 + (self.pts[i][1] - p[1]) ** 2)

    def route(self, a, b):
        """Shortest path (px polyline + way ids used) between the network nodes nearest to points a and b."""
        s, g = self.nearest(a), self.nearest(b)
        dist = {s: 0.0}; prev = {}; pq = [(0.0, s)]
        while pq:
            d, u = heapq.heappop(pq)
            if u == g: break
            if d > dist.get(u, 1e18): continue
            for v, w in self.adj[u]:
                nd = d + w
                if nd < dist.get(v, 1e18): dist[v] = nd; prev[v] = u; heapq.heappush(pq, (nd, v))
        if g not in dist: raise ValueError(f'no route {a} -> {b}')
        path = [g]
        while path[-1] != s: path.append(prev[path[-1]])
        path.reverse()
        ways = []
        for u, v in zip(path, path[1:]):
            w = self.way_of[(u, v)]
            if not ways or ways[-1] != w: ways.append(w)
        return [self.pts[i] for i in path], ways


def simplify(P, tol=3.0):
    """Douglas-Peucker."""
    if len(P) < 3: return list(P)
    (ax, ay), (bx, by) = P[0], P[-1]; L = math.hypot(bx - ax, by - ay) or 1e-9
    dmax, imax = 0, 0
    for i in range(1, len(P) - 1):
        d = abs((by - ay) * P[i][0] - (bx - ax) * P[i][1] + bx * ay - by * ax) / L
        if d > dmax: dmax, imax = d, i
    if dmax <= tol: return [P[0], P[-1]]
    return simplify(P[:imax + 1], tol)[:-1] + simplify(P[imax:], tol)


def chaikin(P, n=2):
    for _ in range(n):
        Q = [P[0]]
        for (ax, ay), (bx, by) in zip(P, P[1:]):
            Q += [(0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by), (0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by)]
        Q.append(P[-1]); P = Q
    return P


def resample(P, step):
    """Points every `step` px along the polyline (keeps both ends)."""
    out = [tuple(P[0])]; carry = 0.0
    for (ax, ay), (bx, by) in zip(P, P[1:]):
        L = math.hypot(bx - ax, by - ay); pos = step - carry
        while pos <= L:
            out.append((ax + (bx - ax) * pos / L, ay + (by - ay) * pos / L)); pos += step
        carry = L - (pos - step)
    if math.dist(out[-1], P[-1]) > step * 0.35: out.append(tuple(P[-1]))
    else: out[-1] = tuple(P[-1])
    return out


def length(P): return sum(math.dist(a, b) for a, b in zip(P, P[1:]))


def seg_dist(p, a, b):
    ax, ay = a; bx, by = b; px, py = p
    dx, dy = bx - ax, by - ay; L = dx * dx + dy * dy or 1
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)


def poly_dist(p, P): return min(seg_dist(p, P[i], P[i + 1]) for i in range(len(P) - 1))
