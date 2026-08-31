import { listAppointmentsAdmin } from '@/lib/admin';
import AdminTable from '@/components/admin/AdminTable';
import { fmtDate, fmtTime } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function AdminAppointments() {
  const appts = await listAppointmentsAdmin();
  const columns = [
    { key: 'booking_ref', label: 'Ref' },
    { key: 'patient_name', label: 'Patient', render: (r) => r.patient_name || '—' },
    { key: 'doctor_name', label: 'Doctor' },
    { key: 'slot_date', label: 'Date', value: (r) => fmtDate(r.slot_date), render: (r) => `${fmtDate(r.slot_date)} ${fmtTime(r.slot_start)}` },
    { key: 'mode', label: 'Mode' },
    { key: 'status', label: 'Status' }
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Appointments</h1>
      <AdminTable rows={appts} columns={columns} searchKeys={['booking_ref', 'patient_name', 'doctor_name', 'status']} exportName="appointments" empty="No appointments." />
    </div>
  );
}
