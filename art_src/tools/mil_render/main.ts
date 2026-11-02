// t42 dev tool (not shipped): preview the normalised military models next to a 1.8 m soldier,
// render top-down/3-4 sprite frames for the 2D map, and export the procedural sandbags GLB.
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { tank, heli, prop, gun, hand, sandbags, PROP_KINDS, type GunKind } from '../../../src/fps/military';
const q = new URLSearchParams(location.search), mode = q.get('mode') ?? 'preview';
const cv = document.getElementById('c') as HTMLCanvasElement;
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true, alpha: true });
R.outputColorSpace = THREE.SRGBColorSpace; R.shadowMap.enabled = true;
const scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x5a5040, 1.5));
const sun = new THREE.DirectionalLight(0xfff0d8, 2.2); sun.position.set(-30, 60, 40); sun.castShadow = true;
sun.shadow.camera.left = sun.shadow.camera.bottom = -20; sun.shadow.camera.right = sun.shadow.camera.top = 20; sun.shadow.mapSize.set(2048, 2048); scene.add(sun);
const W = window as unknown as Record<string, unknown>;
function soldier() { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 1.2, 4, 8).translate(0, 0.88, 0), new THREE.MeshLambertMaterial({ color: 0xd04040 })); return m; }
async function preview() {
  R.setSize(1600, 700); scene.background = new THREE.Color(0x9fc4e0);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x6f9a4a })); ground.receiveShadow = true; scene.add(ground);
  let x = -24;
  const put = (o: THREE.Object3D, w: number) => { o.position.x = x + w / 2; scene.add(o); const s = soldier(); s.position.set(x + w / 2, 0, 3.5); scene.add(s); x += w + 1.5; };
  for (let t = 0; t < 3; t++) put(await tank(t), 9.5);
  for (let t = 0; t < 3; t++) { const h = await heli(t); put(h, 12); }
  for (const k of PROP_KINDS) put(await prop(k), 3);
  const kinds: GunKind[] = ['rifle', 'rocket', 'sniper', 'shotgun', 'pistol', 'smg'];
  let gx = -20; for (const k of kinds) { const g = await gun(k); g.rotation.y = Math.PI / 2; g.position.set(gx, 1.2, 6); scene.add(g); gx += 1.6; }
  const hd = hand(); hd.position.set(gx, 1.2, 6); scene.add(hd);
  const cam = new THREE.PerspectiveCamera(40, 1600 / 700, 0.1, 500); cam.position.set(14, 16, 48); cam.lookAt(14, 1, 0);
  R.render(scene, cam); W.__done = true;
}
async function exportGlb() {
  const ex = new GLTFExporter(); const out = await ex.parseAsync(sandbags(), { binary: true }) as ArrayBuffer;
  W.__glb = btoa(String.fromCharCode(...new Uint8Array(out))); W.__done = true;
}
async function one() {
  const k = q.get('k') ?? 'tank0'; R.setSize(800, 600); scene.background = new THREE.Color(0x9fc4e0);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x6f9a4a })); ground.receiveShadow = true; scene.add(ground);
  const o = k.startsWith('tank') ? await tank(+k.slice(4)) : k.startsWith('heli') ? await heli(+k.slice(4)) : k.startsWith('gun') ? await gun(k.slice(3) as GunKind) : await prop(k as never);
  if (k.startsWith('gun')) { o.rotation.y = Math.PI / 2; o.position.y = 1; }
  scene.add(o); const s = soldier(); s.position.set(0, 0, 2.6); scene.add(s);
  const b = new THREE.Box3().setFromObject(o), sz = b.getSize(new THREE.Vector3()).length();
  const cam = new THREE.PerspectiveCamera(35, 800 / 600, 0.05, 500); cam.position.set(sz * 0.9, sz * 0.7, sz * 1.3); cam.lookAt(0, b.max.y * 0.4, 0);
  R.render(scene, cam); W.__done = true;
}
/** Sprite frames for the 2D map: orthographic 3/4 view (camera from +Z/south, ELEV down),
 *  PPM px per metre, transparent bg, baked soft shadow (ground vehicles/props). */
