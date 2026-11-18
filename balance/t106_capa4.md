# t106 balance — Capa 4 (Overload Core + Rage + scaling crit + knockback)

The bot (`tests/balance_bot.js`) now uses the new systems the way a decent player would:
- **Rage** whenever it is off cooldown and 8 or more enemies are on the field.
- **Overload Core** whenever spare credits are above 2× the next price (up to 3 levels per check, max 12).

`window.__BOT_NOBOOST` turns both off for A/B runs.

| Run | t105 (ref) | t106 r1 (boosts, no offset) | t106 shipped |
|---|---|---|---|
| Medium El Morro ×3 | WIN (HQ 176, 189) | WIN (192, 158, 168) | **WIN (149, 170, 173)** |
| Medium Isla de Cabras R1 + water ×4 | 3/4 | 4/4 (146, 128, 142, 123) | **3/4 (152, 122, 124; one loss at w21)** |
| Hard El Morro, no fusing | wave 67 | 95 | **75, 71, 67, 67 (avg 70)** |
| Hard El Morro, fusing | 75 / 83 | WIN (HQ 128) + 95 | **79 / 75** |

**What r1 showed.** The three power sources stack to about 2.4× late-game damage:
- Overload at the bot's ~12 levels: +60%.
- Crit at the 33% cap: ×1.5 average, against ×1.08 before.
- Rage: about +11% over time.

**Offset.** I added an enemy-HP ramp in `src/systems/Boosts.ts` (`BOOST_HP`, `boostHpMul`):
- Formula: `hp × (1 + k · clamp((wave−10)/50, 0, 1) · (1 + max(0, wave−60)/20))`.
- k values: easy 0, medium 0.25, hard 0.7, impoppable 0.7.
- There is no ramp before wave 10, so the early economy is untouched.
- Sample values on hard: ×1.24 at w30, ×1.7 at w60, ×2.05 at w70, ×2.4 at w80.

The middle round (k=0.6, /40 late slope) still let hard reach 94/67 without fusing and 94/94 with fusing.

**Raw files.** `balance/t106_*.json/.md` (r1), `t106r2_*` (medium and Isla de Cabras shipped), `t106r3_*` (hard shipped).
