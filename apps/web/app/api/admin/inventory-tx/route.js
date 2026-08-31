import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { inventoryTx } from '@/lib/pharmacy';
import { audit, reqMeta } from '@/lib/auditLog';
import { inventoryTxSchema, parse } from '@/lib/schemas/portal';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const v = parse(inventoryTxSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await inventoryTx(v.data);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  await audit({ actorId: s.userId, action: 'inventory.' + v.data.txType, entityType: 'inventory', entityId: v.data.inventoryId, newValue: v.data, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