const ELEV = 0.72, PPM = 25;
function frame(o: THREE.Object3D, w: number, h: number, ay: number, shadow = true) {
  // ay = pixel row of the ground anchor (object origin) from the top
  const ortho = new THREE.OrthographicCamera(-w / 2 / PPM, w / 2 / PPM, ay / PPM, -(h - ay) / PPM, -100, 100);
  ortho.position.set(0, Math.sin(ELEV) * 50, Math.cos(ELEV) * 50); ortho.lookAt(0, 0, 0);
  // the ortho frustum is in camera space; shift so the origin projects at row ay
  ortho.updateProjectionMatrix();
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xeaf4ff, 0x5a5040, 1.55));
  const sun2 = new THREE.DirectionalLight(0xfff0d8, 2.1); sun2.position.set(-20, 40, 18); sun2.castShadow = true;
  Object.assign(sun2.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); sun2.shadow.mapSize.set(2048, 2048); sun2.shadow.radius = 4; sc.add(sun2);
  if (shadow) { const sg = new THREE.Mesh(new THREE.PlaneGeometry(60, 60).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.38 })); sg.receiveShadow = true; sc.add(sg); }
  o.traverse((m) => { (m as THREE.Mesh).castShadow = true; }); sc.add(o);
  R.setSize(w, h); R.setClearColor(0, 0); R.render(sc, ortho); sc.remove(o);
  return cv.toDataURL('image/png');
}
async function sprites() {
  R.shadowMap.type = THREE.PCFSoftShadowMap;
  const out: Record<string, unknown> = {}, meta: Record<string, unknown> = {};
  const N = 16;
  for (let t = 0; t < 3; t++) {
    const tk = await tank(t), L = [7.6, 8.6, 9.6][t] + 2.5, fw = Math.ceil(L * PPM), fh = Math.ceil(L * PPM * 0.8), ay = Math.round(fh * 0.62);
    const tur = tk.userData.turret as THREE.Group;
    for (let i = 0; i < N; i++) { const a = (i / N) * Math.PI * 2; tk.rotation.y = -a; tur.rotation.y = 0; out[`tank_${t}_${i}`] = frame(tk, fw, fh, ay); }
    const bb = new THREE.Box3().setFromObject(tk); tk.rotation.y = 0; const b0 = new THREE.Box3().setFromObject(tk);
    meta[`tank_${t}`] = { fw, fh, ay, n: N, ppm: PPM, elev: ELEV, muzzle: [b0.max.x, (bb.max.y) * 0.7] };
    const h = await heli(t); (h.userData.rotor as THREE.Object3D).visible = false; (h.userData.tail as THREE.Object3D).visible = false;
    const HL = [11, 12, 13.2][t] + 1, hw = Math.ceil(HL * PPM), hh = Math.ceil(HL * PPM * 0.75), hay = Math.round(hh * 0.66);
    for (let i = 0; i < N; i++) { const a = (i / N) * Math.PI * 2; h.rotation.y = -a; out[`heli_${t}_${i}`] = frame(h, hw, hh, hay, false); }
    h.rotation.y = 0; const r = h.userData.rotor as THREE.Object3D, hb = new THREE.Box3().setFromObject(h);
    meta[`heli_${t}`] = { fw: hw, fh: hh, ay: hay, n: N, ppm: PPM, elev: ELEV, rotor: [r.position.x, r.position.y, [11, 12, 13.2][t] * 0.47], nose: [hb.max.x, hb.max.y * 0.2] };
  }
  for (const k of PROP_KINDS) { const o = await prop(k); o.rotation.y = k === 'tent' ? 0.5 : 0.25; const b = new THREE.Box3().setFromObject(o), L = Math.max(b.max.x - b.min.x, b.max.z - b.min.z, b.max.y) + 0.8; const fw = Math.ceil(L * PPM), fh = Math.ceil(L * PPM), ay = Math.round(fh * 0.7); out[`prop_${k}`] = frame(o, fw, fh, ay); meta[`prop_${k}`] = { fw, fh, ay, ppm: PPM }; }
  W.__out = out; W.__meta = meta; W.__done = true;
}
if (mode === 'sprites') void sprites();
if (mode === 'preview') void preview(); else if (mode === 'one') void one(); else if (mode === 'glb') void exportGlb();
(W as { __render?: unknown }).__render = { tank, heli, prop, scene, R, THREE };
