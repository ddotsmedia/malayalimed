import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { adminStats, registrationTrend, appointmentTrend, ratingDistribution, appointmentsByStatus, usersByRole } from '@/lib/admin';
import { listAppointmentsAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const [kpis, regTrend, apptTrend, ratingDist, apptStatus, roles, recent] = await Promise.all([
    adminStats(), registrationTrend(30), appointmentTrend(30), ratingDistribution(), appointmentsByStatus(), usersByRole(), listAppointmentsAdmin(),
  ]);
  return NextResponse.json({
    data: { kpis, charts: { regTrend, apptTrend, ratingDist, apptStatus, roles }, recentActivities: recent.slice(0, 10) },
    errors: null,
  });
}
