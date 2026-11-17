# t100 Isla de Cabras balance check (tests/balance_sim.py, tropical, medium)
Bot strategies: **land** = default rotation (land towers only); **water** = `--water --rot` with Tidebreaker Destroyers and Harbor Beacons mixed in
(bot also gets open-water / shoreline candidate spots). HP ease = `MAP_EASE` multiplier on enemy HP.

| build | ease | strategy | runs | result |
|---|---|---|---|---|
| pre-t99 frame (4a2fc62) | 1.0 | land | 1 | WIN, HQ 187 |
| t99 (0de5eeb) / t100 | 1.0 | land | 3 | all lost (waves 15-18) |
| t100 | 1.0 | water | 3 | all lost (waves 15-18) |
| t100 | 0.8 | land | 3 | lost at 18, 50, 19 |
| t100 | 0.8 | water | 3 | WIN (HQ 194/200), lost at 16, WIN (HQ 168/200) |
| t100 | 0.7 | land | 3 | lost at 19, 53, 19 |
| t100 | 0.7 | water | 3 | WIN ×3 (HQ 175, 155, 200) |

Wave 18/19 is the cliff: a MOAB on the bay landing (lane 2, mostly over water) plus ceramics on the park road. The t99 frame put the HQ on the
narrow neck where all three lanes meet, so land near it is scarce; the bay gives the room instead. Shipped: tropical ease **0.8** (same as El Morro).
