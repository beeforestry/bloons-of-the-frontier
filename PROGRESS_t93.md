# t93 — El Morro first-person graphics pass

- main: `dee23a1` (t93 code + CC0 textures + e2e_t93 + CREDITS t93 section); this file + the e2e_t93 portal-walk threshold tweak follow in the next commit.
- gh-pages: `1a6e45f` (deploy of dee23a1, built with `BASE=/bloons-of-the-frontier/`, `.nojekyll` kept). Live: https://beeforestry.github.io/bloons-of-the-frontier/
- Live bundle: `assets/index-BW8qGt0F.js`, Possess chunk `assets/Possess-B-tuunC4.js`. HTTP 200: `/`, `/index.html`, `/.nojekyll`, Possess chunk, main bundle, `assets/tex/mr_{earth,gravel,deck,plaster,brick}.webp`.

## Built (first person only; 2D sim untouched — 349 LOS walls, movement/walkable unchanged)
- Floors: Plaza de Armas + sunken lower court are reddish packed earth (Poly Haven Red Laterite Soil, tinted, mottled); upper gun decks pale worn concrete scaled by the aerial's luminance; lawns keep the aerial.
- Brick gun-pivot rings (31) on flat deck cells at the parapet foot, cannons on every other (16).
- Main ramp (y≈1590): plaza portal → gravel centre strip, brick curbs, stone side steps (156), causeway walls with brick caps, masonry arch with brick voussoirs, down to the Santa Bárbara battery deck (35.6 → 31.6 → 23.1 m, max 0.21 m step per 0.5 m).
- Wide stair (42 steps) from the lower court (16.7 m) to the battery deck (22.9 m) with casemate arches/rooms under its court side; casemate retaining wall with 3 arches + rooms + doors.
- Walkable 3D plaza arcade: 30 vaulted walk-in bays, yellow/white plaster, pilasters, archivolts, cornice; chapel front with door on the longest wall; well; portal passage to the ramp. Facades follow the lidar wall face (per-end probing).
- All 7 garitas rebuilt: weathered plaster (white/ochre/black streaks, exposed stone), corbel, drum, dome, finial ball, dark doorway, lit interior with slits, walkable; narrow approach between two high parapets with a brick course at the base and an earth floor. Old smooth primitives removed.

## Tests
- e2e_t93 local: pass. Live (`--url … --tag live`): pass (FAILS: none), no console errors.
- e2e_t80, e2e_t53, e2e_t77: pass.
- e2e_t78: "monsters bite the survivors" fails locally both with t93 and with the untouched t80 HEAD build (same failure, tropical map, timing under swiftshader); passes against the old live — pre-existing flake, not a t93 regression.
- Screenshots: `screenshots/t93/local_*.png`, `screenshots/t93/live_*.png` (git-ignored).

## Limitations
- Three garitas sit low (decks 5.6 / 2.4 / 0.3 m) at the t80 seawall positions; kept as placed.
- Lidar wall faces elsewhere keep the t80 sawtooth; plaza east facade is slightly slanted where the lidar face is.
- Under swiftshader (~1 fps) keyboard walking is slow, so walk checks are short and paired with 0.5 m surface-continuity sampling.
