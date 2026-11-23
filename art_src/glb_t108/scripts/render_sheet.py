"""t77 (from t76): render GLBs (Eevee, studio light) for 2D-vs-3D proof sheets.  -- outdir az elev res name1,name2,..."""
import bpy, sys, math, os
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
out, az, el, res, names = a[0], float(a[1]), float(a[2]), int(a[3]), a[4].split(',')
GLB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'public', 'assets', 'glb')
os.makedirs(out, exist_ok=True)
for n in names:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(GLB, n + '.glb'))
    obs = [o for o in bpy.data.objects if o.type == 'MESH']
    pts = [o.matrix_world @ Vector(c) for o in obs for c in o.bound_box]
    mn = Vector([min(p[i] for p in pts) for i in range(3)]); mx = Vector([max(p[i] for p in pts) for i in range(3)])
    c = (mn + mx) / 2; size = (mx - mn).length
    sc = bpy.context.scene; sc.render.engine = 'BLENDER_EEVEE_NEXT'; sc.view_settings.view_transform = 'Standard'; sc.view_settings.exposure = -0.7  # t77: GLB albedo is lifted for the warm in-game sun
    sc.render.resolution_x = res; sc.render.resolution_y = res; sc.render.film_transparent = True
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (0.55, 0.57, 0.6, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.45
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
    cam.data.lens = 85; r = size * 2.3; A = math.radians(az); E = math.radians(el)
    cam.location = c + Vector((math.cos(A) * math.cos(E), math.sin(A) * math.cos(E), math.sin(E))) * r
    cam.rotation_euler = (c - cam.location).to_track_quat('-Z', 'Y').to_euler()
    for nm, e, loc in (('key', 2.4, (2, -3, 4)), ('fill', 0.8, (-2, -2, 1)), ('rim', 2.0, (-3, 3, 3))):
        l = bpy.data.objects.new(nm, bpy.data.lights.new(nm, 'SUN')); l.data.energy = e; sc.collection.objects.link(l)
        l.rotation_euler = (-Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = os.path.join(out, n + '.png'); bpy.ops.render.render(write_still=True)
