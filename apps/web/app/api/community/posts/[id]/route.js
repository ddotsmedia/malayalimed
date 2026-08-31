import { NextResponse } from 'next/server';
import { getPost } from '@/lib/community';

export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const { id } = await params;
  const data = await getPost(id);
  if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data, errors: null });
}
