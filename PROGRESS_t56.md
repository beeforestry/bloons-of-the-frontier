# t56 — maps only, free placement, realistic Tropical

## A. Only El Morro + Tropical in menus (main ae4bb6a)
`PLAYABLE_IDS=['morro','tropical']` drives the menu, lobby, saves and preload. The default and tutorial map is now Tropical. Hidden maps still load if you open them with `?map=`.

## B. Free placement, BTD6 style (main 4b527a5)
- Every tower except farms goes at the exact cursor point if it passes four checks: on land, clear of the lane, no overlap with another tower's circle, and clear of buildings and envs. Farms still snap to the grid.
- The ghost shows red or green.
- Save v2 stores x and y (v1 saves still load). Sync sends x and y.

## C. Tropical rebuilt from real data (Isla de Cabras, Toa Baja)
- Built from the NOAA NGS 20170924b-rgb orthophoto (CC0) and the USGS 3DEP 1 m PR_PRVI_E_2018 lidar (PD). No Google imagery.
- Map is 4416×2976 at 0.125 m/px, with 3 lanes (west beach, north beach, lagoon), an HQ, 6 pads, 47 warzone props and 18 LOS walls.
- Tools: art_src/tools/tropical_real.py and map_x2.py.
- balance_bot.js now uses free placement, spreads towers across lanes and avoids clustering. Results in balance/sim_t56_tropical.md:

| Map | Easy | Medium | Hard |
|---|---|---|---|
| Tropical | WIN | WIN | Lost at wave 62 |
| El Morro | WIN | WIN | Lost at wave 62 |

Both maps perform the same.
- Fix: when loading a save, a tower restores at its cell if its exact spot no longer validates. e2e_t55 caught this.

## Tests
These pass: e2e_t56, e2e_t56c, e2e_t55, e2e_t50, e2e_t40.
e2e_t40 was updated for the new Tropical: it now expects 3 lanes and at least 15 3D props, down from 1 lane and 30.

## Screenshots
screenshots/t56/ (gitignored): tropical_2d_{before,after}, tropical_2d_midwave_*, tropical_fp_*, plus the Part B placement shots.

## Known gaps
- The older e2e failures in mp2, systems and collector are not from t56.
- El Morro has limited room beside its lanes: 77 of 340 sampled spots are free.
- The Tropical map image is about 0.95 MB.
- The Tropical first-person view has 19 3D props, fewer than the old stylized map had.
