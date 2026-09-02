'use client';
import { useEffect, useState } from 'react';

export default function PriorAuthClient() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ patientId: '', serviceType: '' });
  const [msg, setMsg] = useState('');
  const load = () => fetch('/api/prior-auth').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/prior-auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
    const j = await r.json();
    if (r.ok) { setF({ patientId: '', serviceType: '' }); setMsg('Submitted ✓'); load(); } else setMsg(j.errors?.[0] || 'Failed');
  }
  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <input value={f.patientId} onChange={(e) => setF({ ...f, patientId: e.target.value })} placeholder="Patient ID (uuid) *" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input value={f.serviceType} onChange={(e) => setF({ ...f, serviceType: e.target.value })} placeholder="Service type *" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Submit request</button>
        {msg && <span className="text-xs font-semibold text-brand sm:col-span-3">{msg}</span>}
      </form>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Service</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Date</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.length === 0 ? <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-400">No requests.</td></tr> : rows.map((r) => <tr key={r.id}><td className="px-3 py-2">{r.patient || '—'}</td><td className="px-3 py-2">{r.service_type}</td><td className="px-3 py-2">{r.status}</td><td className="px-3 py-2 text-slate-500">{String(r.created_at).slice(0, 10)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
