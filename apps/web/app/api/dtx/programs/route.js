import { NextResponse } from 'next/server';
import { listPrograms } from '@/lib/dtx';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ data: await listPrograms(), errors: null });
}
