import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { refundPayment } from '@/lib/payments';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  const res = await refundPayment(b.payment_id);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
