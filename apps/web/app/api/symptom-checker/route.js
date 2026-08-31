import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { runCheck } from '@/lib/symptomChecker';
import { symptomSchema, parse } from '@/lib/schemas/patient';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const s = await getSession();
  const b = await request.json().catch(() => ({}));
  const v = parse(symptomSchema, { symptoms: b.symptoms });
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await runCheck(s?.userId || null, v.data.symptoms);
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 400 });
  return NextResponse.json({ data: res, errors: null });
}
