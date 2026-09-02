import { NextResponse } from 'next/server';
import { salaryBenchmark } from '@/lib/jobExtras';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const u = new URL(request.url).searchParams;
  return NextResponse.json({ data: await salaryBenchmark({ specialty: u.get('specialty'), location: u.get('location'), experience: u.get('experience') }), errors: null });
}
