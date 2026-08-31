'use client';
import { useEffect } from 'react';
import { useAdminDashboard } from '@/hooks/admin/queries';
import { useAdminStore } from '@/lib/store/adminStore';
import AdminChart from '@/components/admin/AdminChart';

const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

function KPI({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-2xl font-extrabold text-brand">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

export default function DashboardClient() {
  const { data, isLoading, error } = useAdminDashboard();
  const setDashboardData = useAdminStore((s) => s.setDashboardData);
  useEffect(() => { if (data) setDashboardData(data.kpis); }, [data, setDashboardData]);

  if (isLoading) return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  if (error) return <p className="text-sm text-red-600">Failed to load: {error.message}</p>;

  const k = data.kpis || {};
  const c = data.charts || {};
  const reg = c.regTrend || [];
  const appt = c.apptTrend || [];
  const ratingSeries = [1, 2, 3, 4, 5].map((r) => (c.ratingDist || []).find((x) => x.rating === r)?.n || 0);
  const roles = c.roles || [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPI label="Users" value={k.users ?? 0} sub={`+${k.users_today ?? 0} today`} />
        <KPI label="Verified doctors" value={k.doctors_verified ?? 0} sub={`${k.doctors_pending ?? 0} pending`} />
        <KPI label="Hospitals" value={k.hospitals ?? 0} />
        <KPI label="Appointments today" value={k.appts_today ?? 0} />
        <KPI label="Pending reviews" value={k.reviews_pending ?? 0} />
        <KPI label="Revenue" value={money(k.revenue)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminChart type="area" title="New registrations (30d)" height={260}
          series={[{ name: 'Users', data: reg.map((d) => d.n) }]} categories={reg.map((d) => d.day)}
          options={{ fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } } }} />
        <AdminChart type="line" title="Appointments (30d)" height={260}
          series={[{ name: 'Appointments', data: appt.map((d) => d.n) }]} categories={appt.map((d) => d.day)} />
        <AdminChart type="bar" title="Review ratings distribution" height={260}
          series={[{ name: 'Reviews', data: ratingSeries }]} categories={['1★', '2★', '3★', '4★', '5★']}
          options={{ plotOptions: { bar: { distributed: true, borderRadius: 4 } }, legend: { show: false } }} />
        <AdminChart type="donut" title="Users by role" height={260}
          series={roles.map((r) => r.n)} labels={roles.map((r) => r.role)} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Recent appointments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400"><tr><th className="py-1 pr-4">Patient</th><th className="py-1 pr-4">Doctor</th><th className="py-1 pr-4">Date</th><th className="py-1">Status</th></tr></thead>
            <tbody>
              {(data.recentActivities || []).map((a) => (
                <tr key={a.id} className="border-t border-slate-100"><td className="py-1.5 pr-4">{a.patient_name}</td><td className="py-1.5 pr-4">{a.doctor_name}</td><td className="py-1.5 pr-4 text-slate-500">{a.slot_date}</td><td className="py-1.5"><span className="rounded-full bg-slate-100 px-2 text-xs">{a.status}</span></td></tr>
              ))}
              {(!data.recentActivities || data.recentActivities.length === 0) && <tr><td colSpan={4} className="py-4 text-center text-slate-400">No activity</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
