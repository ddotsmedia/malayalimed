import { notFound, redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import { getPrescription } from '@/lib/prescriptions';
import PrescriptionViewer from '@/components/prescriptions/PrescriptionViewer';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Prescription' };

export default async function PrescriptionDetail(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient/prescriptions/${params.id}`);
  const p = await getPrescription(params.id, session.userId);
  if (!p) notFound();

  return (
    <div className="space-y-4">
      <a href={`/${locale}/patient/prescriptions`} className="text-sm font-semibold text-brand">← Back</a>
      <h1 className="text-xl font-bold text-gray-900">Prescription</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
        <p className="text-gray-500">{String(p.created_at).slice(0, 10)} · {p.doctor_name || 'Self-uploaded'}</p>
        {p.prescription_text && <p className="mt-2 whitespace-pre-wrap text-gray-800">{p.prescription_text}</p>}
        {Array.isArray(p.medicines) && p.medicines.length > 0 && (
          <ul className="mt-2 list-disc pl-5 text-gray-700">{p.medicines.map((m, i) => <li key={i}>{m}</li>)}</ul>
        )}
      </div>
      <PrescriptionViewer fileUrl={p.file_url} fileName={p.file_name} />
    </div>
  );
}
