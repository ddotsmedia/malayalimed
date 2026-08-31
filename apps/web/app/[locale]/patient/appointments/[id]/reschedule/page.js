'use client';
import { use, useState } from 'react';

export default function ReschedulePage({ params }) {
  const { locale, id } = use(params);
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/appointments/reschedule', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ appointmentId: id, newDate: date }) });
    const j = await r.json();
    setMsg(r.ok ? 'Rescheduled ✓' : (j.errors?.[0] || 'Failed'));
  }
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Reschedule Appointment</h1>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <label className="block text-sm text-gray-600">New date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Confirm</button>
          <a href={`/${locale}/patient/appointments`} className="text-sm text-gray-500">Back</a>
          {msg && <span className="text-sm font-semibold text-brand">{msg}</span>}
        </div>
      </form>
    </div>
  );
}
