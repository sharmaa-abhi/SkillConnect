import assert from 'node:assert/strict';
import { generateCostEstimate } from '../src/lib/ai-estimator';
import { calculateFees } from '../src/lib/pricing';

console.log('--- RUNNING ESTIMATOR TESTS ---');

// Test 1: Supported category (Plumbing: "leaky pipe repair under bathroom sink")
const plumbingEstimate = generateCostEstimate({
  problemDescription: 'leaky pipe repair under bathroom sink',
  urgency: 'flexible',
  propertyType: 'house',
});
assert.equal(plumbingEstimate.status, 'success');
assert.equal(plumbingEstimate.categorySlug, 'plumbing');
assert(plumbingEstimate.totalEstimateMin > 0);
assert(plumbingEstimate.totalEstimateMax >= plumbingEstimate.totalEstimateMin);
assert(plumbingEstimate.diagnosticFeeCredit > 0);
console.log(`✓ Supported plumbing query returns valid ready estimate ($${plumbingEstimate.totalEstimateMin}-$${plumbingEstimate.totalEstimateMax})`);

// Test 2: Babysitter must NEVER receive Plumbing estimate!
const babysitterEstimate = generateCostEstimate({
  problemDescription: 'I need a babysitter for Friday evening with infant experience',
  urgency: 'flexible',
  propertyType: 'house',
});
assert.equal(babysitterEstimate.status, 'unsupported');
assert.notEqual(babysitterEstimate.categorySlug, 'plumbing', 'CRITICAL: Babysitter must never default to plumbing!');
assert.equal(babysitterEstimate.statusMessage, "We can't estimate this service yet.");
console.log('✓ Babysitter query returns status="unsupported" ("We can\'t estimate this service yet.")');

// Test 3: Ambiguous query matching multiple trades requests clarification
const ambiguousEstimate = generateCostEstimate({
  problemDescription: 'pipe leak and circuit breaker sparking in the garage',
  urgency: 'flexible',
  propertyType: 'house',
});
assert.equal(ambiguousEstimate.status, 'ambiguous');
console.log('✓ Multi-trade ambiguous query returns status="ambiguous" requesting trade clarification');

// Test 4: Completely unknown service with no trade match shows unsupported notice
const unknownEstimate = generateCostEstimate({
  problemDescription: 'random unknown mechanical buzzing in the wall space',
  urgency: 'flexible',
  propertyType: 'house',
});
assert.equal(unknownEstimate.status, 'unsupported');
assert.equal(unknownEstimate.statusMessage, "We can't estimate this service yet.");
console.log('✓ Unrecognized service returns status="unsupported" ("We can\'t estimate this service yet.")');

// Test 5: Missing or empty query handles gracefully
const emptyEstimate = generateCostEstimate({
  problemDescription: '   ',
  urgency: 'flexible',
  propertyType: 'house',
});
assert.equal(emptyEstimate.status, 'invalid_input');
console.log('✓ Missing/empty query returns status="invalid_input"');

// Test 6: Centralized fee calculation test
const fees = calculateFees({
  laborMin: 120,
  laborMax: 200,
  diagnosticFee: 65,
  creditDiagnostic: true,
  partsMin: 40,
  partsMax: 80,
});
// Labor min + parts min = 160. Tax on parts (8.75% of 40) = 3.50. Total min = 163.50
assert.equal(fees.totalMin, 163.50);
// Labor max + parts max = 280. Tax on parts (8.75% of 80) = 7.00. Total max = 287.00
assert.equal(fees.totalMax, 287.00);
assert.equal(fees.diagnosticCreditApplied, 65);
console.log('✓ Centralized calculateFees applies standard tax rates, parts tax, and diagnostic credits correctly');

console.log('ALL ESTIMATOR TESTS PASSED!\n');
