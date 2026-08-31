import { getPool, safeQuery, one } from '@mm/db';

export function doctorSlots(doctorId, date) {
  return safeQuery(`SELECT id, slot_date, start_time, end_time FROM appointment_slots
    WHERE doctor_id=$1 AND is_available=true AND ($2::date IS NULL OR slot_date=$2) ORDER BY slot_date, start_time LIMIT 100`, [doctorId, date || null]);
}
export async function reschedule(appointmentId, patientId, newDate) {
  const appt = await one('SELECT slot_date FROM appointments WHERE id=$1 AND patient_id=$2 AND deleted_at IS NULL', [appointmentId, patientId]);
  if (!appt) return { error: 'not_found' };
  await getPool().query('UPDATE appointments SET slot_date=$1, updated_at=now() WHERE id=$2 AND patient_id=$3', [newDate, appointmentId, patientId]);
  await getPool().query('INSERT INTO appointment_reschedule_requests (appointment_id, old_date, new_date, status) VALUES ($1,$2,$3,$4)', [appointmentId, appt.slot_date, newDate, 'applied']);
  return { ok: true };
}
export async function cancel(appointmentId, patientId) {
  const { rowCount } = await getPool().query("UPDATE appointments SET status='cancelled', updated_at=now() WHERE id=$1 AND patient_id=$2 AND deleted_at IS NULL", [appointmentId, patientId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export async function joinWaitlist(doctorId, patientId, appointmentId) {
  const [c] = await safeQuery('SELECT count(*)::int AS n FROM appointment_waitlist WHERE doctor_id=$1', [doctorId]);
  const { rows } = await getPool().query('INSERT INTO appointment_waitlist (doctor_id, patient_id, appointment_id, position) VALUES ($1,$2,$3,$4) RETURNING id', [doctorId, patientId, appointmentId || null, (c?.n || 0) + 1]);
  return { id: rows[0].id, position: (c?.n || 0) + 1 };
}
export function waitlist(doctorId) {
  return safeQuery('SELECT w.id, w.position, u.full_name FROM appointment_waitlist w JOIN users u ON u.id=w.patient_id WHERE w.doctor_id=$1 ORDER BY w.position', [doctorId]);
}
