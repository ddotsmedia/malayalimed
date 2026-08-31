'use client';
import { useEffect, useState } from 'react';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function AppointmentsList({ locale }) {
  const [rows, setRows] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () => fetch('/api/appointments/list').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  async function doCancel() {
    setBusy(true);
    await fetch('/api/appointments/cancel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ appointmentId: cancelId }) });
    setBusy(false); setCancelId(null); load();
  }

  if (!rows) return <p className="text-sm text-gray-500">Loading…</p>;
  if (rows.length === 0) return <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">No appointments.</p>;
  return (
    <div className="space-y-2">
      {rows.map((a) => (
        <div key={a.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
          <div>
            <p className="font-semibold text-gray-900">{a.doctor_name}</p>
            <p className="text-xs text-gray-500">{a.slot_date} {String(a.slot_start).slice(0, 5)} · {a.status}</p>
          </div>
          {a.status !== 'cancelled' && (
            <div className="flex gap-2">
              <a href={`/${locale}/patient/appointments/${a.id}/reschedule`} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs">Reschedule</a>
              <button onClick={() => setCancelId(a.id)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Cancel</button>
            </div>
          )}
        </div>
      ))}
      <ConfirmModal open={!!cancelId} title="Cancel appointment?" message="This cannot be undone." confirmLabel="Cancel appointment" busy={busy} onConfirm={doCancel} onClose={() => setCancelId(null)} />
    </div>
  );
}
