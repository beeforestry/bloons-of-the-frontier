# t104: same-type tower fusion + predictive aiming

## 1. Same-type tower fusion
| piece | what |
|---|---|
| Rule | Two towers of the same type and owner, both at their last tier, not fused, footprints within 40 px of each other. Not for path objects or single-use pods. Fee: 40% of one tower's full price. |
| Result | The selected tower absorbs its neighbour; the neighbour's spot is freed and its garrison is ejected. The survivor uses a synthetic **fused tier** (`src/data/fusion.ts` `fusedTier()`): ×1.4 damage, +10% fire rate, +8% range, +1 pierce/chain, ×1.2 splash, ×1.8 HP. Auras, farms, orbs and hypno get their own multipliers, slows are capped at 75%, unknown numeric stats ×1.15, and no stat is ever lower. Overall about 2× one max tower, i.e. the pair's power in one spot. |
| Sell | `invested` = both towers + fee, so the sell value stays 70% of everything spent (Dart Scout pair + fee: invested 2,205 → sell 1,543). |
| Validator | `validateTower` also checks every fusable type's fused tier against its last tier: no numeric stat lower, HP and power strictly up, visual level +1, model scale strictly bigger. 30 tower types pass. |
| UI | Tower panel: **⚛ Fuse with neighbour ¢fee** button with the stat deltas when a partner is adjacent; otherwise a how-to hint at max tier; a "★ FUSED" tag once fused. Selecting a max tower draws a dashed gold "⚛ fuse" link to its partner. |
| 2D look | Pulsing gold ground glow, two counter-rotating dashed gold rings, 3 orbiting sparks, a ★ medallion; bigger sprite (scale ×1.15) and gold tier pips. |
| First-person look | Gold torus halo + partial ring (spinning), a faint additive light column, a ★ badge sprite over the model; bigger model; the name reads "… ★ Fused". |
| Save / Continue | Save stores `fu: 1`; the restore rebuilds the tower to max, then `applyFusion` (invested = 2 towers + fee). |
| Co-op | `fuseTowers` is a networked Game command (Sync `G_METHODS`); the owner check applies to both towers. The snapshot carries a fused flag and clients replay `applyFusion`. |

## 2. Predictive aiming
- `Enemy.predict(g, t)` advances the enemy along its lane at its current speed, using the slow/surge timers. Stun time is subtracted. Blocked, at-gate, leaping, hunting and ally enemies stay put. The lateral offset is kept.
- `Game.leadPoint(from, e, speed)` iterates time-of-flight 4× to find the intercept point. `Game.leadLob(e, dur)` gives the landing point for lobs.
- Applied to:
  - straight tower projectiles: darts, peas, shurikens, stars, shells, flak, Autoturret/Cherry bullets, the heli minigun + rockets, the tank roof MG
  - homing Arcane bolts (initial heading)
  - Melon lobs, and the Glue vial / sprayer / canister
  - troop rifles
- Unchanged: hitscan/beam weapons, boomerangs (curved flight), fixed-lane Repeater.
- First person: a direct shot (crosshair on an enemy) goes through `towerFire` with the real target, so it leads. A free crosshair shot uses a fake target with no `predict`, so it flies exactly where you aim.
- `g.leadAim` toggle (test/sim) restores the old aim; `stats.projShots/projHits/projAimShots/projAimHits` give the hit-rate metric.
- Hit rate (`tests/aim_sim.py`, `balance/t104_aim.md`), aimed shot:

| map | OFF | ON |
|---|---|---|
| El Morro | 90.9% | **94.4%** |
| Isla de Cabras | 83.1% | **90.5%** |

  Autoturret on Isla de Cabras: 84 → 98.5%.

## Balance
See `balance/t104_fusion_aim.md`.
- Medium, both maps: wins are unchanged. The only losses are the known early Isla de Cabras wall (waves 16–19), in base too.
- Hard El Morro, with the bot fusing aggressively: v1 numbers (×1.6 damage, fee 25%) reached waves 92/94 vs 62/62 for base. That was too strong, so fusion was cut to v2, which reaches 75/84: still a loss, a late-game money sink rather than a free win.
- `tests/balance_sim.py --fuse` / `window.__BOT_FUSE` enable the fusing bot.

## Tests
- `npm run build` (tsc + validator + vite): OK.
- **e2e_t104**: PASS (fusion rules, panel, save/Continue, predict accuracy, hit-rate sim, FP lead, FP look, co-op sync).
- Existing suite: e2e_t97, t53, t101, t80, t103, t74 PASS. e2e_t99 passed on a rerun (one load-related flake, and the base build flaked on a different check).
- Pre-existing failures:
  - e2e_t101b: Scorpion side-on/board, same as base.
  - e2e_t78: 9 failures (Overrun timer/bite checks, headless). The pre-t104 build fails the same 9.
  - e2e_mp: co-op part all OK; the versus part crashes at `cells[30]` (too few free cells). The pre-t104 build crashes the same way, also with `--map morro`.

## Shipped
- main `0d680d6`, gh-pages `57d71ef` (`.nojekyll` kept).
- Live bundle `assets/index-D7mhyxVU.js` → **`assets/index-CByxsJcm.js`**.
- e2e_t104 live: sections A–C PASS. Section D (co-op) can't run against the https site because its test relay is http://localhost and the browser blocks mixed content. It passes locally.
- Live screenshots: `screenshots/t104/live_fuse_ready_panel.png`, `live_fused_tower_2d.png`, `live_fused_tower_fp.png`.
- Box note: the box was reset mid-task (lost /tmp, node_modules and part of the uncommitted edits). The lost edits were redone, `npm ci` reinstalled dependencies, and work since then is committed at checkpoints.
