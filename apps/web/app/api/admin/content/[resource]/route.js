import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { listContent, createContent, resourceDef } from '@/lib/adminContent';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { resource } = await params;
  if (!resourceDef(resource)) return NextResponse.json({ errors: ['bad_resource'] }, { status: 404 });
  const data = await listContent(resource);
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}

export async function POST(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { resource } = await params;
  const body = await request.json().catch(() => ({}));
  const res = await createContent(resource, body);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
