import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export default async function Page(props) {
  const { name } = await props.params;
  return <div className="mx-auto max-w-4xl space-y-4 px-4 py-6"><h1 className="text-xl font-bold text-gray-900 capitalize">{decodeURIComponent(name)} Tests</h1><KList url={`/api/lab-tests/category/${name}`} titleKey="test_name" subKey="test_code" hrefBase="/lab-tests/" costKey="cost" /></div>;
}
