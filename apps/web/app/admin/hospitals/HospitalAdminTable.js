'use client';

import AdminTable from '@/components/admin/AdminTable';

const decide = async (id, status) => {
  const r = await fetch(`/api/admin/hospitals/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
  return r.ok;
};

export default function HospitalAdminTable({ hospitals }) {
  const columns = [
    { key: 'name_en', label: 'Name' },
    { key: 'district', label: 'District' },
    { key: 'verification_status', label: 'Status' },
    { key: 'listing_status', label: 'Listing' }
  ];
  const rowActions = (h) => (h.verification_status === 'pending' ? [
    { label: 'Verify', tone: 'green', removes: false, run: (id) => decide(id, 'verified') },
    { label: 'Reject', tone: 'red', removes: false, run: (id) => decide(id, 'rejected') }
  ] : []);
  return <AdminTable rows={hospitals} columns={columns} rowActions={rowActions} searchKeys={['name_en', 'district']} exportName="hospitals" empty="No hospitals." />;
}
