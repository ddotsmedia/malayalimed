import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { apply } from '@/lib/jobApps';
import { S, parse } from '@/lib/schemas/batch18';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(S.apply, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await apply(id, s.userId, v.data);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
