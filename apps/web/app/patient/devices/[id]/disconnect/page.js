'use client';
import { use, useState } from 'react';

export default function Disconnect({ params }) {
  const { id } = use(params);
  const [msg, setMsg] = useState('');
  async function go() {
    const r = await fetch(`/api/devices/${id}`, { method: 'DELETE' });
    setMsg(r.ok ? 'Device disconnected.' : 'Failed');
  }
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-xl font-bold text-gray-900">Disconnect Device</h1>
      <p className="text-sm text-gray-600">This stops syncing and marks the device inactive.</p>
      <div className="flex justify-center gap-3"><a href="/patient/devices" className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Keep</a><button onClick={go} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Disconnect</button></div>
      {msg && <p className="text-sm font-semibold text-brand">{msg}</p>}
    </div>
  );
}
