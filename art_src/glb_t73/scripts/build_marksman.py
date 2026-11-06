"""t73: Marksman Scout (max tier, matches public/assets/v3/sniper_monkey_2.webp) hero + FP scoped rifle.
Blender 4.3:  blender -b -P art_src/glb_t73/scripts/build_marksman.py -- <hero|gun|both>
Hand-modelled (t72 pipeline helpers), all original. Faces +X, Z-up (glTF Y-up on export)."""
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
        suit=mat('PaddedSuit', 'suit', rough=0.85), plate2=mat('TacPlate', 'plate', metal=0.45, rough=0.42),
        bronze=mat('Bronze', 'bronze', metal=0.65, rough=0.35), gun=mat('Gunmetal', 'gunmetal', metal=0.6, rough=0.4),
        lens=mat('RedLens', None, (0.8, 0.08, 0.05), rough=0.1, emit=(1.0, 0.1, 0.05), emit_str=3.0),
        laser=mat('Laser', None, (1.0, 0.2, 0.15), rough=0.5, emit=(1.0, 0.15, 0.1), emit_str=4.0),
        fur=mat('Fur', 'fur_body', rough=0.95),
        cap=mat('FurCap', 'fur_cap', rough=0.95),
        foot=mat('FurFoot', 'fur_foot', rough=0.9), skin=mat('Skin', 'skin', rough=0.75),
        metal=None, gold=mat('GoldTrim', 'bronze', metal=0.65, rough=0.35),
        leather=mat('Leather', 'leather', rough=0.8), wood=None,
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


def rifle(M, o, scale=1.0, laser=True):
    """long black marksman rifle along +X from origin o (o = butt of stock). Scope with red lens, red muzzle ring, laser."""
    o = Vector(o); s = scale; out = []
    X = (0, math.pi / 2, 0)
    def P(x, y=0, z=0): return o + Vector((x, y, z)) * s
    out.append(box(P(0.07, 0, -0.01), (0.14 * s, 0.035 * s, 0.09 * s), M['gun'], bev=0.01 * s))          # stock
    out.append(box(P(0.03, 0, -0.01), (0.02 * s, 0.04 * s, 0.1 * s), M['leather'], bev=0.004 * s))       # butt pad
    out.append(box(P(0.17, 0, 0.0), (0.1 * s, 0.03 * s, 0.05 * s), M['gun'], rot=(0, -0.2, 0), bev=0.006 * s))  # wrist
    out.append(box(P(0.32, 0, 0.01), (0.22 * s, 0.045 * s, 0.07 * s), M['gun'], bev=0.01 * s))           # receiver
    out.append(box(P(0.3, 0, -0.06), (0.05 * s, 0.03 * s, 0.09 * s), M['gun'], rot=(0, 0.25, 0), bev=0.006 * s))  # mag
    out.append(box(P(0.22, 0, -0.06), (0.03 * s, 0.025 * s, 0.07 * s), M['gun'], rot=(0, -0.3, 0), bev=0.005 * s))  # grip
    out.append(torus(P(0.25, 0, -0.04), 0.022 * s, 0.004 * s, M['dark'], rot=(math.pi / 2, 0, 0)))       # trigger guard
    out.append(box(P(0.56, 0, 0.01), (0.28 * s, 0.05 * s, 0.06 * s), M['gun'], bev=0.012 * s))           # handguard
    for k in range(5):
        out.append(box(P(0.45 + k * 0.05, 0, 0.045), (0.02 * s, 0.04 * s, 0.008 * s), M['dark'], bev=0.0))  # rail teeth
    out.append(cyl(P(0.86, 0, 0.015), 0.013 * s, 0.34 * s, M['gun'], 12, X))                            # barrel
    out.append(cyl(P(1.04, 0, 0.015), 0.024 * s, 0.07 * s, M['dark'], 12, X))                           # brake
    out.append(torus(P(1.075, 0, 0.015), 0.02 * s, 0.006 * s, M['lens'], rot=X))                         # red muzzle ring
    out.append(cyl(P(1.076, 0, 0.015), 0.012 * s, 0.006 * s, M['lens'], 12, X))
    out.append(box(P(0.4, 0, 0.065), (0.06 * s, 0.03 * s, 0.03 * s), M['gun'], bev=0.004 * s))           # scope mount
    out.append(box(P(0.52, 0, 0.065), (0.04 * s, 0.03 * s, 0.03 * s), M['gun'], bev=0.004 * s))
    out.append(cyl(P(0.46, 0, 0.105), 0.03 * s, 0.24 * s, M['gun'], 16, X))                              # scope tube
    out.append(cyl(P(0.6, 0, 0.105), 0.03 * s, 0.06 * s, M['gun'], 16, X, r2=0.045 * s))                # objective bell
    out.append(cyl(P(0.64, 0, 0.105), 0.042 * s, 0.01 * s, M['lens'], 16, X))                           # red lens
    out.append(cyl(P(0.33, 0, 0.105), 0.036 * s, 0.03 * s, M['gun'], 16, X))                             # eyepiece
    out.append(cyl(P(0.46, 0, 0.145), 0.014 * s, 0.03 * s, M['dark'], 10))                               # turret
    out.append(cyl(P(0.46, 0.035, 0.105), 0.013 * s, 0.03 * s, M['dark'], 10, (math.pi / 2, 0, 0)))
    for x in (0.4, 0.52): out.append(torus(P(x, 0, 0.105), 0.032 * s, 0.004 * s, M['gold'], rot=X))     # bronze rings
    if laser:
        out.append(cyl(P(1.2, 0, 0.015), 0.004 * s, 0.24 * s, M['laser'], 6, X, r2=0.0005 * s))           # laser beam
    return out

