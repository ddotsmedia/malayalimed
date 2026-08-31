import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { decideDoctor } from '@/lib/admin';
import { audit, reqMeta } from '@/lib/auditLog';
import { verifySchema, parse } from '@/lib/schemas/admin';

export const dynamic = 'force-dynamic';

async function handle(request, params) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  const v = parse(verifySchema, b);
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await decideDoctor(id, v.data.status);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  await audit({ actorId: s.userId, action: `doctor.${v.data.status}`, entityType: 'doctor', entityId: id, newValue: { status: v.data.status, reason: v.data.reason }, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null });
}

export async function PATCH(request, { params }) { return handle(request, params); }
export async function PUT(request, { params }) { return handle(request, params); }
