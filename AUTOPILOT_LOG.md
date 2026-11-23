# Autopilot log

Nightly runs while Sebastian is away: one focused, shippable improvement per run. Newest entry at the bottom.

## 2026-11-17 — t101: first-person audio (shipped)

**What shipped.** First-person ("Possess") now has proper sound. Before this, your own weapon only made the faint 2D-map tick.
- Each weapon has its own synthesized report (WebAudio, no asset files, so there are no licensing questions):
  - Marksman Scout: a loud supersonic crack, a valley echo, then the bolt cycling.
  - ODST: a suppressed SMG puff.
  - Rifles: a crack plus a thump.
  - Raider Buggy and heli/turret MGs: a chaingun.
  - Bulwark Scorpion and Tank: a deep cannon boom with a shell clank.
  - Also distinct sounds for the Aegis beam, rail, darts, bow, melee, and the turned-monster bite in Overrun.
- Hit tick when a shot connects. Kill confirm (two-tone) when the enemy you hit goes down. Hits are read from the enemy the sim actually resolved the shot against (new `Game.manualTgt`), so hitscan ray hits count too, not only crosshair-locked targets.
- Footsteps on every stride when on foot (softer for monsters), and none while driving.
- Scope-in click when the Marksman Scout aims down the scope.
- Engine loop that starts when you board a parked Raider Buggy (lighter) or Bulwark Scorpion / Tank (heavier). It revs while driving and stops when you step out or leave first person.
- Code: `Sfx.fp()` / `Sfx.engine()`, hook `g.fpAudio` (main.ts), `Possess.weaponSfx()`. Test hook `__game.fpSfx()` returns cue counts, how many cues WebAudio actually played, and the engine state.

**Commits.** main `391d1d6` (feature + tests). gh-pages `8bd1b83` (BASE=/bloons-of-the-frontier/, .nojekyll kept). Live bundle `assets/index-BBPEgQpX.js`.

**Tests.**
- `npm run build` (typecheck + validator + vite): OK.
- New `tests/e2e_t101.py`: PASS locally and live (25 checks: per-weapon report, scope click, hit, kill, WebAudio played, footsteps, SMG, engine on/rev/off for Raider and Scorpion, no console errors).
- Core e2e_t53, e2e_t80, e2e_t97: PASS.
- `e2e_t74` (Marksman ADS) was already failing before this change: under headless swiftshader at about 1–2 fps, the zoom hadn't finished within the fixed 1.5 s wait. The test now polls the FOV and passes. No game change was needed.

**Live.** https://beeforestry.github.io/bloons-of-the-frontier/ returned 200 and served `index-BBPEgQpX.js`. Screenshots: `autopilot_shots/2026-11-17_live_fp_raider_buggy.png`, `autopilot_shots/2026-11-17_live_fp_sniper.png`.

**Ideas for next time.**
- Positional (panned/distance-attenuated) sound for other players' and towers' shots in first person, and enemy pops/splats near you.
- Ambient sound beds: sea and wind on El Morro, surf and gulls on Isla de Cabras.
- Distinct ricochet/impact sounds on fort masonry vs. ground.
- Kill-confirm visual (crosshair X flash) to pair with the new sound.
- Mobile: a haptic `navigator.vibrate` pulse on hit/kill.
- The Marksman screenshot showed a tilted horizon right after firing (recoil roll plus shake). Worth checking whether the camera roll should be clamped while scoped.

## 2026-11-17 — t101b: "Métele con ganas" push (shipped, daytime)

**What shipped.** Details and the per-item verification are in `PROGRESS_t101.md`.
- **Marksman horizon:** the scope no longer tilts after a shot. The camera's yaw-then-pitch order had been commented out by accident in t99.
- **Parked Raider Buggies and Bulwark Scorpions are now solid.** This applies to troops, driven vehicles and Overrun monsters. Boarding with F still works, and stepping out never leaves you stuck.
- **Isla de Cabras riprap and breakwaters:** smooth, grey, normal-mapped procedural boulders replace the faceted low-poly rocks.
- **Tidebreaker Destroyer range** is now 260/285/315 (was 220/245/275). It covers 95% or more of every Isla de Cabras lane (the worst lane was 66%). Bot water runs: 3/3 wins.
- **Phone:** the menu hint and the tutorial now name 🏗 Build / 👥 Troops instead of "bottom panel".
- **Old San Juan backdrop** behind El Morro, built from USGS lidar terrain plus the NOAA 2017 aerial, with extruded pastel blocks. It is also visible across the bay from Isla de Cabras.

