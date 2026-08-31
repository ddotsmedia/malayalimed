import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import FetchTable from '@/components/portal/FetchTable';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lab Results' };

export default async function LabResultsPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/lab-results`);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Lab Results</h1>
      <FetchTable url="/api/patient/lab-results" empty="No lab results yet." columns={[
        { key: 'test_name', label: 'Test' },
        { key: 'result_value', label: 'Result' },
        { key: 'normal_range', label: 'Normal range' },
        { key: 'uploaded_at', label: 'Date', render: (r) => String(r.uploaded_at).slice(0, 10) },
        { key: 'pdf', label: 'PDF', render: (r) => r.pdf_url ? <a href={r.pdf_url} download className="text-brand">Download</a> : '—' },
      ]} />
    </div>
  );
}
