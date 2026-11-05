"""t72: Dart Scout (max tier, matches public/assets/v3/dart_monkey_2.webp) hero + FP gauntlet launcher.
Blender 4.3:  blender -b -P art_src/glb_t72/scripts/build_dart_scout.py -- <hero|gun|both>
Hand-modelled from primitives + skin-modifier body + subdivision, all original. Faces +X, Z-up (glTF Y-up on export)."""
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix, Euler
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.abspath(os.path.join(R, '..', '..'))
TEX = os.path.join(R, 'tex')
which = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'both'

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)

MATS = {}
def mat(name, tex=None, color=(1, 1, 1), metal=0.0, rough=0.7, emit=None, emit_str=0.0):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    bs = m.node_tree.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value = (*color, 1)
    bs.inputs['Metallic'].default_value = metal; bs.inputs['Roughness'].default_value = rough
    if tex:
        t = m.node_tree.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(os.path.join(TEX, tex + '.png'))
        m.node_tree.links.new(t.outputs['Color'], bs.inputs['Base Color'])
    if emit:
        bs.inputs['Emission Color'].default_value = (*emit, 1); bs.inputs['Emission Strength'].default_value = emit_str
    MATS[name] = m; return m

def materials():
    MATS.clear()
    return dict(
        fur=mat('Fur', 'fur_body', rough=0.95), cap=mat('FurCap', 'fur_cap', rough=0.95),
        foot=mat('FurFoot', 'fur_foot', rough=0.9), skin=mat('Skin', 'skin', rough=0.75),
        metal=mat('Plate', 'metal', metal=0.55, rough=0.34), gold=mat('GoldTrim', 'gold', metal=0.6, rough=0.32),
        leather=mat('Leather', 'leather', rough=0.8), wood=mat('DartShaft', 'wood', rough=0.7),
        eye=mat('Eye', None, (0.03, 0.02, 0.015), rough=0.15), dark=mat('DarkSteel', None, (0.3, 0.28, 0.25), metal=0.5, rough=0.4),
        fletch=mat('Fletch', None, (0.55, 0.47, 0.36), rough=0.9),
        sun=mat('SunCore', None, (0.95, 0.66, 0.22), rough=0.3, emit=(1.0, 0.62, 0.15), emit_str=1.1),
    )

def put(ob, m, smooth=True):
    ob.data.materials.clear(); ob.data.materials.append(m)
    if smooth:
        for p in ob.data.polygons: p.use_smooth = True
    return ob

def sphere(loc, scale, m, seg=16, rings=10, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=1, location=loc, rotation=rot)
    ob = bpy.context.object; ob.scale = scale; return put(ob, m)

def cyl(loc, r, depth, m, verts=16, rot=(0, 0, 0), r2=None, scale=None):
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    else:
        bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=depth, location=loc, rotation=rot)
    ob = bpy.context.object
    if scale: ob.scale = scale
    put(ob, m); bevel(ob, 0.006); return ob

def torus(loc, R_, r, m, rot=(0, 0, 0), scale=(1, 1, 1), seg=18):
    bpy.ops.mesh.primitive_torus_add(major_segments=seg, minor_segments=4, major_radius=R_, minor_radius=r, location=loc, rotation=rot)
    ob = bpy.context.object; ob.scale = scale; return put(ob, m)

def box(loc, size, m, rot=(0, 0, 0), bev=0.01):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    ob = bpy.context.object; ob.scale = size; put(ob, m, smooth=False); bevel(ob, bev); return ob

def bevel(ob, w):
    md = ob.modifiers.new('bev', 'BEVEL'); md.width = w; md.segments = 1; md.limit_method = 'ANGLE'
    md2 = ob.modifiers.new('ws', 'WEIGHTED_NORMAL') if False else None

def subsurf(ob, lv=1):
    md = ob.modifiers.new('ss', 'SUBSURF'); md.levels = lv; md.render_levels = lv
    return ob

