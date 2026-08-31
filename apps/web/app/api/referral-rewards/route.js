import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { rewards, rewardTotal } from '@/lib/referrals';

export const dynamic = 'force-dynamic';
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ errors: ['unauthenticated'] }, { status: 401 });
  const [list, total] = await Promise.all([rewards(s.userId), rewardTotal(s.userId)]);
  return NextResponse.json({ data: { rewards: list, total }, errors: null });
}
