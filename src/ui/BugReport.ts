// 🐞 Bug report: form + auto context (build, map, wave, mode, FPS, UA, screen, recent console
// errors/warnings, game event log, optional canvas screenshot). Delivered by JSON POST to
// REPORT_ENDPOINT (FormSubmit). If unset or the POST fails, the report is queued in localStorage
// (retried on next load) and a Copy-report button + prefilled GitHub issue link are offered.
import { REPORT_COOLDOWN_S, REPORT_ENDPOINT, REPORT_REPO_ISSUES, REPORT_SHOT_MAX } from '../config/report';

declare const __BUILD__: string;
export const BUILD = typeof __BUILD__ === 'string' ? __BUILD__ : 'dev';
export type ReportCategory = 'bug' | 'balance' | 'idea';
export interface Report {
  id: string; at: string; category: ReportCategory; description: string; build: string;
  context: Record<string, unknown>; console: string[]; events: string[]; screenshot?: string;
}
export interface ReportContext { map?: string; difficulty?: string; wave?: number | string; mode?: string; fps?: number; canvas?: HTMLCanvasElement | null; [k: string]: unknown }

const QKEY = 'bof.reportQueue', LASTKEY = 'bof.reportLast', RING = 50;
const consoleRing: string[] = [], eventRing: string[] = [];
let installed = false;
const stamp = () => new Date().toISOString().slice(11, 19);
function push(ring: string[], s: string) { ring.push(s.length > 400 ? s.slice(0, 400) + '…' : s); while (ring.length > RING) ring.shift(); }
const fmt = (a: unknown[]) => a.map((x) => { if (x instanceof Error) return `${x.name}: ${x.message}`; if (typeof x === 'string') return x; try { return JSON.stringify(x); } catch { return String(x); } }).join(' ');

/** Capture console errors/warnings + uncaught errors into a ring buffer (call once, early). */
export function installConsoleCapture() {
  if (installed) return; installed = true;
  for (const lvl of ['error', 'warn'] as const) {
    const orig = console[lvl].bind(console);
    console[lvl] = (...a: unknown[]) => { push(consoleRing, `${stamp()} ${lvl.toUpperCase()} ${fmt(a)}`); orig(...a); };
  }
  window.addEventListener('error', (e) => push(consoleRing, `${stamp()} UNCAUGHT ${e.message} @ ${(e.filename || '').split('/').pop()}:${e.lineno}`));
  window.addEventListener('unhandledrejection', (e) => push(consoleRing, `${stamp()} REJECTION ${fmt([e.reason])}`));
}
/** Game event log (waves, HQ hits, bosses, game over…). */
export function logEvent(s: string) { push(eventRing, `${stamp()} ${s}`); }

let ctxFn: () => ReportContext = () => ({ screen: 'menu' });
export function setReportContext(fn: () => ReportContext) { ctxFn = fn; }

function lsGet<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : d; } catch { return d; } }
function lsSet(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota: drop screenshots */ } }
export function queued(): Report[] { return lsGet<Report[]>(QKEY, []); }
function setQueue(q: Report[]) { const s = q.slice(-10); try { localStorage.setItem(QKEY, JSON.stringify(s)); } catch { try { localStorage.setItem(QKEY, JSON.stringify(s.map((r) => ({ ...r, screenshot: undefined })))); } catch { /* */ } } }

/** Downscaled JPEG of the game canvas (≤ REPORT_SHOT_MAX chars), or undefined. */
export function snapshot(src?: HTMLCanvasElement | null): string | undefined {
  if (!src || !src.width) return;
  try {
    for (const [w, q] of [[640, 0.62], [480, 0.55], [360, 0.5]] as const) {
      const s = Math.min(1, w / src.width), c = document.createElement('canvas');
      c.width = Math.round(src.width * s); c.height = Math.round(src.height * s);
      c.getContext('2d')!.drawImage(src, 0, 0, c.width, c.height);
      const d = c.toDataURL('image/jpeg', q);
      if (d.length <= REPORT_SHOT_MAX) return d;
    }
  } catch { /* tainted canvas */ }
  return;
}

