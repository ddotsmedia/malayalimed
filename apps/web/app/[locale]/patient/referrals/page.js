import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import ReferralClient from './ReferralClient';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Referrals' };
export default async function Page(props) {
  const { locale: l } = await props.params;
  const locale = resolveLocale(l);
  if (!(await getSession())) redirect(`/${locale}/login?next=/${locale}/patient/referrals`);
  return <div className="mx-auto max-w-lg space-y-4"><h1 className="text-xl font-bold text-gray-900">Refer & Earn</h1><ReferralClient /></div>;
}
