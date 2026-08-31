import { NextResponse } from 'next/server';
import { todaysTip } from '@/lib/healthTips';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ data: await todaysTip(), errors: null });
}
