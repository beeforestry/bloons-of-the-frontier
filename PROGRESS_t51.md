# t51 — textured first person (plants, guns, lighting)

## What changed
- **Plants** (`src/fps/flora.ts`): palms, oaks/trees, jungle trees, pines, dead trees, bushes, ferns and new grass
  clumps are textured CC0 Grab3D models (base colour + normal maps, 512 px WebP). Each model has LOD0 (~5k tris)
  and LOD1 (~0.9–2k tris), drawn as two InstancedMeshes per model and re-sorted every 0.12 s. Trees switch to LOD1
  past 20–22 m, bushes past ~10 m, and grass past 7 m (grass is hidden past 34 m). Plants well behind the camera
  are skipped. Burnt palms and trees use a charred shader variant of the same texture, so the Tropical warzone still
  reads as burnt. Rocks, stumps and logs stay on Kenney models. The 2D map and LineOfSight are untouched: plants are
  first-person visuals only.
- **Guns** (`src/fps/military.ts`):
  - The rifle, sniper (with scope), shotgun and SMG use Poly Haven's PBR bolt-action rifle; the pistol uses Poly
    Haven's service pistol.
  - The rocket launcher stays on the Kenney model, now with a metal finish.
  - Gloves use real leather (diffuse + normal) and sleeves use woven fabric.
  - `userData.gunKind` and `userData.textured` are set on the gun object.
- **Tank cockpit**: the rifle viewmodel is removed.
- **Stray box**: the dark box next to the Tropical tank wreck was the placeholder for garrisonable env structures.
  Bunkers, watchtowers, ruins and garitas are now real 3D shapes (`envStructure` in warzone.ts).
- **Lighting** (Possess.ts):
  - ACES tone mapping (exposure 1.15).
  - Kiara late-afternoon HDRI as the PMREM environment (256×128, 131 KB).
  - The sun shadow uses a 2k map over a ±22 m box placed ahead of the view and snapped to texels.
  - Light bloom (UnrealBloomPass at half resolution, strength 0.22, threshold 0.92) through an EffectComposer with
    the world and viewmodel passes. Bloom turns off with '⚡ Reduce flashing'.
- **Quality tiers** (`vm.quality`):

  | Tier | Who gets it | What it includes |
  |---|---|---|
  | high | desktop | env, shadows, bloom, normal maps |
  | medium | touch | env, plain PBR plants, no bloom or shadows |
  | low | `?fpq=low` | Lambert plants, no env, no shadows, no bloom |

  - Slow frames step down automatically: high → medium (bloom off) → low.
  - An explicit `?fpq=` pins the tier.
  - On context restore the composer is resized; the composer is disposed when you leave Possess.
- The fps meter now uses real frame time. Before, it clamped to 0.1 s and over-reported slow devices.

## Size / load
| Item | Before (raw / gzip) | After (raw / gzip) | Change (raw / gzip) | When it loads |
|---|---|---|---|---|
| Possess chunk | 720.1 KB / 194.7 KB | 753.8 KB / 204.8 KB | +33.7 KB / +10.1 KB | only when you possess |
| Plant GLBs (8 files) | — | 1.31 MB | — | lazily per kind; Garden pulls ~1.1 MB, Tropical ~0.5 MB |
| Guns | — | rifle 504 KB, pistol 221 KB | — | one per possession |
| Gloves/fabric textures + HDRI | — | ~16 KB + 131 KB | — | — |

## Tests
- tests/e2e_t51.py: PASS (textured plants + LOD, textured gun + gloves, ACES + env, wrecks, no stray boxes,
  tank without rifle, `fpq=low` has no composer or env, no console errors).
- e2e_t42, e2e_t50, e2e_t44: PASS. tsc and validate: clean.
- Screenshots (before/after): screenshots/t51/{before,after}_{tropical_fp,gun_closeup,tropical_palm_closeup,garden_fp,garden_bush_closeup,tank_cockpit}.png

## Gaps
- Plants are stylised (textured, not photoreal), and there are no billboard impostors (LOD1 meshes instead).
- No KTX2; textures are WebP.
- The rifle is a bolt-action (no CC0 textured modern rifle found).
- The rocket launcher, rocks, stumps and logs stay on Kenney models.
- In the software renderer (swiftshader) first person is much slower than before. With all detail it runs about
  1–2.5 fps vs about 7 before (the low tier is about 3 fps). This is fill/texture-bound on CPU rendering; real GPUs
  are fine, and the auto-downgrade covers weak devices.
