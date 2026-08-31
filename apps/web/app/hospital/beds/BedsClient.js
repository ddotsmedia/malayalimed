'use client';
import { useEffect, useState } from 'react';

const STATUS = ['vacant', 'occupied', 'maintenance'];
const color = { vacant: 'bg-green-100 text-green-700', occupied: 'bg-red-100 text-red-700', maintenance: 'bg-amber-100 text-amber-700' };

export default function BedsClient() {
  const [rows, setRows] = useState(null);
  const load = () => fetch('/api/hospital/beds').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    await fetch(`/api/hospital/beds/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  }

  if (!rows) return <p className="text-sm text-slate-500">Loading…</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="px-3 py-2">Bed</th><th className="px-3 py-2">Floor</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Set</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">No beds. Add via API.</td></tr> :
            rows.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{b.bed_number}</td>
                <td className="px-3 py-2">{b.floor ?? '—'}</td>
                <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color[b.status] || ''}`}>{b.status}</span></td>
                <td className="px-3 py-2">{b.patient_name || '—'}</td>
                <td className="px-3 py-2">
                  <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">
                    {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
