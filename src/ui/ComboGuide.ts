// t103: "Element combos" guide overlay (menu button + tower panel ⚗ button). English with Spanish subtitles.
import { COMBOS, ELEMENTS, type ComboId } from '../systems/Elements';
import { TOWERS } from '../data/towers';
import type { Element, TowerData } from '../core/types';

/** Which tower tiers stamp which element, e.g. "Tesla Coil (all tiers)", "Corrosive Glue Slinger (tier 2+)". */
export function elementSources(el: Element): string[] {
  return TOWERS.filter((t) => t.element === el).map((t) => {
    const first = t.tiers.findIndex((x) => !!x.combat?.status);
    return `${t.name}${first <= 0 ? '' : ` (tier ${first + 1}+)`}`;
  });
}
/** Combos the given element takes part in. */
export function combosFor(el: Element): ComboId[] {
  return (Object.keys(COMBOS) as ComboId[]).filter((id) => COMBOS[id].recipe.includes(ELEMENTS[el].icon));
}
/** One-line element summary for a tower tier (tower panel / card). */
export function elemTag(td: TowerData, status?: number): string {
  if (!td.element || !status) return '';
  const e = ELEMENTS[td.element];
  return `${e.icon} ${e.name} ${status}s`;
}

export function openComboGuide() {
  document.getElementById('combo-guide')?.remove();
  const ov = document.createElement('div'); ov.id = 'combo-guide'; ov.className = 'overlay show combo-guide';
  const els = (Object.keys(ELEMENTS) as Element[]).map((k) => { const e = ELEMENTS[k];
    return `<div class="cg-el"><b style="color:${e.color}">${e.icon} ${e.name}</b> <i>${e.es}</i><div class="cg-src">${elementSources(k).join(' · ')}</div></div>`; }).join('');
  const cbs = (Object.keys(COMBOS) as ComboId[]).map((k) => { const c = COMBOS[k];
    return `<div class="cg-combo"><div class="cg-r">${c.recipe}</div><div><b style="color:${c.color}">${c.name}</b> <i>${c.es}</i><div>${c.desc}</div><div class="cg-es">${c.descEs}</div></div></div>`; }).join('');
  ov.innerHTML = `<div class="panel cg-panel"><h2>⚗ Element combos <small>· Combos de elementos</small></h2>
    <p class="cg-intro">Some towers stamp a status on what they hit. When a second, different status lands, they react.
    <br><span class="cg-es">Algunas torres marcan un estado al pegar. Si llega otro distinto, reaccionan.</span></p>
    <div class="cg-els">${els}</div><div class="cg-combos">${cbs}</div>
    <p class="cg-es">🔥 + ❄ se anulan (fire melts frost). Bosses resist freeze · Los jefes resisten el congelamiento.</p>
    <p class="cg-credit">Idea inspired by <a href="https://github.com/vega-star/lightkeepers" target="_blank" rel="noopener">Lightkeepers</a> (vega-star, Apache-2.0).</p>
    <button class="btn" id="cg-close">Close · Cerrar</button></div>`;
  document.body.appendChild(ov);
  const close = () => ov.remove();
  ov.querySelector('#cg-close')!.addEventListener('click', close);
  ov.addEventListener('click', (ev) => { if (ev.target === ov) close(); });
}
