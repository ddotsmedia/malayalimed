import Link from 'next/link';
import { resolveLocale, t } from '@/lib/i18n';
import { listSpecialties, listDistricts } from '@/lib/reference';
import SearchBar from '@/components/SearchBar';

export const dynamic = 'force-dynamic';

export default async function Home(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const [specialties] = await Promise.all([listSpecialties(), listDistricts()]);

  const hubs = [
    { href: `/${locale}/womens-health`, icon: '👩', label: t(locale, 'womens_health') },
    { href: `/${locale}/mental-health`, icon: '🧘', label: t(locale, 'mental_health') },
    { href: `/${locale}/child-health`, icon: '🧒', label: t(locale, 'child_health') },
    { href: `/${locale}/jobs`, icon: '💼', label: t(locale, 'jobs') }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-8 text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t(locale, 'site')}</h1>
        <p className="mt-2 max-w-xl text-teal-50">{t(locale, 'tagline')}</p>
        <div className="mt-5 rounded-2xl bg-white p-3">
          <SearchBar locale={locale} action={`/${locale}/doctors`} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">{ml ? 'സ്പെഷ്യാലിറ്റികൾ' : 'Specialties'}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {specialties.map((s) => (
            <Link key={s.slug} href={`/${locale}/doctors?specialty=${s.slug}`}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 text-center hover:border-brand hover:shadow-sm">
              <span className="text-2xl">{s.icon || '🩺'}</span>
              <span className="mt-1 text-sm font-medium text-gray-800">{ml ? s.name_ml : s.name_en}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">{ml ? 'ആരോഗ്യ കേന്ദ്രങ്ങൾ' : 'Health hubs'}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {hubs.map((h) => (
            <Link key={h.href} href={h.href} className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand">
              <span className="text-2xl">{h.icon}</span><span className="font-medium text-gray-800">{h.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
