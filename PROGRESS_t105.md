# t105 — tier-3 specialization, hidden cross-type fusion recipes, proximity effects

## 1. Tier-3 specialization (`src/data/specs.ts`)
- 16 towers × 2 permanent branches, chosen when the last tier is bought (two buttons in the tower panel, with the stat
  changes; U hotkey never auto-picks). Default branch 0 for scripts and older saves.
- Rules in `branchTier()`: multipliers ≥1 apply to the last tier, any trade-off is floored at tier 2, adds are capped
  (slow ≤0.75, shred ≤1, garrison protection ≤0.85). Element branches (Frost Kunai, Stormcaller, Pyromancer, Firestorm)
  stamp their status through `Tower.elem`.
- After the hard-mode fusing-bot runs, branch bonuses were trimmed by about 30%. Power vs the plain tier 3 is now
  ~+5% to +30%; vs tier 2 it is always well above (validator).
- Looks: 2D coloured ground ring plus a shield emblem with the branch initials; FP coloured halo, light column and the
  same emblem (`branchFx`). The panel names the branch.
- Fusion: two towers must share the branch. Fusing a specialised pair uses halved fusion multipliers (`BRANCH_SOFT`), so
  the fused result is still ≈2× one max tower.
- Save (`br`), co-op snapshot (`branch` column) and `tw.upgrade(g, branch)` replication are handled.
- Validator: both branches vs tier 2 (no stat down, power strictly up, ≥0.98× plain last tier, visual up) and every fused branch.

## 2. Hidden cross-type fusion recipes (`src/data/recipes.ts`)
- Storm Core = Tesla Coil + Frost Oakshield Bastion. Chain lightning ×1.35, +3 jumps, alternating shock / chill, slow, keeps the cover aura.
- Inferno Battery = Flame Melon Mortar + Dart Scout or Solar Pea Fusion. 3-melon burning volleys, +35% rate, which feeds Wildfire.
- Elite Barracks = Firebase Bunker + Sunflower. +2 slots, ×1.4 aura HP, garrison protection 0.8, plus a sun aura.
- Not in the shop (`HIDDEN_TOWERS`, resolved by `towerById`). A Fuse button appears when a valid adjacent max-tier pair exists.
  It reads "???" until discovered (`localStorage` `bof.recipes`), then shows the name. A violet link line marks the partner.
  The ⚗ guide has an almanac (hints, discovered count).
- `Game.fuseRecipe` is networked (G_METHODS) and checks ownership of both towers. Fee: 30% of the parents' average full price.
  Sell value: 70% of everything. Recipe towers can't upgrade or fuse. Save/Continue restores them.
- Validator: registered, hidden, single tier, >1.1× power of every parent (incl. its branches), more HP, bigger look, look art present.

## 3. Proximity effects (`src/systems/Proximity.ts`)
- Combat towers whose base is within 70 px of an ice (chill) or fire (burn) tower stamp that element on every 3rd shot
  (1 s). Only the nearest neighbour counts, never the tower's own element.
- Next to a support tower: +6% attack speed (own 'prox' buff stack).
- Recomputed every 0.5 s (also on co-op clients for visuals). Faint animated link lines appear, brighter when either end is
  selected. The panel shows a "Neighbour effects" list. The ⚗ guide explains it.
- Combos happen: a Glue Slinger (wet) beside a silenced Frost Bastion froze 14 enemies purely from proximity, 0 without it.

## Tests
- `tests/e2e_t105.py` A–E: 49 checks, PASS locally (A spec, B recipes, C proximity, D FP emblems, E co-op).
- e2e_t104 (count updated to gold FX only), t103, t97, t53, t101, t74: PASS. t80: PASS on rerun (one flaky FP flora check, also flaky on base).

## Balance — see `balance/t105_*.md|json`
See `balance/t105_specs.md`. Shipped v2: medium El Morro wins unchanged; Isla de Cabras R1 3/4 (same as base);
hard El Morro no-fuse 62 → 67; hard El Morro with the fusing bot 75/83 (t104: 75/84). v1 branches (92/94 with fusing) were trimmed ~30%.

## Not done / notes
- The balance bot doesn't try hidden recipes (they are a discovery feature). Recipe power is gated by the validator (>1.1× every parent) and by cost.
- Co-op section E is local only (the http relay is blocked as mixed content on the https site).
- Capa 4 not started.
