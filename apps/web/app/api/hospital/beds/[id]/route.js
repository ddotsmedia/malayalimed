import { NextResponse } from 'next/server';
import { requireHospital } from '@/lib/hospitalAuth';
import { updateBedStatus } from '@/lib/beds';
import { bedSchema, parse } from '@/lib/schemas/portal';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const s = await requireHospital();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const v = parse(bedSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await updateBedStatus(id, v.data.status, v.data.patientId);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
