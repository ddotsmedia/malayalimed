import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { certifications, addCertification } from '@/lib/credentials';
import { S, parse } from '@/lib/schemas/batch16';

export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  return NextResponse.json({ data: s.doctorId ? await certifications(s.doctorId) : [], errors: null });
}
export async function POST(request) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  if (!s.doctorId) return NextResponse.json({ errors: ['no_doctor_profile'] }, { status: 400 });
  const v = parse(S.cert, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await addCertification(s.doctorId, v.data), errors: null }, { status: 201 });
}
