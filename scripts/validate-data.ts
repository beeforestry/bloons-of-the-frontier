// CI gate for the upgrade rule: `npm run validate` exits 1 on any violation.
import { validateAll } from '../src/data/validate';
const issues = validateAll();
for (const i of issues) console.warn(`[upgrade-rule] ${i.owner} tier ${i.tier}: ${i.msg}`);
console.log(issues.length ? `${issues.length} issue(s) found` : 'All towers & units pass the upgrade rule (every tier strictly stronger and better-looking).');
process.exit(issues.length ? 1 : 0);
