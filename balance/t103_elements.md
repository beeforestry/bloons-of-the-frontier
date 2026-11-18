# t103 element combos: balance check (tests/balance_sim.py, medium, HP ease 0.8 on both maps)
Builds: **base** = pre-t103 main `7f0d4eb`; **t103** = this change. Same bot, same rotation per row.
- **R1 water** (t101 style): default rotation with 2× Tidebreaker Destroyer + Harbor Beacon mixed in, `--water`.
- **R2 element**: R1 plus Frost Oakshield Bastion (so Freeze / Shatter can happen).
- **default**: the bot's built-in land rotation.

| map | rotation | base | t103 |
|---|---|---|---|
| Isla de Cabras | R1 water | **17/35 wins (49%)** — sim 3/3, 4/8, 5/8, 3/8; wave-21 harness 2/8 | **15/43 wins (35%)** — sim 0/3, 2/8, 2/8, 3/8; harness 5/8, 3/8 |
| Isla de Cabras | R1, Conduct switched off (`--pre`) | | 9/16 (56%) |
| Isla de Cabras | R1, all elements switched off | | 4/8 (50%) |
| Isla de Cabras | R2 element | 0/3 (all lost at wave 19) | 2/3 (WIN 200, WIN 200, lost at 19) |
| El Morro | R2 element | 3/3 WIN (HQ 154, 176, 156) | 3/3 WIN (HQ 144, 163, 150) |
| El Morro | default | 3/3 WIN (HQ 156, 124, 136) | 3/3 WIN (HQ 122, 166, 121) |

Every Isla de Cabras loss in every build is the same wave-19 cliff (2 Sky Colossi + ceramics, chargers, ironbacks
on the bay landing) already noted in t100. It is a coin flip for this bot: the same build swings from 2/8 to 5/8
between batches. The R1 difference (49% vs 35%) is within that noise (Fisher p ≈ 0.25). Switching the elements off
in the t103 build gives 50–56%, also within noise. El Morro is unchanged: 6/6 wins on both builds. Combos are not a
free win either: the bot only gets them when it happens to pair towers.
Raw: `balance/t103_*.json|md`, `balance/dbg_off_*.json|md`.