**Commits.** main `4d20ab3`, gh-pages `2a7904f` (BASE=/bloons-of-the-frontier/, .nojekyll kept). Live bundle `assets/index-CvpcDdyL.js`.

**Tests.**
- e2e_t101b: PASS locally and live.
- e2e_t53, t80, t97, t99, t74, t101: PASS.
- e2e_t78: the same Overrun timer/bite checks also fail on the previous live build (headless timing), so this change didn't cause them.

**Ideas for next time.**
- El Cañuelo interior rooms from the HABS PR-52 drawings.
- Per-building roof heights from the 3DEP point cloud (first returns) instead of hashed storeys.
- Look into e2e_t78's Overrun timer checks under headless swiftshader.

## 2026-11-17 — t103: element status combos (shipped, evening)

**What shipped.** Details are in `PROGRESS_t103.md`. The idea comes from vega-star/lightkeepers (Apache-2.0); no code or art was taken from it.
- Statuses: 💧 Soaked (Destroyer; Glue tier 2+), 🔥 Burning (Melon; Tank tier 3), ❄ Chilled (Frost Bastion), ⚡ Shocked (Tesla; Beacon tier 2+; Rail tier 2+).
- Combos:
  - Conduct (💧+⚡): chain lightning
  - Freeze (💧+❄): bosses resist
  - Shatter (❄ + heavy hit)
  - Steam (🔥+💧): armor offline, +20% damage taken
  - Wildfire (🔥 + explosion)
  - 🔥 and ❄ cancel each other out.
- Visuals: 2D overlays, icons and popups. First person: tint, vector badges and arcs. Co-op clients get the statuses through sync bits.
- UI: ⚗ guide (EN/ES) from the menu and the tower panel; the tower panel shows the element line.

**Commits.** main `786f5c0`, gh-pages `dce5489`. Live bundle `assets/index-D7mhyxVU.js`.

**Tests.**
- Build + validator: OK.
- e2e_t103: PASS locally and live.
- e2e_t97, t53, t99, t101, t80 and t74 (live): PASS.
- e2e_t101b: the Scorpion board check fails, and it also fails on the pre-t103 build.
- e2e_t78: 7 failures live vs 8 on the pre-t103 build, the same Overrun timing checks.

**Balance.** See `balance/t103_elements.md`. El Morro: 6/6 wins before and after. On Isla de Cabras the wave-19 coin flip is unchanged within noise.

**Ideas for next time.** Queued by Sebastian: same-type tower fusion + predictive aiming, then tier-3 specialization, hidden fusion recipes and proximity effects, then Overload/Rage, scaling crit, knockback, then physics-lite deaths.

## 2026-11-18 — t104: same-type tower fusion + predictive aiming (shipped, early morning)

**What shipped.** Details are in `PROGRESS_t104.md`.
- **Fusion.** Two max-tier towers of the same type, side by side, fuse into one ★ Fused super-tower:
  - Stats: ×1.4 damage, +10% rate, +8% range, +1 pierce, ×1.8 HP; about 2× one max tower.
  - Fee: 40% of one tower's full price. Sell value stays 70% of everything invested.
  - One spot is freed. Fusing is done from the ⚛ button in the tower panel.
  - Looks: gold aura and ★ badge in 2D; gold halo, light column and ★ badge in first person.
  - Save/Continue and co-op sync handle it. The validator checks each fused tier.
- **Predictive aiming.** `Enemy.predict` plus an intercept lead for tower projectiles, lobs and troop rifles, and for first-person direct shots. Hitscan, beams, boomerangs and fixed-lane guns are unchanged. Aimed-shot hit rate: El Morro 90.9 → 94.4%, Isla de Cabras 83.1 → 90.5%.

**Commits.** main `0d680d6`, gh-pages `57d71ef`. Live bundle `assets/index-CByxsJcm.js`.

