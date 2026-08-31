import { listHospitalsAdmin } from '@/lib/admin';
import HospitalAdminTable from './HospitalAdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminHospitals() {
  const hospitals = await listHospitalsAdmin();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Hospitals</h1>
      <HospitalAdminTable hospitals={hospitals} />
    </div>
  );
}
