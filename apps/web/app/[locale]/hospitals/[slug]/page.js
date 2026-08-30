import { notFound } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getHospitalBySlug, hospitalDepartments, hospitalServices } from '@/lib/hospitals';
import RatingDisplay from '@/components/RatingDisplay';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props) {
  const params = await props.params;
  const h = await getHospitalBySlug(params.slug);
  return { title: h ? (h.name_en || h.name_ml) : 'Hospital' };
}

export default async function HospitalProfile(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const h = await getHospitalBySlug(params.slug);
  if (!h) notFound();
  const [depts, services] = await Promise.all([hospitalDepartments(h.id), hospitalServices(h.id)]);
  const name = ml ? (h.name_ml || h.name_en) : h.name_en;
  const district = ml ? (h.district_ml || h.district_en) : h.district_en;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏥</span>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          {h.emergency_24x7 && <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">24×7</span>}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-600">
          {district && <span>📍 {district}</span>}{h.type && <span>{h.type}</span>}{h.bed_count != null && <span>{h.bed_count} beds</span>}
        </div>
        <div className="mt-1"><RatingDisplay avg={h.rating_avg} count={h.rating_count} /></div>
      </div>

      {depts.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-bold text-gray-900">{ml ? 'വിഭാഗങ്ങൾ' : 'Departments'}</h2>
          <div className="flex flex-wrap gap-2">{depts.map((d, i) => <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-sm">{ml ? (d.name_ml || d.name_en) : d.name_en}</span>)}</div>
        </section>
      )}
      {services.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-bold text-gray-900">{ml ? 'സേവനങ്ങൾ' : 'Services'}</h2>
          <ul className="space-y-1 text-sm text-gray-700">{services.map((s, i) => <li key={i}>• {ml ? (s.name_ml || s.name_en) : s.name_en}{s.available_24x7 ? ' · 24×7' : ''}</li>)}</ul>
        </section>
      )}
    </div>
  );
}
