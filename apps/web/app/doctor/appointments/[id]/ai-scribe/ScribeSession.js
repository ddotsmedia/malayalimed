'use client';
import { use, useState } from 'react';

export default function ScribeSession({ params }) {
  const { id } = use(params);
  const [transcript, setTranscript] = useState('');
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(false);
  async function start() {
    setBusy(true);
    const r = await fetch('/api/scribe/sessions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ appointmentId: id, transcription: transcript }) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) setSession(j.data);
  }
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">🎙️ Audio capture / speech-to-text is not connected. Paste or type the visit transcript; the scribe drafts SOAP notes.</div>
      <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={6} placeholder="Paste visit transcript…" className="w-full rounded-2xl border border-slate-300 p-3 text-sm" />
      <button onClick={start} disabled={busy} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Drafting…' : 'Generate notes'}</button>
      {session && (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">Draft ({session.source})</p>
          <pre className="whitespace-pre-wrap text-sm text-slate-800">{session.notesDraft}</pre>
          <a href={`/doctor/appointments/${id}/scribe-notes?sid=${session.id}`} className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Review & edit →</a>
        </div>
      )}
    </div>
  );
}
