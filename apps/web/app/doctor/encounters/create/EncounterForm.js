'use client';
import { useState } from 'react';

const inp = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm';
const emptyRx = { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' };

export default function EncounterForm() {
  const [f, setF] = useState({ patientId: '', appointmentId: '', diagnosis: '', treatmentPlan: '', notes: '', followUpDate: '' });
  const [rx, setRx] = useState([{ ...emptyRx }]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setR = (i, k, v) => setRx((s) => s.map((x, j) => j === i ? { ...x, [k]: v } : x));

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    const body = { ...f, patientId: f.patientId || null, appointmentId: f.appointmentId || null, followUpDate: f.followUpDate || null, prescriptions: rx.filter((r) => r.medicineName.trim()) };
    const r = await fetch('/api/encounters', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) { setMsg('Saved ✓'); setF({ patientId: '', appointmentId: '', diagnosis: '', treatmentPlan: '', notes: '', followUpDate: '' }); setRx([{ ...emptyRx }]); }
    else setMsg(j.errors?.[0] || 'Failed');
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <input className={inp} placeholder="Patient ID (uuid, optional)" value={f.patientId} onChange={(e) => set('patientId', e.target.value)} />
        <input className={inp} placeholder="Appointment ID (uuid, optional)" value={f.appointmentId} onChange={(e) => set('appointmentId', e.target.value)} />
        <input className={`${inp} sm:col-span-2`} placeholder="Diagnosis" value={f.diagnosis} onChange={(e) => set('diagnosis', e.target.value)} />
        <textarea className={`${inp} sm:col-span-2`} rows={2} placeholder="Treatment plan" value={f.treatmentPlan} onChange={(e) => set('treatmentPlan', e.target.value)} />
        <textarea className={`${inp} sm:col-span-2`} rows={2} placeholder="Notes" value={f.notes} onChange={(e) => set('notes', e.target.value)} />
        <label className="text-sm text-slate-600">Follow-up <input type="date" className={inp} value={f.followUpDate} onChange={(e) => set('followUpDate', e.target.value)} /></label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold text-slate-900">Prescriptions</h3>
          <button type="button" onClick={() => setRx((s) => [...s, { ...emptyRx }])} className="text-xs font-semibold text-brand">+ Add medicine</button></div>
        {rx.map((r, i) => (
          <div key={i} className="mb-2 grid gap-2 sm:grid-cols-5">
            <input className={inp} placeholder="Medicine" value={r.medicineName} onChange={(e) => setR(i, 'medicineName', e.target.value)} />
            <input className={inp} placeholder="Dosage" value={r.dosage} onChange={(e) => setR(i, 'dosage', e.target.value)} />
            <input className={inp} placeholder="Frequency" value={r.frequency} onChange={(e) => setR(i, 'frequency', e.target.value)} />
            <input className={inp} placeholder="Days" type="number" value={r.duration} onChange={(e) => setR(i, 'duration', e.target.value)} />
            <input className={inp} placeholder="Instructions" value={r.instructions} onChange={(e) => setR(i, 'instructions', e.target.value)} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button disabled={busy} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save encounter'}</button>
        {msg && <span className="text-sm font-semibold text-brand">{msg}</span>}
      </div>
    </form>
  );
}
