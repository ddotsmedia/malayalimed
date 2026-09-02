export const dynamic = 'force-dynamic';
export const metadata = { title: 'Generic vs Brand' };
export default function Page() {
  const rows = [['Active ingredient', 'Identical', 'Identical'], ['Regulatory approval', 'Same standards', 'Same standards'], ['Price', 'Lower', 'Higher'], ['Appearance/brand', 'Varies', 'Consistent'], ['Availability', 'Wide', 'Wide']];
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Generic vs Brand</h1>
      <p className="text-sm text-gray-600">Generic medicines contain the same active ingredient, strength, and quality standards as branded ones, usually at a lower price.</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Aspect</th><th className="px-3 py-2">Generic</th><th className="px-3 py-2">Brand</th></tr></thead><tbody className="divide-y divide-gray-100">{rows.map((r) => <tr key={r[0]}><td className="px-3 py-2 font-medium">{r[0]}</td><td className="px-3 py-2">{r[1]}</td><td className="px-3 py-2">{r[2]}</td></tr>)}</tbody></table></div>
    </div>
  );
}
