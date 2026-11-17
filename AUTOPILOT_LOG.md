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
