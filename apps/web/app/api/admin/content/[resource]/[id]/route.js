import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { deleteContent, updateContent, getContent } from '@/lib/adminContent';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { resource, id } = await params;
  const row = await getContent(resource, id);
  if (!row) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data: row, errors: null });
}

export async function PUT(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { resource, id } = await params;
  const body = await request.json().catch(() => ({}));
  const res = await updateContent(resource, id, body);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}

export async function DELETE(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { resource, id } = await params;
  const res = await deleteContent(resource, id);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
