export const dynamic = 'force-dynamic';
export const metadata = { title: 'Trending' };
export default function Page() {
  const links = [['💊 Popular medicines', '/medicines'], ['🧪 Trending lab tests', '/lab-tests/trending'], ['🔬 Procedure success rates', '/procedures/success-rates'], ['🦠 Condition guides', '/conditions'], ['📊 Commonly abnormal results', '/lab-tests/trending-abnormal']];
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Trending in Health Knowledge</h1>
      <div className="grid gap-3 sm:grid-cols-2">{links.map(([l, h]) => <a key={h} href={h} className="rounded-2xl border border-gray-200 bg-white p-4 font-medium text-gray-800 hover:border-brand">{l}</a>)}</div>
    </div>
  );
}
