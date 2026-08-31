import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { joinWaitlist } from '@/lib/appointmentsExtra';
import { S, parse } from '@/lib/schemas/batch16';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.waitlist, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await joinWaitlist(v.data.doctorId, s.userId, v.data.appointmentId);
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
