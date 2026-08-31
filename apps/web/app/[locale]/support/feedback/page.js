'use client';
import { useState } from 'react';

export default function FeedbackPage() {
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault(); setMsg('');
    const r = await fetch('/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message }) });
    const j = await r.json();
    if (r.ok) { setMessage(''); setMsg('Thanks for your feedback ✓'); } else setMsg(j.errors?.[0] || 'Failed');
  }
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Send Feedback</h1>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Tell us what you think…" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Submit</button>
        {msg && <p className="text-sm font-semibold text-brand">{msg}</p>}
      </form>
    </div>
  );
}
