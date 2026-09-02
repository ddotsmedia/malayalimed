import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { startSession } from '@/lib/scribe';
import { S, parse } from '@/lib/schemas/batch17';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await requireDoctor();
  if (!s || !s.doctorId) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const v = parse(S.scribeStart, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await startSession(s.doctorId, v.data), errors: null }, { status: 201 });
}
