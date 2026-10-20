import {
  PriceIntelligenceResult,
  PriceIntelligenceSearchRequest,
  MarketReferenceSource,
} from '@/types/price-intelligence';
import { sanitizeSearchQuery, checkRateLimit } from './security';
import { searchTinyFish, fetchTinyFishContent, TinyFishErrorResult } from './tinyfish-client';
import { extractPriceEvidenceFromText, assessPriceEvidence } from './price-extractor';
import { priceComparisonCache } from './cache';
import { detectServiceCategory, isValidZipCode } from '@/lib/search';
import { serviceCategories } from '@/data/services';

const DISCLAIMER_TEXT =
  'Public market references are independently gathered from third-party guides and published estimates. They are provided solely for market context and DO NOT represent verified SkillConnect provider quotes or platform guarantees.';

const PROVIDER_NOTICE =
  'SkillConnect estimates are calculated deterministically using verified local technician rate benchmarks and 100% diagnostic fee credits.';

/**
 * End-to-end price intelligence aggregator:
 * 1. Sanitizes inputs (strips PII)
 * 2. Checks rate limits and 24h cache
 * 3. Queries TinyFish Free Search
 * 4. Fetches 2-3 credible source pages via TinyFish Free Fetch with SSRF protections
 * 5. Extracts numeric pricing, geographic scope, and dates
 * 6. Synthesizes evidence assessment
 */
