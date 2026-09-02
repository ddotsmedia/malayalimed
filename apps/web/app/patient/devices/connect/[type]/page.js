'use client';
import { use, useState } from 'react';

export default function ConnectPage({ params }) {
  const { type } = use(params);
  const [msg, setMsg] = useState('');
  async function connect() {
    const r = await fetch('/api/devices/connect', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceType: decodeURIComponent(type), deviceName: decodeURIComponent(type) }) });
    setMsg(r.ok ? 'Connected ✓' : 'Failed');
  }
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-xl font-bold text-gray-900">Connect {decodeURIComponent(type)}</h1>
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">Real OAuth for {decodeURIComponent(type)} is not configured. This registers the device to your account so you can log readings.</div>
      <button onClick={connect} className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white">Connect device</button>
      {msg && <p className="text-sm font-semibold text-brand">{msg} · <a href="/patient/devices" className="underline">back to devices</a></p>}
    </div>
  );
}
