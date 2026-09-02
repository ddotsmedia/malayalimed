import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { copay } from '@/lib/insurance';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const service = new URL(request.url).searchParams.get('service') || 'consultation';
  return NextResponse.json({ data: await copay(s.userId, service), errors: null });
}
