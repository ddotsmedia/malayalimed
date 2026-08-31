import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { decideReview } from '@/lib/admin';
import { audit, reqMeta } from '@/lib/auditLog';
import { reviewModerationSchema, parse } from '@/lib/schemas/admin';
import { getPool } from '@mm/db';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const v = parse(reviewModerationSchema, body);
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await decideReview(id, v.data.status);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: res.error === 'not_found' ? 404 : 400 });
  await audit({ actorId: s.userId, action: `review.${v.data.status}`, entityType: 'review', entityId: id, oldValue: { status: res.before }, newValue: { status: v.data.status, reason: v.data.reason }, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null });
}

export async function DELETE(request, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const { rowCount } = await getPool().query('UPDATE reviews SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL', [id]);
  if (!rowCount) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  await audit({ actorId: s.userId, action: 'review.delete', entityType: 'review', entityId: id, ...reqMeta(request) });
  return NextResponse.json({ data: { ok: true }, errors: null });
}
