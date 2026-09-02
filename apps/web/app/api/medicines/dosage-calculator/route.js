import { NextResponse } from 'next/server';
import { dosageCalc } from '@/lib/knowledge';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const u = new URL(request.url).searchParams;
  if (!u.get('med')) return NextResponse.json({ errors: ['med_required'] }, { status: 400 });
  const res = await dosageCalc(u.get('med'), u.get('weight'), u.get('age'));
  if (res.error) return NextResponse.json({ errors: [res.error] }, { status: 404 });
  return NextResponse.json({ data: res, errors: null });
}
