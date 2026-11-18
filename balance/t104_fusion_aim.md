# t104 fusion + predictive aiming: balance and hit-rate check

Builds: **base** = pre-t104 main `d3f738c`; **t104** = this change. Bot = `tests/balance_bot.js` (fixed dt 0.1, same strategy).
`--fuse` (new) makes the bot an aggressive fuser: a new tower of a type that already has an unfused max-tier copy is built
right next to it, and every eligible pair is fused as soon as the fee is affordable.
Fusion numbers went through two versions:
- **v1**: ×1.6 damage, +15% rate, +10% range, fee 25% of full price, ≈2.4× one max tower.
- **v2 (shipped)**: ×1.4 damage, +10% rate, +8% range, fee 40%, ≈2.0× one max tower.

## Predictive aiming: hit rate (`tests/aim_sim.py`, `balance/t104_aim.md`)
Each finite-speed projectile tower (max tier, alone by lane 0) faces the same stream of 24 mixed-speed enemies (Red to Pink,
Scavenger, Hunter, Ceramic). HP ×400, so no shot is wasted on a target that already died. Same seed, lead OFF vs ON.

| map | aimed (centre) shot hit % OFF → ON | all projectiles OFF → ON |
|---|---|---|
| El Morro | 90.9 → **94.4** | 77.0 → 79.0 |
| Isla de Cabras | 83.1 → **90.5** | 69.4 → 71.9 |

Biggest gains (Isla de Cabras, aimed shot): Autoturret 84 → 98.5, Flak 82 → 99, Star 84 → 98, Pea 86 → 100, Dart 87.5 → 100.
Unchanged, as designed: fixed-lane Repeater, homing Arcane bolts, splash lobs (Melon / Glue were already ~100%).
Side darts of a spread volley still miss by design, so the "all projectiles" gain is smaller.

## Bot runs, medium (El Morro default rotation ×3; Isla de Cabras R1 water rotation `balance/t104_rot_r1.txt` + `--water` ×4)

| map | base | t104, no fusing | t104 + fusing v1 | t104 + fusing v2 (shipped) |
|---|---|---|---|---|
| El Morro | 3/3 WIN (HQ 148, 166, 152) | 3/3 WIN (172, 166, 162) | 3/3 WIN (150, 168, 136) | 3/3 WIN (169, 132, 176) |
| Isla de Cabras | 4/4 WIN (166, 200, 148, 130) | 3/4 (126, 147, 191; lost at wave 18) | 4/4 (200, 164, 200, 200) | 3/4 (200, 200, 200; lost at wave 19) |

## Bot runs, hard (100 waves; El Morro ×2, Isla de Cabras default rotation ×2)

| map | base | t104, no fusing | t104 + fusing v1 | t104 + fusing v2 (shipped) |
|---|---|---|---|---|
| El Morro | lost at 62, 62 | lost at 60, 52 | lost at 92, 94 | lost at 75, 84 |
| Isla de Cabras | lost at 18, 18 | lost at 18, 18 | lost at 18, 18 | lost at 16, 19 |

**Reading.**
- Medium: every loss is the known early Isla de Cabras wall (waves 16–19, before anything reaches max tier). It is a coin flip for this bot in every build.
- Hard El Morro: v1 fusion took the bot 30+ waves further, so it was cut to v2. Part of the gain is a bot artefact: without fusing, the bot reaches its tower-count cap holding about 80k unspent credits. Fusing turns that money into power and frees slots under the cap.
- v2 still gains 13–22 waves on hard El Morro but does not win. Fusing is a late-game money sink, not an early boost: you need two max-tier towers first.
- Leading on its own (no fusing) is within noise of base. These are single-seed runs with Math.random in the sim.
Raw: `balance/t104_*.json|md`.
