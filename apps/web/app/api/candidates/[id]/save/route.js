import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { save, unsave } from '@/lib/candidates';
export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  return NextResponse.json({ data: await save(s.userId, id), errors: null }, { status: 201 });
}
export async function DELETE(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  return NextResponse.json({ data: await unsave(s.userId, id), errors: null });
}
