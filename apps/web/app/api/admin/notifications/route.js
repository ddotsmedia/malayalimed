import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { adminStats } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const s = await adminStats();
  return NextResponse.json({
    data: { doctors_pending: s.doctors_pending || 0, reviews_pending: s.reviews_pending || 0, users_today: s.users_today || 0, appts_today: s.appts_today || 0 },
    errors: null,
  });
}
