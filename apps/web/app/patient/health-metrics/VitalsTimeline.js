'use client';
import { useEffect, useState } from 'react';
import AdminChart from '@/components/admin/AdminChart';

export default function VitalsTimeline() {
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [metric, setMetric] = useState('heart_rate');
  const [value, setValue] = useState('');
  const [trend, setTrend] = useState([]);
  useEffect(() => { fetch('/api/devices').then((r) => r.json()).then((j) => { setDevices(j.data || []); if (j.data?.[0]) setDeviceId(j.data[0].id); }); }, []);
  const loadTrend = () => fetch(`/api/vitals/trends?metric=${metric}&days=30`).then((r) => r.json()).then((j) => setTrend(j.data || []));
  useEffect(() => { loadTrend(); }, [metric]);
  async function record() {
    if (!deviceId || !value) return;
    await fetch(`/api/devices/${deviceId}/metrics`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ metricType: metric, value }) });
    setValue(''); loadTrend();
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4">
        <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm">{devices.map((d) => <option key={d.id} value={d.id}>{d.device_name}</option>)}</select>
        <select value={metric} onChange={(e) => setMetric(e.target.value)} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm">{['heart_rate', 'blood_pressure', 'spo2', 'glucose', 'steps'].map((m) => <option key={m} value={m}>{m}</option>)}</select>
        <input value={value} onChange={(e) => setValue(e.target.value)} type="number" placeholder="Reading" className="w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-sm" />
        <button onClick={record} className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white">Log reading</button>
      </div>
      {trend.length === 0 ? <p className="text-sm text-gray-400">No readings yet for {metric}. Log one above.</p> : (
        <AdminChart type="line" title={`${metric} (30d)`} series={[{ name: metric, data: trend.map((t) => Number(t.value)) }]} categories={trend.map((t) => String(t.d).slice(5))} />
      )}
      <p className="text-xs text-gray-400">Note: near-real-time updates use polling (no WebSocket layer).</p>
    </div>
  );
}
