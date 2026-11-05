"""Bake v3 max-tier sprites onto tower hero meshes via cylindrical UV (headless-safe)."""
import bpy, bmesh, math, os
from mathutils import Vector

ROOT = os.environ.get('BOF_ROOT', '/workspace/bloons-frontier')
TEX = os.path.join(ROOT, 'art_src/glb_t71/tex')
OUT = os.path.join(ROOT, 'public/assets/glb')

# Pull helpers from build_meshes without running main
ns = {}
code = open(os.path.join(ROOT, 'art_src/glb_t71/scripts/build_meshes.py')).read()
code = code.split("\ndef main():")[0]
exec(code, ns)

TOWERS = [
  ('tower_dart', 'dart_monkey_2.png', 'dart', None, {
    'fur': (0.45, 0.28, 0.14, 1), 'skin': (0.92, 0.75, 0.55, 1),
    'cloth': (0.35, 0.22, 0.12, 1), 'weapon': (0.55, 0.45, 0.3, 1),
  }),
  ('tower_ninja', 'ninja_monkey_2.png', 'shuriken', 'hood', {
    'fur': (0.25, 0.15, 0.1, 1), 'skin': (0.9, 0.7, 0.5, 1),
    'cloth': (0.08, 0.08, 0.1, 1), 'hood': (0.05, 0.05, 0.07, 1),
    'weapon': (0.7, 0.72, 0.78, 1),
  }),
  ('tower_wizard', 'wizard_monkey_2.png', 'staff', 'wizard', {
    'fur': (0.4, 0.25, 0.15, 1), 'skin': (0.92, 0.75, 0.55, 1),
    'cloth': (0.45, 0.25, 0.7, 1), 'hat': (0.4, 0.2, 0.65, 1),
    'weapon': (0.35, 0.2, 0.15, 1), 'crystal': (0.75, 0.45, 1.0, 1),
  }),
  ('tower_sniper', 'sniper_monkey_2.png', 'sniper', 'helmet', {
    'fur': (0.4, 0.28, 0.16, 1), 'skin': (0.9, 0.72, 0.52, 1),
    'cloth': (0.2, 0.25, 0.18, 1), 'helmet': (0.15, 0.18, 0.12, 1),
    'weapon': (0.12, 0.12, 0.12, 1),
  }),
  ('tower_apex', 'super_monkey_2.png', 'laser', 'visor', {
    'fur': (0.35, 0.2, 0.12, 1), 'skin': (0.9, 0.7, 0.5, 1),
    'cloth': (0.55, 0.08, 0.1, 1), 'helmet': (0.15, 0.05, 0.05, 1),
    'visor': (1.0, 0.25, 0.15, 1), 'weapon': (0.4, 0.08, 0.08, 1),
  }),
  ('tower_glue', 'glue_slinger_2.png', 'glue', None, {
    'fur': (0.42, 0.28, 0.15, 1), 'skin': (0.92, 0.75, 0.55, 1),
    'cloth': (0.55, 0.75, 0.25, 1), 'tank': (0.45, 0.85, 0.2, 1),
    'weapon': (0.3, 0.3, 0.32, 1),
  }),
]

for name, sprite, weapon, hat, colors in TOWERS:
    print('building', name)
    ns['monkey'](name, colors, weapon=weapon, hat=hat)
    ob = bpy.data.objects.get(name)
    if not ob:
        print('missing', name); continue
    # Mix: keep multi-material silhouette colors, PLUS add sprite as emission-ish overlay on a card
    # Simpler: replace primary material with sprite + slight color multiply via principled
    tex = os.path.join(TEX, sprite)
    m = ns['mat_image'](f'{name}_spr', tex, metal=0.02, rough=0.5)
    # Cylinder UV around Z so front faces get chest of sprite
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.cylinder_project(direction='ALIGN_TO_OBJECT', align='POLAR_ZX', scale_to_bounds=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    # Assign sprite mat to ALL slots so whole hero reads the painted look
    while len(ob.data.materials):
        ob.data.materials.pop(index=0)
    ob.data.materials.append(m)
    ns['export_glb'](os.path.join(OUT, f'{name}.glb'))

for k in ['red','blue','green','yellow','pink','lead','ceramic']:
    print('bloon', k); ns['make_bloon'](k)
print('scav'); ns['make_scavenger']()
for g in ['dart','sniper','laser','glue','shuriken','staff']:
    ns['make_gun'](g)
print('OK')
