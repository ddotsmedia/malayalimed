export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health Insights' };
export default function Page() {
  const insights = [['Vitamin D deficiency', 'Common in urban Kerala — screen if fatigued'], ['HbA1c rising', 'Pre-diabetes trend in 35+ age group'], ['Thyroid (TSH)', 'Frequently abnormal in women 30–50'], ['Lipid profile', 'Cholesterol screening advised from age 30']];
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Commonly Abnormal Results</h1>
      <p className="text-xs text-gray-400">General educational insights, not personalized advice.</p>
      {insights.map((i) => <div key={i[0]} className="rounded-2xl border border-gray-200 bg-white p-4"><p className="font-semibold text-gray-900">{i[0]}</p><p className="text-sm text-gray-600">{i[1]}</p></div>)}
    </div>
  );
}
