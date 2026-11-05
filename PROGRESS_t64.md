# t64 — First-person PBR textures (full roster) + vehicle/naval 2D redo

Approved (t63s311): improve first-person 3D textures on every tower and unit.
Steering: FP-primary; do **not** redo monkey/plant/troop 2D. Exception: redo 2D for helicopter, tank, Tidebreaker Destroyer, Harbor Beacon **and** improve their FP 3D.

## Done

### First-person (all towers + units)
- New `src/fps/mats.ts`: shared `MatKind` library (`fur/skin/cloth/leather/metal/gold/rust/iron/wood/bark/leaf/stone/paint/concrete/glow`) with Poly Haven CC0 albedo+normal maps, quality tiers via `setMatQuality`.
- `towers3d.ts`: keep UVs, tag parts with `inferMat`, merge by MatKind, assign `matOf` (textured StandardMaterial) instead of flat Lambert.
- `military.ts`: tank/heli GLBs recolored through textured mats; destroyer + beacon procedural naval use metal/rust/paint/concrete/gold mats; `userData.textured = true`.
- `Possess.ts`: `setMatQuality` on quality changes; troop meshes use cloth-tint StandardMaterial; Raider buggy uses metal/iron/rust.

### 2D exception (4 vehicles/naval)
- Painted tiered sprites: `public/assets/v3/unsc_{tank,heli,destroyer,beacon}_{0,1,2}.webp` (+ `art_src/military/paint_t64/`).
- Wired into `art.manifest.json`, HUD icons in `sprites.ts`, and world draw in `Renderer.vehicle` / `Renderer.naval` (painted body + flip; mil yaw sheets / procedural kept as fallback).

### Credits / validation
- `CREDITS_military.md` t64 section.
- `tests/e2e_t64.py` + `screenshots/t64/`.

## Not redone (by design)
- Monkey, plant, troop, turret-head, firebase/depot 2D v3 paintings — left as-is; FP only.

## Deploy
- **main** `5febc2c`
- **gh-pages** `0fe9077` — Deploy e686178 (clean; Pages rebuilt)

## Live
- https://beeforestry.github.io/bloons-of-the-frontier/
- BASE `/bloons-of-the-frontier/`

## Gaps / notes
- Vehicle world draw now uses single 3/4 painted sprites with horizontal flip (no 16-yaw). Mil sheets remain as fallback if a painted key is missing.
- Destroyer sprite includes a small waterline wake baked into the painting.
- Naval/monkey possess viewmodels still use the generic turret "box" gun; world meshes are textured.
- Heli FP body uses brighter paint olives (was near-black metal silhouette).
- CloudAgent was unavailable for this pass; work landed directly on the box checkout.
