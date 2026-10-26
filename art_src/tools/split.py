"""Step 2: split cut sheets into individual sprites, crop tight, normalize facing & size, export WebP to public/assets/v3/."""
import os, json
import numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(os.path.dirname(ROOT), 'public', 'assets', 'v3')
os.makedirs(OUT, exist_ok=True)

def groups_by_columns(a, n, thr=24):
    col = (a > thr).sum(axis=0) > 2
    runs, x, W = [], 0, len(col)
    while x < W:
        if col[x]:
            s = x
            while x < W and col[x]: x += 1
            runs.append([s, x])
        else: x += 1
    while len(runs) > n:  # merge across the smallest gap
        gaps = [runs[i + 1][0] - runs[i][1] for i in range(len(runs) - 1)]
        i = int(np.argmin(gaps)); runs[i] = [runs[i][0], runs[i + 1][1]]; del runs[i + 1]
    return runs

def tight(im, thr=10, pad=4):
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > thr)
    return im.crop((max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad + 1), min(im.height, ys.max() + pad + 1)))

def clean_alpha(im):
    a = np.asarray(im).copy()
    al = a[..., 3].astype(np.float32)
    al[al < 14] = 0
    a[..., 3] = al.astype(np.uint8)
    return Image.fromarray(a, 'RGBA')

def fit(im, box):
    w, h = im.size; k = min(box / w, box / h)
    return im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)

MANIFEST = {}
def save(im, key, box, flip=False, q=86):
    im = clean_alpha(im)
    im = tight(im)
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im = fit(im, box)
    p = f'{OUT}/{key}.webp'
    im.save(p, 'WEBP', quality=q, method=6)
    MANIFEST[key] = [im.width, im.height]

def sheet(name, keys, box, flips=None):
    im = Image.open(f'{ROOT}/cut/{name}.png').convert('RGBA')
    a = np.asarray(im)[..., 3]
    runs = groups_by_columns(a, len(keys))
    if len(runs) == len(keys):
        parts = [im.crop((x0, 0, x1, im.height)) for x0, x1 in runs]
    else:  # overlapping columns -> connected components, small bits join the nearest big blob
        from scipy import ndimage
        lab, n = ndimage.label(a > 24)
        sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
        cents = ndimage.center_of_mass(np.ones_like(a), lab, range(1, n + 1))
        seeds = sorted(np.argsort(sizes)[::-1][:len(keys)], key=lambda i: cents[i][1])
        owner = {}
        for i in range(n):
            owner[i + 1] = min(range(len(seeds)), key=lambda s: abs(cents[i][1] - cents[seeds[s]][1]) + abs(cents[i][0] - cents[seeds[s]][0]) * 0.3)
        arr = np.asarray(im)
        parts = []
        for s in range(len(seeds)):
            m = np.isin(lab, [l for l, o in owner.items() if o == s])
            m = ndimage.binary_dilation(m, iterations=3)
            o = arr.copy(); o[..., 3] = np.where(m, o[..., 3], 0)
            parts.append(Image.fromarray(o, 'RGBA'))
    for i, (k, part) in enumerate(zip(keys, parts)):
        if k is None: continue
        save(part, k, box[i] if isinstance(box, list) else box, bool(flips and flips[i]))

T = 256  # tower sprite box (px); rendered ~70-80px so 2-3x for hi-dpi crispness
sheet('dart', ['dart_monkey_0', 'dart_monkey_1', 'dart_monkey_2'], T, [1, 1, 1])
sheet('ninja', ['ninja_monkey_0', 'ninja_monkey_1', 'ninja_monkey_2'], T, [1, 1, 1])
sheet('wizard', ['wizard_monkey_0', 'wizard_monkey_1', 'wizard_monkey_2'], T, [1, 1, 1])
sheet('super', ['super_monkey_0', 'super_monkey_1', 'super_monkey_2'], T)
sheet('money', ['money_monkey_0', 'money_monkey_1', 'money_monkey_2'], T)
sheet('solar', ['solar_pea_fusion_0', 'solar_pea_fusion_1', 'solar_pea_fusion_2'], T)
sheet('gatling', ['gatling_cherry_bomber_0', 'gatling_cherry_bomber_1', 'gatling_cherry_bomber_2'], T)
sheet('melon', ['flame_melon_mortar_0', 'flame_melon_mortar_1', 'flame_melon_mortar_2'], T)
sheet('star', ['star_emperor_0', 'star_emperor_1', 'star_emperor_2'], T)
sheet('frost', ['frost_wallnut_bastion_0', 'frost_wallnut_bastion_1', 'frost_wallnut_bastion_2'], T)
sheet('firebase', ['unsc_firebase_0', 'unsc_firebase_1', 'unsc_firebase_2'], T)
sheet('depot', ['unsc_depot_0', 'unsc_depot_1', 'unsc_depot_2'], T)
sheet('turret_bases', ['turret_base_0', 'turret_base_1', 'turret_base_2'], T)
sheet('auto_heads', ['unsc_autoturret_head_0', 'unsc_autoturret_head_1', 'unsc_autoturret_head_2'], T)
sheet('rail_heads', ['unsc_rail_head_0', 'unsc_rail_head_1', 'unsc_rail_head_2'], T)
U = 160
sheet('marine', ['marine_0', 'marine_1', 'marine_2'], U)
sheet('msoldier', ['monkey_soldier_0', 'monkey_soldier_1', 'monkey_soldier_2'], U)
sheet('linewatch', ['line_watch_0', 'line_watch_1', 'line_watch_2', 'line_watch_3'], U)
sheet('worker', ['farmhand_0', 'farmhand_1', 'drop_pod'], [U, U, 192])
sheet('bugs1', ['bug_scavenger', 'bug_hunter', 'bug_charger'], [128, 160, 224], [0, 0, 1])
sheet('bugs2', ['bug_brood', 'bug_titan'], [224, 384])
sheet('bloons1', ['bloon_red', 'bloon_blue', 'bloon_green', 'bloon_yellow', 'bloon_pink'], 128)
sheet('bloons2', ['bloon_lead', 'bloon_ceramic', 'bloon_moab'], [128, 128, 384])
sheet('items', ['fx_dart', 'fx_shuriken', 'fx_ice', 'fx_melon', 'fx_cherry', 'fx_bullet', 'fx_crate', 'fx_coin'], [96, 64, 64, 64, 48, 48, 96, 48])
# fx grid 4x2 on black
fx = Image.open(f'{ROOT}/cut/fx.png').convert('RGBA'); W, H = fx.size
names = [['fx_boom', 'fx_muzzle', 'fx_magic', 'fx_spark'], ['fx_acid', 'fx_pop', 'fx_pea', 'fx_star']]
for r in range(2):
    for c in range(4):
        cell = fx.crop((c * W // 4, r * H // 2, (c + 1) * W // 4, (r + 1) * H // 2))
        k = names[r][c]
        save(cell, k, 192 if k in ('fx_boom', 'fx_pop', 'fx_acid', 'fx_spark') else 96, flip=(k == 'fx_pea'), q=82)

tot = sum(os.path.getsize(f'{OUT}/{f}') for f in os.listdir(OUT))
print(len(MANIFEST), 'sprites', round(tot / 1024), 'KB')
json.dump(MANIFEST, open(os.path.join(os.path.dirname(ROOT), 'src', 'render', 'art.manifest.json'), 'w'), indent=0)
