import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { adminStats, registrationTrend } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const [stats, trend] = await Promise.all([adminStats(), registrationTrend(30)]);
  return NextResponse.json({ data: { stats, trend }, errors: null });
}