def head(M, H, objs, tilt=0.0):
    EyeHi = mat('EyeHi', None, (0.9, 0.85, 0.75), rough=0.1); Lip = mat('Lip', None, (0.25, 0.17, 0.13), rough=0.6)
    objs.append(sphere(H, (0.16, 0.145, 0.155), M['cap']))
    objs.append(sphere(H + Vector((0.055, 0, -0.02)), (0.115, 0.125, 0.13), M['skin']))
    objs.append(sphere(H + Vector((0.035, 0, 0.075)), (0.13, 0.135, 0.085), M['cap']))
    for s in (-1, 1):
        objs.append(sphere(H + Vector((0.02, s * 0.12, -0.05)), (0.07, 0.05, 0.08), M['fur'], rot=(0, 0.3, 0)))
    objs.append(sphere(H + Vector((0.135, 0, 0.022)), (0.04, 0.1, 0.022), M['skin'], rot=(0, 0.2, 0)))
    objs.append(sphere(H + Vector((0.15, 0, -0.07)), (0.06, 0.075, 0.055), M['skin']))
    objs.append(sphere(H + Vector((0.17, 0, -0.04)), (0.03, 0.03, 0.025), M['skin']))
    for s in (-1, 1):
        objs.append(sphere(H + Vector((0.198, s * 0.012, -0.045)), (0.008, 0.007, 0.006), M['eye'], 8, 6))
        objs.append(sphere(H + Vector((0.148, s * 0.045, -0.002)), (0.022, 0.024, 0.016 if s < 0 else 0.008), M['eye'], 12, 8))  # left eye squints (aiming)
        objs.append(sphere(H + Vector((0.158, s * 0.05, 0.004)), (0.006, 0.006, 0.006), EyeHi, 6, 4))
        objs.append(sphere(H + Vector((-0.005, s * 0.15, 0.0)), (0.035, 0.018, 0.05), M['skin']))
        objs.append(sphere(H + Vector((0.0, s * 0.157, 0.0)), (0.022, 0.01, 0.033), M['cap']))
    objs.append(sphere(H + Vector((0.17, 0, -0.1)), (0.035, 0.05, 0.012), Lip))
    for i, (dx, dy) in enumerate([(-0.02, 0), (0.03, 0.05), (0.03, -0.05), (-0.06, 0.06), (-0.06, -0.06)]):
        objs.append(cyl(H + Vector((dx, dy, 0.15)), 0.03, 0.07, M['cap'], 8, (0, -0.5 - 0.1 * i, dy * 4), r2=0.0))

def limb_pad(objs, a, b, r0, r1, m, t0=0.1, t1=0.9, trims=(), M=None):
    a, b = Vector(a), Vector(b); d = b - a; rot = d.normalized().to_track_quat('Z', 'Y').to_euler()
    objs.append(cyl(a + d * (t0 + t1) / 2, r0, d.length * (t1 - t0), m, 12, rot, r2=r1))
    for t in trims: objs.append(torus(a + d * t, (r0 + (r1 - r0) * t) * 1.02, 0.008, M['gold'], rot=rot))
    return rot

