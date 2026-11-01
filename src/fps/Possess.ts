// Possess / First-Person (t37). Select one of YOUR towers or troops and press 👁 (or E) to
// see the LIVE match through its eyes. The 2D sim keeps running underneath (host authoritative,
// co-op safe): this module only renders a lazy three.js view of the current entities and feeds
// aim / fire / move input into the possessed entity's ManualCtl (Game.possessCtl).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import './possess.css';
import type { Game } from '../game/Game';
import { MANUAL_BONUS } from '../game/Game';
import { Tower } from '../entities/Tower';
import { Unit } from '../entities/Unit';
import type { Enemy } from '../entities/Enemy';
import type { AbilityId, ManualCtl } from '../core/types';
import { factionInfo } from '../data/factions';
import { ABILITIES } from '../data/abilities';
import { PCOLORS } from '../core/players';
import { assetUrl } from '../assetUrl';
import { logEvent } from '../ui/BugReport';

/** Metres per map pixel (garden ~110 x 74 m). */
export const S = 0.05;
const BLOON_COL: Record<string, number> = { red: 0xe8352f, blue: 0x2f7ce8, green: 0x3bc24a, yellow: 0xf2d02c, pink: 0xff6fb5, lead: 0x7b8088, ceramic: 0xb5703a };
const BUG_COL: Record<string, number> = { scavenger: 0x8a5a2b, hunter: 0x6b3a8a, charger: 0x8a2b2b, brood: 0x9a7a2b, bile_titan: 0x5f9a2b, ironback: 0x6a7480, warden: 0x2b6a8a };
const BOSS_COL: Record<string, number> = { moab: 0x2f6fd8, boss_zeppelin: 0x8a3fd8, boss_leviathan: 0x1f9a8a, boss_scarab: 0xb8862b, boss_dreadnought: 0x3a3f48, gargoyle: 0x707070 };
const coarse = () => matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T => { o.position.set(x, y, z); return o; };
const lam = (c: number) => new THREE.MeshLambertMaterial({ color: c });

export interface PossessHost { g: Game; onExit(): void }
type Target = Tower | Unit;

/** Enemy -> 3D centre height (m). Aircraft fly high, bloons float, bugs crawl. */
function enemyY(e: Enemy) { return e.data.air ? 6.5 : e.data.family === 'bloon' ? (e.data.boss || e.data.id === 'moab' ? 2.6 : 1.3) : Math.max(0.5, e.data.radius * S * 0.8); }
function enemyR(e: Enemy) { return Math.max(0.45, e.data.radius * S * 1.15); }

export class Possess {
  readonly g: Game; readonly obj: Target; readonly isTower: boolean;
  renderer: THREE.WebGLRenderer; scene = new THREE.Scene(); camera: THREE.PerspectiveCamera;
  root: HTMLDivElement; touch = coarse();
  yaw = 0; pitch = -0.12; keys = new Set<string>(); firing = false; locked = false;
  joy = { id: -1, ox: 0, oy: 0, x: 0, y: 0 }; lookId = -1; lookX = 0; lookY = 0;
  ctl: ManualCtl = { aim: 0, fire: false, target: null, mx: 0, my: 0 };
  fps = 60; private fpsAcc = 0; private fpsN = 0; private slow = 0; private pr = 1;
  hits = 0; shots = 0; private lastShot = -1; private hitT = 0; private sendT = 0; private sentFire = false;
  private bloonMesh!: THREE.InstancedMesh; private bugMesh!: THREE.InstancedMesh; private unitMesh!: THREE.InstancedMesh; private shotMesh!: THREE.InstancedMesh; private bitMesh!: THREE.InstancedMesh;
  private bossModels = new Map<Enemy, THREE.Group>(); private towerModels = new Map<Tower, { root: THREE.Group; head: THREE.Group }>();
  private bits: { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; c: THREE.Color }[] = [];
  private seen = new Map<Enemy, { x: number; y: number; z: number; c: number }>();
  private gun = new THREE.Group(); private flash!: THREE.Mesh; private flashT = 0; private kick = 0;
  private tracers: { line: THREE.Line; life: number }[] = []; private ring!: THREE.Mesh;
  private dummy = new THREE.Object3D(); private tmpC = new THREE.Color(); private raf = 0; private last = 0; private alive = true;
  private el: Record<string, HTMLElement> = {}; private mini!: HTMLCanvasElement; private miniImg = new Image(); private miniT = 0;
  private ray = new THREE.Raycaster(); private v = new THREE.Vector3(); private v2 = new THREE.Vector3();

