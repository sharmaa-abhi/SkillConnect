import { NextResponse } from 'next/server';
import { getLivePriceIntelligence } from '@/lib/price-intelligence';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const problemDescription = body.problemDescription || '';
    const categorySlug = body.categorySlug || undefined;
    const zipCode = body.zipCode || '94107';

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    const result = await getLivePriceIntelligence(
      {
        problemDescription,
        categorySlug,
        zipCode,
      },
      clientIp
    );

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: 'Failed to process price intelligence comparison.',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
