// Entry point: boot assets, map select, input handling, main loop, test hooks.
import './style.css';
import { Game } from './game/Game';
import { Renderer, type ViewState } from './render/Renderer';
import { Hud } from './ui/Hud';
import { loadSprites, IMG } from './render/sprites';
import { assetUrl } from './assetUrl';
import { MAPS } from './data/maps';
import { validateAll } from './data/validate';
import { dist } from './core/math';
import type { Vec } from './core/types';

declare global { interface Window { __game?: ReturnType<typeof testHooks> } }

async function boot() {
  // Dev-time upgrade-rule validation (also enforced in `npm run build`).
  const issues = validateAll();
  if (issues.length) { console.warn(`[validate] ${issues.length} data issue(s):`); for (const i of issues) console.warn('  ' + i); }
  await loadSprites(MAPS.map((m) => m.image));
  const menu = document.getElementById('maps')!;
  for (const m of MAPS) {
    const b = document.createElement('button');
    b.className = 'map-pick'; b.dataset.map = m.id;
    b.innerHTML = `<img src="${assetUrl(m.image)}" alt=""><span>${m.name}</span>`;
    b.onclick = () => start(m.id);
    menu.appendChild(b);
  }
  const q = new URLSearchParams(location.search).get('map');
  if (q && MAPS.some((m) => m.id === q)) start(q);
}