export async function getLivePriceIntelligence(
  req: PriceIntelligenceSearchRequest,
  clientIp: string = '127.0.0.1'
): Promise<PriceIntelligenceResult> {
  const { problemDescription, categorySlug, zipCode } = req;

  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(clientIp, 25, 60000);
  if (!rateLimit.allowed) {
    return {
      serviceDescription: problemDescription,
      tradeCategory: categorySlug || 'General Trade',
      zipCode,
      status: 'rate_limited',
      statusMessage: 'Rate limit exceeded. Please wait a moment before searching again.',
      sources: [],
      evidence: {
        status: 'weak',
        assessmentMessage: 'Rate limited.',
        currency: 'USD',
        sampleSize: 0,
        isLocalitySpecific: false,
      },
      disclaimer: DISCLAIMER_TEXT,
      providerNotice: PROVIDER_NOTICE,
    };
  }

  // 2. Validate input and trade category
  const rawText = (problemDescription || '').trim();
  if (rawText.length < 5) {
    return {
      serviceDescription: rawText,
      tradeCategory: categorySlug || 'Unknown',
      zipCode,
      status: 'error',
      statusMessage: 'Please enter a valid issue description (minimum 5 characters).',
      sources: [],
      evidence: {
        status: 'weak',
        assessmentMessage: 'Invalid input.',
        currency: 'USD',
        sampleSize: 0,
        isLocalitySpecific: false,
      },
      disclaimer: DISCLAIMER_TEXT,
      providerNotice: PROVIDER_NOTICE,
    };
  }

  // Check trade category & non-trade guards
  let resolvedCategory = serviceCategories.find((c) => c.slug === categorySlug);
  if (!resolvedCategory) {
    const detection = detectServiceCategory(rawText);
    if (detection.isUnsupported) {
      return {
        serviceDescription: rawText,
        tradeCategory: detection.unsupportedServiceName || 'Unsupported Service',
        zipCode,
        status: 'unsupported_trade',
        statusMessage: `Live price intelligence is not available for ${detection.unsupportedServiceName || 'non-trade services'}. SkillConnect specializes strictly in licensed residential and commercial trades.`,
        sources: [],
        evidence: {
          status: 'weak',
          assessmentMessage: 'Unsupported service trade domain.',
          currency: 'USD',
          sampleSize: 0,
          isLocalitySpecific: false,
        },
        disclaimer: DISCLAIMER_TEXT,
        providerNotice: PROVIDER_NOTICE,
      };
    }

    if (detection.categorySlug) {
      resolvedCategory = serviceCategories.find((c) => c.slug === detection.categorySlug);
    }
  }

  const categoryName = resolvedCategory ? resolvedCategory.name : 'Home Service Repair';
  const categorySlugResolved = resolvedCategory ? resolvedCategory.slug : 'general';

  // 3. ZIP Code validation
  const validZip = isValidZipCode(zipCode) ? zipCode.trim() : '94107';

  // 4. Cache Check (24h TTL)
  const cacheKey = `price-intel:${categorySlugResolved}:${validZip}:${rawText.slice(0, 40).toLowerCase().replace(/\s+/g, '_')}`;
  const cachedResult = priceComparisonCache.get(cacheKey) as PriceIntelligenceResult | null;
  if (cachedResult) {
    return {
      ...cachedResult,
      isCached: true,
    };
  }

  // 5. PII Scrubbing and query preparation
  const sanitized = sanitizeSearchQuery(rawText, categoryName, validZip);
  if (!sanitized.isValid) {
    return {
      serviceDescription: rawText,
      tradeCategory: categoryName,
      zipCode: validZip,
      status: 'error',
      statusMessage: sanitized.validationError || 'Invalid query format.',
      sources: [],
      evidence: {
        status: 'weak',
        assessmentMessage: 'Query could not be sanitized.',
        currency: 'USD',
        sampleSize: 0,
        isLocalitySpecific: false,
      },
      disclaimer: DISCLAIMER_TEXT,
      providerNotice: PROVIDER_NOTICE,
    };
  }

  // 6. Execute TinyFish FREE Search
  const searchResult = await searchTinyFish(sanitized.cleanQuery);

  if ('isError' in searchResult && searchResult.isError) {
    const err = searchResult as TinyFishErrorResult;
    return {
      serviceDescription: sanitized.genericScope,
      tradeCategory: categoryName,
      zipCode: validZip,
      status: err.code === 'quota_exhausted' ? 'quota_exhausted' : 'unavailable',
      statusMessage: err.message,
      sources: [],
      evidence: {
        status: 'weak',
        assessmentMessage: 'Public intelligence currently unavailable. SkillConnect estimates remain fully functional.',
        currency: 'USD',
        sampleSize: 0,
        isLocalitySpecific: false,
      },
      disclaimer: DISCLAIMER_TEXT,
      providerNotice: PROVIDER_NOTICE,
    };
  }

  const searchResults = 'results' in searchResult ? searchResult.results : [];
  if (searchResults.length === 0) {
    return {
      serviceDescription: sanitized.genericScope,
      tradeCategory: categoryName,
      zipCode: validZip,
      status: 'no_evidence',
      statusMessage: 'No public market price references found for this specific query and locality.',
      sources: [],
      evidence: {
        status: 'weak',
        assessmentMessage: 'Zero public price sources identified.',
        currency: 'USD',
        sampleSize: 0,
        isLocalitySpecific: false,
      },
      disclaimer: DISCLAIMER_TEXT,
      providerNotice: PROVIDER_NOTICE,
    };
  }

  // 7. Pick up to 3 credible URLs to fetch
  const targetUrls = searchResults.slice(0, 3);
  const fetchedSources: MarketReferenceSource[] = [];

  // Fetch concurrently with individual error isolation
  const fetchPromises = targetUrls.map(async (item) => {
    try {
      const parsedUrl = new URL(item.url);
      const domain = parsedUrl.hostname.replace(/^www\./, '');

      const fetchRes = await fetchTinyFishContent(item.url);
      if ('isError' in fetchRes && fetchRes.isError) {
        // Fall back to snippet if fetch fails
        if (item.snippet) {
          const fallbackSource = extractPriceEvidenceFromText(item.snippet, {
            title: item.title,
            url: item.url,
            domain,
            zipCode: validZip,
            tradeCategory: categoryName,
          });
          return fallbackSource;
        }
        return null;
      }

      const content = 'content' in fetchRes ? fetchRes.content : '';
      const source = extractPriceEvidenceFromText(content, {
        title: item.title,
        url: item.url,
        domain,
        zipCode: validZip,
        tradeCategory: categoryName,
      });

      return source;
    } catch {
      return null;
    }
  });

  const settled = await Promise.allSettled(fetchPromises);
  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value) {
      fetchedSources.push(s.value);
    }
  }

  // 8. Synthesize and evaluate evidence
  const evidence = assessPriceEvidence(fetchedSources, categoryName, validZip);

  let status: PriceIntelligenceResult['status'] = 'success';
  let statusMessage = `Identified ${fetchedSources.length} public price reference(s) for ${categoryName}.`;

  if (evidence.status === 'contradictory') {
    status = 'contradictory';
    statusMessage = evidence.assessmentMessage;
  } else if (evidence.status === 'weak' || evidence.sampleSize === 0) {
    status = 'weak_evidence';
    statusMessage = evidence.assessmentMessage;
  }

  const result: PriceIntelligenceResult = {
    serviceDescription: sanitized.genericScope,
    tradeCategory: categoryName,
    zipCode: validZip,
    status,
    statusMessage,
    sources: fetchedSources,
    evidence,
    disclaimer: DISCLAIMER_TEXT,
    providerNotice: PROVIDER_NOTICE,
    cachedAt: new Date().toISOString(),
    isCached: false,
  };

  // Cache valid non-empty results
  if (status !== 'error') {
    priceComparisonCache.set(cacheKey, result);
  }

  return result;
}

export * from './security';
export * from './cache';
export * from './tinyfish-client';
export * from './price-extractor';
