import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { conversation, sendMessage, otherUser } from '@/lib/messaging';
import { S, parse } from '@/lib/schemas/batch16';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { peer } = await params;
  const [msgs, who] = await Promise.all([conversation(s.userId, peer), otherUser(peer)]);
  return NextResponse.json({ data: { messages: msgs, peer: who }, errors: null });
}
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { peer } = await params;
  const v = parse(S.message, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await sendMessage(s.userId, peer, v.data.text);
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
