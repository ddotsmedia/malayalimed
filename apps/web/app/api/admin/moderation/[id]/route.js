import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { decideModeration } from '@/lib/moderation';
import { audit, reqMeta } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  if (!['review', 'question'].includes(b.contentType)) return NextResponse.json({ errors: ['bad_type'] }, { status: 400 });
  const res = await decideModeration(b.contentType, id, b.approve === true);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  await audit({ actorId: s.userId, action: `moderation.${b.approve ? 'approve' : 'reject'}`, entityType: b.contentType, entityId: id, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null });
}