def shell(loc, scale, m, rot=(0, 0, 0), cut=0.0, thick=0.02, seg=20, rings=12, keep='top', band=0.2):
    """Half/partial sphere plate (pauldron, cuirass lames) with thickness."""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=1)
    ob = bpy.context.object
    bm = bmesh.new(); bm.from_mesh(ob.data)
    kill = [v for v in bm.verts if (v.co.z < cut if keep == 'top' else v.co.z > cut)]
    bmesh.ops.delete(bm, geom=kill, context='VERTS')
    # gold trim band along the cut edge (like the painted gilded plate edges)
    for f in bm.faces:
        if min(v.co.z for v in f.verts) < cut + band: f.material_index = 1
    bm.to_mesh(ob.data); bm.free()
    ob.scale = scale; ob.location = loc; ob.rotation_euler = rot
    md = ob.modifiers.new('sol', 'SOLIDIFY'); md.thickness = thick; md.offset = 1
    md.use_rim = True; md.material_offset_rim = 1
    ob.data.materials.clear(); ob.data.materials.append(m); ob.data.materials.append(MATS['GoldTrim'])
    for p in ob.data.polygons: p.use_smooth = True
    return ob

def shell_rim(loc, scale, m, rot=(0, 0, 0), cut=0.0, r=0.012):
    """gold trim exactly on a shell's cut edge (same transform as the shell)."""
    rr = math.sqrt(max(0.0, 1 - cut * cut))
    bpy.ops.mesh.primitive_torus_add(major_segments=28, minor_segments=5, major_radius=rr, minor_radius=r / max(scale[0], scale[1]), location=(0, 0, cut))
    ob = bpy.context.object
    bpy.ops.object.transform_apply(location=True)
    ob.scale = scale; ob.rotation_euler = rot; ob.location = loc
    return put(ob, m)

def skin_body(name, verts, edges, radii, m, lv=2):
    me = bpy.data.meshes.new(name); me.from_pydata(verts, edges, []); me.update()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    md = ob.modifiers.new('skin', 'SKIN'); md.use_smooth_shade = True; md.branch_smoothing = 0.6
    for i, r in enumerate(radii):
        ob.data.skin_vertices[0].data[i].radius = r
    ob.data.skin_vertices[0].data[0].use_root = True
    subsurf(ob, lv); put(ob, m); return ob

def finalize(objs, name):
    """apply modifiers, smart-UV anything w/o UVs, join everything into one object (multi-material)."""
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
            bpy.ops.uv.smart_project(angle_limit=1.15, island_margin=0.02, scale_to_bounds=False)
            bpy.ops.object.mode_set(mode='OBJECT'); o.select_set(False)
        # tile textures ~ consistent density
        for uv in o.data.uv_layers:
            for d in uv.data: d.uv = d.uv * 2.0
    # tri budget: collapse-decimate the dense armour/prop parts (body + tail stay full-res so the curl survives)
    for o in objs:
        t = sum(len(p.vertices) - 2 for p in o.data.polygons)
        if o.name != 'Body' and t > 300:
            bpy.context.view_layer.objects.active = o; o.select_set(True)
            md = o.modifiers.new('dec', 'DECIMATE'); md.ratio = 0.5
            bpy.ops.object.modifier_apply(modifier=md.name); o.select_set(False)
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join(); ob = bpy.context.object; ob.name = name; ob.data.name = name
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return ob

def dart(p, d, M, L=0.16, r=0.007):
    """single dart: shaft along direction d from p (tip end), steel tip + fletching."""
    d = Vector(d).normalized(); p = Vector(p)
    rot = d.to_track_quat('Z', 'Y').to_euler()
    out = []
    out.append(cyl(p - d * L * 0.5, r, L, M['wood'], 8, rot))
    out.append(cyl(p + d * 0.03, r * 1.6, 0.06, M['dark'], 8, rot, r2=0.0))
    for k in range(3):
        a = k * 2.094
        b = box(p - d * (L - 0.02), (0.002, 0.03, 0.05), M['fletch'], bev=0.0)
        b.rotation_euler = rot; b.rotation_mode = 'XYZ'
        b.rotation_euler.rotate(Euler((0, 0, a)))
        q = rot.to_quaternion() @ Euler((0, 0, a)).to_quaternion(); b.rotation_mode = 'QUATERNION'; b.rotation_quaternion = q
        out.append(b)
    return out

