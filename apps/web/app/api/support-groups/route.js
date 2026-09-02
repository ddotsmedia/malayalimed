import { NextResponse } from 'next/server';
import { listGroups } from '@/lib/behavioral';

export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ data: await listGroups(), errors: null });
}
