import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { addMetric, listMetrics } from '@/lib/healthMetrics';
import { metricSchema, parse } from '@/lib/schemas/patient';
import { evaluateBadges } from '@/lib/badges';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const u = new URL(request.url).searchParams;
  const data = await listMetrics(s.userId, u.get('type'), Number(u.get('days')) || 30);
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const v = parse(metricSchema, b);
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await addMetric(s.userId, v.data);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  evaluateBadges(s.userId).catch(() => {});
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
