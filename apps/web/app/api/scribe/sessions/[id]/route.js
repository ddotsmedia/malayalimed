import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { getSession as getScribe } from '@/lib/scribe';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const data = await getScribe(id);
  if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data, errors: null });
}
