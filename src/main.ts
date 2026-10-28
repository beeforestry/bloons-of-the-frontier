// Entry point: boot assets, map select, input handling, main loop, test hooks.
import './style.css';
import { Game } from './game/Game';
import { Renderer, dmgTextPx, type ViewState } from './render/Renderer';
import { Hud } from './ui/Hud';
import { loadSprites, IMG } from './render/sprites';
import { assetUrl } from './assetUrl';
import { MAPS } from './data/maps';
import { validateAll } from './data/validate';
import { dist } from './core/math';
import type { AbilityId, Formation, Stance, TargetingMode, Vec } from './core/types';
import { Sfx } from './audio/Sfx';
import type { Squad } from './entities/Unit';
import type { Garrisonable } from './entities/Garrison';
import { towerById } from './data/towers';
import { DIFFICULTIES, difficultyById, type DifficultyId } from './data/difficulty';
import { Tutorial, TUTORIAL_KEY } from './ui/Tutorial';
import { ENEMIES } from './data/enemies';

const LS = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* */ } } };

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
    b.onclick = () => start(m.id, diff);
    menu.appendChild(b);
  }
  // Difficulty select (remembered). Medium is the default so a bare map click = Medium.
  const qs = new URLSearchParams(location.search);
  let diff = (qs.get('diff') ?? LS.get('bof.difficulty') ?? 'medium') as DifficultyId;
  if (!DIFFICULTIES.some((d) => d.id === diff)) diff = 'medium';
  const dEl = document.getElementById('diffs')!;
  const paint = () => { for (const b of Array.from(dEl.children) as HTMLElement[]) b.classList.toggle('on', b.dataset.diff === diff); };
  for (const d of DIFFICULTIES) {
    const b = document.createElement('button'); b.className = 'diff-pick'; b.dataset.diff = d.id;
    b.innerHTML = `${d.icon} <b>${d.name}</b><small>${d.waves} waves · ${d.blurb}</small>`;
    b.onclick = () => { diff = d.id; LS.set('bof.difficulty', diff); paint(); };
    dEl.appendChild(b);
  }
  paint();
  document.getElementById('btn-tutorial')!.onclick = () => { LS.set(TUTORIAL_KEY, '0'); start('garden', diff, true); };
  const q = qs.get('map');
  if (q && MAPS.some((m) => m.id === q)) start(q, diff);
}

