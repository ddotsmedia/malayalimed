import { NextResponse } from 'next/server';
import { listJourneys } from '@/lib/journeys';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ data: await listJourneys(), errors: null });
}
