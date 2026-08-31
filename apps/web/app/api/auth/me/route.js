import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { one } from '@mm/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ data: null, errors: ['unauthenticated'] }, { status: 401 });
  const user = await one(
    'SELECT id, full_name, email, phone, role, locale, email_verified, phone_verified, created_at FROM users WHERE id=$1 AND deleted_at IS NULL',
    [s.userId]);
  if (!user) return NextResponse.json({ data: null, errors: ['not_found'] }, { status: 404 });
  return NextResponse.json({ data: user, errors: null });
}
