import { getPool, safeQuery, one } from '@mm/db';

export function getSessionRow(id) { return one('SELECT * FROM telehealth_sessions WHERE id=$1', [id]); }
export function sessionVitals(sessionId) {
  return safeQuery('SELECT id, metric_type, value, recorded_at FROM session_vitals WHERE session_id=$1 ORDER BY recorded_at DESC', [sessionId]);
}
export async function endSession(id) {
  const { rowCount } = await getPool().query("UPDATE telehealth_sessions SET ended_at=now(), duration_minutes=GREATEST(0, EXTRACT(EPOCH FROM (now()-started_at))/60)::int WHERE id=$1 AND ended_at IS NULL", [id]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found_or_ended' };
}
export async function scheduleFollowUp(patientId, { appointmentId, followUpDate, notes }) {
  const { rows } = await getPool().query('INSERT INTO follow_up_schedules (appointment_id, patient_id, follow_up_date, notes) VALUES ($1,$2,$3,$4) RETURNING id', [appointmentId || null, patientId, followUpDate, notes || null]);
  return { id: rows[0].id };
}
export function followUps(patientId) {
  return safeQuery('SELECT id, follow_up_date, notes, status, created_at FROM follow_up_schedules WHERE patient_id=$1 ORDER BY follow_up_date DESC', [patientId]);
}
