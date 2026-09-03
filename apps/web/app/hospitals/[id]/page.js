import { getHosp, getHospDepts, getHospServices, getHospFacilities, getBedAvailability, getHospStaff } from '@/lib/hospitals';
import HospDetail from '@/components/hospitals/HospDetail';

export async function generateMetadata({ params }) {
  const hosp = await getHosp(params.id);
  return {
    title: hosp?.name_en || 'Hospital',
    description: hosp?.name_ml || 'Hospital profile',
  };
}

export default async function HospPage({ params }) {
  const [hosp, depts, services, facilities, beds, staff] = await Promise.all([
    getHosp(params.id),
    getHospDepts(params.id),
    getHospServices(params.id),
    getHospFacilities(params.id),
    getBedAvailability(params.id),
    getHospStaff(params.id),
  ]);

  if (!hosp) {
    return <div className="text-center py-20">Hospital not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4">
        <HospDetail hosp={hosp} depts={depts} services={services} facilities={facilities} beds={beds} staff={staff} />
      </div>
    </div>
  );
}
