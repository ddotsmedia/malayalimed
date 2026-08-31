import { resolveLocale } from '@/lib/i18n';
import { journeyDoctors, getJourney } from '@/lib/journeys';

export const dynamic = 'force-dynamic';

export default async function Page(props) {
  const { locale: l, slug } = await props.params;
  const locale = resolveLocale(l);
  const [j, docs] = await Promise.all([getJourney(slug), journeyDoctors(slug)]);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <a href={`/${locale}/journeys/${slug}`} className="text-sm text-brand">← {j?.title || 'Journey'}</a>
      <h1 className="text-xl font-bold text-gray-900">Specialists</h1>
      {docs.length === 0 ? <p className="text-sm text-gray-400">No published specialists yet.</p> : (
        <div className="space-y-2">
          {docs.map((d) => (
            <a key={d.id} href={`/${locale}/doctors/${d.slug}`} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
              <div><p className="font-semibold text-gray-900">{d.display_name}</p><p className="text-xs text-gray-500">{d.specialty_en}</p></div>
              <div className="text-right text-sm"><p className="font-semibold text-brand">{d.consultation_fee ? `₹${d.consultation_fee}` : '—'}</p><p className="text-xs text-amber-500">★ {d.rating_avg}</p></div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
