import { resolveLocale } from '@/lib/i18n';
import { listJourneys } from '@/lib/journeys';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health Journeys' };

export default async function Page(props) {
  const { locale: l } = await props.params;
  const locale = resolveLocale(l);
  const journeys = await listJourneys();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Health Journeys</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {journeys.map((j) => (
          <a key={j.id} href={`/${locale}/journeys/${j.slug}`} className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-brand">
            <div className="text-3xl">{j.icon}</div>
            <h2 className="mt-1 font-bold text-gray-900">{j.title}</h2>
            <p className="text-sm text-gray-600">{j.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
