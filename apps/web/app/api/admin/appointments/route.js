import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { listAppointmentsAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const data = await listAppointmentsAdmin();
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