**Tests.**
- Build + validator: OK.
- e2e_t104: PASS locally; live sections A–C PASS (co-op section D is local only because of the http relay).
- e2e_t97, t53, t101, t80, t103, t74: PASS. t99 PASS on rerun (flaky under load).
- Same failures as before t104: t101b (2, Scorpion), t78 (9, matching the base build), e2e_mp versus crash at `cells[30]` (matching the base build).

**Balance.** See `balance/t104_fusion_aim.md`.
- Medium on both maps: wins unchanged.
- Hard El Morro with an aggressive fusing bot: the v1 numbers went from wave 62 to 92/94, so fusion was cut to v2 (wave 75/84, still a loss).

**Box note.** The box was reset mid-run. Lost edits were redone, and work is now committed at checkpoints.

## 2026-11-18 — t105: tier-3 specializations, hidden fusion recipes, proximity effects (shipped, ~02:00)

**What shipped.** Details are in `PROGRESS_t105.md`.
- **Specializations.** 16 towers × 2 permanent branches at the last tier, with panel buttons, a coloured ring + emblem in 2D and FP, and element branches.
  Fusion only between towers with the same branch. Save and co-op are handled. The validator checks both branches vs tier 2.
- **Hidden fusions.** Storm Core (Tesla + Frost Oakshield), Inferno Battery (Flame Melon + Dart / Solar Pea), Elite Barracks (Firebase + Sunflower).
  The button shows "???" until discovered (localStorage). The ⚗ almanac lists them. Co-op and save are handled.
- **Neighbour effects.** Ice / fire neighbours add their status every 3rd hit; a support neighbour gives +6% rate. Link lines and a panel list show them. Combos trigger.

**Balance.** `balance/t105_specs.md`. Branches were trimmed ~30% after the fusing bot reached wave 92/94 on hard El Morro (now 75/83, same as t104).

**Tests.** e2e_t105 PASS (local A–E, live A–D). t104/t103/t97/t53/t101/t74/t99 PASS. t80 PASS on rerun. Known pre-existing: t78, t101b, e2e_mp versus.

## 2026-11-18 — t106: Capa 4 — targeting, Overload Core, Rage, scaling crit, knockback, sell 70% (shipped, ~02:28)

**What shipped.** Details are in `PROGRESS_t106.md`.
- **Targeting.** Six modes with icon buttons and tips. "Closest to HQ" is now "Closest to Exit". Recipe towers inherit the mode. Works with fused towers, recipes and first person.
- **Overload Core.** +5% damage per level. Price 500 → 800 → 1280… (×1.6), max 12. Shown in the HUD, saved, synced in co-op (the buyer pays).
- **Rage.** ×1.5 fire rate for 9 s, 30 s cooldown. Button or X, with a vignette and heat rings. Team-shared in co-op.
- **Crit.** 10% rising 0.4% per wave to 33%, ×2.5 damage. ✦ popups and the % in the HUD.
- **Knockback.** Melon Mortar and Battle Tank push back along the path. Bosses take ×0.3. Diminishing returns, so no stun-lock.
- **Sell.** The button shows "70% of ¢invested". Checked for plain, branch, fused and recipe towers.

**Balance.** `balance/t106_capa4.md`. A new enemy-HP ramp (`BOOST_HP`: medium 0.25, hard 0.7) offsets the ~2.4× late power. Results:
- Medium El Morro 3/3 wins.
- Isla de Cabras 3/4.
- Hard El Morro: avg wave 70 without fusing (t105: 67), 79/75 with fusing (t105: 75/83).

**Tests.** e2e_t106 PASS (local A–H, live A–G). t105/t104/t103/t97/t53/t101/t80 PASS. t99 is the known flaky one (El Canuelo door).

## 2026-11-18 — First-person ambience: sea, wind and gulls (shipped, ~03:10)

