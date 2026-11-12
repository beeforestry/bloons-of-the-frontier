"""t77 (copied from t76, extended with tread/grille/armor kinds) Blender helper library: primitives, skin-modifier limbs, lathe bodies, procedural sprite-palette textures, GLB export.
All geometry is original, hand-placed per enemy in build_enemies.py (no t71 build_meshes primitives, no AI meshes)."""
import bpy, bmesh, math, os
import numpy as np
from mathutils import Vector, Euler, Matrix

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.abspath(os.path.join(R, '..', '..'))
rng = np.random.default_rng(77)

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    MATS.clear()

# ------------------------------------------------------------------ procedural textures (palette from our v3 sprites)
def _noise(N, scale, octaves=4):
    out = np.zeros((N, N))
    for o in range(octaves):
        s = max(2, int(N / scale / (2 ** o)))
        n = rng.random((s + 1, s + 1))
        # bilinear upsample
        xs = np.linspace(0, s, N, endpoint=False); i = xs.astype(int); f = xs - i
        f = f * f * (3 - 2 * f)
        a = n[i][:, i] * (1 - f)[None, :] + n[i][:, i + 1] * f[None, :]
        b = n[i + 1][:, i] * (1 - f)[None, :] + n[i + 1][:, i + 1] * f[None, :]
        out += (a * (1 - f)[:, None] + b * f[:, None]) / (2 ** o)
    out -= out.min(); return out / max(1e-6, out.max())

