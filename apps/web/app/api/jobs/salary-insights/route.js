import { NextResponse } from 'next/server';
import { salaryInsights } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const u = new URL(request.url).searchParams;
  return NextResponse.json({ data: await salaryInsights(u.get('specialty'), u.get('district')), errors: null });
}
