import { notFound } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getJourney } from '@/lib/journeys';

export const dynamic = 'force-dynamic';

export default async function Page(props) {
  const { locale: l, slug } = await props.params;
  const locale = resolveLocale(l);
  const j = await getJourney(slug);
  if (!j) notFound();
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="text-4xl">{j.icon}</div>
      <h1 className="text-2xl font-bold text-gray-900">{j.title}</h1>
      <p className="text-gray-700">{j.description}</p>
      <a href={`/${locale}/journeys/${slug}/doctors`} className="inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">Find specialists →</a>
    </div>
  );
}
