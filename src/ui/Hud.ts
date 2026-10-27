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
import { Faction, TARGETING_ORDER, TARGETING_LABEL, type AbilityId, type Stance, type TowerTier, type UnitTier } from '../core/types';
import { ABILITIES } from '../data/abilities';
import { gEject } from '../entities/Garrison';
import { IMG, sprite } from '../render/sprites';
import type { Building, BuildPad } from '../entities/Building';
import { PAD_BUILDINGS, POWERS, MAX_ENERGY, TRAIN_DISCOUNT } from '../data/buildings';
import { ARMORY, type ArmoryId } from '../data/armory';
import { SHORTCUT, type Shortcut } from '../systems/Shortcuts';
import type { BuildingTier } from '../core/types';

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
  if (t.aura) s.push(`🌿 ${t.aura.radius}: +${Math.round(t.aura.ratePct * 100)}% rate${t.aura.incomePct ? ` +${Math.round(t.aura.incomePct * 100)}% income` : ''}`);
  if (t.orbs) s.push(`🔆 ${t.orbs.energy}⚡×${t.orbs.perMin}/min`);
  if (t.barrier) s.push(t.barrier.blast ? `💥 ${t.barrier.blast} r${t.barrier.blastRadius}` : `🧱 blocks ${t.barrier.blockCap}`);
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
  cmp('Aura', a.aura?.radius, b.aura?.radius); cmp('Aura rate', a.aura?.ratePct, b.aura?.ratePct, true); cmp('Aura income', a.aura?.incomePct, b.aura?.incomePct, true);
  cmp('Orb ⚡', a.orbs?.energy, b.orbs?.energy); cmp('Orbs/min', a.orbs?.perMin, b.orbs?.perMin);
  cmp('Shred', a.combat?.armorShred, b.combat?.armorShred, true); cmp('Slow', a.combat?.slow, b.combat?.slow, true);
  cmp('Garrison armor', a.cover?.garrisonProtect, b.cover?.garrisonProtect, true); cmp('Garrison range', a.cover?.garrisonRangePct, b.cover?.garrisonRangePct, true);
  return d.join('<br>');
}
function bldLine(t: BuildingTier) {
  const s = t.stats, o: string[] = [`❤ ${s.maxHp}`];
  if (s.income) o.push(`¢ ${s.income}×${s.payoutsPerMin}/min (safe)`, `+${s.waveBonus}/wave`);
  if (s.tech) o.push(`⚛ Tech ${s.tech}`);
  if (s.pop) o.push(`👥 +${s.pop} pop`);
  if (s.energyRegen) o.push(`⚡ +${s.energyRegen}/s`);
  if (s.trainSpeed) o.push(`🪖 ×${s.trainSpeed} speed`, `queue ${s.queue}`);
  if (s.gun) o.push(`🔫 ${s.gun.damage}×${s.gun.fireRate}/s ◎${s.gun.range}`);
  return o.join(' · ');
}
function unitLine(t: UnitTier) {
  return `❤ ${t.stats.maxHp} · ⚔ ${t.stats.damage} · ⏱ ${t.stats.attackRate}/s · ◎ ${t.stats.range}${t.weapon.antiAir ? ' · ✈AA' : ''}${t.weapon.armorPiercing ? ' · AP' : ''}${t.special ? ' · ★ ' + t.special.name : ''}`;
}
const STANCES: [Stance, string][] = [['aggressive', '⚔ Aggressive'], ['hold', '✋ Hold'], ['retreat', '🏃 Retreat']];
function tgtButtons(cur: string) {
  return `<div class="seg tgt">${TARGETING_ORDER.map((m) => `<button class="${m === cur ? 'on' : ''}" data-tgt="${m}">${TARGETING_LABEL[m]}</button>`).join('')}</div>`;
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
    this.g.bus.on('scrap', (e) => { const st = document.getElementById('scrap-stat'); if (st && e.delta > 0) { st.classList.remove('bump'); void st.offsetWidth; st.classList.add('bump'); setTimeout(() => st.classList.remove('bump'), 400); } });
    $('#btn-start').onclick = () => this.g.waves.start(this.g);
    $('#btn-auto').onclick = () => { this.g.waves.auto = !this.g.waves.auto; };
    for (const b of Array.from(document.querySelectorAll<HTMLElement>('[data-speed]'))) b.onclick = () => { this.g.speed = +b.dataset.speed!; };
    $('#btn-pause').onclick = () => { this.g.paused = !this.g.paused; };
    $('#btn-organize').onclick = () => this.g.orderOrganizeFarms();
    this.buildPowers();
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
  // ---------------------------------------------------------------- leader powers
  private buildPowers() {
    const bar = $('#powers'); if (!bar) return; bar.innerHTML = '';
    for (const p of POWERS) {
      const b = h('button', 'power', `<span class="pi">${p.icon}</span><span class="pn">${p.name}</span><span class="pc">⚡${p.energy}</span><i class="pcd"></i>`);
      b.dataset.power = p.id; b.title = p.desc;
      b.onclick = () => { this.view.power = this.view.power === p.id ? null : p.id; this.view.placing = this.view.deploying = null; this.view.rallyFor = null; this.refresh(true); };
      bar.appendChild(b);
    }
  }
  // ---------------------------------------------------------------- troop bar
  private buildTroops() {
    const bar = $('#troop-bar'); bar.innerHTML = '';
    for (const u of UNITS) {
      const f = factionInfo(u.faction);
      const el = h('div', 'troop', `<button class="deploy" data-unit="${u.id}" title="${u.desc}">${th(u.tiers[0].visual.sprite ?? u.sprite, 0, 40)}
        <div><div class="cn">${u.name}</div><div class="cs"><span class="tname"></span> · <span class="ucost">${this.g.costLabel(this.g.deployCost(u.id))}</span> · ${u.squadSize}×</div></div>
        <div class="cd"></div></button><button class="research" data-research="${u.id}"></button>`);
      el.style.setProperty('--fc', f.color);
      $('.deploy', el).onclick = () => { this.view.deploying = this.view.deploying === u.id ? null : u.id; this.view.placing = null; this.refresh(true); };
      $('.research', el).onclick = () => { this.g.researchUnit(u.id); this.refresh(true); };
      bar.appendChild(el);
    }
  }

  // ---------------------------------------------------------------- selection
  select(t: Tower | null, s: Squad | null, group?: Squad[]) {
    if (t || s || group?.length) this.selShortcut = null;
    this.view.selTower = t; this.view.selSquad = s; this.view.selBuilding = null; this.view.selPad = null;
    this.view.selSquads = group ?? (s ? [s] : []);
    if (t || s || group?.length) this.g.sfx('select');
    for (const q of this.view.selSquads) q.pulse = 0.6;
    this.g.bus.emit('selection', { kind: t ? 'tower' : s ? 'squad' : 'none' });
    this.lastSel = '\u0000';
    this.refresh(true);
  }
  /** Selected blocked shortcut (rockslide) — shows the risk/reward + Demolish. */
  selShortcut: Shortcut | null = null;
  selectShortcut(sc: Shortcut | null) {
    this.selectBase(null, null);
    this.selShortcut = sc; this.lastSel = '\u0000'; this.refresh(true);
  }
  private shortcutPanel(p: HTMLElement): boolean {
    const g = this.g, sc = this.selShortcut;
    if (!sc) return false;
    if (this.view.selBuilding || this.view.selPad) { this.selShortcut = null; return false; }
    const key = `sc${sc.def.a}:${sc.open}:${g.res.scrap >= SHORTCUT.demolishScrap}`;
    if (key === this.lastSel) return true;
    this.lastSel = key;
    p.classList.add('show'); p.style.setProperty('--fc', '#ffd27a');
    const pv = sc.preview, lanes = pv.lanes.map((k) => k + 1).join(' & ');
    p.innerHTML = sc.open
      ? `<div class="sp-head"><div class="sp-icon">🛤</div><div><div class="sp-name">Shortcut (open)</div><div class="sp-sub">Lane ${lanes} now runs through here — enemies arrive ~${pv.seconds.toFixed(1)}s sooner. Troops move +${Math.round((SHORTCUT.roadSpeed - 1) * 100)}% faster on this road; post a squad here to block it.</div></div></div><button class="btn" id="sp-desel">Close</button>`
      : `<div class="sp-head"><div class="sp-icon">⛔</div><div><div class="sp-name">Blocked shortcut</div><div class="sp-sub">A rockslide chokes an old trail that cuts off ${pv.saved}px of lane ${lanes}.</div></div></div>
        <div class="sp-stats"><b class="risk">Risk:</b> enemies on lane ${lanes} take it too and arrive <b>~${pv.seconds.toFixed(1)}s sooner</b> (red-bloon speed), bypassing towers on the long road.</div>
        <div class="sp-stats"><b class="reward">Reward:</b> +${Math.round((SHORTCUT.roadSpeed - 1) * 100)}% troop speed on the new road, a short front to defend, and ~35🔩 salvage.</div>
        <div class="sp-sub">Too solid for normal splash — only the MAC, drop-pod / Cherry blasts or a Demolish order clear it.</div>
        <div class="row"><button class="btn up" id="sp-demo" ${g.res.scrap < SHORTCUT.demolishScrap ? 'disabled' : ''}>💥 Demolish <b>${SHORTCUT.demolishScrap}🔩</b></button><button class="btn" id="sp-desel">Close</button></div>`;
    const dm = $('#sp-demo', p); if (dm) dm.onclick = () => { g.demolishShortcut(sc); this.lastSel = ''; this.refresh(true); };
    $('#sp-desel', p).onclick = () => { this.selShortcut = null; this.lastSel = ''; this.refresh(true); };
    return true;
  }
  /** Select a base building or an empty build pad. */
  selectBase(b: Building | null, pad: BuildPad | null) {
    if (b || pad) this.selShortcut = null;
    this.view.selTower = null; this.view.selSquad = null; this.view.selSquads = []; this.view.selBuilding = b; this.view.selPad = pad;
    this.lastSel = '\u0000';
    this.g.bus.emit('selection', { kind: 'none' });
    this.refresh(true);
  }
  private basePanel(p: HTMLElement): boolean {
    const g = this.g, b = this.view.selBuilding, pad = this.view.selPad;
    if (b && !b.alive) { this.selectBase(null, null); return true; }
    if (pad && pad.building) { this.selectBase(pad.building, null); return true; }
    if (!b && !pad) return false;
    const key = b ? `b${b.uid}:${b.tier}:${!!b.build}:${b.queue.length}:${b.queue[0]?.held}:${g.tech}:${Math.floor(g.res.credits / 50)}:${g.res.scrap}:${g.armory.size}` : `p${pad!.uid}:${Math.floor(g.res.credits / 50)}`;
    if (key === this.lastSel) { this.liveBase(); return true; }
    this.lastSel = key;
    p.classList.add('show'); p.style.setProperty('--fc', '#7fd3ff');
    if (pad) {
      p.innerHTML = `<div class="sp-head"><div class="sp-icon">🏗</div><div><div class="sp-name">Build Pad ${pad.index + 1}</div><div class="sp-sub">Choose a structure. Construction takes time; the base must survive.</div></div></div>
        <div class="bld-list">${PAD_BUILDINGS.map((d) => { const t0 = d.tiers[0]; return `<button class="card bld" data-build="${d.id}" ${g.res.credits < t0.cost ? 'disabled' : ''} title="${d.desc}">${th(d.sprite, 0, 52)}<div class="ci"><div class="cn">${d.name}</div><div class="cs">${bldLine(t0)} · ⏱${t0.buildTime}s</div><div class="cs">${d.desc}</div></div><div class="cost">¢${t0.cost}</div></button>`; }).join('')}</div>
        <button class="btn" id="sp-desel">Close</button>`;
      for (const el of Array.from(p.querySelectorAll<HTMLElement>('[data-build]'))) el.onclick = () => { const nb = g.buildOnPad(pad, el.dataset.build as 'supply'); if (nb) this.selectBase(nb, null); };
      $('#sp-desel', p).onclick = () => this.selectBase(null, null);
      return true;
    }
    const n = b!.nextTier, bb = b!;
    p.innerHTML = `<div class="sp-head">${th(bb.data.sprite, Math.max(0, bb.tier), 60)}<div><div class="sp-name">${bb.built ? bb.t.name : 'Constructing ' + bb.data.name}</div>
      <div class="sp-sub">${bb.data.name} · Tier ${Math.max(0, bb.tier) + 1}/${bb.data.tiers.length}</div></div></div>
      <div class="sp-stats">${bldLine(bb.t)}</div><div class="sp-sub">${bb.data.desc}</div><div class="sp-live"></div>
      ${bb.built && n ? `<button class="btn up" id="sp-up" ${g.res.credits < n.cost || bb.build ? 'disabled' : ''}>⬆ ${n.name} <b>¢${n.cost}</b> · ⏱${n.buildTime}s<div class="delta">${n.blurb}<br>${bldLine(n)}</div></button>` : bb.built ? '<div class="maxed">★ Max tier</div>' : ''}
      ${bb.data.id === 'barracks' && bb.built ? `<div class="sp-sub">Train (¢ −${Math.round((1 - TRAIN_DISCOUNT) * 100)}% vs drop pod, one at a time):</div><div class="train-list">${UNITS.map((u) => {
        const c = g.deployCost(u.id, true), lock = g.tech < u.tech;
        return `<button class="btn train" data-train="${u.id}" ${lock || !g.res.canAfford(c) ? 'disabled' : ''} title="${u.desc}">${th(u.tiers[0].visual.sprite ?? u.sprite, 0, 30)}<span>${u.name}<br><small>${g.costLabel(c)} · 👥${u.population}${lock ? ' · ⚛' + u.tech : ''}</small></span></button>`; }).join('')}</div>
        <div class="queue" id="sp-queue"></div><button class="btn" id="sp-rally">🚩 Set rally point</button>` : ''}
      ${bb.isHQ && bb.built ? `<div class="sp-sub armory-h">🔩 Salvage Armory — scrap-only tech (you have <b>${g.res.scrap}🔩</b>):</div><div class="armory">${ARMORY.map((a) => {
        const own = g.armory.has(a.id);
        return `<button class="btn arm${own ? ' owned' : ''}" data-armory="${a.id}" ${own || g.res.scrap < a.scrap ? 'disabled' : ''} title="${a.desc}"><span>${a.name}<br><small>${a.desc}</small></span><b>${own ? '✔ Owned' : a.scrap + '🔩'}</b></button>`; }).join('')}</div>` : ''}
      <div class="row">${bb.isHQ ? '' : `<button class="btn sell" id="sp-sell">Demolish (50%)</button>`}<button class="btn" id="sp-desel">Done</button></div>`;
    const up = $('#sp-up', p); if (up) up.onclick = () => { bb.upgrade(g); this.lastSel = ''; this.refresh(true); };
    for (const el of Array.from(p.querySelectorAll<HTMLElement>('[data-train]'))) el.onclick = () => { bb.enqueue(g, el.dataset.train!); this.lastSel = ''; this.refresh(true); };
    for (const el of Array.from(p.querySelectorAll<HTMLElement>('[data-armory]'))) el.onclick = () => { g.buyArmory(el.dataset.armory as ArmoryId); this.lastSel = ''; this.refresh(true); };
    const ra = $('#sp-rally', p); if (ra) ra.onclick = () => { this.view.rallyFor = bb; this.view.power = null; this.refresh(true); };
    const se = $('#sp-sell', p); if (se) se.onclick = () => { g.demolish(bb); this.selectBase(null, null); };
    $('#sp-desel', p).onclick = () => this.selectBase(null, null);
    this.liveBase();
    return true;
  }
  private liveBase() {
    const b = this.view.selBuilding; if (!b) return;
    const el = $('#sel-panel .sp-live');
    if (el) el.innerHTML = `HP ${Math.ceil(b.health.hp)}/${Math.ceil(b.health.max)}${b.build ? ` · <span class="buff">${b.built ? 'Upgrading' : 'Building'} ${Math.round(b.progress * 100)}%</span>` : ''}${b.isHQ ? ` · Pop ${this.g.pop}/${this.g.popCap} · Tech ${this.g.tech}` : ''}`;
    const q = $('#sp-queue');
    if (q) {
      q.innerHTML = b.queue.map((o, i) => `<button class="qi${o.held ? ' held' : ''}" data-q="${i}" title="Click to cancel (refund)">${th(unitById(o.unitId).sprite, 0, 26)}<i style="width:${Math.min(100, (o.t / o.dur) * 100)}%"></i>${o.held ? `<em>${o.held}</em>` : ''}</button>`).join('') || '<span class="sp-sub">Queue empty</span>';
      for (const el of Array.from(q.querySelectorAll<HTMLElement>('[data-q]'))) el.onclick = () => { b.cancel(this.g, +el.dataset.q!); this.lastSel = ''; };
    }
  }
  private selPanel() {
    const p = $('#sel-panel'), g = this.g, t = this.view.selTower, s = this.view.selSquad, grp = this.view.selSquads.filter((q) => q.alive);
    if (!t && !s && this.shortcutPanel(p)) return;
    if (!t && !s && this.basePanel(p)) return;
    if (!t && grp.length > 1) return this.groupPanel(p, grp);
    const key = t ? `t${t.uid}:${t.tier}:${t.targeting}:${t.garrisoned.length}:${g.res.credits >= (t.nextTier?.cost ?? 1e9)}:${t.disabled}`
      : s ? `s${s.uid}:${s.units.length}:${g.unitTier(s.data.id)}:${s.units.filter((u) => u.garrison).length}:${s.stance}:${s.targeting}:${s.units.map((u) => u.stars).join('')}:${this.view.queueMode}:${this.view.patrolMode}` : '';
    if (key === this.lastSel) { if (t) this.liveTower(t); return; }
    this.lastSel = key;
    if (t && !t.alive) { this.select(null, null); return; }
    if (s && !s.alive) { this.select(null, null); return; }
    p.classList.toggle('show', !!(t || s));
    if (t) {
      const n = t.nextTier, f = factionInfo(t.data.faction), slots = t.gSlots();
      p.style.setProperty('--fc', f.color);
      const tags = [t.data.antiAir ? '✈ Anti-air' : '', t.data.armorPiercing ? 'Armor-piercing' : '', t.data.fixedLane ? 'Fixed lane' : '', t.data.hitsAir === false ? 'Air only' : ''].filter(Boolean).join(' · ');
      p.innerHTML = `<div class="sp-head">${th(t.t.visual.sprite ?? t.data.sprite, t.tier, 56)}<div><div class="sp-name">${t.t.name}</div>
        <div class="sp-sub">${t.data.name} · Tier ${t.tier + 1}/${t.data.tiers.length}${tags ? ' · ' + tags : ''}</div></div></div>
        <div class="sp-stats">${statLine(t.t)}</div><div class="sp-live"></div>
        ${n ? `<button class="btn up" id="sp-up" ${g.res.credits < n.cost ? 'disabled' : ''}>⬆ ${n.name} <b>¢${n.cost}</b><div class="delta">${deltaLine(t.t, n)}</div></button>` : '<div class="maxed">★ Max tier</div>'}
        ${t.combat ? `<div class="sp-sub">🎯 Targeting</div>${tgtButtons(t.targeting)}` : ''}
        ${t.data.ability ? `<button class="btn ability" id="sp-abil">${ABILITIES[t.data.ability].icon} ${ABILITIES[t.data.ability].name} <small>(1)</small></button>` : ''}
        <div class="row"><button class="btn sell" id="sp-sell">Sell ¢${t.sellValue} (70%)</button></div>
        ${slots ? `<div class="sp-sub">Garrison: ${t.garrisoned.length}/${slots} · −${Math.round(t.gProtect() * 100)}% dmg taken · +${Math.round(t.gRange() * 100)}% range · select a squad and press Garrison</div>${t.garrisoned.length ? '<button class="btn" id="sp-eject">Eject troops</button>' : ''}` : ''}
        ${t.isFarm ? '<div class="sp-sub">Tip: deploy a Sprout Farmhand, then press 🧹 Organize Farms to pack farms into a tight block.</div>' : ''}`;
      const up = $('#sp-up', p); if (up) up.onclick = () => { t.upgrade(g); this.lastSel = ''; this.refresh(true); };
      for (const el of Array.from(p.querySelectorAll<HTMLElement>('[data-tgt]'))) el.onclick = () => { g.setTargeting(t, el.dataset.tgt as never); this.lastSel = ''; this.refresh(true); };
      const ab = $('#sp-abil', p); if (ab) ab.onclick = () => t.useAbility(g);
      $('#sp-sell', p).onclick = () => { g.sellTower(t); this.select(null, null); };
      const ej = $('#sp-eject', p); if (ej) ej.onclick = () => { gEject(t); this.lastSel = ''; };
      this.liveTower(t);
    } else if (s) {
      const tier = g.unitTier(s.data.id), td = s.data.tiers[tier], f = factionInfo(s.data.faction);
      p.style.setProperty('--fc', f.color);
      const worker = s.data.role === 'worker', stars = Math.max(...s.units.map((u) => u.stars));
      p.innerHTML = `<div class="sp-head">${th(td.visual.sprite ?? s.data.sprite, tier, 56)}<div><div class="sp-name">${td.name} <span class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span></div>
        <div class="sp-sub">${s.data.name} · ${s.units.length} unit(s) · XP ${s.units.reduce((n, u) => n + u.xp, 0)}${s.data.hero ? ' · HERO' : ''}${s.data.vehicle ? ' · fires on the move' : ''}</div></div></div>
        <div class="sp-stats">${unitLine(td)}</div>
        ${worker ? '<div class="sp-sub">Workers collect credits, orbs & scrap, repair towers, and spawn energy orbs during waves.</div>' : `
        <div class="seg stance">${STANCES.map(([k, l]) => `<button class="${s.stance === k ? 'on' : ''}" data-stance="${k}">${l}</button>`).join('')}</div>
        <div class="sp-sub">🎯 Targeting</div>${tgtButtons(s.targeting)}`}
        <div class="row"><button class="btn${this.view.queueMode ? ' on' : ''}" id="sp-queue-m" title="Shift-click also queues">➕ Queue</button><button class="btn${this.view.patrolMode ? ' on' : ''}" id="sp-patrol" title="Tap points then Done; or press P">🔁 Patrol</button></div>
        <div class="row">${worker ? '<button class="btn" id="sp-org">🧹 Organize Farms</button>' : '<button class="btn" id="sp-gar">🏰 Garrison</button><button class="btn" id="sp-ungar">Leave cover</button>'}
        <button class="btn" id="sp-desel">Done</button></div>`;
      for (const el of Array.from(p.querySelectorAll<HTMLElement>('[data-stance]'))) el.onclick = () => { g.setStance(s, el.dataset.stance as Stance); this.lastSel = ''; };
      for (const el of Array.from(p.querySelectorAll<HTMLElement>('[data-tgt]'))) el.onclick = () => { g.setTargeting(s, el.dataset.tgt as never); this.lastSel = ''; };
      $('#sp-queue-m', p).onclick = () => { this.view.queueMode = !this.view.queueMode; this.view.patrolMode = false; this.lastSel = ''; };
      $('#sp-patrol', p).onclick = () => this.togglePatrol();
      const ga = $('#sp-gar', p); if (ga) ga.onclick = () => { g.garrisonSquad(s); this.lastSel = ''; };
      const ug = $('#sp-ungar', p); if (ug) ug.onclick = () => { g.ungarrisonSquad(s); this.lastSel = ''; };
      const og = $('#sp-org', p); if (og) og.onclick = () => g.orderOrganizeFarms();
      $('#sp-desel', p).onclick = () => this.select(null, null);
    } else p.innerHTML = '';
  }
  /** Patrol mode: first toggle starts collecting points, second commits them. */
  togglePatrol() {
    const v = this.view;
    if (v.patrolMode) { for (const q of v.selSquads) if (v.patrolPts.length) this.g.patrolSquad(q, v.patrolPts); v.patrolPts = []; v.patrolMode = false; }
    else { v.patrolMode = true; v.queueMode = false; v.patrolPts = []; this.toast('Patrol: tap/click points, then press Patrol (or P) again'); }
    this.lastSel = ''; this.refresh(true);
  }
  private groupPanel(p: HTMLElement, grp: Squad[]) {
    const g = this.g, key = `g${grp.map((q) => q.uid).join(',')}:${g.formation}:${grp.map((q) => q.stance).join('')}:${this.view.queueMode}:${this.view.patrolMode}`;
    if (key === this.lastSel) return;
    this.lastSel = key;
    p.classList.add('show'); p.style.setProperty('--fc', '#7fd3ff');
    const n = grp.reduce((a, q) => a + q.units.length, 0);
    p.innerHTML = `<div class="sp-head"><div class="sp-icon">⬚</div><div><div class="sp-name">${grp.length} squads selected</div><div class="sp-sub">${n} troops · ${[...new Set(grp.map((q) => q.data.name))].join(', ')}</div></div></div>
      <div class="sp-sub">Formation (G)</div><div class="seg form"><button data-form="line" class="${g.formation === 'line' ? 'on' : ''}">━ Line</button><button data-form="column" class="${g.formation === 'column' ? 'on' : ''}">┃ Column</button></div>
      <div class="seg stance">${STANCES.map(([k, l]) => `<button class="${grp.every((q) => q.stance === k) ? 'on' : ''}" data-stance="${k}">${l}</button>`).join('')}</div>
      <div class="row"><button class="btn${this.view.queueMode ? ' on' : ''}" id="sp-queue-m">➕ Queue</button><button class="btn${this.view.patrolMode ? ' on' : ''}" id="sp-patrol">🔁 Patrol</button></div>
      <div class="row"><button class="btn" id="sp-gar">🏰 Garrison all</button><button class="btn" id="sp-desel">Done</button></div>`;
    for (const el of Array.from(p.querySelectorAll<HTMLElement>('[data-form]'))) el.onclick = () => { g.formation = el.dataset.form as 'line'; this.lastSel = ''; };
    for (const el of Array.from(p.querySelectorAll<HTMLElement>('[data-stance]'))) el.onclick = () => { for (const q of grp) g.setStance(q, el.dataset.stance as Stance); this.lastSel = ''; };
    $('#sp-queue-m', p).onclick = () => { this.view.queueMode = !this.view.queueMode; this.view.patrolMode = false; this.lastSel = ''; };
    $('#sp-patrol', p).onclick = () => this.togglePatrol();
    $('#sp-gar', p).onclick = () => { for (const q of grp) g.garrisonSquad(q); this.lastSel = ''; };
    $('#sp-desel', p).onclick = () => this.select(null, null);
  }
  /** Ability bar with cooldown sweeps: selected squads' abilities + every Super Monkey's Laser Sweep. */
  private abilityBar() {
    const bar = $('#abilities'); if (!bar) return;
    const g = this.g, items: { key: string; icon: string; name: string; cd: number; max: number; use: () => void; hot: number }[] = [];
    const sel = this.view.selSquads.filter((q) => q.alive);
    const pool = sel.length ? sel : g.squads.filter((q) => q.alive && q.data.abilities?.length);
    for (const id of ['stim', 'emp', 'hijack'] as AbilityId[]) {
      const sqs = pool.filter((q) => q.data.abilities?.includes(id)); if (!sqs.length) continue;
      const ready = sqs.find((q) => (q.abilityCd[id] ?? 0) <= 0), cd = Math.min(...sqs.map((q) => q.abilityCd[id] ?? 0));
      items.push({ key: id, icon: ABILITIES[id].icon, name: ABILITIES[id].name, cd, max: ABILITIES[id].cooldown, use: () => { const q = ready ?? sqs[0]; g.useAbility(q, id); }, hot: items.length + 1 });
    }
    const sms = (this.view.selTower?.data.ability ? [this.view.selTower] : g.towers.filter((t) => t.alive && t.data.ability));
    if (sms.length) {
      const ready = sms.find((t) => t.abilityCd <= 0), t0 = sms[0], id = t0.data.ability!;
      items.push({ key: id, icon: ABILITIES[id].icon, name: ABILITIES[id].name, cd: Math.min(...sms.map((t) => Math.max(0, t.abilityCd))), max: t0.abilityMax, use: () => (ready ?? t0).useAbility(g), hot: items.length + 1 });
    }
    const sig = items.map((i) => i.key).join(',');
    if (bar.dataset.sig !== sig) {
      bar.dataset.sig = sig; bar.innerHTML = '';
      for (const it of items) {
        const b = h('button', 'abil', `<span class="ai">${it.icon}</span><span class="an">${it.name}</span><kbd>${it.hot}</kbd><i class="acd"></i><em class="at"></em>`);
        b.dataset.ab = it.key; bar.appendChild(b);
      }
    }
    this.abilityUse = items.map((i) => i.use);
    Array.from(bar.children).forEach((el, i) => {
      const it = items[i]; if (!it) return;
      (el as HTMLElement).onclick = () => it.use();
      (el as HTMLElement).classList.toggle('ready', it.cd <= 0);
      $('.acd', el).style.height = `${Math.min(100, (it.cd / it.max) * 100)}%`;
      $('.at', el).textContent = it.cd > 0 ? `${Math.ceil(it.cd)}` : '';
    });
  }
  /** Hotkeys 1..n fire the ability bar. */
  abilityUse: (() => void)[] = [];
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
    const sc = $('#scrap'); if (sc) sc.textContent = `${g.res.scrap}`;
    $('#lives').textContent = `${g.lives}/${Math.ceil(g.hq.health.max)}`;
    const pe = $('#pop'); if (pe) { pe.textContent = `${g.pop}/${g.popCap}`; pe.parentElement!.classList.toggle('full', g.pop >= g.popCap); }
    const te = $('#tech'); if (te) te.textContent = `${g.tech}`;
    const en = $('#energy-fill'); if (en) en.style.width = `${(g.energy / MAX_ENERGY) * 100}%`;
    const ev = $('#energy'); if (ev) ev.textContent = `${Math.floor(g.energy)}`;
    for (const pb of Array.from(document.querySelectorAll<HTMLElement>('#powers .power'))) {
      const id = pb.dataset.power!, pw = POWERS.find((x) => x.id === id)!, cd = g.powerCd[id] ?? 0;
      pb.classList.toggle('on', this.view.power === id);
      pb.classList.toggle('poor', !g.canCast(id));
      $('.pcd', pb).style.height = `${(cd / pw.cooldown) * 100}%`;
    }
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
      const need = g.researchTech(id), techLock = !!nt && g.tech < need;
      r.innerHTML = nt ? `⬆ ${nt.name}<br><b>¢${nt.cost}</b>${techLock ? ` <span class="lock">⚛${need}</span>` : ''}` : '★ Max';
      r.disabled = !nt || g.res.credits < nt.cost || techLock;
      r.title = nt ? `Research ${nt.name}: ${nt.blurb}\n${unitLine(nt)}${techLock ? `\nRequires Tech ${need} (Reactors)` : ''}` : '';
      const blk = g.fieldBlock(id);
      $('.deploy', b).title = `${d.desc}\nPop ${d.population}${d.tech ? ` · Tech ${d.tech}` : ''}${blk ? `\n⛔ ${blk}` : ''}`;
      $('.deploy', b).classList.toggle('locked', !!blk && g.tech < d.tech);
    }
    const farms = g.farms().length, workers = g.workers().length;
    const ob = $<HTMLButtonElement>('#btn-organize');
    ob.classList.toggle('ready', farms >= 2 && workers > 0);
    ob.title = `Farms: ${farms} · Farmhands: ${workers}. A Farmhand walks over and packs the farms into a tight grid near their centre, freeing build space.`;
    $('#mode-hint').textContent = this.view.placing ? `Placing ${towerById(this.view.placing).name}: click a highlighted cell (Shift = keep placing, Esc/right-click = cancel)`
      : this.view.deploying ? `Deploy ${unitById(this.view.deploying).name}: click where the drop pod should land`
      : this.view.power === 'mac' ? 'MAC Blast: click a lane — the strike runs along the road (Esc cancels)'
      : this.view.power === 'heal' ? 'Heal Drop: click to drop a medical canister on your troops / towers / base'
      : this.view.rallyFor ? 'Click to set the Barracks rally point'
      : this.view.patrolMode ? `Patrol: tap points (${this.view.patrolPts.length}) then press 🔁 Patrol / P to start the loop`
      : this.view.queueMode ? 'Queue: each tap adds a waypoint (Shift-click on desktop)'
      : this.view.boxMode ? 'Box-select: drag a box around troops' : '';
    const orbs = $('#orbs'); if (orbs) orbs.textContent = `${g.stats.orbs}`;
    const bm = $('#btn-box'); if (bm) bm.classList.toggle('on', this.view.boxMode);
    this.abilityBar();
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
      <p>Waves cleared: ${this.g.waves.index}/${this.g.waves.total} · Kills: ${this.g.stats.kills} · HQ: ${this.g.lives}</p>
      <button class="btn big" onclick="location.reload()">Play again</button></div>`;
    o.classList.add('show');
  }
}

function describeWave(w: { groups: { enemy: string; count: number }[] }) {
  const m = new Map<string, number>();
  for (const g of w.groups) m.set(g.enemy, (m.get(g.enemy) ?? 0) + g.count);
  return [...m].map(([k, v]) => `${v} ${k}`).join(', ');
}
