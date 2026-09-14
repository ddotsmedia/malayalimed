import { NextResponse } from 'next/server';
import { getDistinctDistricts } from '@/lib/professionals';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = await getDistinctDistricts();
    const districts = results.map((r) => r.location_district).filter(Boolean);
    return NextResponse.json({ data: districts, errors: null });
  } catch (err) {
    return NextResponse.json(
      { data: [], errors: [err.message] },
      { status: 500 }
    );
  }
}
