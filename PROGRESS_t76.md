# t76 — first-person enemies rebuilt, loyal to the 2D sprites

Ask: "Make the 1rst person enemies look way better more realistic and loyal to their 2d version."

## What changed
- 20 new Blender GLBs, one per enemy, each modelled against its v3 sprite (`public/assets/glb/`):
  bloon_red/blue/green/yellow/pink/lead/ceramic, bloon_moab (Sky Colossus);
  bug_scavenger/hunter/charger/brood/ironback/warden/gargoyle/titan (Bile Titan);
  boss_scarab/zeppelin/dreadnought/leviathan. Total ≈3.0 MB, 1.6k–9k tris each.
- Source: `art_src/glb_t76/scripts/` (`lib.py`, `build_enemies.py`, `render_sheet.py`, `sheet.py`) + `.blend` per model in `art_src/glb_t76/blend/`.
  Rebuild: `blender -b -P art_src/glb_t76/scripts/build_enemies.py -- all` (or a comma list).
- `src/fps/glbModels.ts`: `loadGlbParts()` keeps every primitive + material (t71 loader kept only the largest mesh → lost textures).
- `src/fps/enemies3d.ts`: `ENEMY_GLB` id→GLB map, `CENTRED_GLB`.
- `src/fps/Possess.ts`: common bloons & bugs drawn as per-type instanced multi-material sets (one InstancedMesh per GLB primitive, shared matrices, cap 200/300);
  Sky Colossus, Gargoyle, Bile Titan and all bosses are GLB clones (walkers on the ground, blimps/flyer centred & lifted). Procedural fallbacks stay until GLBs load.
  `vm.enemyGlb` (id→GLB drawn this frame) exposed for tests. Gameplay, maps, towers, 2D sprites and ADS untouched.

## Proof
- `tests/e2e_t76.py` (local + `--url` live): all 20 GLBs load in Possess; red/blue/green/yellow/pink/lead/ceramic, moab, scavenger, hunter, charger, brood, ironback, warden, gargoyle, bile_titan and all 4 bosses each render their own GLB.
- Screenshots (gitignored) `screenshots/t76/`: 01 bloons 2D vs 3D, 02 bugs 2D vs 3D, 03 FP mixed bloons, 04 FP bugs, 05 FP Sky Colossus + Scarab + Titan, 06 FP Zeppelin + Dreadnought + Gargoyle, 07 FP Leviathan, 08 bosses 2D vs 3D.
