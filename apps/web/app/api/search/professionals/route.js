import { NextResponse } from 'next/server';
import { searchProfsAdvanced } from '@/lib/professionals';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const specialty = searchParams.get('specialty') || '';
  const district = searchParams.get('district') || '';
  const minRating = parseFloat(searchParams.get('minRating') || '0');
  const availableNow = searchParams.get('availableNow') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  try {
    const offset = (page - 1) * limit;
    const results = await searchProfsAdvanced({
      q,
      specialty,
      district,
      minRating,
      availableNow,
      limit,
      offset,
    });

    const total = results.length > 0 ? results.length : 0;
    const hasMore = results.length === limit;

    return NextResponse.json({
      data: results,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
