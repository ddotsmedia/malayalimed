import { NextResponse } from 'next/server';
import { getCondition } from '@/lib/knowledge';
import { safeQuery } from '@mm/db';
export const dynamic = 'force-dynamic';
export async function GET(request, { params }) {
  const { condition } = await params;
  const c = await getCondition(decodeURIComponent(condition));
  if (!c) return NextResponse.json({ data: [], errors: null });
  const data = await safeQuery('SELECT id, test_name, category, cost FROM lab_test_library WHERE test_name = ANY($1) ORDER BY test_name', [c.diagnosis_tests || []]);
  return NextResponse.json({ data, errors: null });
}