**What shipped.** First person on the two coastal maps now has a quiet ambient sound bed under the guns, so the fort and the island no longer feel silent between shots. Everything is synthesized in WebAudio (looped brown noise + LFO swells, glided gull calls), so there are no audio files and no licensing questions.
- **El Morro:** deep surf against the cliffs with slow wave sets, an occasional breaker crash (rising hiss + low thud + foam tail), a strong Atlantic wind with whistling gusts that gets stronger and drowns the surf a bit the higher your eye is (walls/garitas), and a rare gull.
- **Isla de Cabras:** brighter, faster lapping surf on the riprap, a lighter breeze, smaller breakers, and gulls calling often (panned left/right).
- Fades out when paused, muted (🔇) or leaving first person; fades back when resumed. 2D view stays as before.
- Code: `Sfx.ambient(kind, height)` (src/audio/Sfx.ts), optional `FpAudio.ambient` (Game.ts), called each frame from `Possess` (throttled to 4 Hz inside Sfx), stopped in `Possess.exit()`. Test hook `__game.ambSfx()` → kind, level, wind, gull/breaker counts, eye height.
- Worked in a separate git worktree (`/workspace/ap_t107`) because another run was shipping t106 in `/workspace/bloons-frontier` at the same time; waited for t106 to push main + gh-pages, then rebased on top so the live build has both.

**Commits.** main `24ce85f` (feature + `tests/e2e_ambience.py`, rebased on t106 `cf58772`). gh-pages `2882f6d` (BASE=/bloons-of-the-frontier/, .nojekyll kept). Live bundle `assets/index-CP6m2qqV.js`.

**Tests.**
- `npm run build` (typecheck + validator + vite): OK.
- New `tests/e2e_ambience.py`: PASS locally and live (18 checks: no bed in 2D; morro/cabras bed per map; surf + wind levels; gull call + breaker synthesized; pause/unpause; mute/unmute via 🔉; stops on exit; no console errors).
- Core e2e_t53, e2e_t80, e2e_t97 + e2e_t101 (FP audio): PASS on the rebased build.
- e2e_t80 is flaky under load: before rebasing, two runs failed once each on "drove the scorpion" / "FP flora (0 plants, read before the async flora finished)". The untouched origin/main build failed the same scorpion check on 1 of 2 runs, so it isn't caused by this change. Possible fix next time: poll for `vm.flora` and give the Scorpion drive check a longer hold.

**Live.** https://beeforestry.github.io/bloons-of-the-frontier/ → 200, serves `index-CP6m2qqV.js`. Screenshots (with a test-only label showing the live ambience readout): `autopilot_shots/2026-11-18_live_fp_ambience_morro.png`, `autopilot_shots/2026-11-18_live_fp_ambience_cabras.png`.

**Ideas for next time.**
- Positional sound for towers' and teammates' shots and nearby pops in first person (PannerNode by distance/bearing).
- Make surf louder when you actually face/approach the water (distance to nearest water cell) instead of only by eye height.
- Small 🌊/💨 ambience volume slider separate from SFX.
- Rain/storm weather bed paired with a visual weather pass.
- Harden e2e_t80 (poll flora; Scorpion drive).

## 2026-11-18 — t107: physics-lite death effects (shipped, ~03:20)

**What shipped.** Details are in `PROGRESS_t107.md`.
- **Death events.** Each kill records its cause and the hit direction. The 2D debris and first-person parts read them; co-op clients replay them from the snapshot (`DE`).
- **2D.** Sprite slices plus a body that tips over (bugs), rubber shreds plus the knot (balloons, and light shreds per layer pop).
- **Variants.** Explosion (more pieces, scorch, shake), burning (charred pieces, embers, ash), ice and SHATTER (shards), shock (sparks), boss (bigger burst, slow motion).
- **First person.** The GLB splits into 2–4 parts that bounce on the terrain. Pooled, cap 40 (18 on touch).
- **Performance.** Global cap 240/150/80, 56 on mobile, plus a heavy-load mode. FPS change: mobile −0.5, desktop −2.0 (software GL, constant-kill stress test).

**Tests.** e2e_t107 PASS (local A–H). t106/t105/t104/t103/t97/t53/t101/t80/ambience PASS.

## 2026-11-19 — Living ocean in first person (shipped, ~03:30)

