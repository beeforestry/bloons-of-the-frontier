// Minimal typed event bus so systems (economy, waves, UI) stay decoupled.
type Handler<T> = (payload: T) => void;
export interface GameEvents {
  credits: { credits: number; delta: number };
  lives: { lives: number };
  wave: { wave: number; total: number; active: boolean };
  toast: { text: string; color?: string };
  selection: { kind: 'tower' | 'squad' | 'none' };
  gameover: { won: boolean };
  organized: { moved: number; freedNote: string };
}
export class EventBus {
  private map = new Map<keyof GameEvents, Set<Handler<any>>>();
  on<K extends keyof GameEvents>(k: K, h: Handler<GameEvents[K]>): () => void {
    if (!this.map.has(k)) this.map.set(k, new Set());
    this.map.get(k)!.add(h);
    return () => this.map.get(k)!.delete(h);
  }
  emit<K extends keyof GameEvents>(k: K, p: GameEvents[K]) {
    this.map.get(k)?.forEach((h) => h(p));
  }
}
