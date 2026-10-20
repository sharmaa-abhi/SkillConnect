import { NextResponse } from 'next/server';
import { validateExternalUrl, checkRateLimit } from '@/lib/price-intelligence/security';
import { fetchTinyFishContent } from '@/lib/price-intelligence/tinyfish-client';
import { extractPriceEvidenceFromText } from '@/lib/price-intelligence/price-extractor';
import { priceFetchCache } from '@/lib/price-intelligence/cache';
import { MarketReferenceSource } from '@/types/price-intelligence';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body.url;
    const title = body.title || 'Public Price Guide';
    const tradeCategory = body.tradeCategory || body.categorySlug || 'Trade Service';
    const zipCode = body.zipCode || undefined;

    // 1. SSRF Validation
    const urlValidation = validateExternalUrl(url);
    if (!urlValidation.isValid || !urlValidation.sanitizedUrl) {
      return NextResponse.json(
        { error: urlValidation.error || 'Invalid or unsafe destination URL.' },
        { status: 400 }
      );
    }

    // 2. Rate Limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`fetch:${clientIp}`, 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before retrying.' },
        { status: 429 }
      );
    }

    // 3. Cache Check (24h TTL)
    const cacheKey = `fetch:${urlValidation.sanitizedUrl}`;
    const cached = priceFetchCache.get(cacheKey) as MarketReferenceSource | null;
    if (cached) {
      return NextResponse.json({
        ...cached,
        isCached: true,
      });
    }

    // 4. Execute TinyFish FREE Fetch
    const response = await fetchTinyFishContent(urlValidation.sanitizedUrl);
    if ('isError' in response && response.isError) {
      return NextResponse.json(
        {
          error: response.message,
          code: response.code,
        },
        { status: response.status }
      );
    }

    const content = 'content' in response ? response.content : '';
    const parsedUrl = new URL(urlValidation.sanitizedUrl);
    const domain = parsedUrl.hostname.replace(/^www\./, '');

    // 5. Extract Price Evidence
    const sourceData = extractPriceEvidenceFromText(content, {
      title,
      url: urlValidation.sanitizedUrl,
      domain,
      zipCode,
      tradeCategory,
    });

    priceFetchCache.set(cacheKey, sourceData);

    return NextResponse.json({
      ...sourceData,
      isCached: false,
    });
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
  }
}
