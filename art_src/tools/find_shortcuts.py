#!/usr/bin/env python3
"""Find one blocked-shortcut chord per map and write it into maps.generated.json.

A shortcut is a straight trail from a point on lane i (d1) to a point on lane j
(d2) that cuts off a long stretch of road. Constraints: the trail stays clear of
every lane (except near its ends), away from the HQ and build pads, and mostly
over buildable ground. Score = arc length saved. Re-run after compose_maps.py.
"""
import json, math, pathlib

P = pathlib.Path(__file__).resolve().parents[2] / 'src/data/maps.generated.json'
M = json.loads(P.read_text())


def mk(pts):
    segs, cum = [], 0.0
    for a, b in zip(pts, pts[1:]):
        L = math.dist(a, b)
        if L < 1e-6:
            continue
        segs.append((a, b, L, cum)); cum += L
    return segs, cum


def at(Pth, d):
    for a, b, L, c in Pth[0]:
        if c + L >= d:
            t = (d - c) / L
            return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    return tuple(Pth[0][-1][1])


def proj(Pth, p):
    best = 1e9
    for a, b, L, c in Pth[0]:
        dx, dy = b[0] - a[0], b[1] - a[1]
        t = max(0, min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (L * L)))
        best = min(best, math.hypot(p[0] - a[0] - dx * t, p[1] - a[1] - dy * t))
    return best


for m in M:
    paths = [mk(l) for l in m['lanes']]; W = m['pathWidth']; g = m['grid']; B = ''.join(g['buildable'])

    def buildable(p):
        c = int((p[0] - g['originX']) // g['cell']); r = int((p[1] - g['originY']) // g['cell'])
        return 0 <= c < g['cols'] and 0 <= r < g['rows'] and B[r * g['cols'] + c] == '1'

    best = None
    for li, Pa in enumerate(paths):
        L = Pa[1]
        for lj, Q in enumerate(paths):
            Lq = Q[1]
            for d1 in range(int(L * .05), int(L * .9), 20):
                p1 = at(Pa, d1)
                for d2 in range(int(Lq * .08), int(Lq * .95), 20):
                    p2 = at(Q, d2); C = math.dist(p1, p2)
                    if C < 360 or C > 1100:
                        continue
                    S = (L - d1) - C - (Lq - d2)
                    if S < 150 or (best and S <= best['saved']):
                        continue
                    n = int(C // 16); bad = False; bc = tot = 0
                    for k in range(1, n):
                        t = k / n; q = (p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t)
                        if min(t * C, (1 - t) * C) < W * 1.6:
                            continue
                        tot += 1
                        if (min(proj(R, q) for R in paths) < W * 0.95 or math.dist(q, m['hq']) < 200
                                or any(math.dist(q, pd) < 100 for pd in m['pads'])):
                            bad = True; break
                        bc += buildable(q)
                    if bad or tot < 3 or bc / tot < 0.5:
                        continue
                    best = {'fromLane': li, 'd1': d1, 'toLane': lj, 'd2': d2,
                            'a': [round(p1[0]), round(p1[1])], 'b': [round(p2[0]), round(p2[1])], 'saved': round(S)}
    m['shortcuts'] = [best] if best else []
    print(m['id'], best)

P.write_text(json.dumps(M, separators=(',', ':')))
