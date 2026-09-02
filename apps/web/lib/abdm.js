import { getPool, safeQuery, one } from '@mm/db';
import { randomBytes } from 'node:crypto';

// NOTE: not connected to the real ABDM/ABHA gateway — this issues a local
// placeholder ABHA-style id for demo. Real ABDM requires gateway certification.
export async function createAccount(patientId) {
  const existing = await one('SELECT abha_id FROM abdm_accounts WHERE patient_id=$1', [patientId]);
  if (existing) return { abhaId: existing.abha_id, already: true };
  const num = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
  const abhaId = num.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
  const { rows } = await getPool().query('INSERT INTO abdm_accounts (patient_id, abha_id, abha_number, auth_token) VALUES ($1,$2,$3,$4) RETURNING id', [patientId, abhaId, num, randomBytes(8).toString('hex')]);
  return { id: rows[0].id, abhaId, note: 'Demo ABHA id (not linked to the live ABDM gateway).' };
}
export function getAccount(patientId) { return one('SELECT id, abha_id, abha_number, created_at FROM abdm_accounts WHERE patient_id=$1', [patientId]); }
export function consents(patientId) { return safeQuery('SELECT id, consent_type, status, valid_until, created_at FROM abdm_consents WHERE patient_id=$1 ORDER BY created_at DESC', [patientId]); }
export async function revokeConsent(id, patientId) {
  const { rowCount } = await getPool().query("UPDATE abdm_consents SET status='revoked' WHERE id=$1 AND patient_id=$2", [id, patientId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export async function shareRecords(patientId, providers) {
  const { rows } = await getPool().query('INSERT INTO abdm_health_records (patient_id, record_type, shared_providers) VALUES ($1,$2,$3) RETURNING id', [patientId, 'summary', providers || []]);
  return { id: rows[0].id };
}
