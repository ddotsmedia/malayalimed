import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { waitlist } from '@/lib/appointmentsExtra';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const doctorId = new URL(request.url).searchParams.get('doctorId');
  if (!doctorId) return NextResponse.json({ errors: ['doctorId_required'] }, { status: 400 });
  return NextResponse.json({ data: await waitlist(doctorId), errors: null });
}
