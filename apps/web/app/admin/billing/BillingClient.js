'use client';
import { useEffect, useState } from 'react';

export default function BillingClient() {
  const [rows, setRows] = useState([]);
  const [amount, setAmount] = useState('');
  const [patientId, setPatientId] = useState('');
  const [msg, setMsg] = useState('');
  const load = () => fetch('/api/admin/invoices').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/admin/invoices', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ patientId: patientId || null, amount }) });
    const j = await r.json();
    if (r.ok) { setAmount(''); setPatientId(''); setMsg('Created ✓'); load(); } else setMsg(j.errors?.[0] || 'Failed');
  }
  async function markPaid(id) { await fetch(`/api/admin/invoices/${id}`, { method: 'PUT' }); load(); }

  return (
    <div className="space-y-4">
      <form onSubmit={create} className="flex flex-wrap items-end gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        <input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Patient ID (uuid, optional)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount ₹" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Generate invoice</button>
        {msg && <span className="text-xs font-semibold text-brand">{msg}</span>}
      </form>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Doctor</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Status</th><th className="px-3 py-2 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">No invoices.</td></tr> :
              rows.map((i) => (
                <tr key={i.id}><td className="px-3 py-2">{i.patient_name || '—'}</td><td className="px-3 py-2">{i.doctor_name || '—'}</td><td className="px-3 py-2">₹{i.amount}</td>
                  <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${i.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{i.status}</span></td>
                  <td className="px-3 py-2 text-right">{i.status !== 'paid' && <button onClick={() => markPaid(i.id)} className="rounded bg-brand px-2 py-1 text-xs text-white">Mark paid</button>}</td></tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
