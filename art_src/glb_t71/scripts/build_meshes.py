"""t71: Build painterly-matched GLB meshes in Blender from v3 sprites. No AI dumps."""
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix

ROOT = os.environ.get('BOF_ROOT', '/workspace/bloons-frontier')
TEX = os.path.join(ROOT, 'art_src/glb_t71/tex')
OUT = os.path.join(ROOT, 'public/assets/glb')
os.makedirs(OUT, exist_ok=True)

def reset():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for b in list(bpy.data.meshes): bpy.data.meshes.remove(b)
    for b in list(bpy.data.materials): bpy.data.materials.remove(b)
    for b in list(bpy.data.images):
        try: bpy.data.images.remove(b)
        except: pass

def mat_image(name, path, metal=0.0, rough=0.55, emission=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial'); out.location = (400, 0)
    bsdf = nt.nodes.new('ShaderNodeBsdfPrincipled'); bsdf.location = (100, 0)
    nt.links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    if path and os.path.exists(path):
        img = bpy.data.images.load(path)
        img.colorspace_settings.name = 'sRGB'
        tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = img; tex.location = (-300, 0)
        nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
        if img.channels == 4 or (img.depth and img.depth >= 32):
            # keep alpha as transmission-ish only if needed; opaque for game
            pass
    else:
        bsdf.inputs['Base Color'].default_value = (0.8, 0.2, 0.2, 1)
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = rough
    if 'Emission Strength' in bsdf.inputs:
        bsdf.inputs['Emission Strength'].default_value = emission
    return m

def mat_color(name, rgba, metal=0.0, rough=0.6):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = rgba
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = rough
    return m

def join_selected(name):
    bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active
    ob.name = name
    return ob

def apply_all(ob):
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

def smart_uv(ob):
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')

def project_from_view_front(ob):
    """Cylinder-ish unwrap then scale UVs to fill 0..1 for sprite projection feel."""
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.cylinder_project(direction='VIEW_ON_EQUATOR', align='POLAR_ZX', scale_to_bounds=True)
    bpy.ops.object.mode_set(mode='OBJECT')

def export_glb(path):
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_materials='EXPORT',
        export_image_format='AUTO',
        export_yup=True,
    )
    print('exported', path, 'size', os.path.getsize(path))

def make_bloon(kind):
    """Unique balloon mesh: teardrop body + knot + highlight ridge. Lead/ceramic special."""
    reset()
    tex = os.path.join(TEX, f'bloon_{kind}.png')
    # Body
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=0.55, location=(0, 0, 0.62))
    body = bpy.context.active_object
    body.name = f'bloon_{kind}_body'
    # Shape into balloon: squash XZ near top, taper bottom
    bpy.ops.object.mode_set(mode='EDIT')
    bm = bmesh.from_edit_mesh(body.data)
    for v in bm.verts:
        x, y, z = v.co
        # teardrop: lower hemisphere taper toward knot
        t = (z - 0.0) / 1.1
        if z < 0.35:
            k = max(0.15, (z + 0.05) / 0.4)
            v.co.x *= k; v.co.y *= k
        # slight vertical squash of classic bloon
        v.co.z *= 1.12
        # upper highlight bulge
        if z > 0.7:
            v.co.x *= 1.02; v.co.y *= 1.02
    bmesh.update_edit_mesh(body.data)
    bpy.ops.object.mode_set(mode='OBJECT')

    # Knot (twisted tip)
    bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.09, radius2=0.02, depth=0.18, location=(0, 0, 0.02))
    knot = bpy.context.active_object; knot.name = 'knot'
    bpy.ops.mesh.primitive_torus_add(major_radius=0.07, minor_radius=0.025, major_segments=12, minor_segments=8, location=(0, 0, 0.08))
    ring = bpy.context.active_object; ring.name = 'knot_ring'

    # Lead: panel ridges via inset cubes as straps
    extras = []
    if kind == 'lead':
        for ang in range(0, 360, 60):
            bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.65))
            strap = bpy.context.active_object
            strap.scale = (0.03, 0.58, 0.55)
            strap.rotation_euler[2] = math.radians(ang)
            extras.append(strap)
        # top cap
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.22, depth=0.06, location=(0, 0, 1.18))
        extras.append(bpy.context.active_object)
    elif kind == 'ceramic':
        # slightly faceted look: decimate-ish via remesh? just add rim band
        bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.035, major_segments=16, minor_segments=6, location=(0, 0, 0.55))
        extras.append(bpy.context.active_object)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.38, minor_radius=0.03, major_segments=16, minor_segments=6, location=(0, 0, 0.85))
        extras.append(bpy.context.active_object)

    # Materials
    if kind == 'lead':
        m = mat_image(f'm_{kind}', tex, metal=0.85, rough=0.35)
    elif kind == 'ceramic':
        m = mat_image(f'm_{kind}', tex, metal=0.05, rough=0.82)
    else:
        m = mat_image(f'm_{kind}', tex, metal=0.0, rough=0.42)

    objs = [body, knot, ring] + extras
    for o in objs:
        if o.data.materials: o.data.materials[0] = m
        else: o.data.materials.append(m)
        o.select_set(True)
    bpy.context.view_layer.objects.active = body
    join_selected(f'bloon_{kind}')
    ob = bpy.context.active_object
    # Center base at origin, normalize height ~1.3m
    apply_all(ob)
    # Move so bottom of knot sits near y=0 in Blender Z-up; glTF will yup
    mn = Vector(ob.bound_box[0]); mx = Vector(ob.bound_box[6])
    # compute real bounds
    bbox = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    min_z = min(v.z for v in bbox); max_z = max(v.z for v in bbox)
    h = max(0.01, max_z - min_z)
    ob.location.z -= min_z
    scale = 1.25 / h
    ob.scale = (scale, scale, scale)
    apply_all(ob)
    smart_uv(ob)
    # Re-assign image after UV (smart project) — material already linked
    export_glb(os.path.join(OUT, f'bloon_{kind}.glb'))

