import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { saveNotes } from '@/lib/scribe';
import { S, parse } from '@/lib/schemas/batch17';

export const dynamic = 'force-dynamic';
export async function PUT(request, { params }) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const v = parse(S.scribeNotes, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await saveNotes(id, v.data.notesFinal);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
