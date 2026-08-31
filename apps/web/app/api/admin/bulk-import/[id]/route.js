import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getImport } from '@/lib/bulkImport';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const data = await getImport(id);
  if (!data) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data, errors: null });
}
