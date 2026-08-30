import { resolveLocale, t } from '@/lib/i18n';
import { searchDoctors } from '@/lib/doctors';
import { listSpecialties } from '@/lib/reference';
import SearchBar from '@/components/SearchBar';
import SpecialtyFilter from '@/components/SpecialtyFilter';
import DoctorCard from '@/components/DoctorCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Doctors' };

export default async function DoctorsPage(props) {
  const params = await props.params;
  const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale);
  const [doctors, specialties] = await Promise.all([
    searchDoctors({ term: sp.q || '', specialty: sp.specialty || '', district: sp.district || '' }),
    listSpecialties()
  ]);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">{t(locale, 'find_doctor')}</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <SearchBar locale={locale} action={`/${locale}/doctors`} defaultValue={sp.q || ''}
          extra={<SpecialtyFilter specialties={specialties} selected={sp.specialty || ''} locale={locale} />} />
      </div>
      {doctors.length === 0
        ? <EmptyState icon="🩺" message={t(locale, 'no_results')} />
        : <div className="grid gap-3 sm:grid-cols-2">{doctors.map((d) => <DoctorCard key={d.id} doctor={d} locale={locale} />)}</div>}
    </div>
  );
}
