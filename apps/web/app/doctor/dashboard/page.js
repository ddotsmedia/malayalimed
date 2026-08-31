import DoctorDashboardClient from './DoctorDashboardClient';
export const dynamic = 'force-dynamic';
export default function Page() {
  return <div className="space-y-4"><h1 className="text-xl font-bold text-slate-900">Doctor Dashboard</h1><DoctorDashboardClient /></div>;
}