function start(mapId: string, diffId: DifficultyId = 'medium', forceTutorial = false) {
  document.getElementById('menu')!.classList.remove('show');
  const g = new Game(MAPS.find((m) => m.id === mapId)!, difficultyById(diffId));
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const view: ViewState = { placing: null, deploying: null, hoverCell: null, mouse: null, selTower: null, selSquad: null, selBuilding: null, selPad: null, power: null, rallyFor: null,
    selSquads: [], box: null, boxMode: false, queueMode: false, patrolMode: false, patrolPts: [], showFps: false };
  // WebAudio SFX (unlocked on first input); the counter lets the e2e verify cues fire headless.
  const sfx = new Sfx(), sfxCount: Record<string, number> = {};
  g.sfxHook = (n) => { sfxCount[n] = (sfxCount[n] ?? 0) + 1; sfx.play(n); };
  // Voice lines ("Orders received!", "Moving out!", "Under attack!") via speechSynthesis; toggle 🗣.
  let voiceOn = LS.get('bof.voice') !== '0', lastVoice = 0, lastLine = '';
  const voiceLog: string[] = [];
  const vBtn = document.getElementById('btn-voice');
  const syncVoice = () => { if (vBtn) { vBtn.classList.toggle('on', voiceOn); vBtn.textContent = voiceOn ? '🗣' : '🔇'; vBtn.title = `Unit voice lines: ${voiceOn ? 'on' : 'off'}`; } };
  vBtn?.addEventListener('click', () => { voiceOn = !voiceOn; LS.set('bof.voice', voiceOn ? '1' : '0'); syncVoice(); if (!voiceOn) try { speechSynthesis.cancel(); } catch { /* */ } });
  syncVoice();
  g.voiceHook = (line) => {
    const now = performance.now();
    if (now - lastVoice < 2500 || (line === lastLine && now - lastVoice < 8000)) return;
    lastVoice = now; lastLine = line; voiceLog.push(line);
    if (!voiceOn || sfx.muted) return;
    try { const u = new SpeechSynthesisUtterance(line); u.rate = 1.15; u.pitch = 0.8; u.volume = 0.8; speechSynthesis.speak(u); } catch { /* no TTS */ }
  };
  const unlock = () => sfx.unlock();
  window.addEventListener('pointerdown', unlock); window.addEventListener('keydown', unlock);
  const r = new Renderer(canvas, g);
  const hud = new Hud(g, view, document.body);
  window.addEventListener('resize', () => r.resize());
  new ResizeObserver(() => r.resize()).observe(canvas);
  // Start zoomed out on the whole battlefield, then the player can dive in.
  r.cam.zoom = r.minZoom; r.clamp();
  // On a narrow portrait screen the whole map would be a thin strip: open on the
  // base at a height-fit zoom instead (pinch out / minimap still show everything).
  if (r.vw < 700 && r.vh > r.vw) r.focus(g.hq.x - r.vw / (2 * (r.vh / g.map.height)) + 120, g.hq.y, r.vh / g.map.height);

  // ------------------------------------------------------------ input
  // Mouse: left-click selects / commands, LEFT-DRAG box-selects troops (smooth box,
  // corner brackets, select chirp), right-click = move / garrison (Shift queues),
  // right- or middle-drag pans, wheel zooms. Touch: tap = click, one-finger drag pans
  // (or box-selects when the ⬚ Select mode button is on), long-press (500 ms) queues
  // a waypoint, two fingers pinch-zoom. WASD / arrows / screen edges pan.
  const local = (ev: { clientX: number; clientY: number }) => { const b = canvas.getBoundingClientRect(); return { x: ev.clientX - b.left, y: ev.clientY - b.top }; };
  const toMap = (ev: { clientX: number; clientY: number }): Vec => { const l = local(ev); return r.screenToWorld(l.x, l.y); };
  type Ptr = { x: number; y: number; sx: number; sy: number; moved: boolean; button: number; touch: boolean; box: boolean; lp: number; long: boolean };
  const ptrs = new Map<number, Ptr>();
  let pinch: { d: number; zoom: number } | null = null, edge: { x: number; y: number } | null = null;
  canvas.style.touchAction = 'none';
  const busy = () => !!(view.placing || view.deploying || view.power || view.rallyFor);
  canvas.addEventListener('pointerdown', (ev) => {
    const l = local(ev), touch = ev.pointerType !== 'mouse';
    const pt: Ptr = { x: l.x, y: l.y, sx: l.x, sy: l.y, moved: false, button: ev.button, touch, box: false, lp: 0, long: false };
    ptrs.set(ev.pointerId, pt);
    canvas.setPointerCapture?.(ev.pointerId);
    if (ptrs.size === 2) { for (const q of ptrs.values()) { clearTimeout(q.lp); q.box = false; } view.box = null; const [p1, p2] = [...ptrs.values()]; pinch = { d: Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1, zoom: r.cam.zoom }; }
    if (touch && ptrs.size === 1 && view.selSquads.length && !busy()) {
      const at = toMap(ev);
      pt.lp = window.setTimeout(() => {
        if (pt.moved || ptrs.size !== 1) return;
        pt.long = true; navigator.vibrate?.(20);
        if (view.patrolMode) view.patrolPts.push(at); else g.moveGroup(view.selSquads, at, true);
        g.sfx('command'); hud.refresh(true);
      }, 500);
    }
  });
  canvas.addEventListener('pointermove', (ev) => {
    const l = local(ev), p = r.screenToWorld(l.x, l.y);
    if (ev.pointerType === 'mouse') {
      view.mouse = p; view.hoverCell = view.placing ? g.grid.snap(p) : null; edge = l;
      // energy orbs and credit crates collect on hover (scrap needs infantry to gather it)
      const rr = 30 / Math.max(0.5, r.cam.zoom);
      for (const pk of g.pickups) if (pk.alive && pk.kind !== 'scrap' && Math.abs(pk.x - p.x) < rr && Math.abs(pk.y - p.y) < rr && dist(pk, p) < rr) { pk.collect(g, 1, 'hover'); g.stats.hover++; }
    }
    const pt = ptrs.get(ev.pointerId); if (!pt) return;
    if (ptrs.size >= 2 && pinch) {
      pt.x = l.x; pt.y = l.y; pt.moved = true;
      const [p1, p2] = [...ptrs.values()], d = Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1;
      const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2;
      r.zoomAt(cx, cy, (pinch.zoom * (d / pinch.d)) / r.cam.zoom);
      return;
    }
    const dx = l.x - pt.x, dy = l.y - pt.y;
    if (!pt.moved && Math.hypot(l.x - pt.sx, l.y - pt.sy) > (pt.touch ? 10 : 6)) {
      pt.moved = true; clearTimeout(pt.lp);
      // decide drag kind once: box-select or pan
      pt.box = !busy() && ((!pt.touch && pt.button === 0) || (pt.touch && view.boxMode));
      if (pt.box) { const a = r.screenToWorld(pt.sx, pt.sy); view.box = { x0: a.x, y0: a.y, x1: p.x, y1: p.y }; }
    }
    if (pt.moved) {
      if (pt.box && view.box) { view.box.x1 = p.x; view.box.y1 = p.y; }
      else r.pan(-dx, -dy);
    }
    pt.x = l.x; pt.y = l.y;
    if (ev.pointerType !== 'mouse') { view.mouse = p; view.hoverCell = view.placing ? g.grid.snap(p) : null; }
  });
  const up = (ev: PointerEvent) => {
    const pt = ptrs.get(ev.pointerId); ptrs.delete(ev.pointerId);
    if (pt) clearTimeout(pt.lp);
    if (ptrs.size < 2) pinch = null;
    if (!pt || ev.type === 'pointercancel') { view.box = null; return; }
    if (pt.box && view.box) { const b = view.box; view.box = null; boxSelect(b.x0, b.y0, b.x1, b.y1, ev.shiftKey); return; }
    if (pt.long || pt.moved || pinch || ptrs.size) return;
    if (pt.button === 0) click(toMap(ev), ev.shiftKey);
    else if (pt.button === 2) command(toMap(ev), ev.shiftKey);
  };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', (ev) => { if (ev.pointerType === 'mouse') { view.mouse = null; view.hoverCell = null; edge = null; } });
  canvas.addEventListener('wheel', (ev) => { ev.preventDefault(); const l = local(ev); r.zoomAt(l.x, l.y, Math.exp(-ev.deltaY * 0.0015)); }, { passive: false });
  canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());
  const keys = new Set<string>();
  window.addEventListener('keyup', (ev) => keys.delete(ev.key.toLowerCase()));
  window.addEventListener('blur', () => keys.clear());

  /** Select every (non-worker) troop squad inside a world-space box. */
  function boxSelect(x0: number, y0: number, x1: number, y1: number, add = false): number {
    const xa = Math.min(x0, x1), xb = Math.max(x0, x1), ya = Math.min(y0, y1), yb = Math.max(y0, y1);
    const hit = new Set<Squad>();
    for (const u of g.units) if (u.alive && u.dropT <= 0 && u.x >= xa - 8 && u.x <= xb + 8 && u.y >= ya - 8 && u.y <= yb + 8) hit.add(u.squad);
    let list = [...hit];
    if (list.some((q) => q.data.role !== 'worker')) list = list.filter((q) => q.data.role !== 'worker');
    if (add) list = [...new Set([...view.selSquads.filter((q) => q.alive), ...list])];
    if (!list.length) { hud.select(null, null); return 0; }
    hud.select(null, list[0], list);
    g.fx({ kind: 'ring', x: (xa + xb) / 2, y: (ya + yb) / 2, r: Math.max(xb - xa, yb - ya) / 2, color: '#7fd3ff', dur: 0.3 });
    return list.length;
  }
  function garrisonableAt(p: Vec): Garrisonable | null {
    const c = g.grid.worldToCell(p), tw = g.grid.occupant(c.c, c.r);
    if (tw && tw.gSlots() > 0) return tw;
    return g.envs.find((e) => dist(e, p) < 70) ?? null;
  }
  /** Right-click / command: garrison the structure under the cursor, else move (Shift queues). */
  function command(p: Vec, queue = false) {
    if (busy()) { view.placing = view.deploying = null; view.power = null; view.rallyFor = null; hud.refresh(true); return; }
    const sqs = view.selSquads.filter((q) => q.alive);
    if (sqs.length) {
      if (view.patrolMode) { view.patrolPts.push(p); g.sfx('command'); return; }
      const gs = garrisonableAt(p);
      if (gs) { for (const q of sqs) g.garrisonSquad(q, gs); return; }
      g.moveGroup(sqs, p, queue || view.queueMode); g.sfx('command'); return;
    }
    if (view.selBuilding?.data.id === 'barracks') g.setRally(view.selBuilding, p);
  }
  function click(p: Vec, keep = false) {
    if (view.power) {
      const id = view.power;
      if (g.castPower(id, p)) { view.power = null; g.sfx('ability'); }
      hud.refresh(true); return;
    }
    if (view.rallyFor) { g.setRally(view.rallyFor, p); view.rallyFor = null; g.sfx('command'); hud.refresh(true); return; }
    if (view.placing) {
      if (towerById(view.placing).kind === 'path') { if (g.placeBarrier(view.placing, p) && !keep) view.placing = null; hud.refresh(true); return; }
      const cell = g.grid.snap(p);
      if (cell && g.placeTower(view.placing, cell)) { if (!keep) view.placing = null; }
      else if (!cell) { g.toast("Can't build there"); g.sfx('error'); }
      hud.refresh(true); return;
    }
    if (view.deploying) {
      const sq = g.deploySquad(view.deploying, p); view.deploying = null;
      if (sq) { hud.select(null, sq); g.sfx('command'); } else hud.refresh(true);
      return;
    }
    const pk = g.pickups.find((k) => k.alive && dist(k, p) < 26);
    if (pk) { pk.collect(g, 1, 'click'); return; }
    const sqs = view.selSquads.filter((q) => q.alive);
    if (sqs.length && view.patrolMode) { view.patrolPts.push(p); g.sfx('command'); hud.refresh(true); return; }
    const u = g.units.filter((u) => !u.garrison && u.dropT <= 0).sort((a, b) => dist(a, p) - dist(b, p))[0];
    if (u && dist(u, p) < 26) {
      if (keep && sqs.length) { const l = sqs.includes(u.squad) ? sqs.filter((q) => q !== u.squad) : [...sqs, u.squad]; hud.select(null, l[0] ?? null, l); }
      else hud.select(null, u.squad);
      return;
    }
    if (sqs.length && (keep || view.queueMode)) { g.moveGroup(sqs, p, true); g.sfx('command'); return; }
    const env = g.envs.find((e) => dist(e, p) < 70);
    if (env && sqs.length) { for (const q of sqs) g.garrisonSquad(q, env); return; }
    const c = g.grid.worldToCell(p), tw = g.grid.occupant(c.c, c.r);
    if (tw) { hud.select(tw, null); return; }
    if (env) { g.toast(`${env.gName()}: select troops, then click/right-click it to garrison (−50% damage taken, +35% range)`); return; }
    const ob = g.obstacles.find((o) => dist(o, p) < (o.shortcut ? 80 : 50));
    if (ob?.shortcut && !sqs.length) { hud.selectShortcut(ob.shortcut); return; }
    const osc = g.shortcuts.find((s) => s.open && Math.hypot(s.mid.x - p.x, s.mid.y - p.y) < 60);
    if (osc && !sqs.length) { hud.selectShortcut(osc); return; }
    if (ob && !sqs.length) { g.toast(`${ob.kind === 'rock' ? 'Boulders' : 'Fallen tree'} — clear with explosives, a Cherry Pod or the MAC to free build space`); return; }
    const bl = g.buildings.find((b) => Math.abs(b.x - p.x) < (b.isHQ ? 100 : 62) && p.y > b.y - (b.isHQ ? 150 : 110) && p.y < b.y + (b.isHQ ? 80 : 56));
    if (bl && !sqs.length) { hud.selectBase(bl, null); return; }
    const pad = g.pads.find((pd) => !pd.building && dist(pd, p) < 56);
    if (pad && !sqs.length) { hud.selectBase(null, pad); return; }
    if (sqs.length) { g.moveGroup(sqs, p, false); g.sfx('command'); return; }
    hud.select(null, null);
  }
  const fpsEl = document.getElementById('fps');
  // Collapsible build panel: ◧ button / H key, smooth slide, remembered.
  const pBtn = document.getElementById('btn-panel');
  const setPanel = (hidden: boolean) => {
    document.body.classList.toggle('panel-hidden', hidden); LS.set('bof.panelHidden', hidden ? '1' : '0');
    if (pBtn) { pBtn.textContent = hidden ? '▤ Build' : '◧ Hide'; pBtn.classList.toggle('on', hidden); pBtn.title = `${hidden ? 'Show' : 'Hide'} the build panel (H)`; }
    setTimeout(() => r.resize(), 300);
  };
  const togglePanel = () => setPanel(!document.body.classList.contains('panel-hidden'));
  pBtn?.addEventListener('click', togglePanel);
  setPanel(LS.get('bof.panelHidden') === '1');
  document.getElementById('btn-box')?.addEventListener('click', () => { view.boxMode = !view.boxMode; hud.refresh(true); });
  const formBtn = document.getElementById('btn-form');
  const syncForm = () => { if (formBtn) formBtn.textContent = g.formation === 'line' ? '━ Line' : '┃ Column'; };
  formBtn?.addEventListener('click', () => { g.formation = g.formation === 'line' ? 'column' : 'line'; syncForm(); hud.refresh(true); });
  window.addEventListener('keydown', (ev) => {
    const k = ev.key.toLowerCase();
    if ((ev.target as HTMLElement)?.tagName === 'INPUT') return;
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) { keys.add(k); if (k.startsWith('arrow')) ev.preventDefault(); return; }
    const sq = view.selSquads.filter((q) => q.alive);
    if (ev.key === 'Escape') { view.placing = view.deploying = null; view.power = null; view.rallyFor = null; view.patrolMode = false; view.queueMode = false; view.patrolPts = []; hud.select(null, null); }
    else if (ev.key === ' ') { ev.preventDefault(); g.waves.start(g); }
    else if (k === 'u' && view.selTower) { view.selTower.upgrade(g); hud.refresh(true); }
    else if (k === 'u' && view.selBuilding) { view.selBuilding.upgrade(g); hud.refresh(true); }
    else if ((ev.key === 'Delete' || ev.key === 'Backspace') && view.selTower) { g.sellTower(view.selTower); hud.select(null, null); }
    else if (k === 't' && view.selTower) { g.cycleTargeting(view.selTower); hud.refresh(true); }
    else if (k === 'f') { view.showFps = !view.showFps; if (fpsEl) fpsEl.hidden = !view.showFps; }
    else if (k === 'q') { view.boxMode = !view.boxMode; hud.refresh(true); }
    else if (k === 'g') { g.formation = g.formation === 'line' ? 'column' : 'line'; syncForm(); g.toast(`Formation: ${g.formation}`); hud.refresh(true); }
    else if (k === 'p' && sq.length) hud.togglePatrol();
    else if (k === 'r' && sq.length) { for (const q of sq) g.setStance(q, 'retreat'); hud.refresh(true); }
    else if (/^[1-9]$/.test(k)) { hud.abilityUse[+k - 1]?.(); }
    else if (k === 'o') g.orderOrganizeFarms();
    else if (k === 'm') { view.power = 'mac'; hud.refresh(true); }
    else if (k === 'j') { view.power = 'heal'; hud.refresh(true); }
    else if (k === 'h') togglePanel();
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

  // FPS meter + auto-quality governor (drops particle caps / shockwave refraction /
  // damage numbers when frames dip below 45 fps, restores above 57).
  const fps = { cur: 60, lowT: 0, highT: 0, acc: 0, n: 0, t: 0, sample: null as null | number[] };
  let last = performance.now();
  function frame(now: number) {
    const raw = (now - last) / 1000, dt = Math.min(0.1, raw); last = now;
    fps.acc += raw; fps.n++; fps.t += raw;
    if (fps.sample) fps.sample.push(raw);
    if (fps.t >= 0.5) {
      fps.cur = fps.n / fps.acc; fps.acc = 0; fps.n = 0;
      if (fps.cur < 45) { fps.lowT += fps.t; fps.highT = 0; } else if (fps.cur > 57) { fps.highT += fps.t; fps.lowT = 0; } else { fps.lowT = fps.highT = 0; }
      if (fps.lowT >= 1.5 && r.quality < 2) { r.setQuality(r.quality + 1); fps.lowT = 0; }
      if (fps.highT >= 4 && r.quality > 0) { r.setQuality(r.quality - 1); fps.highT = 0; }
      fps.t = 0;
      if (view.showFps && fpsEl) fpsEl.textContent = `${fps.cur.toFixed(0)} FPS · Q${r.quality} · ${r.drawn.parts} parts · ${g.enemies.length} foes · ${r.drawn.objs} drawn`;
    }
    g.update(dt);
    hud.update(dt);
    tut?.update(dt);
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
  // First-play tutorial (auto on the first match; replay via 🎓 in the menu).
  let tut: Tutorial | null = null;
  if (forceTutorial || !Tutorial.done()) { tut = new Tutorial(g, view, () => `${Math.round(r.cam.x)},${Math.round(r.cam.y)},${r.cam.zoom.toFixed(2)}`); tut.start(); }
  window.__game = Object.assign(testHooks(g, view, hud, click, r), {
    tutorial: () => ({ active: !!tut?.active, step: tut?.i ?? -1, steps: tut?.steps ?? 0, done: Tutorial.done(), visible: !(document.getElementById('tutorial')?.hidden ?? true) }),
    tutNext: () => tut?.go(tut.i + 1), tutSkip: () => tut?.finish(),
    panel: () => ({ hidden: document.body.classList.contains('panel-hidden'), sideW: document.getElementById('side')!.getBoundingClientRect().width, stored: LS.get('bof.panelHidden') }),
    togglePanel,
    voice: () => ({ on: voiceOn, log: [...voiceLog] }),
    diff: () => ({ ...g.diff, total: g.waves.total, freeplay: g.waves.freeplay, dartCost: towerById('dart_monkey').tiers[0].cost }),
    skipTo: (n: number) => g.waves.skipTo(n),
    freeplay: () => g.startFreeplay(),
    allies: () => g.allies.map((e) => ({ id: e.data.id, hp: Math.round(e.hp), x: Math.round(e.x), y: Math.round(e.y), d: Math.round(e.progress), power: e.allyPower })),
    hypnoTest: (enemyId = 'red') => { const e = g.spawnEnemy(enemyId, 300); for (let i = 0; i < 3; i++) e.update(g, 1 / 30); const ok = g.hypnotize(e, null, 1); return { ok, ally: e.ally, hp: e.hp, max: e.maxHp }; },
    bosses: () => g.enemies.filter((e) => e.alive && e.data.bossKit).map((e) => ({ id: e.data.id, phase: e.bossPhase, hp: Math.round(e.hp), max: Math.round(e.maxHp), shield: Math.round(e.shield), size: e.data.size })),
    spawn: (id: string, lane?: number, frac?: number, hpMul = 1) => { if (lane === undefined) return g.spawnEnemy(id, 0).uid; const L = lane % g.paths.length; return g.spawnEnemy(id, g.paths[L].length * (frac ?? 0), 0, L, hpMul).uid; },
    damageBoss: (frac: number) => { for (const e of g.enemies) if (e.alive && e.data.bossKit) { e.shield = 0; e.hp = Math.max(1, e.maxHp * frac); } },
    stats: () => ({ ...g.stats }),
    killAll: () => { let n = 0; for (const e of [...g.enemies]) if (e.alive) { e.shield = 0; (e as unknown as { die(g: Game, o: number): void }).die(g, 0); n++; } return n; },
    powerMode: () => view.power,
    focus: (x: number, y: number, z?: number) => r.focus(x, y, z),
    towerCost: (id: string) => towerById(id).tiers[0].cost,
    waveLabel: () => document.getElementById('wave')!.textContent,
    enemyIds: () => Object.values(ENEMIES).map((d) => ({ id: d.id, hp: d.hp, flying: d.flying, boss: !!d.boss, kit: !!d.bossKit })),
    boxSelect, command, sfxCount: () => ({ ...sfxCount }),
    fpsStart: () => { fps.sample = []; },
    fpsStop: () => { const s = fps.sample ?? []; fps.sample = null; const f = s.map((x) => 1 / Math.max(1e-4, x)).sort((a, b) => a - b); return { frames: s.length, avg: s.length / Math.max(1e-6, s.reduce((a, b) => a + b, 0)), p5: f[Math.floor(f.length * 0.05)] ?? 0, min: f[0] ?? 0, quality: r.quality, parts: r.parts.n }; },
    fpsNow: () => ({ fps: fps.cur, quality: r.quality }),
    setQuality: (q: number) => r.setQuality(q),
    keyFps: () => !!fpsEl && !fpsEl.hidden,
  });
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
    sandbox: (tech = 2, pop = 60) => { g.techBonus = tech; g.popBonus = pop; g.deployCd = {}; if (g.res.scrap < 1000) g.res.add(1000 - g.res.scrap, 'scrap'); },
    // ---- RTS / t24-t25 hooks
    selectSquads: (idx: number[]) => { const l = idx.map((i) => g.squads[i]).filter(Boolean); hud.select(null, l[0] ?? null, l); return l.length; },
    selected: () => view.selSquads.map((q) => g.squads.indexOf(q)),
    moveGroup: (idx: number[], x: number, y: number, queue = false, formation: Formation = 'line') => g.moveGroup(idx.map((i) => g.squads[i]), { x, y }, queue, formation),
    move: (i: number, x: number, y: number, queue = false) => g.moveSquad(g.squads[i], { x, y }, queue),
    patrol: (i: number, pts: [number, number][]) => g.patrolSquad(g.squads[i], pts.map(([x, y]) => ({ x, y }))),
    squad: (i: number) => { const q = g.squads[i]; if (!q) return null; return { id: q.data.id, rally: q.rally, waypoints: q.waypoints.length, patrol: q.patrol?.length ?? 0, patrolIdx: q.patrolIdx, stance: q.stance, targeting: q.targeting, formation: q.formation, face: q.face, center: q.center, n: q.units.length,
      units: q.units.map((u) => ({ x: u.x, y: u.y, hp: u.health.hp, max: u.health.max, stars: u.stars, xp: u.xp, garrison: u.garrison?.gName() ?? null, range: u.range(g), base: u.data.tiers[g.unitTier(u.data.id)].stats.range, dmgMul: u.dmgMul, rateMul: u.rateMul, stim: u.stimT })), cd: { ...q.abilityCd } }; },
    squadIndex: (id: string) => g.squads.findIndex((q) => q.data.id === id && q.alive),
    setStance: (i: number, st: Stance) => g.setStance(g.squads[i], st),
    setSquadTargeting: (i: number, m: TargetingMode) => g.setTargeting(g.squads[i], m),
    setTowerTargeting: (i: number, m: TargetingMode) => g.setTargeting(g.towers[i], m),
    ability: (i: number, id: AbilityId) => g.useAbility(g.squads[i], id),
    towerAbility: (i: number) => g.towers[i]?.useAbility(g) ?? false,
    towerInfo: (i: number) => { const t = g.towers[i]; return t ? { id: t.data.id, tier: t.tier, targeting: t.targeting, cd: t.abilityCd, sweep: !!t.sweep, ratePct: t.buffs.totals.ratePct, incomePct: t.buffs.totals.incomePct, garrisoned: t.garrisoned.length, slots: t.gSlots(), fixedAim: t.fixedAim, crates: t.farm?.crates ?? 0, x: t.x, y: t.y } : null; },
    towerIndex: (id: string) => g.towers.findIndex((t) => t.data.id === id),
    garrisonInto: (i: number, kind: 'env' | 'tower', j: number) => g.garrisonSquad(g.squads[i], kind === 'env' ? g.envs[j] : g.towers[j]),
    envs: () => g.envs.map((e) => ({ kind: e.kind, x: e.x, y: e.y, n: e.garrisoned.length, slots: e.gSlots() })),
    obstacles: () => g.obstacles.map((o) => ({ kind: o.kind, shortcut: !!o.shortcut, x: o.x, y: o.y, hp: o.hp, cells: o.cells.map((c) => [c.c, c.r]) })),
    cellFree: (c: number, rr: number) => g.grid.isFree(c, rr),
    barriers: () => g.barriers.map((b) => ({ id: b.data.id, x: b.x, y: b.y, hp: b.hp, fuse: b.fuse })),
    placeBarrier: (id: string, x: number, y: number) => !!g.placeBarrier(id, { x, y }),
    spawn: (id: string, lane: number, frac: number, hpMul = 1) => { const p = g.paths[lane % g.paths.length]; const e = g.spawnEnemy(id, p.length * frac, 0, lane % g.paths.length, hpMul); return e.uid; },
    enemy: (uid: number) => { const e = g.enemies.find((x) => x.uid === uid); return e ? { alive: e.alive, id: e.data.id, progress: e.progress, lane: e.lane, layers: e.layersPopped, route: !!e.route, remaining: e.remaining, hp: e.hp, maxHp: e.maxHp, shield: e.shield, shieldDown: e.shieldDown, armor: e.armor, stun: e.stunT, x: e.x, y: e.y, slow: e.slowAmt } : null; },
    killAllEnemies: () => { for (const e of g.enemies) e.alive = false; g.enemies = []; },
    addXp: (i: number, n: number) => { for (const u of g.squads[i].units) u.addXp(n); },
    spawnPickup: (x: number, y: number, v: number, kind: 'credit' | 'orb' | 'scrap') => g.spawnPickup(x, y, v, kind).uid,
    pickupsList: () => g.pickups.filter((p) => p.alive).map((p) => ({ uid: p.uid, kind: p.kind, x: p.x, y: p.y, v: p.value })),
    stats: () => ({ ...g.stats }),
    // ---- t26/t27 hooks: layers, shortcuts, damage text, scrap
    shortcuts: () => g.shortcuts.map((s) => ({ a: s.a, b: s.b, open: s.open, preview: s.preview, rerouted: s.rerouted, blocker: s.blocker ? { x: s.blocker.x, y: s.blocker.y, hp: s.blocker.hp, alive: s.blocker.alive } : null, cells: s.cells.length })),
    demolishShortcut: (i: number) => g.demolishShortcut(g.shortcuts[i]),
    blastAt: (x: number, y: number, r: number, dmg: number) => g.splash(x, y, r, dmg, 'explosive', { x, y }, 'boom', {}),
    pathLens: () => g.paths.map((p) => p.length),
    pathPoint: (lane: number, d: number) => g.paths[lane].at(d),
    selectShortcut: (i: number) => hud.selectShortcut(g.shortcuts[i] ?? null),
    selectHQ: () => hud.selectBase(g.hq, null),
    roadSpeed: (x: number, y: number) => g.roadSpeedMul({ x, y }),
    scrap: () => ({ scrap: g.res.scrap, earned: g.res.scrapEarned, spent: g.res.scrapSpent, by: { ...g.stats.scrapBy } }),
    setScrap: (n: number) => { const d = n - g.res.scrap; if (d > 0) g.res.add(d, 'scrap'); else if (d < 0) g.res.spend({ credits: 0, scrap: -d }); return g.res.scrap; },
    buyArmory: (id: string) => g.buyArmory(id as never),
    armory: () => [...g.armory],
    deployCost: (id: string) => g.deployCost(id),
    canDeploy: (id: string) => g.canDeploy(id),
    fieldBlock: (id: string) => g.fieldBlock(id),
    dmgNumber: (x: number, y: number, n: number, key?: number) => g.dmgNumber(x, y, n, '#ffffff', false, key),
    dmgEffects: () => g.effects.filter((e) => e.kind === 'dmg').map((e) => ({ text: e.text, val: e.val, hits: e.hits, crit: !!e.crit })),
    dmgPx: (zoom: number, crit = false) => dmgTextPx(zoom, crit),
    dmgSeen: (reset = false) => { const v = { ...r.dmgPxSeen }; if (reset) r.dmgPxSeen = { min: Infinity, max: 0, n: 0 }; return v; },
    zoomTo: (z: number) => { r.cam.zoom = z; r.clamp(); return r.cam.zoom; },
    zoomLimits: () => ({ min: r.minZoom, max: r.maxZoom }),
    effects: () => { const m: Record<string, number> = {}; for (const e of g.effects) m[e.kind] = (m[e.kind] ?? 0) + 1; return { ...m, shocks: g.shocks.length, shake: g.shakeAmt }; },
    view: () => ({ sel: view.selSquads.length, box: !!view.box, boxMode: view.boxMode, queue: view.queueMode, patrol: view.patrolMode }),
    fx: () => g.effects.length,
    setFormation: (f: Formation) => { g.formation = f; },
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
