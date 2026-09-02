export const dynamic = 'force-dynamic';
export const metadata = { title: 'Specialist Articles' };
export default function Page() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Articles by Specialists</h1>
      <p className="text-sm text-gray-600">Expert-written health articles and news.</p>
      <div className="flex flex-wrap gap-3"><a href="/ml/news" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Read health news →</a><a href="/ml/wellness" className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Wellness topics</a></div>
    </div>
  );
}
