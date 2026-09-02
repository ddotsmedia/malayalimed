import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { confirmInterview } from '@/lib/interviews';
export const dynamic = 'force-dynamic';
export async function PUT(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await confirmInterview(id, b.status), errors: null });
}
