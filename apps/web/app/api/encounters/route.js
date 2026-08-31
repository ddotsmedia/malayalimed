import { NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/doctorAuth';
import { createEncounter } from '@/lib/doctorPortal';
import { audit, reqMeta } from '@/lib/auditLog';
import { encounterSchema, parse } from '@/lib/schemas/portal';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const s = await requireDoctor();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  if (!s.doctorId) return NextResponse.json({ errors: ['no_doctor_profile'] }, { status: 400 });
  const v = parse(encounterSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await createEncounter(s.doctorId, v.data);
  await audit({ actorId: s.userId, action: 'encounter.create', entityType: 'encounter', entityId: res.id, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
