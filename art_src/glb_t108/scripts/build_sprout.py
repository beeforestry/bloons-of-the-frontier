"""t108 GMMG-4: the Sprout Farmhand (free money/orb collector) as a first-person world model, modelled against OUR painted
sprites only: public/assets/v3/farmhand_0.webp (Farmhand: straw sun hat, wicker basket of greens, leafy body, twig legs)
and farmhand_1.webp (Foreman: yellow hard hat, orange hi-vis vest with reflective bands, wrench, basket on the back).
blender -b -P art_src/glb_t108/scripts/build_sprout.py -- <unit_farmhand_0|unit_farmhand_1|all>
Conventions as t77: +X forward, +Y left, Z up, feet on z=0, metres (sprout ~1.15 m tall incl. hat).
All geometry hand-placed here; textures procedural (lib.py + a woven-straw pattern below), palette sampled from the sprites."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
from lib import _noise
V = Vector
def bx(c, s, m, rot=(0, 0, 0), bev=0.0): return box(tuple(c), tuple(s), m, rot, bev)

def weave_image(name, rgb, N=128):
    """basket / straw-hat weave: alternating over-under strands with dark gaps."""
    c = np.array(rgb, float) / 255.0; n = _noise(N, 6, 4)
    y, x = np.mgrid[0:N, 0:N]; cell = 8
    u = (x % cell) / cell; v = (y % cell) / cell; par = ((x // cell) + (y // cell)) % 2
    strand = np.where(par == 0, np.sin(u * np.pi), np.sin(v * np.pi)) ** 0.6
    img = c[None, None] * (0.55 + 0.5 * strand[..., None]) * (0.85 + 0.25 * n[..., None])
    gap = ((x % cell == 0) | (y % cell == 0))[..., None]
    img = np.where(gap, img * 0.45, img)
    im = bpy.data.images.new(name, N, N, alpha=False); px = np.ones((N, N, 4)); px[..., :3] = np.clip(img, 0, 1)
    im.pixels.foreach_set(px[::-1].ravel().astype(np.float32)); im.pack(); return im

def weave_mat(name, rgb):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; bs = m.node_tree.nodes['Principled BSDF']
    bs.inputs['Roughness'].default_value = 0.9
    t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = weave_image(name + '_tex', rgb)
    m.node_tree.links.new(t.outputs['Color'], bs.inputs['Base Color']); MATS[name] = m; return m

def leaf(base, d, L, W, m, roll=0.0):
    """one pointed leaf blade: flattened ellipsoid from base along d (the sprite's shingled leaves)."""
    d = V(d).normalized(); ob = ell(V(base) + d * L * 0.5, (W, W * 0.18, L * 0.5), m, 10, 6)
    ob.rotation_mode = 'QUATERNION'; q = d.to_track_quat('Z', 'Y'); ob.rotation_quaternion = q @ Euler((0, 0, roll)).to_quaternion()
    # pointed tip: squash the top ring a little
    return ob

def leafy_body(c, r, Ls, n_rings=7):
    """core ellipsoid + shingled leaves pointing down/out, darker inside, lighter outer layer."""
    o = [ell(c, r, Ls[2], 18, 12)]
    for i in range(n_rings):
        el = 1.15 - i * (2.0 / (n_rings - 1))           # top -> bottom elevation (rad-ish)
        el = max(-1.2, min(1.25, el)); ring_n = max(6, int(16 * math.cos(el * 0.9)))
        for k in range(ring_n):
            a = (k + 0.5 * (i % 2)) / ring_n * math.tau + rng.random() * 0.15
            p = V((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el), math.sin(el)))
            s = V(c) + V((p.x * r[0], p.y * r[1], p.z * r[2])) * 0.92
            out = V((p.x, p.y, 0)).normalized() if abs(math.cos(el)) > 0.05 else V((1, 0, 0))
            d = (out * 0.75 + V((0, 0, -1.0)) * 0.9 + V((0, 0, 0.35)) * (el > 0.9)).normalized()
            m = Ls[(i + k) % 2]
            o.append(leaf(s, d, 0.2 + 0.06 * rng.random(), 0.055 + 0.015 * rng.random(), m, roll=a))
    return o

def sprout_tip(top, m, stem, big=1.0):
    o = [rod(top, top + V((0.0, 0, 0.07 * big)), 0.012, stem)]
    o.append(leaf(top + V((0, 0, 0.06 * big)), (0.55, 0.15, 0.8), 0.17 * big, 0.075 * big, m, 0.3))
    o.append(leaf(top + V((0, 0, 0.06 * big)), (-0.5, -0.2, 0.75), 0.12 * big, 0.055 * big, m, -0.4))
    return o

