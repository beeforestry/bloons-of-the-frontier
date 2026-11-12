"""t76: first-person enemy GLBs modelled to match the painted v3 sprites (public/assets/v3/bloon_*, bug_*, boss_*).
blender -b -P art_src/glb_t76/scripts/build_enemies.py -- <name|all>
Conventions: +X = forward (direction of travel), Z up (glTF Y up). Bloons/blimps: centred on origin. Walkers: feet on z=0."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *

def normalize(ob, size, axis='xy', ground=True, centre=False):
    import mathutils
    bb = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    mn = Vector([min(p[i] for p in bb) for i in range(3)]); mx = Vector([max(p[i] for p in bb) for i in range(3)])
    d = mx - mn; cur = max(d.x, d.y) if axis == 'xy' else (d.z if axis == 'z' else d.x)
    s = size / cur
    ob.scale = (s, s, s); bpy.ops.object.transform_apply(scale=True)
    bb = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    mn = Vector([min(p[i] for p in bb) for i in range(3)]); mx = Vector([max(p[i] for p in bb) for i in range(3)])
    off = Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z if ground else -(mn.z + mx.z) / 2))
    ob.location = off; bpy.ops.object.transform_apply(location=True)

def legs(xs, w, hz, reach, lift, r, m, tip_m=None, fwd=0.25, tip=0.0, segs=3, foot_z=0.0):
    chains = []; tips = []; r = r * 2.3  # t76 pass 2: sturdier legs like the painted sprites
    reach *= 1.35; fwd *= 1.7; lift = lift * 1.3 + 0.05 * (lift > 0)  # wider arachnid stance (sprite silhouettes)
    if len(xs) > 1:
        mid = sum(xs) / len(xs); xs = [mid + (x - mid) * 1.35 for x in xs]
    n = len(xs)
    for i, x in enumerate(xs):
        dx = (i - (n - 1) / 2) / max(1, (n - 1) / 2) * fwd   # front legs reach forward, rear legs back
        for s in (1, -1):
            hip = Vector((x, s * w, hz)); knee = Vector((x + dx * 0.5, s * (w + reach * 0.5), hz + lift))
            foot = Vector((x + dx, s * (w + reach), foot_z))
            if segs == 3:
                mid = knee.lerp(foot, 0.5) + Vector((0, s * reach * 0.05, lift * 0.15))
                chains.append([(hip, r), (knee, r * 0.95), (mid, r * 0.75), (foot, r * 0.4)])
            else:
                chains.append([(hip, r), (knee, r * 0.9), (foot, r * 0.4)])
            if tip_m and tip > 0:
                tips.append(cone_between(foot + Vector((0, 0, tip * 0.3)), foot - Vector((0, 0, tip * 0.4)) + Vector((dx * 0.1, s * tip * 0.2, 0)), r * 0.35, tip_m, 0.0, 6))
    return [skin_chains('legs', chains, m, lv=1)] + tips

def segmented(c, r, m, n=5, axis=0, shrink=0.06, dark=None):
    """overlapping slices -> segmented abdomen / plated shell"""
    out = []; c = Vector(c)
    for k in range(n):
        t = -1 + 2 * (k + 0.5) / n
        f = math.sqrt(max(0.05, 1 - t * t)) * (1 - shrink * (k % 2))
        p = c.copy(); p[axis] += t * r[axis] * 0.85
        rr = [r[0] * f, r[1] * f, r[2] * f]; rr[axis] = r[axis] / n * 1.25
        out.append(ell(p, rr, m if not dark or k % 2 == 0 else dark, 18, 12))
    return out

def eyes(p, sep, r, m, fwd=Vector((1, 0, 0))):
    return [ell(Vector(p) + Vector((0, s * sep, 0)), (r, r, r), m, 10, 6) for s in (1, -1)]

# =============================================================== BALLOONS
BLOON_RGB = {'red': (215, 18, 12), 'blue': (12, 98, 200), 'green': (20, 128, 48), 'yellow': (240, 182, 18), 'pink': (230, 40, 115)}
def balloon_profile(R=0.6, H=0.72, n=22):
    pr = [(0.0, -H - 0.02)]
    for i in range(1, n):
        t = i / n * math.pi
        z = -H * math.cos(t)
        r = R * math.sin(t) ** 0.85 * (0.80 + 0.2 * (-math.cos(t) * 0.5 + 0.5)) ** 1.0
        pr.append((r, z))
    pr.append((0.0, H)); return pr

def string(m, z0=-0.86, L=0.75):
    pts = []
    for i in range(24):
        t = i / 23; pts.append((0.05 * math.sin(t * 9), 0.05 * math.cos(t * 9) * t, z0 - t * L))
    return tube_path('string', pts, 0.008, m, 4)

def knot(m, H=0.72):
    return [cyl((0, 0, -H - 0.04), 0.035, 0.08, m, 10, r2=0.06), torus((0, 0, -H - 0.09), 0.05, 0.022, m, seg=12), ell((0, 0, -H - 0.12), (0.03, 0.03, 0.03), m, 8, 6)]

def build_bloon(col):
    reset(); rgb = BLOON_RGB[col]
    rub = mat('Rubber_' + col, 'rubber', rgb, rough=0.16)
    sm = mat('String', None, (200, 200, 205), rough=0.5)
    objs = [lathe('body', balloon_profile(), rub, 28)] + knot(rub) + [string(sm)]
    ob = finalize('bloon_' + col, objs); return ob

def build_lead():
    reset(); M = mat('LeadPlate', 'metal', (118, 114, 106), (78, 75, 68), metal=0.35, rough=0.5)
    strap = mat('LeadStrap', 'metal', (70, 68, 62), metal=0.45, rough=0.45)
    riv = mat('Rivet', None, (150, 146, 138), metal=0.8, rough=0.3)
    objs = [ell((0, 0, 0), (0.62, 0.62, 0.62), M, 28, 18)]
    for k in range(4):  # meridian straps
        objs.append(torus((0, 0, 0), 0.625, 0.02, strap, rot=(math.pi / 2, 0, k * math.pi / 4), scale=(1, 1, 1.6), seg=36))
    objs.append(torus((0, 0, 0), 0.625, 0.022, strap, scale=(1, 1, 1.6), seg=36))
    for k in range(16):
        a = k / 16 * math.tau
        for z in (-0.32, 0.32):
            rr = math.sqrt(0.62 ** 2 - z * z) + 0.005
            objs.append(ell((math.cos(a) * rr, math.sin(a) * rr, z), (0.018,) * 3, riv, 6, 4))
    # valve nozzle (sprite: bottom-right metal valve)
    v = Vector((0.0, 0.32, -0.5)); d = v.normalized()
    objs += [cone_between(v * 0.98, v * 1.0 + d * 0.16, 0.09, strap, 0.06, 10), aim(torus(v + d * 0.1, 0.075, 0.02, riv, seg=12), d),
             cone_between(v + d * 0.16, v + d * 0.24, 0.05, riv, 0.05, 8)]
    return finalize('bloon_lead', objs)

def build_ceramic():
    reset(); C = mat('Clay', 'clay', (226, 210, 186), rough=0.75)
    rope = mat('Rope', 'cloth', (112, 84, 52), rough=0.95)
    objs = [ell((0, 0, 0), (0.62, 0.62, 0.66), C, 28, 18)]
    for k in range(5):
        objs.append(torus((0, 0, 0), 0.63, 0.018, rope, rot=(math.pi / 2, 0, k * math.pi / 5 + 0.2), scale=(1, 1, 1.05), seg=36))
    for z in (-0.33, 0.0, 0.33):
        rr = 0.62 * math.sqrt(1 - (z / 0.66) ** 2) + 0.01
        objs.append(torus((0, 0, z), rr, 0.016, rope, seg=36))
    objs += [cyl((0.05, 0.0, -0.66), 0.08, 0.1, C, 12, r2=0.05), torus((0.05, 0, -0.72), 0.06, 0.025, rope, seg=12),
             cone_between((0.05, 0, -0.74), (0.16, 0.04, -0.86), 0.03, rope, 0.01, 6), cone_between((0.05, 0, -0.74), (-0.04, -0.05, -0.88), 0.03, rope, 0.01, 6)]
    return finalize('bloon_ceramic', objs)

# =============================================================== BLIMPS
def blimp_profile(L, R, nose=0.25, tail=0.35, n=26):
    pr = []
    for i in range(n + 1):
        t = i / n; x = -L / 2 + t * L
        if t < tail: r = R * math.sin(t / tail * math.pi / 2) ** 0.8 * (0.6 + 0.4 * t / tail)
        elif t > 1 - nose: r = R * math.sqrt(max(0, 1 - ((t - (1 - nose)) / nose) ** 2))
        else: r = R
        pr.append((max(0.0, r) if 0 < i < n else 0.0, x))
    return pr

def fins(m, x, R, span, chord, n=4, rot0=0.0):
    out = []
    for k in range(n):
        a = rot0 + k * math.tau / n
        d = Vector((0, math.cos(a), math.sin(a)))
        b = box(Vector((x, 0, 0)) + d * (R * 0.6 + span / 2), (chord, 0.04, span), m, bev=0.015)
        b.rotation_mode = 'QUATERNION'; b.rotation_quaternion = d.to_track_quat('Z', 'X'); out.append(b)
    return out

def build_moab():
    reset(); P = mat('MoabPlates', 'plates', (104, 124, 154), (74, 88, 108), metal=0.2, rough=0.5, N=256)
    G = mat('MoabGold', 'metal', (190, 150, 70), metal=0.8, rough=0.3); D = mat('MoabSteel', 'metal', (72, 80, 90), metal=0.4, rough=0.45)
    L, Rr = 4.0, 0.95
    objs = [lathe('env', blimp_profile(L, Rr, 0.22, 0.45), P, 32, 'X')]
    objs.append(torus((0.9, 0, 0), Rr * 1.01, 0.08, G, rot=(0, math.pi / 2, 0), seg=36))           # gold ring band
    sw = torus((-0.1, 0, 0.0), 1.0, 0.06, G, rot=(math.pi / 2, 0, 0), scale=(1.55, 1, Rr * 1.02), seg=40)  # swept side band (front-top to rear)
    sw.rotation_euler = (math.pi / 2, -0.28, 0)
    objs.append(sw)
    objs += fins(P, -1.6, Rr * 0.45, 0.85, 0.75, 4, math.pi / 4)
    objs.append(cone_between((2.0, 0, 0), (2.16, 0, 0), 0.08, D, 0.03, 10))
    objs.append(ell((2.17, 0, 0), (0.04, 0.04, 0.04), D, 8, 6))
    ob = finalize('bloon_moab', objs); normalize(ob, 4.0, 'x', ground=False); return ob

def build_zeppelin():
    reset(); P = mat('ZepHide', 'plates', (128, 42, 40), (88, 30, 28), metal=0.3, rough=0.55, N=256)
    Br = mat('ZepBronze', 'metal', (120, 92, 66), metal=0.75, rough=0.38); Bone = mat('Skull', 'bone', (214, 200, 172), (170, 150, 120), rough=0.6)
    Bk = mat('Socket', None, (10, 8, 6), rough=0.9); Wd = mat('PropWood', 'cloth', (130, 104, 78), rough=0.7)
    L, Rr = 4.2, 1.0
    objs = [lathe('env', blimp_profile(L, Rr, 0.3, 0.3), P, 32, 'X')]
    for x in (-1.2, -0.5, 0.2, 0.9, 1.5):
        rr = Rr * (0.9 if abs(x) > 1.3 else 1.0)
        objs.append(torus((x, 0, 0), rr * 1.005, 0.035, Br, rot=(0, math.pi / 2, 0), seg=36))
    objs.append(torus((0, 0, 0), 1.0, 0.03, Br, rot=(math.pi / 2, 0, 0), scale=(2.1, 1, 1.0), seg=40))   # longitudinal strap
    for s in (1, -1):  # skull emblem on round plate, both sides
        c = Vector((0.6, s * 1.0, 0.05))
        objs.append(aim(cyl(c, 0.32, 0.05, Br, 20), (0, s, 0)))
        objs.append(ell(c + Vector((0, s * 0.08, 0.04)), (0.17, 0.08, 0.17), Bone, 14, 10))
        objs.append(ell(c + Vector((0, s * 0.07, -0.13)), (0.1, 0.06, 0.07), Bone, 10, 6))
        for e in (-1, 1): objs.append(ell(c + Vector((e * 0.06, s * 0.14, 0.05)), (0.045, 0.03, 0.05), Bk, 8, 6))
    # propellers: front nose + two rear side props
    def prop(c, axis, r):
        out = [aim(cyl(c, 0.08, 0.16, Br, 10), axis)]
        ax = Vector(axis).normalized(); side = ax.orthogonal().normalized()
        for k in range(2):
            d = side if k == 0 else -side
            b = box(Vector(c) + d * r * 0.5, (r, 0.03, 0.16), Wd, bev=0.01); b.rotation_mode = 'QUATERNION'
            b.rotation_quaternion = d.to_track_quat('X', 'Z') @ Euler((0.5, 0, 0)).to_quaternion(); out.append(b)
        return out
    objs += prop((2.2, 0, 0), (1, 0, 0), 0.9)
    objs.append(rod((2.0, 0, 0), (2.2, 0, 0), 0.05, Br))
    for s in (1, -1):
        objs.append(rod((-1.3, s * 0.85, 0.0), (-1.3, s * 1.4, 0.0), 0.04, Br)); objs += prop((-1.3, s * 1.45, 0), (1, 0, 0), 0.6)
    objs += fins(Br, -1.8, 0.55, 0.6, 0.55, 4, 0.0)
    # gondola + spike
    objs.append(lathe('gond', [(0, -0.9), (0.2, -0.85), (0.24, -0.6), (0.24, 0.5), (0.2, 0.7), (0.0, 0.8)], Br, 16, 'X'))
    objs[-1].location = (0.0, 0, -1.25)
    objs.append(cone_between((0.75, 0, -1.25), (1.25, 0, -1.25), 0.12, Br, 0.0, 10))
    for x in (-0.5, 0.0, 0.5): objs.append(rod((x, 0, -1.05), (x, 0, -0.9), 0.03, Br))
    ob = finalize('boss_zeppelin', objs); normalize(ob, 4.8, 'x', ground=False); return ob

# =============================================================== BUGS
def build_scavenger():
    reset(); Ch = mat('ScavChitin', 'chitin', (150, 82, 46), (96, 46, 22), rough=0.55); Dk = mat('ScavDark', 'chitin', (70, 30, 14), rough=0.6)
    E = mat('ScavEye', None, (20, 8, 4), rough=0.1)
    objs = [ell((-0.18, 0, 0.34), (0.38, 0.32, 0.26), Ch, 18, 12), ell((0.2, 0, 0.32), (0.2, 0.19, 0.16), Ch, 14, 10)]
    objs += spikes_on((-0.18, 0, 0.34), (0.38, 0.32, 0.26), Dk, 9, ridge=lambda t: (t, 0.55), length=0.13, base=0.035, jitter=0.6)
    objs += spikes_on((-0.18, 0, 0.34), (0.38, 0.32, 0.26), Ch, 7, ridge=lambda t: (t, 0.25), length=0.1, base=0.03, jitter=0.6)
    objs += spikes_on((-0.18, 0, 0.34), (0.38, 0.32, 0.26), Dk, 7, ridge=lambda t: (t * 0.8, 1.0), length=0.16, base=0.04)
    objs += eyes((0.37, 0, 0.36), 0.06, 0.03, E)
    objs += [cone_between((0.3, s * 0.05, 0.26), (0.42, s * 0.02, 0.18), 0.025, Dk, 0.0, 6) for s in (1, -1)]
    objs += legs([0.3, 0.08, -0.15, -0.4], 0.16, 0.32, 0.5, 0.26, 0.022, Dk, fwd=0.45)
    ob = finalize('bug_scavenger', objs); normalize(ob, 1.6); return ob

def build_hunter():
    reset(); Ch = mat('HuntChitin', 'chitin', (128, 52, 38), (70, 28, 18), rough=0.5); Sc = mat('Scythe', 'bone', (226, 210, 180), (170, 150, 120), rough=0.45)
    E = mat('HuntEye', None, (30, 6, 4), rough=0.1, emit=(0.6, 0.05, 0.02), emit_str=0.8)
    objs = []
    objs += segmented((-0.45, 0, 0.45), (0.35, 0.13, 0.13), Ch, 5)                                   # abdomen
    objs.append(skin_chains('thorax', [[((-0.1, 0, 0.45), 0.08), ((0.15, 0, 0.75), 0.07), ((0.28, 0, 1.0), 0.06)]], Ch, 1))  # upright thorax
    objs.append(ell((0.36, 0, 1.06), (0.1, 0.09, 0.08), Ch, 14, 10))                                  # head
    objs += [cone_between((0.36, s * 0.04, 1.12), (0.3, s * 0.12, 1.32), 0.02, Ch, 0.004, 6) for s in (1, -1)]  # horns
    objs += eyes((0.43, 0, 1.08), 0.05, 0.025, E)
    for s in (1, -1):  # raptorial arms with big curved scythes
        sh = Vector((0.26, s * 0.06, 0.95)); el = Vector((0.4, s * 0.25, 1.18)); wr = Vector((0.45, s * 0.3, 1.38))
        objs.append(skin_chains('arm', [[(sh, 0.04), (el, 0.035), (wr, 0.03)]], Ch, 1))
        pts = [wr + Vector((0.1 * math.sin(a), s * 0.02 * a, 0.4 * math.cos(a) - 0.0)) for a in [i / 6 * 2.3 for i in range(7)]]
        objs.append(skin_chains('scythe', [[(p, (0.05 * (1 - i / 7) + 0.006, 0.014)) for i, p in enumerate(pts)]], Sc, 1))
    for i, x in enumerate((0.05, -0.15, -0.35)):  # spiky stilt legs
        pass
    objs += legs([0.05, -0.15, -0.35], 0.07, 0.45, 0.6, 0.35, 0.03, Ch, fwd=0.5)
    objs += spikes_on((-0.45, 0, 0.45), (0.35, 0.13, 0.13), Ch, 5, ridge=lambda t: (t, 1.0), length=0.08, base=0.02)
    ob = finalize('bug_hunter', objs); normalize(ob, 1.7); return ob

def build_charger():
    reset(); Ab = mat('ChargAbd', 'chitin', (190, 92, 30), (110, 46, 14), rough=0.4); Pl = mat('ChargPlate', 'bone', (222, 214, 196), (160, 150, 130), rough=0.55)
    Dk = mat('ChargLeg', 'chitin', (64, 48, 40), (34, 24, 20), rough=0.55); E = mat('ChargEye', None, (15, 10, 8), rough=0.1)
    objs = segmented((-0.45, 0, 0.5), (0.4, 0.33, 0.33), Ab, 6, dark=mat('ChargBand', 'chitin', (120, 52, 16), rough=0.45))
    objs.append(ell((0.1, 0, 0.5), (0.3, 0.3, 0.3), Dk, 16, 10))
    # bone-white armoured front carapace with spines (frontArmor)
    for j in range(3):
        objs.append(ell((0.2 - j * 0.12, 0, 0.6 + j * 0.02), (0.35 - j * 0.03, 0.36, 0.28), Pl, 18, 12))
    objs += spikes_on((0.1, 0, 0.6), (0.4, 0.37, 0.3), Pl, 6, ridge=lambda t: (t * 0.9, 0.35), length=0.22, base=0.05, jitter=0.4)
    objs += spikes_on((0.1, 0, 0.6), (0.4, 0.37, 0.3), Pl, 4, ridge=lambda t: (t * 0.7, 1.0), length=0.18, base=0.05)
    objs.append(ell((0.48, 0, 0.42), (0.13, 0.15, 0.11), Dk, 14, 10))
    objs += eyes((0.58, 0, 0.45), 0.07, 0.03, E)
    objs += [cone_between((0.55, s * 0.08, 0.35), (0.72, s * 0.04, 0.3), 0.035, Pl, 0.0, 6) for s in (1, -1)]
    objs += legs([0.3, 0.05, -0.2], 0.25, 0.45, 0.6, 0.15, 0.05, Dk, fwd=0.4, tip_m=Pl, tip=0.08)
    ob = finalize('bug_charger', objs); normalize(ob, 1.8); return ob

def build_brood():
    reset(); Sac = mat('BroodSac', 'rubber', (212, 166, 36), rough=0.25, emit=(0.3, 0.2, 0.0), emit_str=0.2)
    Egg = mat('BroodEgg', None, (236, 186, 52), rough=0.2); Ch = mat('BroodChitin', 'chitin', (64, 56, 46), (36, 30, 24), rough=0.5)
    objs = [ell((-0.2, 0, 0.55), (0.5, 0.45, 0.45), Sac, 24, 16)]
    for i in range(42):  # bumpy egg clusters on the sac (sprite)
        u = rng.random() * 2 - 1; a = rng.random() * math.tau
        if u > 0.55: continue
        d = Vector((u, math.cos(a) * math.sqrt(1 - u * u), math.sin(a) * math.sqrt(1 - u * u)))
        p = Vector((-0.2, 0, 0.55)) + Vector((d.x * 0.5, d.y * 0.45, d.z * 0.45))
        if p.z < 0.25: continue
        objs.append(ell(p, (0.06,) * 3, Egg, 8, 6))
    objs += segmented((0.35, 0, 0.5), (0.3, 0.3, 0.27), Ch, 4)                 # dark segmented front body (grub)
    objs.append(ell((0.62, 0, 0.42), (0.12, 0.15, 0.12), Ch, 14, 10))
    objs += [cone_between((0.7, s * 0.06, 0.35), (0.8, s * 0.02, 0.28), 0.03, Ch, 0.0, 6) for s in (1, -1)]
    objs += legs([0.45, 0.3, 0.12], 0.22, 0.38, 0.45, 0.12, 0.035, Ch, fwd=0.3)
    ob = finalize('bug_brood', objs); normalize(ob, 1.8); return ob

def build_ironback():
    reset(); Pl = mat('IronPlate', 'metal', (120, 114, 106), (80, 74, 66), metal=0.55, rough=0.45); Dk = mat('IronLeg', 'chitin', (60, 48, 38), (34, 26, 20), rough=0.55)
    E = mat('IronEye', None, (200, 20, 10), rough=0.1, emit=(1, 0.08, 0.02), emit_str=1.5)
    objs = []
    Gap = mat('IronGap', 'chitin', (40, 32, 26), rough=0.6)
    objs.append(ell((-0.05, 0, 0.4), (0.55, 0.43, 0.34), Gap, 20, 12))
    for j in range(5):  # overlapping armour bands (sprite: domed grey plates with dark seams)
        x = 0.35 - j * 0.2
        objs.append(ell((x, 0, 0.44), (0.13, 0.46 - abs(j - 2) * 0.04, 0.39 - abs(j - 2) * 0.04), Pl, 20, 12))
    objs += spikes_on((-0.05, 0, 0.42), (0.55, 0.45, 0.4), Pl, 6, ridge=lambda t: (t, 1.0), length=0.08, base=0.03)
    objs += spikes_on((-0.05, 0, 0.42), (0.55, 0.45, 0.4), Pl, 6, ridge=lambda t: (t, 0.45), length=0.07, base=0.03)
    objs.append(ell((0.55, 0, 0.3), (0.13, 0.18, 0.12), Dk, 14, 10))
    objs += eyes((0.66, 0, 0.32), 0.08, 0.025, E)
    objs += legs([0.4, 0.05, -0.35], 0.32, 0.3, 0.45, 0.2, 0.03, Dk, fwd=0.4, tip_m=Dk, tip=0.06)
    ob = finalize('bug_ironback', objs); normalize(ob, 1.8); return ob

def build_warden():
    reset(); Sh = mat('WardShell', 'chitin', (104, 74, 150), (60, 50, 100), metal=0.2, rough=0.3)
    Gl = mat('WardGlow', None, (80, 230, 255), rough=0.2, emit=(0.25, 0.85, 1.0), emit_str=2.5)
    Lg = mat('WardLeg', 'chitin', (110, 86, 150), (50, 40, 70), rough=0.45)
    objs = [ell((-0.05, 0, 0.5), (0.5, 0.42, 0.38), Sh, 24, 14)]
    for k in range(5):  # glowing energy seams across the dome
        a = -0.9 + k * 0.45
        objs.append(torus((-0.05 + a * 0.35, 0, 0.5), 0.4 * math.sqrt(1 - (a * 0.7) ** 2), 0.012, Gl, rot=(0, math.pi / 2, 0), scale=(1, 1.05, 0.95), seg=28))
    objs.append(torus((-0.05, 0, 0.5), 0.5, 0.012, Gl, rot=(math.pi / 2, 0, 0), scale=(1, 1, 0.76), seg=32))
    objs.append(ell((0.48, 0, 0.36), (0.14, 0.16, 0.12), Lg, 14, 10))
    objs += eyes((0.58, 0, 0.4), 0.07, 0.025, Gl)
    objs += legs([0.3, 0.05, -0.25], 0.25, 0.35, 0.65, 0.3, 0.035, Lg, fwd=0.5, tip_m=Lg, tip=0.07)
    ob = finalize('bug_warden', objs); normalize(ob, 1.8); return ob

def build_gargoyle():
    reset(); Ab = mat('GargAbd', 'chitin', (200, 100, 40), (90, 40, 16), rough=0.4); Bd = mat('GargBand', 'chitin', (70, 34, 18), rough=0.5)
    Th = mat('GargThorax', 'chitin', (150, 74, 34), (80, 36, 16), rough=0.45); E = mat('GargEye', None, (25, 12, 6), rough=0.1)
    W = mat('GargWing', None, (225, 210, 185), rough=0.3, alpha=0.45)
    objs = segmented((-0.45, 0, 0.0), (0.42, 0.14, 0.14), Ab, 6, dark=Bd)
    for o in objs[-6:]: o.rotation_euler = (0, -0.35, 0)
    objs.append(cone_between((-0.82, 0, -0.18), (-1.0, 0, -0.32), 0.04, Bd, 0.0, 6))           # stinger
    objs.append(ell((0.05, 0, 0.05), (0.16, 0.13, 0.13), Th, 14, 10))
    objs.append(ell((0.27, 0, 0.08), (0.09, 0.11, 0.09), Th, 12, 8))
    objs += [ell((0.32, s * 0.07, 0.1), (0.04, 0.035, 0.05), E, 8, 6) for s in (1, -1)]
    objs += [tube_path('ant', [(0.33, s * 0.03, 0.15), (0.45, s * 0.1, 0.28), (0.6, s * 0.15, 0.3)], 0.006, Th, 4) for s in (1, -1)]
    for s in (1, -1):  # 2 pairs of veined translucent wings, swept up
        for j, (L, ang) in enumerate(((1.15, 0.15), (0.8, 0.0))):
            w = ell((0.0 - j * 0.12, s * (0.06 + L * 0.48), 0.22 + L * 0.2), (0.17, L * 0.5, 0.008), W, 16, 6)
            w.rotation_euler = (s * (0.4 + ang), 0, s * (0.25 - j * 0.35)); objs.append(w)
            objs.append(aim(cyl((0.0 - j * 0.12, s * (0.06 + L * 0.48), 0.22 + L * 0.2), 0.006, L * 0.95, mat('GargVein', None, (90, 50, 30), rough=0.5), 4), (0, s, 0.42 + ang)))
    objs += legs([0.12, 0.02, -0.08], 0.06, -0.02, 0.22, -0.05, 0.015, Bd, fwd=0.2, foot_z=-0.25, segs=2)
    ob = finalize('bug_gargoyle', objs); normalize(ob, 2.0, ground=False); return ob

def build_titan():
    reset(); Sk = mat('TitanHide', 'flesh', (78, 84, 40), (44, 46, 20), rough=0.7); Pl = mat('TitanPlate', 'bone', (150, 146, 92), (92, 92, 50), rough=0.6)
    Bile = mat('TitanBile', 'flesh', (110, 200, 30), (70, 150, 10), rough=0.2, emit=(0.3, 0.85, 0.05), emit_str=0.3); E = mat('TitanEye', None, (10, 10, 4), rough=0.1)
    objs = [ell((-0.1, 0, 1.15), (0.95, 0.6, 0.6), Sk, 24, 16)]
    objs.append(ell((-0.1, 0.36, 1.05), (0.62, 0.36, 0.42), Bile, 20, 12))                        # glowing bile sac (side, like sprite)
    objs.append(ell((-0.05, -0.38, 1.0), (0.5, 0.28, 0.34), Bile, 20, 12))
    for j in range(7):  # spiky dorsal armour plates
        x = 0.7 - j * 0.25
        objs.append(ell((x, 0, 1.55 - abs(j - 3) * 0.05), (0.16, 0.5, 0.2), Pl, 14, 8))
        objs.append(cone_between((x, 0, 1.65), (x - 0.1, 0, 2.0 - abs(j - 3) * 0.05), 0.08, Pl, 0.0, 6))
        for s in (1, -1): objs.append(cone_between((x, s * 0.42, 1.45), (x - 0.08, s * 0.7, 1.6), 0.06, Pl, 0.0, 6))
    objs.append(ell((1.05, 0, 0.95), (0.35, 0.33, 0.3), Pl, 16, 10))                                # armoured head
    objs += eyes((1.3, 0, 1.0), 0.15, 0.04, E)
    for s in (1, -1):
        objs.append(skin_chains('tusk', [[((1.25, s * 0.18, 0.8), 0.06), ((1.45, s * 0.25, 0.55), 0.04), ((1.4, s * 0.2, 0.3), 0.01)]], Pl, 1))
        objs.append(skin_chains('mand', [[((1.3, s * 0.08, 0.75), 0.04), ((1.5, s * 0.06, 0.5), 0.025), ((1.45, s * 0.02, 0.32), 0.008)]], Pl, 1))
    legs4 = []
    for x, s in ((0.55, 1), (0.55, -1), (-0.7, 1), (-0.7, -1)):
        legs4.append([((x, s * 0.4, 1.0), 0.24), ((x + 0.08, s * 0.55, 0.5), 0.2), ((x, s * 0.58, 0.08), 0.2)])
    objs.append(skin_chains('legs', legs4, Sk, 1))
    for x, s in ((0.55, 1), (0.55, -1), (-0.7, 1), (-0.7, -1)):
        for k in range(3): objs.append(cone_between((x + 0.12, s * (0.5 + 0.08 * (k - 1)), 0.08), (x + 0.3, s * (0.5 + 0.1 * (k - 1)), 0.0), 0.05, Pl, 0.0, 6))
        objs.append(torus((x + 0.06, s * 0.56, 0.6), 0.2, 0.04, Pl, scale=(1, 1, 0.5)))         # knee plates/rings
    ob = finalize('bug_titan', objs, decimate_over=16000); normalize(ob, 3.4); return ob

# =============================================================== BOSSES (ground)
def build_scarab():
    reset(); Sh = mat('ScarabShell', 'chitin', (88, 62, 120), (50, 34, 68), metal=0.25, rough=0.35); Lg = mat('ScarabLeg', 'chitin', (82, 60, 104), (36, 24, 44), rough=0.45)
    St = mat('ScarabSteel', 'metal', (84, 84, 88), metal=0.5, rough=0.4); Pl = mat('Plasma', None, (90, 230, 40), rough=0.2, emit=(0.3, 1.0, 0.1), emit_str=0.5)
    objs = segmented((-0.1, 0, 0.85), (1.05, 0.85, 0.68), Sh, 6, axis=0, shrink=0.05, dark=mat('ScarabBand', 'chitin', (64, 44, 90), rough=0.35))
    objs.append(ell((0.85, 0, 0.6), (0.3, 0.4, 0.28), Lg, 16, 10))
    objs += [cone_between((1.05, s * 0.18, 0.45), (1.3, s * 0.08, 0.3), 0.06, Lg, 0.0, 6) for s in (1, -1)]
    objs += legs([0.6, 0.25, -0.15, -0.55], 0.6, 0.45, 0.7, 0.3, 0.04, Lg, fwd=0.4, tip_m=Lg, tip=0.15)
    # mounted plasma cannon (sprite signature)
    objs.append(box((-0.1, 0, 1.5), (0.7, 0.4, 0.22), St, bev=0.04))
    objs.append(rod((-0.3, 0, 1.68), (0.75, 0, 1.72), 0.15, St, 12))
    for x in (0.0, 0.25, 0.5): objs.append(torus((x, 0, 1.7 + x * 0.04), 0.17, 0.035, St, rot=(0, math.pi / 2 - 0.05, 0), seg=14))
    objs.append(cone_between((0.75, 0, 1.72), (0.95, 0, 1.74), 0.18, St, 0.14, 12))
    objs.append(ell((1.12, 0, 1.74), (0.28, 0.13, 0.13), Pl, 12, 8))
    objs.append(ell((-0.5, 0, 1.68), (0.12, 0.14, 0.12), Pl, 10, 6))                               # power core
    ob = finalize('boss_scarab', objs, decimate_over=18000); normalize(ob, 3.4); return ob

def build_leviathan():
    reset(); Sh = mat('LevShell', 'flesh', (150, 62, 66), (88, 36, 38), rough=0.45); Bn = mat('LevBone', 'bone', (206, 176, 160), (150, 110, 100), rough=0.5)
    Lg = mat('LevLeg', 'chitin', (140, 64, 64), (70, 30, 30), rough=0.45); Ey = mat('LevEye', None, (255, 60, 220), rough=0.1, emit=(1.0, 0.2, 0.9), emit_str=4.0)
    Gl = mat('LevGlow', None, (80, 200, 230), rough=0.2, emit=(0.2, 0.7, 0.9), emit_str=0.25)
    objs = [ell((-0.1, 0, 1.05), (1.3, 1.2, 0.62), Sh, 28, 16)]
    for j in range(3): objs.append(ell((-0.1 - j * 0.1, 0, 1.2 + j * 0.1), (1.2 - j * 0.22, 1.1 - j * 0.22, 0.5 - j * 0.08), Sh, 24, 12))
    objs += spikes_on((-0.1, 0, 1.0), (1.33, 1.23, 0.55), Bn, 10, ridge=lambda t: (t, 0.1), length=0.35, base=0.1, jitter=0.4)   # rim spikes
    objs += spikes_on((-0.1, 0, 1.08), (1.2, 1.1, 0.68), Bn, 8, ridge=lambda t: (t * 0.85, 0.55), length=0.25, base=0.08, jitter=0.4)
    for p in ((-0.6, 0.2, 1.55), (-0.35, -0.25, 1.6), (-0.8, -0.1, 1.5), (-0.5, 0.0, 1.68)):     # egg/pustule cluster on top
        objs.append(ell(p, (0.24, 0.24, 0.2), mat('LevPustule', 'flesh', (170, 96, 96), (120, 60, 60), rough=0.3), 14, 10))
    objs.append(ell((0.95, 0, 0.75), (0.35, 0.45, 0.3), Lg, 18, 10))                                 # head
    objs.append(ell((1.25, 0, 0.78), (0.1, 0.1, 0.1), Ey, 14, 10))                                   # glowing magenta eye
    for s in (1, -1):  # big front claws + mandibles
        objs.append(skin_chains('claw', [[((1.0, s * 0.35, 0.7), 0.12), ((1.45, s * 0.6, 0.6), 0.09), ((1.7, s * 0.45, 0.25), 0.06), ((1.6, s * 0.25, 0.0), 0.01)]], Lg, 1))
        objs.append(cone_between((1.15, s * 0.15, 0.55), (1.45, s * 0.05, 0.2), 0.06, Bn, 0.0, 6))
    objs += legs([0.55, 0.15, -0.3, -0.75], 0.9, 0.85, 0.8, 0.7, 0.09, Lg, fwd=0.45, tip_m=Bn, tip=0.35)
    objs.append(torus((-0.1, 0, 0.62), 1.0, 0.03, Gl, scale=(1.1, 1.0, 1), seg=32))
    ob = finalize('boss_leviathan', objs, decimate_over=22000); normalize(ob, 3.8); return ob

def build_dreadnought():
    reset(); Fl = mat('ZombieFlesh', 'flesh', (118, 140, 70), (70, 88, 40), rough=0.7); Ar = mat('RustPlate', 'metal', (96, 70, 48), (56, 38, 25), metal=0.3, rough=0.6)
    Cl = mat('Rag', 'cloth', (110, 40, 30), rough=0.9); Bn = mat('Teeth', 'bone', (220, 200, 160), rough=0.5); Ey = mat('ZEye', None, (240, 210, 80), rough=0.2, emit=(1, 0.8, 0.2), emit_str=1.5)
    Bl = mat('Gore', None, (110, 20, 14), rough=0.4); Ir = mat('MaceIron', 'metal', (84, 70, 58), metal=0.8, rough=0.4)
    V = {'pel': (0, 0, 1.1), 'chest': (0.05, 0, 1.65), 'neck': (0.15, 0, 2.0)}
    body = [[((0, 0, 1.1), 0.24), ((0.05, 0, 1.65), 0.28), ((0.18, 0, 2.0), 0.13)]]
    arms = [[((0.05, s * 0.4, 1.85), 0.13), ((0.1, s * 0.68, 1.35), 0.13), ((0.3, s * 0.72, 0.95), 0.13), ((0.4, s * 0.72, 0.8), 0.14)] for s in (1, -1)]
    lgs = [[((0, s * 0.22, 1.05), 0.15), ((0.15, s * 0.3, 0.55), 0.14), ((0.0, s * 0.32, 0.1), 0.13), ((0.25, s * 0.32, 0.05), 0.1)] for s in (1, -1)]
    objs = [skin_chains('body', body + arms + lgs, Fl, 1)]
    H = Vector((0.28, 0, 2.18))
    objs.append(ell(H, (0.25, 0.22, 0.25), Fl, 18, 12))
    objs.append(ell(H + Vector((0.12, 0, -0.17)), (0.16, 0.18, 0.08), Fl, 14, 8))                     # slack jaw
    objs.append(ell(H + Vector((0.18, 0, -0.08)), (0.06, 0.13, 0.06), Bl, 10, 6))                     # open maw
    for k in range(6): objs.append(cone_between(H + Vector((0.22, -0.1 + k * 0.04, -0.03)), H + Vector((0.23, -0.1 + k * 0.04, -0.09)), 0.015, Bn, 0.0, 5))
    objs += [ell(H + Vector((0.2, s * 0.09, 0.05)), (0.04, 0.04, 0.03), Ey, 8, 6) for s in (1, -1)]
    objs.append(ell(H + Vector((0.18, 0, 0.1)), (0.08, 0.17, 0.04), Fl, 10, 6))                        # heavy brow
    # rusty armour dominates the silhouette (sprite): cuirass, layered pauldrons, faulds, cuisses, greaves, gauntlets
    objs.append(ell((0.1, 0, 1.62), (0.46, 0.55, 0.5), Ar, 22, 14))
    objs.append(ell((0.12, 0, 1.25), (0.4, 0.5, 0.28), Ar, 20, 12))
    for s in (1, -1):
        for j in range(3): objs.append(ell((0.04, s * (0.58 + j * 0.04), 1.98 - j * 0.14), (0.34 - j * 0.03, 0.3, 0.2), Ar, 16, 10))
        objs.append(rod((0.05, s * 0.68, 1.62), (0.1, s * 0.7, 1.28), 0.19, Ar, 12))                       # rerebrace
        objs.append(rod((0.12, s * 0.71, 1.22), (0.32, s * 0.73, 0.9), 0.2, Ar, 12))                       # gauntlet
        objs.append(torus((0.2, s * 0.72, 1.06), 0.2, 0.04, Ir, rot=(0, 0.5, 0)))
        objs.append(rod((0.05, s * 0.24, 1.02), (0.15, s * 0.3, 0.62), 0.25, Ar, 12))                     # cuisse
        objs.append(ell((0.2, s * 0.3, 0.58), (0.18, 0.18, 0.16), Ar, 12, 8))                              # knee
        objs.append(rod((0.15, s * 0.31, 0.55), (0.02, s * 0.32, 0.1), 0.22, Ar, 12))                     # greave
        objs.append(box((0.12, s * 0.32, 0.05), (0.42, 0.24, 0.12), Ar, bev=0.04))                         # sabaton
        objs.append(box((0.2, s * 0.2, 0.95), (0.06, 0.2, 0.32), Ar, rot=(s * 0.15, 0.1, 0), bev=0.02))  # tasset
        for k in range(3): objs.append(cone_between((0.04, s * (0.52 + k * 0.1), 2.12 - k * 0.06), (0.0, s * (0.56 + k * 0.12), 2.4 - k * 0.06), 0.045, Ir, 0.0, 6))
    objs.append(torus((0.06, 0, 1.12), 0.42, 0.07, Ar, scale=(1, 1.15, 1)))
    objs.append(box((0.42, 0, 0.82), (0.04, 0.36, 0.55), Cl, bev=0.02))                                 # tattered red tabard
    objs.append(ell((0.5, 0.05, 1.55), (0.06, 0.2, 0.3), Bl, 10, 8))                                     # torn gore window in cuirass
    objs.append(ell((0.48, 0.05, 1.55), (0.05, 0.16, 0.24), Fl, 10, 8))
    # spiked mace in right hand
    hand = Vector((0.45, -0.72, 0.75))
    objs.append(rod(hand + Vector((0, 0, 0.15)), hand + Vector((0.15, 0, -0.55)), 0.04, Ir))
    mh = hand + Vector((0.18, 0, -0.7)); objs.append(ell(mh, (0.24, 0.24, 0.26), Ar, 14, 10))
    for k in range(10):
        a = k / 10 * math.tau; d = Vector((math.cos(a), math.sin(a), (k % 3 - 1) * 0.6)).normalized()
        objs.append(cone_between(mh + d * 0.15, mh + d * 0.3, 0.04, Ir, 0.0, 5))
    ob = finalize('boss_dreadnought', objs, decimate_over=20000); normalize(ob, 3.2, axis='z'); return ob

BUILD = {
    **{f'bloon_{c}': (lambda c=c: build_bloon(c)) for c in BLOON_RGB},
    'bloon_lead': build_lead, 'bloon_ceramic': build_ceramic, 'bloon_moab': build_moab,
    'bug_scavenger': build_scavenger, 'bug_hunter': build_hunter, 'bug_charger': build_charger, 'bug_brood': build_brood,
    'bug_ironback': build_ironback, 'bug_warden': build_warden, 'bug_gargoyle': build_gargoyle, 'bug_titan': build_titan,
    'boss_scarab': build_scarab, 'boss_leviathan': build_leviathan, 'boss_dreadnought': build_dreadnought, 'boss_zeppelin': build_zeppelin,
}
if __name__ == '__main__':
    which = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'all'
    names = list(BUILD) if which == 'all' else which.split(',')
    for n in names:
        try:
            ob = BUILD[n](); export(n, ob)
        except Exception as e:
            import traceback; traceback.print_exc(); print('FAILED', n, e, flush=True)
