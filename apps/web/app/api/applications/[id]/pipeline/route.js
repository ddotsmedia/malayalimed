import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { pipeline, applicationDetail } from '@/lib/jobApps';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const app = await applicationDetail(id, s.userId);
  if (!app) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data: { application: app, pipeline: await pipeline(id) }, errors: null });
}
