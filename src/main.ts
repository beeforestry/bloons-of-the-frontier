// Entry point: boot assets, map select, input handling, main loop, test hooks.
import './style.css';
import { Game } from './game/Game';
import { Renderer, type ViewState } from './render/Renderer';
import { Hud } from './ui/Hud';
import { loadSprites } from './render/sprites';
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
  const view: ViewState = { placing: null, deploying: null, hoverCell: null, mouse: null, selTower: null, selSquad: null };
  const r = new Renderer(canvas, g);
  const hud = new Hud(g, view, document.body);

  const toMap = (ev: MouseEvent): Vec => {
    const b = canvas.getBoundingClientRect();
    return { x: ((ev.clientX - b.left) / b.width) * g.map.width, y: ((ev.clientY - b.top) / b.height) * g.map.height };
  };
  canvas.addEventListener('mousemove', (ev) => {
    const p = toMap(ev); view.mouse = p;
    view.hoverCell = view.placing ? g.grid.snap(p) : null;
  });
  canvas.addEventListener('mouseleave', () => { view.mouse = null; view.hoverCell = null; });
  canvas.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    if (view.placing || view.deploying) { view.placing = view.deploying = null; hud.refresh(true); return; }
    if (view.selSquad) g.moveSquad(view.selSquad, toMap(ev));
  });
  canvas.addEventListener('click', (ev) => click(toMap(ev), ev.shiftKey));
  function click(p: Vec, keep = false) {
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
    if (view.selSquad) { g.moveSquad(view.selSquad, p); return; }
    hud.select(null, null);
  }
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { view.placing = view.deploying = null; hud.select(null, null); }
    else if (ev.key === ' ') { ev.preventDefault(); g.waves.start(g); }
    else if (ev.key === 'u' && view.selTower) { view.selTower.upgrade(g); hud.refresh(true); }
    else if (ev.key === 's' && view.selTower) { g.sellTower(view.selTower); hud.select(null, null); }
    else if (ev.key === 't' && view.selTower) { g.cycleTargeting(view.selTower); hud.refresh(true); }
    else if (ev.key === 'o') g.orderOrganizeFarms();
  });

  let last = performance.now();
  function frame(now: number) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    g.update(dt);
    hud.update(dt);
    r.draw(view);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.__game = testHooks(g, view, hud, click);
}

/** Automation hooks for the headless Playwright playtest (and for debugging in devtools). */
function testHooks(g: Game, view: ViewState, hud: Hud, click: (p: Vec) => void) {
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
    state: () => ({
      credits: Math.floor(g.res.credits), lives: g.lives, wave: g.waves.index, waveActive: g.waves.active, state: g.state,
      towers: g.towers.length, units: g.units.length, squads: g.squads.length, enemies: g.enemies.length, kills: g.stats.kills,
      organizes: g.stats.organizes, pickups: g.stats.pickups, offline: g.towers.filter((t) => t.disabled).length,
      buffed: g.towers.filter((t) => t.buffs.count > 0).length + g.units.filter((u) => u.buffs.count > 0).length,
      garrisoned: g.units.filter((u) => u.garrison).length, sliding: g.towers.filter((t) => t.slide).length,
    }),
  };
}

boot();
