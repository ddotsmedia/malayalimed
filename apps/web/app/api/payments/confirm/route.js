import { NextResponse } from 'next/server';
import { confirmPayment } from '@/lib/payments';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const b = await request.json().catch(() => ({}));
  const res = await confirmPayment(b.session_id);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
