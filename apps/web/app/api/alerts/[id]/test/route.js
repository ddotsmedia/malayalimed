import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { testAlert } from '@/lib/jobExtras';
export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const res = await testAlert(id, s.userId);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 404 });
  return NextResponse.json({ data: res, errors: null });
}
