import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import PrescriptionsClient from './PrescriptionsClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Prescriptions' };

export default async function PrescriptionsPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/prescriptions`);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Prescriptions</h1>
      <PrescriptionsClient locale={locale} />
    </div>
  );
}