def make_scavenger():
    reset()
    tex = os.path.join(TEX, 'bug_scavenger.png')
    m = mat_image('m_scav', tex, metal=0.1, rough=0.7)
    # Segmented body
    parts = []
    for i, (z, sx, sy, sz) in enumerate([
        (0.35, 0.55, 0.35, 0.28),  # abdomen
        (0.55, 0.45, 0.32, 0.25),  # thorax
        (0.72, 0.28, 0.28, 0.22),  # head
    ]):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=1, location=(0, 0, z))
        o = bpy.context.active_object; o.scale = (sx, sy, sz); parts.append(o)
    # Mandibles
    for s in (-1, 1):
        bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.06, radius2=0.01, depth=0.22, location=(0.28, s * 0.1, 0.72))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(80), s * math.radians(25)); parts.append(o)
    # 6 legs
    for i in range(6):
        side = 1 if i < 3 else -1
        x = -0.15 + (i % 3) * 0.18
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.035, depth=0.55, location=(x, side * 0.35, 0.28))
        o = bpy.context.active_object
        o.rotation_euler = (side * math.radians(55), 0, side * math.radians(10 + (i % 3) * 8))
        parts.append(o)
    for o in parts:
        o.data.materials.append(m); o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    join_selected('bug_scavenger')
    ob = bpy.context.active_object
    apply_all(ob)
    bbox = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    min_z = min(v.z for v in bbox); max_z = max(v.z for v in bbox)
    ob.location.z -= min_z
    h = max(0.01, max_z - min_z)
    ob.scale = ((1.1 / h),) * 3
    apply_all(ob)
    smart_uv(ob)
    export_glb(os.path.join(OUT, 'bug_scavenger.glb'))

