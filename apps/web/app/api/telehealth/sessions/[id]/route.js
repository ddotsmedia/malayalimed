import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSessionRow } from '@/lib/telehealth';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const data = await getSessionRow(id);
  if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data, errors: null });
}
