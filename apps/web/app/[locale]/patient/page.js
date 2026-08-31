import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import { listForPatient } from '@/lib/appointments';
import { listRecords } from '@/lib/healthRecords';
import { one } from '@mm/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'My Dashboard' };
}

export default async function PatientDashboard(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const ml = locale === 'ml';
  const session = await getSession();
  if (!session) redirect(`/${locale}/login?next=/${locale}/patient`);

  const [user, appts, records] = await Promise.all([
    one('SELECT full_name, email, phone FROM users WHERE id=$1', [session.userId]),
    listForPatient(session.userId),
    listRecords(session.userId),
  ]);

  const Card = ({ href, label, value }) => (
    <a href={href} className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-brand">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </a>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{ml ? 'നമസ്കാരം' : 'Welcome'}, {user?.full_name || (ml ? 'രോഗി' : 'Patient')}</h1>
        <p className="text-sm text-gray-600">{user?.phone || user?.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card href={`/${locale}/appointments`} label={ml ? 'അപ്പോയിന്റ്‌മെന്റുകൾ' : 'Appointments'} value={appts.length} />
        <Card href={`/${locale}/patient/health-records`} label={ml ? 'ഹെൽത്ത് റെക്കോർഡുകൾ' : 'Health Records'} value={records.length} />
        <Card href={`/${locale}/ask`} label={ml ? 'ചോദ്യങ്ങൾ' : 'Ask a Doctor'} value="→" />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-bold text-gray-900">{ml ? 'സമീപകാല അപ്പോയിന്റ്‌മെന്റുകൾ' : 'Recent Appointments'}</h2>
        {appts.length === 0 ? <p className="text-sm text-gray-500">{ml ? 'ഒന്നുമില്ല' : 'None yet'}</p> : (
          <ul className="space-y-2 text-sm text-gray-700">
            {appts.slice(0, 5).map((a) => (
              <li key={a.id} className="flex justify-between border-b border-gray-100 pb-1">
                <span>{a.doctor_name || a.doctor_display_name || '—'}</span>
                <span className="text-gray-500">{a.slot_date} · {a.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
