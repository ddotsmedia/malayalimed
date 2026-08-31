import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAppointmentForUser } from '@/lib/appointments';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const appt = await getAppointmentForUser(id, s.userId);
  if (!appt) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  const room = `malayalimed-${appt.booking_ref}`;
  const domain = process.env.JITSI_DOMAIN || 'meet.jit.si';
  return NextResponse.json({ data: { room, domain, url: `https://${domain}/${room}` }, errors: null });
}
