# t77 — first-person Vanguard troops (Possess)

## Scope
The five deployable Vanguard troops (code faction `UNSC`): Frontier Marines (`marine`), Orbital Drop Troopers (`odst`),
Aegis Operative (`spartan`), Raider Buggy (`warthog`), Bulwark Scorpion (`scorpion`). Vanguard towers untouched.
Non-Vanguard troops keep the capsule placeholder.

## What changed
- 15 new Blender GLBs, one per (unit, tier), each modelled against its own v3 sprite (`public/assets/glb/unit_<id>_<tier>.glb`):
  troopers 6.7k–8.1k tris (256–310 KB), Raider 3.4k–4.0k tris (176–209 KB), Scorpion 3.4k–4.3k tris (202–262 KB). ≈3.8 MB total.
  - Marines: olive plate + webbing pouches; t0 amber visor, t1 blue arm band + blue-tint visor + scoped rifle, t2 dark gunmetal heavy plate, red visor, thigh canisters.
  - Drop Troopers: charcoal armour, angular helmet + jaw guard; t0 dark visor + suppressed SMG, t1 blue visor/trim + pack + scoped battle rifle, t2 bronze-charcoal, gold trim, orange visor, bigger pack.
  - Aegis: taller/bulkier olive armour, full helmet with wide visor; t0 amber visor + rifle, t1 blue shoulder emblem + translucent blue energy blade, t2 cyan visor, bronze trim, Aegis Beam cannon with red glowing muzzle.
  - Raider: t0 open-top jeep (roll cage, 7-slot grille, round lamps, pintle MG), t1 grey-olive half-armoured with bull bar + rotary on a pedestal, t2 closed armoured truck with gold trim + cyan rotary.
  - Scorpion: long hull, deep panelled skirts over 7 road wheels, wide faceted turret with stowage canisters + roof sight, long gun with fume extractor; t1 add-on plates + roof MG; t2 darker weathered hull, gold/orange trim, sharper turret, glowing blue barrel.
- 10 viewmodel GLBs from the same parts: `gun_vg_rifle`, `gun_vg_rifle_scope`, `gun_vg_smg`, `gun_vg_br`, `gun_aegis_beam`,
  `gun_raider_mg`, `gun_raider_rotary`, `gun_raider_rotary_cyan`, `gun_scorpion_cannon`, `gun_scorpion_cannon_blue` (14–37 KB each).
- Source: `art_src/glb_t77/scripts/` (`build_units.py`, `lib.py`, `render_sheet.py`, `sheet.py`) + one `.blend` per model in `art_src/glb_t77/blend/`.
  Rebuild: `blender -b -P art_src/glb_t77/scripts/build_units.py -- all` (or a comma list).
- `src/fps/glbModels.ts`: `unitGlb(id, tier)`, `unitVmGlb(id, tier)`, `UNIT_VM` (muzzle metadata).
- `src/fps/Possess.ts`: Vanguard infantry drawn as per-(unit, tier) instanced multi-material sets (cap 300), lazily loaded on first sight;
  Raider / Scorpion are GLB clones that swap in when loaded (old box jeep / Bulwark tank only as placeholders) and re-swap if the tier changes.
  Possessing a Vanguard troop shows its own gun (SMG / battle rifle / rifle / Aegis Beam in gloved hands, Raider MG / rotary, Scorpion roof + main gun).
  `vm.unitGlb` / `vm.unitGlbLoaded` exposed for tests. Gameplay, stats, maps, towers, 2D sprites, ADS unchanged.

## Proof
- `tests/e2e_t77.py` (local + `--url` live): PASS. All 15 unit GLBs load; at tiers 0/1/2 marine/odst/spartan each draw their own
  tier GLB (never shared), Raider/Scorpion draw their own tier GLB (not the box jeep / tank), tier 0 ≠ tier 2, own viewmodels
  (`gun_vg_smg`, `gun_raider_rotary_cyan`, `gun_scorpion_cannon_blue`, `gun_aegis_beam`), GLBs + Possess chunk HTTP 200.
- Regression: `e2e_t76` PASS; `e2e_t42` only fails "tropical: 4 prop clusters" which fails identically on the live t76 build (pre-existing).
- Screenshots (gitignored) `screenshots/t77/`: 01 troops 2D vs 3D, 02 vehicles 2D vs 3D, 03 FP infantry t0/t1/t2, 04 FP vehicles t0/t1/t2,
  05 FP mixed t2, 06 FP from Raider / Scorpion / Aegis; `*_live.png` copies from the live site.

## Notes
- The 2D map draws the Scorpion from the Battle Tank sheets (`mil:tank_*`) when loaded; the 3D models follow `scorpion_*.webp` as briefed.

## SHAs
- main: cc8439d (code, GLBs, sources, test)
- gh-pages: b580816 (deploy of cc8439d, BASE=/bloons-of-the-frontier/, .nojekyll kept)
- Live e2e_t77 against https://beeforestry.github.io/bloons-of-the-frontier/: PASS; all 25 new GLBs + Possess-C4bPJkCU.js HTTP 200
