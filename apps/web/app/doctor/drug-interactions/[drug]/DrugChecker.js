'use client';
import { use, useState } from 'react';

export default function DrugChecker({ params }) {
  const { drug } = use(params);
  const [drug2, setDrug2] = useState('');
  const [result, setResult] = useState(null);
  async function check() {
    const r = await fetch(`/api/drug-interactions?drug1=${encodeURIComponent(drug)}&drug2=${encodeURIComponent(drug2)}`);
    const j = await r.json();
    setResult(j.data);
  }
  const color = { high: 'bg-red-50 border-red-300 text-red-800', moderate: 'bg-amber-50 border-amber-300 text-amber-800', none: 'bg-gray-50 border-gray-200 text-gray-600' };
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">Checking interactions for <b>{decodeURIComponent(drug)}</b></p>
      <div className="flex gap-2">
        <input value={drug2} onChange={(e) => setDrug2(e.target.value)} placeholder="Second drug (e.g. aspirin)" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button onClick={check} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Check</button>
      </div>
      {result && <div className={`rounded-xl border p-3 text-sm ${color[result.severity] || color.none}`}><b className="capitalize">{result.severity}</b> — {result.description}</div>}
    </div>
  );
}
