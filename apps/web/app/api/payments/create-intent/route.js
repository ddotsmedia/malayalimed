import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createCheckout } from '@/lib/payments';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const res = await createCheckout({
    appointmentId: b.appointment_id, patientId: s.userId,
    amountInr: parseInt(b.amount_inr, 10), description: b.description
  });
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
