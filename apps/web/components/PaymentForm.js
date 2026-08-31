'use client';

// PaymentForm — creates a Stripe Checkout session via /api/payments/create-intent
// and redirects to the hosted checkout URL (no Stripe.js package needed).

import { useState } from 'react';
import { fmtCurrency } from '@/lib/formatters';

export default function PaymentForm({ amountInr, appointmentId, description = 'Consultation', locale = 'ml' }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const ml = locale === 'ml';

  async function pay() {
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/payments/create-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_inr: amountInr, appointment_id: appointmentId, description })
      });
      const j = await r.json();
      if (r.ok && j.data?.url) { window.location.href = j.data.url; return; }
      setErr(j.errors?.[0] || 'Payment could not be started.');
    } catch { setErr('Network error.'); }
    setBusy(false);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">{description}</span>
        <span className="text-lg font-bold text-slate-900">{fmtCurrency(amountInr)}</span>
      </div>
      <button onClick={pay} disabled={busy} className="mt-3 w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {busy ? (ml ? 'തുടരുന്നു…' : 'Redirecting…') : (ml ? 'പണം അടയ്ക്കുക' : 'Pay securely')}
      </button>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <p className="mt-2 text-[11px] text-slate-400">🔒 Stripe Checkout · Cards & UPI</p>
    </div>
  );
}
