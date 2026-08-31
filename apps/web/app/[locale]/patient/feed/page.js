import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import ContentFeed from '@/components/feed/ContentFeed';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health Feed' };

export default async function FeedPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/feed`);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Health Feed</h1>
      <ContentFeed locale={locale} />
    </div>
  );
}
