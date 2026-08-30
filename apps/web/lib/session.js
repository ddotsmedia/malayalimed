// session.js — read the current user session from the access cookie (server).
import { cookies } from 'next/headers';
import { verifyToken, ACCESS_COOKIE } from '@mm/auth';

export async function getSession() {
  const c = (await cookies()).get(ACCESS_COOKIE);
  if (!c) return null;
  const r = verifyToken(c.value);
  return r.valid ? { userId: r.payload.sub, role: r.payload.role } : null;
}
