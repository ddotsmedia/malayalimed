import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { addAward } from '@/lib/credentials';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await requireDoctor();
  if (!s || !s.doctorId) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  if (!b.awardName) return NextResponse.json({ errors: ['awardName_required'] }, { status: 400 });
  return NextResponse.json({ data: await addAward(s.doctorId, b), errors: null }, { status: 201 });
}
