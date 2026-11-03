// t50: Tropical Island as a warzone in first person: burnt wrecks, ruined bunkers, sandbag lines,
// barbed wire, smoke columns rising from the wrecks, falling ash and a smoky haze. All cheap:
// smoke = ~10 recycled sprites per column, ash = one Points cloud that follows the camera.
import * as THREE from 'three';
import { wreck, sandbagWall } from './military';

const lam = (c: number) => new THREE.MeshLambertMaterial({ color: c });
let puffTex: THREE.Texture | null = null;
function puff(): THREE.Texture {
  if (puffTex) return puffTex;
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const x = cv.getContext('2d')!;
  for (let i = 0; i < 7; i++) { // lumpy soft puff
    const px = 32 + Math.cos(i * 2.4) * 9, py = 32 + Math.sin(i * 2.4) * 9, gr = x.createRadialGradient(px, py, 0, px, py, 22);
    gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  }
  puffTex = new THREE.CanvasTexture(cv); return puffTex;
}

/** Ruined octagonal concrete pillbox (~5.5 m), roof slab cracked and sagging, firing slits, blown-off chunk. */
let conTex: THREE.Texture | null = null;
function bunker(rockTex?: THREE.Texture): THREE.Group {
  if (!conTex && rockTex) { conTex = rockTex.clone(); conTex.repeat.set(3, 0.8); conTex.needsUpdate = true; }
  const g = new THREE.Group(), con = new THREE.MeshLambertMaterial({ color: 0xb8b2a8, map: conTex }), dark = lam(0x121110), burnt = new THREE.MeshLambertMaterial({ color: 0x55504a, map: conTex });
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, ry = 0, rz = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(0, ry, rz); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
  add(new THREE.CylinderGeometry(2.5, 2.8, 2.0, 8), con, 0, 1.0, 0, Math.PI / 8);
  add(new THREE.CylinderGeometry(2.9, 2.9, 0.42, 8), burnt, 0.15, 2.2, 0.1, Math.PI / 8 + 0.05, 0.06);
  for (let i = 0; i < 3; i++) { const a = -0.6 + i * 0.6; add(new THREE.BoxGeometry(0.12, 0.28, 1.3), dark, Math.cos(a) * 2.62, 1.45, Math.sin(a) * 2.62, -a); }
  add(new THREE.BoxGeometry(1.8, 1.1, 1.5), burnt, -2.4, 0.4, -1.9, 0.5, 0.35);
  for (let i = 0; i < 7; i++) add(new THREE.DodecahedronGeometry(0.3 + (i % 3) * 0.16, 0), i % 2 ? con : burnt, -2.2 + i * 0.75, 0.18, 2.9 + (i % 2) * 0.6);
  return g;
}
/** Concertina barbed wire on posts, `len` m. */
function wire(len: number): THREE.Group {
  const g = new THREE.Group(), post = lam(0x3a2c20), steel = lam(0x4a4a46);
  for (let i = 0; i <= 2; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.3, 5), post); p.position.set(-len / 2 + i * len / 2, 0.65, 0); g.add(p); }
  const pts: THREE.Vector3[] = [], turns = Math.round(len * 2.2);
  for (let i = 0; i <= turns * 12; i++) { const t = i / (turns * 12), a = t * turns * Math.PI * 2; pts.push(new THREE.Vector3(-len / 2 + t * len, 0.48 + Math.sin(a) * 0.45, Math.cos(a) * 0.45)); }
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 12, 0.012, 3), steel));
  return g;
}

export interface WarFx { update(dt: number, cam: THREE.Camera): void; count: { wrecks: number; smoke: number; props: number } }

