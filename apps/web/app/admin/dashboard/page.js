import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
      <DashboardClient />
    </div>
  );
}
