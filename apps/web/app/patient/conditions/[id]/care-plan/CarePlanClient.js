'use client';
import { use, useEffect, useState } from 'react';

export default function CarePlanClient({ params }) {
  const { id } = use(params);
  const [d, setD] = useState(null);
  const [med, setMed] = useState({ medicationName: '', dosage: '', frequency: '' });
  const load = () => fetch(`/api/patient/conditions/${id}/care-plan`).then((r) => r.json()).then((j) => setD(j.data)).catch(() => {});
  useEffect(() => { load(); }, [id]);
  async function addMed(e) { e.preventDefault(); await fetch(`/api/patient/conditions/${id}/medications`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(med) }); setMed({ medicationName: '', dosage: '', frequency: '' }); load(); }
  if (!d) return <p className="text-sm text-gray-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <a href="/patient/conditions" className="text-sm text-brand">← Conditions</a>
      <h1 className="text-xl font-bold text-gray-900">{d.condition.condition_name}</h1>
      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-bold text-gray-900">Medications</h2>
        {d.medications.length === 0 ? <p className="text-sm text-gray-400">None.</p> : <ul className="text-sm text-gray-700">{d.medications.map((m) => <li key={m.id}>• {m.medication_name} {m.dosage} {m.frequency}</li>)}</ul>}
        <form onSubmit={addMed} className="mt-3 grid gap-2 sm:grid-cols-4">
          <input value={med.medicationName} onChange={(e) => setMed({ ...med, medicationName: e.target.value })} placeholder="Medicine *" required className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm" />
          <input value={med.dosage} onChange={(e) => setMed({ ...med, dosage: e.target.value })} placeholder="Dosage" className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm" />
          <input value={med.frequency} onChange={(e) => setMed({ ...med, frequency: e.target.value })} placeholder="Frequency" className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm" />
          <button className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white">Add</button>
        </form>
      </section>
      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-bold text-gray-900">Lab targets</h2>
        {d.labs.length === 0 ? <p className="text-sm text-gray-400">No lab targets set.</p> : <ul className="text-sm text-gray-700">{d.labs.map((l) => <li key={l.id}>• {l.lab_name}: target {l.target_value}, last {l.last_value ?? '—'}</li>)}</ul>}
      </section>
    </div>
  );
}
