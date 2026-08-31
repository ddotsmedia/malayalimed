import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { submitSupport } from '@/lib/support';
import { S, parse } from '@/lib/schemas/batch16';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await getSession();
  const body = await request.json().catch(() => ({}));
  const v = parse(S.support, { ...body, kind: 'feedback' });
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await submitSupport(s?.userId || null, v.data), errors: null }, { status: 201 });
}
