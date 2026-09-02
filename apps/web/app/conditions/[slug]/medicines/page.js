import KList from '@/components/knowledge/KList';
export const dynamic = 'force-dynamic';
export default async function Page(props) { const { slug } = await props.params; return <div className="mx-auto max-w-3xl space-y-4 px-4 py-6"><a href={`/conditions/${slug}`} className="text-sm text-brand">← Condition</a><h1 className="text-xl font-bold text-gray-900">Related Medicines</h1><KList url={`/api/conditions/${slug}/medicines`} titleKey="generic_name" subKey="typical_dosage" hrefBase="/medicines/" empty="No linked medicines recorded." /></div>; }
