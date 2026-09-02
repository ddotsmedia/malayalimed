import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getJob, updateJob, deleteJob, logView } from '@/lib/jobsPortal';
import { S, parse } from '@/lib/schemas/batch18';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const { id } = await params;
  const data = await getJob(id);
  if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  const s = await getSession(); logView(id, s?.userId);
  return NextResponse.json({ data, errors: null });
}
export async function PUT(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(S.job, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await updateJob(id, s.userId, v.data);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
export async function DELETE(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const res = await deleteJob(id, s.userId);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
