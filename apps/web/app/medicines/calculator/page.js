'use client';
import { useEffect, useState } from 'react';
export default function DosageCalculator() {
  const [meds, setMeds] = useState([]);
  const [f, setF] = useState({ med: '', weight: '', age: '' });
  const [res, setRes] = useState(null);
  useEffect(() => { fetch('/api/medicines').then((r) => r.json()).then((j) => setMeds(j.data || [])); }, []);
  async function calc(e) { e.preventDefault(); const r = await fetch(`/api/medicines/dosage-calculator?med=${f.med}&weight=${f.weight}&age=${f.age}`); const j = await r.json(); setRes(j.data); }
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Dosage Calculator</h1>
      <form onSubmit={calc} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <select value={f.med} onChange={(e) => setF({ ...f, med: e.target.value })} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="">Medicine…</option>{meds.map((m) => <option key={m.id} value={m.id}>{m.generic_name}</option>)}</select>
        <div className="flex gap-2"><input value={f.weight} onChange={(e) => setF({ ...f, weight: e.target.value })} type="number" placeholder="Weight (kg)" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /><input value={f.age} onChange={(e) => setF({ ...f, age: e.target.value })} type="number" placeholder="Age" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div>
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Calculate</button>
      </form>
      {res && <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 text-sm"><p className="text-lg font-bold text-brand">≈ {res.estimatedDoseMg} mg</p><p className="text-gray-600">{res.medicine} · {res.weight} kg</p><p className="mt-1 text-xs text-gray-500">{res.note}</p></div>}
    </div>
  );
}
