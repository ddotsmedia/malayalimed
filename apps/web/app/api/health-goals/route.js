import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { addGoal, listGoals } from '@/lib/healthMetrics';
import { goalSchema, parse } from '@/lib/schemas/patient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const data = await listGoals(s.userId);
  return NextResponse.json({ data, errors: null });
}

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(goalSchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await addGoal(s.userId, v.data);
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
