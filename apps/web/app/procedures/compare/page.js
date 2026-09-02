import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Compare Procedures' };
export default function Page() { return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Compare Procedures</h1><p className="text-sm text-gray-500">Open procedures in new tabs to compare duration, recovery, success rate, and cost.</p><KList url="/api/procedures" titleKey="procedure_name" subKey="specialty" hrefBase="/procedures/" /></div>; }
