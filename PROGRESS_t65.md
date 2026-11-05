# t65 — FP attachment fixes + photoreal tank/lighthouse

User (t65u / t66u): Siege Gunner floating off the Bulwark roof; Skyranger blades detached; Harbor Beacon an all-black featureless pylon. Follow-up: use free PD/CC0 photos for photoreal tank + lighthouse.

## Fixes
1. **Tank gunner** — roof Y from largest turret-body mesh (not gun barrel tip, not antenna); cupola + base ring parented to `userData.turret` and sunk into the roof (`roofY - 0.08`).
2. **Heli rotors** — capture cabin-roof hub before strip; `stripAbove` drops any triangle with a vertex above the cut (meshopt Int16 interleaved-safe); main rotor + short mast at hub; tail on boom tip.
3. **Beacon black pylon** — `lam()` sets `vertexColors: false` (procedural meshes had no color attr → black multiply); rebuild striped cream/red tower + gallery + closed glass lantern.
4. **Photoreal (t66)** — Bulwark uses vendored Poly Haven metal_plate + ambientCG Metal035 olive/tan bake, asphalt tracks, corrugated iron barrel; Harbor Beacon uses plastered-wall cream, roof-07 red, brick, rock (CC0); Skyranger gets the same olive plate bake.

## Deploy
- Live: https://beeforestry.github.io/bloons-of-the-frontier/
- Screenshots: `screenshots/t65/` (gitignored): `01_fp_dart_tank_heli.png`, `01b_fp_dart_tank_heli_mid.png`, `02_fp_beacon.png`, `02b_fp_beacon_close.png`, `03_fp_tank_cockpit.png`, `04_fp_heli_cockpit.png`

## Honest gaps
- Quaternius tank UVs are game-low-poly; photo tiling reads as painted steel up close but is not a scanned MBT. Under SwiftShader / flat dusk lighting the olive still goes quite dark at distance.
- Lighthouse is procedural geometry (not photogrammetry); close-up cream/red bands + gallery + lantern read correctly. Distant views can still silhouette.
- Heli blades spin fast in-game; frozen-frame shots needed to see the hub clearly. Geometry is parented correctly (probe: rotorY ≈ 3.4 on fuselage ~3.07).
