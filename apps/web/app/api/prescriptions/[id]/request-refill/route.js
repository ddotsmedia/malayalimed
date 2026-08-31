import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { one, getPool } from '@mm/db';
import { refillRequestSchema, parse } from '@/lib/schemas/patient';

export const dynamic = 'force-dynamic';
const WINDOW_DAYS = 90;

export async function POST(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const v = parse(refillRequestSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const p = await one(`SELECT id, created_at, created_at < now()-($1||' days')::interval AS too_old
    FROM prescriptions WHERE id=$2 AND patient_id=$3 AND deleted_at IS NULL`, [String(WINDOW_DAYS), id, s.userId]);
  if (!p) return NextResponse.json({ errors: ['not_found'] }, { status: 404 });
  if (p.too_old) return NextResponse.json({ errors: ['refill_window_expired'] }, { status: 400 });
  const { rows } = await getPool().query(
    'INSERT INTO prescription_refills (prescription_id, patient_id, reason, status) VALUES ($1,$2,$3,\'requested\') RETURNING id',
    [id, s.userId, v.data.reason || null]);
  // NOTE: doctor notification email is a stub (no email service configured).
  return NextResponse.json({ data: { requestId: rows[0].id, status: 'requested' }, errors: null }, { status: 201 });
}

export async function GET(request, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const { id } = await params;
  const { rows } = await getPool().query(
    'SELECT id, status, reason, created_at FROM prescription_refills WHERE prescription_id=$1 AND patient_id=$2 ORDER BY created_at DESC', [id, s.userId]);
  return NextResponse.json({ data: rows, errors: null });
}
