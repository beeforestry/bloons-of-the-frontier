# t72 — Dart Scout refined to completion (3D)

User ask (t71u): the first Blender GLBs barely look like they are supposed to; refine at least one to completion.
Scope: Dart Scout only — `public/assets/glb/tower_dart.glb` (world hero) + `gun_dart.glb` (FP viewmodel). Nothing else changed.

## What was built
- Target: `public/assets/v3/dart_monkey_2.webp` (max-tier: steel plate with gold trim, glowing sun chest emblem, layered pauldrons,
  wrist-mounted dart-launcher gauntlets, leather belt + gold buckle, faulds, knee cops, greaves, bare furred feet, dark cap fur,
  pale capuchin face, curled tail).
- `art_src/glb_t72/scripts/build_dart_scout.py` (Blender 4.3, headless): skin-modifier + subdivision body/limbs/curled tail;
  head assembled from skull/cap-fur/face-mask/brow/muzzle/nose/eyes(+catchlights)/ears/hair tufts; plate armour from
  solidified partial-sphere shells with gold-banded edges, cuirass, gorget, 3-lame pauldrons, vambraces, rerebraces, knee cops,
  greaves; 12-ray gold sun emblem with emissive core; 3-tube gold-banded dart launchers with darts on both wrists; gauntlet fists.
  Dense prop parts collapse-decimated; smart-UV; exported GLB with JPEG textures.
- `gun_dart.glb`: armoured forearm + gauntlet fist + the sprite's 3-tube wrist dart launcher (gold bands, darts with steel tips + fletching), sun stud.
- `art_src/glb_t72/scripts/make_tex.py`: procedural fur / skin / plate / gold / leather / wood albedo, palette sampled from the sprite.
- No AI mesh, no third-party assets.
- `tests/e2e_t72.py`: Possess Dart Scout → `vm.kind == 'glb_gun_dart'`; neighbouring possess sees `towers3d.glb_tower_dart` + sane size.

## Numbers
- tower_dart.glb ≈ 852 KB, ~27k tris; gun_dart.glb ≈ 154 KB, ~3.6k tris.

## Screenshots (screenshots/t72/, gitignored)
01_sprite_vs_refined_glb.png, 02_fp_dart_viewmodel.png, 03_fp_world_dart_hero.png, 04_t71_vs_t72_angles.png

## Deploy SHAs
- main: `517fea7e16c7c96793962aa7a548cd63cac882fa`
- gh-pages: `e23b354f2d9e0aa49ebbe53c68774522ce2082b3`