  constructor(readonly host: PossessHost, obj: Target) {
    this.g = host.g; this.obj = obj; this.isTower = obj instanceof Tower;
    this.root = document.createElement('div'); this.root.id = 'possess-root'; document.body.appendChild(this.root);
    document.body.classList.add('possess-on'); document.body.classList.toggle('ps-touch-on', this.touch);
    this.renderer = new THREE.WebGLRenderer({ antialias: !this.touch, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    this.pr = Math.min(devicePixelRatio, this.touch ? 1.25 : 1.75); this.renderer.setPixelRatio(this.pr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; this.renderer.domElement.className = 'p3d';
    this.root.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.05, 400); this.camera.rotation.order = 'YXZ';
    this.buildWorld(); this.buildGun(); this.buildPools(); this.buildHud(); this.bindInput();
    // face the nearest enemy (or the HQ's lanes) on entry
    const near = this.g.enemies.filter((e) => e.alive).sort((a, b) => (a.x - obj.x) ** 2 + (a.y - obj.y) ** 2 - ((b.x - obj.x) ** 2 + (b.y - obj.y) ** 2))[0];
    const look = near ?? { x: this.g.map.width / 2, y: this.g.map.height / 2 };
    this.yaw = Math.atan2(-(look.x - obj.x), -(look.y - obj.y));
    this.ctl.aim = Math.atan2(look.y - obj.y, look.x - obj.x);
    this.g.possessCtl(obj, this.ctl); this.g.speed = 1;
    this.resize(); addEventListener('resize', this.resize);
    logEvent(`possess: ${this.isTower ? 'tower ' + (obj as Tower).data.id : 'unit ' + (obj as Unit).data.id}`);
    this.last = performance.now(); this.raf = requestAnimationFrame(this.loop);
  }

  // ------------------------------------------------------------------ world (built once from the live map)
  private buildWorld() {
    const { scene, g } = this, W = g.map.width * S, D = g.map.height * S;
    scene.background = new THREE.Color(0x9fd3f0); scene.fog = new THREE.Fog(0x9fd3f0, 55, 170);
    scene.add(new THREE.HemisphereLight(0xdff2ff, 0x4a6a2a, 1.7));
    const sun = new THREE.DirectionalLight(0xfff1d6, 1.7); sun.position.set(-40, 80, 30); scene.add(sun);
    // floor: the map image itself (lanes, paths and decor are painted into it)
    const tex = new THREE.TextureLoader().load(assetUrl(g.map.image)); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D).rotateX(-Math.PI / 2).translate(W / 2, 0, D / 2), new THREE.MeshLambertMaterial({ map: tex }));
    floor.name = 'floor'; scene.add(floor);
    const skirt = new THREE.Mesh(new THREE.PlaneGeometry(900, 900).rotateX(-Math.PI / 2), lam(0x5f8f3a)); skirt.position.set(W / 2, -0.05, D / 2); scene.add(skirt);
    // boundary walls + a tree ring outside the map
    const wallM = lam(0x6b5a44);
    for (const [x, z, w, d] of [[W / 2, -0.4, W + 1.6, 0.8], [W / 2, D + 0.4, W + 1.6, 0.8], [-0.4, D / 2, 0.8, D], [W + 0.4, D / 2, 0.8, D]]) scene.add(at(new THREE.Mesh(new THREE.BoxGeometry(w, 1.1, d), wallM), x, 0.55, z));
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const spots: THREE.Vector3[] = [];
    for (let i = 0; i < 90; i++) { const a = (i / 90) * Math.PI * 2, rr = 1.04 + rnd() * 0.3; spots.push(new THREE.Vector3(W / 2 + Math.cos(a) * W * 0.6 * rr, 0, D / 2 + Math.sin(a) * D * 0.66 * rr)); }
    const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.25, 0.35, 2.4, 6).translate(0, 1.2, 0), lam(0x6b4a2a), spots.length);
    const crown = new THREE.InstancedMesh(new THREE.ConeGeometry(1.9, 4.6, 7).translate(0, 4.2, 0), lam(0x2f7a35), spots.length);
    spots.forEach((s, i) => { this.dummy.position.copy(s); this.dummy.rotation.set(0, rnd() * 6, 0); this.dummy.scale.setScalar(0.9 + rnd() * 0.8); this.dummy.updateMatrix(); trunk.setMatrixAt(i, this.dummy.matrix); crown.setMatrixAt(i, this.dummy.matrix); crown.setColorAt(i, this.tmpC.setHSL(0.28 + rnd() * 0.08, 0.45, 0.25 + rnd() * 0.12)); });
    scene.add(trunk, crown);
    // obstacles (rocks / logs) and garrisonable structures as extruded blocks
    for (const o of g.obstacles) if (o.alive) {
      const m = o.kind === 'rock' ? new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 0).scale(1.2, 0.8, 1.1), lam(0x7d7f86)) : new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 3.2, 8).rotateZ(Math.PI / 2), lam(0x7a5230));
      m.position.set(o.x * S, o.kind === 'rock' ? 0.7 : 0.4, o.y * S); m.rotation.y = -o.ang; m.userData.obs = o; scene.add(m);
    }
    for (const e of g.envs) { const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 2.6), lam(0x9a8a6a)); at(b, e.x * S, 0.9, e.y * S); scene.add(b); }
    // buildings (HQ keep + pads)
    const stone = lam(0x8b8f99), roof = lam(0x3a6fd0);
    for (const b of g.buildings) if (b.alive) {
      const grp = new THREE.Group();
      if (b.isHQ) {
        grp.add(at(new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), stone), 0, 2, 0));
        grp.add(at(new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 7, 8), stone), 0, 5.5, 0));
        grp.add(at(new THREE.Mesh(new THREE.ConeGeometry(2, 2.5, 8), roof), 0, 10.2, 0));
        grp.add(at(new THREE.Mesh(new THREE.PlaneGeometry(2, 1.2), new THREE.MeshLambertMaterial({ color: 0xffd84a, side: THREE.DoubleSide })), 1, 12, 0));
      } else { grp.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.4, 3.4), stone), 0, 1.2, 0)); grp.add(at(new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.4, 4).rotateY(Math.PI / 4), roof), 0, 3.1, 0)); }
      at(grp, b.x * S, 0, b.y * S); scene.add(grp);
    }
    // range ring on the ground around the possessed entity
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x7fe8ff, transparent: true, opacity: 0.55, depthWrite: false }));
    this.ring.position.y = 0.04; scene.add(this.ring);
  }

  private buildGun() {
    const dark = lam(0x2c3328), olive = lam(0x55663f), visor = new THREE.MeshBasicMaterial({ color: 0xffb53a });
    const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); this.gun.add(b); return b; };
    if (this.isTower) {
      const fc = new THREE.Color(factionInfo((this.obj as Tower).data.faction).color).getHex(), body = lam(fc);
      box(0.5, 0.2, 0.55, body, 0, -0.08, 0.05); for (const s of [-0.1, 0.1]) box(0.06, 0.06, 0.7, dark, s, 0, -0.45);
      box(0.2, 0.03, 0.04, visor, 0, 0.04, -0.2); this.gun.position.set(0, -0.32, -0.5);
    } else {
      box(0.11, 0.13, 0.62, olive, 0, 0, -0.1); box(0.05, 0.05, 0.38, dark, 0, 0.02, -0.55); box(0.07, 0.17, 0.09, dark, 0, -0.13, 0.02);
      box(0.06, 0.05, 0.14, dark, 0, 0.1, -0.05); box(0.03, 0.02, 0.06, visor, 0, 0.13, -0.05);
      box(0.15, 0.13, 0.5, lam(0x4f6b3a), 0.06, -0.2, 0.12).rotation.x = 0.35;
      this.gun.scale.setScalar(0.85); this.gun.position.set(0.22, -0.22, -0.45);
    }
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshBasicMaterial({ color: 0xffc860, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.flash.position.set(0, 0.02, this.isTower ? -0.85 : -0.78); this.flash.visible = false; this.gun.add(this.flash);
    this.camera.add(this.gun); this.scene.add(this.camera);
  }

  private buildPools() {
    const bloonGeo = new THREE.SphereGeometry(0.62, 12, 9); bloonGeo.scale(1, 1.18, 1);
    const knot = new THREE.ConeGeometry(0.12, 0.2, 6).translate(0, -0.78, 0).rotateX(Math.PI);
    this.bloonMesh = new THREE.InstancedMesh(mergeGeometries([bloonGeo, knot])!, new THREE.MeshLambertMaterial(), 800);
    const body = new THREE.SphereGeometry(0.55, 10, 8).scale(1.3, 0.7, 1).translate(0, 0.55, 0);
    const headG = new THREE.SphereGeometry(0.32, 8, 6).translate(0.75, 0.62, 0);
    const legs: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 6; i++) { const lx = -0.4 + (i % 3) * 0.4, s = i < 3 ? 1 : -1; legs.push(new THREE.BoxGeometry(0.08, 0.08, 0.7).translate(lx, 0.25, s * 0.55).rotateX(s * 0.3)); }
    this.bugMesh = new THREE.InstancedMesh(mergeGeometries([body, headG, ...legs].map((x) => x.index ? x.toNonIndexed() : x))!, new THREE.MeshLambertMaterial(), 300);
    // troops: capsule body + helmet visor
    const ub = new THREE.CapsuleGeometry(0.32, 0.9, 3, 8).translate(0, 0.78, 0), uh = new THREE.BoxGeometry(0.34, 0.12, 0.2).translate(0.2, 1.4, 0);
    this.unitMesh = new THREE.InstancedMesh(mergeGeometries([ub.toNonIndexed(), uh.toNonIndexed()])!, new THREE.MeshLambertMaterial(), 300);
    this.shotMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.14, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffe28a }), 500);
    this.bitMesh = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(0.16), new THREE.MeshBasicMaterial(), 500);
    for (const m of [this.bloonMesh, this.bugMesh, this.unitMesh, this.bitMesh]) m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(m.instanceMatrix.count * 3), 3);
    for (const m of [this.bloonMesh, this.bugMesh, this.unitMesh, this.shotMesh, this.bitMesh]) { m.count = 0; m.frustumCulled = false; this.scene.add(m); }
    const tm = new THREE.LineBasicMaterial({ color: 0xfff0a0, transparent: true });
    for (let i = 0; i < 8; i++) { const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), tm.clone()); line.visible = false; line.frustumCulled = false; this.scene.add(line); this.tracers.push({ line, life: 0 }); }
  }
  private bossModel(e: Enemy): THREE.Group {
    let m = this.bossModels.get(e); if (m) return m;
    m = new THREE.Group(); const col = BOSS_COL[e.data.id] ?? 0x8a3fd8;
    if (e.data.family === 'bloon' || e.data.air) { // blimp
      m.add(new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10).scale(1.9, 0.85, 0.85), lam(col)));
      for (const s of [-1, 1]) m.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.9), lam(0x222838)), -1.6, 0, s * 0.6));
      m.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.06), lam(0x222838)), -1.6, 0.4, 0));
    } else { // armoured boss bug
      m.add(new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10).scale(1.5, 0.75, 1.1), lam(col)));
      m.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), lam(0x2a2a2a)), 1.4, 0.15, 0));
      for (let i = 0; i < 6; i++) { const lx = -0.7 + (i % 3) * 0.7, s = i < 3 ? 1 : -1; m.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 1.3), lam(0x222222)), lx, -0.45, s * 1.0)); }
    }
    this.scene.add(m); this.bossModels.set(e, m); return m;
  }
  private towerModel(t: Tower) {
    let m = this.towerModels.get(t); if (m) return m;
    const root = new THREE.Group(), head = new THREE.Group(), fc = new THREE.Color(factionInfo(t.data.faction).color).getHex();
    root.add(at(new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 0.5, 10), lam(0x6d5a44)), 0, 0.25, 0));
    root.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 1.3, 8), lam(fc)), 0, 1.1, 0));
    head.add(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.9), lam(fc)));
    head.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 6).rotateZ(Math.PI / 2), lam(0x22262a)), 0.9, 0, 0));
    head.position.y = 2.0; root.add(head);
    this.scene.add(root); m = { root, head }; this.towerModels.set(t, m); return m;
  }

  // ------------------------------------------------------------------ HUD + input
  private buildHud() {
    const o = this.obj, name = this.isTower ? (o as Tower).t.name : (o as Unit).squad.data.tiers[this.g.unitTier((o as Unit).squad.data.id)].name;
    const abil = this.isTower ? [] : this.g.squadAbilities((o as Unit).squad);
    this.root.insertAdjacentHTML('beforeend', `
      <div class="ps-hud">
        <div class="ps-cross" id="ps-cross"><i></i></div>
        <div class="ps-top"><span class="ps-tag">👁 POSSESSED</span><span class="ps-chip">🌊 Wave <b id="ps-wave"></b></span>
          <span class="ps-chip">🏰 HQ <b id="ps-hq"></b><span class="ps-bar"><b id="ps-hqb"></b></span></span><span class="ps-chip">💰 <b id="ps-cash"></b></span><span class="ps-chip">🎯 <b id="ps-hits">0</b> hits</span></div>
        <div class="ps-btns"><button id="ps-pause" title="Pause">⏸</button><button class="ps-exit" id="ps-exit">⏏ Exit (Esc/E)</button></div>
        <div class="ps-me"><div class="nm">${name}</div><div class="hp"><b id="ps-hp"></b></div><div class="cd"><b id="ps-cd"></b></div>
          <small>${this.isTower ? 'Stationary turret' : 'WASD move · squad follows'} · direct hits +${Math.round((MANUAL_BONUS - 1) * 100)}% dmg · ammo ∞</small></div>
        <div class="ps-abil" id="ps-abil">${abil.map((id, i) => `<button data-ab="${id}">${ABILITIES[id].icon} ${ABILITIES[id].name}<br><small>${i === 0 ? 'Q / 1' : String(i + 1)}</small><i></i></button>`).join('')}</div>
        <div class="ps-help">Mouse aim · click/hold fire${this.isTower ? '' : ' · WASD move · Q/1-2 abilities'}<br>Esc or E: back to the 2D map · P pause</div>
        <div class="ps-msg" id="ps-msg" hidden></div>
      </div>
      <canvas class="ps-mini" id="ps-mini" width="180" height="${Math.round(180 * this.g.map.height / this.g.map.width)}"></canvas>
      <div class="ps-touch" id="ps-touch" ${this.touch ? '' : 'hidden'}>${this.isTower ? '' : '<div class="ps-joy home" id="ps-joy"><i></i></div>'}<button class="ps-fire" id="ps-fire">FIRE</button></div>
      <div class="ps-pause" id="ps-pause-ov" hidden><div class="panel"><h2>⏸ Paused</h2><div class="row"><button class="btn primary" id="ps-resume">▶ Resume</button><button class="btn" id="ps-pexit">⏏ Exit first-person</button></div></div></div>`);
    for (const id of ['cross', 'wave', 'hq', 'hqb', 'cash', 'hits', 'hp', 'cd', 'abil', 'msg', 'pause-ov', 'joy', 'fire']) this.el[id] = this.root.querySelector('#ps-' + id) as HTMLElement;
    this.mini = this.root.querySelector('#ps-mini') as HTMLCanvasElement; this.miniImg.src = assetUrl(this.g.map.image);
  }
  private setPause(on: boolean) { const g = this.g; if (g.netPause) g.netPause(on); else g.paused = on; }
  private bindInput() {
    const cv = this.renderer.domElement, $ = (id: string) => this.root.querySelector('#ps-' + id) as HTMLElement;
    $('exit').onclick = $('pexit').onclick = () => this.exit();
    $('pause').onclick = () => this.setPause(true);
    $('resume').onclick = () => { this.setPause(false); if (!this.touch) void cv.requestPointerLock?.(); };
    for (const id of ['exit', 'pause']) $(id).onpointerdown = (e) => e.stopPropagation();
    this.el.abil.querySelectorAll<HTMLButtonElement>('button').forEach((b) => { b.onpointerdown = (e) => e.stopPropagation(); b.onclick = () => this.ability(b.dataset.ab as AbilityId); });
    cv.addEventListener('mousedown', (e) => {
      if (this.touch || e.button !== 0) return;
      if (!this.locked) { void cv.requestPointerLock?.(); }
      this.firing = true;
    });
    addEventListener('mouseup', this.onUp);
    cv.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', this.onLock);
    addEventListener('mousemove', this.onMouse);
    addEventListener('keydown', this.onKey, true); addEventListener('keyup', this.onKeyUp, true);
    // touch: left 40% = move stick (troops), elsewhere = look drag; FIRE button
    const tl = $('touch');
    tl.addEventListener('pointerdown', (e) => {
      if (!this.isTower && e.clientX < innerWidth * 0.4 && this.joy.id < 0 && this.el.joy) { this.joy = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: 0, y: 0 }; this.el.joy.classList.remove('home'); Object.assign(this.el.joy.style, { display: 'block', left: e.clientX - 60 + 'px', top: e.clientY - 60 + 'px' }); }
      else if (this.lookId < 0) { this.lookId = e.pointerId; this.lookX = e.clientX; this.lookY = e.clientY; }
    });
    tl.addEventListener('pointermove', (e) => {
      if (e.pointerId === this.joy.id) {
        let dx = e.clientX - this.joy.ox, dy = e.clientY - this.joy.oy; const L = Math.hypot(dx, dy); if (L > 50) { dx *= 50 / L; dy *= 50 / L; }
        this.joy.x = dx / 50; this.joy.y = dy / 50; (this.el.joy.firstElementChild as HTMLElement).style.transform = `translate(${dx}px,${dy}px)`;
      } else if (e.pointerId === this.lookId) { this.look((e.clientX - this.lookX) * 2.2, (e.clientY - this.lookY) * 2.2); this.lookX = e.clientX; this.lookY = e.clientY; }
    });
    const up = (e: PointerEvent) => { if (e.pointerId === this.joy.id) { this.joy.id = -1; this.joy.x = this.joy.y = 0; this.el.joy.removeAttribute('style'); this.el.joy.classList.add('home'); (this.el.joy.firstElementChild as HTMLElement).style.transform = ''; } if (e.pointerId === this.lookId) this.lookId = -1; };
    tl.addEventListener('pointerup', up); tl.addEventListener('pointercancel', up);
    const fire = this.el.fire;
    fire.addEventListener('pointerdown', (e) => { e.stopPropagation(); this.firing = true; });
    fire.addEventListener('pointerup', () => { this.firing = false; }); fire.addEventListener('pointercancel', () => { this.firing = false; });
  }
  private onUp = () => { this.firing = false; };
  private onLock = () => { this.locked = document.pointerLockElement === this.renderer.domElement; if (!this.locked) this.firing = false; };
  private onMouse = (e: MouseEvent) => { if (this.locked && !this.g.paused) this.look(e.movementX, e.movementY); };
  private look(dx: number, dy: number) {
    this.yaw -= dx * 0.0022;
    // towers: turret pitch limits (can't look straight up/down); troops: wider head range
    const [lo, hi] = this.isTower ? [-0.85, 0.45] : [-1.2, 1.2];
    this.pitch = Math.max(lo, Math.min(hi, this.pitch - dy * 0.0022));
  }
  private onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.closest?.('input,textarea,#bug-report,.br-overlay')) return;
    const k = e.key.toLowerCase();
    e.stopImmediatePropagation(); // the 2D game's hotkeys (WASD pan, Space, Q...) don't apply while possessed
    if (k === 'escape' || k === 'e') { if (!e.repeat) this.exit(); return; }
    if (k === 'p') { this.setPause(!this.g.paused); return; }
    this.keys.add(k);
    if (k === ' ') e.preventDefault();
    if (!this.isTower) { const ab = this.g.squadAbilities((this.obj as Unit).squad); const i = k === 'q' ? 0 : /^[1-9]$/.test(k) ? +k - 1 : -1; if (i >= 0 && ab[i]) this.ability(ab[i]); }
  };
  private onKeyUp = (e: KeyboardEvent) => { this.keys.delete(e.key.toLowerCase()); e.stopImmediatePropagation(); };
  private ability(id: AbilityId) { if (this.obj instanceof Unit && this.g.useAbility(this.obj.squad, id)) logEvent('possess: ability ' + id); }
  private resize = () => { const w = innerWidth, h = innerHeight; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); };

  // ------------------------------------------------------------------ per-frame
  private loop = (now: number) => {
    if (!this.alive) return;
    const dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
    this.fpsAcc += dt; this.fpsN++; if (this.fpsAcc >= 0.5) { this.fps = this.fpsN / this.fpsAcc; this.fpsAcc = 0; this.fpsN = 0; this.governor(); }
    if (!this.tick(dt)) return;
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.loop);
  };
  private governor() {
    if (this.fps < 45) this.slow++; else this.slow = Math.max(0, this.slow - 1);
    if (this.slow >= 3 && this.pr > 0.6) { this.pr = Math.max(0.6, this.pr - 0.25); this.renderer.setPixelRatio(this.pr); this.resize(); this.slow = 0; }
  }
  /** Eye point (metres) of the possessed entity. */
  private eye(): THREE.Vector3 {
    const o = this.obj;
    if (o instanceof Tower) return this.v.set(o.x * S, 2.7 + o.tier * 0.15, o.y * S);
    return this.v.set(o.x * S, o.squad.data.vehicle ? 2.4 : 1.65, o.y * S);
  }
  /** Returns false once possession ended. */
  tick(dt: number): boolean {
    const g = this.g, o = this.obj;
    if (!o.alive || g.state !== 'playing' || (o.possessedBy >= 0 && o.possessedBy !== g.localPid && g.net !== 'solo')) { this.exit(o.alive ? undefined : `${this.isTower ? 'Tower' : 'Troop'} lost — back to the map`); return false; }
    if (g.speed !== 1) g.speed = 1;
    // camera
    const eye = this.eye(); this.camera.position.copy(eye); this.camera.rotation.set(this.pitch, this.yaw, 0);
    // crosshair ray -> enemy under the crosshair (manual direct hit) / aim point on the ground
    this.ray.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    let best: Enemy | null = null, bt = Infinity;
    const range = this.rangePx() * S * 1.3;
    for (const e of g.enemies) {
      if (!e.alive) continue;
      const c = this.v2.set(e.x * S, enemyY(e), e.y * S), r = enemyR(e) * (e.data.boss || e.data.id === 'moab' ? 2.2 : 1.25);
      const t = c.clone().sub(this.ray.ray.origin).dot(this.ray.ray.direction);
      if (t <= 0 || t > range + r || t >= bt) continue;
      if (this.ray.ray.distanceSqToPoint(c) < r * r) { bt = t; best = e; }
    }
    const d = this.ray.ray.direction;
    let aim = Math.atan2(d.z, d.x);
    if (best) aim = Math.atan2(best.y - o.y, best.x - o.x);
    else if (d.y < -0.02) { const t = -eye.y / d.y; aim = Math.atan2(eye.z + d.z * t - o.y * S, eye.x + d.x * t - o.x * S); }
    this.el.cross.classList.toggle('on', !!best);
    // movement (troops): camera-relative WASD / stick -> world axes (map px)
    let fx = 0, sx = 0;
    if (!this.isTower) {
      if (this.keys.has('w') || this.keys.has('arrowup')) fx += 1; if (this.keys.has('s') || this.keys.has('arrowdown')) fx -= 1;
      if (this.keys.has('d') || this.keys.has('arrowright')) sx += 1; if (this.keys.has('a') || this.keys.has('arrowleft')) sx -= 1;
      fx -= this.joy.y; sx += this.joy.x;
    }
    const fwx = -Math.sin(this.yaw), fwz = -Math.cos(this.yaw), rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
    const ctl: ManualCtl = { aim, fire: this.firing && !g.paused, target: best, mx: fwx * fx + rx * sx, my: fwz * fx + rz * sx };
    // host / solo: write straight into the sim every frame; co-op client: send ~15 Hz (+ instantly on trigger changes)
    this.sendT -= dt;
    if (g.net !== 'client' || this.sendT <= 0 || ctl.fire !== this.sentFire) { this.sendT = 1 / 15; this.sentFire = ctl.fire; this.ctl = ctl; g.possessCtl(o, ctl); }
    else if (o.manual) { o.manual.aim = aim; o.manual.mx = ctl.mx; o.manual.my = ctl.my; o.manual.target = best; } // local prediction
    // shot feedback (muzzle flash, tracer, hit marker)
    const shotNo = o instanceof Tower ? o.combat?.shotCount ?? 0 : g.stats.manualShots;
    if (this.lastShot < 0) this.lastShot = shotNo;
    if (shotNo !== this.lastShot) {
      this.lastShot = shotNo; this.shots++; this.flashT = 0.06; this.kick = 1;
      const end = best ? new THREE.Vector3(best.x * S, enemyY(best), best.y * S) : eye.clone().addScaledVector(d, Math.min(range, 40));
      this.tracer(this.gun.localToWorld(this.flash.position.clone()), end);
      if (best) { this.hits++; this.hitT = 0.15; }
    }
    this.hitT -= dt; this.el.cross.classList.toggle('hit', this.hitT > 0);
    this.flashT -= dt; this.flash.visible = this.flashT > 0; if (this.flash.visible) this.flash.rotation.z = Math.random() * 3;
    this.kick = Math.max(0, this.kick - dt * 9); this.gun.position.z = (this.isTower ? -0.5 : -0.45) + this.kick * 0.06; this.gun.rotation.x = this.kick * 0.08;
    this.syncEntities(dt);
    this.hud(dt);
    return true;
  }
  private rangePx(): number {
    const o = this.obj;
    if (o instanceof Tower) return o.t.combat ? o.range(o.t.combat.range) : 200;
    return o.range(this.g);
  }
  private tracer(a: THREE.Vector3, b: THREE.Vector3) {
    const tr = this.tracers.find((t) => t.life <= 0) ?? this.tracers[0];
    (tr.line.geometry as THREE.BufferGeometry).setFromPoints([a, b]); tr.life = 0.07; tr.line.visible = true;
  }
  /** Mirror the live sim into the instanced meshes. */
  private syncEntities(dt: number) {
    const g = this.g, D = this.dummy, me = this.obj;
    let nb = 0, ng = 0; const live = new Set<Enemy>();
    for (const e of g.enemies) {
      if (!e.alive) continue; live.add(e);
      const x = e.x * S, z = e.y * S, y = enemyY(e), id = e.data.id;
      if (e.data.boss || id === 'moab' || e.data.air) {
        const m = this.bossModel(e), k = Math.max(1, e.data.radius * S * 0.9);
        m.position.set(x, y, z); m.rotation.set(0, -e.ang, 0); m.scale.setScalar(k);
        this.seen.set(e, { x, y, z, c: BOSS_COL[id] ?? 0x8a3fd8 }); continue;
      }
      if (e.data.family === 'bloon') {
        if (nb >= 800) continue;
        const k = (enemyR(e) / 0.62) * 0.95, bob = Math.sin(performance.now() / 300 + e.uid) * 0.12;
        D.position.set(x, y + bob, z); D.rotation.set(0, 0, 0); D.scale.setScalar(k); D.updateMatrix();
        this.bloonMesh.setMatrixAt(nb, D.matrix); const c = BLOON_COL[id] ?? 0xe8352f; this.bloonMesh.setColorAt(nb++, this.tmpC.setHex(c));
        this.seen.set(e, { x, y, z, c });
      } else {
        if (ng >= 300) continue;
        const k = Math.max(0.6, e.data.radius * S * 1.6);
        D.position.set(x, 0, z); D.rotation.set(0, -e.ang, 0); D.scale.setScalar(k); D.updateMatrix();
        this.bugMesh.setMatrixAt(ng, D.matrix); const c = BUG_COL[id] ?? 0x7a4a2a; this.bugMesh.setColorAt(ng++, this.tmpC.setHex(c));
        this.seen.set(e, { x, y: 0.5, z, c });
      }
    }
    // popped / killed since last frame -> burst of bits
    for (const [e, p] of this.seen) if (!live.has(e)) { this.seen.delete(e); this.burst(p.x, p.y, p.z, p.c, e.data.boss ? 30 : 8); }
    for (const [e, m] of this.bossModels) if (!live.has(e)) { this.scene.remove(m); this.bossModels.delete(e); }
    this.bloonMesh.count = nb; this.bugMesh.count = ng;
    this.bloonMesh.instanceMatrix.needsUpdate = this.bugMesh.instanceMatrix.needsUpdate = true;
    if (this.bloonMesh.instanceColor) this.bloonMesh.instanceColor.needsUpdate = true; if (this.bugMesh.instanceColor) this.bugMesh.instanceColor.needsUpdate = true;
    // towers
    const tl = new Set<Tower>();
    for (const t of g.towers) {
      if (!t.alive) continue; tl.add(t); const m = this.towerModel(t);
      m.root.visible = t !== me; m.root.position.set(t.x * S, 0, t.y * S); m.root.scale.setScalar(1 + t.tier * 0.08); m.head.rotation.y = -t.aim;
    }
    for (const [t, m] of this.towerModels) if (!tl.has(t)) { this.scene.remove(m.root); this.towerModels.delete(t); }
    // troops (instanced), coloured by faction / co-op owner
    let nu = 0;
    for (const u of g.units) {
      if (!u.alive || u.garrison || u === me || nu >= 300) continue;
      if ((u.x - me.x) ** 2 + (u.y - me.y) ** 2 < 26 * 26) continue; // don't block the camera
      D.position.set(u.x * S, 0, u.y * S); D.rotation.set(0, u.facing > 0 ? 0 : Math.PI, 0); D.scale.setScalar(u.squad.data.vehicle ? 1.6 : 1); D.updateMatrix();
      this.unitMesh.setMatrixAt(nu, D.matrix);
      const col = g.net !== 'solo' && g.mode === 'coop' ? PCOLORS[u.squad.owner] ?? '#fff' : factionInfo(u.squad.data.faction).color;
      this.unitMesh.setColorAt(nu++, this.tmpC.set(col));
    }
    this.unitMesh.count = nu; this.unitMesh.instanceMatrix.needsUpdate = true; if (this.unitMesh.instanceColor) this.unitMesh.instanceColor.needsUpdate = true;
    // projectiles
    let np = 0;
    for (const p of g.projectiles) { if (!p.alive || np >= 500) continue; D.position.set(p.x * S, 1.6, p.y * S); D.rotation.set(0, 0, 0); D.scale.setScalar(1); D.updateMatrix(); this.shotMesh.setMatrixAt(np++, D.matrix); }
    this.shotMesh.count = np; this.shotMesh.instanceMatrix.needsUpdate = true;
    // particles
    let nbits = 0;
    for (const b of this.bits) {
      if (b.life <= 0) continue; b.life -= dt; b.vy -= 14 * dt; b.x += b.vx * dt; b.y = Math.max(0.05, b.y + b.vy * dt); b.z += b.vz * dt;
      D.position.set(b.x, b.y, b.z); D.rotation.set(b.life * 9, b.life * 7, 0); D.scale.setScalar(Math.max(0.1, b.life * 2)); D.updateMatrix();
      this.bitMesh.setMatrixAt(nbits, D.matrix); this.bitMesh.setColorAt(nbits++, b.c);
    }
    if (this.bits.length > 400) this.bits = this.bits.filter((b) => b.life > 0);
    this.bitMesh.count = nbits; this.bitMesh.instanceMatrix.needsUpdate = true; if (this.bitMesh.instanceColor) this.bitMesh.instanceColor.needsUpdate = true;
    for (const tr of this.tracers) if (tr.life > 0) { tr.life -= dt; if (tr.life <= 0) tr.line.visible = false; }
    // range ring
    const r = this.rangePx() * S; this.ring.position.x = me.x * S; this.ring.position.z = me.y * S; this.ring.scale.set(r, 1, r);
  }
  private burst(x: number, y: number, z: number, color: number, n: number) {
    for (let i = 0; i < n; i++) { if (this.bits.length > 480) break; const a = Math.random() * 6.283, s = 2 + Math.random() * 4; this.bits.push({ x, y, z, vx: Math.cos(a) * s, vy: 2 + Math.random() * 4, vz: Math.sin(a) * s, life: 0.5 + Math.random() * 0.3, c: new THREE.Color(color) }); }
  }
  private hud(dt: number) {
    const g = this.g, o = this.obj, w = g.waves;
    this.el.wave.textContent = w.freeplay ? `${w.index} (free)` : `${w.index}/${w.total}`;
    this.el.hq.textContent = String(Math.ceil(g.hq.health.hp)); this.el.hqb.style.width = `${Math.max(0, g.hq.health.frac) * 100}%`;
    this.el.cash.textContent = String(Math.floor(g.res.credits)); this.el.hits.textContent = String(this.hits);
    this.el.hp.style.width = `${Math.max(0, o.health.frac) * 100}%`;
    const cd = o instanceof Tower ? (o.combat ? 1 - Math.max(0, o.combat.cooldown) / Math.max(0.01, o.combat.period) : 1) : (() => { const t = g.unitTier(o.squad.data.id), per = 1 / (o.squad.data.tiers[t].stats.attackRate * o.rateMul); return 1 - Math.max(0, o.cooldown) / per; })();
    this.el.cd.style.width = `${Math.max(0, Math.min(1, cd)) * 100}%`;
    this.el['pause-ov'].hidden = !g.paused;
    if (g.paused && document.pointerLockElement) void document.exitPointerLock();
    if (o instanceof Unit) this.el.abil.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
      const id = b.dataset.ab as AbilityId, left = o.squad.abilityCd[id] ?? 0, tot = ABILITIES[id].cooldown ?? 1;
      b.disabled = left > 0; (b.querySelector('i') as HTMLElement).style.width = `${(1 - Math.min(1, left / tot)) * 100}%`;
    });
    this.el.msg.hidden = this.locked || this.touch || g.paused; if (!this.el.msg.hidden) this.el.msg.textContent = 'Click to aim & fire · Esc/E to exit';
    this.miniT -= dt; if (this.miniT <= 0) { this.miniT = 0.1; this.drawMini(); }
  }
  private drawMini() {
    const c = this.mini.getContext('2d'); if (!c) return;
    const g = this.g, k = this.mini.width / g.map.width;
    if (this.miniImg.complete && this.miniImg.naturalWidth) c.drawImage(this.miniImg, 0, 0, this.mini.width, this.mini.height); else { c.fillStyle = '#3d5a2a'; c.fillRect(0, 0, this.mini.width, this.mini.height); }
    c.fillStyle = '#fff'; for (const t of g.towers) if (t.alive) c.fillRect(t.x * k - 1.5, t.y * k - 1.5, 3, 3);
    c.fillStyle = '#7fd3ff'; for (const u of g.units) if (u.alive && !u.garrison) c.fillRect(u.x * k - 1, u.y * k - 1, 2, 2);
    for (const e of g.enemies) if (e.alive) { c.fillStyle = e.data.boss ? '#c070ff' : '#ff4a3a'; c.fillRect(e.x * k - 1.5, e.y * k - 1.5, e.data.boss ? 5 : 3, e.data.boss ? 5 : 3); }
    // me + view cone
    const o = this.obj, x = o.x * k, y = o.y * k, a = this.ctl.aim;
    c.fillStyle = '#ffe14a33'; c.beginPath(); c.moveTo(x, y); c.arc(x, y, 26, a - 0.6, a + 0.6); c.closePath(); c.fill();
    c.fillStyle = '#ffe14a'; c.strokeStyle = '#000'; c.beginPath(); c.arc(x, y, 4, 0, 6.283); c.fill(); c.stroke();
  }

  // ------------------------------------------------------------------ test hooks (window.__possess.cur)
  /** Turn the camera onto an enemy (or map point) — same as the player dragging the mouse there. */
  aimAt(x: number, y: number, h = 1.3) {
    const eye = this.eye().clone(), dx = x * S - eye.x, dz = y * S - eye.z;
    this.yaw = Math.atan2(-dx, -dz); this.pitch = 0; this.look(0, -Math.atan2(h - eye.y, Math.hypot(dx, dz)) / 0.0022);
  }
  aimNearest(): boolean {
    const o = this.obj, r = this.rangePx() * 1.2;
    const e = this.g.enemies.filter((x) => x.alive && (x.x - o.x) ** 2 + (x.y - o.y) ** 2 < r * r).sort((a, b) => (a.x - o.x) ** 2 + (a.y - o.y) ** 2 - ((b.x - o.x) ** 2 + (b.y - o.y) ** 2))[0];
    if (!e) return false; this.aimAt(e.x, e.y, enemyY(e)); return true;
  }
  setFire(on: boolean) { this.firing = on; }
  setMove(fwd: number, side: number) { this.joy.x = side; this.joy.y = -fwd; }
  state() {
    const o = this.obj;
    return { kind: this.isTower ? 'tower' : 'unit', id: o instanceof Tower ? o.data.id : o.data.id, x: o.x, y: o.y, hits: this.hits, shots: this.shots, fps: Math.round(this.fps), locked: this.locked, target: !!this.ctl.target, manual: !!o.manual, possessedBy: o.possessedBy, touch: this.touch };
  }

  /** Leave first person: release the entity back to its AI and restore the 2D view. */
  exit(msg?: string) {
    if (!this.alive) return; this.alive = false;
    cancelAnimationFrame(this.raf);
    removeEventListener('resize', this.resize); removeEventListener('keydown', this.onKey, true); removeEventListener('keyup', this.onKeyUp, true);
    removeEventListener('mousemove', this.onMouse); removeEventListener('mouseup', this.onUp); document.removeEventListener('pointerlockchange', this.onLock);
    if (document.pointerLockElement) void document.exitPointerLock();
    if (this.obj.alive) this.g.possessCtl(this.obj, null);
    this.scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); const mat = m.material as THREE.Material | THREE.Material[] | undefined; if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose?.(); });
    this.renderer.dispose(); this.renderer.forceContextLoss?.();
    this.root.remove(); document.body.classList.remove('possess-on', 'ps-touch-on');
    if (cur === this) cur = null;
    logEvent('possess: exit' + (msg ? ' (' + msg + ')' : ''));
    if (msg) this.g.toast(msg, '#ffd84a');
    this.host.onExit();
  }
}

let cur: Possess | null = null;
/** Enter first person from one of your towers / troops (replaces any current possession). */
export function possess(host: PossessHost, obj: Target): Possess | null {
  cur?.exit();
  try { cur = new Possess(host, obj); } catch (e) { console.error('possess failed', e); document.getElementById('possess-root')?.remove(); document.body.classList.remove('possess-on', 'ps-touch-on'); host.g.possessCtl(obj, null); host.g.toast('3D view unavailable on this device', '#ff8a6a'); cur = null; }
  (window as unknown as { __possess?: unknown }).__possess = { get cur() { return cur; }, exit: () => cur?.exit() };
  return cur;
}
export function current() { return cur; }
