import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Cost Breakdown' };
export default function Page() { return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Procedure Costs</h1><KList url="/api/procedures" titleKey="procedure_name" subKey="cost_range" hrefBase="/procedures/" /></div>; }
