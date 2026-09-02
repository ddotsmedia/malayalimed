import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { shareRecords } from '@/lib/abdm';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await shareRecords(s.userId, Array.isArray(b.providers) ? b.providers : []), errors: null }, { status: 201 });
}
