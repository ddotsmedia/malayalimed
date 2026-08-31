'use client';
import { use, useState } from 'react';

export default function CancelPage({ params }) {
  const { locale, id } = use(params);
  const [msg, setMsg] = useState('');
  async function cancel() {
    const r = await fetch('/api/appointments/cancel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ appointmentId: id }) });
    const j = await r.json();
    setMsg(r.ok ? 'Appointment cancelled.' : (j.errors?.[0] || 'Failed'));
  }
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-xl font-bold text-gray-900">Cancel Appointment</h1>
      <p className="text-sm text-gray-600">Are you sure you want to cancel this appointment?</p>
      <div className="flex justify-center gap-3">
        <a href={`/${locale}/patient/appointments`} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Keep it</a>
        <button onClick={cancel} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Cancel appointment</button>
      </div>
      {msg && <p className="text-sm font-semibold text-brand">{msg}</p>}
    </div>
  );
}
