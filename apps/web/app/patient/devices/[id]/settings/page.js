'use client';
import { use, useState } from 'react';

export default function DeviceSettings({ params }) {
  const { id } = use(params);
  const [low, setLow] = useState('');
  const [high, setHigh] = useState('');
  const [msg, setMsg] = useState('');
  async function save(e) {
    e.preventDefault();
    const r = await fetch(`/api/devices/${id}/alerts`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ thresholdLow: low || null, thresholdHigh: high || null }) });
    setMsg(r.ok ? 'Saved ✓' : 'Failed');
  }
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Device Alert Thresholds</h1>
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">Trigger an alert when a reading falls outside this range.</p>
        <div className="flex gap-2"><input value={low} onChange={(e) => setLow(e.target.value)} type="number" placeholder="Low threshold" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /><input value={high} onChange={(e) => setHigh(e.target.value)} type="number" placeholder="High threshold" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div>
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Save</button>
        {msg && <span className="ml-2 text-sm font-semibold text-brand">{msg}</span>}
      </form>
    </div>
  );
}