/** Build the warzone props (from map terrain.props keys) + smoke + ash. `gy(x,y)` = ground height at map px. */
export function buildWarzone(scene: THREE.Scene, props: [string, number, number, number][], gy: (x: number, y: number) => number, S: number, phone: boolean, rockTex?: THREE.Texture): WarFx {
  const count = { wrecks: 0, smoke: 0, props: 0 }, smokeAt: THREE.Vector3[] = [];
  let seed = 0;
  for (const [k, x, y, size] of props) {
    const X = x * S, Z = y * S, Y = gy(x, y), ry = ((x * 13 + y * 7) % 628) / 100;
    if (k === 'wtank' || k === 'wtank2' || k === 'wheli') {
      const s0 = seed++;
      void wreck(k === 'wheli' ? 'heli' : k === 'wtank2' ? 'tank2' : 'tank', s0).then((o) => { o.position.set(X, Y, Z); o.rotation.y = ry; o.traverse((m) => { m.castShadow = !phone; m.receiveShadow = !phone; }); o.userData.war = k; scene.add(o); count.wrecks++; });
      smokeAt.push(new THREE.Vector3(X, Y + 1.2, Z));
    } else if (k === 'bunker') { const b = bunker(rockTex); b.position.set(X, Y - 0.1, Z); b.rotation.y = ry; b.userData.war = k; scene.add(b); count.props++; }
    else if (k === 'sandbags') { // two staggered wall runs in a shallow V
      const g = new THREE.Group(); const a = sandbagWall(); a.rotation.y = 0.35; a.position.x = -1.2; const b = sandbagWall(); b.rotation.y = -0.35; b.position.x = 1.2; g.add(a, b);
      g.position.set(X, Y, Z); g.rotation.y = ry; g.traverse((m) => { m.castShadow = !phone; }); g.userData.war = k; scene.add(g); count.props++;
    } else if (k === 'wire') { const w = wire(size * S * 0.9); w.position.set(X, Y, Z); w.rotation.y = ry; w.userData.war = k; scene.add(w); count.props++; }
  }
  // smoke columns: wrecks + a couple of extra fires
  const mat = new THREE.SpriteMaterial({ map: puff(), color: 0x3b3834, transparent: true, depthWrite: false, opacity: 0.6, fog: true });
  type P = { s: THREE.Sprite; base: THREE.Vector3; t: number; life: number };
  const parts: P[] = [], per = phone ? 8 : 13;
  for (const at of smokeAt) for (let i = 0; i < per; i++) {
    const s = new THREE.Sprite(mat.clone()); s.renderOrder = 2; scene.add(s);
    parts.push({ s, base: at, t: (i / per) * 9, life: 9 });
  }
  count.smoke = smokeAt.length;
  const fireM = new THREE.SpriteMaterial({ map: puff(), color: 0xff7a2a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const fires = smokeAt.map((at) => { const f = new THREE.Sprite(fireM.clone()); f.position.copy(at); f.position.y -= 0.4; f.scale.setScalar(2.4); scene.add(f); return f; });
  // falling ash around the camera
  const N = phone ? 220 : 500, R = 28, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) pos.set([(Math.random() - 0.5) * 2 * R, Math.random() * 16, (Math.random() - 0.5) * 2 * R], i * 3);
  const ag = new THREE.BufferGeometry(); ag.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const ash = new THREE.Points(ag, new THREE.PointsMaterial({ color: 0x9a948c, size: 0.06, transparent: true, opacity: 0.8, depthWrite: false }));
  ash.frustumCulled = false; ash.name = 'ash'; scene.add(ash);
  let wind = 0;
  return {
    count,
    update(dt, cam) {
      wind += dt;
      for (const p of parts) {
        p.t += dt; if (p.t > p.life) p.t -= p.life;
        const f = p.t / p.life, sz = 2.6 + f * 13;
        p.s.position.set(p.base.x + f * f * 10 + Math.sin(wind * 0.5 + p.base.x) * 0.6, p.base.y + f * 24, p.base.z + f * f * 4);
        p.s.scale.set(sz, sz, 1); (p.s.material as THREE.SpriteMaterial).opacity = Math.min(1, f * 8) * (1 - f) * 0.95;
        (p.s.material as THREE.SpriteMaterial).color.setScalar(0.16 + f * 0.3); // black oily smoke near the fire, greyer as it rises
      }
      fires.forEach((f, i) => { const k = 0.75 + 0.25 * Math.sin(wind * 9 + i * 2.1) * Math.sin(wind * 5.3 + i); f.scale.setScalar(2.2 * k + 0.6); (f.material as THREE.SpriteMaterial).opacity = 0.55 + 0.35 * k; });
      const a = ag.attributes.position as THREE.BufferAttribute, cp = cam.position;
      ash.position.set(cp.x, 0, cp.z);
      for (let i = 0; i < N; i++) {
        let y = a.getY(i) - dt * 0.7; if (y < cp.y - 4) y += 16;
        a.setXYZ(i, a.getX(i) + Math.sin(wind + i) * dt * 0.15, y, a.getZ(i));
      }
      a.needsUpdate = true;
    },
  };
}
