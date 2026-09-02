import { NextResponse } from 'next/server';
import { salaryBenchmark } from '@/lib/jobExtras';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const rows = await salaryBenchmark({ specialty: u.get('specialty'), location: u.get('location') });
  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + Number(r.salary_median), 0) / rows.length) : 0;
  return NextResponse.json({ data: { rows, medianAcross: avg, generatedAt: new Date().toISOString() }, errors: null });
}
