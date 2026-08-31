import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { medicalHistory } from '@/lib/patientRecords';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await medicalHistory(s.userId), errors: null });
}
