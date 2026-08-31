import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { metricTrends } from '@/lib/healthMetrics';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const u = new URL(request.url).searchParams;
  const data = await metricTrends(s.userId, u.get('type') || 'weight', Number(u.get('days')) || 30);
  return NextResponse.json({ data, errors: null });
}
