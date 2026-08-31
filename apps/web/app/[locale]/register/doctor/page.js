import { resolveLocale } from '@/lib/i18n';
import { listSpecialties, listDistricts } from '@/lib/reference';
import DoctorRegForm from './DoctorRegForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Doctor Registration' };

export default async function DoctorRegisterPage(props) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const [specialties, districts] = await Promise.all([listSpecialties(), listDistricts()]);
  return (
    <div className="space-y-4">
      <h1 className="text-center text-xl font-bold text-gray-900">Doctor Registration</h1>
      <p className="text-center text-sm text-gray-500">Join MalayaliMed — profiles go live after NMC verification.</p>
      <DoctorRegForm locale={locale} specialties={specialties} districts={districts} />
    </div>
  );
}
