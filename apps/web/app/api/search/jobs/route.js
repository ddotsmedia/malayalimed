import { NextResponse } from 'next/server';
import { searchJobs } from '@/lib/jobsPortal';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const f = Object.fromEntries(new URL(request.url).searchParams.entries());
  return NextResponse.json({ data: await searchJobs(f), errors: null });
}