def tex_array(kind, rgb, N=128, rgb2=None):
    c = np.array(rgb, float) / 255.0; c2 = np.array(rgb2 if rgb2 else rgb, float) / 255.0
    n = _noise(N, 6, 5); n2 = _noise(N, 16, 3)
    if kind == 'rubber':
        img = c[None, None] * (0.93 + 0.1 * n2[..., None])
    elif kind == 'chitin':
        vein = np.clip(1 - np.abs(n - 0.5) * 14, 0, 1)
        img = (c[None, None] * (1 - n2[..., None]) + c2[None, None] * n2[..., None]) * (0.78 + 0.35 * n[..., None])
        img *= (1 - 0.45 * vein[..., None])
    elif kind == 'flesh':
        vein = np.clip(1 - np.abs(_noise(N, 10, 4) - 0.5) * 18, 0, 1)
        img = (c[None, None] * (1 - n2[..., None]) + c2[None, None] * n2[..., None]) * (0.8 + 0.3 * n[..., None])
        img *= (1 - 0.35 * vein[..., None])
    elif kind == 'clay':
        crack = np.clip(1 - np.abs(_noise(N, 5, 4) - 0.5) * 30, 0, 1) + np.clip(1 - np.abs(_noise(N, 9, 3) - 0.5) * 34, 0, 1)
        img = c[None, None] * (0.88 + 0.14 * n[..., None]); img *= (1 - 0.55 * np.clip(crack, 0, 1)[..., None])
    elif kind in ('metal', 'plates'):
        img = c[None, None] * (0.75 + 0.35 * n[..., None]) * (1 - 0.25 * (n2 ** 2)[..., None])
        for _ in range(40):
            x, y = rng.integers(0, N, 2); L = rng.integers(5, 25); a = rng.random() * np.pi
            for t in range(L): img[int(y + np.sin(a) * t) % N, int(x + np.cos(a) * t) % N] *= 1.3
        if kind == 'plates':
            g = N // 4
            for k in range(0, N, g):
                img[k:k + 2, :] *= 0.45; img[:, k:k + 2] *= 0.45
                for r in range(g // 2, N, g // 2):
                    img[k + 3:k + 5, r:r + 2] = np.minimum(1, img[k + 3:k + 5, r:r + 2] * 1.8)
                    img[r:r + 2, k + 3:k + 5] = np.minimum(1, img[r:r + 2, k + 3:k + 5] * 1.8)
    elif kind == 'bone':
        img = (c[None, None] * (1 - n2[..., None]) + c2[None, None] * n2[..., None]) * (0.85 + 0.2 * n[..., None])
    elif kind == 'armor':  # t77 painted armour plate: mottled paint, chipped edges (bright), grime (rgb2)
        g = c2 if rgb2 else c * 0.6
        img = c[None, None] * (0.86 + 0.22 * n[..., None])
        grime = np.clip((n2 - 0.55) * 2.2, 0, 1)[..., None]
        img = img * (1 - grime) + g[None, None] * grime
        for _ in range(22):
            x, y = rng.integers(0, N, 2); L = rng.integers(1, 4); a = rng.random() * np.pi
            for t in range(L): img[int(y + np.sin(a) * t) % N, int(x + np.cos(a) * t) % N] = np.minimum(1, c * 1.3 + 0.03)
        if rgb2 is not None and N >= 128 and kind == 'armor' and False: pass
    elif kind == 'panels':  # t77 vehicle armour: painted plate + panel seams + rivets + grime
        g = c2 if rgb2 else c * 0.6
        img = c[None, None] * (0.86 + 0.22 * n[..., None])
        grime = np.clip((n2 - 0.5) * 2.0, 0, 1)[..., None]
        img = img * (1 - grime) + g[None, None] * grime
        q = N // 4
        for k in range(0, N, q):
            img[k:k + 1, :] *= 0.5; img[:, k:k + 1] *= 0.5; img[k + 1:k + 2, :] = np.minimum(1, img[k + 1:k + 2, :] * 1.25)
            for r in range(q // 4, N, q // 2): img[k + 3:k + 5, r:r + 2] = np.minimum(1, img[k + 3:k + 5, r:r + 2] * 1.5)
        for _ in range(16):
            x, y = rng.integers(0, N, 2)
            img[y % N, x % N] = np.minimum(1, c * 1.35)
    elif kind == 'tread':  # t77 track links: dark rubber/steel bars across U
        img = c[None, None] * (0.7 + 0.3 * n[..., None])
        for k in range(0, N, N // 16):
            img[:, k:k + 3] *= 0.4; img[:, k + 3:k + 5] = np.minimum(1, img[:, k + 3:k + 5] * 1.5)
    elif kind == 'tire':  # t77 knobbly tyre tread
        img = c[None, None] * (0.75 + 0.3 * n[..., None])
        for k in range(0, N, N // 24):
            img[:, k:k + 2] *= 0.35
            img[N // 2 - 2:N // 2 + 2, k:k + 4] *= 0.5
    else:  # cloth / leather / plain
        img = c[None, None] * (0.8 + 0.3 * n[..., None])
    return np.clip(img, 0, 1)

def make_image(name, kind, rgb, rgb2=None, N=128):
    a = tex_array(kind, rgb, N, rgb2)
    img = bpy.data.images.new(name, N, N, alpha=False)
    px = np.ones((N, N, 4)); px[..., :3] = a
    img.pixels.foreach_set(px[::-1].ravel().astype(np.float32))
    img.pack(); return img

MATS = {}
def mat(name, kind=None, rgb=(200, 200, 200), rgb2=None, metal=0.0, rough=0.6, emit=None, emit_str=0.0, alpha=None, N=128):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    bs = m.node_tree.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value = (*[(x / 255.0) ** 2.2 for x in rgb], 1)
    bs.inputs['Metallic'].default_value = metal; bs.inputs['Roughness'].default_value = rough
    if kind:
        t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = make_image(name + '_tex', kind, rgb, rgb2, N)
        m.node_tree.links.new(t.outputs['Color'], bs.inputs['Base Color'])
    if emit:
        bs.inputs['Emission Color'].default_value = (*emit, 1); bs.inputs['Emission Strength'].default_value = emit_str
    if alpha is not None:
        bs.inputs['Alpha'].default_value = alpha; m.blend_method = 'BLEND'
    MATS[name] = m; return m

# ------------------------------------------------------------------ primitives
def put(ob, m, smooth=True):
    ob.data.materials.clear(); ob.data.materials.append(m)
    for p in ob.data.polygons: p.use_smooth = smooth
    return ob

def ell(loc, r, m, seg=16, rings=10, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=1, location=loc, rotation=rot)
    ob = bpy.context.object; ob.scale = r; return put(ob, m)

def cyl(loc, r, depth, m, verts=12, rot=(0, 0, 0), r2=None, scale=None, smooth=True):
    if r2 is None: bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    else: bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=depth, location=loc, rotation=rot)
    ob = bpy.context.object
    if scale: ob.scale = scale
    return put(ob, m, smooth)

def box(loc, size, m, rot=(0, 0, 0), bev=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    ob = bpy.context.object; ob.scale = size; put(ob, m, False)
    if bev:
        md = ob.modifiers.new('bev', 'BEVEL'); md.width = bev; md.segments = 1
    return ob

def torus(loc, R_, r, m, rot=(0, 0, 0), scale=(1, 1, 1), seg=20, mseg=4):
    bpy.ops.mesh.primitive_torus_add(major_segments=seg, minor_segments=mseg, major_radius=R_, minor_radius=r, location=loc, rotation=rot)
    ob = bpy.context.object; ob.scale = scale; return put(ob, m)

def aim(ob, d, up='Y'):
    """orient object local +Z along direction d"""
    ob.rotation_mode = 'QUATERNION'; ob.rotation_quaternion = Vector(d).normalized().to_track_quat('Z', up); return ob

def cone_between(a, b, r0, m, r1=0.0, verts=8):
    a, b = Vector(a), Vector(b); d = b - a
    ob = cyl((a + b) / 2, r0, d.length, m, verts, r2=r1); return aim(ob, d)

def rod(a, b, r, m, verts=8):
    a, b = Vector(a), Vector(b); d = b - a
    ob = cyl((a + b) / 2, r, d.length, m, verts); return aim(ob, d)

def skin_chains(name, chains, m, lv=1, smooth=0.5):
    """chains: list of [(point, radius), ...]; builds one skin-modifier mesh (organic tapered limbs) + subsurf."""
    verts, edges, rad, roots = [], [], [], []
    for ch in chains:
        base = len(verts); roots.append(base)
        for i, (p, r) in enumerate(ch):
            verts.append(tuple(p)); rad.append(r)
            if i: edges.append((base + i - 1, base + i))
    me = bpy.data.meshes.new(name); me.from_pydata(verts, edges, []); me.update()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    md = ob.modifiers.new('skin', 'SKIN'); md.use_smooth_shade = True; md.branch_smoothing = smooth
    sv = ob.data.skin_vertices[0].data
    for i, r in enumerate(rad):
        rr = r if isinstance(r, (tuple, list)) else (r, r)
        sv[i].radius = rr; sv[i].use_root = False
    for i in roots: sv[i].use_root = True
    if lv:
        s = ob.modifiers.new('ss', 'SUBSURF'); s.levels = lv; s.render_levels = lv
    return put(ob, m)

def lathe(name, profile, m, seg=24, axis='Z'):
    """profile: [(r, h), ...] from one pole to the other; revolve around Z (or X)."""
    bm = bmesh.new(); rings = []
    for (r, h) in profile:
        ring = []
        if r < 1e-4:
            ring = [bm.verts.new((0, 0, h))]
        else:
            for k in range(seg):
                a = k / seg * math.tau; ring.append(bm.verts.new((math.cos(a) * r, math.sin(a) * r, h)))
        rings.append(ring)
    for A, B in zip(rings, rings[1:]):
        if len(A) == 1 and len(B) == 1: continue
        if len(A) == 1:
            for k in range(seg): bm.faces.new((A[0], B[k], B[(k + 1) % seg]))
        elif len(B) == 1:
            for k in range(seg): bm.faces.new((A[k], B[0], A[(k + 1) % seg]))
        else:
            for k in range(seg): bm.faces.new((A[k], B[k], B[(k + 1) % seg], A[(k + 1) % seg]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    if axis == 'X': ob.rotation_euler = (0, math.pi / 2, 0)
    # cylindrical UVs
    me.uv_layers.new(name='UVMap')
    uv = me.uv_layers[0].data
    zs = [v.co.z for v in me.vertices]; z0, z1 = min(zs), max(zs)
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            uv[li].uv = ((math.atan2(v.y, v.x) / math.tau) % 1.0, (v.z - z0) / max(1e-6, z1 - z0))
    return put(ob, m)

def tube_path(name, pts, r, m, verts=6):
    """thin tube along a polyline (balloon string, antennae, whiskers)."""
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = max(0, verts // 4 - 1)
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts): sp.points[i].co = (*p, 1)
    ob = bpy.data.objects.new(name, cu); bpy.context.collection.objects.link(ob)
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    bpy.ops.object.convert(target='MESH'); ob = bpy.context.object; ob.select_set(False)
    return put(ob, m)

def spikes_on(center, radii, m, n, ridge=lambda t: (t, 0.6), length=0.15, base=0.04, jitter=0.0):
    """cones sticking out of an ellipsoid surface. ridge(t)->(u along X in [-1,1], elevation 0..1 (0 = side, 1 = top))."""
    out = []; c = Vector(center); rx, ry, rz = radii
    for i in range(n):
        t = -0.85 + 1.7 * i / max(1, n - 1)
        u, el = ridge(t)
        for side in ((1,) if el >= 0.99 else (1, -1)):
            ang = el * math.pi / 2
            p = Vector((u, side * math.cos(ang) * math.sqrt(max(0, 1 - u * u)), math.sin(ang) * math.sqrt(max(0, 1 - u * u))))
            surf = c + Vector((p.x * rx, p.y * ry, p.z * rz)); nrm = Vector((p.x / rx, p.y / ry, p.z / rz)).normalized()
            L = length * (1 + jitter * (rng.random() - 0.5))
            out.append(cone_between(surf - nrm * 0.02, surf + nrm * L, base, m, 0.0, 6))
    return out

# ------------------------------------------------------------------ finalize / export
def finalize(name, objs=None, decimate_over=None):
    objs = objs or [o for o in bpy.context.scene.objects if o.type == 'MESH']
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        bpy.context.view_layer.objects.active = o; o.select_set(True)
        for md in list(o.modifiers):
            try: bpy.ops.object.modifier_apply(modifier=md.name)
            except RuntimeError: o.modifiers.remove(md)
        o.select_set(False)
    for o in objs:
        if not o.data.uv_layers:
            bpy.context.view_layer.objects.active = o; o.select_set(True)
            bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
            bpy.ops.uv.smart_project(angle_limit=1.15, island_margin=0.02)
            bpy.ops.object.mode_set(mode='OBJECT'); o.select_set(False)
        else:
            o.data.uv_layers.active = o.data.uv_layers[0]
        while len(o.data.uv_layers) > 1: o.data.uv_layers.remove(o.data.uv_layers[1])
        o.data.uv_layers[0].name = 'UVMap'
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join(); ob = bpy.context.object; ob.name = name; ob.data.name = name
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    tris = sum(len(p.vertices) - 2 for p in ob.data.polygons)
    if decimate_over and tris > decimate_over:
        md = ob.modifiers.new('dec', 'DECIMATE'); md.ratio = decimate_over / tris
        bpy.ops.object.modifier_apply(modifier=md.name)
    return ob

def export(name, ob):
    out = os.path.join(REPO, 'public', 'assets', 'glb', name + '.glb')
    bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_image_format='JPEG', export_jpeg_quality=80,
                              export_apply=True, export_yup=True, use_selection=True)
    tris = sum(len(p.vertices) - 2 for p in ob.data.polygons)
    print('EXPORTED', name, 'tris', tris, 'bytes', os.path.getsize(out), flush=True)
    os.makedirs(os.path.join(R, 'blend'), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(R, 'blend', name + '.blend'), compress=True)
