import { NextResponse } from 'next/server';
import { getOpenShifts } from '@/lib/staffing';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district') || null;
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const results = await getOpenShifts(district, limit);

    return NextResponse.json({
      data: results,
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      { data: null, errors: [err.message] },
      { status: 500 }
    );
  }
}
