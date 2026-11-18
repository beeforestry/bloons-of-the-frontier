# t107 — Physics-lite death effects

Dead enemies now break apart. Each kill records a **death event**:
- enemy id and position
- direction of the killing hit (from the shot's source point to the enemy; if there is no source, "back along its walk")
- cause, plus boss / layer-pop / shatter flags

The sim only records the event. The 2D renderer and the first-person view each read the queue on their own, so the effects are cosmetic and bot runs don't pay for them. Code: `src/systems/Deaths.ts`, `src/render/Debris.ts`, `src/fps/deathParts.ts`.

## 2D (`Debris`)
- **Physics:** pieces move on the ground plane plus a fake height axis. They launch along the hit direction (±0.85 rad), with gravity at 900 px/s². They bounce once or twice (33% restitution, ground friction), then spin and fade. Life is 0.6–1.2 s, then they return to the pool.
- **Bugs and creatures:**
  - The lower ~55% of the sprite is the body, which tips over ±70–85° in the hit direction.
  - The top of the sprite splits into 2–4 slices of the real art (head, back, limbs). Pieces on the far side of the hit fly further.
- **Balloons:** 5 rubber shreds (curled, jagged strips in the balloon's colour) plus the knot. Every layer pop throws 3 lighter shreds. The Sky Colossus breaks into hull slices plus shreds.
- **By cause** (cause = the last hit's damage type plus the enemy's element state):
  - **Explosion:** +2 pieces, ±1.9 rad spread, 1.6× speed, no standing body, and a scorch mark that lasts 2.4 s (bosses 4 s). Small camera shake.
  - **Burning:** charred (darkened) slices, orange embers and grey ash.
  - **Ice:** frosted slices plus 6 ice shards. The **SHATTER** combo (frozen + heavy hit) throws 10 shards per kill.
  - **Shock:** a burst of yellow/cyan sparks.
- **Bosses:** +4 pieces, lasting 1.7× longer, with a strong shake and 0.5 s of slow motion (×0.35, solo only).
- **Performance:**
  - Pooled objects, and each piece's transform is written straight onto the camera matrix (no save/restore per piece).
  - Global cap: 240 / 150 / 80 by quality; **56 on phones and touch screens**.
  - **Heavy-load mode** (more than 90 enemies alive, mobile, or low quality): half the pieces, about a quarter of the particles, no shadows or outlines. New non-boss kills are skipped once the pool is half full.

## First person (`FpDeaths`)
- **Splitting:** the enemy's own Blender GLB primitives break into 2–4 parts. If a model has fewer primitives than that, its biggest primitive is cut into triangle chunks along its longest axes (cached per geometry).
- **Movement:** an impulse along the hit direction plus outward from the body centre, gravity of 15.5 m/s², a bounce on the terrain height (35%), and spin. Parts shrink away over 1.3 s (explosions 1.7 s, bosses 2.4 s).
- **Variants:** charred or frosted materials (cached clones), plus ember, ash, ice-shard and spark bits.
- **Limits:** meshes are pooled; cap 40 parts (18 on touch / low quality). Only kills within 140 m are shown.

## Co-op
The host snapshot carries the death events since the last snapshot (`DE`: uid, id, cause, direction, flags, position). The client replays them before it drops the vanished enemies, so it sees the same break-apart with the same cause.

## Performance (`tests/perf_t107.py`)
Test setup: a heavy wave dying constantly (12 maxed towers, 10 spawns every 0.3 s, about 1000 kills in 12 s). Headless Chrome with software GL; before = `f70d19b`.

| Viewport | Before | After | Δ |
|---|---|---|---|
| Mobile 412×860 @2×, touch | 26.4 FPS | 25.9 FPS | −0.5 |
| Desktop 1280×760 | 20.9 FPS | 18.9 FPS | −2.0 |

First tuning pass (no heavy-load mode): mobile −3.4 FPS. The heavy-load mode and the lower mobile cap brought it under 1 FPS.
