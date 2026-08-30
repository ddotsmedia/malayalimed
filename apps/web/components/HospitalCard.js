import Link from 'next/link';
import RatingDisplay from './RatingDisplay';
import { t } from '@/lib/i18n';

export default function HospitalCard({ hospital: h, locale = 'ml' }) {
  const ml = locale === 'ml';
  const name = ml ? (h.name_ml || h.name_en) : h.name_en;
  const district = ml ? (h.district_ml || h.district_en) : h.district_en;
  return (
    <Link href={`/${locale}/hospitals/${h.slug}`} className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-2xl">🏥</div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-gray-900">{name}</h3>
        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
          {district && <span>📍 {district}</span>}
          {h.type && <span className="rounded bg-gray-100 px-1.5">{h.type}</span>}
          {h.bed_count != null && <span>{h.bed_count} beds</span>}
          {h.emergency_24x7 && <span className="font-semibold text-red-600">24×7 Emergency</span>}
        </div>
        <div className="mt-1"><RatingDisplay avg={h.rating_avg} count={h.rating_count} /></div>
      </div>
    </Link>
  );
}
