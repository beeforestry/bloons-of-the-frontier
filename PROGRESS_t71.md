# t71 — Blender GLB meshes for Possess (from painted v3)

Live: https://beeforestry.github.io/bloons-of-the-frontier/

## Mandate
Start with Blender for real FP meshes; keep Vite + TS + Canvas 2D + Three.js Possess. AI mesh generators only for rough bases (none used this pass — meshes built in Blender from scratch).

## New GLBs (`public/assets/glb/`)
| File | What | How made |
|------|------|----------|
| `bloon_{red,blue,green,yellow,pink,lead,ceramic}.glb` | Unique teardrop + knot (+ lead straps / ceramic bands) | Blender from scratch; sphere UV; base color from v3 sprite average + sprite mix |
| `bug_scavenger.glb` | Segmented scavenger with 6 legs + mandibles | Blender from scratch; scavenger sprite albedo |
| `tower_{dart,ninja,wizard,sniper,apex,glue}.glb` | Low-poly primate heroes matching max-tier v3 look | Blender from scratch; multi-material palette matched to sprite colors |
| `gun_{dart,sniper,laser,glue,shuriken,staff}.glb` | Viewmodel guns per shooter role | Blender from scratch; solid materials |

Total pack ~1.5–2 MB.

## Wiring
- `src/fps/glbModels.ts` — GLTFLoader cache, `TOWER_GLB` / `GUN_GLB` maps
- `enemies3d.ts` — `loadBloonGeometry` / `loadScavengerGeometry`
- `Possess.ts` — async geo swap for bloon/bug InstancedMeshes; tower heroes load GLB clones; tower viewmodels use Blender guns (replaces orange box for key towers)
- Tank/heli GLBs from t65 **reused** (not replaced); gunner/rotor attach unchanged

## Reused
- `towers3d.ts` procedural for towers without a hero GLB
- Military tank/heli/destroyer/beacon GLBs (t65)
- Kenney troop guns for units

## Honest quality
- Bloons: unique geometry (not spheres-only); lead/ceramic read metal/clay via metalness + bands. Sprite projection is mixed with flat color — not a 1:1 painted rubber sculpt.
- Towers: readable low-poly primates with correct palette/silhouette/gear; not pixel-perfect extrusions of the 2D art.
- Scavenger: unique vs shared beetle; still stylized low-poly.
- No AI base meshes this pass.

## Screenshots
`/workspace/bloons-frontier/screenshots/t71/`
- `00_2d_vs_glb_comparison.png`
- `preview_*.png` Blender stills
- FP shots from e2e (01+)

## Deploy SHAs
- main: (pending)
- gh-pages: (pending)
