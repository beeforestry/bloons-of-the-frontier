# t74 — Marksman Scout aim-down-scope (ADS) in first person

User ask (t74u): let him aim down the scope in first person to shoot far. Sniper (`sniper_monkey`) only.

## Behaviour (src/fps/Possess.ts, src/fps/possess.css)
- Hold **Right-click** (or hold **Shift**) while possessing the Marksman Scout → scoped; release → hipfire. Hint shown in the FP HUD.
- FOV eases 70° → 14° (~5×); mouse look sensitivity drops to 22% while scoped.
- Scoped sight picture: black scope vignette, duplex reticle with red centre dot, "SCOPED · ×5" tag; viewmodel and normal crosshair hidden.
- Fire (left click) works while scoped; range/damage untouched.
- ADS cleared on release, on pointer-lock loss and on leaving Possess. Other towers/troops: no scope (`canScope` false).
- Test hooks: `state()` now reports `adsActive`, `adsK`, `fov`, `canScope`; `setAds(on)`.

## Test
tests/e2e_t74.py — real RMB hold → adsActive + fov 14 + scope overlay; fires while scoped; release → fov 70; Shift hold/release;
Dart Scout possess + RMB → no scope. PASS locally and against live.

## Deploy
- main: `fbc7a5606400c7dec4c24549d0ee515e20cf30d9`
- gh-pages: `8c043aedf9849def829bd860b9891f9fe915e927`
