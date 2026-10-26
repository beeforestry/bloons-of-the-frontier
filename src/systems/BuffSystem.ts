// =============================================================================
// BUFF / AURA SYSTEM
// - BuffReceiver lives on every friendly Tower and Unit.
// - Buffs are keyed by SOURCE id: re-applying from the same aura REPLACES the
//   old buff (an aura can never double-stack on one target).
// - Buffs sharing a `stackKey` (e.g. two different cover towers) do NOT add up:
//   the strongest value per stat wins. Different stackKeys add together.
// - Totals are recalculated on every add/remove and listeners are notified
//   (Health uses this to raise/clamp max HP).
// - AuraEmitter does a periodic overlap check (every 0.25 s): new targets get
//   the buff, targets that left the radius lose it, upgrades refresh it.
// =============================================================================
import type { Vec } from '../core/types';
import { dist2 } from '../core/math';

export interface Buff {
  sourceId: string;
  stackKey: string;
  bonusMaxHp: number;
  bonusRangePct: number;
  regen: number;
}
export interface BuffTotals { bonusMaxHp: number; bonusRangePct: number; regen: number }
const ZERO: BuffTotals = { bonusMaxHp: 0, bonusRangePct: 0, regen: 0 };

export class BuffReceiver {
  private buffs = new Map<string, Buff>();
  totals: BuffTotals = { ...ZERO };
  onChange?: (t: BuffTotals) => void;

  has(sourceId: string) { return this.buffs.has(sourceId); }
  get count() { return this.buffs.size; }
  sources() { return [...this.buffs.keys()]; }

  /** Add or replace the buff from buff.sourceId. */
  apply(buff: Buff) {
    const old = this.buffs.get(buff.sourceId);
    if (old && old.bonusMaxHp === buff.bonusMaxHp && old.bonusRangePct === buff.bonusRangePct && old.regen === buff.regen) return;
    this.buffs.set(buff.sourceId, buff);
    this.recalc();
  }
  remove(sourceId: string) {
    if (this.buffs.delete(sourceId)) this.recalc();
  }
  clear() { if (this.buffs.size) { this.buffs.clear(); this.recalc(); } }

  private recalc() {
    const byKey = new Map<string, BuffTotals>();
    for (const b of this.buffs.values()) {
      const cur = byKey.get(b.stackKey) ?? { ...ZERO };
      cur.bonusMaxHp = Math.max(cur.bonusMaxHp, b.bonusMaxHp);
      cur.bonusRangePct = Math.max(cur.bonusRangePct, b.bonusRangePct);
      cur.regen = Math.max(cur.regen, b.regen);
      byKey.set(b.stackKey, cur);
    }
    const t = { ...ZERO };
    for (const v of byKey.values()) { t.bonusMaxHp += v.bonusMaxHp; t.bonusRangePct += v.bonusRangePct; t.regen += v.regen; }
    this.totals = t;
    this.onChange?.(t);
  }
}

/** Anything an aura can touch. */
export interface Buffable extends Vec { uid: number; alive: boolean; buffs: BuffReceiver }

export class AuraEmitter {
  private inside = new Set<Buffable>();
  private timer = 0;
  constructor(readonly sourceId: string, private buff: () => Buff, private radius: () => number, readonly interval = 0.25) {}

  /** Periodic overlap check. `self` is excluded so a cover tower doesn't buff itself. */
  tick(dt: number, origin: Vec, candidates: Iterable<Buffable>, self?: Buffable) {
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = this.interval;
    const r2 = this.radius() ** 2, b = this.buff();
    const now = new Set<Buffable>();
    for (const c of candidates) {
      if (c === self || !c.alive) continue;
      if (dist2(c, origin) <= r2) now.add(c);
    }
    for (const c of this.inside) if (!now.has(c)) c.buffs.remove(this.sourceId); // left the aura
    for (const c of now) c.buffs.apply(b); // entered or refreshed (no double stacking)
    this.inside = now;
  }
  /** Force a refresh next tick (e.g. after an upgrade). */
  refresh() { this.timer = 0; }
  /** Remove buff from everyone (tower sold / disabled). */
  dispose() {
    for (const c of this.inside) c.buffs.remove(this.sourceId);
    this.inside.clear();
  }
  get targets() { return this.inside.size; }
}

/**
 * Health with buff-aware max HP. Gaining +max HP heals by the same amount;
 * losing it only clamps (you never die from leaving an aura).
 */
export class Health {
  hp: number;
  private bonus = 0;
  constructor(private base: number, public armor = 0) { this.hp = base; }
  get max() { return this.base + this.bonus; }
  get alive() { return this.hp > 0; }
  get frac() { return this.max > 0 ? this.hp / this.max : 0; }
  setBase(base: number, armor: number) {
    const gained = base - this.base;
    this.base = base; this.armor = armor;
    if (gained > 0) this.hp += gained;
    this.hp = Math.min(this.hp, this.max);
  }
  setBonus(bonus: number) {
    const delta = bonus - this.bonus;
    this.bonus = bonus;
    if (delta > 0 && this.hp > 0) this.hp += delta;
    this.hp = Math.min(this.hp, this.max);
    if (this.hp > 0 && this.hp < 1) this.hp = 1;
  }
  damage(n: number): number {
    if (this.hp <= 0) return 0;
    const d = Math.min(this.hp, Math.max(n * 0.25, n - this.armor));
    this.hp -= d;
    return d;
  }
  heal(n: number): number {
    if (this.hp <= 0) return 0;
    const h = Math.min(n, this.max - this.hp);
    this.hp += h;
    return h;
  }
  revive(frac: number) { this.hp = Math.max(1, this.max * frac); }
}