**What shipped.** The flat Phong sea plane on El Morro and Isla de Cabras is now a procedural ocean shader (`src/fps/ocean.ts`, no assets):
- **Swell.** 5 summed Gerstner waves displaced in the vertex shader on a 260×260 grid. The grid is ~3 m over the play area and gets quadratically coarser out to the 3.2 km horizon. Each wave fades where the grid is too coarse for it (no aliasing) and in shallow water (from the shore texture), so beaches don't flood. Analytic normals plus two scrolling `water_n` detail samples.
- **Fresnel.** Dark navy/teal body looking down; at grazing angles it reflects the same sky gradient as the dome. There's also a sharp sun glint plus a broad sun path toward `sunDir`.
- **Shore foam / surf.** A depth + distance-to-land texture (1.5 m cells, chamfer distance) is built from the shared heightfield, then rebuilt from the 0.5 m fine fort / El Canuelo heights once they load. It drives:
  - a swash line that runs up and back at the waterline
  - foam at the visible edge of flat shallows
  - breaking lines rolling toward the shore
  - crest whitecaps
  - (El Morro) surge on the cliffs and sea walls
  - lacy noise breakup (procedural fbm texture)
- **Per map.**
  - **El Morro:** deep Atlantic navy, swell ~0.86 m total running west onto the cliffs (the map has the Atlantic on +x), and a wide surf zone.
  - **Isla de Cabras:** turquoise, more transparent shallows (the sand shows through), calmer swell (~0.36 m), lighter foam.
- **Quality tiers.** high → full (68k verts); medium/touch → 150×150 grid; low (`?fpq=low`, or the slow-frame `dropToLow`) → 24×24 grid, no vertex waves, one normal sample, no crest caps. Fresnel + foam are kept. `dropPost` → medium.
- **Ambience.** `Sfx.ambient(kind, h, near)` now takes how close the eye is to open water (plus a bit when facing it). Surf is louder and brighter at the shore and softer inland, and breakers scale with it. `__game.ambSfx()` now also reports `surf` and `near`.
- **Test hooks.** `__possess.cur.vm.ocean` → `{mode, kind, waves, amp, verts, grid, fine, shoreCells, foamCells, time, near}`; `__possess.cur.ocean.heightAt(x, z)` is a CPU mirror of the swell. The mesh is still named `sea`.

**Commits.** main `e456014`. gh-pages `07c1a52` (BASE=/bloons-of-the-frontier/, .nojekyll kept). Live bundle `assets/index-CA_nbtez.js`.

**Tests.**
- `npm run build` (typecheck + validator + vite): OK.
- New `tests/e2e_ocean.py`: PASS locally and live. It checks per map: full mode / 5 waves / grid; `sea` is the ocean shader; shore + surf cells from the fine heights; the swell animates (clock + CPU height); foam is visible on screen (pixel diff with foam on vs off); surf proximity is higher at the shore than inland; slow frames drop to the low ocean. It also checks El Morro's swell is stronger and its water darker than Cabras', the `?fpq=low` path (no vertex waves, cheap shader, foam on, ripples animate), and no console errors.
- Core e2e_t53, e2e_t97, e2e_t80 (first try), e2e_ambience: PASS.

**Live.** https://beeforestry.github.io/bloons-of-the-frontier/ → 200, serves `index-CA_nbtez.js`. Screenshots: `autopilot_shots/2026-11-19_live_fp_ocean_morro_cliffs.png`, `autopilot_shots/2026-11-19_live_fp_ocean_cabras_shore.png`.

**Known / ideas for next time.**
- On the low rocky flats at El Morro's south edge (around px 2300–2900, 2750) the contact foam reads as a fairly solid white patch from eye level. It could pass as surf over the reef, but needs a finer breakup.
- Screen-space or planar reflections of the fort / cliffs on calm water (high quality only).
- Underwater fog / caustics on the shallow sand at Cabras; wet-sand darkening band above the waterline on the terrain shader.
- Spray particles where the swell hits the El Morro cliffs, synced with the ambience breaker crashes.
- Boats / buoys bobbing on `heightAt()`.

## 2026-11-20 .. 2026-11-22 — no runs logged (diagnosed 2026-11-23)

No commits, branches, stashes or local changes from those days. The box was replaced on 2026-11-21 (~07:22), and the replacement wiped `node_modules` and the Playwright browser cache (`~/.cache/ms-playwright`). It also left the old gh-pages worktree `/tmp/ghp_wt` dangling (`deploy_bof.sh` depends on it). So `npm run build` and the e2e tests could not run, and the runs could not ship. Fixed on 11-23 with `npm ci` + `playwright install chromium` + `git worktree prune`; the deploy now uses a fresh worktree (`/workspace/ap_ghp_1123`). If a future run fails early, check those three things first. GitHub HTTPS also had one transient TLS handshake failure; a retry worked.

