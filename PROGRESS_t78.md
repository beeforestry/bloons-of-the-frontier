# t78 — Overrun (first-person survival mode)

## What shipped
- **Main menu → 🪲 Overrun** (4th mode button). Solo/offline setup: map (Tropical Island default, El Morro), match length 3/5/8 min,
  0–3 AI squadmates, "▶ Play Overrun solo". Same panel hosts/joins a 2–4 player PeerJS room (lobby label "Overrun"; host sets map/length/AI).
- **Class select before spawn** (painted v3 portraits): Frontier Marines, Orbital Drop Troopers, Aegis Operative, **Raider Buggy**, **Bulwark Scorpion**
  (both vehicles marked 🚙 VEHICLE). MP shows a roster of who picked what; match starts once every human picked (45 s auto-pick fallback).
- **Team spawns together straight into first person** as the chosen tier-0 unit (no place-then-possess); existing GLBs, guns, camera heights.
- **AI hive monsters** (scavenger, hunter, charger, brood, warden, ironback; existing GLBs) spawn 380–720 px from the team via a director that ramps
  over the match, hunt the nearest survivor, chew towers in their way, bite in discrete hits (armour applies), never attack turned players. No balloons, no bosses.
- **Death → enemy class picker**: a fallen human (while teammates still stand) picks Scavenger / Hunter / Charger / Brood Sac and respawns (3–5 s)
  as that monster in first person (own head/jaws viewmodel, click = bite, Q/Space = Skitter / Pounce / Charge / Spawn brood). Dead AI squadmates are out (a Hunter spawns where they fell).
- **Points & towers**: kills pay the survivor who tagged them (Scav 10, Hunter 25, Charger 60, Brood 45, Ironback 55, Warden 45, turned player 120);
  tower kills pay the owner 50%. E/Tab opens the **tactical map** (2D free placement) with a shop of base-tier towers: Stone Wall 90, Dart Scout 120,
  Glue Slinger 150, Firebase Bunker 180, Autoturret 200, Marksman 220, Tesla 300. Max 6 per player, within 560 px of your unit; broken towers are destroyed.
  Turned players can't place. "Back to first person (E)".
- **Win/lose**: survivors win when the timer ends; the hive wins when the last survivor falls (solo lone death = loss). Own end screen per player
  (survivor / turned perspective, kills/points/deaths table). TD game-over panel, waves, HQ gun, Farmhand, autosave and tutorial are off in Overrun.
- **Balance knobs (Overrun only)**: survivor HP marine 170 / ODST 200 / Aegis 380 / Raider 320 / Scorpion 440, armour cap 1/1/3/2/3,
  damage ×1.3/1.2/1/1.1/0.45; out-of-combat regen after 4 s. Main-game stats/economy untouched.
- **MP**: host-authoritative over the existing Sync — picks, spawns, HP, kills, points, placement (`ov` op), death/convert, turned-monster control
  (client-predicted), win/lose all in the snapshot (`OV` field + hunt/turnedBy/ang on enemy rows). Only your own survivor / monster can be controlled.

## Files
- New: `src/overrun/{Overrun.ts, OverrunUI.ts, data.ts, overrun.css}`, `tests/e2e_t78.py`, `tests/e2e_t78_mp.py`.
- Changed: Game (overrun hook, canPlace hook, water not walkable in Overrun), Enemy (hunt/turned fields), Unit (hpMul/armorMax/ovDmg),
  Building (HQ gun off in Overrun), Possess (possess a turned Enemy, overrun options), main, Sync, Lobby, Hud/NetHud (end-screen guard), types (ManualCtl.ab).
- `tests/e2e_mp2.py`: menu mode count 3 → 4 (new Overrun button).

## Tests
- `e2e_t78.py` local: PASS (0 fails) · live `--url https://beeforestry.github.io/bloons-of-the-frontier/ --tag _live`: PASS (0 fails).
- `e2e_t78_mp.py` (2 browsers, test relay): PASS.
- Regression: e2e_t57, e2e_t76, e2e_t77, e2e_mp PASS. e2e_t42 "tropical: 4 prop clusters" and e2e_mp2 "room not found" / "room full"
  fail identically on the baseline (pre-existing, left alone).
- Screenshots (gitignored) `screenshots/t78/`: menu_overrun, class_select, fp_survivors_raider, fp_monsters_attacking, tactical_points_tower_place,
  enemy_class_picker, playing_turned_bug, fp_scorpion_solo, end_screen_win, end_screen_lose (+ `*_live.png`).

## SHAs
- main: f195ef5 (Overrun mode + tests)
- gh-pages: e37a6a9 (deploy of f195ef5, BASE=/bloons-of-the-frontier/, .nojekyll kept); root, index.html, .nojekyll, index-oUB-mSpF.js, Possess-rlUZaxr8.js, index-Bolvo9pu.css HTTP 200
