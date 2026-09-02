'use client';
import { useEffect, useState } from 'react';

const TYPES = ['Fitbit', 'Apple Health', 'Google Fit', 'BP Monitor', 'Glucometer', 'Pulse Oximeter'];

export default function DeviceList() {
  const [rows, setRows] = useState([]);
  const load = () => fetch('/api/devices').then((r) => r.json()).then((j) => setRows(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  async function connect(type) {
    await fetch('/api/devices/connect', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceType: type, deviceName: type }) });
    load();
  }
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">Note: real Fitbit/Apple/Google OAuth is not connected. "Connect" registers the device; readings are entered on the Health Metrics page.</div>
      <div className="flex flex-wrap gap-2">{TYPES.map((t) => <button key={t} onClick={() => connect(t)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-brand">+ {t}</button>)}</div>
      {rows.length === 0 ? <p className="text-sm text-gray-400">No devices connected.</p> : (
        <div className="space-y-2">
          {rows.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
              <div><p className="font-semibold text-gray-900">{d.device_name}</p><p className="text-xs text-gray-500">{d.is_active ? 'Active' : 'Disconnected'} · last sync {d.last_sync ? String(d.last_sync).slice(0, 16).replace('T', ' ') : '—'}</p></div>
              <div className="flex gap-2 text-xs">
                <a href={`/patient/devices/${d.id}/settings`} className="rounded-lg border border-gray-300 px-2 py-1">Settings</a>
                <a href={`/patient/devices/${d.id}/disconnect`} className="rounded-lg bg-red-600 px-2 py-1 font-semibold text-white">Disconnect</a>
              </div>
            </div>
          ))}
        </div>
      )}
      <a href="/patient/health-metrics" className="inline-block text-sm font-semibold text-brand">View vitals timeline →</a>
    </div>
  );
}
