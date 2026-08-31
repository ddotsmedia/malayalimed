// hospitalAuth.js — gate for /hospital. hospital_admin (and platform_admin).
import { getSession } from './session.js';
import { one } from '@mm/db';

export async function requireHospital() {
  const s = await getSession();
  if (!s || !['hospital_admin', 'platform_admin'].includes(s.role)) return null;
  const h = await one('SELECT hospital_id FROM hospital_staff WHERE user_id=$1 LIMIT 1', [s.userId]).catch(() => null);
  return { ...s, hospitalId: h ? h.hospital_id : null };
}
