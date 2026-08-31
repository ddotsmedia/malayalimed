import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { verifyRegistration } from '@/lib/doctorRegistration';
import { audit, reqMeta } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const b = await request.json().catch(() => ({}));
  const res = await verifyRegistration(id, { nmcVerified: b.nmc_verified === true || b.nmcVerified === true, reason: b.reason });
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: res.error === 'not_found' ? 404 : 400 });
  await audit({ actorId: s.userId, action: `doctor_registration.${res.status}`, entityType: 'doctor_registration', entityId: id, newValue: { status: res.status, reason: b.reason }, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null });
}
