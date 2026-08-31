import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import MessageInbox from '@/components/messaging/MessageInbox';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Messages' };

export default async function Page(props) {
  const { locale: l } = await props.params;
  const locale = resolveLocale(l);
  if (!(await getSession())) redirect(`/${locale}/login?next=/${locale}/patient/messages`);
  return <div className="mx-auto max-w-2xl space-y-4"><h1 className="text-xl font-bold text-gray-900">Messages</h1><MessageInbox basePath={`/${locale}/patient/messages`} /></div>;
}
