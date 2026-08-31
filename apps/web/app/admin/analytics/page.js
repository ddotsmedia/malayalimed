import { adminStats, registrationTrend } from '@/lib/admin';
import { LineChart } from '@/components/Charts';
import { fmtCurrency } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function AdminAnalytics() {
  const [s, trend] = await Promise.all([adminStats(), registrationTrend(30)]);
  const cards = [
    ['Total users', s.users ?? 0], ['New today', s.users_today ?? 0],
    ['Verified doctors', s.doctors_verified ?? 0], ['Appointments today', s.appts_today ?? 0],
    ['Revenue', fmtCurrency(s.revenue ?? 0)]
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cards.map(([l, v]) => <div key={l} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xl font-bold text-brand">{v}</p><p className="text-xs text-slate-500">{l}</p></div>)}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><LineChart series={trend} label="Registrations (30d)" /></div>
    </div>
  );
}
