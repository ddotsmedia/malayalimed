import { getPool, safeQuery, one } from '@mm/db';

export function listConditions(patientId) {
  return safeQuery('SELECT id, condition_name, icd10_code, diagnosis_date, status, created_at FROM patient_conditions WHERE patient_id=$1 ORDER BY created_at DESC', [patientId]);
}
export async function addCondition(patientId, { conditionName, icd10Code, diagnosisDate }) {
  const { rows } = await getPool().query('INSERT INTO patient_conditions (patient_id, condition_name, icd10_code, diagnosis_date) VALUES ($1,$2,$3,$4) RETURNING id', [patientId, conditionName, icd10Code || null, diagnosisDate || null]);
  return { id: rows[0].id };
}
export async function updateStatus(id, patientId, status) {
  const { rowCount } = await getPool().query('UPDATE patient_conditions SET status=$1 WHERE id=$2 AND patient_id=$3', [status, id, patientId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export async function addMedication(conditionId, { medicationName, dosage, frequency }) {
  const { rows } = await getPool().query('INSERT INTO condition_medications (condition_id, medication_name, dosage, frequency, start_date) VALUES ($1,$2,$3,$4,current_date) RETURNING id', [conditionId, medicationName, dosage || null, frequency || null]);
  return { id: rows[0].id };
}
export async function carePlan(conditionId, patientId) {
  const condition = await one('SELECT * FROM patient_conditions WHERE id=$1 AND patient_id=$2', [conditionId, patientId]);
  if (!condition) return null;
  const [meds, labs] = await Promise.all([
    safeQuery('SELECT id, medication_name, dosage, frequency FROM condition_medications WHERE condition_id=$1', [conditionId]),
    safeQuery('SELECT id, lab_name, target_value, last_value, last_test_date, next_due_date FROM condition_labs WHERE condition_id=$1', [conditionId]),
  ]);
  return { condition, medications: meds, labs };
}
