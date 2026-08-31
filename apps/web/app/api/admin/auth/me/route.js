import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { one } from '@mm/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ data: null, errors: ['forbidden'] }, { status: 403 });
  const u = await one('SELECT id, full_name, email, role FROM users WHERE id=$1', [s.userId]);
  return NextResponse.json({ data: { ...u, permissions: ['*'] }, errors: null });
}
