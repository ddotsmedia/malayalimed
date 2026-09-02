'use client';
import { useEffect, useState } from 'react';
export default function JobAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [name, setName] = useState('');
  const loadA = () => fetch('/api/alerts').then((r) => r.json()).then((j) => setAlerts(j.data || []));
  const loadF = () => fetch('/api/search/filters').then((r) => r.json()).then((j) => setFilters(j.data || []));
  useEffect(() => { loadA(); loadF(); }, []);
  async function saveFilter(e) { e.preventDefault(); await fetch('/api/search/filters', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }) }); setName(''); loadF(); }
  async function makeAlert(fid) { await fetch('/api/alerts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ filterId: fid, frequency: 'daily' }) }); loadA(); }
  async function test(id) { await fetch(`/api/alerts/${id}/test`, { method: 'POST' }); loadA(); }
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Job Alerts</h1>
      <p className="text-xs text-gray-400">Note: alert delivery (email/push) is stubbed — creating alerts and marking them sent works; no messages are actually sent.</p>
      <form onSubmit={saveFilter} className="flex gap-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Saved search name" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" /><button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Save search</button></form>
      <section><h2 className="mb-2 text-sm font-bold text-gray-900">Saved searches</h2>{filters.map((f) => <div key={f.id} className="mb-1 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm"><span>{f.name}</span><button onClick={() => makeAlert(f.id)} className="rounded bg-brand px-2 py-1 text-xs text-white">Create alert</button></div>)}{filters.length === 0 && <p className="text-sm text-gray-400">No saved searches (login required).</p>}</section>
      <section><h2 className="mb-2 text-sm font-bold text-gray-900">Alerts</h2>{alerts.map((a) => <div key={a.id} className="mb-1 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm"><span>{a.filter_name || 'Alert'} · {a.frequency} · {a.is_active ? 'active' : 'paused'}</span><button onClick={() => test(a.id)} className="rounded border border-gray-300 px-2 py-1 text-xs">Send test</button></div>)}{alerts.length === 0 && <p className="text-sm text-gray-400">No alerts yet.</p>}</section>
    </div>
  );
}
