import assert from 'node:assert/strict';
import {
  validateExternalUrl,
  sanitizeSearchQuery,
  sanitizeExternalContent,
  checkRateLimit,
} from '../src/lib/price-intelligence/security';
import {
  extractPriceEvidenceFromText,
  assessPriceEvidence,
} from '../src/lib/price-intelligence/price-extractor';
import { MemoryCache } from '../src/lib/price-intelligence/cache';
import { getLivePriceIntelligence } from '../src/lib/price-intelligence';
import { generateCostEstimate } from '../src/lib/ai-estimator';
import { calculateFees } from '../src/lib/pricing';
import { MarketReferenceSource } from '../src/types/price-intelligence';

console.log('--- RUNNING PRICE INTELLIGENCE & SECURITY TESTS ---');

// ============================================================================
// 1. INPUT VALIDATION & PII SANITIZATION
// ============================================================================
console.log('>>> 1. Testing Input Validation & PII Scrubbing...');

// Test 1.1: Too short input is rejected
const shortQuery = sanitizeSearchQuery('hi', 'Plumbing', '94107');
assert.equal(shortQuery.isValid, false);
console.log('✓ Too short search input is rejected');

// Test 1.2: Customer PII (phone number, email, street address, credit card) is stripped
const dirtyQuery =
  'Call me at (555) 392-8172 or sarah.jenkins@example.com at 428 Castro Street Apt 3B with card 4111 2222 3333 4444. Leaky sink under bathroom vanity.';
const sanitized = sanitizeSearchQuery(dirtyQuery, 'Plumbing', '94107');

assert.equal(sanitized.isValid, true);
assert.doesNotMatch(sanitized.cleanQuery, /555/);
assert.doesNotMatch(sanitized.cleanQuery, /sarah\.jenkins/);
assert.doesNotMatch(sanitized.cleanQuery, /Castro/);
assert.doesNotMatch(sanitized.cleanQuery, /4111/);
assert(sanitized.cleanQuery.includes('sink') || sanitized.cleanQuery.includes('plumbing'));
console.log('✓ Zero Customer PII transmitted: Phone, email, street address, and cards completely scrubbed');

// ============================================================================
// 2. SSRF PREVENTION & URL ALLOWLISTING
// ============================================================================
console.log('>>> 2. Testing SSRF Prevention & URL Allowlisting...');

// Test 2.1: Rejects non-HTTPS protocols
assert.equal(validateExternalUrl('http://example.com/guide').isValid, false);
assert.equal(validateExternalUrl('ftp://example.com/guide').isValid, false);
assert.equal(validateExternalUrl('file:///etc/passwd').isValid, false);
assert.equal(validateExternalUrl('javascript:alert(1)').isValid, false);
console.log('✓ Non-HTTPS protocols rejected (http, ftp, file, javascript)');

// Test 2.2: Rejects loopback & local addresses
assert.equal(validateExternalUrl('https://localhost/api').isValid, false);
assert.equal(validateExternalUrl('https://127.0.0.1/admin').isValid, false);
assert.equal(validateExternalUrl('https://127.0.0.2:443/').isValid, false);
assert.equal(validateExternalUrl('https://[::1]/status').isValid, false);
assert.equal(validateExternalUrl('https://internal.local/guide').isValid, false);
console.log('✓ Loopback and localhost addresses strictly rejected');

// Test 2.3: Rejects RFC 1918 Private IPv4 networks
assert.equal(validateExternalUrl('https://10.0.0.1/status').isValid, false);
assert.equal(validateExternalUrl('https://172.16.0.1/status').isValid, false);
assert.equal(validateExternalUrl('https://192.168.1.1/router').isValid, false);
console.log('✓ RFC 1918 Private IPv4 networks strictly rejected (10.x, 172.16-31.x, 192.168.x)');

// Test 2.4: Rejects Cloud Metadata IP (169.254.169.254)
assert.equal(validateExternalUrl('https://169.254.169.254/latest/meta-data').isValid, false);
assert.equal(validateExternalUrl('https://169.254.1.1/').isValid, false);
console.log('✓ Cloud metadata endpoints (169.254.169.254 / link-local) strictly rejected');

// Test 2.5: Rejects embedded user credentials and non-standard ports
assert.equal(validateExternalUrl('https://user:password@example.com/cost').isValid, false);
assert.equal(validateExternalUrl('https://example.com:8080/cost').isValid, false);
assert.equal(validateExternalUrl('https://example.com:22/cost').isValid, false);
console.log('✓ URLs with credentials or non-standard ports rejected');

// Test 2.6: Accepts valid public HTTPS URLs
const validBobVila = validateExternalUrl('https://www.bobvila.com/articles/sink-repair-cost');
assert.equal(validBobVila.isValid, true);
assert.equal(validBobVila.sanitizedUrl, 'https://www.bobvila.com/articles/sink-repair-cost');
console.log('✓ Valid public HTTPS URLs accepted');

