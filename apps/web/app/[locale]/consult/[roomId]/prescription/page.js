import { resolveLocale } from '@/lib/i18n';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Prescription' };
export default async function Page(props) {
  const { locale: l, roomId } = await props.params;
  const locale = resolveLocale(l);
  return (
    <div className="mx-auto max-w-md space-y-4">
      <a href={`/${locale}/consult/${roomId}`} className="text-sm text-brand">← Back to consult</a>
      <h1 className="text-xl font-bold text-gray-900">Prescription Summary</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
        <p>Prescriptions issued during this consultation appear here.</p>
        <a href={`/${locale}/patient/prescriptions`} className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 font-semibold text-white">View my prescriptions</a>
      </div>
    </div>
  );
}