def monkey(name, colors, weapon='dart', hat=None):
    """Low-poly primate tower hero. colors: dict of part->rgba."""
    reset()
    parts = []
    def add_mat(o, key, metal=0.0, rough=0.65):
        c = colors.get(key, (0.55, 0.35, 0.2, 1))
        m = mat_color(f'{name}_{key}_{len(parts)}', c, metal=metal, rough=rough)
        if o.data.materials: o.data.materials[0] = m
        else: o.data.materials.append(m)
    # Legs
    for s in (-1, 1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(s * 0.12, 0.02, 0.28))
        o = bpy.context.active_object; o.scale = (0.1, 0.14, 0.28); add_mat(o, 'fur'); parts.append(o)
    # Body
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.7))
    o = bpy.context.active_object; o.scale = (0.28, 0.2, 0.32); add_mat(o, 'cloth'); parts.append(o)
    # Head
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.22, location=(0, 0.02, 1.08))
    o = bpy.context.active_object; add_mat(o, 'fur'); parts.append(o)
    # Muzzle
    bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=6, radius=0.12, location=(0, 0.16, 1.0))
    o = bpy.context.active_object; o.scale = (0.9, 0.7, 0.7); add_mat(o, 'skin'); parts.append(o)
    # Ears
    for s in (-1, 1):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=0.08, location=(s * 0.2, 0.0, 1.1))
        o = bpy.context.active_object; o.scale = (0.5, 0.35, 0.7); add_mat(o, 'fur'); parts.append(o)
    # Arms
    for s in (-1, 1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(s * 0.34, 0.05, 0.75))
        o = bpy.context.active_object; o.scale = (0.08, 0.1, 0.26); add_mat(o, 'fur'); parts.append(o)
    # Tail
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.035, depth=0.55, location=(-0.05, -0.28, 0.55))
    o = bpy.context.active_object; o.rotation_euler = (math.radians(70), 0, math.radians(-20)); add_mat(o, 'fur'); parts.append(o)
    # Hat / gear
    if hat == 'hood':
        bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=6, radius=0.24, location=(0, -0.02, 1.12))
        o = bpy.context.active_object; o.scale = (1.05, 1.1, 0.7); add_mat(o, 'hood'); parts.append(o)
    elif hat == 'wizard':
        bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.22, radius2=0.01, depth=0.45, location=(0, 0, 1.4))
        o = bpy.context.active_object; add_mat(o, 'hat'); parts.append(o)
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.24, depth=0.04, location=(0, 0, 1.18))
        o = bpy.context.active_object; add_mat(o, 'hat'); parts.append(o)
    elif hat == 'helmet':
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=6, radius=0.24, location=(0, 0, 1.14))
        o = bpy.context.active_object; o.scale = (1.05, 1.05, 0.7); add_mat(o, 'helmet', metal=0.4, rough=0.4); parts.append(o)
    elif hat == 'visor':
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=6, radius=0.25, location=(0, 0, 1.14))
        o = bpy.context.active_object; o.scale = (1.05, 1.05, 0.75); add_mat(o, 'helmet', metal=0.5, rough=0.35); parts.append(o)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.18, 1.08))
        o = bpy.context.active_object; o.scale = (0.18, 0.04, 0.06); add_mat(o, 'visor', metal=0.2, rough=0.2); parts.append(o)

    # Weapon
    if weapon == 'dart':
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.03, depth=0.55, location=(0.42, 0.25, 0.85))
        o = bpy.context.active_object; o.rotation_euler = (math.radians(90), 0, math.radians(15)); add_mat(o, 'weapon', metal=0.2, rough=0.5); parts.append(o)
        bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.04, radius2=0.0, depth=0.12, location=(0.48, 0.52, 0.85))
        o = bpy.context.active_object; o.rotation_euler = (math.radians(90), 0, math.radians(15)); add_mat(o, 'weapon'); parts.append(o)
    elif weapon == 'shuriken':
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.12, depth=0.03, location=(0.45, 0.3, 0.85))
        o = bpy.context.active_object; o.rotation_euler = (math.radians(90), 0, 0); add_mat(o, 'weapon', metal=0.7, rough=0.3); parts.append(o)
    elif weapon == 'staff':
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.035, depth=0.9, location=(0.4, 0.2, 0.85))
        o = bpy.context.active_object; add_mat(o, 'weapon'); parts.append(o)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, location=(0.4, 0.2, 1.35))
        o = bpy.context.active_object; add_mat(o, 'crystal', metal=0.1, rough=0.25); parts.append(o)
    elif weapon == 'sniper':
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.04, depth=0.85, location=(0.4, 0.35, 0.9))
        o = bpy.context.active_object; o.rotation_euler = (math.radians(90), 0, math.radians(10)); add_mat(o, 'weapon', metal=0.55, rough=0.35); parts.append(o)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0.38, 0.15, 0.95))
        o = bpy.context.active_object; o.scale = (0.08, 0.2, 0.1); add_mat(o, 'weapon', metal=0.4, rough=0.4); parts.append(o)
        # scope
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.035, depth=0.18, location=(0.4, 0.25, 1.02))
        o = bpy.context.active_object; o.rotation_euler = (math.radians(90), 0, 0); add_mat(o, 'weapon', metal=0.5, rough=0.3); parts.append(o)
    elif weapon == 'laser':
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.05, depth=0.5, location=(0.4, 0.28, 0.9))
        o = bpy.context.active_object; o.rotation_euler = (math.radians(90), 0, 0); add_mat(o, 'weapon', metal=0.6, rough=0.3); parts.append(o)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, location=(0.4, 0.55, 0.9))
        o = bpy.context.active_object; add_mat(o, 'visor', metal=0.2, rough=0.2); parts.append(o)
    elif weapon == 'glue':
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.1, depth=0.28, location=(0.35, 0.15, 0.85))
        o = bpy.context.active_object; add_mat(o, 'tank'); parts.append(o)
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.03, depth=0.4, location=(0.45, 0.35, 0.9))
        o = bpy.context.active_object; o.rotation_euler = (math.radians(70), 0, math.radians(20)); add_mat(o, 'weapon', metal=0.3, rough=0.45); parts.append(o)

    for o in parts: o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    join_selected(name)
    ob = bpy.context.active_object
    apply_all(ob)
    bbox = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    min_z = min(v.z for v in bbox); max_z = max(v.z for v in bbox)
    ob.location.z -= min_z
    h = max(0.01, max_z - min_z)
    ob.scale = ((1.7 / h),) * 3
    apply_all(ob)
    # Face +X (game forward)
    ob.rotation_euler[2] = math.radians(-90)
    apply_all(ob)
    smart_uv(ob)
    # Optional: also attach sprite as overlay material on a card behind? skip — solid mesh is the ask
    export_glb(os.path.join(OUT, f'{name}.glb'))

