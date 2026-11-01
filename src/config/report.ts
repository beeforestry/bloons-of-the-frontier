// Bug-report delivery. The site is static, so reports go to a pluggable HTTP endpoint.
// FormSubmit AJAX (https://formsubmit.co) e-mails each JSON POST to REPORT_EMAIL.
// If FormSubmit hands out a random alias for the form, put it in REPORT_ALIAS to hide the address.
export const REPORT_EMAIL = 'bloonsbugs@mail.grokbot.com';
export const REPORT_ALIAS = '410aa7812cb05f1aef5762ab5534ed2e';
/** Endpoint the report is POSTed to as JSON ('' = no transport: queue + copy / GitHub fallback only). */
export const REPORT_ENDPOINT = REPORT_ALIAS ? `https://formsubmit.co/ajax/${REPORT_ALIAS}` : REPORT_EMAIL ? `https://formsubmit.co/ajax/${REPORT_EMAIL}` : '';
export const REPORT_REPO_ISSUES = 'https://github.com/beeforestry/bloons-of-the-frontier/issues/new';
/** Seconds between two submitted reports. */
export const REPORT_COOLDOWN_S = 30;
/** Max screenshot data-URL length (chars) we try to send (FormSubmit rejects very large bodies). */
export const REPORT_SHOT_MAX = 300_000;
