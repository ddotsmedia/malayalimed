import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { adminListInvoices, createInvoice } from '@/lib/billing';
import { audit, reqMeta } from '@/lib/auditLog';
import { invoiceSchema, parse } from '@/lib/schemas/portal';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const data = await adminListInvoices();
  return NextResponse.json({ data, errors: null });
}

export async function POST(request) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const v = parse(invoiceSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await createInvoice(v.data);
  await audit({ actorId: s.userId, action: 'invoice.create', entityType: 'invoice', entityId: res.id, newValue: v.data, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
