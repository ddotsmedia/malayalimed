'use client';
import { use, useState } from 'react';

export default function FollowUpPage({ params }) {
  const { locale, roomId } = use(params);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch(`/api/telehealth/${roomId}/follow-up`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ followUpDate: date, notes }) });
    const j = await r.json();
    setMsg(r.ok ? 'Follow-up scheduled ✓' : (j.errors?.[0] || 'Failed'));
  }
  return (
    <div className="mx-auto max-w-md space-y-4">
      <a href={`/${locale}/consult/${roomId}`} className="text-sm text-brand">← Back to consult</a>
      <h1 className="text-xl font-bold text-gray-900">Schedule Follow-up</h1>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notes" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Schedule</button>
        {msg && <span className="ml-2 text-sm font-semibold text-brand">{msg}</span>}
      </form>
    </div>
  );
}
