import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { vitalTrends } from '@/lib/iot';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const u = new URL(request.url).searchParams;
  return NextResponse.json({ data: await vitalTrends(s.userId, u.get('metric') || 'heart_rate', Number(u.get('days')) || 90), errors: null });
}
