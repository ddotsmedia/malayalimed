'use client';
import { use, useEffect, useState } from 'react';
export default function Interactions({ params }) {
  const { id } = use(params);
  const [meds, setMeds] = useState([]);
  const [withId, setWithId] = useState('');
  const [result, setResult] = useState(null);
  useEffect(() => { fetch('/api/medicines').then((r) => r.json()).then((j) => setMeds(j.data || [])); }, []);
  async function check() { const r = await fetch(`/api/medicines/${id}/interactions?with=${withId}`); const j = await r.json(); setResult(j.data); }
  const color = { high: 'bg-red-50 border-red-300 text-red-800', moderate: 'bg-amber-50 border-amber-300 text-amber-800', none: 'bg-gray-50 border-gray-200 text-gray-600' };
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <a href={`/medicines/${id}`} className="text-sm text-brand">← Medicine</a>
      <h1 className="text-xl font-bold text-gray-900">Interaction Checker</h1>
      <div className="flex gap-2"><select value={withId} onChange={(e) => setWithId(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">Check against…</option>{meds.map((m) => <option key={m.id} value={m.id}>{m.generic_name}</option>)}</select><button onClick={check} disabled={!withId} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Check</button></div>
      {result && <div className={`rounded-xl border p-3 text-sm ${color[result.severity] || color.none}`}><b className="capitalize">{result.severity}</b> — {result.description}</div>}
      <p className="text-xs text-gray-400">Reference set only — always confirm with a pharmacist.</p>
    </div>
  );
}
