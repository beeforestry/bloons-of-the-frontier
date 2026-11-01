// Pause menu: Resume, 🐞 Report a problem, Settings (screen shake Full / Reduced / Off), Main menu.
// A compact card over the battlefield (the top bar stays usable, e.g. for co-op ⏸/▶).
import type { Game } from '../game/Game';
import { getShake, setShake, SHAKE_SCALE, type ShakeLevel } from './Settings';
import { openBugReport } from './BugReport';

export class PauseMenu {
  readonly el: HTMLElement;
  private shown = false;
  constructor(readonly g: Game, resume: () => void) {
    this.el = document.createElement('div'); this.el.id = 'pause-menu'; this.el.hidden = true;
    this.el.innerHTML = `<h2>⏸ Paused</h2>
      <button class="btn go" id="pm-resume">▶ Resume</button>
      <div class="pm-set"><span>📳 Screen shake</span><div class="seg" id="pm-shake">${(['full', 'reduced', 'off'] as const).map((v) => `<button class="btn small" data-shake="${v}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('')}</div></div>
      <button class="btn" id="pm-bug">🐞 Report a problem</button>
      <button class="btn" id="pm-menu">⌂ Main menu</button>`;
    (document.getElementById('stage') ?? document.body).appendChild(this.el);
    this.el.addEventListener('pointerdown', (e) => e.stopPropagation());
    this.el.querySelector<HTMLElement>('#pm-resume')!.onclick = resume;
    this.el.querySelector<HTMLElement>('#pm-bug')!.onclick = () => openBugReport();
    this.el.querySelector<HTMLElement>('#pm-menu')!.onclick = () => { location.href = location.pathname; };
    for (const b of Array.from(this.el.querySelectorAll<HTMLElement>('[data-shake]'))) b.onclick = () => this.setShake(b.dataset.shake as ShakeLevel);
    this.setShake(getShake(), false);
  }
  setShake(v: ShakeLevel, save = true) {
    if (save) setShake(v);
    this.g.shakeScale = SHAKE_SCALE[v]; this.g.resetShake();
    for (const b of Array.from(this.el.querySelectorAll<HTMLElement>('[data-shake]'))) b.classList.toggle('on', b.dataset.shake === v);
  }
  update() {
    const want = this.g.paused && this.g.state === 'playing';
    if (want !== this.shown) { this.shown = want; this.el.hidden = !want; }
  }
}
