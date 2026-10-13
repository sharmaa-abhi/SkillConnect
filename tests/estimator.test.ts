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
assert(plumbingEstimate.totalEstimateMin !== undefined && plumbingEstimate.totalEstimateMin > 0);
assert(
  plumbingEstimate.totalEstimateMax !== undefined &&
  plumbingEstimate.totalEstimateMin !== undefined &&
  plumbingEstimate.totalEstimateMax >= plumbingEstimate.totalEstimateMin
);
assert(plumbingEstimate.diagnosticFeeCredit !== undefined && plumbingEstimate.diagnosticFeeCredit > 0);
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
  problemDescription: 'plumbing and electrical inspection needed',
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
  diagnosticFee: 65,
  hourlyRate: 85,
  estimatedHoursMin: 1.5,
  estimatedHoursMax: 2.5,
  partsMin: 40,
  partsMax: 80,
});
assert.equal(fees.diagnosticFee, 65);
assert.equal(fees.diagnosticCredit, 65);
assert.equal(fees.laborMin, 128); // 1.5 * 85 rounded
assert.equal(fees.laborMax, 213); // 2.5 * 85 rounded
assert.equal(fees.totalMin, 168); // 128 + 40
assert.equal(fees.totalMax, 293); // 213 + 80
assert.equal(fees.escrowAuthorizedHold, 65);
console.log('✓ Centralized calculateFees applies standard rates, parts, and diagnostic credits correctly');

console.log('ALL ESTIMATOR TESTS PASSED!\n');
