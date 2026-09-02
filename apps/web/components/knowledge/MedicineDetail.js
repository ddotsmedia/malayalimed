'use client';
import { use, useEffect, useState } from 'react';
const Chips = ({ items, cls = 'bg-gray-100 text-gray-700' }) => Array.isArray(items) && items.length ? <div className="flex flex-wrap gap-1">{items.map((x, i) => <span key={i} className={`rounded-full px-2 py-0.5 text-xs ${cls}`}>{x}</span>)}</div> : <span className="text-sm text-gray-400">—</span>;
export default function MedicineDetail({ params }) {
  const { id } = use(params);
  const [m, setM] = useState(null);
  useEffect(() => { fetch(`/api/medicines/${id}`).then((r) => r.json()).then((j) => setM(j.data)); }, [id]);
  if (!m) return <p className="text-sm text-gray-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{m.generic_name}</h1>
        <p className="text-sm text-gray-500">{m.strength} · {m.form} · {m.manufacturer}</p>
        <div className="mt-2"><p className="text-xs font-bold uppercase text-gray-400">Brands</p><Chips items={m.brand_names} cls="bg-brand/10 text-brand" /></div>
      </div>
      {[['Uses', m.uses], ['Side effects', m.side_effects], ['Contraindications', m.contraindications]].map(([label, items]) => (
        <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4"><h2 className="mb-1 text-sm font-bold text-gray-900">{label}</h2><Chips items={items} cls={label === 'Contraindications' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'} /></div>
      ))}
      {m.dosage_info && <div className="rounded-2xl border border-gray-200 bg-white p-4"><h2 className="mb-1 text-sm font-bold text-gray-900">Dosage</h2><p className="text-sm text-gray-700">{m.dosage_info}</p></div>}
      <div className="flex flex-wrap gap-3 text-sm">
        <a href={`/medicines/${id}/interactions`} className="font-semibold text-brand">⚠️ Interactions</a>
        <a href={`/medicines/${id}/alternatives`} className="font-semibold text-brand">🔄 Alternatives</a>
        <a href={`/medicines/${id}/reviews`} className="font-semibold text-brand">⭐ Reviews</a>
      </div>
      <p className="text-xs text-gray-400">Educational information only. Always consult a doctor or pharmacist before taking any medicine.</p>
    </div>
  );
}
