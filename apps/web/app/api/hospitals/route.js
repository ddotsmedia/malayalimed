import { NextResponse } from 'next/server';
import { searchHospitals } from '@/lib/hospitals';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const data = await searchHospitals({ term: u.get('q') || '', district: u.get('district') || '', page: Number(u.get('page')) || 1 });
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