# ----------------------------------------------------------------- HERO (crouched, rifle shouldered, aiming +X)
def build_hero():
    reset(); M = materials(); objs = []
    V = [(0, 0, 0.62),                                   # 0 pelvis
         (0.04, 0, 0.86), (0.07, 0, 1.06), (0.12, 0, 1.2),  # 1 belly 2 chest 3 neck
         (0.04, 0.23, 1.12), (0.22, 0.24, 0.98), (0.42, 0.06, 1.04), (0.47, 0.03, 1.04),   # 4-7 L (support) arm under handguard
         (0.04, -0.23, 1.12), (0.0, -0.3, 0.92), (0.2, -0.12, 1.0), (0.25, -0.06, 1.02),   # 8-11 R (trigger) arm
         (0.0, 0.13, 0.58), (0.36, 0.2, 0.56), (0.3, 0.22, 0.12), (0.4, 0.22, 0.04),       # 12-15 L leg forward, knee up
         (0.0, -0.13, 0.58), (-0.1, -0.24, 0.22), (-0.3, -0.24, 0.12), (-0.2, -0.24, 0.03),  # 16-19 R leg back, deep crouch
         (-0.14, 0, 0.6), (-0.36, 0.06, 0.5), (-0.52, 0.12, 0.34), (-0.6, 0.16, 0.16),
         (-0.54, 0.18, 0.02), (-0.42, 0.18, 0.0), (-0.36, 0.18, 0.1), (-0.42, 0.18, 0.17)]
    E = [(0, 1), (1, 2), (2, 3), (2, 4), (4, 5), (5, 6), (6, 7), (2, 8), (8, 9), (9, 10), (10, 11),
         (0, 12), (12, 13), (13, 14), (14, 15), (0, 16), (16, 17), (17, 18), (18, 19),
         (0, 20), (20, 21), (21, 22), (22, 23), (23, 24), (24, 25), (25, 26), (26, 27)]
    Rr = [0.17, 0.18, 0.2, 0.07, 0.09, 0.075, 0.06, 0.055, 0.09, 0.075, 0.06, 0.055,
          0.11, 0.085, 0.07, 0.06, 0.11, 0.085, 0.07, 0.06,
          0.045, 0.04, 0.036, 0.032, 0.028, 0.024, 0.02, 0.016]
    objs.append(skin_body('Body', V, E, [(r, r) for r in Rr], M['fur']))
    H = Vector((0.16, -0.02, 1.33))
    head(M, H, objs)
    # padded tactical suit torso + high armoured collar
    objs.append(sphere((0.06, 0, 0.98), (0.2, 0.23, 0.26), M['suit'], 20, 14))
    objs.append(shell((0.08, 0, 1.0), (0.2, 0.235, 0.24), M['plate2'], rot=(0, math.pi / 2 - 0.3, 0), cut=-0.15, thick=0.02, band=0.12))  # chest plate
    objs.append(cyl((0.09, 0, 1.2), 0.13, 0.1, M['plate2'], 18, r2=0.115))
    objs.append(torus((0.09, 0, 1.25), 0.115, 0.01, M['gold']))
    objs.append(shell((-0.02, 0, 1.18), (0.12, 0.16, 0.13), M['plate2'], rot=(0, -0.6, 0), cut=0.0, thick=0.02, band=0.15))  # back collar
    # chest rig pouches + belt
    for k, y in enumerate((-0.12, -0.04, 0.04, 0.12)):
        objs.append(box((0.24, y, 0.9), (0.04, 0.065, 0.08), M['leather'] if k % 2 else M['suit'], bev=0.012))
        objs.append(box((0.262, y, 0.935), (0.01, 0.06, 0.02), M['leather'], bev=0.004))
    objs.append(torus((0.04, 0, 0.74), 0.19, 0.03, M['leather'], scale=(1, 1.12, 0.8)))
    objs.append(box((0.235, 0, 0.74), (0.02, 0.06, 0.05), M['gold'], bev=0.006))
    for y in (-0.19, 0.19):
        objs.append(box((-0.02, y, 0.72), (0.08, 0.05, 0.1), M['leather'], bev=0.012))   # hip pouches
    objs.append(box((-0.15, 0.0, 0.9), (0.06, 0.2, 0.24), M['suit'], bev=0.03))           # back pack
    # left (support-side, +Y) big pauldron with bronze sun emblem — the sprite's signature
    sh = Vector((0.03, -0.25, 1.14))
    for j in range(2):
        objs.append(shell(sh + Vector((0, -0.02 * j, -0.06 * j)), (0.15 - 0.01 * j, 0.14, 0.12), M['plate2'],
                          rot=(-0.5 - 0.25 * j, 0, 0), cut=-0.1 + 0.05 * j, thick=0.025, band=0.25))
    E0 = sh + Vector((0.0, -0.115, 0.03))
    objs.append(cyl(E0, 0.035, 0.008, M['gold'], 16, (math.pi / 2 - 0.5, 0, 0)))
    for k in range(8):
        a = k / 8 * math.tau; dv = Vector((math.cos(a), 0, math.sin(a)))
        ray = cyl(E0 + dv * 0.04 + Vector((0, -0.004, 0)), 0.012, 0.04, M['gold'], 4, (0, 0, 0), r2=0.0, scale=(1, 0.35, 1))
        ray.rotation_mode = 'QUATERNION'; ray.rotation_quaternion = dv.to_track_quat('Z', 'Y'); objs.append(ray)
    objs.append(shell((0.03, 0.25, 1.13), (0.1, 0.1, 0.08), M['plate2'], rot=(0.5, 0, 0), cut=-0.1, thick=0.02, band=0.2))  # small R shoulder
    # arms: padded sleeves, bronze-trimmed bracers, gloves
    for s, (a, b, c, d) in ((1, V[4:8]), (-1, V[8:12])):
        limb_pad(objs, a, b, 0.095, 0.085, M['suit'], 0.15, 0.95)
        objs.append(sphere(b, (0.08, 0.08, 0.08), M['plate2'], 14, 10))
        limb_pad(objs, b, c, 0.082, 0.07, M['plate2'], 0.15, 0.9, trims=(0.2, 0.85), M=M)
        objs.append(sphere(Vector(d) + (Vector(d) - Vector(c)).normalized() * 0.02, (0.055, 0.05, 0.05), M['leather'], 14, 10))  # glove
    # legs: padded trousers, bronze-trimmed knee cops, armoured boots
    for s, (hp, kn, an, ft) in ((1, V[12:16]), (-1, V[16:20])):
        limb_pad(objs, hp, kn, 0.12, 0.1, M['suit'], 0.1, 0.95)
        kn = Vector(kn); th = (kn - Vector(hp)).normalized(); sn = (Vector(an) - kn).normalized()
        kd = (th - sn).normalized()  # knee points along bisector
        kp = shell(kn + kd * 0.06, (0.075, 0.09, 0.09), M['plate2'], cut=-0.2, thick=0.02, band=0.3)
        kp.rotation_mode = 'QUATERNION'; kp.rotation_quaternion = kd.to_track_quat('Z', 'Y'); objs.append(kp)
        limb_pad(objs, kn, an, 0.095, 0.085, M['plate2'], 0.15, 1.0, trims=(0.3,), M=M)
        ft = Vector(ft)
        objs.append(box(ft + Vector((0.04, 0, 0.035)), (0.22, 0.12, 0.08), M['plate2'], bev=0.03))   # boot
        objs.append(box(ft + Vector((0.04, 0, -0.005)), (0.23, 0.125, 0.02), M['leather'], bev=0.006))  # sole
        objs.append(box(ft + Vector((0.04, 0, 0.078)), (0.2, 0.127, 0.006), M['gold'], bev=0.002))  # bronze boot strap
    # rifle shouldered: butt at right shoulder, barrel along +X under the cheek
    objs += rifle(M, (-0.02, -0.1, 1.05), 1.15)
    return finalize(objs, 'tower_sniper')

