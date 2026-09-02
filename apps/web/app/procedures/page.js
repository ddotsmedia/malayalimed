import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Procedures' };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Procedure Library</h1>
      <div className="flex flex-wrap gap-3 text-sm"><a href="/procedures/search" className="font-semibold text-brand">🔎 Search</a><a href="/procedures/success-rates" className="font-semibold text-brand">📈 Success rates</a><a href="/procedures/minimally-invasive" className="font-semibold text-brand">🩹 Minimally invasive</a><a href="/procedures/cost-breakdown" className="font-semibold text-brand">💰 Cost</a><a href="/procedures/ask-doctor" className="font-semibold text-brand">🤖 Ask a doctor</a></div>
      <KList url="/api/procedures" titleKey="procedure_name" subKey="specialty" hrefBase="/procedures/" />
    </div>
  );
}
