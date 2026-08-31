'use client';
import { useEffect, useState } from 'react';
import MetricForm from '@/components/health/MetricForm';
import MetricChart from '@/components/health/MetricChart';
import GoalCard from '@/components/health/GoalCard';

const CHARTS = [
  { type: 'weight', label: 'Weight (kg)', invert: true },
  { type: 'blood_sugar', label: 'Blood Sugar (mg/dL)', invert: true },
  { type: 'heart_rate', label: 'Heart Rate (bpm)' },
  { type: 'steps', label: 'Steps' },
];

export default function HealthTrackerClient({ locale = 'ml' }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [goals, setGoals] = useState([]);
  const [gType, setGType] = useState('weight');
  const [gTarget, setGTarget] = useState('');

  const loadGoals = async () => {
    const r = await fetch('/api/health-goals', { credentials: 'same-origin' });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setGoals(j.data || []);
  };
  useEffect(() => { loadGoals(); }, [refreshKey]);

  async function addGoal(e) {
    e.preventDefault();
    await fetch('/api/health-goals', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ goalType: gType, targetValue: gTarget }) });
    setGTarget(''); setRefreshKey((k) => k + 1);
  }

  return (
    <div className="space-y-5">
      <MetricForm onSaved={() => setRefreshKey((k) => k + 1)} />

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Goals</h2>
          <a href={`/${locale}/patient/health-tracker/analytics`} className="text-sm font-semibold text-brand">Analytics →</a>
        </div>
        <form onSubmit={addGoal} className="mb-3 flex flex-wrap gap-2">
          <select value={gType} onChange={(e) => setGType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            {CHARTS.map((c) => <option key={c.type} value={c.type}>{c.label}</option>)}
          </select>
          <input type="number" step="0.1" value={gTarget} onChange={(e) => setGTarget(e.target.value)} required placeholder="Target" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Add goal</button>
        </form>
        {goals.length === 0 ? <p className="text-sm text-gray-400">No active goals.</p> : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{goals.map((g) => <GoalCard key={g.id} goal={g} />)}</div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold text-gray-900">Trends</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {CHARTS.map((c) => <MetricChart key={c.type} type={c.type} label={c.label} invert={c.invert} refreshKey={refreshKey} />)}
        </div>
      </section>
    </div>
  );
}
