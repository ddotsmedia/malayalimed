import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getUserDetail, updateUser } from '@/lib/admin';
import { audit, reqMeta } from '@/lib/auditLog';
import { userSchema, parse } from '@/lib/schemas/admin';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  const u = await getUserDetail(id);
  if (!u) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data: u, errors: null });
}

export async function PUT(request, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const { id } = await params;
  if (id === s.userId) return NextResponse.json({ errors: ['cannot_modify_self'] }, { status: 400 });
  const body = await request.json().catch(() => ({}));
  const v = parse(userSchema, body);
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const before = await getUserDetail(id);
  const res = await updateUser(id, v.data);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: res.error === 'not_found' ? 404 : 400 });
  await audit({ actorId: s.userId, action: 'user.update', entityType: 'user', entityId: id, oldValue: before && { role: before.role, status: before.status }, newValue: v.data, ...reqMeta(request) });
  return NextResponse.json({ data: res, errors: null });
}
