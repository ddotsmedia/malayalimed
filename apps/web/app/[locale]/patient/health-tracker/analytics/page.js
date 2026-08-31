import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import MetricChart from '@/components/health/MetricChart';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health Analytics' };

export default async function HealthAnalyticsPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/health-tracker/analytics`);
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Health Analytics</h1>
      <a href={`/${locale}/patient/health-tracker`} className="text-sm font-semibold text-brand">← Back to tracker</a>
      <div className="grid gap-4 lg:grid-cols-2">
        <MetricChart type="weight" label="Weight trend (kg)" invert />
        <MetricChart type="steps" label="Daily steps" />
        <MetricChart type="sleep_hours" label="Sleep (hrs)" />
        <MetricChart type="blood_sugar" label="Blood sugar (mg/dL)" invert />
        <MetricChart type="heart_rate" label="Heart rate (bpm)" />
        <MetricChart type="mood" label="Mood (/10)" />
      </div>
    </div>
  );
}
