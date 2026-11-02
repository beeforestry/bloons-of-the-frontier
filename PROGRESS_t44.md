# t44 — Full 3D towers + Sniper line of sight

## Done
- **3D towers (src/fps/towers3d.ts)**: procedural low-poly three.js models for all 29 non-vehicle towers × every tier (78 id:tier combos incl. single-tier wallnut/cherry pod), matched to the 2D sprites (monkey outfits per tier, plants on dirt mounds, UNSC olive metal turrets/bunker/depot, stone rampart, tesla, obelisk). Tank/Gunship keep the t42 real-size models.
  - Parts merged per tower into ≤4 vertex-coloured meshes (lit + glow, base + rotating head), geometry cached per id:tier, shared materials → 2–4 draw calls per tower. Lazy-loaded with the Possess chunk.
  - Heroic scale: monkeys ~2.6 m (×1.2), plants/turrets 2.2–3.4 m, obelisk/tesla ~4 m, vs 1.65 m trooper eye. Root scale also follows tier `visual.scale`; the model rebuilds on upgrade.
  - Dev gallery: `art_src/tools/mil_render/index.html?mode=towers[&ids=..&prog=..]` puts the 2D sprite next to the 3D render.
- **Sniper Monkey LOS (src/systems/LineOfSight.ts)**: a polar table per sniper (240 angle bins × 16 px steps). Rays are marched over terrain height (Tropical hills) plus blocker cylinders: props (tent 3.2 m, fuel 2.4, supply 1.7, sandbags/barrier ~1.1), palms 8–9 m, rocks 2.8, bushes 1.6, other towers (tank 3.4, gunship pad 3.0, tesla/obelisk ~4.3, generic 2.4) and El Morro garitas 4.5. It stores the lowest visible target height per cell. The table is cached per tower and rebuilt when `g.losVer` bumps (tower placed or sold).
  - Targeting skips enemies it cannot see (bloons 1.3 m, MOAB 2.6 m; aircraft are never blocked).
  - Selected sniper range ring: dark blocked wedges, a dashed red edge where blocking starts, and a "LOS BLOCKED" label.
- Validator ✓, balance script ✓. **No balance tweak.** The static DPS table is unchanged; the sniper is situationally weaker on prop- or palm-heavy spots.
- e2e: tests/e2e_t44.py, all pass.

## Bundle
- Possess chunk: 663.58 → 703.35 kB (+39.8 kB; gzip 175.10 → 189.99, +14.9).
- Index: 472.62 → 476.88 kB (+4.3 kB; gzip +2.0).

## Known gaps
- El Morro has no wall geometry data. Only the garitas block LOS; the painted walls do not.
- Jungle/garden painted trees are not obstacles (no position data). Only map props and Tropical's 3D props are.
- wallnut_barrier and cherry_pod models exist, but those path items are not drawn as towers in first person.
- The LOS check is per angle bin (1.5°), so it is approximate at very long range.
