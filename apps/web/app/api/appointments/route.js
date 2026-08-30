import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { bookAppointment, listForPatient } from '@/lib/appointments';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ data: null, errors: ['unauthenticated'] }, { status: 401 });
  const data = await listForPatient(s.userId);
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ data: null, errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const res = await bookAppointment({
    doctorId: b.doctor_id, patientId: s.userId, slotDate: b.slot_date,
    slotStart: b.slot_start, slotEnd: b.slot_end, mode: b.mode, fee: b.fee, notes: b.notes
  });
  if (res.error) return NextResponse.json({ data: null, errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
