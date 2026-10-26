// Proves the validator actually catches rule violations (run: npx tsx scripts/validate-selftest.ts).
import { validateTower } from '../src/data/validate';
import { towerById } from '../src/data/towers';
const bad = structuredClone(towerById('dart_monkey'));
bad.tiers[2].combat!.range = 100; // range drops on upgrade
bad.tiers[2].visual.level = 1;    // looks no better than tier 1
const issues = validateTower(bad);
console.log(issues.map((i) => `tier ${i.tier}: ${i.msg}`).join('\n'));
if (issues.length < 2) { console.error('validator self-test FAILED'); process.exit(1); }
console.log('validator self-test OK');
