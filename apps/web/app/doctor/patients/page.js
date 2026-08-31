'use client';
import FetchTable from '@/components/portal/FetchTable';

export default function DoctorPatientsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">My Patients</h1>
      <FetchTable url="/api/doctor/patients" empty="No patients yet." columns={[
        { key: 'full_name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'visits', label: 'Visits' },
        { key: 'last_visit', label: 'Last visit', render: (r) => r.last_visit ? String(r.last_visit).slice(0, 10) : '—' },
      ]} />
    </div>
  );
}
