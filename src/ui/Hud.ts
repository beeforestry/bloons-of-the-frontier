// =============================================================================
// HUD: DOM-based UI (top bar, faction-tabbed tower bar, troop deployment bar,
// selection panel with upgrade/sell/targeting/garrison, Organize Farms button).
// Reads Game state; issues commands through Game methods only.
// =============================================================================
import type { Game } from '../game/Game';
import type { Tower } from '../entities/Tower';
import type { Squad } from '../entities/Unit';
import type { ViewState } from '../render/Renderer';
import { FACTIONS, factionInfo } from '../data/factions';
import { TOWERS, towerById } from '../data/towers';
import { UNITS, unitById } from '../data/units';
import { Faction, type TowerTier, type UnitTier } from '../core/types';
import { IMG, sprite } from '../render/sprites';

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T;
function h(tag: string, cls = '', html = ''): HTMLElement { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
function thumb(key: string, tier = 0, size = 44): string {
  const im = sprite(key, tier) ?? IMG[key];
  if (!im) return '';
  if (im instanceof HTMLImageElement) return `<img src="${im.src}" width="${size}" height="${size}" alt="" style="object-fit:contain">`;
  return `<img src="${(im as HTMLCanvasElement).toDataURL()}" width="${size}" height="${size}" alt="" style="object-fit:contain">`;
}
const thumbCache = new Map<string, string>();
const th = (key: string, tier = 0, size = 44) => { const k = `${key}|${tier}|${size}`; if (!thumbCache.has(k)) thumbCache.set(k, thumb(key, tier, size)); return thumbCache.get(k)!; };

function statLine(t: TowerTier): string {
  const s: string[] = [];
  if (t.combat) s.push(`⚔ ${t.combat.damage}${t.combat.shots && t.combat.shots > 1 ? '×' + t.combat.shots : ''}`, `⏱ ${t.combat.fireRate}/s`, `◎ ${t.combat.range}`, `➹ ${t.combat.pierce}`);
  if (t.cover) s.push(`🛡 +${t.cover.bonusMaxHp}HP`, `◎ +${Math.round(t.cover.bonusRangePct * 100)}%`, `👤 ${t.cover.garrisonSlots}`);
  if (t.farm) s.push(`¢ ${t.farm.income}×${t.farm.payoutsPerMin}/min`, `+${t.farm.waveBonus}/wave`);
  s.push(`❤ ${t.maxHp}`);
  return s.join(' · ');
}
function deltaLine(a: TowerTier, b: TowerTier): string {
  const d: string[] = [];
  const cmp = (name: string, x?: number, y?: number, pct = false) => {
    if (x === undefined || y === undefined || x === y) return;
    const v = pct ? `${Math.round(x * 100)}→${Math.round(y * 100)}%` : `${+x.toFixed(2)}→${+y.toFixed(2)}`;
    d.push(`<b>${name}</b> ${v}`);
  };
  cmp('Dmg', a.combat?.damage, b.combat?.damage); cmp('Rate', a.combat?.fireRate, b.combat?.fireRate); cmp('Range', a.combat?.range, b.combat?.range);
  cmp('Pierce', a.combat?.pierce, b.combat?.pierce); cmp('Shots', a.combat?.shots, b.combat?.shots); cmp('Splash', a.combat?.splash, b.combat?.splash);
  cmp('Aura', a.cover?.auraRadius, b.cover?.auraRadius); cmp('+HP', a.cover?.bonusMaxHp, b.cover?.bonusMaxHp); cmp('+Range', a.cover?.bonusRangePct, b.cover?.bonusRangePct, true);
  cmp('Slots', a.cover?.garrisonSlots, b.cover?.garrisonSlots); cmp('Income', a.farm?.income, b.farm?.income); cmp('Payouts/min', a.farm?.payoutsPerMin, b.farm?.payoutsPerMin);
  cmp('Wave bonus', a.farm?.waveBonus, b.farm?.waveBonus); cmp('HP', a.maxHp, b.maxHp);
  return d.join('<br>');
}
function unitLine(t: UnitTier) {
  return `❤ ${t.stats.maxHp} · ⚔ ${t.stats.damage} · ⏱ ${t.stats.attackRate}/s · ◎ ${t.stats.range}${t.weapon.hitsAir ? ' · ✈' : ''}${t.special ? ' · ★ ' + t.special.name : ''}`;
}

export class Hud {
  tab: Faction = Faction.Primates;
  private refreshT = 0;
  private toasts: HTMLElement;
  private lastSel = '\u0000';

  constructor(readonly g: Game, readonly view: ViewState, readonly root: HTMLElement) {
    this.toasts = $('#toasts');
    this.buildTabs();
    this.buildTroops();
    $('#btn-start').onclick = () => this.g.waves.start(this.g);
    $('#btn-auto').onclick = () => { this.g.waves.auto = !this.g.waves.auto; };
    for (const b of Array.from(document.querySelectorAll<HTMLElement>('[data-speed]'))) b.onclick = () => { this.g.speed = +b.dataset.speed!; };
    $('#btn-pause').onclick = () => { this.g.paused = !this.g.paused; };
    $('#btn-organize').onclick = () => this.g.orderOrganizeFarms();
    g.bus.on('toast', (t) => this.toast(t.text, t.color));
    g.bus.on('gameover', (r) => this.gameOver(r.won));
    this.refresh(true);
  }

  // ---------------------------------------------------------------- tower bar
  private buildTabs() {
    const tabs = $('#faction-tabs'); tabs.innerHTML = '';
    for (const f of FACTIONS) {
      const b = h('button', 'tab', `${f.icon} ${f.name}`);
      b.dataset.faction = f.id; b.style.setProperty('--fc', f.color);
      b.onclick = () => { this.tab = f.id; this.buildCards(); this.refresh(true); };
      tabs.appendChild(b);
    }
    this.buildCards();
  }
  private buildCards() {
    for (const b of Array.from(document.querySelectorAll<HTMLElement>('#faction-tabs .tab'))) b.classList.toggle('on', b.dataset.faction === this.tab);
    const list = $('#tower-cards'); list.innerHTML = '';
    const info = factionInfo(this.tab);
    list.style.setProperty('--fc', info.color);
    list.appendChild(h('div', 'faction-blurb', info.blurb));
    for (const d of TOWERS.filter((t) => t.faction === this.tab)) {
      const t0 = d.tiers[0];
      const card = h('button', 'card', `${th(d.sprite, 0)}<div class="ci"><div class="cn">${d.name}<span class="kind k-${d.kind}">${d.kind}</span></div>
        <div class="cs">${statLine(t0)}</div></div><div class="cost">¢${t0.cost}</div>`);
      card.dataset.tower = d.id; card.title = d.desc;
      card.onclick = () => { this.view.placing = this.view.placing === d.id ? null : d.id; this.view.deploying = null; this.select(null, null); this.refresh(true); };
      list.appendChild(card);
    }
  }
  // ---------------------------------------------------------------- troop bar
  private buildTroops() {
    const bar = $('#troop-bar'); bar.innerHTML = '';
    for (const u of UNITS) {
      const f = factionInfo(u.faction);
      const el = h('div', 'troop', `<button class="deploy" data-unit="${u.id}" title="${u.desc}">${th(u.tiers[0].visual.sprite ?? u.sprite, 0, 40)}
        <div><div class="cn">${u.name}</div><div class="cs"><span class="tname"></span> · ¢${u.tiers[0].cost} · ${u.squadSize}×</div></div>
        <div class="cd"></div></button><button class="research" data-research="${u.id}"></button>`);
      el.style.setProperty('--fc', f.color);
      $('.deploy', el).onclick = () => { this.view.deploying = this.view.deploying === u.id ? null : u.id; this.view.placing = null; this.refresh(true); };
      $('.research', el).onclick = () => { this.g.researchUnit(u.id); this.refresh(true); };
      bar.appendChild(el);
    }
  }

  // ---------------------------------------------------------------- selection
  select(t: Tower | null, s: Squad | null) {
    this.view.selTower = t; this.view.selSquad = s;
    this.g.bus.emit('selection', { kind: t ? 'tower' : s ? 'squad' : 'none' });
    this.lastSel = '\u0000';
    this.refresh(true);
  }
  private selPanel() {
    const p = $('#sel-panel'), g = this.g, t = this.view.selTower, s = this.view.selSquad;
    const key = t ? `t${t.uid}:${t.tier}:${t.targeting}:${t.cover?.garrisoned.length}:${g.res.credits >= (t.nextTier?.cost ?? 1e9)}:${t.disabled}`
      : s ? `s${s.units.length}:${g.unitTier(s.data.id)}:${s.units.filter((u) => u.garrison).length}` : '';
    if (key === this.lastSel) { if (t) this.liveTower(t); return; }
    this.lastSel = key;
    if (t && !t.alive) { this.select(null, null); return; }
    if (s && !s.alive) { this.select(null, null); return; }
    p.classList.toggle('show', !!(t || s));
    if (t) {
      const n = t.nextTier, f = factionInfo(t.data.faction);
      p.style.setProperty('--fc', f.color);
      p.innerHTML = `<div class="sp-head">${th(t.t.visual.sprite ?? t.data.sprite, t.tier, 56)}<div><div class="sp-name">${t.t.name}</div>
        <div class="sp-sub">${t.data.name} · Tier ${t.tier + 1}/${t.data.tiers.length}</div></div></div>
        <div class="sp-stats">${statLine(t.t)}</div><div class="sp-live"></div>
        ${n ? `<button class="btn up" id="sp-up" ${g.res.credits < n.cost ? 'disabled' : ''}>⬆ ${n.name} <b>¢${n.cost}</b><div class="delta">${deltaLine(t.t, n)}</div></button>` : '<div class="maxed">★ Max tier</div>'}
        <div class="row">${t.combat ? `<button class="btn" id="sp-tgt">🎯 Target: <b>${t.targeting}</b></button>` : ''}
        <button class="btn sell" id="sp-sell">Sell ¢${t.sellValue} (70%)</button></div>
        ${t.cover ? `<div class="sp-sub">Garrison: ${t.cover.garrisoned.length}/${t.t.cover!.garrisonSlots} · select a squad and press Garrison</div><button class="btn" id="sp-eject">Eject troops</button>` : ''}
        ${t.isFarm ? '<div class="sp-sub">Tip: deploy a Sprout Farmhand, then press 🧹 Organize Farms to pack farms into a tight block.</div>' : ''}`;
      const up = $('#sp-up', p); if (up) up.onclick = () => { t.upgrade(g); this.lastSel = ''; this.refresh(true); };
      const tg = $('#sp-tgt', p); if (tg) tg.onclick = () => { g.cycleTargeting(t); this.lastSel = ''; this.refresh(true); };
      $('#sp-sell', p).onclick = () => { g.sellTower(t); this.select(null, null); };
      const ej = $('#sp-eject', p); if (ej) ej.onclick = () => { t.cover!.ejectAll(g); this.lastSel = ''; };
      this.liveTower(t);
    } else if (s) {
      const tier = g.unitTier(s.data.id), td = s.data.tiers[tier], f = factionInfo(s.data.faction);
      p.style.setProperty('--fc', f.color);
      const worker = s.data.role === 'worker';
      p.innerHTML = `<div class="sp-head">${th(td.visual.sprite ?? s.data.sprite, tier, 56)}<div><div class="sp-name">${td.name}</div>
        <div class="sp-sub">${s.data.name} · ${s.units.length} unit(s)</div></div></div>
        <div class="sp-stats">${unitLine(td)}</div>
        <div class="sp-sub">${worker ? 'Workers auto-collect dropped credits (100%) and repair towers near their post.' : 'Click the map (or right-click) to set a rally point. Troops block ground bugs and attack the nearest enemy.'}</div>
        <div class="row">${worker ? '<button class="btn" id="sp-org">🧹 Organize Farms</button>' : '<button class="btn" id="sp-gar">🏰 Garrison</button><button class="btn" id="sp-ungar">Leave cover</button>'}
        <button class="btn" id="sp-desel">Done</button></div>`;
      const ga = $('#sp-gar', p); if (ga) ga.onclick = () => { g.garrisonSquad(s); this.lastSel = ''; };
      const ug = $('#sp-ungar', p); if (ug) ug.onclick = () => { g.ungarrisonSquad(s); this.lastSel = ''; };
      const og = $('#sp-org', p); if (og) og.onclick = () => g.orderOrganizeFarms();
      $('#sp-desel', p).onclick = () => this.select(null, null);
    } else p.innerHTML = '';
  }
  private liveTower(t: Tower) {
    const el = $('#sel-panel .sp-live'); if (!el) return;
    const b = t.buffs.totals;
    el.innerHTML = `HP ${Math.ceil(t.health.hp)}/${Math.ceil(t.health.max)}${b.bonusMaxHp || b.bonusRangePct ? ` · <span class="buff">Cover buff +${b.bonusMaxHp}HP +${Math.round(b.bonusRangePct * 100)}% range</span>` : ''}${t.disabled ? ' · <span class="bad">OFFLINE</span>' : ''}`;
  }

  // ---------------------------------------------------------------- per-frame
  update(dt: number) {
    this.refreshT -= dt;
    if (this.refreshT <= 0) { this.refreshT = 0.15; this.refresh(false); }
  }
  refresh(_force: boolean) {
    const g = this.g;
    $('#credits').textContent = `${Math.floor(g.res.credits)}`;
    $('#lives').textContent = `${g.lives}`;
    $('#wave').textContent = `${g.waves.current}/${g.waves.total}`;
    const next = g.waves.waves[g.waves.index];
    $('#wave-info').textContent = g.waves.active ? `${g.waves.remainingToSpawn} incoming · ${g.enemies.length} on field` : next ? `Next: ${describeWave(next)}` : 'All waves cleared';
    const sb = $<HTMLButtonElement>('#btn-start'); sb.disabled = g.waves.active || g.state !== 'playing';
    $('#btn-auto').classList.toggle('on', g.waves.auto);
    $('#btn-pause').textContent = g.paused ? '▶' : '⏸';
    for (const b of Array.from(document.querySelectorAll<HTMLElement>('[data-speed]'))) b.classList.toggle('on', +b.dataset.speed! === g.speed);
    for (const c of Array.from(document.querySelectorAll<HTMLElement>('#tower-cards .card'))) {
      const d = towerById(c.dataset.tower!);
      c.classList.toggle('poor', g.res.credits < d.tiers[0].cost);
      c.classList.toggle('on', this.view.placing === d.id);
    }
    for (const b of Array.from(document.querySelectorAll<HTMLElement>('#troop-bar .troop'))) {
      const id = $('.deploy', b).dataset.unit!, d = unitById(id), tier = g.unitTier(id), nt = d.tiers[tier + 1];
      const cd = g.deployCd[id] ?? 0, n = g.squadCount(id);
      $('.deploy', b).classList.toggle('poor', !g.canDeploy(id));
      $('.deploy', b).classList.toggle('on', this.view.deploying === id);
      $('.tname', b).textContent = `${d.tiers[tier].name} (${n}/${d.maxSquads})`;
      $('.cd', b).style.height = `${(cd / d.cooldown) * 100}%`;
      const r = $<HTMLButtonElement>('.research', b);
      r.innerHTML = nt ? `⬆ ${nt.name}<br><b>¢${nt.cost}</b>` : '★ Max';
      r.disabled = !nt || g.res.credits < nt.cost;
      r.title = nt ? `Research ${nt.name}: ${nt.blurb}\n${unitLine(nt)}` : '';
    }
    const farms = g.farms().length, workers = g.workers().length;
    const ob = $<HTMLButtonElement>('#btn-organize');
    ob.classList.toggle('ready', farms >= 2 && workers > 0);
    ob.title = `Farms: ${farms} · Farmhands: ${workers}. A Farmhand walks over and packs the farms into a tight grid near their centre, freeing build space.`;
    $('#mode-hint').textContent = this.view.placing ? `Placing ${towerById(this.view.placing).name}: click a highlighted cell (Shift = keep placing, Esc/right-click = cancel)`
      : this.view.deploying ? `Deploy ${unitById(this.view.deploying).name}: click where the drop pod should land` : '';
    this.selPanel();
  }

  toast(text: string, color?: string) {
    const t = h('div', 'toast', text); if (color) t.style.borderColor = color;
    this.toasts.appendChild(t);
    while (this.toasts.children.length > 4) this.toasts.firstChild!.remove();
    setTimeout(() => t.classList.add('out'), 2600); setTimeout(() => t.remove(), 3200);
  }
  private gameOver(won: boolean) {
    const o = $('#gameover');
    o.innerHTML = `<div class="panel"><h1>${won ? '🏆 Frontier Holds!' : '💥 The line broke'}</h1>
      <p>Waves cleared: ${this.g.waves.index}/${this.g.waves.total} · Kills: ${this.g.stats.kills} · Lives: ${this.g.lives}</p>
      <button class="btn big" onclick="location.reload()">Play again</button></div>`;
    o.classList.add('show');
  }
}

function describeWave(w: { groups: { enemy: string; count: number }[] }) {
  const m = new Map<string, number>();
  for (const g of w.groups) m.set(g.enemy, (m.get(g.enemy) ?? 0) + g.count);
  return [...m].map(([k, v]) => `${v} ${k}`).join(', ');
}
