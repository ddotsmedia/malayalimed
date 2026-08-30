// appointments.js — booking, listing, cancellation. Parameterised SQL only.
import { getPool } from '@mm/db';
import { safeQuery } from '@mm/db';
import crypto from 'node:crypto';

const ref = () => `MM${crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 8)}`;

export async function bookAppointment({ doctorId, patientId, slotDate, slotStart, slotEnd, mode = 'in_person', fee, notes }) {
  if (!doctorId || !patientId || !slotDate || !slotStart) return { error: 'missing_fields' };
  try {
    const { rows } = await getPool().query(
      `INSERT INTO appointments (booking_ref, doctor_id, patient_id, slot_date, slot_start, slot_end, mode, fee, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, booking_ref`,
      [ref(), doctorId, patientId, slotDate, slotStart, slotEnd || slotStart, mode, fee || null, notes || null]
    );
    return { id: rows[0].id, bookingRef: rows[0].booking_ref };
  } catch (err) {
    if (String(err.message).includes('uq_appt_slot')) return { error: 'slot_taken' };
    return { error: err.message };
  }
}

export function listForPatient(patientId) {
  return safeQuery(`SELECT a.id, a.booking_ref, a.slot_date, a.slot_start, a.mode, a.status, a.fee,
    d.display_name AS doctor_name, d.slug AS doctor_slug
    FROM appointments a JOIN doctors d ON d.id=a.doctor_id
    WHERE a.patient_id=$1 AND a.deleted_at IS NULL ORDER BY a.slot_date DESC, a.slot_start DESC`, [patientId]);
}

export async function cancelAppointment(id, patientId) {
  const { rowCount } = await getPool().query(
    `UPDATE appointments SET status='cancelled', updated_at=now()
     WHERE id=$1 AND patient_id=$2 AND status='confirmed'`, [id, patientId]);
  return rowCount > 0;
}
