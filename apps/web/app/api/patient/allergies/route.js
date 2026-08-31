import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { listAllergies, addAllergy } from '@/lib/patientRecords';
import { allergySchema, parse } from '@/lib/schemas/portal';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await listAllergies(s.userId), errors: null });
}

export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(allergySchema, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await addAllergy(s.userId, v.data);
  return NextResponse.json({ data: res, errors: null }, { status: 201 });
}
