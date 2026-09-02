import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { myProfile, upsertProfile } from '@/lib/candidates';
import { S, parse } from '@/lib/schemas/batch18';
export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await myProfile(s.userId), errors: null });
}
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.candidate, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await upsertProfile(s.userId, v.data), errors: null }, { status: 201 });
}
