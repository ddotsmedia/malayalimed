'use client';
import { useEffect, useState } from 'react';
import AdminChart from '@/components/admin/AdminChart';

export default function PatientAnalyticsPage() {
  const [d, setD] = useState(null);
  useEffect(() => { fetch('/api/admin/analytics/patients').then((r) => r.json()).then((j) => setD(j.data)).catch(() => {}); }, []);
  if (!d) return <p className="p-2 text-sm text-slate-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Patient Analytics</h1>
      <div className="grid grid-cols-3 gap-3">
        {[['Total', d.kpis.total], ['Active (30d)', d.kpis.active], ['New this month', d.kpis.newMonth]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-brand">{v}</p><p className="text-xs text-slate-500">{l}</p></div>
        ))}
      </div>
      <AdminChart type="area" title="Registrations (90d)" series={[{ name: 'Patients', data: d.trend.map((x) => x.n) }]} categories={d.trend.map((x) => x.day)} />
    </div>
  );
}
