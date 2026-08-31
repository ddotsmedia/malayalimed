import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { deleteContent } from '@/lib/adminContent';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { resource, id } = await params;
  const res = await deleteContent(resource, id);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
