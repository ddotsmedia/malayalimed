'use client';
import { useEffect, useState } from 'react';

const STATUSES = ['submitted', 'approved', 'rejected', ''];
const badge = { submitted: 'bg-amber-100 text-amber-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

export default function RegistrationsClient() {
  const [status, setStatus] = useState('submitted');
  const [rows, setRows] = useState([]);
  const [sel, setSel] = useState(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => fetch(`/api/admin/doctor-registrations${status ? `?status=${status}` : ''}`).then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, [status]);

  async function decide(id, approve) {
    setBusy(true);
    const r = await fetch(`/api/admin/doctor-registrations/${id}/verify`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nmc_verified: approve, reason }) });
    setBusy(false);
    if (r.ok) { setSel(null); setReason(''); load(); }
  }

  return (
    <div className="space-y-3">
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
        {STATUSES.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
      </select>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Reg No</th><th className="px-3 py-2">Specialty</th><th className="px-3 py-2">District</th><th className="px-3 py-2">Status</th><th className="px-3 py-2 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">No registrations.</td></tr> :
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2">{r.display_name}<br /><span className="text-xs text-slate-400">{r.email}</span></td>
                  <td className="px-3 py-2 font-mono text-xs">{r.reg_no}</td>
                  <td className="px-3 py-2">{r.specialty || '—'}</td>
                  <td className="px-3 py-2">{r.district || '—'}</td>
                  <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge[r.status] || 'bg-slate-100'}`}>{r.status}</span></td>
                  <td className="px-3 py-2 text-right"><button onClick={() => { setSel(r); setReason(''); }} className="rounded bg-slate-700 px-2 py-1 text-xs text-white">Review</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={() => setSel(null)}>
          <div className="w-full max-w-md space-y-3 rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900">{sel.display_name}</h3>
            <div className="space-y-1 text-sm text-slate-600">
              <p>{sel.email} · {sel.phone}</p>
              <p>NMC Reg: <b>{sel.reg_no}</b> · NMC verified: {sel.nmc_verified ? '✓' : '✗'}</p>
              <p>{sel.specialty || '—'} · {sel.district || '—'} · {sel.years_experience || '—'}y · ₹{sel.consultation_fee || '—'}</p>
              {Array.isArray(sel.education_json) && sel.education_json.length > 0 && <p>Qualifications: {sel.education_json.join(', ')}</p>}
              {sel.about && <p className="text-slate-500">{sel.about}</p>}
            </div>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Rejection reason (if rejecting)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <div className="flex justify-end gap-2">
              <button disabled={busy} onClick={() => decide(sel.id, false)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Reject</button>
              <button disabled={busy} onClick={() => decide(sel.id, true)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve (NMC verified)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
