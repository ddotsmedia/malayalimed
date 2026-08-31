import { NextResponse } from 'next/server';
import { reviewStats } from '@/lib/reviews';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const type = u.get('doctorId') ? 'doctor' : 'hospital';
  const id = u.get('doctorId') || u.get('hospitalId');
  if (!id) return NextResponse.json({ errors: ['entity_required'] }, { status: 400 });
  return NextResponse.json({ data: await reviewStats(type, id), errors: null });
}
