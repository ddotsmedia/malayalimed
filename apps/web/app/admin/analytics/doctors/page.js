'use client';
import FetchTable from '@/components/portal/FetchTable';

export default function DoctorPerformancePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Doctor Performance</h1>
      <FetchTable url="/api/admin/analytics/doctors" empty="No doctors." columns={[
        { key: 'display_name', label: 'Doctor' },
        { key: 'appointments', label: 'Appointments' },
        { key: 'rating_avg', label: 'Rating', render: (r) => `${r.rating_avg} (${r.rating_count})` },
        { key: 'revenue', label: 'Revenue', render: (r) => `₹${r.revenue}` },
      ]} />
    </div>
  );
}
