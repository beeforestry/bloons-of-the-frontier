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

// t44: 3D tower gallery next to the 2D sprites (top tier of every tower + tier progression for two).
import { towerMesh, TOWER_3D_IDS } from '../../../src/fps/towers3d';
async function img(src: string) { const i = new Image(); i.src = src; try { await i.decode(); return i; } catch { return null; } }
async function towers() {
  const only = q.get('ids')?.split(','), tiersQ = q.get('tiers');
  const list: [string, number][] = [];
  const ids = only ?? [...TOWER_3D_IDS, 'unsc_tank', 'unsc_heli'];
  for (const id of ids) { const ts = tiersQ ? tiersQ.split(',').map(Number) : [/(wallnut_barrier|cherry_pod)/.test(id) ? 0 : 2]; for (const t of ts) list.push([id, t]); }
  for (const id of (q.get('prog') ?? '').split(',').filter(Boolean)) for (let t = 0; t < 3; t++) list.push([id, t]);
  const CW = 210, cols = +(q.get('cols') ?? 4), rows = Math.ceil(list.length / cols);
  const sheet = document.createElement('canvas'); sheet.width = cols * CW * 2; sheet.height = rows * (CW + 18); document.body.prepend(sheet); cv.style.display = 'none';
  const x2 = sheet.getContext('2d')!; x2.fillStyle = '#3d4a35'; x2.fillRect(0, 0, sheet.width, sheet.height);
  R.setSize(CW, CW); R.setClearColor(0x000000, 0); scene.background = null;
  const ground = new THREE.Mesh(new THREE.CircleGeometry(3.2, 24).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x6f8a4a })); ground.receiveShadow = true; scene.add(ground);
  const man = soldier(); man.position.set(-0.6, 0, -2.3); man.scale.setScalar(0.92); scene.add(man);
  for (let i = 0; i < list.length; i++) {
    const [id, t] = list[i], cx = (i % cols) * CW * 2, cy = Math.floor(i / cols) * (CW + 18);
    const s2 = id.startsWith('unsc_') && /autoturret|rail|flak/.test(id) ? [await img(`/assets/v3/turret_base_${t}.webp`), await img(`/assets/v3/${id}_head_${t}.webp`)]
      : id === 'unsc_tank' || id === 'unsc_heli' ? [await img(`/art_src/military/render/${id === 'unsc_tank' ? 'tank' : 'heli'}_${t}.png`)] : [await img(`/assets/v3/${id}_${t}.webp`)];
    for (const im of s2) if (im) { const k = Math.min((CW - 10) / im.width, (CW - 10) / im.height); x2.drawImage(im, cx + (CW - im.width * k) / 2, cy + 18 + (CW - im.height * k) / 2, im.width * k, im.height * k); }
    let o: THREE.Object3D | null = null, big = false, hh = 3;
    if (id === 'unsc_tank') { o = await tank(t); big = true; } else if (id === 'unsc_heli') { o = await heli(t); o.position.y = 3; big = true; }
    else { const m = towerMesh(id, t); if (m) { o = m.root; m.head.rotation.y = 0; hh = m.height; } }
    if (o) { o.traverse((x) => { x.castShadow = true; }); scene.add(o); }
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 200), d = big ? 2.6 : Math.max(1, hh / 3.3);
    cam.position.set(6.2 * d, 4.4 * d, 4.6 * d); cam.lookAt(0, big ? 1.8 : 1.35 * d, -0.3); ground.scale.setScalar(big ? 2.5 : 1);
    R.render(scene, cam); x2.drawImage(R.domElement, cx + CW, cy + 18);
    if (o) scene.remove(o);
    x2.fillStyle = '#fff'; x2.font = 'bold 13px sans-serif'; x2.fillText(`${id} T${t + 1}  (2D | 3D)`, cx + 6, cy + 14);
    x2.strokeStyle = '#ffffff22'; x2.strokeRect(cx + 0.5, cy + 0.5, CW * 2 - 1, CW + 17);
  }
  W.__done = true;
}
if (mode === 'towers') void towers();
