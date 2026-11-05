# t57 — water towers, movable vehicles, photoreal match, copyright rename

User approved all (widget t59s294): water towers, movable heli/tank, matching 3D, copyright rename.

## Part A — Water / air / amphibious + naval towers
- `placeOn`: `land` | `water` | `amphibious` | `air` (airborne defaults to air).
- `Game.isWaterAt` / `nearWater` / `surfaceOk` / `spotOk` enforce surfaces; free placement otherwise unchanged.
- **Tidebreaker Destroyer** (`unsc_destroyer`): water only; deck guns + splash; tiers Patrol Corvette → Coast Destroyer → Tidebreaker Flagship.
- **Harbor Beacon** (`unsc_beacon`): water or shoreline; hitscan laser with `lockRamp` / `lockRampMax` (damage ramps while locked).
- Procedural 2D naval sprites (`Renderer.naval`) + HUD icons; ART stubs in validator.

## Part B — Movable Skyranger + Bulwark Tank
- Both `movable` + `moveSpeed`; select + click map → `moveTower` / `orderMove`.
- Heli `placeOn: 'air'` (land or water); last tier **Hunter Patrol** (`autoChase`) chases enemies when idle.
- Tank land only; last tier **Siege Gunner** adds independent `combat.secondary` roof MG (own cooldown/target).
- Sync: `moveTower` in G_METHODS + OPTIMISTIC + ownTower; free x,y already in snapshots/saves.

## Part C — Matching 3D (touched units)
- `military.destroyer(t)` / `beacon(t)` procedural GL-style groups; Possess wires tank/heli/destroyer/beacon.
- Tank last-tier roof gunner cupola+MG (T1 skirts only); heli comment de-Hellfire.
- 2D naval art is the look reference; CC0/PD metal palette; CREDITS_military.md updated.
- Gap: richer photo-textured hulls / real lighthouse GLB not shipped (procedural match to 2D); denser Tropical FP props still optional leftover.

## Part D — Copyright rename (display; ids kept for saves)
| Old (user-facing) | New |
|---|---|
| Bloons of the Frontier (title) | Balloons of the Frontier |
| UNSC (faction name) | Vanguard |
| Dart / Ninja / Wizard / Super / Sniper Monkey | Dart / Shadow / Arcane / Apex Laser / Marksman Scout |
| Banana Republic / Central | Orchard Republic / Central |
| Bloon Dissolver | Balloon Dissolver |
| M.O.A.B. | Sky Colossus |
| Wall-Nut / Hypno-Shroom / Chomper | Oakshield / Charmcap / Snapjaw |
| Twin Sunflower | Twin Solara |
| Cherry Bomb pod | Burst Berry Blast Pod |
| M808 Battle Tank / AH-9 / Hellfire Gunship | Bulwark Battle Tank / Skyranger / Hunter Patrol |
| Warthog | Raider Buggy |
| Spartan-II / Mjolnir / ODST | Aegis Operative / (armor blurb) / Orbital Drop Troopers |
| MAC (power name) | Orbital Barrage |
| New: Destroyer / Lighthouse | Tidebreaker Destroyer / Harbor Beacon |

Repo URL / gh-pages path `/bloons-of-the-frontier/` unchanged. Faction enum `Faction.UNSC` kept.

## Tests / deploy
- `npm run validate` + `tsc` + vite build clean.
- `tests/e2e_t57.py` — water place, destroyer, beacon ramp, heli water move + chase, tank move + MG, rename table, Sky Colossus.
- Screenshots: `screenshots/t57/`.
