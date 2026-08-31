import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { markRead } from '@/lib/messaging';

export const dynamic = 'force-dynamic';
export async function PUT(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  return NextResponse.json({ data: await markRead(id, s.userId), errors: null });
}
