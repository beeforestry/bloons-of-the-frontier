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
    if (!this.canAfford(c)) return false;
    this.amounts.credits -= c.credits;
    if (this.enableSecondary) this.amounts.power -= c.power ?? 0;
    if (c.scrap) { this.amounts.scrap -= c.scrap; this.scrapSpent += c.scrap; this.bus.emit('scrap', { scrap: this.amounts.scrap, delta: -c.scrap }); }
    this.spent += c.credits;
    this.bus.emit('credits', { credits: this.amounts.credits, delta: -c.credits });
    return true;
  }
  add(amount: number, type: ResourceType = 'credits') {
    if (amount <= 0) return;
    amount = Math.round(amount);
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
