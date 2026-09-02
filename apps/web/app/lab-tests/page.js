import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Lab Tests' };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Lab Test Library</h1>
      <div className="flex flex-wrap gap-3 text-sm"><a href="/lab-tests/search" className="font-semibold text-brand">🔎 Search</a><a href="/lab-tests/understand-results" className="font-semibold text-brand">📊 Understand results</a><a href="/lab-tests/at-home" className="font-semibold text-brand">🏠 At-home</a><a href="/lab-tests/cost-compare" className="font-semibold text-brand">💰 Cost compare</a><a href="/lab-tests/fasting-needed" className="font-semibold text-brand">⏱ Fasting</a></div>
      <KList url="/api/lab-tests" titleKey="test_name" subKey="category" hrefBase="/lab-tests/" costKey="cost" />
    </div>
  );
}
