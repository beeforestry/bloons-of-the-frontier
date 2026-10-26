// Tiny math helpers shared by all systems.
import type { Vec } from './types';
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
export const dist2 = (a: Vec, b: Vec) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
export const rand = (a: number, b: number) => a + Math.random() * (b - a);
let _id = 1;
/** Unique ids for entities and buff sources. */
export const nextId = () => _id++;
