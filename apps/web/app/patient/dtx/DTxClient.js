'use client';
import { useEffect, useState } from 'react';

export default function DTxClient() {
  const [programs, setPrograms] = useState([]);
  const [mine, setMine] = useState([]);
  const load = () => {
    fetch('/api/dtx/programs').then((r) => r.json()).then((j) => setPrograms(j.data || []));
  };
  useEffect(() => { load(); }, []);
  async function enroll(pid) {
    const r = await fetch(`/api/dtx/programs/${pid}/enroll`, { method: 'POST' });
    const j = await r.json();
    if (r.ok && j.data?.id) window.location.href = `/patient/dtx/${j.data.id}/dashboard`;
  }
  return (
    <div className="space-y-3">
      {programs.map((p) => (
        <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-900">{p.name}</h3><button onClick={() => enroll(p.id)} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">Enroll</button></div>
          <p className="text-xs text-gray-500">{p.condition} · {p.duration_weeks} weeks · {p.modules} modules</p>
          <p className="mt-1 text-sm text-gray-600">{p.description}</p>
        </div>
      ))}
      {programs.length === 0 && <p className="text-sm text-gray-400">No programs available.</p>}
    </div>
  );
}
