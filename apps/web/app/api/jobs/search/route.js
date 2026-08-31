import { NextResponse } from 'next/server';
import { searchJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const f = Object.fromEntries(u.entries());
  const data = await searchJobs(f);
  return NextResponse.json({ data, meta: { count: data.length, page: Number(f.page) || 1 }, errors: null });
}
