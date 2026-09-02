'use client';
import { useEffect, useState } from 'react';
export default function ResultsInterpreter() {
  const [tests, setTests] = useState([]);
  const [tid, setTid] = useState('');
  const [value, setValue] = useState('');
  const [res, setRes] = useState(null);
  useEffect(() => { fetch('/api/lab-tests').then((r) => r.json()).then((j) => setTests(j.data || [])); }, []);
  async function interpret(e) { e.preventDefault(); const r = await fetch(`/api/lab-tests/${tid}/interpret?value=${value}`); const j = await r.json(); setRes(j.data); }
  const color = { high: 'text-red-600', low: 'text-amber-600', normal: 'text-green-600', unknown: 'text-gray-500' };
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Understand Your Results</h1>
      <form onSubmit={interpret} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <select value={tid} onChange={(e) => setTid(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">Test…</option>{tests.map((t) => <option key={t.id} value={t.id}>{t.test_name}</option>)}</select>
        <input value={value} onChange={(e) => setValue(e.target.value)} type="number" placeholder="Your value" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Interpret</button>
      </form>
      {res && <div className="rounded-2xl border border-gray-200 bg-white p-4"><p className={`text-lg font-bold ${color[res.status]}`}>{res.status.toUpperCase()}</p><p className="text-sm text-gray-600">{res.value} {res.unit} · normal {res.normalRange}</p><p className="mt-1 text-xs text-gray-400">{res.disclaimer}</p></div>}
    </div>
  );
}