export function buildReport(category: ReportCategory, description: string, withShot: boolean): Report {
  const { canvas, ...ctx } = ctxFn();
  return {
    id: Math.random().toString(36).slice(2, 10), at: new Date().toISOString(), category, description: description.trim(), build: BUILD,
    context: { ...ctx, url: location.href, ua: navigator.userAgent, screen: `${screen.width}x${screen.height}`, viewport: `${innerWidth}x${innerHeight}`, dpr: devicePixelRatio, lang: navigator.language, touch: 'ontouchstart' in window },
    console: [...consoleRing], events: [...eventRing], screenshot: withShot ? snapshot(canvas) : undefined,
  };
}
export function reportText(r: Report, maxList = RING) {
  const c = Object.entries(r.context).map(([k, v]) => `- ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n');
  return `**${r.category.toUpperCase()}** · build ${r.build} · ${r.at}\n\n${r.description || '(no description)'}\n\n### Context\n${c}\n\nA save-state snapshot and the PNG are in the files downloaded by the game (drag the PNG into this issue).\n\n### Console (last ${Math.min(maxList, r.console.length)})\n${r.console.slice(-maxList).join('\n') || '(none)'}\n\n### Game events\n${r.events.slice(-maxList).join('\n') || '(none)'}\n`;
}
export const subjectOf = (r: Report) => `[BotF bug] ${r.category} - ${(r.description || '(no description)').replace(/\s+/g, ' ').slice(0, 60)}`;
/** Prefilled GitHub new-issue link, body trimmed to keep the URL under ~7 KB. */
export function issueUrl(r: Report) {
  const title = subjectOf(r).replace('[BotF bug] ', '');
  for (const n of [50, 20, 8, 3, 0]) {
    const u = `${REPORT_REPO_ISSUES}?labels=bug,beta&title=${encodeURIComponent(title)}&body=${encodeURIComponent(reportText(r, n))}`;
    if (u.length < 7000) return u;
  }
  return `${REPORT_REPO_ISSUES}?labels=bug,beta&title=${encodeURIComponent(title)}&body=${encodeURIComponent(r.description.slice(0, 2000))}`;
}

/** Test seam: replace the network call. */
export const transport = {
  endpoint: REPORT_ENDPOINT,
  async send(r: Report): Promise<boolean> {
    if (!this.endpoint) return false;
    const body: Record<string, unknown> = {
      _subject: subjectOf(r), _template: 'box', _captcha: 'false',
      category: r.category, description: r.description || '(none)', build: r.build, time: r.at, report_id: r.id,
      context: Object.entries(r.context).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n'),
      console: r.console.join('\n') || '(none)', events: r.events.join('\n') || '(none)',
    };
    if (r.screenshot) body.screenshot = r.screenshot;
    try {
      const res = await fetch(this.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) return false;
      const j = await res.json().catch(() => ({})) as { success?: string | boolean };
      return j.success !== false && j.success !== 'false';
    } catch { return false; }
  },
};

export function cooldownLeft() { return Math.max(0, REPORT_COOLDOWN_S - (Date.now() - lsGet<number>(LASTKEY, 0)) / 1000); }
/** Submit: rate-limited; on failure queue it. Returns 'sent' | 'queued' | 'limited'. */
export async function submit(r: Report): Promise<'sent' | 'queued' | 'limited'> {
  if (cooldownLeft() > 0) return 'limited';
  lsSet(LASTKEY, Date.now());
  if (await transport.send(r)) return 'sent';
  setQueue([...queued(), r]);
  return 'queued';
}
/** Retry queued reports (on load). */
export async function flushQueue(): Promise<number> {
  const q = queued(); if (!q.length || !transport.endpoint) return 0;
  const left: Report[] = []; let sent = 0;
  for (const r of q) { if (await transport.send(r)) sent++; else left.push(r); }
  setQueue(left);
  return sent;
}

// ------------------------------------------------------------------ hooks (pause / save-state)
export interface ReportHooks { pause?: () => (() => void) | void; save?: () => unknown }
let hooks: ReportHooks = {};
export function setReportHooks(h: ReportHooks) { hooks = h; }
const ES = /^es/i.test(navigator.language || '');
const T = (en: string, es: string) => (ES ? `${es} · ${en}` : `${en} · ${es}`);

/** The canvas the player is looking at: the first-person WebGL canvas if open, else the 2D map. */
function viewCanvas(fallback?: HTMLCanvasElement | null): HTMLCanvasElement | null {
  return document.querySelector<HTMLCanvasElement>('#possess-root > canvas') ?? fallback ?? document.querySelector<HTMLCanvasElement>('canvas');
}
/** Full-quality PNG of what the player sees (≤1600 px wide). */
export function capturePng(): string {
  const src = viewCanvas(ctxFn().canvas);
  if (!src || !src.width) return '';
  try {
    const s = Math.min(1, 1600 / src.width), c = document.createElement('canvas');
    c.width = Math.round(src.width * s); c.height = Math.round(src.height * s);
    c.getContext('2d')!.drawImage(src, 0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  } catch { return ''; }
}
function compactSave(): unknown {
  try { const v = hooks.save?.(); if (!v) return undefined; const j = JSON.stringify(v); return j.length > 20000 ? { truncated: true, size: j.length, head: j.slice(0, 2000) } : v; } catch (e) { return { error: String(e) }; }
}
const stampName = () => new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
function download(name: string, href: string) {
  const a = document.createElement('a'); a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove();
}
function downloadAll(r: Report, png: string, save: unknown) {
  const base = `bof-bug-${stampName()}`;
  if (png) download(`${base}.png`, png);
  const json = JSON.stringify({ ...r, screenshot: undefined, save }, null, 1);
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  download(`${base}.json`, url); setTimeout(() => URL.revokeObjectURL(url), 5000);
  return base;
}
async function copyPng(png: string): Promise<boolean> {
  try {
    const CI = (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem;
    if (!png || !CI || !navigator.clipboard?.write) return false;
    const blob = await (await fetch(png)).blob();
    await navigator.clipboard.write([new CI({ 'image/png': blob })]); return true;
  } catch { return false; }
}
async function copyText(txt: string) {
  try { await navigator.clipboard.writeText(txt); return true; } catch {
    const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch { /* */ } ta.remove(); return ok;
  }
}

// ------------------------------------------------------------------ UI
function toast(text: string) {
  let t = document.getElementById('br-toast');
  if (!t) { t = document.createElement('div'); t.id = 'br-toast'; document.body.appendChild(t); }
  t.textContent = text; t.classList.remove('out'); t.classList.add('show');
  clearTimeout((t as unknown as { _h: number })._h);
  (t as unknown as { _h: number })._h = window.setTimeout(() => t!.classList.remove('show'), 4200);
}
let el: HTMLElement | null = null, resume: (() => void) | void = undefined;
/** Last opened report state (test seam). */
export const last: { png: string; issue: string; downloads: string[]; report?: Report } = { png: '', issue: '', downloads: [] };
export function openBugReport() {
  if (el) return;
  const png = capturePng(); // before the modal covers anything
  resume = hooks.pause?.();
  try { if (document.pointerLockElement) document.exitPointerLock(); } catch { /* */ }
  last.png = png; last.issue = ''; last.downloads = [];
  el = document.createElement('div'); el.id = 'bug-report'; el.className = 'overlay show br-overlay';
  el.innerHTML = `<div class="panel br-panel" role="dialog" aria-label="Report a bug">
    <h2>🐞 ${T('Report a bug', 'Reportar un error')}</h2>
    ${png ? `<img id="br-preview" alt="screenshot" src="${png}">` : `<p class="hint">${T('No screenshot available', 'Sin captura')}</p>`}
    <div class="br-cats">${(['bug', 'balance', 'idea'] as const).map((c, i) => `<label><input type="radio" name="br-cat" value="${c}"${i ? '' : ' checked'}> ${c === 'bug' ? '🐞 Bug' : c === 'balance' ? '⚖ Balance' : '💡 Idea'}</label>`).join('')}</div>
    <textarea id="br-desc" rows="3" maxlength="4000" placeholder="${T('What happened?', '¿Qué pasó?')}"></textarea>
    <input id="br-name" maxlength="60" placeholder="${T('Your name (optional)', 'Tu nombre (opcional)')}">
    <p class="hint br-auto">${T('Auto-attached: version, map, difficulty, wave, mode, browser, screen, FPS, recent errors, save snapshot.', 'Se adjunta solo: versión, mapa, dificultad, ola, modo, navegador, pantalla, FPS, errores recientes y partida.')} · ${BUILD}</p>
    <div class="row br-btns"><button class="btn" id="br-cancel">✕ ${ES ? 'Cerrar' : 'Close'}</button><button class="btn" id="br-copy">📋 ${ES ? 'Copiar' : 'Copy report'}</button><button class="btn" id="br-dl">⬇ ${ES ? 'Descargar' : 'Download'}</button><button class="btn go" id="br-send">🚀 ${ES ? 'Enviar' : 'Send'} (GitHub)</button></div>
    <div id="br-steps" hidden></div>
  </div>`;
  document.body.appendChild(el);
  const $ = <T extends HTMLElement>(q: string) => el!.querySelector<T>(q)!;
  el.addEventListener('pointerdown', (e) => e.stopPropagation());
  el.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') closeBugReport(); });
  el.addEventListener('keyup', (e) => e.stopPropagation());
  const make = () => {
    const cat = (el!.querySelector<HTMLInputElement>('input[name=br-cat]:checked')?.value ?? 'bug') as ReportCategory;
    const nm = $<HTMLInputElement>('#br-name').value.trim();
    const r = buildReport(cat, $<HTMLTextAreaElement>('#br-desc').value, false);
    if (nm) r.context = { reporter: nm, ...r.context };
    last.report = r; return r;
  };
  $('#br-cancel').onclick = closeBugReport;
  $('#br-copy').onclick = async () => { const r = make(); const ok = await copyText(reportText(r)); toast(ok ? T('Report copied', 'Reporte copiado') : T('Copy failed', 'No se pudo copiar')); };
  $('#br-dl').onclick = () => { const r = make(); const b = downloadAll(r, png, compactSave()); last.downloads = [b + '.png', b + '.json']; toast(T('Saved to Downloads', 'Guardado en Descargas')); };
  $('#br-send').onclick = async () => {
    const r = make(); const url = issueUrl(r); last.issue = url;
    const b = downloadAll(r, png, compactSave()); last.downloads = [b + '.png', b + '.json'];
    const imgCopied = await copyPng(png);
    void transport.send({ ...r, screenshot: snapshot(viewCanvas(null)) }).catch(() => false); // best-effort e-mail copy
    window.open(url, '_blank', 'noopener');
    const st = $('#br-steps'); st.hidden = false;
    st.innerHTML = `<p><b>1.</b> ${ES ? 'Se abrió GitHub con el reporte. Arrastra' : 'GitHub opened with the report. Drag'} <code>${b}.png</code> ${ES ? '(de Descargas) al cuadro del issue' : '(from Downloads) into the issue box'}${imgCopied ? (ES ? ' o pégala con Ctrl+V' : ' or paste it with Ctrl+V') : ''}.<br>
      <b>2.</b> ${ES ? 'Pulsa «Submit new issue». ¡Gracias!' : 'Press “Submit new issue”. Thanks!'}<br>
      <small>${ES ? 'Drag the PNG into the issue, then Submit.' : 'Arrastra el PNG al issue y pulsa Submit.'}</small></p>
      <p class="hint">${ES ? '¿No abrió?' : 'Didn’t open?'} <a id="br-issue" target="_blank" rel="noopener" href="${url}">${ES ? 'Abrir issue' : 'Open issue'}</a></p>`;
  };
  $('#br-desc').focus();
}
export function closeBugReport() { el?.remove(); el = null; const f = resume; resume = undefined; if (f) f(); }
export function bugReportOpen() { return !!el; }
// F8 anywhere (2D, first person, menus)
window.addEventListener('keydown', (e) => { if (e.key === 'F8') { e.preventDefault(); e.stopImmediatePropagation(); if (el) closeBugReport(); else openBugReport(); } }, true);
