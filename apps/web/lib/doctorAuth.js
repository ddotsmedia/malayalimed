// doctorAuth.js — gate for /doctor. Doctors (and platform_admin as superuser).
import { getSession } from './session.js';
import { one } from '@mm/db';

export async function requireDoctor() {
  const s = await getSession();
  if (!s || !['doctor', 'platform_admin'].includes(s.role)) return null;
  const d = await one('SELECT id FROM doctors WHERE user_id=$1 AND deleted_at IS NULL', [s.userId]);
  return { ...s, doctorId: d ? d.id : null };
}
