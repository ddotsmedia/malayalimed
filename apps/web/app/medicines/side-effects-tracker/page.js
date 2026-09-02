'use client';
import { useEffect, useState } from 'react';
export default function SideEffectTracker() {
  const [meds, setMeds] = useState([]);
  const [f, setF] = useState({ medId: '', sideEffect: '', severity: 'mild', durationDays: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch('/api/medicines').then((r) => r.json()).then((j) => setMeds(j.data || [])); }, []);
  async function submit(e) { e.preventDefault(); const r = await fetch(`/api/medicines/${f.medId}/side-effect-report`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sideEffect: f.sideEffect, severity: f.severity, durationDays: f.durationDays || null }) }); setMsg(r.ok ? 'Reported ✓ Thank you.' : 'Log in to report'); }
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Side-Effect Tracker</h1>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <select value={f.medId} onChange={(e) => setF({ ...f, medId: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">Medicine…</option>{meds.map((m) => <option key={m.id} value={m.id}>{m.generic_name}</option>)}</select>
        <input value={f.sideEffect} onChange={(e) => setF({ ...f, sideEffect: e.target.value })} placeholder="Side effect experienced *" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <div className="flex gap-2"><select value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option>mild</option><option>moderate</option><option>severe</option></select><input value={f.durationDays} onChange={(e) => setF({ ...f, durationDays: e.target.value })} type="number" placeholder="Days" className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div>
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Report</button>{msg && <span className="ml-2 text-sm font-semibold text-brand">{msg}</span>}
      </form>
    </div>
  );
}