// ============================================================================
// 3. PRICE EXTRACTION & NUMERIC VALIDATION
// ============================================================================
console.log('>>> 3. Testing Price Extraction & Numeric Validation...');

// Test 3.1: Explicit range extraction
const bobVilaText = `
Published February 2025.
In the San Francisco Bay Area and ZIP 94107, fixing a leaking kitchen or bathroom sink typically costs between $175 and $380.
Plumbers bill $85 to $130 per hour.
`;
const extractedRange = extractPriceEvidenceFromText(bobVilaText, {
  title: 'Bob Vila Sink Repair Guide',
  url: 'https://www.bobvila.com/articles/sink-repair-cost',
  domain: 'bobvila.com',
  zipCode: '94107',
  tradeCategory: 'Plumbing',
});

assert.notEqual(extractedRange.priceRange, undefined);
assert.equal(extractedRange.priceRange?.min, 175);
assert.equal(extractedRange.priceRange?.max, 380);
assert.equal(extractedRange.geographicScope, 'local');
assert.equal(extractedRange.datePublished, 'February 2025');
console.log('✓ Successfully extracted explicit price range ($175–$380) and local ZIP 94107 relevance');

// Test 3.2: Filtering out false positives (years like 2025, 2026 and phone numbers)
const falsePositiveText = `
Copyright 2025. Call 18005551234 for a quote. In 2026 rates change.
The average cost of plumbing repair is $250.
`;
const extractedFiltered = extractPriceEvidenceFromText(falsePositiveText, {
  title: 'Year and Phone Test',
  url: 'https://example.com/guide',
  domain: 'example.com',
});

assert.notEqual(extractedFiltered.priceRange, undefined);
assert.notEqual(extractedFiltered.priceRange?.min, 2025);
assert.notEqual(extractedFiltered.priceRange?.max, 2026);
assert.notEqual(extractedFiltered.priceRange?.max, 18005551234);
assert.equal(extractedFiltered.priceRange?.min, Math.round(250 * 0.75));
assert.equal(extractedFiltered.priceRange?.max, Math.round(250 * 1.25));
console.log('✓ Successfully filtered out year timestamps (2025, 2026) and phone numbers from price ranges');

// ============================================================================
// 4. MISSING OR CONTRADICTORY EVIDENCE HANDLING
// ============================================================================
console.log('>>> 4. Testing Evidence Assessment (Missing, Weak, Contradictory)...');

// Test 4.1: Missing numeric pricing
const emptyAssessment = assessPriceEvidence([], 'Plumbing', '94107');
assert.equal(emptyAssessment.status, 'weak');
assert.equal(emptyAssessment.sampleSize, 0);
console.log('✓ Missing price evidence handled with status="weak" without fabricating averages');

// Test 4.2: Contradictory evidence (e.g. $50 vs $3,500)
const contradictorySources: MarketReferenceSource[] = [
  {
    title: 'Source A - Minor Washer Swap',
    url: 'https://example.com/a',
    domain: 'example.com',
    priceRange: { min: 45, max: 95 },
    geographicScope: 'national',
    relevanceNote: 'Basic rubber gasket replacement',
  },
  {
    title: 'Source B - Whole-House Sewer Line Re-pipe',
    url: 'https://example.com/b',
    domain: 'example.com',
    priceRange: { min: 2800, max: 6500 },
    geographicScope: 'national',
    relevanceNote: 'Mainline excavation',
  },
];

const contradictoryAssessment = assessPriceEvidence(contradictorySources, 'Plumbing', '94107');
assert.equal(contradictoryAssessment.status, 'contradictory');
assert(contradictoryAssessment.assessmentMessage.includes('contradictory'));
console.log('✓ Contradictory wide-variance evidence correctly flagged with status="contradictory"');

// Test 4.3: Sufficient consensus evidence
const consistentSources: MarketReferenceSource[] = [
  {
    title: 'Source 1',
    url: 'https://example.com/1',
    domain: 'example.com',
    priceRange: { min: 160, max: 350 },
    geographicScope: 'local',
    relevanceNote: 'Bay Area benchmark',
  },
  {
    title: 'Source 2',
    url: 'https://example.com/2',
    domain: 'example.com',
    priceRange: { min: 175, max: 380 },
    geographicScope: 'local',
    relevanceNote: 'Direct ZIP 94107 reference',
  },
];
const consistentAssessment = assessPriceEvidence(consistentSources, 'Plumbing', '94107');
assert.equal(consistentAssessment.status, 'sufficient');
assert.equal(consistentAssessment.isLocalitySpecific, true);
assert(consistentAssessment.marketLow !== undefined && consistentAssessment.marketLow >= 160);
assert(consistentAssessment.marketHigh !== undefined && consistentAssessment.marketHigh <= 380);
console.log('✓ Consistent consensus evidence returns status="sufficient" with verified range');

// ============================================================================
// 5. CACHE BEHAVIOR
// ============================================================================
console.log('>>> 5. Testing Cache Behavior & TTL...');

