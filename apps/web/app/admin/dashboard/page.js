import { adminStats, registrationTrend } from '@/lib/admin';
import { LineChart } from '@/components/Charts';
import { fmtCurrency } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

function Stat({ label, value, sub }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-extrabold text-brand">{value}</p><p className="text-xs text-slate-500">{label}</p>{sub && <p className="text-[11px] text-slate-400">{sub}</p>}</div>;
}

export default async function AdminDashboard() {
  const [s, trend] = await Promise.all([adminStats(), registrationTrend(30)]);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Users" value={s.users ?? 0} sub={`+${s.users_today ?? 0} today`} />
        <Stat label="Verified doctors" value={s.doctors_verified ?? 0} sub={`${s.doctors_pending ?? 0} pending`} />
        <Stat label="Hospitals" value={s.hospitals ?? 0} />
        <Stat label="Appointments today" value={s.appts_today ?? 0} />
        <Stat label="Pending reviews" value={s.reviews_pending ?? 0} />
        <Stat label="Revenue" value={fmtCurrency(s.revenue ?? 0)} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><LineChart series={trend} label="New registrations (30d)" /></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['/admin/doctors', '🩺 Verify doctors'], ['/admin/appointments', '📅 Appointments'], ['/admin/users', '👥 Users'], ['/admin/analytics', '📈 Analytics']].map(([h, l]) => (
          <a key={h} href={h} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 hover:border-brand">{l}</a>
        ))}
      </div>
    </div>
  );
}