# ----------------------------------------------------------------- FP VIEWMODEL (rifle + gloved hands + sleeve)
def build_gun():
    reset(); M = materials(); objs = []
    objs += rifle(M, (-0.35, 0, 0), 0.75, laser=False)
    # trigger hand on grip + support hand under handguard (padded sleeves, bronze cuffs)
    for (p, q) in (((-0.18, 0, -0.06), (-0.4, 0.06, -0.2)), ((0.08, 0, -0.04), (-0.08, -0.08, -0.22))):
        p, q = Vector(p), Vector(q)
        objs.append(sphere(p, (0.05, 0.045, 0.045), M['leather'], 14, 10))
        for f in range(3):
            objs.append(cyl(p + Vector((0.01 + f * 0.018, 0.03, -0.01)), 0.01, 0.04, M['leather'], 8, (math.pi / 2, 0, 0)))
        d = p - q; rot = d.normalized().to_track_quat('Z', 'Y').to_euler()
        objs.append(cyl(q + d * 0.4, 0.05, d.length * 0.8, M['suit'], 12, rot, r2=0.045))
        objs.append(torus(q + d * 0.78, 0.047, 0.007, M['gold'], rot=rot))
    ob = finalize(objs, 'gun_sniper')
    # Possess rotates GLB guns by -90deg about Y, which maps glTF +X to +Z (toward the camera); author the muzzle on -X so it points downrange.
    ob.rotation_euler.z = math.pi; ob.location = (-0.12, 0, -0.05); bpy.ops.object.transform_apply(location=True, rotation=True)
    return ob

def export(name):
    out = os.path.join(REPO, 'public', 'assets', 'glb', name + '.glb')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_image_format='JPEG', export_jpeg_quality=82,
                              export_apply=True, export_yup=True, use_selection=False)
    ob = bpy.data.objects[name]
    print('EXPORTED', out, 'tris', sum(len(p.vertices) - 2 for p in ob.data.polygons), os.path.getsize(out))
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(R, name + '.blend'))

if which in ('hero', 'both'): build_hero(); export('tower_sniper')
if which in ('gun', 'both'): build_gun(); export('gun_sniper')
