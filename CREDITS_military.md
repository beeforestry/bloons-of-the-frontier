# Military assets (t42) — all CC0 1.0 (public domain)

| Asset | Author | Source | Used for |
|---|---|---|---|
| Weapon Pack (rifle, smg, shotgun, sniper, pistol, rocket launcher) | Kenney (kenney.nl) | https://opengameart.org/content/weapon-pack (weaponPack_assets.zip) | first-person viewmodels, mounted turret MGs |
| Survival Kit (barrels, crates, tent, barricade fence) | Kenney (kenney.nl) | https://opengameart.org/content/survival-kit (kenney_survival-kit.zip) | map props (supply / fuel / tent / barrier clusters) |
| Animated Tank Pack (3 tanks) | Quaternius | https://poly.pizza/bundle/Animated-Tank-Pack-0tfvbeAJkU | M808 Battle Tank tiers + Scorpion troop |
| Helicopter | kazuma (via Poly Pizza) | https://poly.pizza/m/EQJ2MECUbx | AH-9 Gunship |

Sandbag walls are procedural (our own). ITHappy "Military FREE" was requested but its download is account/email-gated, so it was not used.
GLBs converted/optimised to `public/assets/military/`; 2D sheets rendered from them by `art_src/tools/mil_sprites.py`.

## Ground textures (t46) — CC0, Poly Haven (https://polyhaven.com/license)
1K diffuse maps, re-encoded to 1024² WebP in `public/assets/tex/`. They are used as tiled detail on the first-person ground.
| File | Source asset | Author |
|---|---|---|
| grass.webp | Leafy Grass — https://polyhaven.com/a/leafy_grass | Charlotte Baglioni |
| sand.webp | Coast Sand 01 — https://polyhaven.com/a/coast_sand_01 | Rob Tuytel |
| dirt.webp | Dirt — https://polyhaven.com/a/dirt | Charlotte Baglioni |
| cobble.webp | Cobblestone Floor 08 — https://polyhaven.com/a/cobblestone_floor_08 | Rob Tuytel |
| rock.webp | Aerial Rocks 02 — https://polyhaven.com/a/aerial_rocks_02 | Rob Tuytel |
| water_n.webp | Procedural tileable water normal map (our own, generated with numpy) | — |

## t50 — 3D nature props + warzone ground (all CC0)
| asset | source | author |
|---|---|---|
| public/assets/flora/*.glb (palms, oak, pine, trees, bushes, rocks, stumps, log) | Nature Kit 2.1 — https://opengameart.org/content/nature-kit (kenney.nl) | Kenney |
| tex/burned.webp | Burned Ground 01 — https://polyhaven.com/a/burned_ground_01 | Rob Tuytel |
| tex/mud.webp | Brown Mud — https://polyhaven.com/a/brown_mud | Rob Tuytel |
| tex/dryground.webp | Dry Ground 01 — https://polyhaven.com/a/dry_ground_01 | Rob Tuytel |
Burnt/dead plant variants are recoloured + reshaped Nature Kit models; wrecks are the existing military renders/GLBs, charred.

## t51 — textured first person (all CC0 1.0)
| asset | source | author |
|---|---|---|
| flora_tex/palm.glb (all palms, burnt = charred shader tint) | Palm Tree — https://grab3d.com/models/nature/palm-tree/ | Grab3D |
| flora_tex/oak.glb (garden oaks/trees) | Oak Tree — https://grab3d.com/models/nature/oak-tree/ | Grab3D |
| flora_tex/jungle.glb (detailed / jungle trees) | Jungle Tree — https://grab3d.com/models/nature/jungle-tree/ | Grab3D |
| flora_tex/pine.glb | Pine Tree — https://grab3d.com/models/nature/pine-tree/ | Grab3D |
| flora_tex/dead.glb (burnt trees) | Dead Tree — https://grab3d.com/models/nature/dead-tree/ | Grab3D |
| flora_tex/bush.glb (hedges, roses, bushes) | Bush — https://grab3d.com/models/nature/bush/ | Grab3D |
| flora_tex/fern.glb (ferns, monstera, tropical bushes) | Fern — https://grab3d.com/models/nature/fern/ | Grab3D |
| flora_tex/grass.glb (grass clumps) | Grass Clump — https://grab3d.com/models/nature/grass-clump/ | Grab3D |
| military/gun_rifle_ph.glb (rifle/sniper/shotgun/SMG viewmodels) | Bolt Action Rifle 7.62 — https://polyhaven.com/a/bolt_action_rifle_7_62 | Poly Haven |
| military/gun_pistol_ph.glb | Service Pistol — https://polyhaven.com/a/service_pistol | Poly Haven |
| tex/glove.webp, glove_n.webp | Brown Leather — https://polyhaven.com/a/brown_leather | Poly Haven |
| tex/fabric.webp, fabric_n.webp | Denim Fabric 04 — https://polyhaven.com/a/denim_fabric_04 | Poly Haven |
| tex/sky_env.hdr (256x128 environment light) | Kiara 7 Late Afternoon HDRI — https://polyhaven.com/a/kiara_7_late-afternoon | Greg Zaal (Poly Haven) |
Converted by art_src/tools/fp_assets_t51.mjs: LOD0 thinned to ~45 %, LOD1 ~25 % of that, 512 px WebP textures, meshopt.
