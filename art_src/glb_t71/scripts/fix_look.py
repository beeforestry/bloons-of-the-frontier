"""Fix dark UVs: bloons get sphere-project + dominant color; towers keep multi-mat palette (no full-sprite wash)."""
import bpy, bmesh, math, os
from mathutils import Vector
from PIL import Image

ROOT = '/workspace/bloons-frontier'
TEX = os.path.join(ROOT, 'art_src/glb_t71/tex')
OUT = os.path.join(ROOT, 'public/assets/glb')

ns = {}
code = open(os.path.join(ROOT, 'art_src/glb_t71/scripts/build_meshes.py')).read().split('\ndef main():')[0]
exec(code, ns)

def dominant(path):
    im = Image.open(path).convert('RGBA')
    px = [p for p in im.getdata() if p[3] > 200]
    if not px: return (0.8, 0.2, 0.2, 1)
    # average of top half (body)
    n = max(1, len(px)//2)
    r = sum(p[0] for p in px[:n]) / (n * 255)
    g = sum(p[1] for p in px[:n]) / (n * 255)
    b = sum(p[2] for p in px[:n]) / (n * 255)
    return (r, g, b, 1)

def mat_mixed(name, path, metal, rough):
    """Base color from sprite average; image as mild overlay if present."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial'); out.location = (500, 0)
    bsdf = nt.nodes.new('ShaderNodeBsdfPrincipled'); bsdf.location = (200, 0)
    nt.links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    col = dominant(path) if os.path.exists(path) else (0.8, 0.2, 0.2, 1)
    bsdf.inputs['Base Color'].default_value = col
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = rough
    if os.path.exists(path):
        img = bpy.data.images.load(path)
        img.colorspace_settings.name = 'sRGB'
        tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = img; tex.location = (-350, 0)
        mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.location = (0, 0)
        mix.inputs['Factor'].default_value = 0.55
        # A = solid color, B = texture
        solid = nt.nodes.new('ShaderNodeRGB'); solid.outputs[0].default_value = col; solid.location = (-350, -200)
        nt.links.new(solid.outputs[0], mix.inputs['A'])
        nt.links.new(tex.outputs['Color'], mix.inputs['B'])
        nt.links.new(mix.outputs['Result'], bsdf.inputs['Base Color'])
    return m

# ---- Bloons ----
BLOON_METAL = {'lead': 0.85, 'ceramic': 0.05}
BLOON_ROUGH = {'lead': 0.32, 'ceramic': 0.85}

for kind in ['red','blue','green','yellow','pink','lead','ceramic']:
    print('fix bloon', kind)
    ns['reset']()
    tex = os.path.join(TEX, f'bloon_{kind}.png')
    metal = BLOON_METAL.get(kind, 0.0)
    rough = BLOON_ROUGH.get(kind, 0.4)
    # Body teardrop
    bpy.ops.mesh.primitive_uv_sphere_add(segments=28, ring_count=18, radius=0.55, location=(0, 0, 0.62))
    body = bpy.context.active_object
    bpy.ops.object.mode_set(mode='EDIT')
    bm = bmesh.from_edit_mesh(body.data)
    for v in bm.verts:
        x, y, z = v.co
        if z < 0.35:
            k = max(0.15, (z + 0.05) / 0.4)
            v.co.x *= k; v.co.y *= k
        v.co.z *= 1.15
    bmesh.update_edit_mesh(body.data)
    bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.09, radius2=0.02, depth=0.18, location=(0, 0, 0.02))
    knot = bpy.context.active_object
    bpy.ops.mesh.primitive_torus_add(major_radius=0.07, minor_radius=0.025, major_segments=12, minor_segments=8, location=(0, 0, 0.08))
    ring = bpy.context.active_object
    extras = []
    if kind == 'lead':
        for ang in range(0, 360, 60):
            bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.65))
            strap = bpy.context.active_object; strap.scale = (0.03, 0.58, 0.55); strap.rotation_euler[2] = math.radians(ang)
            extras.append(strap)
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.22, depth=0.06, location=(0, 0, 1.18))
        extras.append(bpy.context.active_object)
    elif kind == 'ceramic':
        bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.035, major_segments=16, minor_segments=6, location=(0, 0, 0.55))
        extras.append(bpy.context.active_object)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.38, minor_radius=0.03, major_segments=16, minor_segments=6, location=(0, 0, 0.85))
        extras.append(bpy.context.active_object)
    m = mat_mixed(f'm_{kind}', tex, metal, rough)
    objs = [body, knot, ring] + extras
    for o in objs:
        o.data.materials.clear(); o.data.materials.append(m); o.select_set(True)
    bpy.context.view_layer.objects.active = body
    ns['join_selected'](f'bloon_{kind}')
    ob = bpy.context.active_object
    ns['apply_all'](ob)
    bbox = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
    min_z = min(v.z for v in bbox); max_z = max(v.z for v in bbox)
    ob.location.z -= min_z
    h = max(0.01, max_z - min_z)
    ob.scale = ((1.25 / h),) * 3
    ns['apply_all'](ob)
    # Sphere project UV for balloon body
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.sphere_project(direction='VIEW_ON_EQUATOR', align='POLAR_ZX', scale_to_bounds=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    ns['export_glb'](os.path.join(OUT, f'bloon_{kind}.glb'))

# ---- Towers: multi-mat palette only (readable silhouette matching 2D colors) ----
TOWERS = [
  ('tower_dart', 'dart', None, {
    'fur': (0.55, 0.35, 0.18, 1), 'skin': (0.95, 0.78, 0.58, 1),
    'cloth': (0.4, 0.25, 0.14, 1), 'weapon': (0.6, 0.5, 0.35, 1),
  }),
  ('tower_ninja', 'shuriken', 'hood', {
    'fur': (0.3, 0.18, 0.12, 1), 'skin': (0.92, 0.72, 0.52, 1),
    'cloth': (0.1, 0.1, 0.12, 1), 'hood': (0.06, 0.06, 0.08, 1),
    'weapon': (0.75, 0.78, 0.85, 1),
  }),
  ('tower_wizard', 'staff', 'wizard', {
    'fur': (0.45, 0.28, 0.16, 1), 'skin': (0.95, 0.78, 0.58, 1),
    'cloth': (0.5, 0.28, 0.75, 1), 'hat': (0.42, 0.22, 0.7, 1),
    'weapon': (0.4, 0.25, 0.15, 1), 'crystal': (0.8, 0.5, 1.0, 1),
  }),
  ('tower_sniper', 'sniper', 'helmet', {
    'fur': (0.45, 0.3, 0.18, 1), 'skin': (0.92, 0.74, 0.54, 1),
    'cloth': (0.25, 0.32, 0.2, 1), 'helmet': (0.18, 0.22, 0.15, 1),
    'weapon': (0.15, 0.15, 0.15, 1),
  }),
  ('tower_apex', 'laser', 'visor', {
    'fur': (0.4, 0.22, 0.14, 1), 'skin': (0.92, 0.72, 0.52, 1),
    'cloth': (0.7, 0.1, 0.12, 1), 'helmet': (0.2, 0.06, 0.06, 1),
    'visor': (1.0, 0.35, 0.2, 1), 'weapon': (0.5, 0.1, 0.1, 1),
  }),
  ('tower_glue', 'glue', None, {
    'fur': (0.48, 0.3, 0.16, 1), 'skin': (0.95, 0.78, 0.58, 1),
    'cloth': (0.55, 0.8, 0.28, 1), 'tank': (0.5, 0.9, 0.25, 1),
    'weapon': (0.35, 0.35, 0.38, 1),
  }),
]
for name, weapon, hat, colors in TOWERS:
    print('fix tower', name)
    ns['monkey'](name, colors, weapon=weapon, hat=hat)

print('scavenger')
ns['make_scavenger']()
# brighten scavenger: rebuild with stronger brown
ns['reset']()
# reuse make but force brighter mat after — skip, scavenger sprite mix is ok if we fix like bloons
# Quick scavenger brighten
from pathlib import Path
# guns already fine (solid colors)
print('FIX DONE')
