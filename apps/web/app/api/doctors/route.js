import { NextResponse } from 'next/server';
import { searchDoctors } from '@/lib/doctors';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const data = await searchDoctors({
    term: u.get('q') || '', specialty: u.get('specialty') || '', district: u.get('district') || '',
    page: Number(u.get('page')) || 1
  });
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
