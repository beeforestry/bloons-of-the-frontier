# t101 — "Métele con ganas" improvement push

| # | item | what changed | verified by |
|---|---|---|---|
| 1 | Marksman Scout horizon tilting after a shot | Root cause: `camera.rotation.order = 'YXZ'` had been swallowed into a trailing comment in t99, so the first-person camera used XYZ order and any pitched + yawed view (e.g. after aiming at a far target) rolled the horizon. Restored on its own line; `state().roll` reports the horizon tilt. | e2e_t101b: 3 scoped shots at different pitch/yaw, max roll 0.000° |
| 2 | Parked Raider Buggy / Bulwark Scorpion collision | `Game.walkable()` now treats parked vehicles as oriented boxes (Raider 4.7 × 2.4 m, Scorpion 7.2 × 3.7 m + 0.35 m body radius). Applies to possessed troops, driven vehicles and Overrun monsters (AI and player-turned). A body already overlapping one (spawn / step-out) may only move outward, so nobody gets stuck. | e2e_t101b: walk into each vehicle end-on and side-on → stops at the hull (0.00 m overlap), F still boards, step out + walk away; e2e_t80 / t99 boarding + Overrun pass |
| 3 | Isla de Cabras rocks chunky up close | The faceted flat-shaded Kenney rocks are replaced by procedural boulders: noise-displaced icosahedron with flat cleavage faces, smooth normals, 3 shape variants, per-instance yaw/tilt/footprint, CC0 Poly Haven Rock 06 colour + normal map pulled toward grey limestone. Near LOD 980 tris, far LOD 180 tris (LOD switch 11–16 m). | e2e_t101b: 1,123 boulders, no Kenney rocks, near LOD normal-mapped; screenshot |
| 4 | Destroyer reached only 66 % of one lane | Tidebreaker Destroyer range 220/245/275 → **260/285/315** (each tier still strictly better). Coverage from valid water spots: 0.639/0.875/0.913 → **0.984/0.953/0.957**. | e2e_t101b coverage + tier check; validator; balance below |
| 5 | Phone hint said "bottom panel" | Menu hint now names 🏗 Build / 👥 Troops. Tutorial steps 2, 5 and 7 have phone wording and highlight the Build / Troops toggle buttons on ≤820 px. | e2e_t101b phone check; e2e_t97 |
| 6 | Old San Juan backdrop | Beyond El Morro's esplanade: USGS 3DEP lidar terrain (PD) + NOAA 2017 aerial (PD) for 1.3 km of the islet, roofs classified from the aerial and extruded 2–4 storeys with vertical walls, pastel facades + windows. Also visible across the bay from Isla de Cabras (scope view). Skipped on low quality. `art_src/tools/oldsj_backdrop.py`. | e2e_t101b: 332k tris, 22k blocks; screenshots |

Not done: El Cañuelo interior rooms (time went to the Old San Juan backdrop; left for a later run rather than half-built).

## Balance (tests/balance_sim.py, tropical, medium, water rotation with destroyers + beacons)
3 runs: WIN 163/200, WIN 200/200, WIN 158/200 (t100 baseline at the same ease: 2 wins, 1 loss at wave 16). `balance/t101_trop_water_{1,2,3}.md`.

## Tests
build (tsc + validator + vite) OK · e2e_t101b PASS · e2e_t53, t80, t97, t99, t74, t101 PASS ·
e2e_t78 (Overrun timer/bite checks): same 6 failures on the current live build before this change (headless timing), not caused by t101b.

Shipped: main 4d20ab3 (code, data, tests) + 484b065 (notes); gh-pages 2a7904f, live bundle `assets/index-CvpcDdyL.js` (e2e_t101b PASS live).
