// Interactive first-play tutorial: a non-modal coach card that walks through the
// whole game. Each step auto-advances when the player does the thing (or Next).
// Skippable, replayable from the menu (🎓 Tutorial), completion kept in localStorage.
import type { Game } from '../game/Game';
import type { ViewState } from '../render/Renderer';

export const TUTORIAL_KEY = 'bof.tutorialDone';
interface Step { title: string; text: string; hi?: string; done?: (g: Game, v: ViewState, s: Snap, cam: string) => boolean; enter?: (g: Game) => void }
interface Snap { cam: string; towers: number; tier: number; targeting: string; squads: number; sel: number; moves: number; stances: string; buildings: number; orbs: number; powers: number; speed: number; panel: boolean }

const STEPS: Step[] = [
  { title: 'Welcome, Commander', text: 'The bloons and the bug hive are marching on your HQ (right side). Hold the frontier! This quick tour can be skipped any time and replayed from the menu.' },
  { title: '1 · Camera', text: '<b>Right-drag</b>, <b>WASD</b> or touch-drag to pan · <b>wheel / pinch</b> to zoom · click the <b>minimap</b> to jump · <b>B</b> jumps to base, <b>Z</b> zooms out. Move the camera now.', hi: '#minimap', done: (_g, _v, s, cam) => cam !== s.cam },
  { title: '2 · Place a tower', text: 'Pick a tower in the <b>build panel</b> (try the Dart Monkey) and click a lit cell next to the road. Shift-click keeps placing.', hi: '#tower-cards', done: (g) => g.towers.length > 0, enter: (g) => g.res.add(200) },
  { title: '3 · Upgrade & targeting', text: 'Click your tower, press <b>⬆ Upgrade</b> (U). Every tier is strictly stronger and looks better. Set <b>targeting</b> (T): First · Last · Strong · Close · <b>Closest to HQ</b>.', hi: '#sel-panel', done: (g, _v, s) => g.towers.some((t) => t.tier > 0) || g.towers.map((t) => t.targeting).join() !== s.targeting, enter: (g) => g.res.add(250) },
  { title: '4 · Start a wave', text: 'Press <b>▶ Start Wave</b> (Space). The <b>wave preview</b> bar shows what is coming: ⚡ fast · ⛨ armored · 🪽 flying · 🛡 shielded · 💀 boss.', hi: '#btn-start', done: (g) => g.waves.active || g.waves.index > 0 },
  { title: '5 · Deploy troops', text: 'Deploy a squad from the <b>bottom bar</b> — it drops in by pod. Troops block bugs on the road and gather 🔩 <b>scrap</b>.', hi: '#troop-bar', done: (g, _v, s) => g.squads.filter((q) => q.data.role !== 'worker').length > s.squads, enter: (g) => g.res.add(300) },
  { title: '6 · Select & command', text: '<b>Left-drag a box</b> around troops (touch: ⬚ Select). <b>Right-click</b> to move, <b>Shift</b>-click queues waypoints, <b>P</b> patrols, <b>G</b> toggles formation.', hi: '#stage-btns', done: (_g, v) => v.selSquads.length > 0 },
  { title: '7 · Stances', text: 'With troops selected, set a <b>stance</b> in the side panel: Aggressive chases, Defensive holds near the rally, Hold Fire, Retreat (R). Number keys fire squad abilities.', hi: '#sel-panel', done: (g, _v, s) => g.squads.map((q) => q.stance).join() !== s.stances },
  { title: '8 · Build your base', text: 'Click a glowing <b>pad</b> beside the HQ: <b>Supply</b> (+credits each wave), <b>Reactor</b> (tech + pop), <b>Barracks</b> (train troops, set a rally flag).', done: (g, _v, s) => g.buildings.length > s.buildings, enter: (g) => g.res.add(300) },
  { title: '9 · Orbs & scrap', text: 'Sunflowers and Farmhands make 🔆 <b>energy orbs</b> — <b>hover</b> or click them (coins too). Deploy ONE <b>Sprout Farmhand collector</b> (max 1 per player): it is <b>immune</b>, enemies ignore it, and it vacuums <b>every</b> coin, orb and 🔩 scrap pile on the whole map automatically.' },
  { title: '10 · Leader powers', text: '<b>☄ MAC Blast</b> (M) rakes a whole lane; <b>✚ Heal Drop</b> (J) mends troops, towers and base. Both spend ⚡ energy.', hi: '#powers', done: (g, _v, s) => g.stats.powers > s.powers, enter: (g) => { g.energy = Math.max(g.energy, 100); } },
  { title: '11 · Garrisons & shortcuts', text: 'Send troops into bunkers, watchtowers or El Morro <b>garitas</b>: <b>+35% range, −50% damage taken</b>. Blast rockslides open <b>shortcuts</b> — but enemies can use them too!' },
  { title: '12 · Speed & panel', text: 'Use <b>1× / 2× / 4×</b> speed (top right). Press <b>H</b> or the ◧ button to hide the build panel for more battlefield. That\'s it — good luck, Commander!', hi: '[data-speed="2"]', done: (g, _v, s) => g.speed !== s.speed || document.body.classList.contains('panel-hidden') !== s.panel },
];

