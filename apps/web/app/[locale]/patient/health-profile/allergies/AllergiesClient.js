'use client';
import { useEffect, useState } from 'react';

const SEV = { mild: 'bg-gray-100 text-gray-600', moderate: 'bg-amber-100 text-amber-700', severe: 'bg-red-100 text-red-700' };
const inp = 'rounded-lg border border-gray-300 px-3 py-2 text-sm';

export default function AllergiesClient() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ allergen: '', reaction: '', severity: 'mild' });
  const [msg, setMsg] = useState('');
  const load = () => fetch('/api/patient/allergies').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/patient/allergies', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
    const j = await r.json();
    if (r.ok) { setF({ allergen: '', reaction: '', severity: 'mild' }); load(); } else setMsg(j.errors?.[0] || 'Failed');
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid gap-2 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-4">
        <input className={inp} placeholder="Allergen *" value={f.allergen} onChange={(e) => setF({ ...f, allergen: e.target.value })} required />
        <input className={inp} placeholder="Reaction" value={f.reaction} onChange={(e) => setF({ ...f, reaction: e.target.value })} />
        <select className={inp} value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })}><option value="mild">Mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select>
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Add</button>
        {msg && <span className="text-xs text-red-600 sm:col-span-4">{msg}</span>}
      </form>
      {rows.length === 0 ? <p className="text-sm text-gray-400">No allergies recorded.</p> : (
        <div className="space-y-2">
          {rows.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3">
              <div><p className="font-medium text-gray-800">{a.allergen}</p>{a.reaction && <p className="text-xs text-gray-500">{a.reaction}</p>}</div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${SEV[a.severity] || SEV.mild}`}>{a.severity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
