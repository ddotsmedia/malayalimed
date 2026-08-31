import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import FetchTable from '@/components/portal/FetchTable';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Follow-ups' };
export default async function Page(props) {
  const { locale: l } = await props.params;
  const locale = resolveLocale(l);
  if (!(await getSession())) redirect(`/${locale}/login?next=/${locale}/patient/follow-ups`);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Follow-ups</h1>
      <FetchTable url="/api/patient/follow-ups" empty="No follow-ups scheduled." columns={[
        { key: 'follow_up_date', label: 'Date', render: (r) => String(r.follow_up_date).slice(0, 10) },
        { key: 'notes', label: 'Notes' },
        { key: 'status', label: 'Status' },
      ]} />
    </div>
  );
}
