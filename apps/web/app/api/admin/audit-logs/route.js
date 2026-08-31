import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { listAuditLogs } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!(await requireAdmin())) return NextResponse.json({ errors: ['forbidden'] }, { status: 403 });
  const u = new URL(request.url).searchParams;
  const data = await listAuditLogs({ action: u.get('action'), entityType: u.get('entityType'), actorEmail: u.get('actorEmail'), page: Number(u.get('page')) || 1, limit: Number(u.get('limit')) || 50 });
  return NextResponse.json({ data, meta: { count: data.length }, errors: null });
}
