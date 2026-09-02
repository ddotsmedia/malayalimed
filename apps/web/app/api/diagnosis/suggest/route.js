import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { suggestDiagnosis } from '@/lib/cds';
import { S, parse } from '@/lib/schemas/batch17';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const v = parse(S.diagnose, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await suggestDiagnosis(v.data.symptoms, v.data.encounterId), errors: null }, { status: 201 });
}
