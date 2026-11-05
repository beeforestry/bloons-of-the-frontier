# t67 / t68 — Projectiles, lighthouse shaft, sandbags, 3D-from-2D

Live: https://beeforestry.github.io/bloons-of-the-frontier/

## What changed
1. **Rail Lance (`unsc_rail`)** — Acquire range unchanged. Hitscan slug reaches ~950–1510 px (tier-scaled) and pierces along that full line; brighter/thicker beam by tier.
2. **Per-turret projectiles** — 2D kinds match shooters; tank roof MG secondary fires `bullet` tracers; Skyranger T1+ fires rocket (`shell`) salvos every 4th volley with chin gun.
3. **Harbor Beacon** — Continuous warm lighthouse shaft via `CombatTower.beamTo` (2D + FP). Damage ramps with `lockRamp` / `lockRampMax` (T0→T2: ×2.5 / ×3.2 / ×4.0).
4. **FP projectiles** — Oriented colored capsules from `g.projectiles`; beam FX + beacon shaft synced into Possess tracers; muzzle tracers colored by weapon kind.
5. **Sandbags** — Connected overlapping berm (no floaty gaps) + procedural hessian / photo sandbag tex; 2D `prop_sandbags.webp` rebaked.
6. **3D-from-2D enemies (t68)** — Per-bloon `InstancedMesh` (red/blue/green/yellow/pink/lead/ceramic) each mapped from own `assets/v3/bloon_*.webp`. Bugs use scavenger sprite albedo + instanceColor tint to each bug’s painted hex. Towers reuse procedural `towers3d.ts` matched to 2D silhouette/palette (not regenerated).

## Skip / reuse
- Acid vial/spray/can logic (t45) untouched.
- Vehicle GLBs (tank/heli) reused from t65 photoreal pass.
- Tower procedural meshes in `towers3d.ts` already 3D-from-2D — not rebuilt from sprite pixels.

## Honest gaps
- Bloon meshes are spheres with painted sprite albedo (not sculpted rubber knots unique per marking beyond the shared knot).
- Bug enemies still share one procedural mesh; only scavenger sprite + hex tint (not unique sculpted meshes per bug id).
- Full unique mesh-per-tower sculpt from sprite pixels not done; towers3d procedural remains the 3D read.
- Free CC0 packs not pulled — own v3 art + existing towers3d/military covered the priority roster.

## Screenshots
`/workspace/bloons-frontier/screenshots/t67/`
- `01_2d_rail_pierce.png` … `07_fp_enemies_textured.png`
- `08_2d_sprite_references.png` — painted v3 look refs
- `09_3d_from_2d_comparison.png` — 2D refs above FP textured enemies

## Deploy SHAs
- main: (pending)
- gh-pages: (pending)