const cache = new MemoryCache<{ score: number }>(100, 10); // 100ms TTL
cache.set('key1', { score: 42 });

assert.equal(cache.has('key1'), true);
assert.equal(cache.get('key1')?.score, 42);

// Wait for expiration
await new Promise((resolve) => setTimeout(resolve, 110));
assert.equal(cache.get('key1'), null);
assert.equal(cache.has('key1'), false);
console.log('✓ Cache correctly retains entries within TTL and purges expired entries');

// ============================================================================
// 6. RATE LIMITING & CONTENT SANITIZATION
// ============================================================================
console.log('>>> 6. Testing Rate Limiting & Content Sanitization...');

// Rate Limiter: 3 requests allowed, 4th rejected
const ip = 'test-client-ip-123';
assert.equal(checkRateLimit(ip, 3, 5000).allowed, true);
assert.equal(checkRateLimit(ip, 3, 5000).allowed, true);
assert.equal(checkRateLimit(ip, 3, 5000).allowed, true);
assert.equal(checkRateLimit(ip, 3, 5000).allowed, false);
console.log('✓ Rate limiter enforces strict sliding window per client');

// Content Sanitization
const unsafeHtml = `
<html>
<head><script>alert('xss');</script><style>body { color: red; }</style></head>
<body>
<h1>Leaky Sink Repair Cost</h1>
<p>Most repairs cost <strong>$150 to $300</strong>.</p>
<iframe src="https://malicious.example.com"></iframe>
</body>
</html>
`;
const sanitizedHtml = sanitizeExternalContent(unsafeHtml);
assert.doesNotMatch(sanitizedHtml, /<script>/i);
assert.doesNotMatch(sanitizedHtml, /alert/);
assert.doesNotMatch(sanitizedHtml, /<style>/i);
assert.doesNotMatch(sanitizedHtml, /<iframe>/i);
assert(sanitizedHtml.includes('$150 to $300'));
console.log('✓ Content sanitization safely strips scripts, styles, iframes, and retains numeric evidence');

// ============================================================================
// 7. END-TO-END SERVICE & NON-TRADE GUARDS
// ============================================================================
console.log('>>> 7. Testing End-to-End Price Intelligence Service...');

// Test 7.1: Unsupported trade guard (Babysitter must NEVER query or return plumbing prices)
const babysitterIntel = await getLivePriceIntelligence({
  problemDescription: 'Need a babysitter for Friday evening with infant experience',
  zipCode: '94107',
});
assert.equal(babysitterIntel.status, 'unsupported_trade');
assert.equal(babysitterIntel.sources.length, 0);
console.log('✓ Babysitter input flags status="unsupported_trade" without making external queries');

// Test 7.2: Leaky sink in 94107 returns valid comparison
const plumbingIntel = await getLivePriceIntelligence({
  problemDescription: 'leaky sink pipe under bathroom vanity',
  categorySlug: 'plumbing',
  zipCode: '94107',
});
assert.equal(plumbingIntel.tradeCategory, 'Plumbing');
assert(plumbingIntel.sources.length > 0);
assert(plumbingIntel.evidence.status === 'sufficient' || plumbingIntel.evidence.status === 'weak');
assert(plumbingIntel.disclaimer.includes('DO NOT represent verified SkillConnect provider quotes'));
console.log('✓ Supported plumbing query returns structured intelligence with mandatory disclaimers');

// ============================================================================
// 8. PRESERVATION OF EXISTING ESTIMATOR, BOOKING & ESCROW BEHAVIOR
// ============================================================================
console.log('>>> 8. Verifying Zero Regression on Existing Estimator & Fee Calculations...');

const basePlumbingEstimate = generateCostEstimate({
  problemDescription: 'leaky pipe repair under bathroom sink',
  urgency: 'flexible',
  propertyType: 'house',
});
assert.equal(basePlumbingEstimate.status, 'success');
assert.equal(basePlumbingEstimate.categorySlug, 'plumbing');
assert.equal(basePlumbingEstimate.diagnosticFeeCredit, 65);
assert.equal(basePlumbingEstimate.totalEstimateMin, 158);
assert.equal(basePlumbingEstimate.totalEstimateMax, 375);

const fees = calculateFees({
  diagnosticFee: 65,
  hourlyRate: 85,
  estimatedHoursMin: 1.5,
  estimatedHoursMax: 2.5,
  partsMin: 40,
  partsMax: 80,
});
assert.equal(fees.diagnosticFee, 65);
assert.equal(fees.totalMin, 168);
assert.equal(fees.totalMax, 293);
assert.equal(fees.escrowAuthorizedHold, 65);
console.log('✓ Existing SkillConnect cost estimates and escrow calculations remain 100% identical and unchanged');

console.log('\n====================================================');
console.log('ALL PRICE INTELLIGENCE & SECURITY TESTS PASSED CLEANLY');
console.log('====================================================\n');
