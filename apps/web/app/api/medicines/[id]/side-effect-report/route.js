import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { addSideEffect } from '@/lib/knowledge';
import { sideEffectSchema, parse } from '@/lib/schemas/batch19';
export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(sideEffectSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  return NextResponse.json({ data: await addSideEffect(id, s.userId, v.data), errors: null }, { status: 201 });
}
