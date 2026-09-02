export const dynamic = 'force-dynamic';
export const metadata = { title: 'Medical Glossary' };
export default function Page() {
  const terms = [['Acute', 'Sudden onset, short duration'], ['Chronic', 'Long-lasting or recurrent condition'], ['Benign', 'Not cancerous or harmful'], ['Malignant', 'Cancerous, can spread'], ['Prognosis', 'Likely course/outcome of a condition'], ['Contraindication', 'A reason not to use a treatment'], ['Idiopathic', 'Of unknown cause'], ['In vitro', 'In the lab (outside the body)'], ['Systemic', 'Affecting the whole body'], ['Prophylaxis', 'Preventive treatment']];
  return (
    <div className="mx-auto max-w-2xl space-y-3 px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">Medical Glossary</h1>
      {terms.map((t) => <div key={t[0]} className="rounded-2xl border border-gray-200 bg-white p-3"><p className="font-semibold text-gray-900">{t[0]}</p><p className="text-sm text-gray-600">{t[1]}</p></div>)}
    </div>
  );
}
