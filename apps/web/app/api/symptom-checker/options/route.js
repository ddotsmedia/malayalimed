import { NextResponse } from 'next/server';
import { listSymptomOptions } from '@/lib/symptomChecker';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ data: await listSymptomOptions(), errors: null });
}
