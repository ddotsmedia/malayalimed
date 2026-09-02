import { NextResponse } from 'next/server';
import { drugInteraction } from '@/lib/scribe';

export const dynamic = 'force-dynamic';
export async function GET(request) {
  const u = new URL(request.url).searchParams;
  const d1 = u.get('drug1'), d2 = u.get('drug2');
  if (!d1 || !d2) return NextResponse.json({ errors: ['two_drugs_required'] }, { status: 400 });
  return NextResponse.json({ data: await drugInteraction(d1, d2), errors: null });
}
