# Design & architecture

This started as a Unity spec ("Bloons of the Frontier", with ScriptableObjects and MonoBehaviours) and was rebuilt as a
browser game. The structure maps one-to-one:

| Unity spec | Here |
|---|---|
| `Faction` enum | `src/core/types.ts` `Faction` (Primates, Flora, UNSC). Future factions are commented hooks; add one in `data/factions.ts` + data rows |
| `TowerData` / `UnitData` / `EnemyData` ScriptableObjects | typed data literals in `src/data/{towers,units,enemies,waves}.ts` |
| `Tower` base + `CombatTower` / `CoverTower` / `FarmTower` | `src/entities/Tower.ts` uses **composition**: a Tower attaches whichever modules its tier data declares (`combat`, `cover`, `farm`) |
| `TargetingSystem` | `src/systems/TargetingSystem.ts`: First / Last / Strong / Close, air/ground filters, body-overlap range test |
| `BuffSystem` / `Aura` | `src/systems/BuffSystem.ts` (`BuffReceiver`, `AuraEmitter`, buff-aware `Health`) |
| `ResourceManager` | `src/systems/ResourceManager.ts`: Credits (primary). A secondary `power` resource exists but is disabled |
| `PlacementSystem` | `src/systems/PlacementSystem.ts`: grid, buildable mask, forgiving snap, occupy/release, sell at 70% |
| `WorkerUnit` + Organize Farms | `src/entities/Unit.ts` (`WorkerUnit`) + `src/systems/FarmOrganizer.ts` (pure planner) + `Game.executeOrganize` |
| Deployable troops | `Squad` / `Unit`: drop pod, rally point, attack nearest, block ground bugs, garrison into Cover |
| `WaveManager` | `src/systems/WaveManager.ts`: spawn timeline, wave-clear bonus + farm payouts, victory |
| `GameManager` | `src/game/Game.ts`: owns the world and the cross-system interactions, fixed 60 Hz sub-steps × speed |
| UI | `src/ui/Hud.ts` (DOM) + `src/render/Renderer.ts` (canvas) |

## Rules
- **Upgrade rule.** Every tier must be strictly better than the one before and must look better:
  - No numeric stat may go down, and the power score must rise.
  - `visual.level` must rise, and `scale` must not shrink.
  - Modules can't be removed.

  `src/data/validate.ts` checks this. It runs at dev boot (console warnings) and in `npm run build` (the build fails on any violation).
- **Cover buffs:**
  - Applying a buff from the same source replaces the old one.
  - Buffs that share a `stackKey` ("cover") take the max per stat, so two bunkers never double-stack.
  - Buffs are removed on aura exit, when the tower is sold or knocked offline, or when the unit dies.
  - Gaining max HP heals by the same amount; losing it only clamps.
- **Economy.** Credits come from:
  - kill bounties
  - wave bonuses
  - farm crates during waves, plus a farm wave bonus
  - bug drops
- **Organize Farms:**
  1. Find the centroid of all farms.
  2. Candidate cells are the buildable cells that are free or already hold a farm.
  3. Pick the most compact rectangle (perimeter plus a small waste penalty). Score each position by distance from the centroid,
     minus a bonus for the largest contiguous build area it leaves open, so packing never walls off space.
  4. If no rectangle fits, fall back to the nearest blob.
  5. Assign farms to cells greedily by shortest move.

  Occupancy is swapped atomically. Farms then animate a slide with a dust trail, and the worker re-posts next to the block.
- **Enemies:**
  - Bloons pop into children, and overflow damage carries into the first child.
  - Lead bloons ignore sharp damage. Ceramics are tanky. A MOAB holds 4 ceramics.
  - The bugs are original designs:
    - **Scavenger:** swarms and diverts toward troops.
    - **Hunter:** leaps along the path.
    - **Charger:** front armor takes ×0.25 damage from non-explosive frontal hits; its rear is the weak spot.
    - **Brood Sac:** spawns scavengers.
    - **Bile Titan:** a boss that lobs acid (towers go OFFLINE for 10 s, and Farmhand repair speeds recovery), stomps troops, can't be blocked and drops scavengers on death.
  - Troops block ground bugs.

## Art
- **Towers, bloons, Line Watch soldiers and FX:** the user's art from `/workspace/game/assets`, in `public/assets`.
- **UNSC/Frontier tech, Marines, the Farmhand and every bug:** drawn procedurally in `src/render/sprites.ts`, with a different sprite per tier.
  These are original placeholders; nothing is copied from Halo or Helldivers.
- **Maps:** painted backgrounds. `art_src/tools/trace_path.py` extracts the path (color mask → skeleton → longest path → RDP),
  and `build_maps.py` writes `src/data/maps.generated.json` (waypoints and buildable mask).
- **Drive file names are mislabeled:**
  - `map_stone_fortress.jpg` is actually the garden path.
  - `map_garden_path.jpg` is actually the stone fortress. It is unused because of its white background and branching path.

## Implementation order / status
1. ✅ Core types, data and validation
2. ✅ Path, placement, resources
3. ✅ Towers (combat / cover / farm), targeting, projectiles
4. ✅ Enemies and waves (20 waves, bloons + bugs, 2 bosses)
5. ✅ Buffs / auras, troops, garrison, workers, Organize Farms
6. ✅ HUD, upgrade/sell/target, playable loop on 2 maps
7. ⏭ Next:
   - sound (port the WebAudio synth from the old engine)
   - per-tower upgrade paths (2 branches)
   - more maps (fortress with a branching path)
   - Covenant/Flood factions
   - save/load
   - mobile touch layout
   - balance pass (a naive bot wins at about 81/150 lives without troops)
