import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { signSession } from '@/lib/scribe';
import { audit, reqMeta } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';
export async function POST(request, { params }) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const res = await signSession(id);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  await audit({ actorId: s.userId, action: 'scribe.sign', entityType: 'scribe_session', entityId: id, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null });
}
