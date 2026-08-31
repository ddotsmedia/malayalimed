'use client';
import { useState } from 'react';
import SymptomInput from '@/components/symptom/SymptomInput';
import ResultsPanel from '@/components/symptom/ResultsPanel';

export default function SymptomCheckerClient({ locale = 'ml' }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const toggle = (name) => setSelected((s) => s.includes(name) ? s.filter((x) => x !== name) : [...s, name]);

  async function submit() {
    if (!selected.length) return;
    setBusy(true); setErr(''); setResult(null);
    const r = await fetch('/api/symptom-checker', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ symptoms: selected }) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) setResult(j.data); else setErr(j.errors?.[0] || 'Failed');
  }

  return (
    <div className="space-y-4">
      <SymptomInput selected={selected} onToggle={toggle} />
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">{selected.length} selected:</span>
          {selected.map((s) => <span key={s} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">{s}</span>)}
        </div>
      )}
      <button onClick={submit} disabled={busy || !selected.length} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {busy ? 'Checking…' : 'Check symptoms'}
      </button>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <ResultsPanel result={result} locale={locale} />
    </div>
  );
}
