import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listPosts, createPost } from '@/lib/community';
import { S, parse } from '@/lib/schemas/batch16';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const page = Number(new URL(request.url).searchParams.get('page')) || 1;
  const data = await listPosts({ page });
  return NextResponse.json({ data, meta: { page, count: data.length }, errors: null });
}
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.post, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await createPost(s.userId, v.data), errors: null }, { status: 201 });
}
