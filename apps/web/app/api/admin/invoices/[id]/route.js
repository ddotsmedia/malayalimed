import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { markPaid } from '@/lib/billing';
import { audit, reqMeta } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const res = await markPaid(id);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  await audit({ actorId: s.userId, action: 'invoice.mark_paid', entityType: 'invoice', entityId: id, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null });
}
