# t99 — Isla de Cabras realism pass (El Morro methods applied to the `tropical` map)

- main: `0de5eeb` (code, data, e2e_t99, CREDITS t99 section); this file follows in the next commit.
- gh-pages: `bf87f0a` (deploy of 0de5eeb, built with `BASE=/bloons-of-the-frontier/`, `.nojekyll` kept). Live: https://beeforestry.github.io/bloons-of-the-frontier/
- Live bundle: `assets/index-DyxVv0Wo.js` (was the t97 bundle), Possess chunk `assets/Possess-C5TqN97F.js`. HTTP 200: `/`, `/index.html`, `/.nojekyll`,
  both bundles, `assets/maps/tropical/cabras3d.dat`, `assets/maps/tropical.jpg`, `assets/maps/tropical/ground.jpg`.

## Built
### 2D (sim)
- Real NOAA NGS 2017-09-24 aerial (CC0) + USGS 3DEP 1 m lidar (PD), frame moved 230 m south of t56 so El Cañuelo is on the map (0.125 m/px, 4416×2976).
- 3 lanes: causeway past El Cañuelo, park road from the north, bay landing; HQ on the central park lawn. El Cañuelo footprint + old pier are no-build.
- El Cañuelo walls are 32 LOS blockers (6 m). Warzone styling/props removed (realistic park), like El Morro.
- 5 parked Raider Buggies / Bulwark Scorpions on clear land (also in Overrun).
### First person
- 0.5 m fine height grid (`cabras3d.dat`, 209 kB) with El Cañuelo carved from the HABS PR-52 drawings: 24.4 m square, gun deck 5.6 m, parapet 6.7 m,
  12 flared embrasures, battered foot, field-stone apron, east entrance passage + 20-step stair to the deck (max 0.21 m step), garita walk.
- Set pieces: NE-corner garita (t93 builder), terracotta cordon, entrance lintel/reveal, cistern, 2 iron guns. Stucco wall shader with faceted normals.
- Floor classes from the aerial (CC0): sand, riprap/breakwater rock, park asphalt, worn stone, brick promenade, deck.
- 3,909 flora/rock placements traced from the aerial: palms, bent palms, bushes, trees, lawn-edge + dune grass, shore riprap.
- Sea floor shelves off the shore; deep-sea quads dropped → 498k tris (from 814k), 98 chunks at high quality.
- El Morro (its t80 lidar fort grid + aerial) stands ~1.4 km across the bay mouth (not on low quality). Fog 260–3200 m.

## Tests
- `npm run build`: pass.
- e2e_t99 local: FAILS none; live (`--url … --tag live`): FAILS none, no console errors.
- e2e_t53, e2e_t80, e2e_t93, e2e_t97, e2e_t56: pass (local).
- Screenshots: `screenshots/t99/local_*.png`, `screenshots/t99/live_*.png` (git-ignored).

## Limitations
- Buildable land is smaller (110 cells vs 324; land 12% of the frame) because the frame now includes El Cañuelo and the bay; balance bot not re-run.
- El Cañuelo is carved from drawings (bare-earth lidar removes the structure); interior rooms/kitchen/latrine are not modelled, the deck is simplified.
- Kenney low-poly rocks read as chunky up close; the fort sits on a 45° diagonal of the 0.5 m grid, so edges show a slight sawtooth.
- Distant El Morro has no Old San Juan city behind it. Parked vehicles don't block movement.
- Swiftshader runs ~1 fps, so walk/drive checks are short (real GPUs are far faster).
