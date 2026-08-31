import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import { listRecords } from '@/lib/healthRecords';
import { fmtDate } from '@/lib/formatters';
import EmptyState from '@/components/EmptyState';
import RecordForm from './RecordForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Health Records' };

const ICON = { prescription: '💊', lab_report: '🧪', imaging: '🩻', vaccination: '💉', allergy: '⚠️', medication: '💊', condition: '📋', surgery: '🏥', note: '📝' };

export default async function HealthRecords(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const s = await getSession();
  if (!s) redirect(`/${locale}`);
  const records = await listRecords(s.userId);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-xl font-bold text-slate-900">{ml ? 'എന്റെ ആരോഗ്യ രേഖകൾ' : 'My health records'}</h1>
      <RecordForm locale={locale} />
      {records.length === 0 ? <EmptyState icon="📁" message={ml ? 'രേഖകളൊന്നുമില്ല' : 'No records yet'} /> : (
        <ul className="space-y-2">
          {records.map((r) => (
            <li key={r.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="text-2xl">{ICON[r.record_type] || '📄'}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{r.title}</p>
                <p className="text-xs text-slate-500">{r.record_type.replace('_', ' ')}{r.record_date ? ` · ${fmtDate(r.record_date)}` : ''}{r.doctor_name ? ` · ${r.doctor_name}` : ''}{r.hospital_name ? ` · ${r.hospital_name}` : ''}</p>
                {r.description && <p className="mt-1 text-sm text-slate-600">{r.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
