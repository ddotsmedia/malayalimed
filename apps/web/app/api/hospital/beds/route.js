import { NextResponse } from 'next/server';
import { requireHospital } from '@/lib/hospitalAuth';
import { listBeds, addBed } from '@/lib/beds';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await requireHospital();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  return NextResponse.json({ data: await listBeds(s.hospitalId), errors: null });
}

export async function POST(request) {
  const s = await requireHospital();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  if (!b.bedNumber) return NextResponse.json({ errors: ['bed_number_required'] }, { status: 400 });
  const res = await addBed({ hospitalId: s.hospitalId, bedNumber: b.bedNumber, floor: b.floor });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
