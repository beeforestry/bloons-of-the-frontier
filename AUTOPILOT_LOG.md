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
