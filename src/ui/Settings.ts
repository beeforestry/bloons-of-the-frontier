// Player settings persisted in localStorage.
export type ShakeLevel = 'full' | 'reduced' | 'off';
const KEY = 'bof.shake';
export const SHAKE_SCALE: Record<ShakeLevel, number> = { full: 1, reduced: 0.4, off: 0 };
export function getShake(): ShakeLevel {
  let v: string | null = null; try { v = localStorage.getItem(KEY); } catch { /* */ }
  return v === 'reduced' || v === 'off' ? v : 'full';
}
export function setShake(v: ShakeLevel) { try { localStorage.setItem(KEY, v); } catch { /* */ } }
