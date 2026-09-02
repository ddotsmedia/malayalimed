export const dynamic = 'force-dynamic';
export default async function Page(props) {
  const { slug } = await props.params;
  return <div className="mx-auto max-w-2xl space-y-4 px-4 py-6"><a href={`/conditions/${slug}`} className="text-sm text-brand">← Condition</a><h1 className="text-xl font-bold text-gray-900">Talk to a Doctor</h1><p className="text-sm text-gray-600">Get educational answers about this condition.</p><div className="flex flex-wrap gap-3"><a href="/ml/ai-assistant" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">🤖 AI Assistant</a><a href="/ml/doctors" className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Find a doctor</a></div></div>;
}