export class Tutorial {
  i = 0; active = false;
  private el: HTMLElement; private snap!: Snap; private hiEl: Element | null = null; private hold = 0;
  constructor(readonly g: Game, readonly view: ViewState, readonly cam: () => string) {
    this.el = document.createElement('div'); this.el.id = 'tutorial'; this.el.hidden = true;
    document.getElementById('stage')!.appendChild(this.el);
  }
  static done() { try { return localStorage.getItem(TUTORIAL_KEY) === '1'; } catch { return false; } }
  start() { this.active = true; this.go(0); }
  private take(): Snap {
    const g = this.g;
    return { cam: this.cam(), towers: g.towers.length, tier: 0, targeting: g.towers.map((t) => t.targeting).join(), squads: g.squads.filter((q) => q.data.role !== 'worker').length, sel: this.view.selSquads.length,
      moves: 0, stances: g.squads.map((q) => q.stance).join(), buildings: g.buildings.length, orbs: g.stats.orbs, powers: g.stats.powers, speed: g.speed, panel: document.body.classList.contains('panel-hidden') };
  }
  go(i: number) {
    this.hiEl?.classList.remove('tut-hi');
    if (i >= STEPS.length) { this.finish(); return; }
    this.i = i; const s = STEPS[i];
    s.enter?.(this.g);
    this.snap = this.take(); this.hold = 0.6;
    this.hiEl = s.hi ? document.querySelector(s.hi) : null; this.hiEl?.classList.add('tut-hi');
    this.el.hidden = false;
    this.el.innerHTML = `<div class="tut-head"><span>🎓 ${s.title}</span><em>${i + 1}/${STEPS.length}</em></div><p>${s.text}</p>
      <div class="tut-bar"><i style="width:${((i + 1) / STEPS.length) * 100}%"></i></div>
      <div class="tut-btns"><button class="btn small" data-t="skip">Skip tutorial</button>${i ? '<button class="btn small" data-t="back">◀</button>' : ''}<button class="btn small go" data-t="next">${i === STEPS.length - 1 ? 'Finish ✔' : s.done ? 'Next ▶' : 'Got it ▶'}</button></div>`;
    (this.el.querySelector('[data-t=skip]') as HTMLElement).onclick = () => this.finish();
    (this.el.querySelector('[data-t=next]') as HTMLElement).onclick = () => this.go(this.i + 1);
    const b = this.el.querySelector('[data-t=back]') as HTMLElement | null; if (b) b.onclick = () => this.go(this.i - 1);
  }
  update(dt: number) {
    if (!this.active) return;
    this.hold -= dt; if (this.hold > 0) return;
    const s = STEPS[this.i];
    if (s.done?.(this.g, this.view, this.snap, this.cam())) { this.el.classList.add('tut-ok'); setTimeout(() => this.el.classList.remove('tut-ok'), 500); this.g.sfx('upgrade'); this.go(this.i + 1); }
  }
  finish() {
    this.active = false; this.el.hidden = true; this.hiEl?.classList.remove('tut-hi');
    try { localStorage.setItem(TUTORIAL_KEY, '1'); } catch { /* private mode */ }
    this.g.toast('Tutorial complete — replay it any time from the menu (🎓)', '#7fe8ff');
  }
  get steps() { return STEPS.length; }
}
