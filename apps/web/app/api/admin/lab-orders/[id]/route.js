import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { markOrderComplete } from '@/lib/lab';
import { audit, reqMeta } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const res = await markOrderComplete(id);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  await audit({ actorId: s.userId, action: 'lab_order.complete', entityType: 'lab_order', entityId: id, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null });
}
