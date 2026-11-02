// t42: convert the CC0 military sources (art_src/military/src) into light GLBs for the
// lazy three.js chunk: public/assets/military/*.glb (meshopt + quantized, no skins/anims).
// Run from /tmp/gt (deps): node /workspace/bloons-frontier/art_src/tools/mil_convert.mjs
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, quantize, meshopt, textureCompress, resample } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import obj2gltf from 'obj2gltf';
import sharp from 'sharp';
import fs from 'node:fs';
const ROOT = '/workspace/bloons-frontier', SRC = ROOT + '/art_src/military/src', OUT = ROOT + '/public/assets/military';
fs.mkdirSync(OUT, { recursive: true });
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
async function finish(doc, name) {
  const root = doc.getRoot();
  for (const a of root.listAnimations()) a.dispose();
  for (const s of root.listSkins()) s.dispose();
  for (const n of root.listNodes()) n.setSkin(null);
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) for (const k of ['JOINTS_0', 'WEIGHTS_0']) if (p.getAttribute(k)) p.setAttribute(k, null);
  await doc.transform(dedup(), weld(), prune(), textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [256, 256] }), quantize(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(`${OUT}/${name}.glb`, doc);
  console.log(name, fs.statSync(`${OUT}/${name}.glb`).size);
}
const MAP = { tank_a: 'tank_1', tank_c: 'tank_2', tank_d: 'tank_3', tank_b: 'tank_alt', heli: 'heli', barrel: 'barrel', 'box-large': 'crate_large', box: 'crate', 'tent-canvas': 'tent', 'fence-fortified': 'barrier' };
for (const [src, dst] of Object.entries(MAP)) await finish(await io.read(`${SRC}/${src}.glb`), dst);
const GUNS = { machinegun: 'gun_rifle', rocketlauncherModern: 'gun_rocket', sniper: 'gun_sniper', shotgun: 'gun_shotgun', pistol: 'gun_pistol', uzi: 'gun_smg' };
for (const [src, dst] of Object.entries(GUNS)) {
  const glb = await obj2gltf(`${SRC}/obj/${src}.obj`, { binary: true });
  await finish(await io.readBinary(new Uint8Array(glb)), dst);
}
