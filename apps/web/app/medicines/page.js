import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Medicines' };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Medicine Library</h1>
      <div className="flex flex-wrap gap-3 text-sm"><a href="/medicines/search" className="font-semibold text-brand">🔎 Search</a><a href="/medicines/categories" className="font-semibold text-brand">📂 By form</a><a href="/medicines/calculator" className="font-semibold text-brand">🧮 Dosage calculator</a><a href="/medicines/side-effects-tracker" className="font-semibold text-brand">📝 Side-effect tracker</a></div>
      <KList url="/api/medicines" titleKey="generic_name" subKey="form" hrefBase="/medicines/" />
    </div>
  );
}
