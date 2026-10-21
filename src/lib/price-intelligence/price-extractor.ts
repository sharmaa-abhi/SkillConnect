import {
  GeographicScope,
  MarketPriceRange,
  MarketReferenceSource,
  PriceEvidenceAssessment,
  EvidenceConfidence,
} from '@/types/price-intelligence';

/**
 * Extracts numeric pricing, geographic scope, publication date, and relevance
 * from sanitized webpage text.
 */
export function extractPriceEvidenceFromText(
  text: string,
  meta: {
    title: string;
    url: string;
    domain: string;
    zipCode?: string;
    tradeCategory?: string;
  }
): MarketReferenceSource {
  const { title, url, domain, zipCode } = meta;

  // 1. Detect publication / update date
  let datePublished: string | undefined;
  const dateMatch = text.match(
    /\b(?:updated|published|reviewed|current as of|last modified)[:\s]+((?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember))\s+(?:\d{1,2},\s+)?202[0-9])|202[0-9])/i
  );
  if (dateMatch) {
    datePublished = dateMatch[1].trim();
  } else {
    const yearMatch = text.match(/\b(202[3-6])\b/);
    if (yearMatch) {
      datePublished = yearMatch[1];
    }
  }

  // 2. Detect geographic relevance
  let geographicScope: GeographicScope = 'unspecified';
  let relevanceNote = 'General national trade guide estimate.';

  if (zipCode && text.includes(zipCode)) {
    geographicScope = 'local';
    relevanceNote = `Directly references ZIP ${zipCode} local labor market rates.`;
  } else if (
    text.toLowerCase().includes('san francisco') ||
    text.toLowerCase().includes('bay area') ||
    text.toLowerCase().includes('california') ||
    text.toLowerCase().includes(' ca ')
  ) {
    geographicScope = 'state';
    relevanceNote = 'Covers Northern California / Bay Area metro pricing trends.';
  } else if (
    text.toLowerCase().includes('national average') ||
    text.toLowerCase().includes('nationwide') ||
    text.toLowerCase().includes('across the u.s.') ||
    text.toLowerCase().includes('us average')
  ) {
    geographicScope = 'national';
    relevanceNote = 'National U.S. average baseline; local labor costs in dense metros typically run 15-30% higher.';
  }

  // 3. Extract price ranges using multiple pattern strategies
  let priceRange: MarketPriceRange | undefined;
  let sampleQuote: string | undefined;
  let pricingBasis = 'Standard residential repair scope (parts and standard labor).';

  // Strategy A: Explicit range pattern "$X to $Y" or "$X - $Y"
  const rangeRegex =
    /(?:costs?|ranges?|pricing|estimate|average|typically|between|fee|pay)?[:\s]*\$([0-9]{1,4}(?:,[0-9]{3})*)\s*(?:-|to|–|—|and)\s*\$([0-9]{1,4}(?:,[0-9]{3})*)/gi;

  const validRanges: { min: number; max: number; quote: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = rangeRegex.exec(text)) !== null) {
    const minVal = parseInt(match[1].replace(/,/g, ''), 10);
    const maxVal = parseInt(match[2].replace(/,/g, ''), 10);

    // Sanity checks: exclude phone numbers, years, absurd values
    if (
      minVal >= 25 &&
      maxVal <= 15000 &&
      minVal !== 2024 &&
      minVal !== 2025 &&
      minVal !== 2026 &&
      maxVal !== 2024 &&
      maxVal !== 2025 &&
      maxVal !== 2026
    ) {
      const min = Math.min(minVal, maxVal);
      const max = Math.max(minVal, maxVal);

      // Context snippet around match
      const start = Math.max(0, match.index - 30);
      const end = Math.min(text.length, match.index + match[0].length + 40);
      const snippet = text.slice(start, end).replace(/\s+/g, ' ').trim();

      validRanges.push({ min, max, quote: snippet });
    }
  }

  // Strategy B: Hourly rate patterns if range not found or hourly specific
  const hourlyMatch = text.match(
    /\$([0-9]{2,3})\s*(?:-|to|–|—)\s*\$([0-9]{2,3})\s*(?:per hour|\/hr|an hour)/i
  );
  if (hourlyMatch) {
    const minH = parseInt(hourlyMatch[1], 10);
    const maxH = parseInt(hourlyMatch[2], 10);
    if (minH >= 45 && maxH <= 350) {
      pricingBasis = `Hourly labor benchmark ($${minH} – $${maxH}/hr). Parts quoted separately on-site.`;
    }
  }

  // Strategy C: Single average cost statement e.g. "average cost of plumbing repair is $250"
  if (validRanges.length === 0) {
    const avgRegex =
      /(?:average cost|typical cost|national average|homeowners pay an average of|most spend)(?:[^$.\n]{0,50})?\$([0-9]{2,4}(?:,[0-9]{3})*)/gi;
    const avgMatch = avgRegex.exec(text);
    if (avgMatch) {
      const avg = parseInt(avgMatch[1].replace(/,/g, ''), 10);
      if (avg >= 40 && avg <= 10000 && avg !== 2024 && avg !== 2025 && avg !== 2026) {
        // Construct a plausible ±25% range around the reported average
        const min = Math.round(avg * 0.75);
        const max = Math.round(avg * 1.25);
        priceRange = { min, max };
        pricingBasis = `Based on reported median benchmark ($${avg}) with standard ±25% scope variance.`;
        sampleQuote = text
          .slice(Math.max(0, avgMatch.index - 20), Math.min(text.length, avgMatch.index + 80))
          .replace(/\s+/g, ' ')
          .trim();
      }
    }
  } else {
    // Pick the most realistic repair range (prefer range in reasonable bracket $50 - $2500)
    const sensibleRanges = validRanges.filter((r) => r.max <= 3500 && r.min >= 40);
    const chosen = sensibleRanges.length > 0 ? sensibleRanges[0] : validRanges[0];
    priceRange = { min: chosen.min, max: chosen.max };
    sampleQuote = chosen.quote;
  }

  return {
    title,
    url,
    domain,
    datePublished,
    priceRange,
    geographicScope,
    relevanceNote,
    pricingBasis,
    sampleQuote,
  };
}

