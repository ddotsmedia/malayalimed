import { resolveLocale } from '@/lib/i18n';
import { emergencyHospitals } from '@/lib/emergency';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Emergency' };

export default async function Page(props) {
  const { locale: l } = await props.params;
  const locale = resolveLocale(l);
  const hospitals = await emergencyHospitals();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-red-600 p-5 text-white">
        <h1 className="text-2xl font-black">Emergency</h1>
        <p className="mt-1">Call <a href="tel:112" className="underline">112</a> (emergency) · <a href="tel:108" className="underline">108</a> (ambulance) immediately.</p>
      </div>
      <h2 className="text-lg font-bold text-gray-900">24×7 Emergency Hospitals</h2>
      {hospitals.length === 0 ? <p className="text-sm text-gray-400">No 24×7 hospitals listed yet.</p> : (
        <div className="space-y-2">
          {hospitals.map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
              <div><a href={`/${locale}/hospitals/${h.slug}`} className="font-semibold text-gray-900">{h.name_en}</a><p className="text-xs text-gray-500">{h.district}</p></div>
              {h.phone && <a href={`tel:${h.phone}`} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Call</a>}
            </div>
          ))}
        </div>
      )}
      <a href={`/${locale}/urgent-care`} className="inline-block text-sm font-semibold text-brand">Find urgent care centres →</a>
    </div>
  );
}
