import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { completeModule } from '@/lib/dtx';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id, num } = await params;
  const res = await completeModule(id, s.userId, num);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 404 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
