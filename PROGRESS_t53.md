# t53 — El Morro from real public-domain imagery + elevation
- [x] Imagery: NOAA NGS Hurricane Maria 2017-09-24 (CC0, ~25 cm). DEM: USGS 3DEP 1 m lidar PR_PRVI_E_2018 (public domain).
- [x] art_src/tools/morro_real.py (fetch -> photo + DEM on the map frame; paint / heightfield / walls for compose_maps)
- [x] 2D: real photo background (552 x 372 m at 0.25 m/px), lanes/pads/HQ/garitas/buildable re-traced; 349 lidar wall-face LOS blockers
- [x] FP: true-scale lidar terrain mesh + photo texture + CC0 detail, sea plane at 0.35 m, no warzone styling; sizes keep game scale
- [x] Balance (bot, Medium): before WIN 152/200 HQ -> after WIN 130/200 HQ
- [x] tests/e2e_t53.py; existing e2e pass (t40 "billboards" check fails identically on the pre-t53 build: superseded in t50)
