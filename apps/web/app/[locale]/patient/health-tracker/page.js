import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import HealthTrackerClient from './HealthTrackerClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health Tracker' };

export default async function HealthTrackerPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/health-tracker`);
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Health Tracker</h1>
      <p className="text-sm text-gray-500">Log daily metrics and track your goals.</p>
      <HealthTrackerClient locale={locale} />
    </div>
  );
}
