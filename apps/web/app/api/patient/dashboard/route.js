import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { dashboard } from '@/lib/patientDashboard';
import { todaysTip } from '@/lib/healthTips';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const [data, tip] = await Promise.all([dashboard(s.userId), todaysTip()]);
  return NextResponse.json({ data: { ...data, tip }, errors: null });
}
