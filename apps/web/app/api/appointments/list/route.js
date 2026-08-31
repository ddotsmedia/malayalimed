import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listForPatient } from '@/lib/appointments';

export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const data = await listForPatient(s.userId);
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
