import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { listRegistrations } from '@/lib/doctorRegistration';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const u = new URL(request.url).searchParams;
  const data = await listRegistrations(u.get('status'));
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
