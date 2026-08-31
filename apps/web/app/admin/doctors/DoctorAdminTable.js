'use client';

import AdminTable from '@/components/admin/AdminTable';

const decide = async (id, status) => {
  const r = await fetch(`/api/admin/doctors/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
  return r.ok;
};

export default function DoctorAdminTable({ doctors, status }) {
  const columns = [
    { key: 'display_name', label: 'Name' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'district', label: 'District' },
    { key: 'reg_no', label: 'Reg No', render: (r) => r.reg_no || '—' },
    { key: 'verification_status', label: 'Status' }
  ];
  const rowActions = () => (status === 'pending' ? [
    { label: 'Verify', tone: 'green', run: (id) => decide(id, 'verified') },
    { label: 'Reject', tone: 'red', run: (id) => decide(id, 'rejected') }
  ] : []);
  return <AdminTable rows={doctors} columns={columns} rowActions={rowActions} searchKeys={['display_name', 'specialty', 'district', 'reg_no']} exportName={`doctors-${status}`} empty={`No ${status} doctors.`} />;
}
