import { notFound } from 'next/navigation';
import { resolveLocale, t } from '@/lib/i18n';
import { getEye } from '@/lib/facilities';
import ClinicDetail from '@/components/facilities/ClinicDetail';

export const dynamic = 'force-dynamic';
export async function generateMetadata(props) { const p = await props.params; const f = await getEye(p.slug); return { title: f ? f.name_en : 'Eye hospital' }; }

export default async function EyeDetail(props) {
  const params = await props.params; const locale = resolveLocale(params.locale);
  const f = await getEye(params.slug); if (!f) notFound();
  return <ClinicDetail clinic={f} locale={locale} icon="👁️" disclaimer={t(locale, 'disclaimer')} />;
}
