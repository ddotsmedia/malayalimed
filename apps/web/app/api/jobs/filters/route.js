import { NextResponse } from 'next/server';
import { jobFilters } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ data: await jobFilters(), errors: null });
}
