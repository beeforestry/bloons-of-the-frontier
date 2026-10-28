# Stage B — Multiplayer hardening

## Shipped
- Real-network transport: PeerJS public broker + public STUN; TURN fallback via Open Relay static-auth
  (TURN REST HMAC credentials minted client-side, 6 h expiry; UDP 80, TCP 80, UDP 443, TLS 443).
  Override with `localStorage['bof.ice'] = JSON iceServers array` (e.g. your own Metered/Cloudflare TURN).
- Seats: persistent seat token (`bof.mpTok`); host assigns lowest free seat; after a match starts only
  the original seats may rejoin, and a rejoin restores pid → colour, wallet, tower/unit ownership.
- Heartbeat (2 s, dead after 9 s) so closed tabs / dropped phones are detected.
- Lobby errors: room not found, room full, already in a match, host left, lost connection, NAT-blocked.
  Copy-invite-link button (+ native Share on phones); `?room=CODE` invite links auto-join.
- Drift: host snapshots at 15 Hz carry pause state; client mirrors snap; tier downgrades corrected.
  `__game.mpStateHash()` used by e2e to compare host vs every client.
- Co-op team pause (client asks host); Versus: host-only pause.
- Main menu ungated: Single Player / Co-Op Defense / 1v1 Versus.
- Full zoom-out bounds include off-map lane starts (El Morro sea lane); margin is mirrored + faded.
- Phone top HUD: ≤2 rows, less-used items (tech, orbs, auto, speed, voice, MP bar) in ☰.

## Tests
- tests/e2e_mp.py — 2 players in separate browser processes, relay transport.
- tests/e2e_mp2.py — 3/4 players (5 browser processes), full room, drop + rejoin, pause, 4× drift hash.
- tests/shots_stageb.py — fit-zoom on 4 maps, phone HUD rows/menu, phone lobby.
- tests/webrtc_probe.py — real WebRTC between two Chrome processes against any URL.

## Limits
- Box sandbox blocks UDP and proxies TCP, so a real DataChannel could not open from here; the broker
  signalling path was verified live. Needs a real-device test.
- Open Relay free TURN is shared, no SLA, often overloaded — treat as best effort.
- No host migration: if the host leaves, the room closes.
- New players can't join a match in progress (only original seats rejoin).
