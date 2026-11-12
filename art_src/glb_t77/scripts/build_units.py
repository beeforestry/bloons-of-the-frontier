"""t77: first-person Vanguard deployable troops, modelled against our painted v3 sprites only
(public/assets/v3/marine_*, odst_*, spartan_*, warthog_*, scorpion_*). One GLB per (unit, tier).
blender -b -P art_src/glb_t77/scripts/build_units.py -- <name|all>     e.g. unit_marine_0,unit_warthog_2,gun_aegis_beam
Conventions: +X = forward (facing / travel), +Y = unit's left, Z up (glTF Y up). Feet / wheels / tracks on z=0.
Sizes in metres: troopers ~1.8 m, Aegis ~1.95 m, Raider ~4.6 m long, Scorpion ~8.2 m long (matches t42 tank scale).
All geometry is hand-placed here (no AI meshes, no third-party models); textures are procedural (lib.py) with palettes
sampled from the sprites. Design follows OUR paintings, not any commercial game's vehicles/armour."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *

V = Vector

def cap(a, b, rx, ry, m, seg=12, rings=8, over=1.0):
    """ellipsoid stretched between two points (limb armour plate)."""
    a, b = V(a), V(b); d = b - a
    ob = ell((a + b) / 2, (rx, ry, d.length / 2 * over), m, seg, rings); return aim(ob, d)

def slab(a, b, w, t, m, fwd=(1, 0, 0), off=0.0, over=0.8, bev=0.015):
    """flat armour plate laid along a limb a->b, pushed `off` towards fwd (thigh/shin/forearm plates)."""
    a, b = V(a), V(b); d = b - a; f = V(fwd).normalized()
    ob = box(tuple((a + b) / 2 + f * off), (t, w, d.length * over), m, bev=bev)
    side = d.cross(f).normalized(); up_ = side.cross(d).normalized()
    ob.rotation_mode = 'QUATERNION'
    ob.rotation_quaternion = Matrix((up_, side, d.normalized())).transposed().to_quaternion(); return ob

def bx(c, s, m, rot=(0, 0, 0), bev=0.0):
    return box(tuple(c), tuple(s), m, rot, bev)

def wedge(name, pts_bottom, pts_top, m):
    """convex prism from two 4-point rings (bottom/top) -> chamfered hull / turret blocks."""
    bm = bmesh.new(); vb = [bm.verts.new(p) for p in pts_bottom]; vt = [bm.verts.new(p) for p in pts_top]
    n = len(vb)
    bm.faces.new(vb[::-1]); bm.faces.new(vt)
    for i in range(n): bm.faces.new((vb[i], vb[(i + 1) % n], vt[(i + 1) % n], vt[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    return put(ob, m, False)

def ring_xy(cx, cz, hx, hy, ch=0.0):
    """octagon-ish ring (chamfered rectangle) in XY at height cz, centred x=cx."""
    if ch <= 0: return [(cx - hx, -hy, cz), (cx + hx, -hy, cz), (cx + hx, hy, cz), (cx - hx, hy, cz)]
    return [(cx - hx + ch, -hy, cz), (cx + hx - ch, -hy, cz), (cx + hx, -hy + ch, cz), (cx + hx, hy - ch, cz),
            (cx + hx - ch, hy, cz), (cx - hx + ch, hy, cz), (cx - hx, hy - ch, cz), (cx - hx, -hy + ch, cz)]

def ground(ob, size=None, axis='z'):
    bb = [ob.matrix_world @ V(c) for c in ob.bound_box]
    mn = V([min(p[i] for p in bb) for i in range(3)]); mx = V([max(p[i] for p in bb) for i in range(3)])
    if size:
        d = mx - mn; cur = d.z if axis == 'z' else max(d.x, d.y); s = size / cur
        ob.scale = (s, s, s); bpy.ops.object.transform_apply(scale=True)
        bb = [ob.matrix_world @ V(c) for c in ob.bound_box]
        mn = V([min(p[i] for p in bb) for i in range(3)]); mx = V([max(p[i] for p in bb) for i in range(3)])
    ob.location = (0, 0, -mn.z); bpy.ops.object.transform_apply(location=True)

# =================================================================== WEAPONS (built along +X from butt B)
def weapon(kind, B, G, G2, M=None, scope=False, glow=None):
    B = V(B); o = []
    P = lambda x, y=0.0, z=0.0: B + V((x, y, z))
    if kind in ('rifle', 'br'):
        L = 0.92 if kind == 'br' else 0.86
        o += [bx(P(0.09, 0, -0.01), (0.18, 0.04, 0.085), G, bev=0.01), bx(P(0.02, 0, -0.03), (0.04, 0.045, 0.12), G2),   # stock + butt pad
              bx(P(0.32, 0, 0.015), (0.3, 0.055, 0.085), G, bev=0.008),                                                # receiver
              bx(P(0.3, 0, 0.068), (0.28, 0.022, 0.016), G2),                                                         # top rail
              bx(P(0.33, 0, -0.085), (0.055, 0.032, 0.13), G2, rot=(0, -0.22, 0)),                                     # magazine
              bx(P(0.21, 0, -0.065), (0.035, 0.03, 0.09), G, rot=(0, 0.3, 0)),                                         # pistol grip
              bx(P(0.56, 0, 0.012), (0.2, 0.05, 0.06), G, bev=0.006),                                                 # handguard
              rod(P(0.6, 0, 0.022), P(L, 0, 0.022), 0.011, G2, 8), cyl(tuple(P(L - 0.02, 0, 0.022)), 0.018, 0.05, G2, 8, rot=(0, math.pi / 2, 0)),
              bx(P(0.62, 0, 0.065), (0.02, 0.012, 0.04), G2)]                                                         # front sight
        if kind == 'br': o.append(bx(P(0.5, 0, -0.045), (0.06, 0.03, 0.05), G2))                                        # BR fore-grip
    elif kind == 'smg':   # compact SMG with a long suppressor (Silenced SMG)
        o += [bx(P(0.08, 0, -0.005), (0.14, 0.03, 0.05), G2), bx(P(0.25, 0, 0.01), (0.22, 0.05, 0.08), G, bev=0.008),
              bx(P(0.24, 0, -0.1), (0.04, 0.03, 0.15), G2), bx(P(0.17, 0, -0.06), (0.035, 0.03, 0.08), G, rot=(0, 0.3, 0)),
              rod(P(0.36, 0, 0.02), P(0.66, 0, 0.02), 0.022, G, 10), bx(P(0.25, 0, 0.062), (0.18, 0.02, 0.014), G2)]
    elif kind == 'beam':  # Aegis Beam cannon (spartan_2): fat olive barrel, bands, red glowing muzzle
        o += [bx(P(0.1, 0, 0.0), (0.24, 0.1, 0.16), G, bev=0.02), cyl(tuple(P(0.55, 0, 0.02)), 0.075, 0.62, G, 16, rot=(0, math.pi / 2, 0)),
              cyl(tuple(P(0.9, 0, 0.02)), 0.085, 0.12, G2, 16, rot=(0, math.pi / 2, 0)),
              bx(P(0.42, 0, 0.11), (0.3, 0.07, 0.06), G2, bev=0.01), bx(P(0.28, 0, -0.1), (0.04, 0.035, 0.1), G2, rot=(0, 0.3, 0)),
              bx(P(0.6, 0, -0.08), (0.05, 0.035, 0.09), G2)]
        for x in (0.35, 0.5, 0.65, 0.78): o.append(torus(tuple(P(x, 0, 0.02)), 0.078, 0.01, G2, rot=(0, math.pi / 2, 0), seg=16))
        o.append(cyl(tuple(P(0.965, 0, 0.02)), 0.06, 0.015, glow, 16, rot=(0, math.pi / 2, 0)))
    if scope:
        o += [cyl(tuple(P(0.33, 0, 0.11)), 0.022, 0.17, G2, 10, rot=(0, math.pi / 2, 0)), cyl(tuple(P(0.42, 0, 0.11)), 0.028, 0.03, G2, 10, rot=(0, math.pi / 2, 0)),
              bx(P(0.33, 0, 0.085), (0.04, 0.02, 0.03), G2)]
    return o

# =================================================================== TROOPERS
# Per (unit, tier) look sampled from the sprites. armor/under/gun rgb, visor rgb (+emit), extras.
TROOP = {
    'marine_0': dict(helm='marine', armor=(112, 108, 72), grime=(60, 56, 36), under=(46, 44, 32), visor=(205, 130, 30), vglow=0.45, gun='rifle', bulk=1.0, vest=True),
    'marine_1': dict(helm='marine', armor=(118, 114, 78), grime=(62, 58, 38), under=(48, 46, 34), visor=(70, 110, 185), vglow=0.8, gun='rifle', scope=True, bulk=1.04, vest=True, band=(40, 95, 190)),
    'marine_2': dict(helm='marine', armor=(80, 80, 76), grime=(40, 38, 32), under=(34, 33, 28), visor=(240, 40, 25), vglow=1.2, gun='rifle', scope=True, bulk=1.16, vest=True, metal=0.45, canisters=True, heavy=True),
    'odst_0': dict(helm='odst', armor=(60, 61, 58), grime=(30, 30, 28), under=(28, 28, 26), visor=(22, 26, 30), vglow=0.0, gun='smg', bulk=1.06, metal=0.3),
    'odst_1': dict(helm='odst', armor=(62, 64, 64), grime=(30, 31, 32), under=(28, 28, 28), visor=(40, 110, 235), vglow=0.9, gun='br', scope=True, bulk=1.08, metal=0.3, pack=1, trim=(40, 95, 210), trim_glow=0.6),
    'odst_2': dict(helm='odst', armor=(66, 62, 52), grime=(32, 29, 22), under=(30, 28, 24), visor=(245, 80, 20), vglow=1.2, gun='br', scope=True, bulk=1.14, metal=0.35, pack=2, trim=(196, 150, 70), canisters=True),
    'spartan_0': dict(helm='aegis', armor=(100, 106, 74), grime=(52, 54, 36), under=(34, 34, 30), visor=(220, 150, 40), vglow=0.7, gun='rifle', scope=True, bulk=1.2, metal=0.4, tall=1.08),
    'spartan_1': dict(helm='aegis', armor=(108, 112, 84), grime=(54, 56, 40), under=(34, 34, 30), visor=(220, 150, 40), vglow=0.7, gun='rifle', scope=True, bulk=1.22, metal=0.4, tall=1.08, emblem=(70, 150, 240), shard=True),
    'spartan_2': dict(helm='aegis', armor=(98, 100, 66), grime=(50, 48, 30), under=(32, 30, 26), visor=(40, 200, 250), vglow=0.7, gun='beam', bulk=1.32, metal=0.45, tall=1.1, trim=(160, 105, 50)),
}

def trooper(key):
    reset(); c = TROOP[key]; k = c.get('bulk', 1.0)
    A = mat('Armor', 'armor', tuple(min(255, int(x * 1.25)) for x in c['armor']), c['grime'], metal=c.get('metal', 0.15) * 0.4, rough=0.55)
    U = mat('Undersuit', 'cloth', tuple(int(x * 1.2) for x in c['under']), rough=0.9)
    G = mat('Gun', 'metal', (40, 42, 44), metal=0.5, rough=0.45)
    G2 = mat('GunDark', 'metal', (26, 27, 28), metal=0.6, rough=0.4)
    Vz = mat('Visor', None, c['visor'], metal=0.6, rough=0.12, emit=tuple(x / 255 for x in c['visor']) if c['vglow'] else None, emit_str=c['vglow'])
    Bt = mat('Boots', 'cloth', (30, 29, 24), rough=0.85)
    o = []
    # albedo = the sprites' lit tone x1.25 (the in-game sun is warm and low, the painted shading is baked into the sprite)
    # ---- skeleton (ready stance: left leg forward, rifle shouldered on the right)
    # crouched, wide combat stance like the sprites (front knee bent, rear leg braced back, torso leaning in)
    hipL, kneeL, ankL = V((0.02, 0.12, 0.84)), V((0.27, 0.2, 0.5)), V((0.21, 0.25, 0.1))
    hipR, kneeR, ankR = V((-0.03, -0.12, 0.84)), V((-0.12, -0.21, 0.46)), V((-0.36, -0.25, 0.1))
    pel, waist, chest, neck, head = V((0, 0, 0.87)), V((0.05, 0, 0.99)), V((0.11, 0, 1.2)), V((0.15, -0.01, 1.38)), V((0.19, -0.03, 1.5))
    shL, shR = V((0.13, 0.21, 1.31)), V((0.07, -0.21, 1.31))
    butt = V((0.12, -0.15, 1.27))
    hR = butt + V((0.21, 0.0, -0.06)); hL = butt + V((0.5, 0.02, -0.02)) if c['gun'] != 'smg' else butt + V((0.36, 0.02, -0.0))
    if c['gun'] == 'beam': hL = butt + V((0.6, 0.06, -0.07))
    elR, elL = V((0.14, -0.33, 1.08)), V((0.36, 0.17, 1.08))
    # ---- undersuit (one skin-modifier mesh)
    o.append(skin_chains('suit', [[(ankL, 0.05), (kneeL, 0.07), (hipL, 0.09)], [(ankR, 0.05), (kneeR, 0.07), (hipR, 0.09)],
                                  [(pel, 0.13), (waist, 0.13), (chest, 0.15), (neck, 0.065), (head, 0.06)],
                                  [(shL, 0.06), (elL, 0.05), (hL, 0.04)], [(shR, 0.06), (elR, 0.05), (hR, 0.04)]], U, lv=1))
    # ---- torso armour
    o.append(ell(chest + V((0.02, 0, 0.0)), (0.17 * k, 0.23 * k, 0.18 * k), A, 18, 12))
    o.append(bx(chest + V((0.14 * k, 0, 0.0)), (0.09, 0.34 * k, 0.24 * k), A, rot=(0, -0.12, 0), bev=0.035))
    o.append(ell(waist + V((0.02, 0, -0.02)), (0.12 * k, 0.16 * k, 0.08), U, 14, 8))
    for z in (0.97, 1.02): o.append(bx(V((0.13 * k, 0, z)), (0.03, 0.2 * k, 0.04), A, bev=0.01))   # ab plates
    o.append(torus((0.01, 0, 0.885), 0.165 * k, 0.025, Bt, scale=(0.9, 1.05, 1), seg=20))             # belt
    o.append(ell(pel + V((0.0, 0, -0.03)), (0.13 * k, 0.17 * k, 0.09), A, 14, 8))
    for s in (1, -1): o.append(bx(V((0.04, s * 0.15 * k, 0.78)), (0.12, 0.03, 0.14), A, rot=(s * 0.25, 0, 0), bev=0.01))  # hip plates
    if c.get('vest'):   # marines: chest webbing with magazine pouches (sprite: pouch row under the chest plate)
        P = mat('Pouch', 'cloth', tuple(int(x * 0.75) for x in c['armor']), rough=0.95)
        for i, y in enumerate((-0.12, -0.04, 0.04, 0.12)):
            o.append(bx(V((0.2 * k, y * k, 1.08)), (0.06, 0.07, 0.09), P, bev=0.008))
        for s in (1, -1): o.append(bx(V((0.03, s * 0.2 * k, 0.89)), (0.09, 0.05, 0.08), P, bev=0.008))
    # back plate / pack
    o.append(bx(chest + V((-0.12 * k, 0, 0.02)), (0.1, 0.32 * k, 0.28 * k), A, bev=0.03))
    if c.get('pack'):
        pk = c['pack']; o.append(bx(chest + V((-0.2 * k - 0.04 * pk, 0, 0.02)), (0.1 + 0.05 * pk, 0.26 * k, 0.26 + 0.06 * pk), A, bev=0.04))
        for s in (1, -1): o.append(cyl(tuple(chest + V((-0.22 * k - 0.04 * pk, s * 0.15 * k, 0.0))), 0.045, 0.26, G2, 10))
    # ---- head / helmet (our three painted helmet shapes)
    H = head
    if c['helm'] == 'marine':      # rounded combat helmet with a brim + open face shield (marine_*)
        o += [ell(H + V((-0.01, 0, 0.035)), (0.155, 0.14, 0.13), A, 18, 12),
              torus(tuple(H + V((-0.01, 0, -0.0))), 0.15, 0.018, A, scale=(1.05, 0.95, 1), seg=20),
              ell(H + V((0.09, 0, -0.02)), (0.06, 0.1, 0.06), U, 12, 8),
              ell(H + V((0.115, 0, 0.005)), (0.045, 0.105, 0.04), Vz, 14, 8)]
        for s in (1, -1): o.append(bx(H + V((0.03, s * 0.12, -0.04)), (0.1, 0.03, 0.08), A, bev=0.01))
    elif c['helm'] == 'odst':      # angular trooper helmet: ridged dome, jaw guard, flat slanted visor plate
        o += [ell(H + V((-0.01, 0, 0.03)), (0.16, 0.145, 0.14), A, 18, 12),
              ell(H + V((-0.01, 0, 0.15)), (0.13, 0.035, 0.03), A, 10, 6),
              bx(H + V((0.1, 0, -0.07)), (0.08, 0.17, 0.07), A, rot=(0, 0.35, 0), bev=0.015),
              ell(H + V((0.135, 0, 0.015)), (0.04, 0.115, 0.05), Vz, 14, 8, rot=(0, -0.2, 0))]
        for s in (1, -1): o.append(cyl(tuple(H + V((0.0, s * 0.14, -0.0))), 0.045, 0.04, A, 10, rot=(math.pi / 2, 0, 0)))
    else:                          # Aegis: tall full helmet, wide wrap visor, crest + ear pods
        o += [ell(H + V((-0.0, 0, 0.03)), (0.165, 0.14, 0.16), A, 20, 12),
              ell(H + V((0.03, 0, 0.17)), (0.12, 0.02, 0.03), A, 10, 6),
              bx(H + V((0.11, 0, -0.08)), (0.09, 0.14, 0.07), A, rot=(0, 0.4, 0), bev=0.02),
              ell(H + V((0.135, 0, 0.01)), (0.05, 0.125, 0.06), Vz, 16, 8)]
        for s in (1, -1): o.append(cyl(tuple(H + V((-0.01, s * 0.145, 0.0))), 0.05, 0.03, A, 12, rot=(math.pi / 2, 0, 0)))
    # ---- shoulders / arms
    for sh, el, hd, s in ((shL, elL, hL, 1), (shR, elR, hR, -1)):
        # pauldron: a flattened shell plus a layered lower plate (sprites: plated, not round)
        o.append(ell(sh + V((0, s * 0.035, 0.035)), (0.115 * k, 0.1 * k, 0.065 * k), A, 16, 10))
        o.append(bx(sh + V((0.0, s * 0.1 * k, -0.04)), (0.17 * k, 0.03, 0.09 * k), A, rot=(s * 0.35, 0, 0), bev=0.012))
        if c.get('heavy') or k > 1.15: o.append(ell(sh + V((0, s * 0.06, 0.075)), (0.1 * k, 0.075 * k, 0.035), A, 12, 8))
        o.append(cap(sh, el, 0.05 * k, 0.05 * k, A, seg=8, over=0.8))
        o.append(slab(sh, el, 0.08 * k, 0.03, A, fwd=(0, s, 0.3), off=0.04 * k, over=0.6))
        o.append(cap(el, hd, 0.05 * k, 0.047 * k, A, seg=8, over=0.75))
        o.append(slab(el, hd, 0.075 * k, 0.03, A, fwd=(0, s, -0.6), off=0.035 * k, over=0.6))   # gauntlet plate
        o.append(ell(el, (0.05 * k, 0.05 * k, 0.05 * k), A, 10, 8))
        o.append(ell(hd, (0.048, 0.04, 0.042), Bt, 10, 8))
    # ---- legs
    for hp, kn, an in ((hipL, kneeL, ankL), (hipR, kneeR, ankR)):
        o.append(cap(hp + V((0.02, 0, 0)), kn, 0.088 * k, 0.085 * k, A, seg=10, over=0.9))
        o.append(slab(hp, kn, 0.13 * k, 0.04, A, off=0.06 * k, over=0.7))                                                       # thigh plate
        o.append(slab(hp, kn, 0.09 * k, 0.025, A, fwd=(0, 1 if hp.y > 0 else -1, 0), off=0.07 * k, over=0.55))                  # outer thigh plate
        o.append(ell(kn + V((0.07, 0, 0.0)), (0.04 * k, 0.065 * k, 0.07 * k), A, 10, 6))
        o.append(cap(kn, an + V((0, 0, 0.05)), 0.068 * k, 0.064 * k, A, seg=10, over=0.9))
        o.append(slab(kn, an + V((0, 0, 0.06)), 0.11 * k, 0.04, A, off=0.055 * k, over=0.8))                                   # shin guard
        o.append(ell(V((an.x + 0.06, an.y, 0.075)), (0.15, 0.072 * k, 0.08), Bt, 14, 8))                                       # boot
        o.append(bx(V((an.x + 0.06, an.y, 0.018)), (0.27, 0.12 * k, 0.036), Bt, bev=0.012))                                     # sole
    if c.get('canisters'):         # grenades / canisters on the right thigh (marine_2, odst_2)
        Br = mat('Brass', None, (150, 118, 60), metal=0.8, rough=0.35)
        for dx in (0.0, 0.07): o.append(cyl((0.0 + dx, -0.21 * k, 0.68), 0.028, 0.1, Br, 10))
    # ---- tier dressing
    if c.get('band'):              # marine_1: blue arm band on the left shoulder
        o.append(aim(torus(tuple(shL.lerp(elL, 0.25)), 0.064 * k, 0.014, mat('Band', None, c['band'], rough=0.5)), elL - shL))
    if c.get('emblem'):            # spartan_1: blue glowing emblem on the left pauldron
        Em = mat('Emblem', None, c['emblem'], emit=tuple(x / 255 for x in c['emblem']), emit_str=1.5)
        o.append(ell(shL + V((0.0, 0.03 + 0.1 * k, 0.03)), (0.04, 0.012, 0.04), Em, 10, 6))
    if c.get('trim'):              # odst_1 blue strips / odst_2 + spartan_2 gold-bronze edge trim
        glow = c.get('trim_glow', 0)
        T = mat('Trim', None, c['trim'], metal=0.7 if not glow else 0.2, rough=0.35, emit=tuple(x / 255 for x in c['trim']) if glow else None, emit_str=glow)
        o.append(bx(chest + V((0.175 * k, 0, 0.11 * k)), (0.02, 0.26 * k, 0.018), T, rot=(0, -0.12, 0)))
        for s in (1, -1):
            o.append(bx(chest + V((0.15 * k, s * 0.13 * k, -0.04)), (0.02, 0.018, 0.16), T, rot=(0, -0.12, 0)))
            o.append(ell(V((0.07, s * 0.0, 0)) + (shL if s > 0 else shR) + V((0, s * 0.04, 0.085 * k)), (0.08 * k, 0.07 * k, 0.012), T, 12, 6))
    # ---- weapon
    gk = c['gun']
    if gk == 'beam':
        GB = mat('BeamBody', 'armor', (84, 86, 58), (44, 44, 30), metal=0.4, rough=0.45)
        Rd = mat('BeamGlow', None, (230, 40, 30), emit=(1.0, 0.12, 0.08), emit_str=1.6)
        o += weapon('beam', butt + V((0.0, -0.02, -0.02)), GB, G2, glow=Rd)
    else:
        o += weapon(gk, butt, G, G2, scope=c.get('scope', False))
    if c.get('shard'):             # spartan_1: translucent blue energy blade rising from the muzzle (sprite)
        Sh = mat('Shard', None, (170, 205, 255), rough=0.1, emit=(0.55, 0.75, 1.0), emit_str=1.2, alpha=0.55)
        o.append(wedge('shard', [(0.94, -0.17, 1.21), (1.06, -0.17, 1.28), (1.06, -0.15, 1.28), (0.94, -0.15, 1.21)],
                       [(0.84, -0.17, 1.6), (0.94, -0.17, 1.5), (0.94, -0.15, 1.5), (0.84, -0.15, 1.6)], Sh))
    ob = finalize('unit_' + key, o)
    ground(ob, 1.8 * c.get('tall', 1.0))
    return ob

# =================================================================== VEHICLES
def wheel(c, r, w, T, Rm, Hub):
    c = V(c); o = [cyl(tuple(c), r, w, T, 20, rot=(math.pi / 2, 0, 0))]
    o.append(cyl(tuple(c), r * 0.86, w + 0.004, mat('TyreSide', None, (30, 29, 26), rough=0.9), 20, rot=(math.pi / 2, 0, 0)))
    s = 1 if c.y > 0 else -1
    o.append(cyl(tuple(c + V((0, s * (w / 2 + 0.005), 0))), r * 0.58, 0.03, Rm, 16, rot=(math.pi / 2, 0, 0)))
    o.append(cyl(tuple(c + V((0, s * (w / 2 + 0.025), 0))), r * 0.2, 0.04, Hub, 10, rot=(math.pi / 2, 0, 0)))
    for i in range(6):
        a = i / 6 * math.tau
        o.append(ell(c + V((math.cos(a) * r * 0.36, s * (w / 2 + 0.02), math.sin(a) * r * 0.36)), (0.025, 0.012, 0.025), Hub, 6, 4))
    return o

RAIDER = {
    0: dict(body=(88, 84, 56), grime=(48, 44, 30), metal=0.15, gun='mg'),
    1: dict(body=(74, 74, 66), grime=(38, 38, 32), metal=0.3, gun='rotary', half=True),
    2: dict(body=(62, 58, 46), grime=(32, 29, 22), metal=0.35, gun='rotary_cyan', closed=True, gold=(150, 108, 42)),
}

def raider(t):
    """warthog_0: open-top 4x4 jeep, roll cage, 7-slot grille, round headlights, pintle MG.
    warthog_1: armoured grey-olive, half-panelled cage, roof rotary.  warthog_2: closed armoured truck, gold trim, cyan rotary."""
    reset(); c = RAIDER[t]
    Bd = mat('Body', 'panels', tuple(int(x * 1.3) for x in c['body']), c['grime'], metal=c['metal'] * 0.4, rough=0.6)
    Dk = mat('Dark', 'metal', (34, 34, 30), metal=0.5, rough=0.5)
    Ty = mat('Tyre', 'tire', (36, 35, 32), rough=0.95)
    Rm = mat('Rim', 'metal', (70, 66, 50) if t == 0 else (60, 60, 56), metal=0.5, rough=0.45)
    Gl = mat('Glass', None, (60, 70, 72), metal=0.3, rough=0.08, alpha=0.6)
    Lt = mat('Lamp', None, (255, 230, 170), emit=(1.0, 0.85, 0.55), emit_str=3.0)
    Seat = mat('Seat', 'cloth', (44, 42, 34), rough=0.95)
    o = []
    WB, TR, R, W = 1.42, 0.86, 0.47, 0.36            # half wheelbase, half track, tyre radius/width
    for x in (WB, -WB):
        for s in (1, -1): o += wheel((x, s * TR, R), R, W, Ty, Rm, Dk)
    # chassis / frame
    o.append(bx((0, 0, 0.55), (3.6, 1.2, 0.2), Dk))
    # hood + engine block + grille
    o.append(wedge('hood', ring_xy(1.48, 0.72, 0.68, 0.74, 0.06), ring_xy(1.43, 1.22, 0.66, 0.7, 0.06), Bd))
    o.append(bx((2.17, 0, 0.98), (0.1, 1.2, 0.5), Bd, bev=0.03))                                # grille panel
    for i in range(7): o.append(bx((2.225, -0.33 + i * 0.11, 0.99), (0.04, 0.045, 0.34), Dk))    # 7 slots
    for s in (1, -1):
        o.append(cyl((2.2, s * 0.52, 1.02), 0.1, 0.06, Dk, 16, rot=(0, math.pi / 2, 0)))         # round headlights
        o.append(cyl((2.235, s * 0.52, 1.02), 0.075, 0.02, Lt, 16, rot=(0, math.pi / 2, 0)))
        # flared fenders over each wheel
        for x in (WB, -WB):
            o.append(wedge('fender', [(x - 0.62, s * 0.62, 1.0), (x + 0.62, s * 0.62, 1.0), (x + 0.62, s * 1.1, 0.95), (x - 0.62, s * 1.1, 0.95)][::s],
                           [(x - 0.5, s * 0.62, 1.1), (x + 0.5, s * 0.62, 1.1), (x + 0.5, s * 1.08, 1.04), (x - 0.5, s * 1.08, 1.04)][::s], Bd))
            o.append(bx((x + 0.62 * (1 if x > 0 else -1) * 0.98, s * 0.85, 0.86), (0.08, 0.46, 0.24), Bd))
        o.append(bx((0.0, s * 0.8, 0.6), (1.3, 0.16, 0.06), Dk))                               # side step
    o.append(bx((2.3, 0, 0.6), (0.18, 1.6, 0.18), Dk, bev=0.02))                                  # front bumper
    if t >= 1:                                                                                    # bull bar
        o += [rod((2.38, -0.6, 0.6), (2.38, -0.5, 1.0), 0.035, Dk), rod((2.38, 0.6, 0.6), (2.38, 0.5, 1.0), 0.035, Dk), rod((2.38, -0.5, 1.0), (2.38, 0.5, 1.0), 0.035, Dk)]
    o.append(bx((-2.0, 0, 0.62), (0.14, 1.5, 0.18), Dk))                                          # rear bumper
    # tub / cabin body
    if not c.get('closed'):
        o.append(wedge('tub', ring_xy(-0.55, 0.62, 1.6, 0.8, 0.05), ring_xy(-0.58, 1.22, 1.55, 0.8, 0.05), Bd))
        o.append(bx((-0.55, 0, 1.0), (2.9, 1.42, 0.5), Seat))                                     # tub floor (dark inside)
        for y in (0.33, -0.33):
            o += [bx((0.25, y, 1.25), (0.5, 0.44, 0.15), Seat, bev=0.03), bx((-0.02, y, 1.6), (0.14, 0.44, 0.65), Seat, rot=(0, -0.15, 0), bev=0.04)]
        o.append(ell((0.75, 0.33, 1.6), (0.06, 0.18, 0.18), Dk, 12, 6))                           # steering wheel
        # windscreen frame + glass
        o += [bx((0.82, 0, 1.25), (0.06, 1.5, 0.05), Bd), bx((0.74, 0, 1.6), (0.04, 1.4, 0.62), Gl, rot=(0, -0.25, 0)),
              bx((0.66, 0, 1.92), (0.08, 1.5, 0.06), Bd, rot=(0, -0.25, 0))]
        for s in (1, -1): o.append(bx((0.74, s * 0.72, 1.58), (0.06, 0.06, 0.7), Bd, rot=(0, -0.25, 0)))
        # roll cage (tubes)
        hR = 2.15
        for s in (1, -1):
            o += [rod((0.66, s * 0.72, 1.92), (-0.25, s * 0.72, hR), 0.04, Dk), rod((-0.25, s * 0.72, hR), (-1.6, s * 0.72, hR - 0.1), 0.04, Dk),
                  rod((-0.25, s * 0.72, hR), (-0.25, s * 0.78, 1.22), 0.04, Dk), rod((-1.6, s * 0.72, hR - 0.1), (-1.9, s * 0.78, 1.22), 0.04, Dk)]
        o += [rod((-0.25, -0.72, hR), (-0.25, 0.72, hR), 0.04, Dk), rod((-1.6, -0.72, hR - 0.1), (-1.6, 0.72, hR - 0.1), 0.04, Dk)]
        if c.get('half'):                                                                          # warthog_1: armour half-doors + roof plate + side panels
            for s in (1, -1):
                o.append(bx((0.15, s * 0.82, 1.42), (0.9, 0.05, 0.42), Bd, bev=0.02))
                o.append(bx((-1.1, s * 0.82, 1.5), (1.2, 0.05, 0.5), Bd, bev=0.02))
                for xx in (-0.7, -1.0, -1.3): o.append(bx((xx, s * 0.85, 1.55), (0.12, 0.02, 0.08), Dk))
            o += [rod((-1.1, -0.72, hR), (-1.1, 0.72, hR), 0.045, Dk), bx((-1.1, 0, hR - 0.03), (0.5, 0.5, 0.06), Dk)]   # gun ring cross-bar
        mount = V((-1.1, 0, hR + 0.02)) if c.get('half') else V((-1.0, 0, 1.0))
        if c.get('half'): o.append(cyl((-1.1, 0, (1.0 + hR) / 2), 0.09, hR - 1.0, Dk, 10))   # pedestal from the tub floor
    else:   # warthog_2: closed armoured truck (SUV) body with windows, gold edge trim
        Au = mat('Gold', 'metal', c['gold'], metal=0.75, rough=0.35)
        o.append(wedge('cab', ring_xy(-0.55, 0.62, 1.6, 0.82, 0.06), ring_xy(-0.6, 1.3, 1.55, 0.84, 0.06), Bd))
        o.append(wedge('cab_up', ring_xy(-0.62, 1.3, 1.5, 0.84, 0.06), ring_xy(-0.8, 2.1, 1.28, 0.74, 0.06), Bd))
        # windows (dark glass) inset on the sides + slanted windscreen
        o.append(bx((0.66, 0, 1.7), (0.05, 1.3, 0.56), Gl, rot=(0, -0.33, 0)))
        for s in (1, -1):
            for xx in (0.05, -0.75): o.append(bx((xx, s * 0.81, 1.72), (0.62, 0.04, 0.42), Gl))
            o.append(bx((-1.6, s * 0.79, 1.72), (0.4, 0.04, 0.36), Gl))
            # gold trim strips (sprite: bright edges round doors, sills, fenders)
            o += [bx((-0.5, s * 0.86, 1.31), (3.1, 0.04, 0.05), Au), bx((-0.6, s * 0.78, 2.08), (2.5, 0.04, 0.04), Au),
                  bx((-0.35, s * 0.865, 1.0), (0.04, 0.03, 0.55), Au), bx((0.42, s * 0.865, 1.0), (0.04, 0.03, 0.55), Au),
                  bx((-1.1, s * 0.865, 1.0), (0.04, 0.03, 0.55), Au)]
            for x in (WB, -WB): o.append(bx((x, s * 1.02, 1.08), (1.0, 0.1, 0.03), Au))
            o.append(bx((0.5, s * 0.92, 1.72), (0.08, 0.12, 0.08), Dk))                          # mirror
        o += [bx((1.48, 0, 1.226), (0.9, 0.9, 0.012), Au), bx((1.48, 0, 1.232), (0.84, 0.84, 0.012), Bd),     # gold-edged hood plate
              bx((2.24, 0, 1.24), (0.04, 1.2, 0.04), Au)]
        mount = V((-0.8, 0, 2.1))
        o += [cyl((-0.8, 0, 2.12), 0.5, 0.06, Dk, 16)]
    # ---- weapon on the mount
    if c['gun'] == 'mg':        # warthog_0: tall pintle post + long-barrel MG with box receiver
        mz = 1.15
        o += [cyl(tuple(mount + V((0, 0, mz / 2))), 0.07, mz, Dk, 10), cyl(tuple(mount + V((0, 0, mz))), 0.1, 0.1, Dk, 10),
              bx(mount + V((0.05, 0, mz + 0.12)), (0.75, 0.24, 0.3), Dk, bev=0.03),
              bx(mount + V((-0.05, 0.24, mz + 0.08)), (0.3, 0.2, 0.24), Bd, bev=0.02),                 # ammo can
              rod(mount + V((0.4, 0, mz + 0.16)), mount + V((2.0, 0, mz + 0.28)), 0.04, Dk, 8),
              cyl(tuple(mount + V((0.85, 0, mz + 0.2))), 0.07, 0.8, Dk, 10, rot=(0, math.pi / 2 - 0.075, 0)),   # barrel jacket
              cyl(tuple(mount + V((1.98, 0, mz + 0.28))), 0.06, 0.12, Dk, 8, rot=(0, math.pi / 2 - 0.075, 0)),
              bx(mount + V((0.3, 0, mz + 0.3)), (0.08, 0.04, 0.12), Dk),
              rod(mount + V((-0.32, -0.1, mz + 0.1)), mount + V((-0.6, -0.1, mz + 0.02)), 0.025, Dk, 6), rod(mount + V((-0.32, 0.1, mz + 0.1)), mount + V((-0.6, 0.1, mz + 0.02)), 0.025, Dk, 6)]
    else:                       # rotary cannon in an octagonal turret housing (scaled 1.4x about the mount)
        n0 = len(o)
        glow = c['gun'] == 'rotary_cyan'
        Ba = mat('Barrel', 'metal', (50, 52, 54), metal=0.7, rough=0.35) if not glow else mat('Cyan', None, (40, 200, 255), emit=(0.1, 0.75, 1.0), emit_str=1.5)
        o += [cyl(tuple(mount + V((0, 0, 0.1))), 0.36, 0.2, Dk, 12), cyl(tuple(mount + V((0, 0, 0.32))), 0.12, 0.3, Dk, 10),
              cyl(tuple(mount + V((-0.05, 0, 0.62))), 0.3, 0.42, Bd, 8, rot=(math.pi / 2, 0, 0)),
              cyl(tuple(mount + V((-0.05, 0, 0.62))), 0.18, 0.46, Dk, 8, rot=(math.pi / 2, 0, 0)),
              bx(mount + V((-0.05, 0.3, 0.62)), (0.3, 0.12, 0.26), Bd, bev=0.02),
              cyl(tuple(mount + V((0.32, 0, 0.62))), 0.15, 0.25, Dk, 12, rot=(0, math.pi / 2, 0))]
        for i in range(6):
            a = i / 6 * math.tau
            o.append(rod(mount + V((0.4, math.cos(a) * 0.08, 0.62 + math.sin(a) * 0.08)), mount + V((1.15, math.cos(a) * 0.08, 0.62 + math.sin(a) * 0.08)), 0.028, Ba, 6))
        for x in (0.7, 1.12): o.append(cyl(tuple(mount + V((x, 0, 0.62))), 0.13, 0.05, Dk if not glow else Ba, 12, rot=(0, math.pi / 2, 0)))
        for ob_ in o[n0:]:
            ob_.location = mount + (ob_.location - mount) * 1.4; ob_.scale = ob_.scale * 1.4
    ob = finalize('unit_warthog_%d' % t, o)
    ground(ob, 4.6, axis='xy')
    return ob

SCORP = {
    0: dict(body=(94, 90, 64), grime=(50, 46, 32), metal=0.15, gun=(92, 92, 86)),
    1: dict(body=(90, 86, 60), grime=(48, 44, 30), metal=0.2, gun=(84, 84, 78), extra=True),
    2: dict(body=(66, 58, 44), grime=(36, 29, 20), metal=0.3, gun=(64, 62, 58), gold=(160, 100, 40), glow=True, extra=True),
}

def scorpion(t):
    """scorpion_*: our painted MBT — long low hull with sloped glacis, deep side skirts over 7 road wheels,
    wide flat turret with side stowage canisters + roof sight block, long gun with a fume-extractor bulge.
    tier 1: extra plates, roof MG.  tier 2: darker weathered hull, gold/orange trim, angular turret, glowing blue barrel."""
    reset(); c = SCORP[t]
    Bd = mat('Hull', 'panels', tuple(int(x * 1.3) for x in c['body']), c['grime'], metal=c['metal'] * 0.4, rough=0.65)
    Dk = mat('Dark', 'metal', (40, 38, 32), metal=0.5, rough=0.55)
    Tr = mat('Track', 'tread', (52, 50, 44), metal=0.4, rough=0.8)
    Wh = mat('Wheel', 'metal', (70, 68, 56), metal=0.4, rough=0.6)
    Gn = mat('Gun', 'metal', c['gun'], metal=0.5, rough=0.45)
    o = []
    L, Wd = 7.0, 1.75                                         # hull half-width incl. skirts ~1.75
    # tracks (rounded loop approximated by a beveled box + end drums) and road wheels
    for s in (1, -1):
        y = s * 1.45
        o.append(bx((0, y, 0.55), (6.6, 0.62, 1.0), Tr, bev=0.42))
        o.append(cyl((3.15, y, 0.85), 0.36, 0.64, Dk, 14, rot=(math.pi / 2, 0, 0)))   # drive sprocket
        o.append(cyl((-3.2, y, 0.78), 0.34, 0.64, Dk, 14, rot=(math.pi / 2, 0, 0)))   # idler
        for i in range(7):
            x = -2.55 + i * 0.85
            o.append(cyl((x, y + s * 0.02, 0.45), 0.36, 0.66, Wh, 16, rot=(math.pi / 2, 0, 0)))
            o.append(cyl((x, y + s * 0.34, 0.45), 0.12, 0.04, Dk, 10, rot=(math.pi / 2, 0, 0)))
    # hull: lower hull + upper deck with sloped glacis and rear
    o.append(wedge('hull_lo', ring_xy(0.0, 0.5, 3.0, 1.1), ring_xy(0.1, 1.15, 3.4, 1.15), Bd))
    o.append(wedge('hull_up', [(-3.55, -1.85, 1.15), (3.0, -1.85, 1.15), (3.0, 1.85, 1.15), (-3.55, 1.85, 1.15)],
                   [(-3.4, -1.75, 1.62), (2.1, -1.75, 1.62), (2.1, 1.75, 1.62), (-3.4, 1.75, 1.62)], Bd))
    o.append(wedge('glacis', [(3.0, -1.6, 0.8), (3.75, -1.6, 0.95), (3.75, 1.6, 0.95), (3.0, 1.6, 0.8)],
                   [(2.95, -1.6, 1.15), (3.6, -1.6, 1.15), (3.6, 1.6, 1.15), (2.95, 1.6, 1.15)], Bd))
    # side skirts (sprite: deep panelled skirts hiding the top half of the wheels)
    for s in (1, -1):
        y = s * 1.83
        for i in range(5):
            x = -2.75 + i * 1.32
            o.append(bx((x, y, 1.0), (1.28, 0.08, 0.62), Bd, rot=(s * 0.06, 0, 0), bev=0.02))
        o.append(wedge('skirt_nose', [(3.0, y - 0.04, 0.72), (3.65, y - 0.04, 0.95), (3.65, y + 0.04, 0.95), (3.0, y + 0.04, 0.72)],
                       [(3.0, y - 0.04, 1.32), (3.55, y - 0.04, 1.18), (3.55, y + 0.04, 1.18), (3.0, y + 0.04, 1.32)], Bd))
        o.append(bx((-0.65, s * 1.7, 1.64), (5.5, 0.1, 0.05), Dk))                          # fender lip
        for x in (-2.2, -0.9, 0.4, 1.6): o.append(bx((x, s * 1.6, 1.68), (0.5, 0.25, 0.12), Dk, bev=0.02))   # stowage bins
    o += [bx((3.2, -1.1, 1.25), (0.2, 0.3, 0.14), Dk), bx((3.2, 1.1, 1.25), (0.2, 0.3, 0.14), Dk)]   # front lights
    for s in (1, -1): o.append(cyl((3.33, s * 1.1, 1.25), 0.07, 0.04, mat('Lamp', None, (255, 230, 170), emit=(1, 0.85, 0.55), emit_str=2.0), 12, rot=(0, math.pi / 2, 0)))
    o.append(bx((-3.5, 0, 1.4), (0.2, 3.0, 0.4), Dk))                                         # rear plate / exhaust grille
    # turret (wide, flat, faceted); tier 2 more angular (sharper wedge front)
    tz = 1.62; tx = -0.25
    nose = 2.15 if t == 2 else 1.85
    bot = [(tx - 1.9, -1.5, tz), (tx + 1.3, -1.5, tz), (tx + nose, -0.85, tz), (tx + nose, 0.85, tz), (tx + 1.3, 1.5, tz), (tx - 1.9, 1.5, tz)]
    top = [(tx - 1.75, -1.25, tz + 0.66), (tx + 1.0, -1.25, tz + 0.66), (tx + nose - 0.45, -0.62, tz + 0.58), (tx + nose - 0.45, 0.62, tz + 0.58), (tx + 1.0, 1.25, tz + 0.66), (tx - 1.75, 1.25, tz + 0.66)]
    o.append(wedge('turret', bot, top, Bd))
    o.append(wedge('bustle', ring_xy(tx - 2.15, tz + 0.1, 0.4, 1.15), ring_xy(tx - 2.1, tz + 0.6, 0.36, 1.05), Bd))
    o.append(cyl((tx, 0, tz - 0.05), 1.3, 0.18, Dk, 20))                                        # turret ring
    # side stowage canisters (sprite: cylinders on the turret's left cheek)
    for s in (1, -1):
        o.append(cyl((tx - 0.4, s * 1.52, tz + 0.32), 0.16, 1.0, Dk, 12, rot=(0, math.pi / 2, 0)))
        for k in range(3): o.append(cyl((tx + 0.6 + k * 0.0, s * (1.3 - 0.0), tz + 0.25 + k * 0.17), 0.07, 0.35, Dk, 8, rot=(s * math.pi / 2, 0, 0)) if False else cyl((tx + 1.0, s * 1.35, tz + 0.22 + k * 0.14), 0.06, 0.3, Dk, 8, rot=(math.pi / 2, 0, 0)))
    # roof: commander sight block + hatch
    o += [bx((tx - 0.5, -0.45, tz + 0.82), (0.7, 0.55, 0.32), Bd, bev=0.04), bx((tx - 0.2, -0.45, tz + 0.86), (0.12, 0.4, 0.18), Dk),
          cyl((tx - 0.5, 0.55, tz + 0.7), 0.32, 0.1, Dk, 16), bx((tx + 0.3, 0.6, tz + 0.75), (0.3, 0.3, 0.2), Bd, bev=0.03)]
    # main gun: mantlet, long barrel, fume extractor, muzzle
    gz = tz + 0.36; gx0 = tx + nose - 0.2
    o.append(bx((gx0 + 0.1, 0, gz), (0.5, 0.75, 0.55), Bd, bev=0.06))
    o.append(rod((gx0, 0, gz), (gx0 + 4.6, 0, gz), 0.12, Gn, 14))
    o.append(cyl((gx0 + 2.0, 0, gz), 0.2, 0.75, Gn, 14, rot=(0, math.pi / 2, 0)))               # fume extractor
    o.append(cyl((gx0 + 0.6, 0, gz), 0.18, 0.5, Gn, 14, rot=(0, math.pi / 2, 0)))
    if c.get('glow'):        # scorpion_2: glowing blue energy barrel section
        Gw = mat('BlueGlow', None, (40, 140, 255), emit=(0.15, 0.55, 1.0), emit_str=1.6)
        o.append(cyl((gx0 + 3.7, 0, gz), 0.15, 1.6, Gw, 16, rot=(0, math.pi / 2, 0)))
        o.append(cyl((gx0 + 2.85, 0, gz), 0.2, 0.15, Dk, 16, rot=(0, math.pi / 2, 0)))
        o.append(cyl((gx0 + 4.55, 0, gz), 0.18, 0.12, Dk, 16, rot=(0, math.pi / 2, 0)))
    else:
        o.append(cyl((gx0 + 4.6, 0, gz), 0.15, 0.25, Gn, 14, rot=(0, math.pi / 2, 0)))           # muzzle
    if c.get('extra'):       # tier 1/2: add-on armour plates on the turret cheeks + roof MG
        for s in (1, -1):
            for k in range(3): o.append(bx((tx + 0.7 - k * 0.75, s * 1.43, tz + 0.36), (0.65, 0.12, 0.4), Bd, rot=(s * 0.18, 0, 0), bev=0.02))
        o += [cyl((tx - 0.5, 0.55, tz + 0.88), 0.06, 0.3, Dk, 8), bx((tx - 0.45, 0.55, tz + 1.05), (0.35, 0.12, 0.14), Dk),
              rod((tx - 0.3, 0.55, tz + 1.07), (tx + 0.75, 0.55, tz + 1.11), 0.03, Dk, 6)]
        for s in (1, -1):
            for i in range(5): o.append(bx((-2.75 + i * 1.32, s * 1.88, 1.0), (1.1, 0.03, 0.5), Bd, rot=(s * 0.06, 0, 0)))
    if c.get('gold'):        # scorpion_2: orange/gold trim along hull edges, skirts and turret seams
        Au = mat('Gold', 'metal', c['gold'], metal=0.75, rough=0.35)
        for s in (1, -1):
            o += [bx((-0.1, s * 1.9, 1.32), (6.8, 0.05, 0.05), Au), bx((-0.1, s * 1.9, 0.7), (6.8, 0.05, 0.05), Au),
                  bx((-0.6, s * 1.77, 1.63), (5.7, 0.04, 0.04), Au)]
            for i in range(6): o.append(bx((-3.41 + i * 1.32, s * 1.9, 1.0), (0.05, 0.05, 0.62), Au))
            o.append(bx((tx - 0.3, s * 1.45, tz + 0.1), (3.0, 0.04, 0.04), Au))
            o.append(bx((tx - 0.3, s * 1.27, tz + 0.64), (2.5, 0.04, 0.04), Au))
        o.append(bx((3.3, 0, 1.08), (0.04, 3.1, 0.05), Au, rot=(0, -0.35, 0)))
    ob = finalize('unit_scorpion_%d' % t, o)
    ground(ob, 8.2, axis='xy')
    return ob

# =================================================================== FIRST-PERSON VIEWMODEL GUNS (same parts as the world models)
# Exported along +X with the butt / pivot at the origin; Possess.ts rotates them to -Z (camera forward).
def vm_gun(name):
    reset()
    G = mat('Gun', 'metal', (40, 42, 44), metal=0.5, rough=0.45); G2 = mat('GunDark', 'metal', (26, 27, 28), metal=0.6, rough=0.4)
    Dk = mat('Dark', 'metal', (34, 34, 30), metal=0.5, rough=0.5)
    o = []
    if name in ('gun_vg_rifle', 'gun_vg_rifle_scope'): o = weapon('rifle', (0, 0, 0), G, G2, scope=name.endswith('scope'))
    elif name == 'gun_vg_smg': o = weapon('smg', (0, 0, 0), G, G2)
    elif name == 'gun_vg_br': o = weapon('br', (0, 0, 0), G, G2, scope=True)
    elif name == 'gun_aegis_beam':
        GB = mat('BeamBody', 'armor', (105, 107, 72), (55, 55, 37), metal=0.2, rough=0.5)
        Rd = mat('BeamGlow', None, (230, 40, 30), emit=(1.0, 0.12, 0.08), emit_str=1.6)
        o = weapon('beam', (0, 0, 0), GB, G2, glow=Rd)
    elif name == 'gun_raider_mg':   # warthog_0 pintle MG: receiver, ammo can, long jacketed barrel, spade grips
        Bd = mat('Body', 'panels', (114, 109, 72), (48, 44, 30), metal=0.06, rough=0.6)
        o = [bx((0.05, 0, 0.0), (0.75, 0.24, 0.3), Dk, bev=0.03), bx((-0.05, 0.24, -0.04), (0.3, 0.2, 0.24), Bd, bev=0.02),
             rod((0.4, 0, 0.04), (2.0, 0, 0.1), 0.04, Dk, 8), cyl((0.85, 0, 0.06), 0.07, 0.8, Dk, 10, rot=(0, math.pi / 2 - 0.04, 0)),
             cyl((1.98, 0, 0.1), 0.06, 0.12, Dk, 8, rot=(0, math.pi / 2 - 0.04, 0)), bx((0.3, 0, 0.18), (0.08, 0.04, 0.12), Dk),
             rod((-0.32, -0.1, -0.02), (-0.55, -0.1, -0.1), 0.025, Dk, 6), rod((-0.32, 0.1, -0.02), (-0.55, 0.1, -0.1), 0.025, Dk, 6)]
    elif name.startswith('gun_raider_rotary'):   # warthog_1 / _2 rotary in its octagonal drum (cyan glowing barrels on tier 2)
        glow = name.endswith('cyan')
        Bd = mat('Body', 'panels', (96, 96, 86) if not glow else (80, 75, 60), (40, 40, 34), metal=0.12, rough=0.6)
        Ba = mat('Barrel', 'metal', (50, 52, 54), metal=0.7, rough=0.35) if not glow else mat('Cyan', None, (40, 200, 255), emit=(0.1, 0.75, 1.0), emit_str=1.5)
        o = [cyl((-0.05, 0, 0), 0.3, 0.42, Bd, 8, rot=(math.pi / 2, 0, 0)), cyl((-0.05, 0, 0), 0.18, 0.46, Dk, 8, rot=(math.pi / 2, 0, 0)),
             bx((-0.05, 0.3, 0), (0.3, 0.12, 0.26), Bd, bev=0.02), cyl((0.32, 0, 0), 0.15, 0.25, Dk, 12, rot=(0, math.pi / 2, 0))]
        for i in range(6):
            a = i / 6 * math.tau
            o.append(rod((0.4, math.cos(a) * 0.08, math.sin(a) * 0.08), (1.15, math.cos(a) * 0.08, math.sin(a) * 0.08), 0.028, Ba, 6))
        for x in (0.7, 1.12): o.append(cyl((x, 0, 0), 0.13, 0.05, Dk if not glow else Ba, 12, rot=(0, math.pi / 2, 0)))
        if glow:
            Au = mat('Gold', 'metal', (150, 108, 42), metal=0.75, rough=0.35)
            o += [torus((-0.05, 0.23, 0), 0.29, 0.015, Au, rot=(math.pi / 2, 0, 0), seg=8), torus((-0.05, -0.23, 0), 0.29, 0.015, Au, rot=(math.pi / 2, 0, 0), seg=8)]
    elif name.startswith('gun_scorpion_cannon'):   # turret roof slab + mantlet + long gun with fume extractor (blue glow on tier 2)
        glow = name.endswith('blue')
        Bd = mat('Hull', 'panels', (122, 117, 83) if not glow else (86, 75, 57), (50, 46, 32), metal=0.08, rough=0.65)
        Gn = mat('Gun', 'metal', (92, 92, 86) if not glow else (64, 62, 58), metal=0.5, rough=0.45)
        o = [bx((-0.9, 0, -0.25), (1.8, 2.2, 0.12), Bd, bev=0.03), bx((0.1, 0, 0), (0.5, 0.75, 0.55), Bd, bev=0.06),
             rod((0, 0, 0), (4.6, 0, 0), 0.12, Gn, 14), cyl((2.0, 0, 0), 0.2, 0.75, Gn, 14, rot=(0, math.pi / 2, 0)),
             cyl((0.6, 0, 0), 0.18, 0.5, Gn, 14, rot=(0, math.pi / 2, 0))]
        if glow:
            Gw = mat('BlueGlow', None, (40, 140, 255), emit=(0.15, 0.55, 1.0), emit_str=1.6)
            o += [cyl((3.7, 0, 0), 0.15, 1.6, Gw, 16, rot=(0, math.pi / 2, 0)), cyl((2.85, 0, 0), 0.2, 0.15, Dk, 16, rot=(0, math.pi / 2, 0)), cyl((4.55, 0, 0), 0.18, 0.12, Dk, 16, rot=(0, math.pi / 2, 0))]
        else: o.append(cyl((4.6, 0, 0), 0.15, 0.25, Gn, 14, rot=(0, math.pi / 2, 0)))
    return finalize(name, o)

VM = ['gun_vg_rifle', 'gun_vg_rifle_scope', 'gun_vg_smg', 'gun_vg_br', 'gun_aegis_beam', 'gun_raider_mg', 'gun_raider_rotary',
      'gun_raider_rotary_cyan', 'gun_scorpion_cannon', 'gun_scorpion_cannon_blue']

ALL = ['unit_%s_%d' % (u, t) for u in ('marine', 'odst', 'spartan', 'warthog', 'scorpion') for t in range(3)] + VM
def build(name):
    if name.startswith('gun_'): return export(name, vm_gun(name))
    u, t = name[5:].rsplit('_', 1); t = int(t)
    if u == 'warthog': ob = raider(t)
    elif u == 'scorpion': ob = scorpion(t)
    else: ob = trooper('%s_%d' % (u, t))
    export(name, ob)

if __name__ == '__main__':
    arg = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'all'
    for n in (ALL if arg == 'all' else arg.split(',')): build(n)