def make_gun(kind):
    """Viewmodel guns matching shooter roles."""
    reset()
    parts = []
    def add(o, rgba, metal=0.3, rough=0.45):
        m = mat_color(f'g_{kind}_{len(parts)}', rgba, metal=metal, rough=rough)
        o.data.materials.append(m); parts.append(o)
    if kind == 'dart':
        # blowtube / dart gun
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.035, depth=0.55, location=(0, 0, 0))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(90), 0); add(o, (0.35, 0.22, 0.12, 1), 0.1, 0.7)
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.05, depth=0.12, location=(0.15, 0, -0.06))
        o = bpy.context.active_object; add(o, (0.2, 0.15, 0.1, 1), 0.05, 0.8)
        bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.04, radius2=0.01, depth=0.1, location=(0.32, 0, 0))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(90), 0); add(o, (0.7, 0.7, 0.75, 1), 0.6, 0.3)
    elif kind == 'sniper':
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.03, depth=0.9, location=(0.1, 0, 0))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(90), 0); add(o, (0.12, 0.12, 0.12, 1), 0.55, 0.35)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.15, 0, -0.04))
        o = bpy.context.active_object; o.scale = (0.22, 0.06, 0.1); add(o, (0.1, 0.1, 0.1, 1), 0.4, 0.4)
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.028, depth=0.16, location=(0.0, 0, 0.06))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(90), 0); add(o, (0.15, 0.15, 0.18, 1), 0.5, 0.3)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.28, 0, -0.1))
        o = bpy.context.active_object; o.scale = (0.08, 0.04, 0.14); add(o, (0.25, 0.15, 0.08, 1), 0.05, 0.75)
    elif kind == 'laser':
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.045, depth=0.45, location=(0, 0, 0))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(90), 0); add(o, (0.55, 0.1, 0.12, 1), 0.4, 0.35)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(0.28, 0, 0))
        o = bpy.context.active_object; add(o, (1.0, 0.3, 0.2, 1), 0.2, 0.2)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.15, 0, -0.05))
        o = bpy.context.active_object; o.scale = (0.15, 0.07, 0.09); add(o, (0.2, 0.05, 0.05, 1), 0.3, 0.45)
    elif kind == 'glue':
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.09, depth=0.25, location=(-0.05, 0, 0.05))
        o = bpy.context.active_object; add(o, (0.55, 0.85, 0.25, 1), 0.05, 0.55)
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.03, depth=0.4, location=(0.2, 0, 0.02))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(75), 0); add(o, (0.3, 0.3, 0.32, 1), 0.5, 0.4)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.18, 0, -0.08))
        o = bpy.context.active_object; o.scale = (0.1, 0.05, 0.12); add(o, (0.2, 0.2, 0.2, 1), 0.2, 0.6)
    elif kind == 'shuriken':
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.14, depth=0.025, location=(0.1, 0, 0))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(90), 0); add(o, (0.75, 0.78, 0.82, 1), 0.8, 0.25)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.1, 0, -0.04))
        o = bpy.context.active_object; o.scale = (0.12, 0.04, 0.08); add(o, (0.15, 0.15, 0.18, 1), 0.3, 0.5)
    elif kind == 'staff':
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.03, depth=0.7, location=(0, 0, 0))
        o = bpy.context.active_object; o.rotation_euler = (0, math.radians(90), 0); add(o, (0.35, 0.2, 0.45, 1), 0.05, 0.7)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, location=(0.38, 0, 0))
        o = bpy.context.active_object; add(o, (0.7, 0.4, 1.0, 1), 0.1, 0.25)

    for o in parts: o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    join_selected(f'gun_{kind}')
    ob = bpy.context.active_object
    apply_all(ob)
    # muzzle toward +X
    export_glb(os.path.join(OUT, f'gun_{kind}.glb'))

