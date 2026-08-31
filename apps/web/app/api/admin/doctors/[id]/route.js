import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { decideDoctor } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  const res = await decideDoctor(id, b.status);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
