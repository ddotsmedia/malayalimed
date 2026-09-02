import KSearch from '@/components/knowledge/KSearch';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Search Medicines' };
export default function Page() {
  return <div className="mx-auto max-w-2xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Search Medicines</h1><KSearch apiUrl="/api/medicines/search" titleKey="generic_name" subKey="brand_names" hrefBase="/medicines/" placeholder="Paracetamol, Metformin…" /></div>;
}
