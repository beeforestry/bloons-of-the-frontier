# t105 balance: specializations + recipes + proximity

Builds: **base** = pre-t105 main `9efb8e6`. **t105 v1** = first branch numbers (+6–42% over plain tier 3).
**t105 v2 (shipped)** = branches trimmed ~30% (+5–30%), with halved fusion multipliers for same-branch pairs.
Bot: `tests/balance_bot.js` (it now picks branch `uid % 2`; it never builds recipes on purpose; proximity happens wherever it builds).

| run | base | t105 v1 | t105 v2 (shipped) |
|---|---|---|---|
| medium El Morro (×3 / ×2) | 3/3 WIN (HQ 136, 156, 154) | 3/3 WIN (196, 171, 144) | 2/2 WIN (176, 189) |
| medium El Morro + fusing bot | — | 2/2 WIN (198, 162) | — |
| medium Isla de Cabras, R1 + water (×4) | 3/4 (lost w16) | 2/4 (lost w16, w18) | 3/4 (lost w18) |
| hard El Morro, no fusing | lost 62, 62 | lost 67, 67 | lost 67 |
| hard El Morro, fusing bot | (t104 v2: 75, 84) | lost 92, 94 | lost **75, 83** |
| hard Isla de Cabras | lost 18, 18 | lost 18, 18 / fusing 19, 59 | lost 18 |

A/B on t105 v1, hard El Morro with the fusing bot (`window.__game.tune`): proximity off gave 94 / 92, branches off gave 84 / 84,
both off gave 90 / 67. Proximity is within noise. The extra late-game reach came from the branches, so they were trimmed.
v2 is back on t104's fusing numbers. Isla de Cabras medium keeps its known wave 16–19 coin flip in every build.
Some 100-wave runs stop at the 420 s sim cap (HQ > 0), so their "reached" is a lower bound.
