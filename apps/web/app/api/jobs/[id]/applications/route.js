import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { jobApplications } from '@/lib/jobApps';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  return NextResponse.json({ data: await jobApplications(id, s.userId), errors: null });
}
