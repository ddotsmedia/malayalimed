import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { subscribe } from '@/lib/rxDelivery';
import { S, parse } from '@/lib/schemas/batch17';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.subscribe, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await subscribe(s.userId, v.data), errors: null }, { status: 201 });
}
