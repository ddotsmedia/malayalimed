import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import MedicalHistoryClient from './MedicalHistoryClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Medical History' };

export default async function MedicalHistoryPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/medical-history`);
  return <div className="mx-auto max-w-2xl space-y-4"><h1 className="text-xl font-bold text-gray-900">Medical History</h1><MedicalHistoryClient /></div>;
}
