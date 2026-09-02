export const dynamic = 'force-dynamic';
export const metadata = { title: 'Patient Stories' };
export default function Page() {
  const stories = [['Cataract Surgery', 'Vision restored within a week — back to reading.'], ['Knee Arthroscopy', 'Walking pain-free after physiotherapy.'], ['Angioplasty', 'Chest pain resolved; resumed light exercise.']];
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Patient Stories</h1>
      <p className="text-xs text-gray-400">Illustrative outcomes — individual results vary. Not medical guarantees.</p>
      {stories.map((s) => <div key={s[0]} className="rounded-2xl border border-gray-200 bg-white p-4"><p className="font-semibold text-gray-900">{s[0]}</p><p className="text-sm text-gray-600">“{s[1]}”</p></div>)}
    </div>
  );
}
