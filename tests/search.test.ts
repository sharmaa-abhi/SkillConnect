import assert from 'node:assert/strict';
import { performSmartProSearch, validateZipCode, detectServiceCategory } from '../src/lib/search';
import { professionals } from '../src/data/professionals';

console.log('--- RUNNING SEARCH TESTS ---');

// Test 1: 'leaky sink' resolves to Plumbing
const detectLeakySink = detectServiceCategory('leaky sink');
assert.equal(detectLeakySink.categorySlug, 'plumbing');
assert.equal(detectLeakySink.isUnsupported, false);
console.log('✓ "leaky sink" resolves to Plumbing');

// Test 2: 'plumber' resolves to Plumbing
const detectPlumber = detectServiceCategory('plumber');
assert.equal(detectPlumber.categorySlug, 'plumbing');
assert.equal(detectPlumber.isUnsupported, false);
console.log('✓ "plumber" resolves to Plumbing');

// Test 3: 'blocked drain' resolves to Plumbing
const detectBlockedDrain = detectServiceCategory('blocked drain');
assert.equal(detectBlockedDrain.categorySlug, 'plumbing');
assert.equal(detectBlockedDrain.isUnsupported, false);
console.log('✓ "blocked drain" resolves to Plumbing');

// Test 4: 'I need a babysitter' is detected as unsupported childcare
const detectBabysitter = detectServiceCategory('I need a babysitter');
assert.equal(detectBabysitter.isUnsupported, true);
assert.equal(detectBabysitter.categorySlug, null);
assert.notEqual(detectBabysitter.categorySlug, 'plumbing', 'Babysitting must NEVER resolve to Plumbing');
console.log('✓ "I need a babysitter" flags as unsupported (never defaulting to Plumbing)');

// Test 5: Unknown service phrase
const detectUnknown = detectServiceCategory('quantum teleportation tuning');
assert.equal(detectUnknown.categorySlug, null);
console.log('✓ Unknown service phrase handled with null category / asks for clarification');

// Test 6: ZIP validation
assert.equal(validateZipCode('94107').isValid, true);
assert.equal(validateZipCode('9410').isValid, false);
assert.equal(validateZipCode('ABCDE').isValid, false);
assert.equal(validateZipCode('').isValid, true); // optional
console.log('✓ ZIP code format validation works correctly');

// Test 7: 'leaky sink' with ZIP '94107' returns Marcus Vance (genuine coverage)
const search94107 = performSmartProSearch(professionals, {
  query: 'leaky sink',
  location: '94107',
  category: 'all',
  minRating: null,
  availableToday: false,
  priceTier: 'all',
  verifiedOnly: false,
  sortBy: 'recommended',
});
assert.equal(search94107.diagnostics.detectedCategory?.categorySlug, 'plumbing');
assert.equal(search94107.diagnostics.searchedZip, '94107');
assert(search94107.results.length > 0, 'Should find at least 1 genuine plumber covering 94107');
const foundMarcus = search94107.results.some((p) => p.id === 'pro-marcus-vance');
assert(foundMarcus, 'Marcus Vance covers ZIP 94107');
console.log(`✓ "leaky sink" in 94107 returns genuine coverage (${search94107.results.length} pros, including Marcus Vance)`);

// Test 8: Valid service with no matching professional in non-covered ZIP
const searchRemoteZip = performSmartProSearch(professionals, {
  query: 'leaky sink',
  location: '90210', // Beverly Hills, not covered by SF pros
  category: 'all',
  minRating: null,
  availableToday: false,
  priceTier: 'all',
  verifiedOnly: false,
  sortBy: 'recommended',
});
assert.equal(searchRemoteZip.results.length, 0, 'Must show zero results without fabricating fake pros');
assert.equal(searchRemoteZip.diagnostics.emptyReason, 'no_pros_in_zip');
console.log('✓ Valid service in uncovered ZIP returns 0 results cleanly without fabricated pros');

console.log('ALL SEARCH TESTS PASSED!\n');
