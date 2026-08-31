import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listComments, addComment } from '@/lib/community';
import { S, parse } from '@/lib/schemas/batch16';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const { id } = await params;
  return NextResponse.json({ data: await listComments(id), errors: null });
}
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(S.comment, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await addComment(id, s.userId, v.data.comment), errors: null }, { status: 201 });
}
