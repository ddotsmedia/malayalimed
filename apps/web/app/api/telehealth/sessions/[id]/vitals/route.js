import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sessionVitals } from '@/lib/telehealth';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  return NextResponse.json({ data: await sessionVitals(id), errors: null });
}
