'use client';
import { use, useEffect, useState } from 'react';
const STAGES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];
export default function Pipeline({ params }) {
  const { id } = use(params);
  const [rows, setRows] = useState([]);
  const load = () => fetch(`/api/jobs/${id}/applications`).then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, [id]);
  async function move(appId, status) { await fetch(`/api/applications/${appId}/status`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) }); load(); }
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Application Pipeline</h1>
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((st) => (
          <div key={st} className="rounded-2xl border border-gray-200 bg-gray-50 p-2">
            <p className="mb-2 text-center text-xs font-bold uppercase text-gray-500">{st}</p>
            {rows.filter((r) => r.status === st).map((r) => (
              <div key={r.id} className="mb-2 rounded-xl border border-gray-200 bg-white p-2 text-sm">
                <p className="font-medium text-gray-800">{r.candidate}</p>
                <select value={r.status} onChange={(e) => move(r.id, e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-1 py-0.5 text-xs">{STAGES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
              </div>
            ))}
          </div>
        ))}
      </div>
      {rows.length === 0 && <p className="text-sm text-gray-400">No applications yet for this job.</p>}
    </div>
  );
}
