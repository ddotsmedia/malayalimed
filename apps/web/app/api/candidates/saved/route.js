import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { savedList } from '@/lib/candidates';
export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await savedList(s.userId), errors: null });
}
