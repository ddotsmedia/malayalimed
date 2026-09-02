export const dynamic = 'force-dynamic';
export default async function Page(props) {
  const { slug } = await props.params;
  return <div className="mx-auto max-w-2xl space-y-4 px-4 py-6"><a href={`/conditions/${slug}`} className="text-sm text-brand">← Condition</a><h1 className="text-xl font-bold text-gray-900">Support Group</h1><p className="text-sm text-gray-600">Connect with others managing the same condition.</p><a href="/ml/community" className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Join the community →</a></div>;
}
