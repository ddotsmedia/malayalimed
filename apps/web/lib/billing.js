// billing.js — invoices + payments (Razorpay not configured; payment is recorded directly).
import { getPool, safeQuery, one } from '@mm/db';

export function listInvoices(patientId) {
  return safeQuery(`SELECT i.id, i.amount, i.status, i.created_at, i.paid_at, d.display_name AS doctor_name
    FROM invoices i LEFT JOIN doctors d ON d.id=i.doctor_id
    WHERE i.patient_id=$1 ORDER BY i.created_at DESC`, [patientId]);
}
export function getInvoice(id, patientId) {
  return one(`SELECT i.*, d.display_name AS doctor_name FROM invoices i LEFT JOIN doctors d ON d.id=i.doctor_id
    WHERE i.id=$1 AND ($2::uuid IS NULL OR i.patient_id=$2)`, [id, patientId || null]);
}
export function adminListInvoices() {
  return safeQuery(`SELECT i.id, i.amount, i.status, i.created_at, i.paid_at, u.full_name AS patient_name, d.display_name AS doctor_name
    FROM invoices i LEFT JOIN users u ON u.id=i.patient_id LEFT JOIN doctors d ON d.id=i.doctor_id
    ORDER BY i.created_at DESC LIMIT 300`);
}
export async function createInvoice({ patientId, doctorId, appointmentId, amount }) {
  const { rows } = await getPool().query(
    'INSERT INTO invoices (patient_id, doctor_id, appointment_id, amount, status) VALUES ($1,$2,$3,$4,\'pending\') RETURNING id',
    [patientId || null, doctorId || null, appointmentId || null, Number(amount) || 0]);
  return { id: rows[0].id };
}
export async function markPaid(id) {
  const { rowCount } = await getPool().query("UPDATE invoices SET status='paid', paid_at=now() WHERE id=$1 AND status<>'paid'", [id]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found_or_paid' };
}
export async function payBill(invoiceId, patientId, { method = 'card' } = {}) {
  const inv = await one('SELECT id, amount, status FROM invoices WHERE id=$1 AND patient_id=$2', [invoiceId, patientId]);
  if (!inv) return { error: 'not_found' };
  if (inv.status === 'paid') return { error: 'already_paid' };
  const txId = 'MMTX-' + Date.now();
  const { rows } = await getPool().query(
    "INSERT INTO invoice_payments (invoice_id, patient_id, amount, method, transaction_id, status) VALUES ($1,$2,$3,$4,$5,'success') RETURNING id",
    [invoiceId, patientId, inv.amount, method, txId]);
  await getPool().query("UPDATE invoices SET status='paid', paid_at=now() WHERE id=$1", [invoiceId]);
  return { paymentId: rows[0].id, transactionId: txId, status: 'success' };
}
