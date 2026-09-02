import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health Conditions' };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Condition Guides</h1>
      <a href="/conditions/prevention" className="text-sm font-semibold text-brand">🛡 Prevention tips →</a>
      <KList url="/api/conditions" titleKey="condition_name" subKey="overview" hrefBase="/conditions/" idKey="slug" />
    </div>
  );
}
