import { faq } from '@/lib/support';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'FAQ' };
export default async function Page() {
  const items = await faq();
  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <h1 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h1>
      {items.map((f) => (
        <details key={f.id} className="rounded-2xl border border-gray-200 bg-white p-4">
          <summary className="cursor-pointer font-semibold text-gray-900">{f.question}</summary>
          <p className="mt-2 text-sm text-gray-600">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
