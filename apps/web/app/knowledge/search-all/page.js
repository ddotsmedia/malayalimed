import KSearch from '@/components/knowledge/KSearch';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Search Everything' };
export default function Page() {
  return <div className="mx-auto max-w-2xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900">Search Health Knowledge</h1><p className="text-sm text-gray-500">Medicines, lab tests, procedures, and conditions.</p><KSearch apiUrl="/api/knowledge/search" titleKey="title" subKey="entity_type" placeholder="Search anything…" /></div>;
}
