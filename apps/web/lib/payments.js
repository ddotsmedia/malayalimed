// payments.js — Stripe integration via the REST API using global fetch (NO
// @stripe package). Uses Checkout Sessions (redirect flow — no client JS lib
// needed). Without STRIPE_SECRET_KEY it runs in a 'simulated' mode so the flow
// and payments table are exercised in dev.

import { getPool } from '@mm/db';

const KEY = () => process.env.STRIPE_SECRET_KEY || '';
const SITE = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const form = (obj) => new URLSearchParams(obj).toString();

async function stripe(path, body) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY()}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error?.message || `stripe_${res.status}`);
  return json;
}

async function record({ appointmentId, patientId, amountInr, method, status, gatewayRef }) {
  const { rows } = await getPool().query(
    `INSERT INTO payments (appointment_id, patient_id, amount_inr, method, status, gateway_ref)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [appointmentId || null, patientId, amountInr, method || 'card', status, gatewayRef || null]);
  return rows[0].id;
}

/** Create a checkout session (or simulate). Returns { url, paymentId, simulated }. */
export async function createCheckout({ appointmentId, patientId, amountInr, description = 'Consultation' }) {
  if (!(amountInr > 0) || !patientId) return { error: 'invalid' };
  if (!KEY()) {
    const paymentId = await record({ appointmentId, patientId, amountInr, status: 'paid', gatewayRef: 'sim' });
    return { url: `${SITE()}/ml/payment/success?sim=1`, paymentId, simulated: true };
  }
  const session = await stripe('checkout/sessions', {
    mode: 'payment',
    'line_items[0][price_data][currency]': 'inr',
    'line_items[0][price_data][product_data][name]': description,
    'line_items[0][price_data][unit_amount]': String(amountInr * 100),
    'line_items[0][quantity]': '1',
    success_url: `${SITE()}/ml/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE()}/ml/payment/cancel`
  });
  const paymentId = await record({ appointmentId, patientId, amountInr, status: 'pending', gatewayRef: session.id });
  return { url: session.url, paymentId, simulated: false };
}

/** Mark a session paid (call from success page / webhook). */
export async function confirmPayment(sessionId) {
  if (!sessionId) return { error: 'missing' };
  const { rowCount } = await getPool().query(
    `UPDATE payments SET status='paid', updated_at=now() WHERE gateway_ref=$1 AND status IN ('created','pending')`, [sessionId]);
  return rowCount > 0 ? { ok: true } : { error: 'not_found' };
}

/** Refund a payment (Stripe refund via REST, or simulate). */
export async function refundPayment(paymentId) {
  const { rows } = await getPool().query('SELECT gateway_ref, status FROM payments WHERE id=$1', [paymentId]);
  const p = rows[0];
  if (!p || p.status !== 'paid') return { error: 'not_refundable' };
  if (KEY() && p.gateway_ref && p.gateway_ref !== 'sim') {
    try { await stripe('refunds', { payment_intent: p.gateway_ref }); } catch (e) { return { error: e.message }; }
  }
  await getPool().query(`UPDATE payments SET status='refunded', updated_at=now() WHERE id=$1`, [paymentId]);
  return { ok: true };
}

export function paymentHistory(patientId) {
  return getPool().query(
    `SELECT id, amount_inr, status, method, created_at FROM payments WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 50`, [patientId])
    .then((r) => r.rows).catch(() => []);
}
