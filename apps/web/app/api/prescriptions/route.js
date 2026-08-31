import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listPrescriptions, createPrescription } from '@/lib/prescriptions';
import { prescriptionSchema, parse } from '@/lib/schemas/patient';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const u = new URL(request.url).searchParams;
  const data = await listPrescriptions(s.userId, { page: Number(u.get('page')) || 1, limit: Number(u.get('limit')) || 20 });
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const v = parse(prescriptionSchema, { doctorId: b.doctorId, prescriptionText: b.prescriptionText, medicines: b.medicines, fileName: b.fileName });
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await createPrescription(s.userId, { ...v.data, fileDataUrl: b.fileDataUrl });
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  const { evaluateBadges } = await import('@/lib/badges');
  evaluateBadges(s.userId).catch(() => {});
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
