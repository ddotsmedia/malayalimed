'use client';
import { use, useState } from 'react';

export default function EnrollPage({ params }) {
  const { id } = use(params);
  const [msg, setMsg] = useState('');
  async function go() {
    const r = await fetch(`/api/dtx/programs/${id}/enroll`, { method: 'POST' });
    const j = await r.json();
    if (r.ok && j.data?.id) window.location.href = `/patient/dtx/${j.data.id}/dashboard`;
    else setMsg('Failed');
  }
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-xl font-bold text-gray-900">Enroll in Program</h1>
      <button onClick={go} className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white">Start program</button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </div>
  );
}
