import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { connectDevice } from '@/lib/iot';
import { S, parse } from '@/lib/schemas/batch17';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.device, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await connectDevice(s.userId, v.data), errors: null }, { status: 201 });
}
