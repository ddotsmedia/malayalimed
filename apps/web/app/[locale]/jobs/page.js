import { resolveLocale, t } from '@/lib/i18n';
import { listJobs } from '@/lib/jobs';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Jobs' };

export default async function JobsPage(props) {
  const params = await props.params;
  const sp = (await props.searchParams) || {};
  const locale = resolveLocale(params.locale);
  const jobs = await listJobs({ term: sp.q || '' });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">{t(locale, 'jobs')}</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <SearchBar locale={locale} action={`/${locale}/jobs`} defaultValue={sp.q || ''} />
      </div>
      {jobs.length === 0
        ? <EmptyState icon="💼" message={t(locale, 'no_results')} />
        : <div className="grid gap-3 sm:grid-cols-2">{jobs.map((j) => <JobCard key={j.id} job={j} />)}</div>}
    </div>
  );
}
