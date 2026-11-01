# t36 / t37 progress: bug reports, shake fix, balance, free Farmhand, 👁 Possess

## Shipped
- **Bug report** (pause menu and HUD button): category, description, auto context (map, difficulty, wave, mode, fps, build) and an optional screenshot.
  - Delivery: FormSubmit AJAX → bloonsbugs@mail.grokbot.com through the activated form alias `410aa7812cb05f1aef5762ab5534ed2e` (src/config/report.ts). Subject format: `[BotF bug] <category> - <first 60 chars>`.
  - If sending fails: the report is queued in localStorage and the form offers a Copy button and a prefilled GitHub-issue link.
  - Rate limit: one report every 30 s.
- **Camera shake fix**, with a Full/Reduced/Off setting.
- **Balance pass** on towers and enemies (balance/t36_towers.md).
- **Free Sprout Farmhand** next to every player's HQ on every map (co-op: one each).
- **👁 Possess (first person inside the live match)**: select your own combat tower or troop squad, then press 👁 Possess or E.

## Shake root cause
- `shake()` set the amplitude to max(current, new) up to 22 px, and it decayed linearly (−40 px/s) inside the simulation update.
- Late-game splash towers (radius ≥ 70) triggered a new shake on almost every hit, so the amplitude never got back to 0.
- Decay was also tied to simulation dt, so while paused (dt = 0) the screen stayed shaking.
- Fix:
  - Decay is now exponential in real time and keeps running during pause or at 4x speed.
  - Hard cap of 14 px.
  - Routine splash shakes are rate-limited (at most one per 0.6 s, 6 px max).
  - Any continuous shake longer than 1.2 s is forced into a 0.8 s cooldown.
  - Shake resets on pause, menus and map changes, and the new setting scales it.

## Balance before → after (fixed bot, balance_sim)

| map | Medium before | Medium after | Hard before | Hard after |
|---|---|---|---|---|
| garden | WIN 149/200 | WIN 198/200 | lost at wave 61 | lost at wave 61 |
| jungle | WIN 160/200 | WIN 178/200 | lost at wave 61 | lost at wave 60 |
| fortress | WIN 194/200 | WIN 172/200 | lost at wave 61 | lost at wave 59 |
| morro | WIN 136/200 | WIN 169/200 | lost at wave 94 | lost at wave 67 |

- Tower changes: the best DPS-per-credit T2/T3 tiers were cut and T3 costs went up about 20%. Examples:
  - Flak T3: 6.25 → 2.63 DPS per 100¢
  - Super Monkey T3: 220 → 126 DPS
  - Repeater T3: 5.33 → 2.84 DPS per 100¢
  - Weak towers were raised: Frost Wallnut, Boomerang, Sniper T1, Solar Pea T1.
- Upgrade tiers are still strictly stronger (the validator passes).
- Single-tower spam on Medium (garden) loses every time: gatling cherry dies at wave 52, ninja at 40, tesla at 15, repeater at 10, chomper at 7, and flak stalls at 7.
- Enemies: Scarab HP 1000 / shield 200 / attack 50; Dreadnought HP 2400 / shield 300; the Dreadnought wave was softened.

## 👁 Possess
- **Entry:** select one of your own combat towers or a non-worker squad, then press 👁 Possess or E (on phones, tap the button).
- **Rendering:** three.js is lazy-loaded as its own chunk (about 528 kB, 136 kB gzip). It renders the live map, enemies, towers, troops and projectiles.
- **Towers:**
  - You aim and fire with the tower's own stats and cooldown. Direct hits on the crosshair target do +15%.
  - The tower can't move; pitch is limited, yaw is free (matching 360° towers in 2D).
  - A range ring is shown.
- **Troops:**
  - WASD or the on-screen joystick moves the possessed unit, and the squad follows behind it.
  - Abilities on Q / 1-2. The unit picks up scrap it walks over.
- **HUD:**
  - crosshair, HP and cooldown bars, wave/HQ/cash/hits chips, minimap with view cone
  - Pause, and Exit (Esc/E)
- **Controls:** pointer lock on desktop; touch look, joystick and FIRE button on phones. A pixel-ratio governor lowers resolution below 45 fps.
- **Rules:**
  - Game speed is forced to 1x; pause works.
  - Auto-exit on death, sale, game over, or when someone else takes over the entity.
- **Co-op:** possessCtl is a networked optimistic command with an ownership check (you can't possess another player's entity). Others see a "👁 P#" badge on the entity.

## Tests
- Every suite was run on all 4 maps: playtest, systems, t28, collector, auto, t36. mp and mp2 also ran.
  - mp now checks co-op possession: the client can't take P1's tower, the host sees the 👁 badge, the client's manual fire runs on the host, and exiting releases the tower.
- systems and auto now remove the free Farmhand at setup. It was legitimately vacuuming the scrap and shifting the squad indexes those tests count.
- Screenshots are in screenshots/t36/: fps_possess_button, fps_tower_view, fps_unit_view, fps_mobile.

## Known gaps
- The 3D view uses the flat map texture plus obstacle and tree models; painted 2D decor is not modelled in 3D.
- Possessed towers have free yaw.
- On a co-op client, aim is sent at 15 Hz and predicted locally in between.
- Possess needs WebGL. Without it the game shows a toast and stays in 2D.
