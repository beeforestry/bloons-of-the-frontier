// =============================================================================
// RESOURCE MANAGER
// Primary resource: CREDITS (one currency keeps the King-Rush-style economy
// readable: pops/bug kills, farm crates and wave bonuses all pay Credits).
// Secondary resource hook: `power` exists but is disabled (enableSecondary)
// for a future "Power" cap on UNSC tech / troop supply.
// =============================================================================
import type { EventBus } from '../core/events';

export type ResourceType = 'credits' | 'power';
export interface Cost { credits: number; power?: number }

export class ResourceManager {
  private amounts: Record<ResourceType, number> = { credits: 0, power: 0 };
  enableSecondary = false;
  /** Lifetime stats for the HUD / tests. */
  earned = 0;
  spent = 0;
  constructor(private bus: EventBus, startingCredits: number) { this.amounts.credits = startingCredits; }

  get credits() { return this.amounts.credits; }
  get(type: ResourceType) { return this.amounts[type]; }

  canAfford(c: Cost) {
    return this.amounts.credits >= c.credits && (!this.enableSecondary || this.amounts.power >= (c.power ?? 0));
  }
  /** Returns false (and spends nothing) if unaffordable. */
  spend(c: Cost): boolean {
    if (!this.canAfford(c)) return false;
    this.amounts.credits -= c.credits;
    if (this.enableSecondary) this.amounts.power -= c.power ?? 0;
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
    }
  }
}
