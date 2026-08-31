'use client';
import { useState } from 'react';

export default function WaitlistClient({ doctorId }) {
  const [msg, setMsg] = useState('');
  const [pos, setPos] = useState(null);
  async function join() {
    const r = await fetch('/api/appointments/waitlist/join', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ doctorId }) });
    const j = await r.json();
    if (r.ok) { setPos(j.data.position); setMsg(''); } else setMsg(j.errors?.[0] || 'Login required to join');
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
      {pos ? <p className="text-sm text-gray-700">You are on the waitlist — position <b className="text-brand">#{pos}</b>. We will notify you when a slot opens.</p>
        : <><p className="mb-3 text-sm text-gray-600">No slots available now? Join the waitlist and get notified.</p>
          <button onClick={join} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white">Join waitlist</button></>}
      {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
    </div>
  );
}
