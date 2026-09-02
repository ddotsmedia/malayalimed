import KSearch from '@/components/knowledge/KSearch';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Search Procedures' };
export default function Page() { return <div className="mx-auto max-w-2xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Search Procedures</h1><KSearch apiUrl="/api/procedures/search" titleKey="procedure_name" subKey="specialty" hrefBase="/procedures/" placeholder="Angiography, Colonoscopy…" /></div>; }
