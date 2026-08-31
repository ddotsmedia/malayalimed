// prescriptions.js — patient prescription upload/management (existing table 0016 + 0042 cols).
import { getPool, safeQuery, one } from '@mm/db';

const MAX_FILE = 1_600_000; // ~1.6MB data URI cap (stored in DB; no S3 configured)

export function listPrescriptions(patientId, { page = 1, limit = 20 } = {}) {
  return safeQuery(`SELECT p.id, p.prescription_text, p.medicines, p.file_name, p.issued_at, p.expires_at, p.created_at,
      d.display_name AS doctor_name
    FROM prescriptions p LEFT JOIN doctors d ON d.id=p.doctor_id
    WHERE p.patient_id=$1 AND p.deleted_at IS NULL
    ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`, [patientId, limit, (Math.max(1, page) - 1) * limit]);
}

export function getPrescription(id, userId) {
  return one(`SELECT p.*, d.display_name AS doctor_name FROM prescriptions p
    LEFT JOIN doctors d ON d.id=p.doctor_id
    WHERE p.id=$1 AND p.deleted_at IS NULL AND (p.patient_id=$2 OR d.user_id=$2)`, [id, userId]);
}

export async function createPrescription(patientId, { doctorId, prescriptionText, medicines, fileName, fileDataUrl }) {
  if (fileDataUrl && fileDataUrl.length > MAX_FILE) return { error: 'file_too_large' };
  try {
    const { rows } = await getPool().query(
      `INSERT INTO prescriptions (patient_id, doctor_id, prescription_text, medicines, file_name, file_url, medications, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,'[]'::jsonb, now()+interval '180 days') RETURNING id`,
      [patientId, doctorId || null, prescriptionText || null,
        Array.isArray(medicines) ? medicines : null, fileName || null, fileDataUrl || null]);
    return { id: rows[0].id };
  } catch (err) { return { error: err.message }; }
}

export async function deletePrescription(id, userId) {
  const p = await one('SELECT p.id FROM prescriptions p LEFT JOIN doctors d ON d.id=p.doctor_id WHERE p.id=$1 AND p.deleted_at IS NULL AND (p.patient_id=$2 OR d.user_id=$2)', [id, userId]);
  if (!p) return { error: 'not_found' };
  await getPool().query('UPDATE prescriptions SET deleted_at=now() WHERE id=$1', [id]);
  return { ok: true };
}

export async function requestRefill(prescriptionId, patientId) {
  const p = await one('SELECT id FROM prescriptions WHERE id=$1 AND patient_id=$2 AND deleted_at IS NULL', [prescriptionId, patientId]);
  if (!p) return { error: 'not_found' };
  const { rows } = await getPool().query(
    'INSERT INTO prescription_refills (prescription_id, patient_id) VALUES ($1,$2) RETURNING id', [prescriptionId, patientId]);
  return { id: rows[0].id, status: 'requested' };
}
