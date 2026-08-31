import { resolveLocale, t } from '@/lib/i18n';
import JobSearchClient from './JobSearchClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Jobs' };

export default async function JobsPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">{t(locale, 'jobs')}</h1>
      <JobSearchClient />
    </div>
  );
}
