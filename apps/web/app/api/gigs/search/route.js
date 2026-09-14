import { NextResponse } from 'next/server';
import { searchGigs } from '@/lib/gigs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const specialization = searchParams.get('specialization') || '';
  const district = searchParams.get('district') || '';
  const minRate = parseFloat(searchParams.get('minRate') || '0');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  try {
    const offset = (page - 1) * limit;
    const results = await searchGigs({
      q,
      specialization,
      district,
      minRate,
      limit,
      offset,
    });

    return NextResponse.json({
      data: results,
      pagination: { page, limit, total: results.length },
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
