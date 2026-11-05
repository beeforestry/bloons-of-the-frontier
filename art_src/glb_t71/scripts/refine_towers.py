"""Re-export tower heroes with front-projected v3 sprite albedo on the joined mesh."""
import bpy, math, os
from mathutils import Vector, Matrix

ROOT = os.environ.get('BOF_ROOT', '/workspace/bloons-frontier')
TEX = os.path.join(ROOT, 'art_src/glb_t71/tex')
OUT = os.path.join(ROOT, 'public/assets/glb')

# Import the builder helpers by exec
exec(open(os.path.join(ROOT, 'art_src/glb_t71/scripts/build_meshes.py')).read().split('def main')[0])

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

def project_front_uv(ob):
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    # Project from front (+Y in Blender before we rotate to +X)
    bpy.ops.uv.project_from_view(camera_bounds=False, correct_aspect=True, scale_to_bounds=True)
    bpy.ops.object.mode_set(mode='OBJECT')

for name, sprite, weapon, hat, colors in TOWERS:
    print('refine', name)
    monkey(name, colors, weapon=weapon, hat=hat)
    # monkey() already exported with solid colors; rebuild with sprite on whole mesh
    # Re-open last object
    ob = bpy.data.objects.get(name) or bpy.context.active_object
    # Replace all materials with single sprite-projected material (keeps silhouette, paints from 2D)
    tex = os.path.join(TEX, sprite)
    m = mat_image(f'{name}_sprite', tex, metal=0.05, rough=0.55)
    # Aim camera for project_from_view
    # Set view: look from +Y
    for area in bpy.context.screen.areas:
      if area.type == 'VIEW_3D':
        for space in area.spaces:
          if space.type == 'VIEW_3D':
            space.region_3d.view_perspective = 'ORTHO'
            space.region_3d.view_matrix = Matrix.Identity(4)  # may fail headless
    # Headless: use cube_project / smart then assign image — cylinder from Z
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.cylinder_project(direction='ALIGN_TO_OBJECT', align='POLAR_ZX', scale_to_bounds=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    ob.data.materials.clear()
    ob.data.materials.append(m)
    export_glb(os.path.join(OUT, f'{name}.glb'))

# Rebuild bloons with compressed textures
for k in ['red','blue','green','yellow','pink','lead','ceramic']:
    print('re-bloon', k); make_bloon(k)
print('scavenger'); make_scavenger()
# guns stay color-authored (no sprite)
for g in ['dart','sniper','laser','glue','shuriken','staff']:
    make_gun(g)
print('REFINE DONE')
