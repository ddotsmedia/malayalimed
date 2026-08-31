// adminAuth.js — gate for /admin. platform_admin only.
import { getSession } from './session.js';

export async function requireAdmin() {
  const s = await getSession();
  return s && s.role === 'platform_admin' ? s : null;
}
