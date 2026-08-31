import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { adminStats, registrationTrend, appointmentTrend, ratingDistribution, appointmentsByStatus, usersByRole, topDoctorsByRating } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const [stats, regTrend, apptTrend, ratingDist, apptStatus, roles, topDoctors] = await Promise.all([
    adminStats(), registrationTrend(90), appointmentTrend(30), ratingDistribution(), appointmentsByStatus(), usersByRole(), topDoctorsByRating(10),
  ]);
  return NextResponse.json({ data: { stats, regTrend, apptTrend, ratingDist, apptStatus, roles, topDoctors }, errors: null });
}
