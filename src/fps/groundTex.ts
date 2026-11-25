// t46: tiled CC0 detail textures (Poly Haven, see CREDITS_military.md) layered over the painted ground.
// The painted map image stays the macro colour + splat mask, so lanes stay exactly where the 2D route is;
// each pixel is classified (green→grass, warm bright→sand, warm dark→dirt path, grey→cobble, blue→water)
// and modulated by that material's tiled detail (texel / texture mean), so hue is kept but grain is added.
import * as THREE from 'three';
import { assetUrl } from '../assetUrl';

const NAMES = ['grass', 'sand', 'dirt', 'cobble', 'rock'] as const;
// t50 warzone set (Poly Haven CC0): burned_ground_01, dry_ground_01 (cracked), brown_mud — swapped into the same slots
const WAR: Record<string, string> = { grass: 'burned', sand: 'dryground', dirt: 'burned', cobble: 'mud', rock: 'rock' };
// linear-space means of each texture (precomputed) -> detail = texel / mean keeps the painted colour on average
const MEAN: Record<string, [number, number, number]> = {
  grass: [0.3187, 0.236, 0.1057], sand: [0.2268, 0.1742, 0.1096], dirt: [0.1255, 0.0859, 0.049], cobble: [0.3016, 0.276, 0.2305], rock: [0.1719, 0.1232, 0.0515],
  burned: [0.1567, 0.1166, 0.0834], mud: [0.1152, 0.0963, 0.074], dryground: [0.2392, 0.2004, 0.1477],
};
let cache: Record<string, THREE.Texture> | null = null;
export const groundTime = { value: 0 };
/** 2026-11-25 wet shore: shared uniforms for the wet band / spray-soaked rock on detailGround(.., { wet: true }) meshes.
 *  Per-vertex aWet = (metres to open water, spray exposure 0..1) is baked by bakeWet() from the Ocean's shore grids. */
export const WET = {
  on: { value: 1 }, sea: { value: 0 }, time: { value: 0 }, reach: { value: 6 }, bandH: { value: 0.8 }, sprayH: { value: 5 }, algae: { value: 0 },
  sun: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color(0xffe6c4) }, sky: { value: new THREE.Color(0xdde4df) }, gloss: { value: 1 },
};

function load(war = false): Record<string, THREE.Texture> {
  if (cache && (!war || cache.burned)) return cache;
  const L = new THREE.TextureLoader(), out: Record<string, THREE.Texture> = cache ?? {};
  for (const n of [...NAMES, 'water_n', ...(war ? ['burned', 'mud', 'dryground'] : [])]) {
    if (out[n]) continue;
    const t = L.load(assetUrl(`assets/tex/${n}.webp`));
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
    if (n !== 'water_n') t.colorSpace = THREE.SRGBColorSpace;
    out[n] = t;
  }
  return (cache = out);
}

export function waterNormal(): THREE.Texture { return load().water_n; }

