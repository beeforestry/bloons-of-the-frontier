// =============================================================================
// RESOURCE MANAGER
// Primary resource: CREDITS (pops/bug kills, farm crates and wave bonuses).
// SCRAP is a separate salvage currency: heavy enemies, ceramics/lead and
// cleared terrain drop scrap piles that troops must physically gather. It buys
// vehicles/Spartans (on top of credits) and the scrap-only Salvage Armory.
// Secondary resource hook: `power` exists but is disabled (enableSecondary)
// for a future "Power" cap on UNSC tech / troop supply.
// =============================================================================
import type { EventBus } from '../core/events';

export type ResourceType = 'credits' | 'power' | 'scrap';
export interface Cost { credits: number; power?: number; scrap?: number }

export class ResourceManager {
  private amounts: Record<ResourceType, number> = { credits: 0, power: 0, scrap: 0 };
  enableSecondary = false;
  /** Multiplayer client mirror: the host owns the wallet, local adds/spends are ignored. */
  frozen = false;
  /** Co-op host: split shared income (kills, farms, waves) across every player's wallet. */
  splitHook: ((amount: number, type: ResourceType) => number) | null = null;
  dump() { return { ...this.amounts, earned: this.earned, spent: this.spent }; }
  load(w: { credits: number; power?: number; scrap: number; earned?: number; spent?: number }, silent = false) {
    const dc = w.credits - this.amounts.credits, ds = w.scrap - this.amounts.scrap;
    this.amounts.credits = w.credits; this.amounts.scrap = w.scrap; this.amounts.power = w.power ?? 0;
    if (w.earned !== undefined) this.earned = w.earned; if (w.spent !== undefined) this.spent = w.spent;
    if (silent) return;
    if (dc) this.bus.emit('credits', { credits: this.amounts.credits, delta: dc });
    if (ds) this.bus.emit('scrap', { scrap: this.amounts.scrap, delta: ds });
  }
  /** Lifetime stats for the HUD / tests. */
  earned = 0;
  spent = 0;
  constructor(private bus: EventBus, startingCredits: number) { this.amounts.credits = startingCredits; }

  get credits() { return this.amounts.credits; }
  get scrap() { return this.amounts.scrap; }
  /** Lifetime scrap gathered / spent. */
  scrapEarned = 0; scrapSpent = 0;
  get(type: ResourceType) { return this.amounts[type]; }

  canAfford(c: Cost) {
    return this.amounts.credits >= c.credits && this.amounts.scrap >= (c.scrap ?? 0) && (!this.enableSecondary || this.amounts.power >= (c.power ?? 0));
  }
  /** Returns false (and spends nothing) if unaffordable. */
  spend(c: Cost): boolean {
    if (this.frozen || !this.canAfford(c)) return false;
    this.amounts.credits -= c.credits;
    if (this.enableSecondary) this.amounts.power -= c.power ?? 0;
    if (c.scrap) { this.amounts.scrap -= c.scrap; this.scrapSpent += c.scrap; this.bus.emit('scrap', { scrap: this.amounts.scrap, delta: -c.scrap }); }
    this.spent += c.credits;
    this.bus.emit('credits', { credits: this.amounts.credits, delta: -c.credits });
    return true;
  }
  add(amount: number, type: ResourceType = 'credits') {
    if (amount <= 0 || this.frozen) return;
    if (this.splitHook) amount = this.splitHook(amount, type);
    amount = Math.round(amount);
    if (amount <= 0) return;
    this.amounts[type] += amount;
    if (type === 'credits') {
      this.earned += amount;
      this.bus.emit('credits', { credits: this.amounts.credits, delta: amount });
    } else if (type === 'scrap') {
      this.scrapEarned += amount;
      this.bus.emit('scrap', { scrap: this.amounts.scrap, delta: amount });
    }
  }
}
