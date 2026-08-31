import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getDental } from '@/lib/facilities';
import ClinicDetail from '@/components/facilities/ClinicDetail';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const f = await getDental(p.slug); return { title: f ? f.name_en : 'Dental clinic' }; }

export default async function DentalDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale);
  const f = await getDental(params.slug); if (!f) notFound();
  return <ClinicDetail clinic={f} locale={locale} icon="🦷" disclaimer={t(locale, 'disclaimer')} />;
}
