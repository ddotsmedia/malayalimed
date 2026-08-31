import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { unlike } from '@/lib/community';

export const dynamic = 'force-dynamic';
export async function DELETE(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { postId } = await params;
  return NextResponse.json({ data: await unlike(postId, s.userId), errors: null });
}
