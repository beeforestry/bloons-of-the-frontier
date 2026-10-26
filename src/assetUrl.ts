/** Resolves an asset path. The single-file build injects window.__BOTF_ASSETS (path -> data URI). */
export function assetUrl(p: string): string {
  const map = (globalThis as { __BOTF_ASSETS?: Record<string, string> }).__BOTF_ASSETS;
  return (map && map[p]) || p;
}
