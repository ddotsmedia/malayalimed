'use client';
import { useEffect, useState } from 'react';

export default function CampsClient() {
  const [rows, setRows] = useState(null);
  const [msg, setMsg] = useState('');
  const load = () => fetch('/api/health-camps').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([]));
  useEffect(() => { load(); }, []);
  async function register(id) {
    const r = await fetch(`/api/health-camps/${id}/register`, { method: 'POST' });
    setMsg(r.ok ? 'Registered ✓' : 'Login required'); setTimeout(() => setMsg(''), 3000); load();
  }
  if (!rows) return <p className="text-sm text-gray-500">Loading…</p>;
  if (rows.length === 0) return <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No upcoming health camps.</p>;
  return (
    <div className="space-y-3">
      {msg && <p className="text-sm font-semibold text-brand">{msg}</p>}
      {rows.map((c) => (
        <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-900">{c.name}</h3><button onClick={() => register(c.id)} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">Register</button></div>
          <p className="text-xs text-gray-500">{c.hospital} · {String(c.start_date).slice(0, 10)}{c.end_date ? ` – ${String(c.end_date).slice(0, 10)}` : ''}</p>
          {c.description && <p className="mt-1 text-sm text-gray-600">{c.description}</p>}
          {Array.isArray(c.free_services) && c.free_services.length > 0 && <p className="mt-1 text-xs text-brand">Free: {c.free_services.join(', ')}</p>}
          <p className="mt-1 text-xs text-gray-400">{c.registrations} registered</p>
        </div>
      ))}
    </div>
  );
}
