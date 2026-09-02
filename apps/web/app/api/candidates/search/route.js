import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { search } from '@/lib/candidates';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const u = new URL(request.url).searchParams;
  return NextResponse.json({ data: await search({ specialty: u.get('specialty'), location: u.get('location') }), errors: null });
}
