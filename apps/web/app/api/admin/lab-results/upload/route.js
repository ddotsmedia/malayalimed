import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { uploadResult } from '@/lib/lab';
import { audit, reqMeta } from '@/lib/auditLog';
import { labUploadSchema, parse } from '@/lib/schemas/portal';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const v = parse(labUploadSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await uploadResult(v.data);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  await audit({ actorId: s.userId, action: 'lab_result.upload', entityType: 'lab_result', entityId: res.id, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
