"""Trace the walkable path centerline out of a painted map image.
Usage: trace_path.py <image> <mode:dirt|stone> <out.json>
Segments path-colored pixels, keeps the largest blob, skeletonizes it,
walks the skeleton end-to-end and simplifies it into waypoints."""
import sys, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from skimage.morphology import skeletonize, binary_closing, binary_opening, disk, remove_small_holes

src, mode, out = sys.argv[1], sys.argv[2], sys.argv[3]
im = np.array(Image.open(src).convert('RGB')).astype(int)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
if mode == 'dirt':
    m = (r > 170) & (g > 120) & (g < 200) & (b < 150) & (r - b > 60) & (r > g)
elif mode == 'water':
    m = (b > 150) & (g > 140) & (r < 140) & (b - r > 60)
else:  # stone: beige/grey low-saturation bright pixels
    mx = im.max(-1); mn = im.min(-1)
    m = (mx > 150) & ((mx - mn) < 75) & (r >= b - 5) & (g > 130)
m = ndi.binary_closing(m, disk(6)); m = ndi.binary_opening(m, disk(5))
lab, n = ndi.label(m)
sizes = ndi.sum(m, lab, range(1, n + 1))
m = lab == (np.argmax(sizes) + 1)
m = remove_small_holes(m, 5000)
sk = skeletonize(m)
ys, xs = np.nonzero(sk)
pts = set(zip(xs.tolist(), ys.tolist()))
def nb(p):
    x, y = p
    return [(x + dx, y + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy) and (x + dx, y + dy) in pts]
ends = [p for p in pts if len(nb(p)) == 1]
# longest geodesic path: BFS from leftmost end, then BFS again from farthest
def bfs(s):
    prev = {s: None}; q = [s]; i = 0
    while i < len(q):
        c = q[i]; i += 1
        for n_ in nb(c):
            if n_ not in prev: prev[n_] = c; q.append(n_)
    return q[-1], prev
start = min(ends or pts, key=lambda p: p[0])
far, _ = bfs(start)
far2, prev = bfs(far)
path = []; c = far2
while c is not None: path.append(c); c = prev[c]
if (mode == 'water' and path[0][1] > path[-1][1]) or (mode != 'water' and path[0][0] > path[-1][0]): path.reverse()
def rdp(P, eps):
    if len(P) < 3: return P
    a, bb = np.array(P[0], float), np.array(P[-1], float)
    d = bb - a; L = np.hypot(*d) or 1
    dists = [abs(d[0] * (p[1] - a[1]) - d[1] * (p[0] - a[0])) / L for p in P]
    i = int(np.argmax(dists))
    if dists[i] > eps: return rdp(P[:i + 1], eps)[:-1] + rdp(P[i:], eps)
    return [P[0], P[-1]]
simp = rdp(path, 3.0)
width = float(2 * ndi.distance_transform_edt(m)[sk].mean())
json.dump({'image_size': [im.shape[1], im.shape[0]], 'path_width': round(width, 1),
           'waypoints': [[int(x), int(y)] for x, y in simp]}, open(out, 'w'))
vis = Image.open(src).convert('RGB'); d = ImageDraw.Draw(vis)
d.line([tuple(p) for p in simp], fill=(255, 0, 255), width=5)
for p in simp: d.ellipse([p[0] - 4, p[1] - 4, p[0] + 4, p[1] + 4], fill=(0, 0, 255))
vis.save(out.replace('.json', '_check.jpg'))
print(len(path), 'skeleton px ->', len(simp), 'waypoints; width', width)
