# t73 — Marksman Scout refined to completion (3D)

Scope: `tower_sniper.glb` (world hero) + `gun_sniper.glb` (FP viewmodel) only. Target: `public/assets/v3/sniper_monkey_2.webp`.

## Built (art_src/glb_t73/scripts/build_marksman.py, Blender 4.3, t72 pipeline helpers; .blend sources alongside)
- Crouched firing pose (support knee up/forward, rear knee low), rifle shouldered on the right, aiming +X.
- Capuchin head (dark cap fur, pale face, brow, muzzle, ears, tufts, aiming squint).
- Dark quilted padded tactical suit, dark plate chest/collar/back collar, big right pauldron (2 lames) with bronze 8-ray sun emblem,
  small left pauldron, chest-rig pouches, belt + bronze buckle, hip pouches, back pack, bronze-trimmed bracers/greaves,
  knee cops, armoured boots with bronze straps, curled tail.
- Rifle: stock, receiver, mag, grip + guard, railed handguard, barrel + brake, red glowing muzzle ring, scope with bronze rings,
  turrets and red glowing objective lens, short emissive laser beam.
- gun_sniper: same rifle (no laser) + gloved hands and padded sleeves with bronze cuffs; authored muzzle -X so it points downrange in Possess.
- Textures procedural (make_tex.py), palette sampled from the sprite. No AI mesh, no third-party assets.
- tests/e2e_t73.py: Possess sniper → vm.kind `glb_gun_sniper`; neighbour possess sees `towers3d.glb_tower_sniper`. PASS locally and against live.

## Numbers
tower_sniper.glb 671,684 B (~20k tris); gun_sniper.glb 152,500 B (~3.6k tris).

## Deploy
- main: `05e7336b04ee7ae0e3683621b9d1c27a7a2398f7`
- gh-pages: `b8519468bfb35c54257df2a0d34b3e0497b0fbb1` (also first live deploy of t72 Dart Scout; the t72 gh-pages run e23b354 timed out on GitHub's side and was built with a wrong base path, superseded here)
