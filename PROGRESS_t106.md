# t106 — Capa 4: targeting modes, Overload Core, Rage, scaling crit, knockback, sell 70%

## 1. Targeting modes (audit + panel)
- **Six per-tower modes**, all of which already existed in `TargetingSystem`:
  - ⏩ First (furthest along its road)
  - ⏪ Last
  - 💪 Strongest
  - 🎯 Weakest
  - 📍 Closest (to the tower)
  - 🏰 **Closest to Exit**: nearest to the HQ gate as the crow flies. This was "Closest to HQ", relabelled and given an icon.
- **Panel.** Icon + short-name buttons with tooltips, plus a tip line for the current mode. The T key cycles modes and shows a floating label.
- **Recipe fusions** now inherit the base tower's mode. Normal fusion already kept it.
- **Predictive aiming** uses the picked target, so it works with every mode. The test checks a Marksman, a fused Dart and a Storm Core in all 6 modes.
- **First person.** Every other tower keeps its own mode while you possess one. The test checks a Marksman on Last during FP.
- **Save/Continue and co-op** keep the modes (`tg` field / `setTargeting`).

## 2. Overload Core
- **Effect:** +5% damage for all towers per level, permanent for the match. Max level 12.
- **Price:** ×1.6 per level: 500, 800, 1280, 2050, 3280…
- **HUD:** a ⚙ button in the powers bar with the next price (greyed out when you can't afford it, MAX at the cap) and ⚙ Lv N in the top bar.
- **Co-op:** the buyer pays from their own wallet and the whole team gets the bonus. The level is saved and synced.

## 3. Rage
- **Effect:** every tower fires ×1.5 faster for 9 s, then a 30 s cooldown.
- **Controls:** 🔥 button (big tap target on mobile) and the **X** hotkey.
- **Visuals:** the button shows the countdown, the screen gets a red vignette and each gun gets a red heat ring with sparks.
- **Co-op:** shared team ability. Either player can trigger it and there is one shared cooldown, synced through the host.

## 4. Scaling crit (towers)
- **Chance:** 10% at wave 1, +0.4% per wave, capped at 33% (reached at wave 58).
- **Damage:** ×2.5 (was a flat 8% at ×2).
- **Display:** popups get a ✦ prefix, and the top bar shows ✦ N%.

## 5. Light knockback
- **Towers:** Flame Melon Mortar (10/14/18 px per tier) and Battle Tank (12/16/22 px per tier).
- **Path-safe:** the enemy's distance along its path drops, so it never leaves the road.
- **Who resists:**
  - Bosses take ×0.3.
  - Big units take ×0.6.
  - Air units, leapers and hunters are immune.
- **No stun-lock:** each shove adds 35% resistance (max 85%), which wears off over about 2 s.

## 6. Sell 70%
- `sellValue = floor(invested × 0.7)`. `invested` includes:
  - all upgrades (including the branch tier)
  - both towers plus the fee for fusions
  - both parents plus the fee for recipe towers
- **Panel button:** "Sell ¢X (70% of ¢Y)", with a tooltip explaining what is included. The test covers plain, branch, fused and recipe towers.

## Balance
See `balance/t106_capa4.md`. Enemy HP gets a matching late ramp per difficulty, so results land close to t105 (hard a little higher).
