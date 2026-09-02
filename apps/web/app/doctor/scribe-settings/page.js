import FetchTable from '@/components/portal/FetchTable';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Scribe Settings' };
export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">AI Scribe Settings</h1>
      <p className="text-sm text-slate-500">Note: speech-to-text is not connected; the scribe drafts notes from a pasted/typed transcript (Claude if an API key is set, else a SOAP template).</p>
      <a href="/doctor/ai-templates" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Manage templates →</a>
      <h2 className="text-sm font-bold text-slate-900">Your templates</h2>
      <FetchTable url="/api/scribe/templates" empty="No templates yet." columns={[{ key: 'template_name', label: 'Template' }, { key: 'section_types', label: 'Sections', render: (r) => (r.section_types || []).join(', ') }]} />
    </div>
  );
}
