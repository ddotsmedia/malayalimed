import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { scheduleFollowUp } from '@/lib/telehealth';
import { S, parse } from '@/lib/schemas/batch16';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.followUp, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await scheduleFollowUp(s.userId, v.data), errors: null }, { status: 201 });
}
