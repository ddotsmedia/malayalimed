import { NextResponse } from 'next/server';
import { searchDoctors, compareDoctors } from '@/lib/doctorSearch';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const u = new URL(request.url).searchParams;
  if (u.get('ids')) {
    const data = await compareDoctors(u.get('ids'));
    return NextResponse.json({ data, errors: null });
  }
  const data = await searchDoctors({
    insurance: u.get('insurance'), language: u.get('language'), minRating: u.get('minRating'),
    specialty: u.get('specialty'), district: u.get('district'), sort: u.get('sort'),
  });
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
