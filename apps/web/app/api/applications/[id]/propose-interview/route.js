import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { proposeInterview, interviewSlots } from '@/lib/interviews';
import { S, parse } from '@/lib/schemas/batch18';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  return NextResponse.json({ data: await interviewSlots(id), errors: null });
}
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(S.interview, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await proposeInterview(id, s.userId, v.data);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 403 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
