import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { interpretLab } from '@/lib/cds';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await interpretLab(b.labResultId, b.value, b.testName), errors: null }, { status: 201 });
}