function start(mapId: string) {
  document.getElementById('menu')!.classList.remove('show');
  const g = new Game(MAPS.find((m) => m.id === mapId)!);
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const view: ViewState = { placing: null, deploying: null, hoverCell: null, mouse: null, selTower: null, selSquad: null, selBuilding: null, selPad: null, power: null, rallyFor: null };
  const r = new Renderer(canvas, g);
  const hud = new Hud(g, view, document.body);
  window.addEventListener('resize', () => r.resize());
  new ResizeObserver(() => r.resize()).observe(canvas);
  // Start zoomed out on the whole battlefield, then the player can dive in.
  r.cam.zoom = r.minZoom; r.clamp();
  // On a narrow portrait screen the whole map would be a thin strip: open on the
  // base at a height-fit zoom instead (pinch out / minimap still show everything).
  if (r.vw < 700 && r.vh > r.vw) r.focus(g.hq.x - r.vw / (2 * (r.vh / g.map.height)) + 120, g.hq.y, r.vh / g.map.height);

  // ------------------------------------------------------------ camera input
  // Pointer events cover mouse + touch + pen. Left-drag (>6px) pans, a tap is a
  // click, two fingers pinch-zoom, wheel zooms about the cursor, screen edges
  // and WASD / arrows pan, the minimap jumps the camera.
  const local = (ev: { clientX: number; clientY: number }) => { const b = canvas.getBoundingClientRect(); return { x: ev.clientX - b.left, y: ev.clientY - b.top }; };
  const toMap = (ev: { clientX: number; clientY: number }): Vec => { const l = local(ev); return r.screenToWorld(l.x, l.y); };
  const ptrs = new Map<number, { x: number; y: number; sx: number; sy: number; moved: boolean; button: number }>();
  let pinch: { d: number; zoom: number } | null = null, edge: { x: number; y: number } | null = null, dragging = false;
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', (ev) => {
    const l = local(ev);
    ptrs.set(ev.pointerId, { x: l.x, y: l.y, sx: l.x, sy: l.y, moved: false, button: ev.button });
    canvas.setPointerCapture?.(ev.pointerId);
    if (ptrs.size === 2) { const [p1, p2] = [...ptrs.values()]; pinch = { d: Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1, zoom: r.cam.zoom }; }
  });
  canvas.addEventListener('pointermove', (ev) => {
    const l = local(ev), p = r.screenToWorld(l.x, l.y);
    if (ev.pointerType === 'mouse') { view.mouse = p; view.hoverCell = view.placing ? g.grid.snap(p) : null; edge = l; }
    const pt = ptrs.get(ev.pointerId); if (!pt) return;
    if (ptrs.size >= 2 && pinch) {
      pt.x = l.x; pt.y = l.y; pt.moved = true;
      const [p1, p2] = [...ptrs.values()], d = Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1;
      const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2;
      r.zoomAt(cx, cy, (pinch.zoom * (d / pinch.d)) / r.cam.zoom);
      return;
    }
    const dx = l.x - pt.x, dy = l.y - pt.y;
    if (!pt.moved && Math.hypot(l.x - pt.sx, l.y - pt.sy) > (ev.pointerType === 'mouse' ? 6 : 10)) pt.moved = true;
    if (pt.moved && (pt.button === 0 || pt.button === 1)) { r.pan(-dx, -dy); dragging = true; }
    pt.x = l.x; pt.y = l.y;
    if (ev.pointerType !== 'mouse') { view.mouse = p; view.hoverCell = view.placing ? g.grid.snap(p) : null; }
  });
  const up = (ev: PointerEvent) => {
    const pt = ptrs.get(ev.pointerId); ptrs.delete(ev.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (!pt || ev.type === 'pointercancel') return;
    if (!pt.moved && !pinch && ptrs.size === 0 && pt.button === 0) click(toMap(ev), ev.shiftKey);
    setTimeout(() => { dragging = false; }, 0);
  };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', (ev) => { if (ev.pointerType === 'mouse') { view.mouse = null; view.hoverCell = null; edge = null; } });
  canvas.addEventListener('wheel', (ev) => { ev.preventDefault(); const l = local(ev); r.zoomAt(l.x, l.y, Math.exp(-ev.deltaY * 0.0015)); }, { passive: false });
  canvas.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    if (view.placing || view.deploying || view.power || view.rallyFor) { view.placing = view.deploying = null; view.power = null; view.rallyFor = null; hud.refresh(true); return; }
    if (view.selSquad) g.moveSquad(view.selSquad, toMap(ev));
    else if (view.selBuilding?.data.id === 'barracks') g.setRally(view.selBuilding, toMap(ev));
  });
  void dragging;
  const keys = new Set<string>();
  window.addEventListener('keyup', (ev) => keys.delete(ev.key.toLowerCase()));
  window.addEventListener('blur', () => keys.clear());

  function click(p: Vec, keep = false) {
    if (view.power) {
      const id = view.power;
      if (g.castPower(id, p)) view.power = null;
      hud.refresh(true); return;
    }
    if (view.rallyFor) { g.setRally(view.rallyFor, p); view.rallyFor = null; hud.refresh(true); return; }
    if (view.placing) {
      const cell = g.grid.snap(p);
      if (cell && g.placeTower(view.placing, cell)) { if (!keep) view.placing = null; }
      else if (!cell) g.toast("Can't build there");
      hud.refresh(true); return;
    }
    if (view.deploying) {
      const sq = g.deploySquad(view.deploying, p); view.deploying = null;
      if (sq) hud.select(null, sq); else hud.refresh(true);
      return;
    }
    const pk = g.pickups.find((k) => k.alive && dist(k, p) < 24);
    if (pk) { pk.collect(g, 1, 'click'); return; }
    const c = g.grid.worldToCell(p), tw = g.grid.occupant(c.c, c.r);
    if (tw) { hud.select(tw, null); return; }
    const u = g.units.filter((u) => !u.garrison).sort((a, b) => dist(a, p) - dist(b, p))[0];
    if (u && dist(u, p) < 26) { hud.select(null, u.squad); return; }
    const bl = g.buildings.find((b) => Math.abs(b.x - p.x) < (b.isHQ ? 100 : 62) && p.y > b.y - (b.isHQ ? 150 : 110) && p.y < b.y + (b.isHQ ? 80 : 56));
    if (bl && !view.selSquad) { hud.selectBase(bl, null); return; }
    const pad = g.pads.find((pd) => !pd.building && dist(pd, p) < 56);
    if (pad && !view.selSquad) { hud.selectBase(null, pad); return; }
    if (view.selSquad) { g.moveSquad(view.selSquad, p); return; }
    hud.select(null, null);
  }
  window.addEventListener('keydown', (ev) => {
    const k = ev.key.toLowerCase();
    if ((ev.target as HTMLElement)?.tagName === 'INPUT') return;
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) { keys.add(k); if (k.startsWith('arrow')) ev.preventDefault(); return; }
    if (ev.key === 'Escape') { view.placing = view.deploying = null; view.power = null; view.rallyFor = null; hud.select(null, null); }
    else if (ev.key === ' ') { ev.preventDefault(); g.waves.start(g); }
    else if (k === 'u' && view.selTower) { view.selTower.upgrade(g); hud.refresh(true); }
    else if (k === 'u' && view.selBuilding) { view.selBuilding.upgrade(g); hud.refresh(true); }
    else if ((ev.key === 'Delete' || ev.key === 'Backspace') && view.selTower) { g.sellTower(view.selTower); hud.select(null, null); }
    else if (k === 't' && view.selTower) { g.cycleTargeting(view.selTower); hud.refresh(true); }
    else if (k === 'o') g.orderOrganizeFarms();
    else if (k === 'm') { view.power = 'mac'; hud.refresh(true); }
    else if (k === 'h') { view.power = 'heal'; hud.refresh(true); }
    else if (k === 'b') { r.focus(g.hq.x - 200, g.hq.y, Math.max(r.minZoom, 0.8)); }
    else if (k === 'z' || k === '0') { r.cam.zoom = r.minZoom; r.clamp(); }
    else if (k === '=' || k === '+') r.zoomAt(r.vw / 2, r.vh / 2, 1.2);
    else if (k === '-') r.zoomAt(r.vw / 2, r.vh / 2, 1 / 1.2);
  });

  // ------------------------------------------------------------ minimap
  const mm = document.getElementById('minimap') as HTMLCanvasElement | null;
  const mctx = mm?.getContext('2d') ?? null;
  const mmScale = () => (mm ? mm.width / g.map.width : 1);
  if (mm) {
    const bgIm = IMG['map:' + g.map.image];
    const mmJump = (ev: PointerEvent) => { const b = mm.getBoundingClientRect(); const k = g.map.width / b.width; r.focus((ev.clientX - b.left) * k, (ev.clientY - b.top) * k); };
    let mmDown = false;
    mm.style.touchAction = 'none';
    mm.addEventListener('pointerdown', (ev) => { mmDown = true; mm.setPointerCapture?.(ev.pointerId); mmJump(ev); ev.stopPropagation(); });
    mm.addEventListener('pointermove', (ev) => { if (mmDown) mmJump(ev); });
    mm.addEventListener('pointerup', () => { mmDown = false; });
    mm.height = Math.round(mm.width * (g.map.height / g.map.width));
    void bgIm;
  }
  let mmT = 0;
  function drawMinimap() {
    if (!mm || !mctx) return;
    const k = mmScale(), bgIm = IMG['map:' + g.map.image];
    if (bgIm) mctx.drawImage(bgIm, 0, 0, mm.width, mm.height);
    mctx.fillStyle = 'rgba(0,0,0,0.15)'; mctx.fillRect(0, 0, mm.width, mm.height);
    for (const b of g.buildings) { mctx.fillStyle = b.isHQ ? '#7fd3ff' : '#cfeeff'; const s = b.isHQ ? 7 : 4; mctx.fillRect(b.x * k - s, b.y * k - s, s * 2, s * 2); }
    for (const p of g.pads) if (!p.building) { mctx.strokeStyle = 'rgba(127,211,255,0.8)'; mctx.strokeRect(p.x * k - 3, p.y * k - 3, 6, 6); }
    mctx.fillStyle = '#ffe14d'; for (const t of g.towers) mctx.fillRect(t.x * k - 1.5, t.y * k - 1.5, 3, 3);
    mctx.fillStyle = '#5fd0ff'; for (const u of g.units) mctx.fillRect(u.x * k - 1, u.y * k - 1, 2, 2);
    for (const e of g.enemies) { mctx.fillStyle = e.data.boss ? '#ff2a2a' : e.data.family === 'bug' ? '#ff8a3a' : '#ff5a8a'; const s = e.data.boss ? 3 : 1.5; mctx.fillRect(e.x * k - s, e.y * k - s, s * 2, s * 2); }
    const tl = r.screenToWorld(0, 0), br = r.screenToWorld(r.vw, r.vh);
    mctx.strokeStyle = '#fff'; mctx.lineWidth = 1.5; mctx.strokeRect(tl.x * k, tl.y * k, (br.x - tl.x) * k, (br.y - tl.y) * k);
  }

  let last = performance.now();
  function frame(now: number) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    g.update(dt);
    hud.update(dt);
    // keyboard + screen-edge panning (speed in screen px / s)
    const sp = 900 * dt;
    let px = 0, py = 0;
    if (keys.has('a') || keys.has('arrowleft')) px -= sp; if (keys.has('d') || keys.has('arrowright')) px += sp;
    if (keys.has('w') || keys.has('arrowup')) py -= sp; if (keys.has('s') || keys.has('arrowdown')) py += sp;
    if (edge && ptrs.size === 0 && document.hasFocus()) {
      const E = 18;
      if (edge.x < E) px -= sp * 0.8; else if (edge.x > r.vw - E) px += sp * 0.8;
      if (edge.y < E) py -= sp * 0.8; else if (edge.y > r.vh - E) py += sp * 0.8;
    }
    if (px || py) r.pan(px, py);
    r.draw(view);
    mmT -= dt; if (mmT <= 0) { mmT = 0.1; drawMinimap(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.__game = testHooks(g, view, hud, click, r);
}

/** Automation hooks for the headless Playwright playtest (and for debugging in devtools). */
function testHooks(g: Game, view: ViewState, hud: Hud, click: (p: Vec) => void, r: Renderer) {
  return {
    g,
    click,
    placeTower: (id: string, c: number, r: number) => !!g.placeTower(id, { c, r }),
    freeCells: () => { const out: [number, number][] = []; for (let r = 0; r < g.grid.rows; r++) for (let c = 0; c < g.grid.cols; c++) if (g.grid.isFree(c, r)) out.push([c, r]); return out; },
    deploy: (id: string, x: number, y: number) => !!g.deploySquad(id, { x, y }),
    organize: () => g.orderOrganizeFarms(),
    startWave: () => g.waves.start(g),
    setSpeed: (n: number) => { g.speed = n; },
    addCredits: (n: number) => g.res.add(n),
    upgradeAll: () => { let n = 0; for (const t of g.towers) if (t.upgrade(g)) n++; return n; },
    research: (id: string) => g.researchUnit(id),
    selectTower: (i: number) => hud.select(g.towers[i] ?? null, null),
    selectSquad: (i: number) => hud.select(null, g.squads[i] ?? null),
    garrison: (i: number) => g.garrisonSquad(g.squads[i]),
    setView: (p: Partial<ViewState>) => Object.assign(view, p),
    farmCells: () => g.farms().map((f) => [f.cell.c, f.cell.r]),
    // camera (e2e converts world -> CSS px in the canvas)
    worldToScreen: (x: number, y: number) => r.worldToScreen(x, y),
    camFocus: (x: number, y: number, zoom?: number) => r.focus(x, y, zoom),
    camReset: () => { r.cam.zoom = r.minZoom; r.clamp(); },
    cam: () => ({ ...r.cam, minZoom: r.minZoom, vw: r.vw, vh: r.vh }),
    // base layer
    pads: () => g.pads.map((p) => ({ x: p.x, y: p.y, state: p.state, kind: p.building?.data.id ?? null })),
    build: (pad: number, id: string) => !!g.buildOnPad(g.pads[pad], id as 'supply'),
    finishBuilds: () => { for (const b of g.buildings) if (b.build) b.build.t = b.build.dur; },
    upgradeBuilding: (i: number) => g.buildings[i]?.upgrade(g) ?? false,
    train: (bIdx: number, unitId: string) => g.buildingsOf('barracks')[bIdx]?.enqueue(g, unitId) ?? false,
    power: (id: 'mac' | 'heal', x: number, y: number) => g.castPower(id, { x, y }),
    addEnergy: (n: number) => { g.energy = Math.min(100, g.energy + n); },
    lanePoint: (lane: number, frac: number) => { const p = g.paths[lane % g.paths.length]; return p.at(p.length * frac); },
    lanes: () => g.paths.length,
    state: () => ({
      credits: Math.floor(g.res.credits), lives: g.lives, wave: g.waves.index, waveActive: g.waves.active, state: g.state,
      towers: g.towers.length, units: g.units.length, squads: g.squads.length, enemies: g.enemies.length, kills: g.stats.kills,
      organizes: g.stats.organizes, pickups: g.stats.pickups, offline: g.towers.filter((t) => t.disabled).length,
      buffed: g.towers.filter((t) => t.buffs.count > 0).length + g.units.filter((u) => u.buffs.count > 0).length,
      garrisoned: g.units.filter((u) => u.garrison).length, sliding: g.towers.filter((t) => t.slide).length,
      hq: Math.ceil(g.hq.health.hp), hqMax: g.hq.health.max, pop: g.pop, popCap: g.popCap, tech: g.tech, energy: Math.floor(g.energy),
      buildings: g.buildings.map((b) => `${b.data.id}:${b.tier}${b.build ? '*' : ''}`), queued: g.buildings.reduce((n, b) => n + b.queue.length, 0),
      held: g.buildings.flatMap((b) => b.queue.filter((o) => o.held).map((o) => o.held)), trained: g.stats.trained, macHits: g.stats.macHits, supplyIncome: g.stats.supplyIncome,
      decals: g.decals.length, strikes: g.strikes.length,
    }),
  };
}

boot();
