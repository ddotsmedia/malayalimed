import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { verify } from '@/lib/insurance';

export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await verify(s.userId), errors: null });
}
