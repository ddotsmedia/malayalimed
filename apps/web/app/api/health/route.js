import { NextResponse } from 'next/server';
import { getPool } from '@mm/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  let db = 'error';
  try { await getPool().query('SELECT 1'); db = 'ok'; } catch { /* down */ }
  const ok = db === 'ok';
  return NextResponse.json(
    { status: ok ? 'ok' : 'degraded', timestamp: new Date().toISOString(), checks: { database: db } },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } });
}
