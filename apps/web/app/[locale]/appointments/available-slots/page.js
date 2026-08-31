'use client';
import { useEffect, useState } from 'react';

export default function SlotsPage() {
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const q = new URLSearchParams(window.location.search); setDoctorId(q.get('doctorId') || ''); }, []);
  async function load() {
    if (!doctorId) return;
    const r = await fetch(`/api/doctors/${doctorId}/slots${date ? `?date=${date}` : ''}`);
    const j = await r.json(); setSlots(j.data || []); setLoaded(true);
  }
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Available Slots</h1>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4">
        <input value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="Doctor ID (uuid)" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button onClick={load} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Find</button>
      </div>
      {loaded && (slots.length === 0 ? <p className="text-sm text-gray-400">No open slots.</p> : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((s) => <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-3 text-center text-sm">{String(s.slot_date).slice(5)} · {String(s.start_time).slice(0, 5)}</div>)}
        </div>
      ))}
    </div>
  );
}
