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
  return `**${r.category.toUpperCase()}** · build ${r.build} · ${r.at}\n\n${r.description || '(no description)'}\n\n### Context\n${c}\n\n### Console (last ${Math.min(maxList, r.console.length)})\n${r.console.slice(-maxList).join('\n') || '(none)'}\n\n### Game events\n${r.events.slice(-maxList).join('\n') || '(none)'}\n`;
}
export const subjectOf = (r: Report) => `[BotF bug] ${r.category} - ${(r.description || '(no description)').replace(/\s+/g, ' ').slice(0, 60)}`;
/** Prefilled GitHub new-issue link, body trimmed to keep the URL under ~7 KB. */
export function issueUrl(r: Report) {
  const title = subjectOf(r).replace('[BotF bug] ', '');
  for (const n of [50, 20, 8, 3, 0]) {
    const u = `${REPORT_REPO_ISSUES}?labels=bug&title=${encodeURIComponent(title)}&body=${encodeURIComponent(reportText(r, n))}`;
    if (u.length < 7000) return u;
  }
  return `${REPORT_REPO_ISSUES}?labels=bug&title=${encodeURIComponent(title)}&body=${encodeURIComponent(r.description.slice(0, 2000))}`;
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

// ------------------------------------------------------------------ UI
function toast(text: string) {
  let t = document.getElementById('br-toast');
  if (!t) { t = document.createElement('div'); t.id = 'br-toast'; document.body.appendChild(t); }
  t.textContent = text; t.classList.remove('out'); t.classList.add('show');
  clearTimeout((t as unknown as { _h: number })._h);
  (t as unknown as { _h: number })._h = window.setTimeout(() => t!.classList.remove('show'), 3200);
}
let el: HTMLElement | null = null;
export function openBugReport() {
  closeBugReport();
  el = document.createElement('div'); el.id = 'bug-report'; el.className = 'overlay show br-overlay';
  el.innerHTML = `<div class="panel br-panel" role="dialog" aria-label="Report a bug">
    <h2>🐞 Report a problem</h2>
    <div class="br-cats">${(['bug', 'balance', 'idea'] as const).map((c, i) => `<label><input type="radio" name="br-cat" value="${c}"${i ? '' : ' checked'}> ${c === 'bug' ? '🐞 Bug' : c === 'balance' ? '⚖ Balance' : '💡 Idea'}</label>`).join('')}</div>
    <textarea id="br-desc" rows="5" maxlength="4000" placeholder="What happened? What did you expect? (map, tower, wave…)"></textarea>
    <label class="br-shot"><input type="checkbox" id="br-shotbox" checked> Attach a screenshot of the game</label>
    <p class="hint">Also attached automatically: build ${BUILD}, map, difficulty, wave, mode, FPS, browser, screen size, recent errors and game events.</p>
    <div class="row br-btns"><button class="btn" id="br-cancel">Cancel</button><button class="btn go" id="br-send">Send report</button></div>
    <div id="br-fallback" hidden></div>
  </div>`;
  document.body.appendChild(el);
  const $ = <T extends HTMLElement>(q: string) => el!.querySelector<T>(q)!;
  el.addEventListener('pointerdown', (e) => e.stopPropagation()); el.addEventListener('keydown', (e) => e.stopPropagation());
  $('#br-cancel').onclick = closeBugReport;
  $('#br-desc').focus();
  $('#br-send').onclick = async () => {
    const send = $<HTMLButtonElement>('#br-send');
    const cd = cooldownLeft();
    if (cd > 0) { toast(`Please wait ${Math.ceil(cd)}s before sending another report`); return; }
    const cat = (el!.querySelector<HTMLInputElement>('input[name=br-cat]:checked')?.value ?? 'bug') as ReportCategory;
    const r = buildReport(cat, $<HTMLTextAreaElement>('#br-desc').value, $<HTMLInputElement>('#br-shotbox').checked);
    send.disabled = true; send.textContent = 'Sending…';
    const res = await submit(r);
    if (res === 'sent') { toast('🙏 Thanks! Your report was sent.'); closeBugReport(); return; }
    send.textContent = 'Saved';
    showFallback(r);
  };
}
function showFallback(r: Report) {
  if (!el) return;
  const f = el.querySelector<HTMLElement>('#br-fallback')!; f.hidden = false;
  f.innerHTML = `<p>🙏 Thanks! We couldn't send it right now, so it's saved on this device and will retry next time you open the game.
    You can also copy it or open a GitHub issue:</p>
    <div class="row br-btns"><button class="btn" id="br-copy">📋 Copy report</button><a class="btn" id="br-issue" target="_blank" rel="noopener" href="${issueUrl(r)}">Open GitHub issue</a><button class="btn" id="br-done">Done</button></div>`;
  f.querySelector<HTMLElement>('#br-copy')!.onclick = async () => {
    const txt = reportText(r);
    try { await navigator.clipboard.writeText(txt); toast('Report copied'); } catch {
      const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Report copied'); } catch { /* */ } ta.remove();
    }
  };
  f.querySelector<HTMLElement>('#br-done')!.onclick = closeBugReport;
  toast('🙏 Thanks! Report saved — copy it or open an issue.');
}
export function closeBugReport() { el?.remove(); el = null; }
export function bugReportOpen() { return !!el; }
