// patientRecords.js — medical history, allergies, chronic conditions.
import { getPool, safeQuery } from '@mm/db';

export async function medicalHistory(patientId) {
  const [history, allergies, chronic] = await Promise.all([
    safeQuery('SELECT id, record_type, title, data, created_at FROM patient_medical_history WHERE patient_id=$1 ORDER BY created_at DESC', [patientId]),
    safeQuery('SELECT id, allergen, reaction, severity, created_at FROM allergies WHERE patient_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC', [patientId]),
    safeQuery('SELECT id, condition, diagnosed_date, status, created_at FROM chronic_conditions WHERE patient_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC', [patientId]),
  ]);
  return { history, allergies, chronic };
}
export function listAllergies(patientId) {
  return safeQuery('SELECT id, allergen, reaction, severity, created_at FROM allergies WHERE patient_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC', [patientId]);
}
export async function addAllergy(patientId, { allergen, reaction, severity }) {
  const { rows } = await getPool().query(
    'INSERT INTO allergies (patient_id, allergen, reaction, severity) VALUES ($1,$2,$3,$4) RETURNING id',
    [patientId, allergen, reaction || null, severity || 'mild']);
  return { id: rows[0].id };
}
