import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createReferral } from '@/lib/referrals';
import { S, parse } from '@/lib/schemas/batch16';

export const dynamic = 'force-dynamic';
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const v = parse(S.referralShare, await request.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ errors: [v.error] }, { status: 400 });
  const res = await createReferral(s.userId, v.data.email);
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://malayalimed.com';
  return NextResponse.json({ data: { ...res, link: `${base}/ml/register?ref=${res.code}` }, errors: null }, { status: 201 });
}
