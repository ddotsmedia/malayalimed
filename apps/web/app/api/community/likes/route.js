import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { like } from '@/lib/community';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  if (!b.postId) return NextResponse.json({ errors: ['postId_required'] }, { status: 400 });
  return NextResponse.json({ data: await like(b.postId, s.userId), errors: null }, { status: 201 });
}
