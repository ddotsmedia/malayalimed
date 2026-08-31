import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { startCall } from '@/lib/messaging';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params; // peer user id
  return NextResponse.json({ data: await startCall(s.userId, id), errors: null }, { status: 201 });
}
