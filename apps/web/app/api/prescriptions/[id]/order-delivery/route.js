import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { orderDelivery } from '@/lib/rxDelivery';
import { S, parse } from '@/lib/schemas/batch17';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(S.orderDelivery, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await orderDelivery(id, s.userId, v.data.deliveryAddress), errors: null }, { status: 201 });
}
