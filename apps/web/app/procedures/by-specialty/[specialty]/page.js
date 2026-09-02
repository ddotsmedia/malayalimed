import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export default async function Page(props) {
  const { specialty } = await props.params;
  return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900 capitalize">{decodeURIComponent(specialty)} Procedures</h1><KList url={`/api/procedures/by-specialty/${specialty}`} titleKey="procedure_name" subKey="cost_range" hrefBase="/procedures/" /></div>;
}
