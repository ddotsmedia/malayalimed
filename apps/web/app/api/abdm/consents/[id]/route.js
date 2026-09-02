import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { revokeConsent } from '@/lib/abdm';

export const dynamic = 'force-dynamic';
export async function DELETE(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const res = await revokeConsent(id, s.userId);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 404 });
  return NextResponse.json({ data: res, errors: null });
}
