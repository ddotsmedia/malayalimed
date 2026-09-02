import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { deviceMetrics, recordReading } from '@/lib/iot';
import { S, parse } from '@/lib/schemas/batch17';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const hours = Number(new URL(request.url).searchParams.get('hours')) || 24;
  return NextResponse.json({ data: await deviceMetrics(id, hours), errors: null });
}
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(S.reading, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await recordReading(id, s.userId, v.data);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 404 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
