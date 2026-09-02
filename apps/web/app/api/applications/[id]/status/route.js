import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { updateStatus } from '@/lib/jobApps';
import { S, parse } from '@/lib/schemas/batch18';

export const dynamic = 'force-dynamic';
export async function PUT(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(S.status, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await updateStatus(id, s.userId, v.data.status);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: res.error === 'forbidden' ? 403 : 400 });
  return NextResponse.json({ data: res, errors: null });
}