def launcher(base, d, side, M, n=4, length=0.2, darts=True):
    """wrist dart launcher: bundle of tubes w/ gold bands, darts protruding from the front."""
    d = Vector(d).normalized(); base = Vector(base); side = Vector(side).normalized()
    up = d.cross(side).normalized()
    rot = d.to_track_quat('Z', 'Y').to_euler(); out = []
    for i in range(n):
        off = side * ((i - (n - 1) / 2) * 0.034) + up * (0.012 * math.cos(i))
        c = base + off
        out.append(cyl(c, 0.016, length, M['dark'], 10, rot))
        for t in (-0.38, 0.0, 0.4):
            out.append(cyl(c + d * length * t, 0.019, 0.018, M['gold'], 10, rot))
        if darts:
            out += dart(c + d * (length * 0.5 + 0.09), d, M, L=0.14, r=0.006)
    # mount plate under the tubes
    out.append(cyl(base - up * 0.02, 0.07, length * 0.9, M['metal'], 14, rot, scale=(1, 0.45, 1)))
    return out

# ----------------------------------------------------------------- HERO
def build_hero():
    reset(); M = materials(); objs = []
    # --- body (skin modifier): crouched, wide stance like the sprite, faces +X
    V = [(0, 0, 0.80),            # 0 pelvis (root)
         (0.02, 0, 1.06),         # 1 belly
         (0.03, 0, 1.28),         # 2 chest
         (0.06, 0, 1.42),         # 3 neck
         (0.0, 0.24, 1.32), (0.04, 0.36, 1.06), (0.18, 0.4, 0.9), (0.26, 0.39, 0.86),   # 4-7 L arm
         (0.0, -0.24, 1.32), (0.06, -0.36, 1.06), (0.22, -0.38, 0.92), (0.3, -0.37, 0.88),  # 8-11 R arm
         (0.0, 0.12, 0.74), (0.14, 0.2, 0.44), (0.0, 0.22, 0.12), (0.12, 0.23, 0.04),      # 12-15 L leg
         (0.0, -0.12, 0.74), (0.14, -0.2, 0.44), (0.0, -0.22, 0.12), (0.12, -0.23, 0.04),  # 16-19 R leg
         (-0.14, 0, 0.76), (-0.38, -0.06, 0.7), (-0.58, -0.12, 0.52), (-0.68, -0.16, 0.3),  # 20-23 tail
         (-0.62, -0.18, 0.12), (-0.48, -0.18, 0.08), (-0.41, -0.18, 0.19), (-0.47, -0.18, 0.27)]  # 24-27 curl
    E = [(0, 1), (1, 2), (2, 3), (2, 4), (4, 5), (5, 6), (6, 7), (2, 8), (8, 9), (9, 10), (10, 11),
         (0, 12), (12, 13), (13, 14), (14, 15), (0, 16), (16, 17), (17, 18), (18, 19),
         (0, 20), (20, 21), (21, 22), (22, 23), (23, 24), (24, 25), (25, 26), (26, 27)]
    Rr = [0.16, 0.17, 0.2, 0.07, 0.085, 0.07, 0.06, 0.055, 0.085, 0.07, 0.06, 0.055,
          0.1, 0.075, 0.055, 0.05, 0.1, 0.075, 0.055, 0.05,
          0.045, 0.04, 0.036, 0.032, 0.028, 0.024, 0.02, 0.016]
    body = skin_body('Body', V, E, [(r, r) for r in Rr], M['fur']); objs.append(body)

    # --- head: skull + dark cap fur + pale face mask + muzzle + brow + eyes + ears
    H = Vector((0.1, 0, 1.58))
    objs.append(sphere(H, (0.16, 0.145, 0.155), M['cap']))                       # skull / cap
    objs.append(sphere(H + Vector((0.055, 0, -0.02)), (0.115, 0.125, 0.13), M['skin']))  # face mask
    objs.append(sphere(H + Vector((0.035, 0, 0.075)), (0.13, 0.135, 0.085), M['cap']))   # cap fur over forehead
    for s in (-1, 1):                                                             # cheek fur tufts
        objs.append(sphere(H + Vector((0.02, s * 0.12, -0.05)), (0.07, 0.05, 0.08), M['fur'], rot=(0, 0.3, 0)))
    objs.append(sphere(H + Vector((0.135, 0, 0.022)), (0.04, 0.1, 0.022), M['skin'], rot=(0, 0.2, 0)))  # brow ridge
    objs.append(sphere(H + Vector((0.15, 0, -0.07)), (0.06, 0.075, 0.055), M['skin']))  # muzzle
    objs.append(sphere(H + Vector((0.17, 0, -0.04)), (0.03, 0.03, 0.025), M['skin']))   # nose pad
    for s in (-1, 1):
        objs.append(sphere(H + Vector((0.198, s * 0.012, -0.045)), (0.008, 0.007, 0.006), M['eye'], 8, 6))  # nostril
        objs.append(sphere(H + Vector((0.148, s * 0.045, -0.002)), (0.022, 0.024, 0.018), M['eye'], 12, 8))  # eye
        objs.append(sphere(H + Vector((0.158, s * 0.05, 0.004)), (0.006, 0.006, 0.006), mat('EyeHi', None, (0.9, 0.85, 0.75), rough=0.1), 6, 4))
        objs.append(sphere(H + Vector((-0.005, s * 0.15, 0.0)), (0.035, 0.018, 0.05), M['skin']))  # ear
        objs.append(sphere(H + Vector((-0.0, s * 0.157, 0.0)), (0.022, 0.01, 0.033), M['cap']))   # inner ear shade
    objs.append(sphere(H + Vector((0.17, 0, -0.1)), (0.035, 0.05, 0.012), mat('Lip', None, (0.25, 0.17, 0.13), rough=0.6)))  # mouth
    for i, (dx, dy) in enumerate([(-0.02, 0), (0.03, 0.05), (0.03, -0.05), (-0.06, 0.06), (-0.06, -0.06)]):  # hair tufts
        t = cyl(H + Vector((dx, dy, 0.15)), 0.03, 0.07, M['cap'], 8, (0, -0.5 - 0.1 * i, dy * 4), r2=0.0); objs.append(t)

    # --- gorget + cuirass (plate, gold trim) + sun emblem
    objs.append(cyl((0.05, 0, 1.42), 0.12, 0.08, M['metal'], 20, r2=0.095))
    objs.append(torus((0.05, 0, 1.46), 0.1, 0.012, M['gold']))
    cu = sphere((0.05, 0, 1.18), (0.21, 0.24, 0.27), M['metal'], 24, 16); objs.append(cu)
    objs.append(torus((0.05, 0, 1.0), 0.162, 0.014, M['gold'], scale=(1.0, 1.13, 1)))
    # sternum ridge + gold center line
    # sun emblem
    S = Vector((0.252, 0, 1.24))
    objs.append(sphere(S, (0.02, 0.04, 0.04), M['sun'], 16, 10))
    objs.append(torus(S + Vector((0.003, 0, 0)), 0.042, 0.008, M['gold'], rot=(0, math.pi / 2, 0)))
    for k in range(12):
        a = k / 12 * math.tau; L = 0.09 if k % 2 == 0 else 0.06
        dvec = Vector((0, math.cos(a), math.sin(a)))
        q = S + dvec * (L * 0.5 + 0.03)
        yy, zz = q.y / 0.24, (q.z - 1.18) / 0.27; q.x = 0.05 + 0.21 * math.sqrt(max(0, 1 - yy * yy - zz * zz)) + 0.004
        ray = cyl(q, 0.016, L, M['gold'], 4, (0, 0, 0), r2=0.0, scale=(0.35, 1, 1))
        ray.rotation_mode = 'QUATERNION'; ray.rotation_quaternion = dvec.to_track_quat('Z', 'X'); objs.append(ray)
    # --- belt (leather) + gold buckle + tassets
    objs.append(torus((0.04, 0, 0.93), 0.19, 0.03, M['leather'], scale=(1, 1.15, 0.8)))
    objs.append(box((0.24, 0, 0.93), (0.025, 0.08, 0.06), M['gold'], bev=0.008))
    objs.append(box((0.252, 0, 0.93), (0.01, 0.05, 0.03), M['dark'], bev=0.004))
    for s, a in ((-1, -0.55), (0, 0.0), (1, 0.55)):
        y = s * 0.13; x = 0.17 if s else 0.2
        for j in range(2):
            t = shell((x - 0.005 * j, y, 0.86 - j * 0.07), (0.03, 0.1 if s else 0.12, 0.075), M['metal'], rot=(0, 0.15, a), cut=-0.1, thick=0.01, keep='top', band=0.35)
            objs.append(t)
    # back plate skirt
    objs.append(shell((-0.08, 0, 0.86), (0.12, 0.2, 0.08), M['metal'], rot=(0, -0.3, 0), cut=-0.1, thick=0.012))

    # --- pauldrons: 3 stacked lames + gold rims, big like the sprite
    for s in (-1, 1):
        sh = Vector((0.0, s * 0.27, 1.34))
        for j in range(3):
            p = shell(sh + Vector((0.0, s * 0.03 * j, -0.06 * j)), (0.16 - 0.01 * j, 0.15, 0.12), M['metal'],
                      rot=(s * (0.45 + 0.2 * j), 0, 0), cut=-0.05 + 0.05 * j, thick=0.03, seg=18, band=0.4)
            objs.append(p)
        objs.append(sphere(sh + Vector((0.0, s * 0.03, 0.105)), (0.02, 0.02, 0.02), M['gold'], 10, 6))  # rivet
    # --- arms: rerebrace, couter, vambrace + launcher, gauntlet fist
    arms = {1: [V[4], V[5], V[6], V[7]], -1: [V[8], V[9], V[10], V[11]]}
    for s, (sh, el, wr, ha) in arms.items():
        sh, el, wr, ha = map(Vector, (sh, el, wr, ha))
        up = (el - sh); rot = up.normalized().to_track_quat('Z', 'Y').to_euler()
        objs.append(cyl(sh + up * 0.55, 0.085, up.length * 0.6, M['metal'], 12, rot, r2=0.075))
        objs.append(sphere(el, (0.08, 0.08, 0.08), M['metal'], 12, 10))
        objs.append(torus(el, 0.075, 0.01, M['gold'], rot=rot))
        fo = (wr - el); rf = fo.normalized().to_track_quat('Z', 'Y').to_euler()
        objs.append(cyl(el + fo * 0.5, 0.08, fo.length * 0.95, M['metal'], 12, rf, r2=0.068))
        for t in (0.15, 0.85):
            objs.append(torus(el + fo * t, 0.077 - 0.01 * t, 0.011, M['gold'], rot=rf))
        out_side = Vector((0, s, 0))
        objs += launcher(el + fo * 0.55 + out_side * 0.08, fo, Vector((0, 0, 1)).cross(fo).normalized() * s, M, n=3, length=fo.length * 0.9)
        # gauntlet fist with knuckle plates and fingers
        objs.append(sphere(ha + fo.normalized() * 0.03, (0.06, 0.055, 0.065), M['metal'], 14, 10))
        for f in range(4):
            fz = (f - 1.5) * 0.026
            objs.append(cyl(ha + fo.normalized() * 0.075 + Vector((0, 0, fz)) + Vector((0, -s * 0.01, 0)), 0.014, 0.05, M['dark'], 8, (0, math.pi / 2, 0.0)))
        objs.append(cyl(ha + fo.normalized() * 0.06 + Vector((0, s * 0.045, 0.02)), 0.014, 0.05, M['dark'], 8, (math.pi / 2, 0, 0)))  # thumb
        objs.append(torus(ha, 0.062, 0.01, M['gold'], rot=rf))
    # --- legs: cuisse, knee cop w/ gold, greave, bare fur feet w/ toes
    legs = {1: [V[12], V[13], V[14], V[15]], -1: [V[16], V[17], V[18], V[19]]}
    for s, (hp, kn, an, ft) in legs.items():
        hp, kn, an, ft = map(Vector, (hp, kn, an, ft))
        th = kn - hp; rt = th.normalized().to_track_quat('Z', 'Y').to_euler()
        objs.append(cyl(hp + th * 0.5, 0.105, th.length * 0.75, M['metal'], 12, rt, r2=0.085))
        objs.append(torus(hp + th * 0.82, 0.088, 0.01, M['gold'], rot=rt))
        objs.append(shell(kn + Vector((0.05, 0, 0)), (0.06, 0.08, 0.08), M['metal'], rot=(0, math.pi / 2, 0), cut=-0.2, thick=0.015))
        objs.append(sphere(kn + Vector((0.115, 0, 0)), (0.015, 0.015, 0.015), M['gold'], 8, 6))
        sn = an - kn; rs = sn.normalized().to_track_quat('Z', 'Y').to_euler()
        objs.append(cyl(kn + sn * 0.5, 0.08, sn.length * 0.75, M['metal'], 12, rs, r2=0.068))
        objs.append(torus(kn + sn * 0.85, 0.07, 0.01, M['gold'], rot=rs))
        objs.append(sphere(ft + Vector((0.02, 0, 0.01)), (0.12, 0.065, 0.04), M['foot']))
        for k in range(4):
            objs.append(sphere(ft + Vector((0.13, (k - 1.5) * 0.03, -0.005)), (0.035, 0.014, 0.02), M['foot'], 10, 6))
        objs.append(sphere(ft + Vector((0.05, s * 0.07, 0.0)), (0.04, 0.016, 0.02), M['foot'], 10, 6, rot=(0, 0, s * 0.8)))
    return finalize(objs, 'tower_dart')

