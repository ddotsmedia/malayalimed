import Link from 'next/link';
import RatingDisplay from './RatingDisplay';
import { initials, fmtCurrency } from '@/lib/formatters';
import { t } from '@/lib/i18n';

export default function DoctorCard({ doctor: d, locale = 'ml' }) {
  const ml = locale === 'ml';
  const specialty = ml ? (d.specialty_ml || d.specialty_en) : d.specialty_en;
  const district = ml ? (d.district_ml || d.district_en) : d.district_en;
  return (
    <Link href={`/${locale}/doctors/${d.slug}`} className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand/10 font-bold text-brand">
        {d.photo_url ? <img src={d.photo_url} alt="" className="h-full w-full object-cover" /> : initials(d.display_name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-gray-900">{d.display_name}</h3>
          {d.verification_status === 'verified' && <span className="shrink-0 rounded-full bg-brand/10 px-1.5 text-[10px] font-bold text-brand">✓</span>}
        </div>
        {specialty && <p className="text-sm text-brand">{specialty}</p>}
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
          {district && <span>📍 {district}</span>}
          {d.years_experience != null && <span>{d.years_experience} {t(locale, 'experience')}</span>}
          {d.consultation_fee != null && <span className="font-medium text-gray-700">{fmtCurrency(d.consultation_fee)}</span>}
        </div>
        <div className="mt-1"><RatingDisplay avg={d.rating_avg} count={d.rating_count} /></div>
      </div>
    </Link>
  );
}
