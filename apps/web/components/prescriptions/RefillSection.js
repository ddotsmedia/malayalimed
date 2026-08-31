'use client';
import { useEffect, useState } from 'react';

export default function RefillSection({ prescriptionId, createdAt }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const ageDays = (Date.now() - new Date(createdAt).getTime()) / 86400000;
  const eligible = ageDays >= 30 && ageDays < 90;

  const load = () => fetch(`/api/prescriptions/${prescriptionId}/request-refill`).then((r) => r.json()).then((j) => setRequests(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  async function submit() {
    setBusy(true); setErr('');
    const r = await fetch(`/api/prescriptions/${prescriptionId}/request-refill`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reason }) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) { setOpen(false); setReason(''); load(); } else setErr(j.errors?.[0] || 'Failed');
  }

  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Refills</h3>
        {eligible
          ? <button onClick={() => setOpen(true)} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white">Request Refill</button>
          : <span className="text-xs text-gray-400">{ageDays < 30 ? 'Available 30 days after issue' : 'Refill window expired (90 days)'}</span>}
      </div>

      {requests.length > 0 && (
        <ul className="space-y-1 text-sm">
          {requests.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="capitalize text-gray-700">{r.status === 'requested' ? 'Pending doctor approval' : r.status}</span>
              <span className="text-xs text-gray-400">{String(r.created_at).slice(0, 10)}</span>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-bold text-gray-900">Request a refill</h4>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Reason (optional)" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Cancel</button>
              <button onClick={submit} disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? '…' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
