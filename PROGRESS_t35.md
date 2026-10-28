# Stage A (t32–t35) progress note

Live: https://beeforestry.github.io/bloons-of-the-frontier/

## Shipped
- **Collector (t32):** the Sprout Farmhand is immune to damage and can't be targeted (it's skipped by enemy targeting, AoE, MAC Blast, boss sweeps, smashes and stomps, and never blocks). It collects every credit, orb and scrap pickup anywhere on the map at full value. Cap is 1 per player; the card shows (1/1) and disables.
- **El Morro v2 (t33/t34):** repainted from both aerial references in game style (art_src/tools/morro_v2.py):
  - triangular fort with stepped, crenellated levels, central plaza, sunken red courts, ramps, garitas you can garrison, and the lighthouse
  - golden cliffs and a boulder seawall, plus a detached curved breakwater in heavy surf
  - calm harbor bay, the esplanade lawn and moat, and Old San Juan: pastel houses with tile or azotea roofs and balconies, a cemetery with white tombs, and the yellow barracks
  - 3 lanes: two city roads across the lawn, plus a sea landing up the south glacis. The shortcut is kept.
- **Auto Army (t35):** HUD toggle `🤖 Auto`, a per-squad toggle in the unit panel, and hotkey **G** (formation moved to **V**). Badges: A for auto, II while a manual order runs. Roles:
  - defend the most threatened lane, spread across squads
  - intercept leaks near the HQ
  - garrison nearby cover
  - retreat to heal below 35% HP and return at 85%
  - Paladin medics follow the wounded
  - Farmhand auto-organizes farms
  - heroes and ODST auto-cast EMP, Hijack, Stim and Rally
  - anti-air troops shoot flyers first
  
  Manual orders pause the AI, which resumes afterwards. Covered in a tutorial step.
- **Balance:**
  - The Hard/Impoppable HP bonus ramps in over waves 1–25, and bounty is +25% up to wave 20 on hard modes.
  - Hard now starts with 750 cash at a 1.05 cost multiplier.
  - Per-map HP ease.
  - Hypnotized converts get an HP floor and still convert at full health.
  - Sim results: balance/sim_t32.md and balance/sim_t33_morro.md.

## Multiplayer (later job)
The code is in src/net (Net.ts with PeerJS, Sync.ts with a host-authoritative snapshot and inputs, Versus.ts), src/ui/Lobby.ts and NetHud.ts, and tests/e2e_mp.py. It's hidden from the menu unless the URL has `?mp=1` or a `?room=NNNN` invite link.

## Tests
These pass on garden, jungle, fortress and morro with 0 console errors: e2e_playtest (--waves 6), e2e_systems, e2e_t28, e2e_collector and e2e_auto.
Screenshots: screenshots/t35/ (tests/shots_t35.py).
