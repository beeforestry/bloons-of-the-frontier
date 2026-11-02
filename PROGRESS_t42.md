# t42 — military assets, UNSC Tank + Gunship, props, first-person guns

- King Kong hero: none existed in the codebase — nothing to remove.
- New towers (UNSC tab): **M808 Battle Tank** (Light → Main Battle → Siege) and **AH-9 Gunship** (Scout → Attack → Hellfire). 3×3 pads (`footprint: 3`), every tier strictly better + visibly upgraded (validator passes); balance in the T1–T3 DPS/100¢ band.
- Real scale: 2D sheets at 27.5 px/m (troopers 44 px) → tank ≈ 9.6 m long, gunship ≈ 15.5 m rotor; same models at true metres in first person. Scorpion troop now drawn with the tank model at real size.
- Props: 5 cluster kinds (sandbag nest, supply crates, fuel barrels, tent, barricade) placed on every map from `PROP_PLAN`; they block placement and give 25% damage cover to troops within reach. 2D sprites + 3D models.
- First person: Kenney GLB gun per troop type in gloved hands (rendered on its own pass so walls never clip it), recoil kick/climb/roll + walk bob; tank cannon/mantlet view, gunship cockpit + chin gun; mounted MG on Autoturret/Flak.
- FPS look after the reference: gradient sky dome + additive sun glow, horizon fog, two rings of hazy distant hills, warm hemisphere + golden sun, soft shadows (desktop only).
- Test: `tests/e2e_t42.py` (all pass, no console errors). Screenshots in `screenshots/t42/`.
- Credits: `CREDITS_military.md`.
