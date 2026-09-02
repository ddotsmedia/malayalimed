import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { searchJobs, createJob } from '@/lib/jobsPortal';
import { logSearch } from '@/lib/jobExtras';
import { S, parse } from '@/lib/schemas/batch18';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const f = Object.fromEntries(u.entries());
  const data = await searchJobs(f);
  if (f.q) { const s = await getSession(); logSearch(s?.userId, f.q, data.length); }
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.job, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await createJob(s.userId, v.data), errors: null }, { status: 201 });
}
