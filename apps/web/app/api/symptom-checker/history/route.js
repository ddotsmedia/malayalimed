import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { history } from '@/lib/symptomChecker';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const data = await history(s.userId, 5);
  return NextResponse.json({ data, errors: null });
}
