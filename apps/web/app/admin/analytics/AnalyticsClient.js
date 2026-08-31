'use client';
import { useState } from 'react';
import { useAnalytics } from '@/hooks/admin/queries';
import AdminChart from '@/components/admin/AdminChart';

const TABS = ['Overview', 'Appointments', 'Users', 'Reviews'];

export default function AnalyticsClient() {
  const [tab, setTab] = useState('Overview');
  const { data, isLoading, error } = useAnalytics();
  if (isLoading) return <p className="text-sm text-slate-500">Loading analytics…</p>;
  if (error) return <p className="text-sm text-red-600">{error.message}</p>;

  const reg = data.regTrend || [];
  const appt = data.apptTrend || [];
  const roles = data.roles || [];
  const apptStatus = data.apptStatus || [];
  const ratingSeries = [1, 2, 3, 4, 5].map((r) => (data.ratingDist || []).find((x) => x.rating === r)?.n || 0);
  const top = data.topDoctors || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 text-sm">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg px-3 py-1.5 font-medium ${tab === t ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminChart type="area" title="User growth (90d)" series={[{ name: 'Users', data: reg.map((d) => d.n) }]} categories={reg.map((d) => d.day)} options={{ fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } } }} />
          <AdminChart type="line" title="Appointments (30d)" series={[{ name: 'Appointments', data: appt.map((d) => d.n) }]} categories={appt.map((d) => d.day)} />
          <AdminChart type="bar" title="Top doctors by rating" height={300} series={[{ name: 'Rating', data: top.map((d) => Number(d.rating_avg)) }]} categories={top.map((d) => d.display_name)} options={{ plotOptions: { bar: { horizontal: true, borderRadius: 3 } }, xaxis: { max: 5 } }} />
          <AdminChart type="donut" title="Users by role" series={roles.map((r) => r.n)} labels={roles.map((r) => r.role)} />
        </div>
      )}
      {tab === 'Appointments' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminChart type="donut" title="Appointments by status" series={apptStatus.map((s) => s.n)} labels={apptStatus.map((s) => s.status)} />
          <AdminChart type="line" title="Appointment trend (30d)" series={[{ name: 'Appointments', data: appt.map((d) => d.n) }]} categories={appt.map((d) => d.day)} />
        </div>
      )}
      {tab === 'Users' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminChart type="area" title="Cumulative growth (90d)" series={[{ name: 'Users', data: reg.reduce((acc, d) => { acc.push((acc[acc.length - 1] || 0) + d.n); return acc; }, []) }]} categories={reg.map((d) => d.day)} />
          <AdminChart type="pie" title="Users by role" series={roles.map((r) => r.n)} labels={roles.map((r) => r.role)} />
        </div>
      )}
      {tab === 'Reviews' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminChart type="bar" title="Rating distribution" series={[{ name: 'Reviews', data: ratingSeries }]} categories={['1★', '2★', '3★', '4★', '5★']} options={{ plotOptions: { bar: { distributed: true, borderRadius: 4 } }, legend: { show: false } }} />
          <AdminChart type="bar" title="Top doctors by rating" height={300} series={[{ name: 'Rating', data: top.map((d) => Number(d.rating_avg)) }]} categories={top.map((d) => d.display_name)} options={{ plotOptions: { bar: { horizontal: true, borderRadius: 3 } }, xaxis: { max: 5 } }} />
        </div>
      )}
    </div>
  );
}