/** Patch a Lambert ground material with splat-classified detail. opts.stone boosts grey→cobble (El Morro); opts.slope adds rock on steep terrain. */
export function detailGround(mat: THREE.MeshLambertMaterial, opts: { stone?: number; slope?: boolean; war?: boolean; wet?: boolean } = {}) {
  const tx = load(!!opts.war);
  mat.userData.detail = true; if (opts.wet) mat.userData.wet = true;
  mat.onBeforeCompile = (sh) => {
    for (const n of NAMES) { const src = opts.war ? WAR[n] : n; sh.uniforms['t_' + n] = { value: tx[src] }; sh.uniforms['m_' + n] = { value: new THREE.Vector3(...MEAN[src]) }; }
    sh.uniforms.t_wn = { value: tx.water_n }; sh.uniforms.uTime = groundTime; sh.uniforms.uStone = { value: opts.stone ?? 0.6 };
    if (opts.wet) {
      Object.assign(sh.uniforms, { uWetOn: WET.on, uSea: WET.sea, uWetT: WET.time, uWetReach: WET.reach, uWetBand: WET.bandH, uWetSpray: WET.sprayH, uWetAlgae: WET.algae, uWetSun: WET.sun, uWetSunCol: WET.sunCol, uWetSky: WET.sky, uWetGloss: WET.gloss });
      sh.defines = { ...(sh.defines ?? {}), GWET: 1 };
    }
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGW; varying float vGNy;' + (opts.wet ? '\nattribute vec2 aWet; varying vec2 vWet;' : ''))
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGW = (modelMatrix * vec4(transformed, 1.0)).xyz; vGNy = normalize(mat3(modelMatrix) * objectNormal).y;' + (opts.wet ? ' vWet = aWet;' : ''));
    const decl = NAMES.map(n => `uniform sampler2D t_${n}; uniform vec3 m_${n};`).join('\n');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vGW; varying float vGNy; ${decl}\nuniform sampler2D t_wn; uniform float uTime; uniform float uStone;
#ifdef GWET
varying vec2 vWet; uniform float uWetOn, uSea, uWetT, uWetReach, uWetBand, uWetSpray, uWetAlgae, uWetGloss; uniform vec3 uWetSun, uWetSunCol, uWetSky;
#endif
vec3 gdet(sampler2D t, vec3 m, vec2 uv) { vec3 c = texture2D(t, uv).rgb; vec3 r = c / m; float l = dot(c, vec3(.2126,.7152,.0722)) / dot(m, vec3(.2126,.7152,.0722)); return clamp(mix(vec3(l), r, 0.35), 0.25, 2.2); }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
{
  vec3 s = sqrt(max(diffuseColor.rgb, 0.0));
  float mx = max(s.r, max(s.g, s.b)), mn = min(s.r, min(s.g, s.b)), sat = (mx - mn) / (mx + 1e-3);
  float wG = smoothstep(0.0, 0.05, s.g - s.r) * smoothstep(-0.02, 0.05, s.g - s.b);
  float wW = smoothstep(0.02, 0.10, s.b - max(s.r, s.g) + 0.04) * (1.0 - wG);
  float wS = (1.0 - smoothstep(0.10, 0.24, sat)) * uStone * (1.0 - wW);
  float warm = (1.0 - wG) * (1.0 - wW) * (1.0 - wS);
  float bright = smoothstep(0.55, 0.72, mx);
  float wSa = warm * bright, wD = warm * (1.0 - bright);
  float wR = ${opts.slope ? 'smoothstep(0.86, 0.62, vGNy) * (1.0 - wW)' : '0.0'};
  vec2 uv = vGW.xz;
  vec3 det = (gdet(t_grass, m_grass, uv / 2.6) * wG + gdet(t_sand, m_sand, uv / 3.2) * wSa + gdet(t_dirt, m_dirt, uv / 2.8) * wD
            + gdet(t_cobble, m_cobble, uv / 2.4) * wS) / max(wG + wSa + wD + wS, 1e-3);
  det = mix(det, gdet(t_rock, m_rock, uv / 4.0), wR);
  vec2 wn = texture2D(t_wn, uv / 7.0 + vec2(uTime * 0.018, uTime * 0.011)).xy * 2.0 - 1.0;
  det = mix(det, vec3(1.0 + 0.22 * (wn.x + wn.y)), wW);
  diffuseColor.rgb *= mix(vec3(1.0), det, 0.9);
}
#ifdef GWET
{
  // 2026-11-25 wet shore: the swash band above the waterline and the cliff faces the spray soaks are darker,
  // more saturated and glossy (sun glint + sky sheen); El Morro's wave-washed foot gets a dark algae film.
  float hS = vGW.y - uSea;
  vec2 wq = texture2D(t_wn, vGW.xz / 3.3 + vec2(0.0, vGW.y * 0.21)).xy; float nzw = 0.5 + 0.9 * (wq.x - 0.5) + 0.6 * (wq.y - 0.5);
  float near = 1.0 - smoothstep(uWetReach * 0.45, uWetReach, vWet.x + nzw * 1.6);
  float swash = 0.5 + 0.5 * sin(uWetT * 0.75 + nzw * 5.0);
  float band = near * (1.0 - smoothstep(uWetBand * 0.55, uWetBand * (0.85 + 0.45 * nzw) + 0.12 * swash, hS));
  float streak = 0.75 + 0.5 * nzw;  // drip streaks: uneven top edge of the soaked rock
  float spr = vWet.y * (1.0 - smoothstep(uWetSpray * 0.3, uWetSpray * streak, hS)) * smoothstep(-1.2, -0.2, hS);
  float wet = clamp(max(band, smoothstep(0.05, 0.6, spr)), 0.0, 1.0) * uWetOn;
  if (wet > 0.002) {
    float lw = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3 wc = mix(vec3(lw), diffuseColor.rgb, 1.3) * 0.46;
    float alg = uWetAlgae * near * (1.0 - smoothstep(0.15, 0.55 + 0.35 * nzw, hS)) * smoothstep(-1.5, -0.4, hS);
    wc = mix(wc, vec3(0.045, 0.05, 0.032), alg * 0.7);
    diffuseColor.rgb = mix(diffuseColor.rgb, max(wc, 0.0), wet);
    vec3 fn = normalize(cross(dFdx(vGW), dFdy(vGW))); fn *= sign(fn.y + 1e-4);
    vec3 V = normalize(cameraPosition - vGW), R = reflect(-V, fn);
    float fresh = near * (1.0 - smoothstep(0.0, 0.28 + 0.3 * swash, hS)); // the strip the last wave just ran up glistens most
    float gl = wet * uWetGloss * (0.55 + 0.45 * fresh) * (0.6 + 0.4 * nzw) * smoothstep(-0.2, 0.05, hS); // under the water the sea surface does the reflecting
    totalEmissiveRadiance += gl * (uWetSunCol * pow(max(dot(R, uWetSun), 0.0), 48.0) * 0.55 + uWetSky * pow(1.0 - max(dot(fn, V), 0.0), 4.0) * 0.1);
  }
}
#endif`);
  };
  mat.customProgramCacheKey = () => 'gdet' + (opts.slope ? 's' : '') + (opts.war ? 'w' : '') + (opts.wet ? 'W' : '') + (opts.stone ?? 0.6);
  mat.needsUpdate = true;
  return mat;
}
export function groundTex(n: string): THREE.Texture { return load()[n]; }
