import { NextResponse } from 'next/server';
import { submitRegistration } from '@/lib/doctorRegistration';
import { doctorRegSchema, parse } from '@/lib/schemas/patient';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const b = await request.json().catch(() => ({}));
  const v = parse(doctorRegSchema, b);
  if (!v.ok) return NextResponse.json({ data: null, errors: [v.error] }, { status: 400 });
  const res = await submitRegistration(v.data);
  if (res.error) return NextResponse.json({ data: null, errors: [res.error] }, { status: res.error.endsWith('_taken') ? 409 : 400 });
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
