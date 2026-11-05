import bpy, os, math
from mathutils import Vector, Euler

ROOT = '/workspace/bloons-frontier'
OUT = os.path.join(ROOT, 'screenshots', 't71')
GLB = os.path.join(ROOT, 'public', 'assets', 'glb')
os.makedirs(OUT, exist_ok=True)

def reset():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for b in list(bpy.data.meshes): bpy.data.meshes.remove(b)
    for b in list(bpy.data.materials): bpy.data.materials.remove(b)
    for b in list(bpy.data.images):
        try: bpy.data.images.remove(b)
        except: pass
    for b in list(bpy.data.cameras): bpy.data.cameras.remove(b)
    for b in list(bpy.data.lights): bpy.data.lights.remove(b)

def render_one(name, outfile):
    reset()
    path = os.path.join(GLB, name + '.glb')
    if not os.path.exists(path):
        print('skip', path); return
    bpy.ops.import_scene.gltf(filepath=path)
    objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    if not objs: return
    # bounds
    bbox = []
    for o in objs:
        for c in o.bound_box:
            bbox.append(o.matrix_world @ Vector(c))
    mn = Vector((min(v.x for v in bbox), min(v.y for v in bbox), min(v.z for v in bbox)))
    mx = Vector((max(v.x for v in bbox), max(v.y for v in bbox), max(v.z for v in bbox)))
    center = (mn + mx) / 2
    size = (mx - mn).length
    # light + camera
    bpy.ops.object.light_add(type='SUN', location=(center.x + 2, center.y - 3, center.z + 4))
    sun = bpy.context.active_object; sun.data.energy = 3
    bpy.ops.object.light_add(type='AREA', location=(center.x - 2, center.y + 2, center.z + 2))
    bpy.context.active_object.data.energy = 40
    bpy.ops.object.camera_add(location=(center.x + size * 0.9, center.y - size * 1.2, center.z + size * 0.55))
    cam = bpy.context.active_object
    direction = center - cam.location
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = cam
    sc = bpy.context.scene
    sc.render.resolution_x = 640
    sc.render.resolution_y = 640
    sc.render.filepath = outfile
    sc.render.image_settings.file_format = 'PNG'
    sc.render.film_transparent = True
    bpy.ops.render.render(write_still=True)
    print('rendered', outfile)

for n in ['bloon_red','bloon_lead','bloon_ceramic','bloon_blue','tower_dart','tower_ninja','tower_wizard','tower_sniper','tower_apex','tower_glue','bug_scavenger','gun_dart','gun_sniper','gun_laser']:
    render_one(n, os.path.join(OUT, f'preview_{n}.png'))
print('previews done')
