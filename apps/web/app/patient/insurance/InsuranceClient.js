'use client';
import { useEffect, useState } from 'react';

export default function InsuranceClient() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ insurerName: '', policyNumber: '', planName: '', copay: '' });
  const load = () => fetch('/api/patient/insurance').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  async function add(e) { e.preventDefault(); await fetch('/api/patient/insurance', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) }); setF({ insurerName: '', policyNumber: '', planName: '', copay: '' }); load(); }
  return (
    <div className="space-y-4">
      <a href="/patient/insurance/verify-coverage" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Verify coverage →</a>
      <form onSubmit={add} className="grid gap-2 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-4">
        <input value={f.insurerName} onChange={(e) => setF({ ...f, insurerName: e.target.value })} placeholder="Insurer *" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.policyNumber} onChange={(e) => setF({ ...f, policyNumber: e.target.value })} placeholder="Policy #" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.planName} onChange={(e) => setF({ ...f, planName: e.target.value })} placeholder="Plan" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.copay} onChange={(e) => setF({ ...f, copay: e.target.value })} type="number" placeholder="Copay ₹" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white sm:col-span-4">Add policy</button>
      </form>
      {rows.map((i) => (
        <div key={i.id} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand to-brand-dark p-5 text-white">
          <p className="text-lg font-bold">{i.insurer_name}</p>
          <p className="text-sm text-teal-50">{i.plan_name || 'Plan'} · Policy {i.policy_number || '—'}</p>
          <p className="mt-2 text-sm">Copay ₹{i.copay ?? '—'} {i.active ? '· Active' : ''}</p>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-gray-400">No insurance on file.</p>}
    </div>
  );
}
