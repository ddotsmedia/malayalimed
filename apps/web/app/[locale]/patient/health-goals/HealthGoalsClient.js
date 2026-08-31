'use client';
import { useEffect, useState } from 'react';

export default function HealthGoalsClient() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ goalName: '', targetValue: '', dueDate: '' });
  const load = () => fetch('/api/patient/health-goals').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  async function add(e) { e.preventDefault(); await fetch('/api/patient/health-goals', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) }); setF({ goalName: '', targetValue: '', dueDate: '' }); load(); }
  async function update(id, val) { await fetch(`/api/patient/health-goals/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ currentValue: val }) }); load(); }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid gap-2 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-4">
        <input value={f.goalName} onChange={(e) => setF({ ...f, goalName: e.target.value })} placeholder="Goal *" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.targetValue} onChange={(e) => setF({ ...f, targetValue: e.target.value })} type="number" placeholder="Target" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} type="date" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Add goal</button>
      </form>
      {rows.map((g) => {
        const pct = g.target_value ? Math.min(100, Math.round((Number(g.current_value) / Number(g.target_value)) * 100)) : 0;
        return (
          <div key={g.id} className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between"><span className="font-semibold text-gray-800">{g.goal_name}</span><span className="text-xs text-gray-500">{g.current_value}/{g.target_value ?? '—'}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full bg-brand" style={{ width: `${pct}%` }} /></div>
            <div className="mt-2 flex items-center gap-2"><input type="number" placeholder="Update value" className="w-32 rounded-lg border border-gray-300 px-2 py-1 text-xs" onKeyDown={(e) => e.key === 'Enter' && update(g.id, e.target.value)} /><span className="text-xs text-gray-400">press Enter</span></div>
          </div>
        );
      })}
      {rows.length === 0 && <p className="text-sm text-gray-400">No goals yet.</p>}
    </div>
  );
}
