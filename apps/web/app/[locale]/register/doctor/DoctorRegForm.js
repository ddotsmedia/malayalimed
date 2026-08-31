'use client';
import { useState } from 'react';

const inp = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm';

export default function DoctorRegForm({ locale = 'ml', specialties = [], districts = [] }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ email: '', password: '', phone: '', displayName: '', specialtyId: '', districtId: '', yearsExperience: '', consultationFee: '', regNo: '', about: '' });
  const [quals, setQuals] = useState(['']);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  async function submit() {
    setBusy(true); setErr('');
    const body = { ...f, qualifications: quals.map((q) => q.trim()).filter(Boolean) };
    const r = await fetch('/api/auth/register/doctor', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) window.location.href = `/${locale}/login?msg=pending_verification`;
    else setErr(j.errors?.[0] || 'Failed');
  }

  const Dots = () => (
    <div className="mb-4 flex gap-2">{[1, 2, 3, 4].map((n) => <span key={n} className={`h-2 flex-1 rounded-full ${n <= step ? 'bg-brand' : 'bg-gray-200'}`} />)}</div>
  );

  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
      <Dots />
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900">Step 1 · Personal</h2>
          <input className={inp} placeholder="Full name *" value={f.displayName} onChange={(e) => set('displayName', e.target.value)} />
          <input className={inp} placeholder="Email *" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} />
          <input className={inp} placeholder="Phone *" value={f.phone} onChange={(e) => set('phone', e.target.value)} />
          <input className={inp} placeholder="Password (min 8) *" type="password" value={f.password} onChange={(e) => set('password', e.target.value)} />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900">Step 2 · Practice</h2>
          <select className={inp} value={f.specialtyId} onChange={(e) => set('specialtyId', e.target.value)}><option value="">Specialty…</option>{specialties.map((s) => <option key={s.id} value={s.id}>{s.name_en}</option>)}</select>
          <select className={inp} value={f.districtId} onChange={(e) => set('districtId', e.target.value)}><option value="">District…</option>{districts.map((d) => <option key={d.id} value={d.id}>{d.name_en}</option>)}</select>
          <input className={inp} placeholder="Years experience" type="number" value={f.yearsExperience} onChange={(e) => set('yearsExperience', e.target.value)} />
          <input className={inp} placeholder="Consultation fee (₹)" type="number" value={f.consultationFee} onChange={(e) => set('consultationFee', e.target.value)} />
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900">Step 3 · Credentials</h2>
          <input className={inp} placeholder="NMC Registration No *" value={f.regNo} onChange={(e) => set('regNo', e.target.value)} />
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500">Qualifications</p>
            {quals.map((q, i) => (
              <input key={i} className={inp} placeholder={`Qualification ${i + 1}`} value={q} onChange={(e) => setQuals((qs) => qs.map((x, k) => k === i ? e.target.value : x))} />
            ))}
            <button type="button" onClick={() => setQuals((qs) => [...qs, ''])} className="text-xs font-semibold text-brand">+ Add qualification</button>
          </div>
          <textarea className={inp} rows={3} placeholder="About you" value={f.about} onChange={(e) => set('about', e.target.value)} />
        </div>
      )}
      {step === 4 && (
        <div className="space-y-2 text-sm">
          <h2 className="font-bold text-gray-900">Step 4 · Review</h2>
          <p><b>{f.displayName}</b> · {f.email} · {f.phone}</p>
          <p>Reg: {f.regNo} · Exp: {f.yearsExperience || '—'}y · Fee: ₹{f.consultationFee || '—'}</p>
          <p>Qualifications: {quals.filter(Boolean).join(', ') || '—'}</p>
          <p className="text-xs text-gray-500">Your profile is submitted for NMC verification before it goes live.</p>
        </div>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex justify-between">
        <button onClick={back} disabled={step === 1} className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40">Back</button>
        {step < 4
          ? <button onClick={next} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Next</button>
          : <button onClick={submit} disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Submitting…' : 'Submit'}</button>}
      </div>
    </div>
  );
}
