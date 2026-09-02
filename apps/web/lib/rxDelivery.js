import { getPool, safeQuery } from '@mm/db';

export async function orderDelivery(prescriptionId, patientId, deliveryAddress) {
  const { rows } = await getPool().query('INSERT INTO prescription_orders (prescription_id, patient_id, delivery_address, status) VALUES ($1,$2,$3,\'placed\') RETURNING id', [prescriptionId || null, patientId, deliveryAddress]);
  return { id: rows[0].id, status: 'placed' };
}
export function listOrders(patientId) {
  return safeQuery('SELECT id, status, delivery_address, delivered_at, created_at FROM prescription_orders WHERE patient_id=$1 ORDER BY created_at DESC', [patientId]);
}
export async function subscribe(patientId, { subscriptionType, autoRefill }) {
  const { rows } = await getPool().query('INSERT INTO pharmacy_subscriptions (patient_id, subscription_type, next_refill_date, auto_refill, discount_percent) VALUES ($1,$2,current_date+30,$3,10) RETURNING id', [patientId, subscriptionType || 'monthly', autoRefill !== false]);
  return { id: rows[0].id, discountPercent: 10 };
}
// Static price comparison (no live pharmacy network integration).
export function prices() {
  return [
    { network: 'MalayaliMed Pharmacy', discount: '10%', delivery: 'Free over ₹500' },
    { network: 'Partner Network A', discount: '8%', delivery: '₹40' },
    { network: 'Partner Network B', discount: '12%', delivery: '₹60' },
  ];
}
