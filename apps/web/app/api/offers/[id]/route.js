import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { respondOffer } from '@/lib/interviews';
export const dynamic = 'force-dynamic';
export async function PUT(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  const res = await respondOffer(id, s.userId, b.status || 'accepted');
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 403 });
  return NextResponse.json({ data: res, errors: null });
}