def basket(c, R_, H, Wk, G1, G2, Bark, handle=True, tilt=(0, 0, 0)):
    o = []
    bk = lathe('basket', [(0.0, 0), (R_ * 0.8, 0), (R_ * 0.86, 0.01), (R_, H), (R_ * 0.93, H), (R_ * 0.79, 0.02), (0.0, 0.02)], Wk, seg=20)
    o.append(bk); o.append(torus((0, 0, H), R_ * 0.97, 0.018, Wk, seg=20))
    for k in range(9):  # greens heaped inside
        a = k / 9 * math.tau
        o.append(leaf(V((math.cos(a) * R_ * 0.4, math.sin(a) * R_ * 0.4, H * 0.75)), (math.cos(a) * 0.5, math.sin(a) * 0.5, 1), 0.16, 0.06, (G1, G2)[k % 2], a))
    if handle: o.append(torus((0, 0, H), R_ * 0.9, 0.016, Wk, rot=(math.pi / 2, 0, 0), scale=(1, 1, 0.9), seg=18))
    root = bpy.data.objects.new('bk_root', None); bpy.context.collection.objects.link(root)
    for x in o: x.parent = root
    root.location = c; root.rotation_euler = tilt
    bpy.context.view_layer.update()
    for x in o:
        mw = x.matrix_world.copy(); x.parent = None; x.matrix_world = mw
    bpy.data.objects.remove(root)
    return o

