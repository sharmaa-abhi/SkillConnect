import {
  TinyFishSearchResultItem,
  TinyFishSearchResponse,
  TinyFishFetchResponse,
} from '@/types/price-intelligence';
import { validateExternalUrl, sanitizeExternalContent } from './security';

const TINYFISH_SEARCH_ENDPOINT = 'https://api.search.tinyfish.ai';
const TINYFISH_FETCH_ENDPOINT = 'https://api.fetch.tinyfish.ai';

const REQUEST_TIMEOUT_MS = 6000;

export interface TinyFishErrorResult {
  isError: true;
  status: number;
  code: 'quota_exhausted' | 'rate_limited' | 'unauthorized' | 'timeout' | 'unavailable' | 'invalid_url';
  message: string;
}

/**
 * Executes a GET query against TinyFish's FREE Search endpoint:
 * GET https://api.search.tinyfish.ai?query=...
 *
 * Authenticates with server-side TINYFISH_API_KEY via X-API-Key header.
 * NEVER calls paid endpoints (Agent, Research, Browser, Monitor).
 */
export async function searchTinyFish(
  query: string
): Promise<TinyFishSearchResponse | TinyFishErrorResult> {
  const apiKey = process.env.TINYFISH_API_KEY?.trim();

  // If no API key configured, return graceful offline status or test mock
  if (!apiKey) {
    if (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_ENABLE_MOCK_INTELLIGENCE === 'true') {
      return getSimulatedSearchResults(query);
    }

    return {
      isError: true,
      status: 401,
      code: 'unauthorized',
      message: 'TINYFISH_API_KEY environment variable is not configured. Live public market search is unavailable.',
    };
  }

  const searchUrl = `${TINYFISH_SEARCH_ENDPOINT}?query=${encodeURIComponent(query)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain',
        'X-API-Key': apiKey,
        'User-Agent': 'SkillConnect-MarketPriceIntelligence/1.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Graceful error handling for HTTP 402 / 429
    if (res.status === 402) {
      return {
        isError: true,
        status: 402,
        code: 'quota_exhausted',
        message: 'TinyFish Free Tier monthly quota has been reached. SkillConnect original cost estimates and booking remain 100% active.',
      };
    }

    if (res.status === 429) {
      return {
        isError: true,
        status: 429,
        code: 'rate_limited',
        message: 'TinyFish search rate limit reached. Please wait a moment before retrying.',
      };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        isError: true,
        status: res.status,
        code: 'unauthorized',
        message: 'Invalid or unauthorized TinyFish API credentials.',
      };
    }

    if (!res.ok) {
      return {
        isError: true,
        status: res.status,
        code: 'unavailable',
        message: `TinyFish Search responded with HTTP ${res.status}.`,
      };
    }

    const contentType = res.headers.get('content-type') || '';
    let results: TinyFishSearchResultItem[] = [];

    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data)) {
        results = data;
      } else if (Array.isArray(data.results)) {
        results = data.results;
      } else if (Array.isArray(data.data)) {
        results = data.data;
      }
    } else {
      const text = await res.text();
      results = parseRawSearchText(text);
    }

    // Filter to valid HTTPS URLs only
    const validatedResults = results
      .filter((r) => r.url && validateExternalUrl(r.url).isValid)
      .slice(0, 5); // limit to top 5 results

    return {
      query,
      results: validatedResults,
    };
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && (err.name === 'AbortError' || err.message.includes('timeout'));
    return {
      isError: true,
      status: isTimeout ? 504 : 503,
      code: isTimeout ? 'timeout' : 'unavailable',
      message: isTimeout
        ? 'TinyFish search request timed out after 6 seconds.'
        : `Network error connecting to TinyFish Search: ${err instanceof Error ? err.message : 'Unknown'}`,
    };
  }
}

/**
 * Executes a POST query against TinyFish's FREE Fetch endpoint:
 * POST https://api.fetch.tinyfish.ai
 *
 * Authenticates with server-side TINYFISH_API_KEY via X-API-Key header.
 * Enforces strict SSRF protection before any network request is made.
 */
export async function fetchTinyFishContent(
  targetUrl: string
): Promise<TinyFishFetchResponse | TinyFishErrorResult> {
  // 1. SSRF Validation
  const urlCheck = validateExternalUrl(targetUrl);
  if (!urlCheck.isValid || !urlCheck.sanitizedUrl) {
    return {
      isError: true,
      status: 400,
      code: 'invalid_url',
      message: urlCheck.error || 'Invalid or unsafe destination URL.',
    };
  }

  const apiKey = process.env.TINYFISH_API_KEY?.trim();

  // If no API key configured, return mock or unauthorized
  if (!apiKey) {
    if (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_ENABLE_MOCK_INTELLIGENCE === 'true') {
      return getSimulatedFetchContent(urlCheck.sanitizedUrl);
    }

    return {
      isError: true,
      status: 401,
      code: 'unauthorized',
      message: 'TINYFISH_API_KEY environment variable is not configured.',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(TINYFISH_FETCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'X-API-Key': apiKey,
        'User-Agent': 'SkillConnect-MarketPriceIntelligence/1.0',
      },
      body: JSON.stringify({ url: urlCheck.sanitizedUrl }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.status === 402) {
      return {
        isError: true,
        status: 402,
        code: 'quota_exhausted',
        message: 'TinyFish Free Tier monthly quota reached on content fetch.',
      };
    }

    if (res.status === 429) {
      return {
        isError: true,
        status: 429,
        code: 'rate_limited',
        message: 'TinyFish fetch rate limit exceeded.',
      };
    }

    if (!res.ok) {
      return {
        isError: true,
        status: res.status,
        code: 'unavailable',
        message: `TinyFish Fetch failed with HTTP ${res.status}.`,
      };
    }

    const contentType = res.headers.get('content-type') || '';
    let rawContent = '';

    if (contentType.includes('application/json')) {
      const json = await res.json();
      rawContent = json.content || json.markdown || json.text || json.html || JSON.stringify(json);
    } else {
      rawContent = await res.text();
    }

    // Sanitize retrieved content
    const sanitizedContent = sanitizeExternalContent(rawContent);

    return {
      url: urlCheck.sanitizedUrl,
      content: sanitizedContent,
      status: res.status,
    };
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && (err.name === 'AbortError' || err.message.includes('timeout'));
    return {
      isError: true,
      status: isTimeout ? 504 : 503,
      code: isTimeout ? 'timeout' : 'unavailable',
      message: isTimeout
        ? 'Fetch request to TinyFish timed out.'
        : `Network error reaching TinyFish Fetch: ${err instanceof Error ? err.message : 'Unknown'}`,
    };
  }
}

/**
 * Fallback parser for plain text search results
 */
function parseRawSearchText(text: string): TinyFishSearchResultItem[] {
  const items: TinyFishSearchResultItem[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const urlMatch = line.match(/https:\/\/[^\s"'<>]+/);
    if (urlMatch) {
      const url = urlMatch[0];
      const title = line.replace(url, '').replace(/[#*_-]/g, ' ').trim() || 'Public Price Guide Reference';
      items.push({ title, url });
    }
  }

  return items;
}

/**
 * High-fidelity deterministic simulated search results for automated testing
 * and demonstration without paid API keys.
 */
function getSimulatedSearchResults(query: string): TinyFishSearchResponse {
  const q = query.toLowerCase();

  if (q.includes('plumb') || q.includes('sink') || q.includes('pipe') || q.includes('drain')) {
    return {
      query,
      results: [
        {
          title: 'Bob Vila: How Much Does Leaky Sink & Pipe Repair Cost in 2025?',
          url: 'https://www.bobvila.com/articles/sink-repair-cost',
          snippet: 'Homeowners typically pay between $175 and $380 to repair a bathroom or kitchen sink leak in the San Francisco Bay Area.',
          date: '2025-02-15',
        },
        {
          title: 'This Old House: 2025 Plumbing Repair Cost Guide by Zip Code',
          url: 'https://www.thisoldhouse.com/plumbing/plumber-hourly-rates-guide',
          snippet: 'Average plumbing repair costs range from $160 to $350 for standard drain lines and fixture traps. Hourly rates average $85 to $135.',
          date: '2025-01-20',
        },
        {
          title: 'Angi: Average Cost of Fixing a Leaking Bathroom Sink Under Counter',
          url: 'https://www.angi.com/articles/sink-leak-repair-cost-factors.htm',
          snippet: 'National average cost for minor sink leak repairs is $225, with most homeowners spending between $150 and $325 depending on parts required.',
          date: '2024-11-10',
        },
      ],
    };
  }

  if (q.includes('electric') || q.includes('panel') || q.includes('breaker') || q.includes('charger')) {
    return {
      query,
      results: [
        {
          title: 'Forbes Home: Average Electrician Cost & Hourly Rates in 2025',
          url: 'https://www.forbes.com/home-improvement/electrical/electrician-cost-per-hour',
          snippet: 'Electricians typically charge between $180 and $420 for diagnostic troubleshooting and breaker repair in major metro markets.',
          date: '2025-01-10',
        },
        {
          title: 'This Old House: Circuit Breaker & Panel Repair Cost Guide',
          url: 'https://www.thisoldhouse.com/electrical/circuit-breaker-replacement-cost',
          snippet: 'Replacing a tripping circuit breaker typically ranges from $150 to $300 including basic diagnostic testing and replacement parts.',
          date: '2024-12-05',
        },
      ],
    };
  }

  // Generic home maintenance fallback
  return {
    query,
    results: [
      {
        title: 'HomeAdvisor: 2025 Home Service Repair Benchmark Guide',
        url: 'https://www.homeadvisor.com/cost/home-maintenance-pricing-benchmarks',
        snippet: 'Standard trade repairs typically cost between $150 and $350 for 1 to 2 hours of licensed labor plus consumables.',
        date: '2025-01-01',
      },
    ],
  };
}

/**
 * Deterministic simulated fetch content for automated testing and demonstrations.
 */
function getSimulatedFetchContent(url: string): TinyFishFetchResponse {
  if (url.includes('bobvila.com')) {
    return {
      url,
      status: 200,
      content: `Bob Vila Home Guides - Published February 2025.
How Much Does It Cost to Fix a Leaky Sink?
Across the San Francisco Bay Area and Northern California, homeowners typically pay between $175 and $380 for professional sink leak repairs.
Most plumbers charge an initial diagnostic dispatch fee credited toward work, with standard hourly rates ranging from $85 to $130 per hour.
Common costs:
- P-trap replacement: $120 to $220
- Faucet cartridge leak repair: $160 to $280
- Garbage disposal flange re-sealing: $180 to $320.
Repairs rarely exceed $450 unless extensive water-damaged subfloor framing requires structural remediation.`,
    };
  }

  if (url.includes('thisoldhouse.com')) {
    return {
      url,
      status: 200,
      content: `This Old House Trade Intelligence - Updated January 2025.
2025 Plumbing Repair Cost Guide.
The national average cost to fix a leaking sink or minor pipe junction is $240. Most homeowners spend between $160 and $350 for parts and labor combined.
Licensed plumbers typically bill between $85 and $135 an hour.
Location adjustments: Dense metropolitan zip codes (such as ZIP 94107, 94114, and surrounding urban centers) often trend 15% to 25% higher due to travel overhead and commercial parking costs.`,
    };
  }

  if (url.includes('angi.com')) {
    return {
      url,
      status: 200,
      content: `Angi Homeowner Benchmark Report - Reviewed November 2024.
National Cost Guide: Bathroom and Kitchen Sink Leak Troubleshooting.
Average cost reported by over 14,000 verified service calls: $225.
The typical price range falls between $150 and $325.
Parts allowance: $20 to $65 for washers, rubber gaskets, and flexible supply lines.
Labor time: 1.0 to 2.5 hours on-site.`,
    };
  }

  // Default content
  return {
    url,
    status: 200,
    content: `Trade Cost Reference Guide - Updated 2025.
Standard home repair diagnostics and repairs typically cost between $150 and $350 depending on job complexity and required replacement parts.`,
  };
}
