'use client';
import { useEffect, useState } from 'react';
import AdminChart from '@/components/admin/AdminChart';

export default function AppointmentAnalyticsPage() {
  const [d, setD] = useState(null);
  useEffect(() => { fetch('/api/admin/analytics/appointments').then((r) => r.json()).then((j) => setD(j.data)).catch(() => {}); }, []);
  if (!d) return <p className="p-2 text-sm text-slate-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Appointment Analytics</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-brand">{d.noShowRate}%</p><p className="text-xs text-slate-500">No-show rate</p></div>
      <AdminChart type="line" title="Bookings per day (30d)" series={[{ name: 'Bookings', data: d.daily.map((x) => x.cnt) }]} categories={d.daily.map((x) => x.day)} />
      <AdminChart type="donut" title="By status" series={d.byStatus.map((x) => x.n)} labels={d.byStatus.map((x) => x.status)} />
    </div>
  );
}
