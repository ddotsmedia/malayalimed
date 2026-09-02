import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listAlerts, createAlert } from '@/lib/jobExtras';
import { S, parse } from '@/lib/schemas/batch18';
export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await listAlerts(s.userId), errors: null });
}
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.alert, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await createAlert(s.userId, v.data), errors: null }, { status: 201 });
}
