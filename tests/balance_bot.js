// Headless balance bot: injected into the page, drives window.__game.g with a fixed,
// difficulty-agnostic strategy and fast-forwards the sim (no rendering) one wave at a time.
window.__bot = (() => {
  const H = window.__game, g = H.g;
  const ROT = ['dart_monkey', 'ninja_monkey', 'gatling_cherry_bomber', 'unsc_autoturret', 'tesla_coil', 'wizard_monkey', 'unsc_flak', 'repeater_gatling',
    'chomper', 'boomerang_monkey', 'sniper_monkey', 'glue_slinger', 'hypno_shroom', 'arcane_obelisk', 'star_emperor', 'unsc_rail', 'flame_melon_mortar', 'super_monkey'];
  let rot = 0, maxTowers = 0;
  // candidate cells: free cells sorted by how much path they cover (samples within 150 px)
  const samples = []; for (const p of g.paths) for (let f = 0.04; f < 0.97; f += 0.02) samples.push(p.at(p.length * f));
  const cells = [];
  for (let r = 0; r < g.grid.rows; r++) for (let c = 0; c < g.grid.cols; c++) if (g.grid.isFree(c, r)) {
    const q = g.grid.cellCenter(c, r); let cov = 0, near = 1e9;
    for (const s of samples) { const d = Math.hypot(s.x - q.x, s.y - q.y); if (d < 150) cov++; near = Math.min(near, d); }
    if (near > 34 && cov) cells.push({ c, r, cov });
  }
  cells.sort((a, b) => b.cov - a.cov);
  const SQ = ['paladin', 'marine', 'line_watch', 'odst', 'ranger'];
  let sqi = 0;
  const macro = () => {
    // a couple of supply pads, then a reactor (pop + tech)
    const free = g.pads.filter((p) => !p.building);
    const want = g.buildings.filter((b) => b.data.id === 'supply').length < 2 ? 'supply' : !g.buildings.some((b) => b.data.id === 'reactor') ? 'reactor' : null;
    if (want && free.length && g.waves.index >= 3) g.buildOnPad(free[0], want);
    // troops hold the last stretch of every lane
    if (g.waves.index >= 1) for (let l = 0; l < g.paths.length; l++) {
      const mine = g.squads.filter((q) => q.alive && q.botLane === l).length;
      if (mine >= 1 + Math.floor(g.waves.index / 15) || g.res.credits < 400) continue;
      const id = SQ[sqi % SQ.length];
      if (!g.canDeploy(id)) { sqi++; continue; }
      const pth = g.paths[l], at = pth.at(pth.length * (0.72 + 0.05 * (mine % 3)));
      const q = g.deploySquad(id, at); if (q) { q.botLane = l; sqi++; }
    }
  };
  const powers = () => {
    const front = g.enemies.filter((e) => e.alive).sort((a, b) => a.remaining - b.remaining)[0];
    if (front && g.energy >= 60) g.castPower('mac', { x: front.x, y: front.y });
    if (g.energy >= 35 && g.hq.health.hp < g.hq.health.max * 0.6) g.castPower('heal', { x: g.hq.x, y: g.hq.y });
  };
  const spend = () => {
    for (const p of g.pickups) if (p.alive) p.collect(g, 1, 'hover');
    for (let guard = 0; guard < 60; guard++) {
      const id = ROT[rot % ROT.length], cost = H.towerCost(id);
      const ups = g.towers.filter((t) => t.nextTier).sort((a, b) => a.nextTier.cost - b.nextTier.cost);
      const cheapUp = ups[0];
      const wantNew = g.towers.length < Math.min(70, 8 + g.waves.index * 0.8) && (!cheapUp || g.towers.length < 5 || cost <= cheapUp.nextTier.cost * 1.2);
      if (wantNew) {
        if (g.res.credits < cost) break;
        const cell = cells.find((x) => g.grid.isFree(x.c, x.r));
        if (!cell || !g.placeTower(id, { c: cell.c, r: cell.r })) { rot++; continue; }
        rot++; maxTowers = Math.max(maxTowers, g.towers.length);
      } else if (cheapUp) { if (!cheapUp.upgrade(g)) break; } else break;
    }
    if (g.res.credits > 250 || g.waves.index % 4 === 3) macro();
  };
  const runWave = (maxSec = 400) => {
    spend();
    if (!g.waves.start(g)) return { started: false };
    let t = 0; g.speed = 1;
    while ((g.waves.active || g.enemies.length) && g.state === 'playing' && t < maxSec) { g.update(0.1); t += 0.1; if ((t * 10 | 0) % 50 === 0) { spend(); powers(); } }
    return { started: true, t: Math.round(t), wave: g.waves.index, hq: Math.ceil(g.hq.health.hp), hqMax: g.hq.health.max, state: g.state, towers: g.towers.length, credits: Math.floor(g.res.credits), leaked: g.stats.leaked };
  };
  return { runWave, spend, cells: cells.length };
})();
