// TURN relay config (t47). Metered (https://www.metered.ca) hands out short-lived TURN credentials
// from https://<app>.metered.live/api/v1/turn/credentials?apiKey=<key>. Both values are injected at
// BUILD time from env METERED_APP / METERED_API_KEY (vite.config.ts `define`); empty = not configured,
// and the game falls back to public STUN + Open Relay. Players can still override everything with
// localStorage['bof.ice'] = JSON RTCIceServer[].
declare const __METERED_APP__: string;
declare const __METERED_KEY__: string;
export const METERED_APP: string = typeof __METERED_APP__ === 'string' ? __METERED_APP__ : '';
export const METERED_API_KEY: string = typeof __METERED_KEY__ === 'string' ? __METERED_KEY__ : '';
export const meteredUrl = (): string => METERED_APP && METERED_API_KEY
  ? `https://${METERED_APP}.metered.live/api/v1/turn/credentials?apiKey=${encodeURIComponent(METERED_API_KEY)}` : '';
