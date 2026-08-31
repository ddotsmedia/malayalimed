import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { listDoctors } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const status = new URL(request.url).searchParams.get('status') || 'pending';
  const data = await listDoctors(status);
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
