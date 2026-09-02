import FetchTable from '@/components/portal/FetchTable';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Scribe Audit' };
export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">AI Scribe Audit Trail</h1>
      <FetchTable url="/api/admin/scribe-audit" empty="No scribe sessions." columns={[
        { key: 'doctor', label: 'Doctor' },
        { key: 'created_at', label: 'Created', render: (r) => String(r.created_at).slice(0, 16).replace('T', ' ') },
        { key: 'signed_at', label: 'Signed', render: (r) => r.signed_at ? String(r.signed_at).slice(0, 16).replace('T', ' ') : '— unsigned' },
      ]} />
    </div>
  );
}
