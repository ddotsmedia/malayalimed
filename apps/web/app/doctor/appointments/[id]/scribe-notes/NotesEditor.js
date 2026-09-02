'use client';
import { useEffect, useState } from 'react';

export default function NotesEditor({ apptId }) {
  const [sid, setSid] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('sid');
    if (s) { setSid(s); fetch(`/api/scribe/sessions/${s}`).then((r) => r.json()).then((j) => setNotes(j.data?.notes_final || j.data?.notes_draft || '')); }
  }, []);
  async function save() {
    const r = await fetch(`/api/scribe/sessions/${sid}/notes`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ notesFinal: notes }) });
    setMsg(r.ok ? 'Saved ✓' : 'Failed');
  }
  async function sign() {
    const r = await fetch(`/api/scribe/sessions/${sid}/sign`, { method: 'POST' });
    setMsg(r.ok ? 'Signed off ✓' : 'Failed');
  }
  if (!sid) return <p className="text-sm text-slate-500">Open from a scribe session (add ?sid=…).</p>;
  return (
    <div className="space-y-3">
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={12} className="w-full rounded-2xl border border-slate-300 p-3 text-sm" />
      <div className="flex items-center gap-2">
        <button onClick={save} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Save draft</button>
        <button onClick={sign} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Sign off</button>
        {msg && <span className="text-sm font-semibold text-brand">{msg}</span>}
      </div>
    </div>
  );
}
