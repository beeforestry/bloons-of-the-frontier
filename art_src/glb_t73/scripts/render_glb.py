"""Render a GLB with Eevee (3-point light + world) from a given azimuth. args: -- in.glb out.png az_deg [elev] [res]"""
import bpy, sys, math
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
src, out, az = a[0], a[1], float(a[2]); el = float(a[3]) if len(a) > 3 else 15; res = int(a[4]) if len(a) > 4 else 640
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
obs = [o for o in bpy.data.objects if o.type == 'MESH']
pts = [o.matrix_world @ Vector(c) for o in obs for c in o.bound_box]
mn = Vector([min(p[i] for p in pts) for i in range(3)]); mx = Vector([max(p[i] for p in pts) for i in range(3)])
c = (mn + mx) / 2; size = (mx - mn).length
sc = bpy.context.scene; sc.render.engine = 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x = res; sc.render.resolution_y = int(res * 1.25); sc.render.film_transparent = True
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs[0].default_value = (0.5, 0.52, 0.56, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.9
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = 70
r = size * 1.9; A = math.radians(az); E = math.radians(el)
cam.location = c + Vector((math.cos(A) * math.cos(E), math.sin(A) * math.cos(E), math.sin(E))) * r
cam.rotation_euler = (c - cam.location).to_track_quat('-Z', 'Y').to_euler()
for nm, e, loc in (('key', 4, (3, -2, 4)), ('fill', 1.5, (2, 3, 2)), ('rim', 3, (-3, 0, 3))):
    l = bpy.data.objects.new(nm, bpy.data.lights.new(nm, 'SUN')); l.data.energy = e; sc.collection.objects.link(l)
    l.rotation_euler = (c - Vector(loc) - c).to_track_quat('-Z', 'Y').to_euler() if False else (Vector((0,0,0)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