# ----------------------------------------------------------------- FP VIEWMODEL GUN (armored forearm + wrist launcher)
def build_gun():
    reset(); M = materials(); objs = []
    d = Vector((1, 0, 0))
    # forearm vambrace from elbow (x=-0.32) to wrist (x=0.08)
    objs.append(cyl((-0.12, 0, -0.07), 0.065, 0.4, M['metal'], 20, (0, math.pi / 2, 0), r2=0.055))
    for x in (-0.28, -0.12, 0.05):
        objs.append(torus((x, 0, -0.07), 0.063 - 0.02 * (x + 0.28), 0.009, M['gold'], rot=(0, math.pi / 2, 0)))
    objs.append(box((-0.12, 0, -0.005), (0.3, 0.012, 0.012), M['gold'], bev=0.004))  # ridge
    # gauntlet fist (gripping)
    objs.append(sphere((0.12, 0, -0.08), (0.06, 0.055, 0.06), M['metal'], 12, 10))
    for f in range(4):
        objs.append(cyl((0.165, (f - 1.5) * 0.024, -0.105), 0.013, 0.045, M['dark'], 8, (math.pi / 2, 0, 0), scale=(1, 1, 1)))
    objs.append(box((0.15, 0, -0.06), (0.05, 0.1, 0.02), M['metal'], bev=0.006))  # knuckle plate
    objs.append(box((0.165, 0, -0.06), (0.01, 0.09, 0.008), M['gold'], bev=0.002))
    # launcher bundle on top of forearm
    objs += launcher(Vector((-0.04, 0, 0.0)), d, Vector((0, 1, 0)), M, n=3, length=0.3)
    # cocking lever + small trigger cable
    objs.append(box((-0.2, 0.05, 0.02), (0.06, 0.008, 0.03), M['dark'], bev=0.004))
    objs.append(sphere((-0.2, 0.058, 0.035), (0.012, 0.012, 0.012), M['gold'], 8, 6))
    # sun stud on top (matches chest emblem)
    objs.append(sphere((-0.24, 0, 0.0), (0.015, 0.02, 0.02), M['sun'], 10, 6))
    return finalize(objs, 'gun_dart')

def export(name):
    out = os.path.join(REPO, 'public', 'assets', 'glb', name + '.glb')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_image_format='JPEG', export_jpeg_quality=82,
                              export_apply=True, export_yup=True, use_selection=False)
    ob = bpy.data.objects[name]
    print('EXPORTED', out, 'tris', sum(len(p.vertices) - 2 for p in ob.data.polygons), os.path.getsize(out))
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(R, name + '.blend'))

if which in ('hero', 'both'): build_hero(); export('tower_dart')
if which in ('gun', 'both'): build_gun(); export('gun_dart')
