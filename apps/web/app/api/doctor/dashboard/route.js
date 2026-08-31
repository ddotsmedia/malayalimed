import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { doctorDashboard, doctorEarnings } from '@/lib/doctorPortal';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const [dash, earnings] = await Promise.all([doctorDashboard(s.doctorId), doctorEarnings(s.doctorId)]);
  return NextResponse.json({ data: { ...dash, earnings }, errors: null });
}
