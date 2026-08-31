// lab.js — lab orders + results.
import { getPool, safeQuery, one } from '@mm/db';

export function patientLabResults(patientId) {
  return safeQuery(`SELECT r.id, r.test_name, r.result_value, r.normal_range, r.pdf_url, r.uploaded_at, o.status AS order_status
    FROM lab_results r JOIN lab_orders o ON o.id=r.order_id
    WHERE o.patient_id=$1 ORDER BY r.uploaded_at DESC`, [patientId]);
}
export function getLabResult(id, patientId) {
  return one(`SELECT r.*, o.patient_id FROM lab_results r JOIN lab_orders o ON o.id=r.order_id
    WHERE r.id=$1 AND ($2::uuid IS NULL OR o.patient_id=$2)`, [id, patientId || null]);
}
export function adminLabOrders() {
  return safeQuery(`SELECT o.id, o.test_names, o.status, o.order_date, o.completed_date, u.full_name AS patient_name, d.display_name AS doctor_name
    FROM lab_orders o LEFT JOIN users u ON u.id=o.patient_id LEFT JOIN doctors d ON d.id=o.doctor_id
    ORDER BY o.order_date DESC LIMIT 300`);
}
export async function markOrderComplete(id) {
  const { rowCount } = await getPool().query("UPDATE lab_orders SET status='completed', completed_date=now() WHERE id=$1", [id]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}
export async function uploadResult({ orderId, testName, resultValue, normalRange, pdfUrl }) {
  const o = await one('SELECT id FROM lab_orders WHERE id=$1', [orderId]);
  if (!o) return { error: 'order_not_found' };
  const { rows } = await getPool().query(
    'INSERT INTO lab_results (order_id, test_name, result_value, normal_range, pdf_url) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [orderId, testName || null, resultValue || null, normalRange || null, pdfUrl || null]);
  await getPool().query("UPDATE lab_orders SET status='completed', completed_date=now() WHERE id=$1", [orderId]);
  return { id: rows[0].id };
}
