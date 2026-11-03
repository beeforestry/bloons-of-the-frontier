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
