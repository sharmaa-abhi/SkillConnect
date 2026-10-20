import { NextResponse } from 'next/server';
import { sanitizeSearchQuery, checkRateLimit } from '@/lib/price-intelligence/security';
import { searchTinyFish } from '@/lib/price-intelligence/tinyfish-client';
import { priceSearchCache } from '@/lib/price-intelligence/cache';
import { TinyFishSearchResultItem } from '@/types/price-intelligence';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || undefined;
  const zipCode = searchParams.get('zipCode') || undefined;

  // Rate Limiting
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const rateLimit = checkRateLimit(`search:${clientIp}`, 30, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before retrying.' },
      { status: 429 }
    );
  }

  // PII Scrubbing
  const sanitized = sanitizeSearchQuery(query, category, zipCode);
  if (!sanitized.isValid) {
    return NextResponse.json(
      { error: sanitized.validationError || 'Invalid search query.' },
      { status: 400 }
    );
  }

  // Cache Lookup (24h TTL)
  const cacheKey = `search:${sanitized.cleanQuery.toLowerCase()}`;
  const cached = priceSearchCache.get(cacheKey) as TinyFishSearchResultItem[] | null;
  if (cached) {
    return NextResponse.json({
      query: sanitized.cleanQuery,
      genericScope: sanitized.genericScope,
      results: cached,
      isCached: true,
    });
  }

  // Execute TinyFish FREE Search
  const response = await searchTinyFish(sanitized.cleanQuery);

  if ('isError' in response && response.isError) {
    return NextResponse.json(
      {
        error: response.message,
        code: response.code,
      },
      { status: response.status }
    );
  }

  const results = 'results' in response ? response.results : [];
  priceSearchCache.set(cacheKey, results);

  return NextResponse.json({
    query: sanitized.cleanQuery,
    genericScope: sanitized.genericScope,
    results,
    isCached: false,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query || body.problemDescription || '';
    const category = body.category || body.categorySlug || undefined;
    const zipCode = body.zipCode || undefined;

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`search:${clientIp}`, 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before retrying.' },
        { status: 429 }
      );
    }

    const sanitized = sanitizeSearchQuery(query, category, zipCode);
    if (!sanitized.isValid) {
      return NextResponse.json(
        { error: sanitized.validationError || 'Invalid search query.' },
        { status: 400 }
      );
    }

    const cacheKey = `search:${sanitized.cleanQuery.toLowerCase()}`;
    const cached = priceSearchCache.get(cacheKey) as TinyFishSearchResultItem[] | null;
    if (cached) {
      return NextResponse.json({
        query: sanitized.cleanQuery,
        genericScope: sanitized.genericScope,
        results: cached,
        isCached: true,
      });
    }

    const response = await searchTinyFish(sanitized.cleanQuery);
    if ('isError' in response && response.isError) {
      return NextResponse.json(
        {
          error: response.message,
          code: response.code,
        },
        { status: response.status }
      );
    }

    const results = 'results' in response ? response.results : [];
    priceSearchCache.set(cacheKey, results);

    return NextResponse.json({
      query: sanitized.cleanQuery,
      genericScope: sanitized.genericScope,
      results,
      isCached: false,
    });
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
  }
}
