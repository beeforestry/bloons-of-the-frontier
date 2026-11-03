// t51: textured CC0 first-person assets -> public/assets/{flora_tex,military}/*.glb
// Plants: Grab3D (grab3d.com, CC0) "light" GLBs; guns: Poly Haven bolt_action_rifle_7_62 + service_pistol (CC0).
// Each plant gets LOD0 (node "lod0") + a simplified LOD1 (node "lod1", edge-collapse ~25% of LOD0 where the error bound allows) sharing one material;
// textures resized to 512 px WebP (ORM dropped on plants), meshopt-compressed.
// Run from a dir with @gltf-transform/{core,extensions,functions}, meshoptimizer and sharp installed:
//   node fp_assets_t51.mjs <srcPlantsDir> <srcPolyHavenDir> <outRoot>
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { weld, dedup, prune, textureCompress, simplifyPrimitive, meshopt, flatten, join, transformMesh } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
// column-major 4x4 helpers (no gl-matrix dependency)
const mul = (a, b) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
const rotY = (t) => [Math.cos(t), 0, -Math.sin(t), 0, 0, 1, 0, 0, Math.sin(t), 0, Math.cos(t), 0, 0, 0, 0, 1];
const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const [SRC, PH, OUT] = process.argv.slice(2);
await MeshoptSimplifier.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const PLANTS = { palm: 'palm-tree', jungle: 'jungle-tree', oak: 'oak-tree', pine: 'pine-tree', dead: 'dead-tree', bush: 'bush', fern: 'fern', grass: 'grass-clump' };
async function finish(doc, out, size) {
  await doc.transform(dedup(), prune(), textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [size, size], quality: 80 }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(out, doc); console.log(out);
}
for (const [id, f] of Object.entries(PLANTS)) {
  const doc = await io.read(`${SRC}/${f}.glb`), root = doc.getRoot();
  await doc.transform(flatten(), join(), weld());
  for (const m of root.listMaterials()) { m.setMetallicRoughnessTexture(null); m.setOcclusionTexture(null); m.setMetallicFactor(0); m.setRoughnessFactor(0.9); m.setDoubleSided(true); }
  const scene = root.listScenes()[0], src = root.listNodes().find((n) => n.getMesh());
  src.setName('lod0');
  // grass clumps ship at 5k tris: thin LOD0 too (they are knee-high and numerous)
  // LOD0 also thinned (~45%, small error) — the source meshes are 8-14k tris, too many for dozens of instances
  for (const p of src.getMesh().listPrimitives()) await simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio: id === 'grass' ? 0.35 : 0.45, error: 0.01, lockBorder: false });
  const m1 = doc.createMesh('lod1');
  for (const p of src.getMesh().listPrimitives()) {
    const q = p.clone(); for (const s of q.listSemantics()) q.setAttribute(s, p.getAttribute(s).clone()); q.setIndices(p.getIndices().clone());
    // edge-collapse (keeps silhouettes; "sloppy" clustering shredded the leaf cards into shards)
    await simplifyPrimitive(q, { simplifier: MeshoptSimplifier, ratio: id === 'grass' ? 0.3 : 0.25, error: 0.06, lockBorder: false });
    m1.addPrimitive(q);
  }
  const n1 = doc.createNode('lod1').setMesh(m1).setMatrix(src.getMatrix()); scene.addChild(n1);
  await finish(doc, `${OUT}/flora_tex/${id}.glb`, 512);
}
// guns: keep selected nodes, long axis X -> Z, flatten transforms
const GUNS = { rifle: ['bolt_action_rifle_7_62', /^bolt_action_rifle_7_62(_bolt_a|_trigger|_wrap)?$/], sniper: ['bolt_action_rifle_7_62', /^bolt_action_rifle_7_62(_bolt_a|_trigger|_wrap|_scope)?$/], pistol: ['service_pistol', /^service_pistol_(pistol|slide|hammer|trigger)_b$/] };
for (const [id, [f, keep]] of Object.entries(GUNS)) {
  const doc = await io.read(`${PH}/${f}/${f}.gltf`), root = doc.getRoot();
  for (const n of root.listNodes()) if (n.getMesh() && !keep.test(n.getName())) n.dispose();
  await doc.transform(flatten());
  const rot = rotY(Math.PI / 2);
  for (const n of root.listNodes()) if (n.getMesh()) { const w = mul(rot, n.getWorldMatrix()); n.setMatrix(I); transformMesh(n.getMesh(), w); }
  await finish(doc, `${OUT}/military/gun_${id}_ph.glb`, 512);
}
