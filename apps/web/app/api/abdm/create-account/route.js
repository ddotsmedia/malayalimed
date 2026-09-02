import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createAccount } from '@/lib/abdm';

export const dynamic = 'force-dynamic';
export async function POST() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  return NextResponse.json({ data: await createAccount(s.userId), errors: null }, { status: 201 });
}
