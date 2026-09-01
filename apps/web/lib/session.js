// session.js — read the current user session from the access cookie, or an
// Authorization: Bearer <token> header as a fallback (same signed access JWT).
import { cookies, headers } from 'next/headers';
import { verifyToken, ACCESS_COOKIE } from '@mm/auth';

export async function getSession() {
  let token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) {
    const auth = (await headers()).get('authorization') || '';
    if (auth.toLowerCase().startsWith('bearer ')) token = auth.slice(7).trim();
  }
  if (!token) return null;
  const r = verifyToken(token);
  return r.valid ? { userId: r.payload.sub, role: r.payload.role } : null;
}
