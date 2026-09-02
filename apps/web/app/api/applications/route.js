import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { myApplications } from '@/lib/jobApps';
export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await myApplications(s.userId), errors: null });
}