## 2026-11-23 — Cliff spray in first person (shipped, ~04:15)

**What shipped.** White water now bursts up where the swell hits El Morro's cliffs and sea walls, and (much smaller) the Isla de Cabras riprap. The coast no longer looks like the sea just stops at the rocks.
- **Sites.** `Ocean.setShore` now also finds spray sites. These are water cells right against land that rises ≥1.0 m (Cabras 0.5 m) within ~6 m. Each site gets a seaward normal from the distance-to-land gradient and a strength from the rise. Sheltered pockets are skipped (it needs open water 6 m out). They're rebuilt from the 0.5 m fine heights: El Morro has 461 sites along the Atlantic side and the south, Cabras ~1.1k.
- **Timing.** Each nearby site (up to 360 within 170 m) watches the CPU swell mirror (`heightAt`). When a crest climbs past its threshold, that site throws a fan of droplet clusters plus a slower, larger mist puff. Wind drift: onshore −x at El Morro, +z at Cabras.
- **Synced with the sound.** Every ambience breaker crash (`Sfx.crashes`, exposed as `FpAudio.crashes()`) throws one big burst at a strong cliff site in front of the eye, plus its two neighbours, so the boom and the white water line up.
- **Height.** El Morro spray reaches ~7.5 m above sea level; Cabras splashes reach ~1.8 m.
- **Rendering.** One pooled `THREE.Points` draw named `spray`. The blobs are procedural (lumpy, speckled droplets; thin mist), use fog, and need no textures or assets.
- **Quality.** Caps are full 900 / medium (touch) 480 / low 220. Low has no swell, so it uses timer bursts, and the pool is trimmed when quality drops. The spray freezes while paused.
- **Code.** New `src/fps/spray.ts`. Changed `ocean.ts` (`sprayFrom`, `spraySites`, `sitesVer`), `Possess.ts` (create / update / dispose), `Game.ts` + `main.ts` (`crashes()`).
- **Test hooks.** `__possess.cur.vm.spray` → `{sites, near, live, cap, bursts, crashBursts, spawned, maxH, mode}`; `__possess.cur.spray.crash(camera)`.
- **Also:** hardened `tests/e2e_t80.py`. It now polls `vm.flora > 1000` (async load) before reading it, and holds W for the Scorpion in 2.5 s slices (up to 4) until it moves. A baseline run before this change had failed on "first-person flora (0 plants)".

**Commits.** main `e75b928`. gh-pages `4182799` (BASE=/bloons-of-the-frontier/, .nojekyll kept). Live bundle `assets/index-CctIZgL9.js` (+ `Possess-C8j-kO8K.js`).

**Tests.**
- `npm run build` (typecheck + validator + vite): OK.
- New `tests/e2e_spray.py`: PASS locally and live. It checks per map:
  - sites found
  - one Points draw
  - swell-timed bursts near the eye
  - spray height
  - ambience crashes produce synced bursts
  - spray visible on screen (pixel diff, spray shown vs hidden: El Morro ~1.8–2.2k px, Cabras ~0.6k)
  - the cap holds under spam
  - nothing new while paused
  - slow-frame drop → low cap 220 with timer bursts

  It also checks El Morro spray is taller than Cabras', the `?fpq=low` path, and no console errors.
- Core e2e_t53, e2e_t80 (hardened), e2e_t97, e2e_ocean, e2e_ambience: PASS.

**Live.** https://beeforestry.github.io/bloons-of-the-frontier/ → 200, serves `index-CctIZgL9.js`. Screenshots: `autopilot_shots/2026-11-23_live_fp_spray_morro_cliffs.png`, `autopilot_shots/2026-11-23_live_fp_spray_cabras_riprap.png`.

**Ideas for next time.**
- Positional sound for towers' and teammates' shots and nearby pops in first person (PannerNode).
- Wet-rock darkening on the cliff faces where spray lands (terrain shader band near the spray sites).
- Finer foam breakup at El Morro's south flats.
- Buoys / boats bobbing on `heightAt()`.
- A wet-sand band at Cabras.
