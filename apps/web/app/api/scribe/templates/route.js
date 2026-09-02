import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { addTemplate, listTemplates } from '@/lib/scribe';
import { S, parse } from '@/lib/schemas/batch17';

export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  return NextResponse.json({ data: s.doctorId ? await listTemplates(s.doctorId) : [], errors: null });
}
export async function POST(request) {
  const s = await requireDoctor();
  if (!s || !s.doctorId) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const v = parse(S.template, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await addTemplate(s.doctorId, v.data), errors: null }, { status: 201 });
}
