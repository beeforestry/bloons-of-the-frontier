# t103 — Element status combos ("algo nuevo basado en recursos de GitHub")

Idea source: **Lightkeepers** by vega-star (https://github.com/vega-star/lightkeepers, **Apache-2.0**), a TD tech demo
about combining elements. We used the idea only. No code, art or data was copied. Credited in README, CREDITS_military.md and the in-game guide.

## What it does
Some towers stamp an element status on what they hit. When a second, different status lands on the same enemy, the two react.
All tuning is in `ELEM_TUNE` in `src/systems/Elements.ts`.

| Status | Towers (tier that unlocks it) | Seconds per tier |
|---|---|---|
| 💧 Soaked | Tidebreaker Destroyer (all) · Corrosive Glue Slinger (tier 2+) | 3/3.5/4 · –/2.5/3 |
| 🔥 Burning (DoT = 10% of the hit per s) | Flame Melon Mortar (all) · Bulwark Battle Tank (tier 3 Siege Gunner) | 3/3.5/4 · –/–/3 |
| ❄ Chilled | Frost Oakshield Bastion (all) | 2/2.5/3 |
| ⚡ Shocked | Tesla Coil (all) · Harbor Beacon (tier 2+) · Rail Lance Emplacement (tier 2+) | 1.5/2/2.5 · –/1.5/2 · –/1.5/2 |

| Combo | Recipe | Effect |
|---|---|---|
| CONDUCT | 💧 + ⚡ (either order) | chain lightning to the 4 nearest enemies within 120 px, 50% of the hit + 4 each (AP, hits air); consumes Soaked; 0.25 s per-enemy cooldown |
| FREEZE | 💧 + ❄ | frozen solid 1.4 s (heavy/armored ×0.6, bosses ×0.3 → 0.42 s), then 5 s immunity |
| SHATTER | ❄ (or frozen) + heavy hit | that hit +60% (+100% and the ice breaks if frozen). Heavy = explosive, Marksman, Rail Lance, tank, Snapjaw, Obelisk |
| STEAM | 🔥 + 💧 | fire out; 3 s with armor plating offline and +20% damage taken (bosses +10%) |
| WILDFIRE | 🔥 + explosion | burn spreads to up to 5 non-burning enemies within 80 px (1.5 s cooldown) |
| (cancel) | 🔥 + ❄ | they cancel out (fire melts the frost) |

The status duration is a new `combat.status` stat. It only grows tier to tier, so the upgrade validator still passes, and the
upgrade button shows "NEW 💧 Soaked 2.5s" on the tier that unlocks it.

## Visuals / UI
- 2D: each status has its own overlay (water sheen + drips, flame flicker + embers, frost tint, ice block when frozen, sparks, steam puffs),
  plus an icon row above the HP bar. Each combo shows a popup with its recipe and a ring (throttled to one per combo per 0.3 s),
  and Conduct draws jagged white-cyan arcs. The first combo of a match shows a toast.
- First person (Possess): enemies with a status get a light tint, plus a floating badge drawn with vectors (no emoji font needed) over the 40 nearest.
  Conduct arcs are mirrored as cyan tracers.
- Co-op/versus clients: statuses ride in the enemy flag bits (3..8), so clients see the icons and tints too.
- Guide: **⚗ Element combos** on the main menu, or **⚗ ?** in the tower panel of any element tower (English + Spanish).
  The tower panel shows "⚡ Hits leave Shocked (1.5s) · combos: Conduct" or "Tier 2 unlocks …".

## Balance
See `balance/t103_elements.md`. El Morro: 6/6 wins before and after. Isla de Cabras: the existing wave-19 coin flip stays a coin flip
(49% → 35% in pooled R1 samples, within noise; R2 element rotation 0/3 → 2/3).

## Tests
- `npm run build` (tsc + validator + vite): OK.
- New `tests/e2e_t103.py`: PASS locally and live. It checks:
  - tower→element mapping
  - every combo with exact numbers (Conduct 9 per arc, either order; Freeze 1.4 s with immunity, boss 0.42 s; Shatter 16 vs 10 and 20 frozen; Steam 12 vs 10; Wildfire spread; fire+frost cancel; burn DoT)
  - real towers: Tesla + tier-2 Glue → Conduct, Glue + Frost Bastion → Freeze
  - the tower-panel line and the guide (EN + ES + credit), and the menu button
  - first person: statuses visible plus 40 badges
- Regression: e2e_t97, t53, t99, t101, t80 PASS. e2e_t101b fails only on the Scorpion side-on/board check, and it fails the same way on the pre-t103 build
  (timing under load), so this change didn't cause it. e2e_t74 PASS live. e2e_t78 (Overrun timer/bite checks): 7 failures on the t103 live build vs 8 on the pre-t103 build, same headless-timing checks (t103's are a subset), so this change didn't cause them.

Shipped: main `786f5c0` (feature, tests, balance) + notes commit; gh-pages `dce5489` (BASE=/bloons-of-the-frontier/, .nojekyll kept), live bundle `assets/index-D7mhyxVU.js`, e2e_t103 PASS live.
Screenshots: `screenshots/t103/live_2d_conduct_combo.png`, `live_2d_status_icons.png`, `live_fp_status_tint_conduct.png`, `live_2d_combo_guide.png`.

Tooling: `tests/balance_sim.py --pre "<js>"` runs JS before the bot (e.g. `window.__game.elemTune.off.push('conduct')`).
