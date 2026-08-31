import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { runImport, listImports, ENTITY_TYPES } from '@/lib/bulkImport';
import { audit, reqMeta } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';
const MAX = 3_000_000;

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const data = await listImports();
  return NextResponse.json({ data, errors: null });
}

export async function POST(request) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  if (!ENTITY_TYPES.includes(b.entityType)) return NextResponse.json({ errors: ['bad_entity'] }, { status: 400 });
  if (!b.csvText || b.csvText.length > MAX) return NextResponse.json({ errors: ['bad_csv'] }, { status: 400 });
  const res = await runImport(s.userId, b.entityType, b.fileName, b.csvText);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  await audit({ actorId: s.userId, action: 'bulk_import', entityType: b.entityType, entityId: res.importId, newValue: { total: res.rowsTotal, success: res.rowsSuccess, failed: res.rowsFailed }, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