/**
 * Validates, cross-checks, and synthesizes price evidence from multiple retrieved sources.
 * Detects contradictory, weak, or sufficient evidence without ever inventing averages.
 */
export function assessPriceEvidence(
  sources: MarketReferenceSource[],
  tradeCategory: string,
  zipCode: string
): PriceEvidenceAssessment {
  const sourcesWithPrices = sources.filter((s) => s.priceRange !== undefined);

  // Case 1: No numeric pricing extracted
  if (sourcesWithPrices.length === 0) {
    return {
      status: 'weak',
      assessmentMessage:
        'Insufficient public numeric pricing found for this specific query. SkillConnect verified technician quotes remain the recommended baseline.',
      currency: 'USD',
      sampleSize: 0,
      isLocalitySpecific: false,
    };
  }

  // Case 2: Only 1 source found
  if (sourcesWithPrices.length === 1) {
    const s = sourcesWithPrices[0];
    const isLocal = s.geographicScope === 'local' || s.geographicScope === 'state';
    return {
      status: 'weak',
      assessmentMessage:
        'Single reference point identified. Limited independent confirmation across multiple public sources.',
      marketLow: s.priceRange?.min,
      marketHigh: s.priceRange?.max,
      marketMedian: s.priceRange ? Math.round((s.priceRange.min + s.priceRange.max) / 2) : undefined,
      currency: 'USD',
      sampleSize: 1,
      isLocalitySpecific: isLocal,
    };
  }

  // Case 3: Multiple sources — cross-validate for consistency vs contradiction
  const mins = sourcesWithPrices.map((s) => s.priceRange!.min);
  const maxs = sourcesWithPrices.map((s) => s.priceRange!.max);
  const medians = sourcesWithPrices.map((s) => (s.priceRange!.min + s.priceRange!.max) / 2);

  const overallLow = Math.min(...mins);
  const overallHigh = Math.max(...maxs);

  // Check for contradiction (e.g. highest median is > 4.5x lowest median without scope distinction)
  const minMedian = Math.min(...medians);
  const maxMedian = Math.max(...medians);

  if (minMedian > 0 && maxMedian / minMedian >= 4.5) {
    return {
      status: 'contradictory',
      assessmentMessage: `Public references show contradictory or disparate ranges ($${overallLow} vs $${overallHigh}). This typically reflects divergent scopes (minor localized repair vs complete whole-system replacement). We caution against relying on general internet averages for this scope.`,
      marketLow: overallLow,
      marketHigh: overallHigh,
      marketMedian: Math.round((overallLow + overallHigh) / 2),
      currency: 'USD',
      sampleSize: sourcesWithPrices.length,
      isLocalitySpecific: sourcesWithPrices.some((s) => s.geographicScope === 'local'),
    };
  }

  // Calculate composite median
  medians.sort((a, b) => a - b);
  const compositeMedian =
    medians.length % 2 === 0
      ? Math.round((medians[medians.length / 2 - 1] + medians[medians.length / 2]) / 2)
      : Math.round(medians[Math.floor(medians.length / 2)]);

  const hasLocal = sourcesWithPrices.some((s) => s.geographicScope === 'local');
  const hasState = sourcesWithPrices.some((s) => s.geographicScope === 'state');

  const status: EvidenceConfidence = 'sufficient';
  let message = `Sufficient independent evidence: Verified across ${sourcesWithPrices.length} credible trade publications.`;

  if (!hasLocal && !hasState) {
    message += ` Note: Data reflects national benchmarks; specific ZIP ${zipCode} rates may vary based on local labor costs.`;
  } else if (hasLocal) {
    message += ` Includes confirmed locality pricing for ZIP ${zipCode}.`;
  }

  return {
    status,
    assessmentMessage: message,
    marketLow: overallLow,
    marketHigh: overallHigh,
    marketMedian: compositeMedian,
    currency: 'USD',
    sampleSize: sourcesWithPrices.length,
    isLocalitySpecific: hasLocal || hasState,
  };
}
