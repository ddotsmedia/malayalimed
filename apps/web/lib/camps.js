import { getPool, safeQuery } from '@mm/db';

export function listCamps() {
  return safeQuery(`SELECT c.id, c.name, c.start_date, c.end_date, c.description, c.free_services, c.registrations, h.name_en AS hospital
    FROM health_camps c LEFT JOIN hospitals h ON h.id=c.hospital_id WHERE c.end_date >= current_date OR c.end_date IS NULL ORDER BY c.start_date LIMIT 100`);
}
export async function registerCamp(campId, userId) {
  const r = await getPool().query('INSERT INTO camp_registrations (camp_id, user_id) VALUES ($1,$2) ON CONFLICT (camp_id, user_id) DO NOTHING RETURNING id', [campId, userId]);
  if (r.rowCount > 0) await getPool().query('UPDATE health_camps SET registrations=registrations+1 WHERE id=$1', [campId]);
  return { ok: true, registered: r.rowCount > 0 };
}
