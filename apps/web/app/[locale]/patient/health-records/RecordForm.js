'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TYPES = ['prescription', 'lab_report', 'imaging', 'vaccination', 'allergy', 'medication', 'condition', 'surgery', 'note'];

export default function RecordForm({ locale = 'ml' }) {
  const ml = locale === 'ml';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    const f = new FormData(e.target);
    try {
      const r = await fetch('/api/health-records', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record_type: f.get('record_type'), title: f.get('title'), description: f.get('description'), record_date: f.get('record_date') || null, doctor_name: f.get('doctor_name') || null, hospital_name: f.get('hospital_name') || null })
      });
      if (r.ok) { e.target.reset(); router.refresh(); } else { const j = await r.json().catch(() => ({})); setErr(j.errors?.[0] || 'Failed'); }
    } catch { setErr('Network error'); }
    setBusy(false);
  }

  const inp = 'rounded-lg border border-slate-300 px-3 py-2 text-sm';
  return (
    <form onSubmit={submit} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
      <input name="title" required placeholder={ml ? 'ശീർഷകം' : 'Title'} className={`${inp} sm:col-span-2`} />
      <select name="record_type" className={inp}>{TYPES.map((tp) => <option key={tp} value={tp}>{tp.replace('_', ' ')}</option>)}</select>
      <input name="record_date" type="date" className={inp} />
      <input name="doctor_name" placeholder={ml ? 'ഡോക്ടർ (ഓപ്ഷണൽ)' : 'Doctor (optional)'} className={inp} />
      <input name="hospital_name" placeholder={ml ? 'ആശുപത്രി (ഓപ്ഷണൽ)' : 'Hospital (optional)'} className={inp} />
      <textarea name="description" rows={2} placeholder={ml ? 'വിവരണം' : 'Notes'} className={`${inp} sm:col-span-2`} />
      <button disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60 sm:col-span-2">{busy ? '…' : (ml ? 'റെക്കോർഡ് ചേർക്കുക' : 'Add record')}</button>
      {err && <p className="text-sm text-red-600 sm:col-span-2">{err}</p>}
    </form>
  );
}
