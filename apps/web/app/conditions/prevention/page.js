export const dynamic = 'force-dynamic';
export const metadata = { title: 'Prevention' };
export default function Page() {
  const tips = ['Eat a balanced diet rich in vegetables and fibre', 'Exercise at least 30 minutes most days', 'Avoid tobacco and limit alcohol', 'Get regular health screenings', 'Manage stress and sleep 7–8 hours', 'Keep vaccinations up to date'];
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Prevention Tips</h1>
      <ul className="space-y-2">{tips.map((t) => <li key={t} className="rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-700">✅ {t}</li>)}</ul>
    </div>
  );
}
