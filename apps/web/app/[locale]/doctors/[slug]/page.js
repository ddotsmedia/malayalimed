import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getDoctorBySlug, doctorAvailability, doctorReviews } from '@/lib/doctors';
import { initials, fmtCurrency, fmtTime } from '@/lib/formatters';
import RatingDisplay from '@/components/RatingDisplay';

export const dynamic = 'force-dynamic';
const DAYS = { ml: ['ഞായർ', 'തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };

export async function generateMetadata(props) {
  const params = await props.params;
  const d = await getDoctorBySlug(params.slug);
  return { title: d ? d.display_name : 'Doctor' };
}

export default async function DoctorProfile(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const d = await getDoctorBySlug(params.slug);
  if (!d) notFound();
  const [avail, reviews] = await Promise.all([doctorAvailability(d.id), doctorReviews(d.id)]);
  const specialty = ml ? (d.specialty_ml || d.specialty_en) : d.specialty_en;
  const district = ml ? (d.district_ml || d.district_en) : d.district_en;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand/10 text-xl font-bold text-brand">
          {d.photo_url ? <img src={d.photo_url} alt="" className="h-full w-full object-cover" /> : initials(d.display_name)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{d.display_name}</h1>
            {d.verification_status === 'verified' && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">✓ {t(locale, 'verified')}</span>}
          </div>
          {specialty && <p className="text-brand">{specialty}</p>}
          <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-600">
            {district && <span>📍 {district}</span>}
            {d.years_experience != null && <span>{d.years_experience} {t(locale, 'experience')}</span>}
            {d.consultation_fee != null && <span className="font-semibold text-gray-800">{fmtCurrency(d.consultation_fee)}</span>}
          </div>
          <div className="mt-1"><RatingDisplay avg={d.rating_avg} count={d.rating_count} size="lg" /></div>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-bold text-gray-900">{ml ? 'ലഭ്യമായ സമയം' : 'Availability'}</h2>
        {avail.length === 0 ? <p className="text-sm text-gray-500">{ml ? 'സമയം ലഭ്യമല്ല' : 'No slots published'}</p> : (
          <ul className="space-y-1 text-sm text-gray-700">
            {avail.map((a, i) => <li key={i}>{DAYS[locale][a.day_of_week]} · {fmtTime(a.start_time)}–{fmtTime(a.end_time)} · {a.mode}</li>)}
          </ul>
        )}
        <a href={`/${locale}/doctors/${d.slug}#book`} className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{t(locale, 'book_now')}</a>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">{ml ? 'റിവ്യൂകൾ' : 'Reviews'}</h2>
        {reviews.length === 0 ? <p className="text-sm text-gray-500">{ml ? 'റിവ്യൂകളൊന്നുമില്ല' : 'No reviews yet'}</p> : (
          <ul className="space-y-2">
            {reviews.map((r, i) => (
              <li key={i} className="rounded-xl border border-gray-200 bg-white p-3">
                <RatingDisplay avg={r.rating} />
                {r.title && <p className="font-semibold text-gray-900">{r.title}</p>}
                <p className="text-sm text-gray-600">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
