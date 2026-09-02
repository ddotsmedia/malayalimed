'use client';
import { useEffect, useState } from 'react';

export default function ConditionsClient() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ conditionName: '', icd10Code: '', diagnosisDate: '' });
  const load = () => fetch('/api/patient/conditions').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  async function add(e) { e.preventDefault(); await fetch('/api/patient/conditions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) }); setF({ conditionName: '', icd10Code: '', diagnosisDate: '' }); load(); }
  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid gap-2 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-4">
        <input value={f.conditionName} onChange={(e) => setF({ ...f, conditionName: e.target.value })} placeholder="Condition *" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.icd10Code} onChange={(e) => setF({ ...f, icd10Code: e.target.value })} placeholder="ICD-10 (opt)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.diagnosisDate} onChange={(e) => setF({ ...f, diagnosisDate: e.target.value })} type="date" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Add</button>
      </form>
      {rows.map((c) => (
        <a key={c.id} href={`/patient/conditions/${c.id}/care-plan`} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
          <div><p className="font-semibold text-gray-900">{c.condition_name}</p><p className="text-xs text-gray-500">{c.icd10_code || ''} {c.diagnosis_date ? `· ${String(c.diagnosis_date).slice(0, 10)}` : ''}</p></div>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{c.status}</span>
        </a>
      ))}
      {rows.length === 0 && <p className="text-sm text-gray-400">No conditions recorded.</p>}
    </div>
  );
}
