import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { acceptDiagnosis } from '@/lib/cds';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await acceptDiagnosis(id, b.finalDiagnosis), errors: null });
}
