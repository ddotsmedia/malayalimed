import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { payBill } from '@/lib/billing';
import { payBillSchema, parse } from '@/lib/schemas/portal';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(payBillSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await payBill(v.data.invoiceId, s.userId, { method: v.data.method });
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
