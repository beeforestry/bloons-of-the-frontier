# t100 — more room for water towers on Isla de Cabras

Water placement on the tropical map, sampled every 48 px (cell size) with `Game.spotOk`; see `tests/water_measure.py`:

| build | open-water cells | Tidebreaker Destroyer | Harbor Beacon | Heli | land (dart) |
|---|---|---|---|---|---|
| pre-t99 (4a2fc62) | 3498 | 2930 | 3006 | 4122 | 1421 |
| t99 (16724bd) | 4611 | 4076 | 4163 | 4439 | 519 |
| t100 | 4415 | 3722 | 4319 | 4464 | 519 |

- The t99 water mask was already larger than before. But the coarse 3 m height grid read the south breakwater, the west jetty and the old pier as open
  water, so ships could be parked on the rocks. These are now traced as `map.water.shoals`. Ships can't go on them, but they count as
  shoreline for amphibious towers.
- `map.water.shore` (tropical only): the Harbor Beacon can also stand on the beach/riprap band next to the water, away from the fort walls.
  Beacon range now reaches 100% of every lane, and destroyer range reaches 66% / 86% / 93% of the three lanes.
- Placement highlight: when you pick a water or amphibious tower, the valid open water is tinted cyan and the shoreline is tinted yellow.
- Land rules and the fort blockers are unchanged. Land and water never overlap. The bay landing route keeps its margin.
- Balance: t99 had made tropical harder (it lost at wave 18 at full HP). Tropical HP ease is now 0.8 (same as El Morro); see `balance/t100_tropical.md`.

References restored after the t99 deploy-script accident (gitignored, reference only, never shipped): `art_src/refs_el_morro` (39 Commons files per
CREDITS.json, plus `user_share/ElMorroSanJuan07.jpg`, `ElMorroSanJuanSide03.jpg` from boricuaonline.com and `A-sentry-box-at-El-Morro-San-Juan-Puerto-Rico.jpg`
from notaboutthemiles.com) and `art_src/refs_canuelo` (all CREDITS entries). `exterior-stairs-at-el-morro.jpg` (hellolittlehome.com) is not restored: the site
serves a bot challenge page.
