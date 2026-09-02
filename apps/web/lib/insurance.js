import { getPool, safeQuery, one } from '@mm/db';

// NOTE: no live insurer/eligibility API — verify returns the stored policy and a
// locally-computed copay; not a real-time payer check.
export function getInsurance(patientId) {
  return safeQuery('SELECT id, insurer_name, policy_number, plan_name, copay, deductible, coverage_limit, active FROM patient_insurance WHERE patient_id=$1 ORDER BY created_at DESC', [patientId]);
}
export async function addInsurance(patientId, b) {
  const { rows } = await getPool().query(
    'INSERT INTO patient_insurance (patient_id, insurer_name, policy_number, plan_name, copay, deductible, coverage_limit) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
    [patientId, b.insurerName, b.policyNumber || null, b.planName || null, b.copay ?? null, b.deductible ?? null, b.coverageLimit ?? null]);
  return { id: rows[0].id };
}
export async function verify(patientId) {
  const pol = await one('SELECT insurer_name, plan_name, copay, deductible, coverage_limit, active FROM patient_insurance WHERE patient_id=$1 AND active=true ORDER BY created_at DESC LIMIT 1', [patientId]);
  if (!pol) return { eligible: false, reason: 'no_active_policy' };
  return { eligible: true, insurer: pol.insurer_name, plan: pol.plan_name, copay: pol.copay, deductible: pol.deductible, coverageLimit: pol.coverage_limit, note: 'Verified against stored policy (no live payer connection).' };
}
export async function copay(patientId, service) {
  const pol = await one('SELECT copay FROM patient_insurance WHERE patient_id=$1 AND active=true ORDER BY created_at DESC LIMIT 1', [patientId]);
  const base = { consultation: 500, lab: 300, procedure: 2000 }[service] || 500;
  const c = pol?.copay != null ? Number(pol.copay) : base;
  return { service: service || 'consultation', estimatedCost: base, copay: c, youPay: c };
}
export async function submitPriorAuth(doctorId, { patientId, serviceType }) {
  const { rows } = await getPool().query('INSERT INTO prior_auth_requests (doctor_id, patient_id, service_type, status) VALUES ($1,$2,$3,\'submitted\') RETURNING id', [doctorId, patientId, serviceType]);
  return { id: rows[0].id, status: 'submitted' };
}
export function priorAuthList(doctorId) {
  return safeQuery('SELECT pa.id, pa.service_type, pa.status, pa.created_at, u.full_name AS patient FROM prior_auth_requests pa LEFT JOIN users u ON u.id=pa.patient_id WHERE pa.doctor_id=$1 ORDER BY pa.created_at DESC', [doctorId]);
}
export function priorAuthStatus(id) { return one('SELECT id, service_type, status, insurer_response, created_at FROM prior_auth_requests WHERE id=$1', [id]); }
