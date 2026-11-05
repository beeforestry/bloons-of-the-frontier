import bpy, os
from mathutils import Vector
ROOT='/workspace/bloons-frontier'
OUT=os.path.join(ROOT,'screenshots/t71')
GLB=os.path.join(ROOT,'public/assets/glb')

def reset():
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    for c in list(bpy.data.cameras): bpy.data.cameras.remove(c)
    for c in list(bpy.data.lights): bpy.data.lights.remove(c)

def render_one(name):
    reset()
    path=os.path.join(GLB,name+'.glb')
    bpy.ops.import_scene.gltf(filepath=path)
    objs=[o for o in bpy.context.scene.objects if o.type=='MESH']
    bbox=[]
    for o in objs:
        for c in o.bound_box: bbox.append(o.matrix_world @ Vector(c))
    mn=Vector((min(v.x for v in bbox), min(v.y for v in bbox), min(v.z for v in bbox)))
    mx=Vector((max(v.x for v in bbox), max(v.y for v in bbox), max(v.z for v in bbox)))
    center=(mn+mx)/2; size=(mx-mn).length
    bpy.ops.object.light_add(type='SUN', location=(center.x+2, center.y-3, center.z+5))
    bpy.context.active_object.data.energy=4.5
    bpy.ops.object.light_add(type='AREA', location=(center.x-2, center.y+2, center.z+3))
    bpy.context.active_object.data.energy=60
    # fill light so dark materials still read
    bpy.ops.object.light_add(type='AREA', location=(center.x, center.y-2, center.z+1))
    bpy.context.active_object.data.energy=30
    bpy.ops.object.camera_add(location=(center.x+size*0.95, center.y-size*1.15, center.z+size*0.5))
    cam=bpy.context.active_object
    cam.rotation_euler=(center-cam.location).to_track_quat('-Z','Y').to_euler()
    sc=bpy.context.scene; sc.camera=cam
    sc.render.resolution_x=sc.render.resolution_y=512
    sc.render.filepath=os.path.join(OUT,f'preview_{name}.png')
    sc.render.image_settings.file_format='PNG'
    sc.render.film_transparent=True
    sc.cycles.samples=24 if sc.render.engine=='CYCLES' else 64
    # Prefer EEVEE for speed/brightness
    try:
        sc.render.engine='BLENDER_EEVEE_NEXT'
    except: 
        try: sc.render.engine='BLENDER_EEVEE'
        except: pass
    bpy.ops.render.render(write_still=True)
    print('ok', name)

for n in ['bloon_red','bloon_blue','bloon_lead','bloon_ceramic','tower_dart','tower_wizard','tower_apex','bug_scavenger','gun_dart']:
    render_one(n)
