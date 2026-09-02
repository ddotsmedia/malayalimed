import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export default async function Page(props) {
  const { condition } = await props.params;
  return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900 capitalize">Tests for {decodeURIComponent(condition).replace(/-/g, ' ')}</h1><KList url={`/api/lab-tests/by-condition/${condition}`} titleKey="test_name" subKey="category" hrefBase="/lab-tests/" costKey="cost" empty="No linked tests found for this condition." /></div>;
}
