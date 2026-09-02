import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { updateStatus } from '@/lib/conditions';

export const dynamic = 'force-dynamic';
export async function PUT(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  const res = await updateStatus(id, s.userId, b.status || 'active');
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 404 });
  return NextResponse.json({ data: res, errors: null });
}