def main():
    print('=== t71 Blender mesh build ===')
    for k in ['red', 'blue', 'green', 'yellow', 'pink', 'lead', 'ceramic']:
        print('bloon', k); make_bloon(k)
    print('scavenger'); make_scavenger()

    monkey('tower_dart', {
        'fur': (0.45, 0.28, 0.14, 1), 'skin': (0.92, 0.75, 0.55, 1),
        'cloth': (0.35, 0.22, 0.12, 1), 'weapon': (0.55, 0.45, 0.3, 1),
    }, weapon='dart')
    monkey('tower_ninja', {
        'fur': (0.25, 0.15, 0.1, 1), 'skin': (0.9, 0.7, 0.5, 1),
        'cloth': (0.08, 0.08, 0.1, 1), 'hood': (0.05, 0.05, 0.07, 1),
        'weapon': (0.7, 0.72, 0.78, 1),
    }, weapon='shuriken', hat='hood')
    monkey('tower_wizard', {
        'fur': (0.4, 0.25, 0.15, 1), 'skin': (0.92, 0.75, 0.55, 1),
        'cloth': (0.45, 0.25, 0.7, 1), 'hat': (0.4, 0.2, 0.65, 1),
        'weapon': (0.35, 0.2, 0.15, 1), 'crystal': (0.75, 0.45, 1.0, 1),
    }, weapon='staff', hat='wizard')
    monkey('tower_sniper', {
        'fur': (0.4, 0.28, 0.16, 1), 'skin': (0.9, 0.72, 0.52, 1),
        'cloth': (0.2, 0.25, 0.18, 1), 'helmet': (0.15, 0.18, 0.12, 1),
        'weapon': (0.12, 0.12, 0.12, 1),
    }, weapon='sniper', hat='helmet')
    monkey('tower_apex', {
        'fur': (0.35, 0.2, 0.12, 1), 'skin': (0.9, 0.7, 0.5, 1),
        'cloth': (0.55, 0.08, 0.1, 1), 'helmet': (0.15, 0.05, 0.05, 1),
        'visor': (1.0, 0.25, 0.15, 1), 'weapon': (0.4, 0.08, 0.08, 1),
    }, weapon='laser', hat='visor')
    monkey('tower_glue', {
        'fur': (0.42, 0.28, 0.15, 1), 'skin': (0.92, 0.75, 0.55, 1),
        'cloth': (0.55, 0.75, 0.25, 1), 'tank': (0.45, 0.85, 0.2, 1),
        'weapon': (0.3, 0.3, 0.32, 1),
    }, weapon='glue')

    for g in ['dart', 'sniper', 'laser', 'glue', 'shuriken', 'staff']:
        print('gun', g); make_gun(g)
    print('DONE')

if __name__ == '__main__':
    main()
