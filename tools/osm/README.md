# tools/osm — OpenStreetMap layouts for El Morro and Isla de Cabras (t123)

These scripts use real open GIS data as the **layout source** for the two playable photoreal maps. They keep the
existing engine (Canvas 2D + three.js first person) and the existing NOAA aerial art and USGS lidar terrain. KnoxMap
and Project Zomboid data are not used.

## Sources and licenses
| Data | Used for | Source | License |
|---|---|---|---|
| OSM buildings (+ `height`, `building:levels`), highways (+ `width`, `lanes`), coastline, breakwaters, water, parks, walls | lanes, placement grid, first-person volumes, Old San Juan backdrop, terrain guidance | © OpenStreetMap contributors via Overpass API (overpass-api.de, fallbacks: kumi.systems, private.coffee) | ODbL 1.0 — credit "© OpenStreetMap contributors" |
| NOAA NGS Emergency Response Imagery, Hurricane Maria, `20170924b-rgb`, z20 | healing the old painted lane strip, repainting the new one | https://stormscdn.ngs.noaa.gov/20170924b-rgb/{z}/{x}/{y} | US public domain |
| USGS 3DEP 1 m lidar DEM, PR_PRVI_E_2018 | ground height under buildings and along lanes (already baked into the maps) | The National Map | US public domain |

The in-game minimap shows "© OpenStreetMap contributors" on both maps. Full credits: CREDITS_military.md.

## Map frames and bounding boxes
Both maps are rotated rectangles in UTM 19N (EPSG:26919), 4416 x 2976 game px at 0.125 m/px (552 x 372 m), the same
frames as art_src/tools/morro_real.py / tropical_real.py. See frames.py.

| Map | Centre (E, N) | +x direction | Map bbox (S, W, N, E) | Fetch window (S, W, N, E) |
|---|---|---|---|---|
| morro (El Morro) | 803757, 2044655 | 142.8° CCW from east | 18.46761, -66.12704, 18.47333, -66.12075 | 18.45878, -66.12998, 18.47863, -66.10825 |
| tropical (Isla de Cabras) | 802455, 2044410 | north (90°) | 18.46593, -66.13805, 18.47097, -66.13445 | 18.46410, -66.13997, 18.47280, -66.13253 |

The El Morro fetch window also covers the first-person Old San Juan backdrop (game px x -9500..5616, y -2500..8000).

## Files
- `frames.py`: frames, fetch windows, lon/lat ↔ game px.
- `fetch_osm.py`: Overpass query → `data/osm/raw/<map>.json` + `.meta.json` (bbox, endpoint, OSM timestamp, query).
- `fetch_aerial.py`: NOAA z20 tiles → `data/osm/cache/<map>_photo.png` (git-ignored, about 350 tiles per map).
- `osm_lib.py`: polygon / multipolygon assembly, heights, widths, the routing graph (Dijkstra over footways/roads), line helpers.
- `config.py`: **the hand-checked choices**: lane waypoints (`LANES`, snapped to the OSM network), which OSM buildings become first-person volumes (`BUILDINGS`, kind / height / roof), backdrop skip rules.
- `build_layers.py` → `src/data/osm.generated.json` (runtime buildings) and `data/osm/derived/<map>_layers.json` (all layers + terrain guidance per lane: length, min/max ground, climb).
- `apply_lanes.py`: routes the lanes and updates `src/data/maps.generated.json` (lanes, waypoints, buildable grid, Cabras land bits, flora on the lanes) and repaints `public/assets/maps/<map>.jpg` + `<map>/ground.jpg` (old strip healed back to the aerial, new strip painted like compose_maps.py). Report: `data/osm/derived/apply_report.json`; pre-OSM lanes: `baseline_lanes.json`.
- `oldsj_osm.py`: rebuilds the building mask/heights of `public/assets/maps/morro/oldsj.dat` (Old San Juan backdrop) from OSM footprints; lidar ground bytes untouched. Report: `data/osm/derived/oldsj_report.json`.

Runtime side: `src/data/osmBlocks.ts` (collision for the volumes, used by `Game.walkable`), `src/fps/osmBuildings.ts` (meshes), `src/data/maps.ts` (merges the data, `OSM_ATTRIBUTION`).

## Regenerate (from the repo root; needs python3 with numpy, Pillow, pyproj, shapely ≥ 2, scipy)
```bash
python3 tools/osm/fetch_osm.py --force        # 1. OSM (skip --force to reuse data/osm/raw)
python3 tools/osm/fetch_aerial.py morro       # 2. NOAA photo cache (only needed for repainting)
python3 tools/osm/fetch_aerial.py tropical
python3 tools/osm/build_layers.py             # 3. runtime buildings + layers
python3 tools/osm/apply_lanes.py              # 4. lanes, grid, flora, map art (add --no-paint to skip the jpgs)
python3 tools/osm/build_layers.py             # 5. again, to refresh the lane terrain guidance
python3 tools/osm/oldsj_osm.py                # 6. Old San Juan backdrop
npm run build                                 # typecheck + validate-data + vite
python3 tests/balance_sim.py --maps morro,tropical --diffs easy,medium,hard
```
apply_lanes.py and oldsj_osm.py are rerunnable: the previous lanes are read back from maps.generated.json, and the
pre-OSM backdrop mask is kept in `data/osm/derived/oldsj_aerial_mask.bin`. A refetch can pick up OSM edits; review
the diff of `config.py` waypoints if a footway was re-mapped.
