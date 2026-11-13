# t80 — El Morro first-person accuracy pass + parked enterable vehicles

## What shipped
- **Real 3D Castillo San Felipe del Morro in first person** (El Morro map, sandbox / TD / Overrun):
  a 0.5 m fort heightfield (540×500 samples, gzip 218 KB, lazy-loaded) built from the USGS 3DEP lidar and lined up with the NOAA aerial
  the 2D map already uses. Wall faces are sharpened to near-vertical battered faces, parapets get merlons/embrasures every ~5.5 m;
  the bastions, dry moat, Plaza de Armas pit, ramps and upper battery all come from the survey. Rendered as 64-vertex chunks (frustum/shadow culled);
  high quality 0.5 m (~538k tris), medium/low 1 m.
- **Wall look**: triplanar ochre plaster over exposed stone courses, rain streaks and mould on steep faces; decks/lawns keep the aerial photo.
- **Set pieces**: 7 garitas (sentry boxes) seated on the bastion salients facing out, the lighthouse on the upper deck, US / Puerto Rico /
  Cross-of-Burgundy flags on three poles, the Plaza de Armas with yellow-and-white arched arcade facades on its sides, stone floor and well.
  The HQ on El Morro is ochre with a terracotta roof.
- **Flora from the aerial**: 2286 placed plants — south bay-side scrub thicket (trees / bushes / ferns), long grass on the north seawall bank,
  tufts along lawn edges. The esplanade stays open grass. No palm ring.
- **Parked, enterable vehicles**: Raider Buggies and Bulwark Scorpions (t77 GLBs) parked on the El Morro grounds (5) and near the team spawn
  in Overrun on any map (3 extra). Infantry spawn on foot. Walk within 6 m → "F enter Raider Buggy" prompt; **F** boards (the viewmodel, HUD name, stats,
  speed switch to the vehicle; the trooper's squad mates stay put); **F** again steps out on foot beside it and the vehicle stays parked where you left it.
  Works in the TD/sandbox match and in Overrun (Overrun survivor armour/damage/HP multipliers applied to the vehicle). E/Tab still opens the Overrun tactical map.
  Networked: `toggleVehicle` is a host-authoritative G method; parked vehicles ride in the snapshot (`PV`). 2D map draws them with an "F" tag.
- Sim / LOS untouched: the fine fort heights only feed first-person standing height (`standH`); `groundH`, the 349 LOS walls and pathing are unchanged.

## Files
- New: `src/fps/morro3d.ts`, `art_src/tools/morro_fort3d.py`, `public/assets/maps/morro/fort3d.dat`, `tests/e2e_t80.py`, `art_src/refs_el_morro/CREDITS.json`.
- Changed: `src/fps/Possess.ts`, `src/fps/flora.ts`, `src/fps/possess.css`, `src/data/terrain.ts`, `src/data/maps.ts`, `src/data/maps.generated.json`
  (morro deco + parked), `src/game/Game.ts`, `src/entities/Unit.ts`, `src/core/events.ts`, `src/overrun/Overrun.ts`, `src/net/Sync.ts`, `src/render/Renderer.ts`.

## Tests
- `tests/e2e_t80.py` (local and live): all pass — fort mesh / chunks, garitas 7, arcades 6, lighthouse, flora 2291, parked GLBs 5/5,
  heights (plaza below decks, bastion above moat, >4 m vertical faces), F enter/drive/exit for Raider and Scorpion in the sandbox,
  Overrun on El Morro (on foot spawn, parked near spawn, F in/out, Tab → tactical map), no console errors.
- Regression: e2e_t53 pass, e2e_t77 pass, e2e_t78 pass, e2e_t78_mp pass (one run under 5-way parallel load flaked on movement; passes alone,
  and the old build flakes the same way). Known/pre-existing: e2e_t42 "tropical: 4 prop clusters" still fails (unchanged).

## Limitations
- No enterable interiors: vaulted rooms, chapel, ramps tunnels are not modelled; plaza arcades are facades.
- Lidar-derived walls can look softened/rounded in places; embrasure spacing is approximate, not surveyed per gun port.
- Parked vehicles don't block movement; anyone can walk through them.
- Swiftshader (headless) frame rate is low on high quality; real GPUs are fine but medium quality halves the fort mesh.
- The cyan range ring can clip through raised terrain (pre-existing).
- No photos from Sebastian arrived before shipping; the shared Google link was a paid Cults3D listing (preview used as a massing check only).

## Screenshots
`screenshots/t80/local_*.png` and `screenshots/t80/live_*.png` (not committed; screenshots/ is gitignored).

## Deploy
- main: `4045ebe` (code) · gh-pages: `a2a8cad` (built with BASE=/bloons-of-the-frontier/, .nojekyll kept)
- Live: https://beeforestry.github.io/bloons-of-the-frontier/ — 200 for /, index.html, .nojekyll, assets/Possess-DvKoDpkW.js, assets/maps/morro/fort3d.dat.
- `tests/e2e_t80.py --url <live> --tag live`: all pass (14 live screenshots).
