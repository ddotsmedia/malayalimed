import { adminStats } from '@/lib/admin';
import { fmtCurrency } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function AdminReports() {
  const s = await adminStats();
  const rows = [
    ['Total users', s.users ?? 0], ['New users today', s.users_today ?? 0],
    ['Verified doctors', s.doctors_verified ?? 0], ['Pending doctors', s.doctors_pending ?? 0],
    ['Hospitals', s.hospitals ?? 0], ['Appointments today', s.appts_today ?? 0],
    ['Pending reviews', s.reviews_pending ?? 0], ['Total revenue', fmtCurrency(s.revenue ?? 0)]
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Reports</h1>
      <p className="text-sm text-slate-500">Platform snapshot · generated {new Date().toISOString().slice(0, 16).replace('T', ' ')}</p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <tbody className="divide-y divide-slate-100">
            {rows.map(([l, v]) => <tr key={l}><td className="px-4 py-2 text-slate-600">{l}</td><td className="px-4 py-2 text-right font-semibold text-slate-900">{v}</td></tr>)}
          </tbody>
        </table>
      </div>
      <a href="/api/admin/analytics" className="inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-brand">View analytics JSON →</a>
    </div>
  );
}
