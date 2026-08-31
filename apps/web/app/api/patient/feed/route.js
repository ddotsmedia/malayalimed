import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { feedPage } from '@/lib/feed';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const u = new URL(request.url).searchParams;
  const page = Number(u.get('page')) || 1;
  const data = await feedPage({ page, limit: 10 });
  return NextResponse.json({ data, meta: { page, count: data.length }, errors: null });
}
