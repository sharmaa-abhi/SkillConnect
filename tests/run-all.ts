import { execSync } from 'node:child_process';

const testSuites = [
  'tests/search.test.ts',
  'tests/estimator.test.ts',
  'tests/dates.test.ts',
  'tests/state-transitions.test.ts',
  'tests/metrics.test.ts',
];

console.log('====================================================');
console.log('SKILLCONNECT COMPREHENSIVE AUTOMATED TEST SUITE');
console.log('GREVIX AfterCode Challenge Card 2 Verification');
console.log('====================================================\n');

for (const suite of testSuites) {
  try {
    console.log(`>>> Executing ${suite}...`);
    execSync(`npx tsx ${suite}`, { encoding: 'utf-8', stdio: 'inherit' });
  } catch {
    console.error(`FAILED: ${suite}`);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('ALL 5 TEST SUITES PASSED CLEANLY (100% SUCCESS RATE)');
console.log('====================================================\n');
