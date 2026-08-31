import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { doctorPatients } from '@/lib/doctorPortal';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  return NextResponse.json({ data: await doctorPatients(s.doctorId), errors: null });
}
