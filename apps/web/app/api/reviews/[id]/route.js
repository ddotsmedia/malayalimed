import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { deleteReview } from '@/lib/reviews';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const res = await deleteReview(id, s.userId, s.role === 'platform_admin');
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: res.error === 'forbidden' ? 403 : 400 });
  return NextResponse.json({ data: res, errors: null });
}
