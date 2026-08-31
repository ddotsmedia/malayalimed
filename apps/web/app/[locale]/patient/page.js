import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n';
import { getSession } from '@/lib/session';
import { listForPatient } from '@/lib/appointments';
import { listRecords } from '@/lib/healthRecords';
import { one } from '@mm/db';
import PatientDashboard from './PatientDashboard';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'My Dashboard' };
}

export default async function PatientHome(props) {
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

      <PatientDashboard locale={locale} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card href={`/${locale}/appointments`} label={ml ? 'അപ്പോയിന്റ്‌മെന്റുകൾ' : 'Appointments'} value={appts.length} />
        <Card href={`/${locale}/patient/health-records`} label={ml ? 'ഹെൽത്ത് റെക്കോർഡുകൾ' : 'Health Records'} value={records.length} />
        <Card href={`/${locale}/patient/feed`} label={ml ? 'ഹെൽത്ത് ഫീഡ്' : 'Health Feed'} value="→" />
        <Card href={`/${locale}/ai-assistant`} label={ml ? 'AI അസിസ്റ്റന്റ്' : 'AI Assistant'} value="→" />
        <Card href={`/${locale}/patient/health-tracker`} label={ml ? 'ഹെൽത്ത് ട്രാക്കർ' : 'Health Tracker'} value="→" />
        <Card href={`/${locale}/patient/prescriptions`} label={ml ? 'കുറിപ്പടികൾ' : 'Prescriptions'} value="→" />
        <Card href={`/${locale}/symptom-checker`} label={ml ? 'സിംപ്റ്റം ചെക്കർ' : 'Symptom Checker'} value="→" />
        <Card href={`/${locale}/patient/achievements`} label={ml ? 'അച്ചീവ്‌മെന്റുകൾ' : 'Achievements'} value="→" />
        <Card href={`/${locale}/patient/settings/notifications`} label={ml ? 'റിമൈൻഡർ ക്രമീകരണം' : 'Reminders'} value="→" />
      </div>
    </div>
  );
}