def sprout(t):
    reset()
    G1 = mat('Leaf', 'flesh', (132, 178, 58), (96, 144, 40), rough=0.7)
    G2 = mat('LeafDark', 'flesh', (98, 146, 40), (70, 112, 30), rough=0.75)
    G0 = mat('Core', 'flesh', (46, 70, 18), rough=0.9)
    Bark = mat('Bark', 'clay', (122, 94, 60), rough=0.9)
    Wk = weave_mat('Wicker', (176, 140, 80))
    o = []
    # ---- twig legs (walking stride like the sprites: left leg forward, right back), knobbly toes
    hipL, kneeL, ankL = V((0.03, 0.09, 0.42)), V((0.1, 0.11, 0.24)), V((0.15, 0.12, 0.05))
    hipR, kneeR, ankR = V((-0.03, -0.09, 0.42)), V((-0.08, -0.11, 0.23)), V((-0.16, -0.12, 0.05))
    chains = [[(hipL, 0.06), (kneeL, 0.048), (ankL, 0.04)], [(hipR, 0.06), (kneeR, 0.048), (ankR, 0.04)]]
    for ank, fw in ((ankL, 0.0), (ankR, -0.15)):
        for s in (-1, 0, 1): chains.append([(ank, 0.03), (ank + V((0.09 + 0.02 * (s == 0), s * 0.05, -0.04)), 0.016)])
        chains.append([(ank, 0.028), (ank + V((-0.06, 0, -0.04)), 0.014)])  # heel spur
    # ---- twig arms: right (+x front) hangs and grips, left reaches back to the basket
    shR, elR, hR = V((0.05, -0.22, 0.74)), V((0.13, -0.36, 0.56)), V((0.24, -0.38, 0.45))
    shL, elL, hL = V((0.0, 0.2, 0.74)), V((-0.02, 0.36, 0.58)) if t == 0 else V((0.04, 0.36, 0.57)), V((0.02, 0.4, 0.47)) if t == 0 else V((0.14, 0.38, 0.44))
    chains += [[(shR, 0.04), (elR, 0.034), (hR, 0.03)], [(shL, 0.04), (elL, 0.034), (hL, 0.03)]]
    for h in (hR, hL):
        for s in (-1, 1): chains.append([(h, 0.02), (h + V((0.04, s * 0.025, -0.04)), 0.01)])
    o.append(skin_chains('twigs', chains, Bark, lv=1))
    # ---- leafy body (pear-shaped: wider low, shoulders tuck under the hat)
    c = V((0.0, 0.0, 0.66))
    o += leafy_body(c, (0.23, 0.22, 0.3), (G1, G2, G0))
    o.append(ell(c + V((0.0, 0, -0.16)), (0.21, 0.2, 0.14), G2, 14, 8))
    o += leafy_body(c + V((0.02, 0, 0.24)), (0.17, 0.17, 0.12), (G1, G2, G0), n_rings=4)  # leafy head under the hat
    top = c + V((0, 0, 0.3))
    if t == 0:
        # ---- straw sun hat (wide drooping brim + crown band) + sprout on top
        o.append(lathe('brim', [(0.0, 0.0), (0.14, 0.0), (0.3, -0.025), (0.43, -0.08), (0.445, -0.1), (0.425, -0.095), (0.29, -0.045), (0.14, -0.016), (0.0, -0.016)], Wk, seg=28))
        o[-1].location = top + V((0.0, 0, 0.0)); o[-1].rotation_euler = (0.0, -0.12, 0)
        o.append(lathe('crown', [(0.0, 0.22), (0.1, 0.215), (0.16, 0.17), (0.18, 0.05), (0.185, 0.0), (0.0, 0.0)], Wk, seg=24))
        o[-1].location = top + V((0, 0, -0.01)); o[-1].rotation_euler = (0.0, -0.12, 0)
        o.append(torus(top + V((0, 0, 0.03)), 0.183, 0.02, mat('Band', 'clay', (150, 112, 60), rough=0.9), rot=(0, -0.12, 0), seg=24))
        o += sprout_tip(top + V((-0.03, 0, 0.2)), G1, Bark, 1.5)
        # basket held at the left hip with the left arm through the handle (sprite: big basket on the near side)
        o += basket(V((0.06, -0.44, 0.24)), 0.18, 0.28, Wk, G1, G2, Bark, True, (0.15, 0.0, 0.3))
    else:
        # ---- Foreman: yellow hard hat + sprout, hi-vis vest with reflective bands, wrench, basket on the back
        Hh = mat('HardHat', 'rubber', (250, 196, 40), rough=0.3)
        o.append(lathe('hat', [(0.0, 0.25), (0.12, 0.24), (0.21, 0.17), (0.25, 0.05), (0.26, 0.0), (0.0, 0.0)], Hh, seg=28))
        o[-1].location = top + V((0, 0, -0.04))
        o.append(lathe('hbrim', [(0.0, 0.0), (0.26, 0.0), (0.31, -0.014), (0.31, -0.028), (0.0, -0.028)], Hh, seg=28))
        o[-1].location = top + V((0.0, 0, -0.03)); o[-1].scale = (1.18, 1.0, 1.0); o[-1].location.x += 0.03
        o.append(bx(top + V((0, 0, 0.18)), (0.4, 0.045, 0.035), Hh, bev=0.012))  # ridge
        o += sprout_tip(top + V((0, 0, 0.21)), G1, Bark, 1.1)
        Vo = mat('Vest', 'rubber', (236, 104, 34), rough=0.8); Rf = mat('Reflect', None, (210, 214, 205), metal=0.3, rough=0.25)
        o.append(lathe('vest', [(0.33, 0.0), (0.345, 0.12), (0.33, 0.26), (0.27, 0.36), (0.255, 0.36), (0.315, 0.26), (0.33, 0.12), (0.315, 0.0)], Vo, seg=28))
        o[-1].location = c + V((0, 0, -0.26)); o[-1].scale = (0.95, 1.0, 1.0)
        for z in (0.07, 0.19): o.append(torus(c + V((0, 0, -0.26 + z)), 0.343, 0.022, Rf, scale=(0.95, 1.0, 0.75), seg=28))
        for s in (1, -1): o.append(rod(c + V((0.2, s * 0.17, 0.08)), c + V((0.08, s * 0.16, 0.24)), 0.022, Rf))  # shoulder bands
        W = mat('Steel', 'metal', (150, 152, 156), metal=0.8, rough=0.35)
        o.append(rod(hR + V((-0.01, 0, 0.03)), hR + V((0.2, 0, -0.07)), 0.014, W))
        jaw = hR + V((0.22, 0, -0.08)); o.append(torus(jaw, 0.035, 0.012, W, rot=(math.pi / 2, 0, 0.4), seg=12))
        o += basket(V((-0.27, 0.0, 0.5)), 0.15, 0.25, Wk, G1, G2, Bark, False, (0.0, -0.35, 0.0))
        o.append(rod(V((-0.17, 0.12, 0.85)), V((-0.2, 0.12, 0.52)), 0.012, Bark)); o.append(rod(V((-0.17, -0.12, 0.85)), V((-0.2, -0.12, 0.52)), 0.012, Bark))  # straps
    ob = finalize('unit_farmhand_%d' % t, None, decimate_over=14000)
    bb = [ob.matrix_world @ V(cc) for cc in ob.bound_box]; mnz = min(p.z for p in bb)
    ob.location.z -= mnz; bpy.ops.object.transform_apply(location=True)
    return ob

if __name__ == '__main__':
    arg = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'all'
    for n in (['unit_farmhand_0', 'unit_farmhand_1'] if arg == 'all' else arg.split(',')):
        export(n, sprout(int(n[-1])))
