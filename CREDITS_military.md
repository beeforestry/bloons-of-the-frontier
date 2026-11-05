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

## t53 — El Morro map rebuilt from real public-domain data
- **Aerial imagery (2D map background + first-person ground texture):** NOAA National Geodetic Survey (NGS) Emergency Response Imagery, Hurricane Maria, flight of 2017-09-24, layer `20170924b-rgb`, ~25 cm GSD. XYZ tiles `https://stormscdn.ngs.noaa.gov/20170924b-rgb/{z}/{x}/{y}` (zoom 19). NOAA InPort catalog item 52283; bulk GeoTIFFs: https://coastalimagery.blob.core.windows.net/digitalcoast/HurricaneMaria_2017_8507/index.html . License: U.S. Government work, not subject to copyright — public domain / **CC0-1.0**. Resampled, rotated (map +x = 142.8° CCW from east), cropped and colour-graded by `art_src/tools/morro_real.py`. Not Google imagery.
- **Elevation (first-person terrain + sniper line of sight):** U.S. Geological Survey 3D Elevation Program (3DEP) 1 m lidar DEM, project **PR_PRVI_E_2018**, tile `USGS_1m_x80y205_PR_PRVI_E_2018.tif` (EPSG:26919), https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/PR_PRVI_E_2018/TIFF/USGS_1m_x80y205_PR_PRVI_E_2018.tif (via The National Map). License: USGS data, **public domain** (credit: "U.S. Geological Survey"). Resampled to a 185 x 125 lattice (3 m), 0.2 m steps.
- Detail textures blended on the terrain are the existing CC0 ground textures (see groundTex.ts / earlier sections).

## Tropical Island map — Isla de Cabras, Toa Baja PR (t56)
| Asset | Source | License |
|---|---|---|
| maps/tropical.jpg, ground photo (z19/z20 orthomosaic) | NOAA NGS Emergency Response Imagery, Hurricane Maria, layer 20170924b-rgb (2017-09-24) — https://storms.ngs.noaa.gov/ | CC0 / US public domain |
| Terrain heights, LOS walls, deco mask | USGS 3DEP 1 m DEM, project PR_PRVI_E_2018, tile USGS_1m_x80y205_PR_PRVI_E_2018.tif | US public domain |

No Google Earth / Google Maps imagery is used.


## t57 — naval towers + rename pass
| Asset | Source | License |
|---|---|---|
| Tidebreaker Destroyer (procedural 2D + 3D) | Original geometry, metal palette matching Poly Haven / Kenney military look | Original (CC0 as project art) |
| Harbor Beacon (procedural 2D + 3D) | Original lighthouse; lantern uses MeshBasicMaterial glow | Original (CC0 as project art) |
| Bulwark Tank roof gunner (last tier) | Procedural add-on on Quaternius Animated Tank Pack | Quaternius CC0 + original |
Display names were renamed away from third-party game marks (Bloons / Halo UNSC / PvZ-likes). Internal ids kept for saves. No Google imagery; no ripped commercial game art.

## t64 — first-person PBR texture pack + painted vehicle/naval 2D (all CC0 / original)

Shared FP materials live in `src/fps/mats.ts` and tile maps under `public/assets/tex/`. Diffuse + normals are Poly Haven CC0 1K maps, re-encoded to WebP; fur/leaf/skin are original procedural tiles generated for this pass.

| File | Source asset | Author / license |
|---|---|---|
| tex/metal.webp, metal_n.webp | Metal Plate 021 — https://polyhaven.com/a/metal_plate021 | Poly Haven CC0 |
| tex/rust.webp, rust_n.webp | Rusty Metal 02 — https://polyhaven.com/a/rusty_metal_02 | Poly Haven CC0 |
| tex/iron.webp, iron_n.webp | Metal 006 / iron variant — https://polyhaven.com/a/metal_006 | Poly Haven CC0 |
| tex/wood.webp, wood_n.webp | Wood Floor Cork — https://polyhaven.com/a/wood_floor_cork | Poly Haven CC0 |
| tex/bark.webp, bark_n.webp | Bark Brown 01 — https://polyhaven.com/a/bark_brown_01 | Poly Haven CC0 |
| tex/concrete.webp, concrete_n.webp | Concrete Floor 02 — https://polyhaven.com/a/concrete_floor_02 | Poly Haven CC0 |
| tex/plaster.webp, plaster_n.webp | Plaster 02 — https://polyhaven.com/a/plaster_02 | Poly Haven CC0 |
| tex/cloth.webp, cloth_n.webp | Fabric Pattern 05 / denim family — https://polyhaven.com/a/fabric_pattern_05 | Poly Haven CC0 |
| tex/leather.webp, leather_n.webp | Brown Leather — https://polyhaven.com/a/brown_leather | Poly Haven CC0 |
| tex/fur.webp, fur_n.webp | Original procedural fur tile (numpy) | Original CC0 |
| tex/leaf.webp, leaf_n.webp | Original procedural leaf tile (numpy) | Original CC0 |
| tex/skin.webp | Original procedural skin tile (numpy) | Original CC0 |

Painted 2D (exception redo, matching v3 monkey quality): `public/assets/v3/unsc_{tank,heli,destroyer,beacon}_{0,1,2}.webp` — original AI-assisted digital paintings keyed to transparency; not traced from any commercial game. Sources under `art_src/military/paint_t64/`.

No Google imagery. No ripped commercial game art. Monkey / plant / troop 2D sprites were left as existing v3 paintings (FP-only upgrade for those).
