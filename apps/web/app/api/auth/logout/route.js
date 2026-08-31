import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@mm/auth';

export const dynamic = 'force-dynamic';

function clear(res) {
  const opts = { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0, secure: process.env.NODE_ENV === 'production' };
  res.cookies.set(ACCESS_COOKIE, '', opts);
  res.cookies.set(REFRESH_COOKIE, '', opts);
  return res;
}

export async function GET(request) {
  const url = new URL(request.url);
  return clear(NextResponse.redirect(new URL(`/${process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'ml'}`, url.origin)));
}
export async function POST() { return clear(NextResponse.json({ data: { ok: true }, errors: null })); }
