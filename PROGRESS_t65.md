# t65 — FP attachment fixes + photoreal tank/lighthouse

User (t65u / t66u): Siege Gunner floating off the Bulwark roof; Skyranger blades detached; Harbor Beacon an all-black featureless pylon. Follow-up: use free PD/CC0 photos for photoreal tank + lighthouse.

## Fixes
1. **Tank gunner** — roof Y from largest turret-body mesh (not gun barrel tip, not antenna); cupola + base ring parented to `userData.turret` and sunk into the roof (`roofY - 0.08`). Probe: `gunnerParent=true`, local Y ≈ 3.13.
2. **Heli rotors** — capture cabin-roof hub before strip; `stripAbove` drops any triangle with a vertex above the cut (meshopt Int16 interleaved-safe); main rotor + short mast at hub; tail on boom tip. Probe: `rotorParent=true`, rotorY ≈ 3.40.
3. **Beacon black pylon** — `lam()` sets `vertexColors: false`; rebuild striped cream/red tower + gallery + closed glass lantern.
4. **Photoreal (t66)** — Bulwark uses vendored Poly Haven metal_plate + ambientCG Metal035 olive/tan bake, asphalt tracks, corrugated iron barrel; Harbor Beacon uses plastered-wall cream, roof-07 red, brick, rock (CC0). Soft emissive fill + brightened olive/tan so dusk/SwiftShader don't crush to silhouette.

## Deploy
- Live: https://beeforestry.github.io/bloons-of-the-frontier/
- Screenshots (gitignored): `/workspace/bloons-frontier/screenshots/t65/`
  - `01_fp_dart_tank_heli.png` — side of max-tier Bulwark (+ lighthouse base in frame)
  - `01b_fp_dart_tank_heli_mid.png` — tank with roof gunner + heli with mounted blades
  - `02_fp_beacon.png` / `02b_fp_beacon_close.png` — cream/red Harbor Beacon lantern
  - `03_fp_tank_cockpit.png` / `04_fp_heli_cockpit.png`

## Honest gaps
- Quaternius tank/heli UVs are game-low-poly; photo tiling reads as painted steel up close but is not a scanned MBT. Under SwiftShader / flat dusk lighting detail still softens at distance.
- Lighthouse is procedural geometry (not photogrammetry); cream/red bands + gallery + lantern read correctly.
- Heli blades spin fast in-game; frozen-frame shots needed to see the hub clearly. Geometry is parented correctly.
- Gunner is a small procedural cupola (not a full seated monkey mesh); visible on roof in mid exterior shot but easy to miss in pure side silhouette.

## SHAs
- **main** (see tip) — t65 attach + photoreal + brightness pass
- **gh-pages** — Deploy matching main (kept `.nojekyll`; no force push)
