export const dynamic = 'force-dynamic';
export const metadata = { title: 'Ask a Doctor' };
export default function Page() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Have questions about a procedure?</h1>
      <p className="text-sm text-gray-600">Get educational answers or connect with a specialist.</p>
      <div className="flex flex-wrap gap-3"><a href="/ml/ai-assistant" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">🤖 AI Assistant</a><a href="/ml/ask" className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Ask the community</a><a href="/ml/doctors" className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Find a specialist</a></div>
    </div>
  );
}
