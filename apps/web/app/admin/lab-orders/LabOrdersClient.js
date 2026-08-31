'use client';
import { useEffect, useState } from 'react';

export default function LabOrdersClient() {
  const [rows, setRows] = useState([]);
  const load = () => fetch('/api/admin/lab-orders').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  async function complete(id) { await fetch(`/api/admin/lab-orders/${id}`, { method: 'PUT' }); load(); }
  return (
    <div className="space-y-3">
      <a href="/admin/lab-results/upload" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Upload result →</a>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Patient</th><th className="px-3 py-2">Doctor</th><th className="px-3 py-2">Tests</th><th className="px-3 py-2">Status</th><th className="px-3 py-2 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">No lab orders.</td></tr> :
              rows.map((o) => (
                <tr key={o.id}><td className="px-3 py-2">{o.patient_name || '—'}</td><td className="px-3 py-2">{o.doctor_name || '—'}</td>
                  <td className="px-3 py-2">{Array.isArray(o.test_names) ? o.test_names.join(', ') : '—'}</td><td className="px-3 py-2">{o.status}</td>
                  <td className="px-3 py-2 text-right">{o.status !== 'completed' && <button onClick={() => complete(o.id)} className="rounded bg-brand px-2 py-1 text-xs text-white">Mark complete</button>}</td></tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
