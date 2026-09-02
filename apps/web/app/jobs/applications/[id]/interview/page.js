'use client';
import { use, useEffect, useState } from 'react';
export default function InterviewScheduler({ params }) {
  const { id } = use(params);
  const [slots, setSlots] = useState([]);
  const [f, setF] = useState({ proposedDate: '', proposedTime: '', durationMinutes: 30 });
  const load = () => fetch(`/api/applications/${id}/propose-interview`).then((r) => r.json()).then((j) => setSlots(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, [id]);
  async function propose(e) { e.preventDefault(); await fetch(`/api/applications/${id}/propose-interview`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) }); setF({ proposedDate: '', proposedTime: '', durationMinutes: 30 }); load(); }
  async function confirm(sid) { await fetch(`/api/interviews/${sid}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'confirmed' }) }); load(); }
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <a href={`/jobs/applications/${id}`} className="text-sm text-brand">← Application</a>
      <h1 className="text-xl font-bold text-gray-900">Interview Slots</h1>
      <form onSubmit={propose} className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4">
        <input type="date" value={f.proposedDate} onChange={(e) => setF({ ...f, proposedDate: e.target.value })} required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input type="time" value={f.proposedTime} onChange={(e) => setF({ ...f, proposedTime: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Propose slot</button>
      </form>
      <div className="space-y-2">{slots.map((s) => <div key={s.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm"><span>{String(s.proposed_date).slice(0, 10)} {String(s.proposed_time || '').slice(0, 5)} · {s.duration_minutes}min · {s.status}</span>{s.status !== 'confirmed' && <button onClick={() => confirm(s.id)} className="rounded bg-brand px-2 py-1 text-xs text-white">Confirm</button>}</div>)}{slots.length === 0 && <p className="text-sm text-gray-400">No slots proposed.</p>}</div>
    </div>
  );
}
