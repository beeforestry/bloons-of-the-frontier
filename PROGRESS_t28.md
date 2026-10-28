# Phase 1 (t28–t30) progress note

- Phase-1 commit: **c37c220** on `main` (beeforestry/bloons-of-the-frontier); gh-pages deployed (bundle index-BEvW1S-C.js)
- Live: https://beeforestry.github.io/bloons-of-the-frontier/

## Shipped
- Interactive 13-step tutorial (skippable/replayable, localStorage `bof.tutorialDone`, menu 🎓 Tutorial)
- El Morro (San Juan, PR) map with garitas; 6 new frontier rosters (Boomerang Monkey, Chomper, Hypno-Shroom, Scorpion, Tesla Coil, Ranger)
- Hypno-Shroom: converts at full HP; tiers raise cooldown rate/max count/HP cap; converted enemies walk backward, fight, tinted
- Smoother part-based animation; heavier explosions; voice lines (speechSynthesis, 🔊 toggle)
- Bosses (Scarab, Zeppelin, Dreadnought, Hive Leviathan final) with phases + boss HP bar; wave preview chips; 1x/2x/4x
- Difficulty select Easy 40 / Medium 60 / Hard 100 / Impoppable 100 (HP, speed, cash, costs, HQ); procedural waves past the authored set; Victory → ♾ Freeplay with counter + endless scaling
- Build-panel hide toggle (button + H, slide animation, localStorage, mobile)
- Expansion gaps filled: stances, HQ targeting, vet aura, orb hover-collect, scrap, garrisons, destructible terrain, Spartan EMP, Warthog, ODST, Sniper, Corrosive, PvZ barriers, Paladin, Arcane AP
- Balance pass: scripts/balance.ts → balance/static.md; bot sim tests/balance_sim.py → balance/sim.md (sim_v1 = pre-tune)

## Tests
e2e_t28 + e2e_playtest + e2e_systems PASS on garden, jungle, fortress, morro (0 console errors).

## Screenshots (screenshots/t28/)
tutorial_step, el_morro_full_map, hypno_{garden,jungle,fortress,morro}, boss_phase2_{garden,morro}, wave_preview_speed,
animation_closeup_sheet, roster_art_sheet, mobile_panel_hidden, difficulty_select, final_boss_{garden,morro}, final_boss_phase3, victory_freeplay (.png)
