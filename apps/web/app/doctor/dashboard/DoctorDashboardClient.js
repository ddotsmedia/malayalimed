'use client';
import { useEffect, useState } from 'react';
import AdminChart from '@/components/admin/AdminChart';

export default function DoctorDashboardClient() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    fetch('/api/doctor/dashboard').then((r) => r.json()).then((j) => j.data ? setData(j.data) : setErr(j.errors?.[0] || 'Failed')).catch(() => setErr('Failed'));
  }, []);
  if (err) return <p className="text-sm text-red-600">{err}</p>;
  if (!data) return <p className="text-sm text-slate-500">Loading…</p>;
  const k = data.kpis;
  const earn = data.earnings || [];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[['Today', k.todayCount], ['Upcoming', k.upcomingCount], ['30d earnings', '₹' + k.monthEarnings], ['Rating', k.ratingAvg]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-brand">{v}</p><p className="text-xs text-slate-500">{l}</p></div>
        ))}
      </div>
      <AdminChart type="bar" title="Monthly earnings" series={[{ name: '₹', data: earn.map((e) => Number(e.amount)) }]} categories={earn.map((e) => e.month)} />
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-bold text-slate-900">Upcoming appointments</h2>
        {data.upcoming.length === 0 ? <p className="text-sm text-slate-400">None.</p> : (
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400"><tr><th className="py-1 pr-4">Patient</th><th className="py-1 pr-4">Date</th><th className="py-1">Status</th></tr></thead>
            <tbody>{data.upcoming.map((a) => <tr key={a.id} className="border-t border-slate-100"><td className="py-1.5 pr-4">{a.patient_name}</td><td className="py-1.5 pr-4 text-slate-500">{String(a.slot_date).slice(0, 10)} {String(a.slot_start).slice(0, 5)}</td><td className="py-1.5">{a.status}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
