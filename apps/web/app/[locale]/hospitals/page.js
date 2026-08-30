import { resolveLocale, t } from '@/lib/i18n';
import { searchHospitals } from '@/lib/hospitals';
import SearchBar from '@/components/SearchBar';
import HospitalCard from '@/components/HospitalCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Hospitals' };

export default async function HospitalsPage(props) {
  const params = await props.params;
  const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale);
  const hospitals = await searchHospitals({ term: sp.q || '', district: sp.district || '' });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">{t(locale, 'find_hospital')}</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <SearchBar locale={locale} action={`/${locale}/hospitals`} defaultValue={sp.q || ''} />
      </div>
      {hospitals.length === 0
        ? <EmptyState icon="🏥" message={t(locale, 'no_results')} />
        : <div className="grid gap-3 sm:grid-cols-2">{hospitals.map((h) => <HospitalCard key={h.id} hospital={h} locale={locale} />)}</div>}
    </div>
  );
}
