import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listOrders } from '@/lib/rxDelivery';

export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await listOrders(s.userId), errors: null });
}
