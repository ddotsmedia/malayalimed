import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPrescription, deletePrescription } from '@/lib/prescriptions';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const p = await getPrescription(id, s.userId);
  if (!p) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data: p, errors: null });
}

export async function DELETE(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const res = await deletePrescription(id, s.userId);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 404 });
  return NextResponse.json({ data: res, errors: null });
}
