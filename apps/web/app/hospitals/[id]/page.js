import { getHosp, getHospDepts, getHospServices, getHospFacilities, getBedAvailability, getHospStaff, getHospReviews } from '@/lib/hospitals';
import HospDetail from '@/components/hospitals/HospDetail';
import HospReviewForm from '@/components/hospitals/HospReviewForm';
import HospBookmark from '@/components/hospitals/HospBookmark';

export async function generateMetadata({ params }) {
  const hosp = await getHosp(params.id);
  return {
    title: hosp?.name_en || 'Hospital',
    description: hosp?.name_ml || 'Hospital profile',
  };
}

export default async function HospPage({ params }) {
  const [hosp, depts, services, facilities, beds, staff, reviews] = await Promise.all([
    getHosp(params.id),
    getHospDepts(params.id),
    getHospServices(params.id),
    getHospFacilities(params.id),
    getBedAvailability(params.id),
    getHospStaff(params.id),
    getHospReviews(params.id, 10),
  ]);

  if (!hosp) {
    return <div className="text-center py-20">Hospital not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <HospDetail hosp={hosp} depts={depts} services={services} facilities={facilities} beds={beds} staff={staff} reviews={reviews} />
          </div>
          <HospBookmark hospId={hosp.id} />
        </div>
        <HospReviewForm hospId={hosp.id} />
      </div>
    </div>
  );
}
