import { NextResponse } from 'next/server';
import { one } from '@mm/db';
import { verifyPassword, signAccess, ACCESS_COOKIE, ACCESS_TTL } from '@mm/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const b = await request.json().catch(() => ({}));
  if (!b.email || !b.password) return NextResponse.json({ data: null, errors: ['missing_credentials'] }, { status: 400 });
  const user = await one('SELECT id, role, email, password_hash FROM users WHERE lower(email)=lower($1) AND deleted_at IS NULL', [b.email]);
  if (!user || !user.password_hash || !verifyPassword(b.password, user.password_hash)) {
    return NextResponse.json({ data: null, errors: ['invalid_credentials'] }, { status: 401 });
  }
  const token = signAccess(user);
  const res = NextResponse.json({ data: { token, user: { id: user.id, role: user.role, email: user.email } }, errors: null });
  res.cookies.set(ACCESS_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: ACCESS_TTL });
  return res;
}
