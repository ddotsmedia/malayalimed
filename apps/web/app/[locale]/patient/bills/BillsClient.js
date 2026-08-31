'use client';
import { useEffect, useState } from 'react';

export default function BillsClient() {
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState('');
  const load = () => fetch('/api/patient/invoices').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  async function pay(id, method) {
    setBusy(id);
    await fetch('/api/patient/pay-bill', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ invoiceId: id, method }) });
    setBusy(''); load();
  }

  if (!rows) return <p className="text-sm text-gray-500">Loading…</p>;
  if (rows.length === 0) return <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No bills.</p>;
  return (
    <div className="space-y-2">
      {rows.map((i) => (
        <div key={i.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
          <div>
            <p className="font-semibold text-gray-900">₹{i.amount}</p>
            <p className="text-xs text-gray-500">{i.doctor_name || 'Consultation'} · {String(i.created_at).slice(0, 10)}</p>
          </div>
          {i.status === 'paid'
            ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Paid</span>
            : <div className="flex gap-2">
                <select id={`m-${i.id}`} className="rounded-lg border border-gray-300 px-2 py-1 text-xs"><option value="card">Card</option><option value="upi">UPI</option><option value="netbanking">Net banking</option></select>
                <button disabled={busy === i.id} onClick={() => pay(i.id, document.getElementById(`m-${i.id}`).value)} className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50">Pay</button>
              </div>}
        </div>
      ))}
      <p className="text-xs text-gray-400">Payment gateway (Razorpay) is not configured — payments are recorded directly for demo.</p>
    </div>
  );
}
