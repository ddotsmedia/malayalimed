'use client';
import { useEffect, useState } from 'react';
import AdminChart from '@/components/admin/AdminChart';

export default function RevenueAnalyticsPage() {
  const [d, setD] = useState(null);
  useEffect(() => { fetch('/api/admin/analytics/revenue').then((r) => r.json()).then((j) => setD(j.data)).catch(() => {}); }, []);
  if (!d) return <p className="p-2 text-sm text-slate-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Revenue Analytics</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-brand">₹{d.totals.paid}</p><p className="text-xs text-slate-500">Collected</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-amber-600">₹{d.totals.pending}</p><p className="text-xs text-slate-500">Pending</p></div>
      </div>
      <AdminChart type="area" title="Daily revenue (30d)" series={[{ name: '₹', data: d.daily.map((x) => Number(x.amount)) }]} categories={d.daily.map((x) => x.day)} />
      <AdminChart type="bar" title="Revenue by doctor" series={[{ name: '₹', data: d.byDoctor.map((x) => Number(x.revenue)) }]} categories={d.byDoctor.map((x) => x.display_name)} options={{ plotOptions: { bar: { horizontal: true } } }} />
    </div>
  );
}
