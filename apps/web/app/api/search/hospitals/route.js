import { NextResponse } from 'next/server';
import { searchHospsAdvanced } from '@/lib/hospitals';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const district = searchParams.get('district') || '';
  const minRating = parseFloat(searchParams.get('minRating') || '0');
  const minBeds = parseInt(searchParams.get('minBeds') || '0');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  try {
    const offset = (page - 1) * limit;
    const results = await searchHospsAdvanced({
      q,
      district,
      minRating,
      minBeds,
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
