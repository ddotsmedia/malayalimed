import { getPool, safeQuery } from '@mm/db';

export function listTherapists(specialization) {
  const args = []; let where = '1=1';
  if (specialization) { args.push(specialization); where = `$1 = ANY(specialization)`; }
  return safeQuery(`SELECT id, name, specialization, insurance_accepted, hourly_rate, bio FROM therapist_profiles WHERE ${where} ORDER BY hourly_rate NULLS LAST LIMIT 50`, args);
}
export async function bookTherapy(patientId, { therapistId, sessionType, nextSessionDate }) {
  const { rows } = await getPool().query('INSERT INTO therapy_sessions (patient_id, therapist_id, session_type, next_session_date) VALUES ($1,$2,$3,$4) RETURNING id', [patientId, therapistId, sessionType || 'individual', nextSessionDate || null]);
  return { id: rows[0].id };
}
export function listGroups() { return safeQuery('SELECT id, name, condition, meeting_day, meeting_time, members FROM support_groups ORDER BY condition LIMIT 50'); }
export async function joinGroup(id) { await getPool().query('UPDATE support_groups SET members=members+1 WHERE id=$1', [id]); return { ok: true }; }
