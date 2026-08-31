'use client';
import { useState } from 'react';
import { METRIC_TYPES, METRIC_UNITS } from '@/lib/metricTypes';

const LABELS = { weight: 'Weight', blood_pressure: 'Blood Pressure', blood_sugar: 'Blood Sugar', heart_rate: 'Heart Rate', sleep_hours: 'Sleep', steps: 'Steps', mood: 'Mood' };

export default function MetricForm({ onSaved }) {
  const [metricType, setType] = useState('weight');
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const isBp = metricType === 'blood_pressure';

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    const res = await fetch('/api/health-metrics', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ metricType, value, value2: isBp ? value2 : null, unit: METRIC_UNITS[metricType] }),
    });
    setBusy(false);
    if (res.ok) { setValue(''); setValue2(''); setMsg('Saved ✓'); onSaved && onSaved(metricType); }
    else { const j = await res.json().catch(() => ({})); setMsg(j.errors?.[0] || 'Failed'); }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-4">
      <select value={metricType} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
        {METRIC_TYPES.map((m) => <option key={m} value={m}>{LABELS[m]}</option>)}
      </select>
      <input type="number" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} required placeholder={isBp ? 'Systolic' : `Value (${METRIC_UNITS[metricType]})`} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
      {isBp && <input type="number" step="1" value={value2} onChange={(e) => setValue2(e.target.value)} required placeholder="Diastolic" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />}
      <button disabled={busy} className={`rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${isBp ? '' : 'sm:col-start-4'}`}>{busy ? '…' : 'Log'}</button>
      {msg && <span className="text-xs font-semibold text-brand sm:col-span-4">{msg}</span>}
    </form>
  );
}
