import FetchTable from '@/components/portal/FetchTable';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Scribe History' };
export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Scribe History</h1>
      <FetchTable url="/api/scribe/templates" empty="No sessions." columns={[{ key: 'template_name', label: 'Templates configured' }]} />
      <p className="text-sm text-slate-500">Start a scribe session from an appointment: /doctor/appointments/[id]/ai-scribe</p>
    </div>
  );
}
