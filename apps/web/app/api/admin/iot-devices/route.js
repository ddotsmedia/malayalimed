import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { adminDevices } from '@/lib/iot';

export const dynamic = 'force-dynamic';
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  return NextResponse.json({ data: await adminDevices(), errors: null });
}
