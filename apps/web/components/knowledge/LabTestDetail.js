'use client';
import { use, useEffect, useState } from 'react';
export default function LabTestDetail({ params }) {
  const { id } = use(params);
  const [t, setT] = useState(null);
  const [value, setValue] = useState('');
  const [interp, setInterp] = useState(null);
  useEffect(() => { fetch(`/api/lab-tests/${id}`).then((r) => r.json()).then((j) => setT(j.data)); }, [id]);
  async function interpret() { const r = await fetch(`/api/lab-tests/${id}/interpret?value=${value}`); const j = await r.json(); setInterp(j.data); }
  if (!t) return <p className="text-sm text-gray-500">Loading…</p>;
  const color = { high: 'text-red-600', low: 'text-amber-600', normal: 'text-green-600', unknown: 'text-gray-500' };
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.test_name}</h1>
        <p className="text-sm text-gray-500">{t.test_code} · {t.category} · ₹{t.cost}</p>
        <p className="mt-2 text-sm text-gray-700">{t.description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-4"><p className="text-xs font-bold uppercase text-gray-400">Normal range (M / F)</p><p className="text-sm text-gray-800">{t.normal_range_male} / {t.normal_range_female} {t.unit}</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4"><p className="text-xs font-bold uppercase text-gray-400">Preparation · Result</p><p className="text-sm text-gray-800">{t.preparation_needed} · {t.time_to_result}</p></div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-bold text-gray-900">Understand your result</h2>
        <div className="flex gap-2"><input value={value} onChange={(e) => setValue(e.target.value)} type="number" placeholder={`Your value (${t.unit})`} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" /><button onClick={interpret} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Interpret</button></div>
        {interp && <p className={`mt-2 text-sm font-semibold ${color[interp.status]}`}>{interp.value} {interp.unit} → {interp.status.toUpperCase()} (normal {interp.normalRange})</p>}
        {interp && <p className="text-xs text-gray-400">{interp.disclaimer}</p>}
      </div>
    </div>
  );
}
