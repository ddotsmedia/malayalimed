import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { registerCamp } from '@/lib/camps';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  return NextResponse.json({ data: await registerCamp(id, s.userId), errors: null }, { status: 201 });
}
