// Player settings persisted in localStorage.
export type ShakeLevel = 'full' | 'reduced' | 'off';
const KEY = 'bof.shake';
export const SHAKE_SCALE: Record<ShakeLevel, number> = { full: 1, reduced: 0.4, off: 0 };
export function getShake(): ShakeLevel {
  let v: string | null = null; try { v = localStorage.getItem(KEY); } catch { /* */ }
  return v === 'reduced' || v === 'off' ? v : 'full';
}
export function setShake(v: ShakeLevel) { try { localStorage.setItem(KEY, v); } catch { /* */ } }
/** t48: Reduce flashing (no white hit-flash silhouettes, no shockwave refraction, dimmer rings). */
const FKEY = 'bof.flash';
export function getReduceFlash(): boolean { try { return localStorage.getItem(FKEY) === '1'; } catch { return false; } }
export function setReduceFlash(on: boolean) { try { localStorage.setItem(FKEY, on ? '1' : '0'); } catch { /* */ } }
